import React, { useState } from 'react';
import { 
  History, 
  BarChart3, 
  Settings as SettingsIcon, 
  Wallet,
  Home as HomeIcon,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Home from './components/Home';
import Stats from './components/Stats';
import HistoryView from './components/History';
import SettingsView from './components/Settings';
import MasrofLogo from './components/Logo';
import AddTransactionModal from './components/AddTransactionModal';

interface Transaction {
  id: string;
  label: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  category?: string;
  date: string;
}

type Tab = 'home' | 'history' | 'stats' | 'settings';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const [widgetMode, setWidgetMode] = useState<'balance' | 'spending'>('balance');
  const [aiNotifications, setAiNotifications] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);
  const [balance, setBalance] = useState(1450.50);
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', label: 'Tirage Banque', amount: 2000, type: 'INCOME', date: '03/05 18:23' },
    { id: '2', label: 'Achat Market', amount: 840, type: 'EXPENSE', category: 'Shopping', date: '03/05 12:45' },
    { id: '3', label: 'Café & Snack', amount: 45, type: 'EXPENSE', category: 'Nourriture', date: '03/05 09:15' },
    { id: '4', label: 'Carburant', amount: 300, type: 'EXPENSE', category: 'Transport', date: '02/05 15:30' },
    { id: '5', label: 'Dîner Restaurant', amount: 250, type: 'EXPENSE', category: 'Nourriture', date: '02/05 21:00' },
    { id: '6', label: 'Virement Reçu', amount: 5000, type: 'INCOME', date: '01/05 10:00' },
    { id: '7', label: 'Loyer', amount: 3500, type: 'EXPENSE', category: 'Autres', date: '01/05 08:00' },
  ]);

  const addTransaction = (label: string, amount: number, type: 'INCOME' | 'EXPENSE', category?: string) => {
    const newTx: Transaction = {
      id: Date.now().toString(),
      label,
      amount,
      type,
      category,
      date: new Date().toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(',', '')
    };

    setTransactions(prev => [newTx, ...prev]);
    if (type === 'INCOME') {
      setBalance(prev => prev + amount);
    } else {
      setBalance(prev => prev - amount);
    }
  };

  const resetTransactions = () => {
    setTransactions([]);
    setBalance(0);
  };

  const openModal = (type: 'INCOME' | 'EXPENSE') => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const weeklyAchat = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((acc, t) => acc + t.amount, 0);
  
  const weeklyBank = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((acc, t) => acc + t.amount, 0);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <Home 
            balance={balance} 
            transactions={transactions.slice(0, 3)} 
            weeklyAchat={weeklyAchat} 
            weeklyBank={weeklyBank} 
            onAddClick={openModal}
            onViewAll={() => setActiveTab('history')}
            widgetMode={widgetMode}
          />
        );
      case 'stats':
        return <Stats />;
      case 'history':
        return <HistoryView transactions={transactions} />;
      case 'settings':
        return (
          <SettingsView 
            widgetMode={widgetMode} 
            onWidgetModeChange={setWidgetMode} 
            onResetTransactions={resetTransactions} 
            aiNotifications={aiNotifications}
            onAiNotificationsChange={setAiNotifications}
          />
        );
      default:
        return (
          <Home 
            balance={balance} 
            transactions={transactions} 
            weeklyAchat={weeklyAchat} 
            weeklyBank={weeklyBank} 
            onAddClick={openModal}
            onViewAll={() => setActiveTab('history')}
            widgetMode={widgetMode}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F7F8] flex flex-col max-w-md mx-auto shadow-2xl relative overflow-hidden font-sans">
      <AnimatePresence>
        {showSplash && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-teal-light flex flex-col items-center justify-center max-w-md mx-auto"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-40 h-40 bg-white rounded-full shadow-2xl border-4 border-teal-brand/20 flex items-center justify-center mb-6"
            >
              <MasrofLogo className="w-32 h-32" />
            </motion.div>
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-black text-teal-brand tracking-tighter"
            >
              MasroF
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.6 }}
              className="text-slate-500 font-medium mt-2"
            >
              Votre trésorerie, simplifiée
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 shadow-sm rounded-xl overflow-hidden bg-white flex items-center justify-center border border-teal-brand/10">
            <MasrofLogo className="w-8 h-8" />
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
          icon={<SettingsIcon size={22} />} 
          label="Options" 
        />
      </nav>

      <AddTransactionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addTransaction}
        initialType={modalType}
      />
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

