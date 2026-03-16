import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Save, RefreshCw } from "lucide-react";
import API_URL from "../lib/api";

export default function EditModel() {
  const navigate = useNavigate();
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMSG, setErrorMSG] = useState("");
  const [successMSG, setSuccessMSG] = useState("");

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = () => {
    axios.get(`${API_URL}/model`)
      .then(res => {
        setModels(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching models:", err);
        setLoading(false);
      });
  };

  const handleAllocationChange = (id, newPct) => {
    const val = parseFloat(newPct) || 0;
    setModels(prev => prev.map(m => m.fund_id === id ? { ...m, allocation_pct: val } : m));
    setErrorMSG("");
    setSuccessMSG("");
  };

  const totalAllocation = models.reduce((acc, curr) => acc + Number(curr.allocation_pct), 0);
  const isValid = Math.abs(totalAllocation - 100) < 0.01;

  const handleSave = (andRecalculate = false) => {
    if (!isValid) {
      setErrorMSG(`Total allocation must equal 100%. Currently ${totalAllocation.toFixed(2)}%`);
      return;
    }

    setSaving(true);
    axios.post(`${API_URL}/model`, { updates: models })
      .then(() => {
        setSaving(false);
        setErrorMSG("");
        if (andRecalculate) {
          // Navigate to the portfolio screen so the user sees the new BUY/SELL numbers
          navigate("/");
        } else {
          setSuccessMSG("Model portfolio updated successfully!");
        }
      })
      .catch(err => {
        console.error(err);
        setErrorMSG(err.response?.data?.error || "Failed to update model");
        setSaving(false);
      });
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      <p className="text-slate-400">Loading model portfolio...</p>
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Edit Model Portfolio</h1>
      <p className="text-slate-400 mb-8">Adjust the target allocation percentages for your portfolio. The sum must exactly equal 100%.</p>

      {errorMSG && (
        <div className="p-4 mb-6 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-medium">
          {errorMSG}
        </div>
      )}

      {successMSG && (
        <div className="p-4 mb-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
          {successMSG}
        </div>
      )}

      <div className="glass-card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/50">
              <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Fund Name</th>
              <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Asset Class</th>
              <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Target Allocation (%)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {models.map(m => (
              <tr key={m.fund_id} className="hover:bg-slate-800/10 transition-colors">
                <td className="p-4 font-medium text-slate-200">{m.fund_name}</td>
                <td className="p-4 text-sm text-slate-400">{m.asset_class}</td>
                <td className="p-4 text-right">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={m.allocation_pct}
                    onChange={(e) => handleAllocationChange(m.fund_id, e.target.value)}
                    className={`w-24 px-3 py-1.5 bg-slate-950 border rounded text-right font-mono transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500
                      ${!isValid ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500' : 'border-slate-700/50'}`}
                  />
                </td>
              </tr>
            ))}
            
            <tr className="bg-slate-900/50">
              <td colSpan={2} className="p-4 text-right font-medium text-slate-400 uppercase text-xs tracking-wider">
                Total Allocation
              </td>
              <td className={`p-4 text-right font-mono font-bold text-lg ${isValid ? 'text-emerald-400' : 'text-rose-400'}`}>
                {totalAllocation.toFixed(2)}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          onClick={() => handleSave(false)}
          disabled={!isValid || saving}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all
            ${!isValid
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-slate-700 hover:bg-slate-600 text-white'}`}
        >
          <Save className="w-4 h-4" />
          Save Plan
        </button>
        <button
          onClick={() => handleSave(true)}
          disabled={!isValid || saving}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all shadow-lg
            ${!isValid
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/20'}`}
        >
          {saving ? (
            <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          {saving ? 'Saving...' : 'Save & Recalculate'}
        </button>
      </div>
    </div>
  );
}
