import React, { useState, useEffect } from 'react';
import { initialTransactions, chartData } from './mockData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Shield, User, Search, PieChart, X, Edit2, ArrowUpRight, ArrowDownRight, Trash2, BotMessageSquare, Sun, Moon, Sparkles, Download } from 'lucide-react';
import './App.css';

const ZorvynLogo = ({ className }) => (
  <svg viewBox="0 0 360 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(0, 15) rotate(-12, 36, 50)">
      <path d="M72 32.5C72 32.5 50.5 45 28.5 45C6.5 45 0 32.5 0 32.5C0 32.5 13 41.5 28.5 41.5C44 41.5 72 32.5 72 32.5Z" fill="currentColor"/>
      <path d="M0 67.5C0 67.5 21.5 55 43.5 55C65.5 55 72 67.5 72 67.5C72 67.5 59 58.5 43.5 58.5C28 58.5 0 67.5 0 67.5Z" fill="currentColor" fillOpacity="0.6"/>
    </g>
    <text x="80" y="65" fontFamily="Inter, sans-serif" fontWeight="900" fontSize="58" letterSpacing="-2.5" fill="currentColor">zorvyn</text>
    <text x="228" y="78" fontFamily="Inter, sans-serif" fontWeight="500" fontSize="18" fill="currentColor">fintech</text>
  </svg>
);

function App() {
  // Changed default to 'light'
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [role, setRole] = useState('Admin');
  const [userName, setUserName] = useState('Deepthi Pradeep');
  const [isEditingName, setIsEditingName] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('zorvyn_final_v19');
    return saved ? JSON.parse(saved) : initialTransactions;
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempTx, setTempTx] = useState({ id: null, description: '', amount: '', category: 'Misc', type: 'expense' });

  useEffect(() => {
    const root = window.document.documentElement;
    theme === 'dark' ? root.classList.add('dark') : root.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('zorvyn_final_v19', JSON.stringify(transactions));
  }, [transactions]);

  const handleSave = () => {
    if (!tempTx.description || !tempTx.amount) return;
    const newEntry = { 
      ...tempTx, 
      id: tempTx.id || Date.now(), 
      date: new Date().toISOString().split('T')[0], 
      amount: Math.abs(Number(tempTx.amount)) 
    };
    setTransactions(tempTx.id ? transactions.map(t => t.id === tempTx.id ? newEntry : t) : [newEntry, ...transactions]);
    setIsModalOpen(false);
  };

  const exportToCSV = () => {
    const headers = "Description,Amount,Type,Date\n";
    const rows = transactions.map(t => `${t.description},${t.amount},${t.type},${t.date}`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'zorvyn_ledger.csv';
    a.click();
  };

  const incomeTotal = transactions.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0);
  const expenseTotal = transactions.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row w-full overflow-x-hidden">
      <aside className="w-full lg:w-80 bg-[var(--bg-sidebar)] border-r-2 border-[var(--border-color)] p-10 flex flex-col shrink-0 z-20 animate-slide-left">
        <div className="flex items-center gap-4 mb-12">
          <ZorvynLogo className="w-full max-w-[180px] h-auto text-[var(--text-main)] hover:scale-105 transition-transform" />
        </div>

        <nav className="space-y-4 flex-1">
          <div className="flex items-center gap-4 px-5 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-blue-500/30">
            <PieChart size={18}/> Dashboard
          </div>
          <div className="pt-8 mt-8 border-t-2 border-[var(--border-color)] space-y-2">
            <button onClick={() => setRole('Admin')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl text-xs font-black transition-all ${role === 'Admin' ? 'bg-blue-600/10 text-blue-500 border-2 border-blue-500/20' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'}`}>
              <Shield size={18}/> Admin Mode
            </button>
            <button onClick={() => setRole('Viewer')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl text-xs font-black transition-all ${role === 'Viewer' ? 'bg-blue-600/10 text-blue-500 border-2 border-blue-500/20' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'}`}>
              <User size={18}/> Viewer Mode
            </button>
          </div>
          <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="w-full flex items-center justify-between px-5 py-5 mt-8 text-[var(--text-main)] border-2 border-[var(--text-main)] rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[var(--text-main)] hover:text-[var(--bg-main)] transition-all">
            <span>{theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}</span>
            {theme === 'light' ? <Moon size={18}/> : <Sun size={18}/>}
          </button>
        </nav>

        <div className="pt-8 border-t-2 border-[var(--border-color)] flex items-center gap-4">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-slate-800 to-black flex items-center justify-center text-white font-black border-2 border-white/10 shadow-lg text-lg">
            {userName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsEditingName(true)}>
              {isEditingName ? (
                <input autoFocus className="bg-transparent text-[var(--text-main)] text-sm outline-none w-full font-black border-b-2 border-blue-500" value={userName} onChange={(e) => setUserName(e.target.value)} onBlur={() => setIsEditingName(false)} />
              ) : (
                <p className="text-base font-black text-[var(--text-main)] truncate">{userName}</p>
              )}
            </div>
            <p className="text-[11px] text-blue-500 font-black uppercase tracking-widest">{role} Account</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-6 lg:p-12 bg-[var(--bg-main)] overflow-y-auto w-full max-w-none">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 animate-slide-up">
          <div>
            <h2 className="text-5xl font-black text-[var(--text-main)] tracking-tighter italic">Ledger Dashboard</h2>
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-500">Secure Internal Finance Portal</p>
          </div>
          <div className="flex gap-4">
            <button onClick={exportToCSV} className="bg-emerald-600 text-white px-8 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-emerald-700 transition-all active:scale-95 flex items-center gap-2">
              <Download size={16}/> Export CSV
            </button>
            {role === 'Admin' && (
              <button onClick={() => { setTempTx({ id: null, description: '', amount: '', category: 'Misc', type: 'expense' }); setIsModalOpen(true); }} className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
                + Add Entry
              </button>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12 w-full">
          <div className="glass-panel p-10 animate-slide-up delay-1">
            <p className="text-[11px] font-black text-slate-500 uppercase mb-3 tracking-widest">Net Capital</p>
            <h3 className="text-5xl font-black tracking-tighter net-capital-value">₹{(incomeTotal - expenseTotal).toLocaleString()}</h3>
          </div>
          <div className="glass-panel p-10 animate-slide-up delay-2">
            <div className="flex justify-between mb-3"><p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Inflow</p><ArrowUpRight size={24} className="text-income animate-bounce"/></div>
            <h3 className="text-5xl font-black text-income tracking-tighter">₹{incomeTotal.toLocaleString()}</h3>
          </div>
          <div className="glass-panel p-10 animate-slide-up delay-3">
            <div className="flex justify-between mb-3"><p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Outflow</p><ArrowDownRight size={24} className="text-expense animate-bounce"/></div>
            <h3 className="text-5xl font-black text-expense tracking-tighter">₹{expenseTotal.toLocaleString()}</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12 w-full">
          <div className="lg:col-span-2 glass-panel p-10 animate-slide-up delay-2">
            <h4 className="font-black text-xs uppercase tracking-widest mb-10 text-[var(--text-main)] border-l-4 border-blue-600 pl-5">Weekly Cashflow Matrix</h4>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} fontWeight="bold" />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} fontWeight="bold" />
                  <Tooltip cursor={{fill: 'rgba(59,130,246,0.05)'}} contentStyle={{background: 'var(--bg-card)', border: '2px solid var(--border-color)', borderRadius: '16px'}} />
                  <Bar dataKey="income" name="Income" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="expense" name="Expense" fill="#f87171" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-panel p-10 flex flex-col animate-slide-up delay-3">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-10 shadow-xl shadow-blue-600/40 animate-pulse">
              <BotMessageSquare size={32} />
            </div>
            <h4 className="text-3xl font-black text-[var(--text-main)] mb-5 tracking-tighter">Zorvyn Insight</h4>
            <p className="text-lg font-bold text-slate-400 italic leading-relaxed">
              "Your ledger is looking great. Keep optimizing your spending habits!"
            </p>
            <button className="mt-auto flex items-center justify-center gap-3 w-full py-6 bg-white/5 border-2 border-blue-500/20 rounded-2xl text-xs font-black uppercase tracking-widest text-blue-500 hover:bg-blue-600 hover:text-white transition-all shadow-lg">
              <Sparkles size={18}/> Review Predictions
            </button>
          </div>
        </div>

        <div className="pb-24 w-full animate-fade delay-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
            <h4 className="font-black text-sm uppercase tracking-widest text-[var(--text-main)] underline decoration-blue-500 decoration-4 underline-offset-8">Live Ledger System</h4>
            <div className="relative w-full md:w-[480px]">
              <Search className="absolute left-6 top-5 text-blue-500" size={20}/>
              <input onChange={(e) => setSearchTerm(e.target.value)} type="text" placeholder="Filter entry records..." className="w-full pl-16 pr-8 py-5 bg-[var(--bg-card)] border-2 border-[var(--border-color)] rounded-full text-base font-black outline-none text-[var(--text-main)] shadow-lg focus:ring-4 ring-blue-500/20 transition-all"/>
            </div>
          </div>
          
          <div className="w-full overflow-x-auto">
            <table className="ledger-table min-w-full">
              <thead>
                <tr className="text-left">
                  <th>Entry Detail</th>
                  <th>Entry Type</th>
                  <th className="text-right">Currency Value</th>
                  {role === 'Admin' && <th className="text-right">Action Center</th>}
                </tr>
              </thead>
              <tbody>
                {transactions.filter(t => t.description.toLowerCase().includes(searchTerm.toLowerCase())).map((t, index) => (
                  <tr key={t.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
                    <td className="text-[var(--text-main)] font-black text-xl">{t.description}</td>
                    <td>
                      <span className={`px-6 py-2.5 rounded-full text-[11px] font-black uppercase border-2 ${t.type === 'income' ? 'border-green-500/40 text-income bg-green-500/5' : 'border-red-500/40 text-expense bg-red-500/5'}`}>
                        {t.type}
                      </span>
                    </td>
                    <td className={`text-right font-black text-3xl ${t.type === 'income' ? 'text-income' : 'text-expense'}`}>
                      {t.type === 'income' ? '+' : '-'} ₹{t.amount.toLocaleString()}
                    </td>
                    {role === 'Admin' && (
                      <td className="text-right">
                        <div className="flex justify-end gap-5">
                          <button onClick={() => { setTempTx(t); setIsModalOpen(true); }} className="action-btn edit-btn shadow-md"><Edit2 size={24}/></button>
                          <button onClick={() => setTransactions(transactions.filter(item => item.id !== t.id))} className="action-btn delete-btn shadow-md"><Trash2 size={24}/></button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center z-50 p-6 animate-fade">
            <div className="glass-panel p-12 max-w-lg w-full border-blue-600/50 shadow-[0_0_60px_rgba(37,99,235,0.25)] animate-scale">
              <div className="flex justify-between items-center mb-10">
                <h3 className="modal-title font-black uppercase text-xl tracking-widest italic">{tempTx.id ? 'Modify Entry' : 'New Transaction'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="close-btn p-4 rounded-2xl hover:rotate-90 transition-transform"><X size={28}/></button>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="modal-label text-[11px] uppercase tracking-widest">Entry Detail (e.g. PG Rent)</label>
                  <input type="text" className="modal-input w-full p-6 rounded-2xl border-2 border-[var(--border-color)] text-base font-black outline-none focus:border-blue-600 transition-all text-black dark:text-white" value={tempTx.description} onChange={(e) => setTempTx({...tempTx, description: e.target.value})} />
                </div>
                <div className="space-y-3">
                  <label className="modal-label text-[11px] uppercase tracking-widest">Capital Value (₹)</label>
                  <input type="number" className="modal-input w-full p-6 rounded-2xl border-2 border-[var(--border-color)] text-base font-black outline-none focus:border-blue-600 transition-all text-black dark:text-white" value={tempTx.amount} onChange={(e) => setTempTx({...tempTx, amount: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <button onClick={() => setTempTx({...tempTx, type: 'income'})} className={`py-6 rounded-2xl text-[11px] font-black uppercase border-2 transition-all ${tempTx.type === 'income' ? 'bg-green-600 border-green-600 text-white shadow-xl' : 'border-[var(--border-color)] text-slate-500'}`}>Credit (Income)</button>
                  <button onClick={() => setTempTx({...tempTx, type: 'expense'})} className={`py-6 rounded-2xl text-[11px] font-black uppercase border-2 transition-all ${tempTx.type === 'expense' ? 'bg-red-600 border-red-600 text-white shadow-xl' : 'border-[var(--border-color)] text-slate-500'}`}>Debit (Expense)</button>
                </div>
                <button onClick={handleSave} className="w-full bg-blue-600 text-white py-7 rounded-3xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-blue-600/40 hover:bg-blue-700 transition-all mt-6 active:scale-95">Authorize Transaction</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;