import { useEffect, useState } from "react";
import axios from "axios";
import { formatCurrency, formatDate } from "../lib/formatters";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5000/history")
      .then(res => {
        setHistory(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching history:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      <p className="text-slate-400">Loading history...</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-bold tracking-tight text-white mb-6">Rebalance History</h1>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50">
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Portfolio Value</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right text-emerald-400/80">Total Buy</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right text-rose-400/80">Total Sell</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right text-amber-400/80">Fresh Money</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {history.map(s => {
                const statusColor = s.status === 'APPLIED' 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : s.status === 'DISMISSED'
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'; // PENDING

                return (
                  <tr key={s.session_id} className="hover:bg-slate-800/20 transition-colors group">
                    <td className="p-4 font-medium text-slate-200">{formatDate(s.created_at)}</td>
                    <td className="p-4 font-mono text-right text-slate-300">{formatCurrency(s.portfolio_value)}</td>
                    <td className="p-4 font-mono text-right text-emerald-400 group-hover:text-emerald-300 transition-colors">
                      {formatCurrency(s.total_to_buy)}
                    </td>
                    <td className="p-4 font-mono text-right text-rose-400 group-hover:text-rose-300 transition-colors">
                      {formatCurrency(s.total_to_sell)}
                    </td>
                    <td className="p-4 font-mono text-right text-amber-500 group-hover:text-amber-400 transition-colors">
                      {formatCurrency(s.net_cash_needed)}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase ${statusColor}`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {history.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">No rebalance history found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
