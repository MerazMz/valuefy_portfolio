import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/index';
import Holdings from './pages/holdings';
import History from './pages/history';
import EditModel from './pages/edit-model';
import { LayoutDashboard, Wallet, History as HistoryIcon, Settings2 } from 'lucide-react';
import './App.css';

function Navbar() {
  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium text-sm ${isActive
      ? 'bg-indigo-500/10 text-indigo-400'
      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
    }`;

  return (
    <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur top-0 sticky z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-white">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white">
            V
          </div>
          Valuefy
        </div>

        <div className="flex items-center gap-2">
          <NavLink to="/" className={navLinkClass}>
            <LayoutDashboard className="w-4 h-4" /> Portfolio
          </NavLink>
          <NavLink to="/holdings" className={navLinkClass}>
            <Wallet className="w-4 h-4" /> Holdings
          </NavLink>
          <NavLink to="/history" className={navLinkClass}>
            <HistoryIcon className="w-4 h-4" /> History
          </NavLink>
          <NavLink to="/edit-model" className={navLinkClass}>
            <Settings2 className="w-4 h-4" /> Edit Plan
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/holdings" element={<Holdings />} />
            <Route path="/history" element={<History />} />
            <Route path="/edit-model" element={<EditModel />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
