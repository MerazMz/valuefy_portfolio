import { useEffect, useState } from "react";
import axios from "axios";
import { formatCurrency } from "../lib/formatters";

export default function Holdings() {
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5000/holdings")
      .then(res => {
        setHoldings(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching holdings:", err);
        setLoading(false);
      });
  }, []);

  const totalValue = holdings.reduce((acc, h) => acc + h.current_value, 0);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      <p className="text-slate-400">Loading holdings...</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-6">Current Holdings</h1>
      </div>

      <div className="glass-card flex flex-col justify-center gap-1 p-8 mb-8">
        <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">Total Portfolio Value</span>
        <span className="text-4xl font-bold text-white tracking-tight">{formatCurrency(totalValue)}</span>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/50">
              <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Fund Name</th>
              <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Current Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {holdings.map(h => (
              <tr key={h.holding_id} className="hover:bg-slate-800/20 transition-colors">
                <td className="p-4 font-medium text-slate-200">{h.fund_name}</td>
                <td className="p-4 font-mono text-right text-slate-300">{formatCurrency(h.current_value)}</td>
              </tr>
            ))}
            {holdings.length === 0 && (
              <tr>
                <td colSpan={2} className="p-8 text-center text-slate-500">No holdings found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
