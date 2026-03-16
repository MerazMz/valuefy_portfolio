import { useEffect, useState } from "react";
import axios from "axios";
import { formatCurrency } from "../lib/formatters";
import { Save } from "lucide-react";
import API_URL from "../lib/api";

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMSG, setSuccessMSG] = useState("");
  const [errorMSG, setErrorMSG] = useState("");

  useEffect(() => {
    fetchRebalance();
  }, []);

  const fetchRebalance = () => {
    setLoading(true);
    axios.get(`${API_URL}/rebalance`)
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  };

  const handleSave = () => {
    setSaving(true);
    setErrorMSG("");
    setSuccessMSG("");

    const payload = {
      portfolio_value: data.portfolio_value,
      total_buy: data.total_buy,
      total_sell: data.total_sell,
      fresh_money_needed: data.fresh_money_needed,
      items: data.items.map(f => ({
        fund_id: f.fund_id,
        fund_name: f.fund_name,
        action: f.action || 'REVIEW',
        amount: f.amount,
        current_pct: f.current_pct || 0,
        target_pct: f.target_pct || 0,
        // Model funds reach their target %; non-model (REVIEW) funds stay at current %
        post_rebalance_pct: (f.is_model_fund === 1 || f.is_model_fund === true)
          ? (f.target_pct || 0)
          : (f.current_pct || 0),
        // Use the actual is_model_fund flag from backend data
        is_model_fund: f.is_model_fund ?? 0
      }))
    };

    axios.post(`${API_URL}/save`, payload)
      .then(() => {
        setSuccessMSG("Recommendation saved successfully!");
        setSaving(false);
      })
      .catch(err => {
        console.error(err);
        setErrorMSG("Failed to save recommendation.");
        setSaving(false);
      });
  };

  if (loading || !data) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      <p className="text-slate-400">Analyzing Portfolio...</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Portfolio Rebalancing
        </h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-all shadow-lg disabled:opacity-50 disabled:pointer-events-none"
        >
          {saving ? (
            <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? 'Saving...' : 'Save Recommendation'}
        </button>
      </div>

      {successMSG && (
        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
          ✓ {successMSG}
        </div>
      )}

      {errorMSG && (
        <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-medium">
          ✗ {errorMSG}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card flex flex-col justify-center gap-1 p-6 relative overflow-hidden group">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-l" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">Total Buy</span>
          <span className="text-3xl font-bold text-white tracking-tight pl-2 group-hover:text-emerald-400 transition-colors">
            {formatCurrency(data.total_buy)}
          </span>
        </div>
        <div className="glass-card flex flex-col justify-center gap-1 p-6 relative overflow-hidden group">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500 rounded-l" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">Total Sell</span>
          <span className="text-3xl font-bold text-white tracking-tight pl-2 group-hover:text-rose-400 transition-colors">
            {formatCurrency(data.total_sell)}
          </span>
        </div>
        <div className="glass-card flex flex-col justify-center gap-1 p-6 relative overflow-hidden group">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 rounded-l" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">Fresh Money Needed</span>
          <span className="text-3xl font-bold text-white tracking-tight pl-2 group-hover:text-amber-400 transition-colors">
            {formatCurrency(data.fresh_money_needed)}
          </span>
        </div>
      </div>

      {/* Recommendations Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-5 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white m-0">Recommended Actions</h2>
            <p className="text-slate-500 text-xs mt-1">Portfolio Value: {formatCurrency(data.portfolio_value)}</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Fund</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Plan %</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Today %</th>
                <th className="p-4 text-xs font-semibold text-violet-400 uppercase tracking-wider text-right">Drift</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">Action</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {data.items.map(f => {
                const isModelFund = f.is_model_fund === 1 || f.is_model_fund === true;
                const isBuy = f.action === 'BUY';
                const isSell = f.action === 'SELL';
                const isReview = f.action === 'REVIEW';

                const actionColor = isBuy
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : isSell
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'; // REVIEW = amber

                const currentPct = f.current_pct || 0;
                const targetPct = f.target_pct;

                // Only compute drift for model funds; show dash for REVIEW funds
                const drift = isModelFund ? ((targetPct || 0) - currentPct) : null;
                const driftColor = drift === null ? 'text-slate-600'
                  : drift > 0 ? 'text-emerald-400'
                  : drift < 0 ? 'text-rose-400'
                  : 'text-slate-400';
                const driftText = drift === null ? '—'
                  : `${drift > 0 ? '+' : ''}${drift.toFixed(1)}%`;

                return (
                  <tr key={f.fund_id} className={`hover:bg-slate-800/20 transition-colors ${isReview ? 'bg-amber-900/5' : ''}`}>
                    <td className="p-4 font-medium text-slate-200">
                      <span>{f.fund_name}</span>
                      {isReview && (
                        <span className="ml-2 text-[9px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded uppercase tracking-wider">
                          Not In Plan
                        </span>
                      )}
                    </td>
                    {/* Plan % */}
                    <td className="p-4 font-mono text-right text-slate-300">
                      {isModelFund ? `${targetPct}%` : <span className="text-slate-600">—</span>}
                    </td>
                    {/* Today % */}
                    <td className="p-4 font-mono text-right text-slate-400">{currentPct.toFixed(2)}%</td>
                    {/* Drift */}
                    <td className={`p-4 font-mono text-right font-medium ${driftColor}`}>
                      {driftText}
                    </td>
                    {/* Action Badge */}
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase border ${actionColor}`}>
                        {f.action}
                      </span>
                    </td>
                    {/* Amount */}
                    <td className="p-4 font-mono text-right text-white font-medium">
                      {formatCurrency(f.amount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}