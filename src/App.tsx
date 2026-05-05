import React, { useState } from 'react';
import { 
  History, 
  BarChart3, 
  Settings as SettingsIcon, 
  Wallet,
  Home as HomeIcon,
  Search,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Home from './components/Home';
import Credits from './components/Credits';
import HistoryView from './components/History';
import SettingsView from './components/Settings';
import MasrofLogo from './components/Logo';
import AddTransactionModal from './components/AddTransactionModal';
import { Transaction, Reminder, CreditEntry } from './types';

type Tab = 'home' | 'history' | 'credits' | 'settings';

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
      credits: 'Crédits',
      options: 'Options',
      trésorerie: 'Votre trésorerie, simplifiée',
    },
    'العربية': {
      accueil: 'الرئيسية',
      historique: 'السجل',
      credits: 'ديون',
      options: 'الإعدادات',
      trésorerie: 'خزينتك، بكل بساطة',
    },
    'English': {
      accueil: 'Home',
      historique: 'History',
      credits: 'Credits',
      options: 'Settings',
      trésorerie: 'Your treasury, simplified',
    }
  };

  const [creditEntries, setCreditEntries] = useState<CreditEntry[]>([
    { id: '1', name: 'Ahmed', amount: 500, type: 'OWE_ME', date: '01/05/2024' },
    { id: '2', name: 'Boutique Ali', amount: 120, type: 'I_OWE', date: '03/05/2024' },
  ]);

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

  const handleCreditSettlement = (id: string) => {
    const entry = creditEntries.find(e => e.id === id);
    if (!entry) return;

    // Add corresponding transaction
    if (entry.type === 'OWE_ME') {
      // Deleting "Owed to me" -> I received money back (Withdrawal/Retrait)
      addTransaction(`${language === 'العربية' ? 'استعادة مبلغ' : 'Retrait (Remboursement)'} : ${entry.name}`, entry.amount, 'INCOME', 'Bank');
    } else {
      // Deleting "I owe" -> I paid back (Purchase/Achat)
      addTransaction(`${language === 'العربية' ? 'دفع (شراء)' : 'Achat (Paiement)'} : ${entry.name}`, entry.amount, 'EXPENSE', 'Shopping');
    }

    // Remove credit entry
    setCreditEntries(prev => prev.filter(e => e.id !== id));
  };

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
            creditEntries={creditEntries}
            onNavigateToCredits={() => setActiveTab('credits')}
          />
        );
      case 'credits':
        return (
          <Credits 
            language={language} 
            currency={currency} 
            entries={creditEntries}
            setEntries={setCreditEntries}
            onSettle={handleCreditSettlement}
          />
        );
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
            creditEntries={creditEntries}
            onNavigateToCredits={() => setActiveTab('credits')}
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
      <header className={`px-6 pt-8 pb-4 flex items-center justify-between transition-colors ${isDarkMode ? 'bg-[#1A1A1A]' : ''}`}>
        <div className="flex items-center gap-3">
          <div className={`w-14 h-14 shadow-lg rounded-full overflow-hidden flex items-center justify-center border-4 transition-transform active:scale-95 ${isDarkMode ? 'bg-slate-800 border-slate-700 font-bold' : 'bg-white border-white'}`}>
            <MasrofLogo className="w-9 h-9" currency={currency} />
          </div>
          <h1 className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-[#0B1E3F]'} tracking-tight`}>
            Masro<span className="text-[#36A292]">F</span>
          </h1>
        </div>
        <button className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md borderTransition-all active:scale-90 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-white border-slate-50 text-slate-400'}`}>
          <Search size={22} strokeWidth={2.5} />
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
          active={activeTab === 'credits'} 
          onClick={() => setActiveTab('credits')} 
          icon={<Users size={22} />} 
          label={t.credits} 
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

