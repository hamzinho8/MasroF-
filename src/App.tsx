import React, { useState } from 'react';
import { 
  History, 
  BarChart3, 
  Settings, 
  Wallet,
  Home as HomeIcon,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Home from './components/Home';
import Stats from './components/Stats';

interface Transaction {
  id: string;
  label: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  date: string;
}

type Tab = 'home' | 'history' | 'stats' | 'settings';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [balance, setBalance] = useState(1450.50);
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', label: 'Tirage Banque', amount: 2000, type: 'INCOME', date: '03/05 18:23' },
    { id: '2', label: 'Achat Market', amount: 840, type: 'EXPENSE', date: '03/05 12:45' },
    { id: '3', label: 'Café', amount: 30, type: 'EXPENSE', date: '02/05 09:15' },
  ]);

  const weeklyAchat = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((acc, t) => acc + t.amount, 0);
  
  const weeklyBank = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((acc, t) => acc + t.amount, 0);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home balance={balance} transactions={transactions} weeklyAchat={weeklyAchat} weeklyBank={weeklyBank} />;
      case 'stats':
        return <Stats />;
      case 'history':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 text-center text-slate-400 mt-20">
            <History size={48} className="mx-auto mb-4 opacity-20" />
            <p>Historique des transactions en cours de développement...</p>
          </motion.div>
        );
      case 'settings':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 text-center text-slate-400 mt-20">
            <Settings size={48} className="mx-auto mb-4 opacity-20" />
            <p>Paramètres de l'application bientôt disponibles...</p>
          </motion.div>
        );
      default:
        return <Home balance={balance} transactions={transactions} weeklyAchat={weeklyAchat} weeklyBank={weeklyBank} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F7F8] flex flex-col max-w-md mx-auto shadow-2xl relative overflow-hidden font-sans">
      {/* Header */}
      <header className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 shadow-sm rounded-xl overflow-hidden bg-white flex items-center justify-center p-1 border border-teal-brand/10">
            <img 
              src="/image_12.png" 
              alt="MasroF Logo" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <h1 className="text-2xl font-black text-teal-brand tracking-tight">MasroF</h1>
        </div>
        <button className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm border border-slate-100">
          <Search size={20} />
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 bg-white rounded-t-[32px] p-6 shadow-even pb-28 overflow-y-auto">
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </main>

      {/* Bottom Nav */}
      <nav className="absolute bottom-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md border-t border-slate-100 flex items-center justify-around px-2 z-20">
        <TabButton 
          active={activeTab === 'home'} 
          onClick={() => setActiveTab('home')} 
          icon={<HomeIcon size={22} />} 
          label="Accueil" 
        />
        <TabButton 
          active={activeTab === 'history'} 
          onClick={() => setActiveTab('history')} 
          icon={<History size={22} />} 
          label="Historique" 
        />
        <TabButton 
          active={activeTab === 'stats'} 
          onClick={() => setActiveTab('stats')} 
          icon={<BarChart3 size={22} />} 
          label="Stats" 
        />
        <TabButton 
          active={activeTab === 'settings'} 
          onClick={() => setActiveTab('settings')} 
          icon={<Settings size={22} />} 
          label="Options" 
        />
      </nav>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-all duration-300 relative ${active ? 'text-teal-brand' : 'text-slate-400'}`}
    >
      {active && (
        <motion.div 
          layoutId="activeTab"
          className="absolute -top-1 w-8 h-1 bg-teal-brand rounded-full"
        />
      )}
      <div className={`p-2 rounded-xl transition-colors ${active ? 'bg-teal-brand/10' : 'bg-transparent'}`}>
        {icon}
      </div>
      <span className={`text-[10px] font-bold ${active ? 'opacity-100' : 'opacity-0'}`}>{label}</span>
    </button>
  );
}

