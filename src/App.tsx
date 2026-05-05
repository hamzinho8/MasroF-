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

export interface Reminder {
  id: string;
  title: string;
  time: string;
  date?: string;
  frequency?: 'ONCE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
  enabled: boolean;
  type: 'ACHAT' | 'RETRAIT' | 'AUTRE';
}

type Tab = 'home' | 'history' | 'stats' | 'settings';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const [widgetMode, setWidgetMode] = useState<'balance' | 'spending'>('balance');
  const [aiNotifications, setAiNotifications] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currency, setCurrency] = useState('DH');
  const [language, setLanguage] = useState<'Français' | 'العربية' | 'English'>('Français');

  const translations = {
    'Français': {
      accueil: 'Accueil',
      historique: 'Historique',
      stats: 'Stats',
      options: 'Options',
      trésorerie: 'Votre trésorerie, simplifiée',
    },
    'العربية': {
      accueil: 'الرئيسية',
      historique: 'السجل',
      stats: 'الإحصائيات',
      options: 'الإعدادات',
      trésorerie: 'خزينتك، بكل بساطة',
    },
    'English': {
      accueil: 'Home',
      historique: 'History',
      stats: 'Stats',
      options: 'Settings',
      trésorerie: 'Your treasury, simplified',
    }
  };

  const t = translations[language as keyof typeof translations] || translations['Français'];
  const isRtl = language === 'العربية';
  const [userProfile, setUserProfile] = useState({
    name: 'Hamza Houam',
    email: 'houamhamza8@gmail.com',
    avatar: ''
  });
  const [reminders, setReminders] = useState<Reminder[]>([
    { id: 'rem-1', title: 'Saisir mes achats', time: '22:00', enabled: true, type: 'ACHAT' },
    { id: 'rem-2', title: 'Retrait d\'argent', time: '07:45', enabled: false, type: 'RETRAIT' }
  ]);

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

  const deleteTransaction = (id: string) => {
    const tx = transactions.find(t => t.id === id);
    if (!tx) return;

    if (tx.type === 'INCOME') {
      setBalance(prev => prev - tx.amount);
    } else {
      setBalance(prev => prev + tx.amount);
    }
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const updateTransaction = (id: string, updatedTx: Partial<Transaction>) => {
    setTransactions(prev => prev.map(tx => {
      if (tx.id === id) {
        const result = { ...tx, ...updatedTx };
        // Simple balance adjustment (could be more complex if amount changed)
        if (updatedTx.amount !== undefined) {
          const diff = updatedTx.amount - tx.amount;
          if (tx.type === 'INCOME') setBalance(b => b + diff);
          else setBalance(b => b - diff);
        }
        return result;
      }
      return tx;
    }));
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
            language={language}
            currency={currency}
          />
        );
      case 'stats':
        return <Stats language={language} currency={currency} />;
      case 'history':
        return (
          <HistoryView 
            transactions={transactions} 
            language={language} 
            currency={currency} 
            onDelete={deleteTransaction}
            onUpdate={updateTransaction}
          />
        );
      case 'settings':
        return (
          <SettingsView 
            widgetMode={widgetMode} 
            onWidgetModeChange={setWidgetMode} 
            onResetTransactions={resetTransactions} 
            aiNotifications={aiNotifications}
            onAiNotificationsChange={setAiNotifications}
            isDarkMode={isDarkMode}
            onDarkModeChange={setIsDarkMode}
            currency={currency}
            onCurrencyChange={setCurrency}
            language={language}
            onLanguageChange={setLanguage}
            userProfile={userProfile}
            onProfileUpdate={setUserProfile}
            reminders={reminders}
            onRemindersChange={setReminders}
            transactions={transactions}
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
            language={language}
            currency={currency}
          />
        );
      }
    };

  return (
    <div 
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`min-h-screen ${isDarkMode ? 'bg-[#121212]' : 'bg-[#F0F7F8]'} flex flex-col max-w-md mx-auto shadow-2xl relative overflow-hidden font-sans transition-colors duration-500`}
    >
      <AnimatePresence>
        {showSplash && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-[100] ${isDarkMode ? 'bg-[#1A1A1A]' : 'bg-teal-light'} flex flex-col items-center justify-center max-w-md mx-auto`}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-40 h-40 bg-white rounded-full shadow-2xl border-4 border-teal-brand/20 flex items-center justify-center mb-6"
            >
              <MasrofLogo className="w-32 h-32" currency={currency} />
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
              {t.trésorerie}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className={`p-6 flex items-center justify-between transition-colors ${isDarkMode ? 'bg-[#1A1A1A]' : ''}`}>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 shadow-[0_8px_20px_-4px_rgba(0,0,0,0.1)] rounded-2xl overflow-hidden flex items-center justify-center border-2 transition-transform active:scale-95 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-white'}`}>
            <MasrofLogo className="w-9 h-9" currency={currency} />
          </div>
          <h1 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-800'} tracking-tight`}>
            Masro<span className="text-teal-brand">F</span>
          </h1>
        </div>
        <button className={`w-12 h-12 rounded-[20px] flex items-center justify-center shadow-sm border-2 transition-all active:scale-90 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-white border-slate-50 text-slate-400 hover:border-teal-brand/10 hover:text-teal-brand hover:shadow-lg hover:shadow-teal-brand/5'}`}>
          <Search size={20} />
        </button>
      </header>

      {/* Main Container */}
      <main className={`flex-1 rounded-t-[32px] p-6 shadow-even pb-28 overflow-y-auto transition-colors ${isDarkMode ? 'bg-slate-900 shadow-none' : 'bg-white'}`}>
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </main>

      {/* Bottom Nav */}
      <nav className={`absolute bottom-0 left-0 right-0 h-20 backdrop-blur-md border-t flex items-center justify-around px-2 z-20 transition-colors ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-100'}`}>
        <TabButton 
          active={activeTab === 'home'} 
          onClick={() => setActiveTab('home')} 
          icon={<HomeIcon size={22} />} 
          label={t.accueil} 
          isDarkMode={isDarkMode}
        />
        <TabButton 
          active={activeTab === 'history'} 
          onClick={() => setActiveTab('history')} 
          icon={<History size={22} />} 
          label={t.historique} 
          isDarkMode={isDarkMode}
        />
        <TabButton 
          active={activeTab === 'stats'} 
          onClick={() => setActiveTab('stats')} 
          icon={<BarChart3 size={22} />} 
          label={t.stats} 
          isDarkMode={isDarkMode}
        />
        <TabButton 
          active={activeTab === 'settings'} 
          onClick={() => setActiveTab('settings')} 
          icon={<SettingsIcon size={22} />} 
          label={t.options} 
          isDarkMode={isDarkMode}
        />
      </nav>

      <AddTransactionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addTransaction}
        initialType={modalType}
        currency={currency}
      />
    </div>
  );
}

function TabButton({ active, onClick, icon, label, isDarkMode }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, isDarkMode: boolean }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-all duration-300 relative ${active ? 'text-teal-brand' : (isDarkMode ? 'text-slate-500' : 'text-slate-400')}`}
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

