import React, { useState } from 'react';
import { 
  History, 
  BarChart3, 
  Settings as SettingsIcon, 
  Wallet,
  Home as HomeIcon,
  Search,
  Users,
  BookOpenText,
  HandCoins,
  Settings2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Home from './components/Home';
import Statistics from './components/Statistics';
import Credits from './components/Credits';
import HistoryView from './components/History';
import SettingsView from './components/Settings';
import MasrofLogo from './components/Logo';
import AddTransactionModal from './components/AddTransactionModal';
import { Transaction, Reminder, CreditEntry, PredefinedItem } from './types';
import { INITIAL_PREDEFINED_ITEMS } from './constants';

type Tab = 'home' | 'stats' | 'history' | 'credits' | 'settings';

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
      stats: 'Stat',
      trésorerie: 'Votre trésorerie, simplifiée',
      owedToMe: 'On me doit',
      owedByMe: 'Je dois',
    },
    'العربية': {
      accueil: 'الرئيسية',
      historique: 'السجل',
      credits: 'ديون',
      options: 'الإعدادات',
      stats: 'الإحصائيات',
      trésorerie: 'خزينتك، بكل بساطة',
      owedToMe: 'مستحقات لي',
      owedByMe: 'ديون علي',
    },
    'English': {
      accueil: 'Home',
      historique: 'History',
      credits: 'Credits',
      options: 'Settings',
      stats: 'Stats',
      trésorerie: 'Your treasury, simplified',
      owedToMe: 'Owed to me',
      owedByMe: 'I owe',
    }
  };

  const [creditEntries, setCreditEntries] = useState<CreditEntry[]>([
    { id: '1', name: 'Ahmed', amount: 500, type: 'OWE_ME', date: '01/05/2024' },
    { id: '2', name: 'Boutique Ali', amount: 120, type: 'I_OWE', date: '03/05/2024' },
  ]);

  const [predefinedItems, setPredefinedItems] = useState<PredefinedItem[]>(() => {
    const saved = localStorage.getItem('predefinedItems');
    if (saved) {
      let items = JSON.parse(saved);
      // Migration: Rename Cisset to Sucette and update icons
      let migrated = false;
      items = items.map((item: any) => {
        if (item.name === 'Cisset') {
          migrated = true;
          return { ...item, name: 'Sucette', iconName: 'Candy' };
        }
        if (item.name === 'Danone' && item.iconName !== 'Milk') {
          migrated = true;
          return { ...item, iconName: 'Milk' };
        }
        if (item.name === 'Cafe grain' && item.iconName !== 'Bean') {
          migrated = true;
          return { ...item, iconName: 'Bean' };
        }
        if ((item.name === 'Gaz' || item.name === 'gaz') && item.iconName !== 'Cylinder') {
          migrated = true;
          return { ...item, name: 'Gaz', iconName: 'Cylinder' };
        }
        if (item.name === 'Cigarette' && (item.iconName !== 'Cigarette' || item.price !== 30)) {
          migrated = true;
          return { ...item, frequent: true, category: 'Loisirs', iconName: 'Cigarette', price: 30 };
        }
        return item;
      });

      // Ensure Gaz exists if not present (as it's a new default)
      const hasGaz = items.some((item: any) => item.name === 'Gaz');
      if (!hasGaz) {
        migrated = true;
        const gazItem = INITIAL_PREDEFINED_ITEMS.find(i => i.name === 'Gaz');
        if (gazItem) items.push(gazItem);
      }

      if (migrated) {
        localStorage.setItem('predefinedItems', JSON.stringify(items));
      }
      return items;
    }
    return INITIAL_PREDEFINED_ITEMS;
  });

  React.useEffect(() => {
    localStorage.setItem('predefinedItems', JSON.stringify(predefinedItems));
  }, [predefinedItems]);

  const t = translations[language as keyof typeof translations] || translations['Français'];
  const isRtl = language === 'العربية';
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
    { id: '1', label: 'Tirage Banque', amount: 2000, type: 'INCOME', date: '03/05 18:23', timestamp: new Date(2024, 4, 3, 18, 23).getTime() },
    { id: '2', label: 'Achat Market', amount: 840, type: 'EXPENSE', category: 'Shopping', date: '03/05 12:45', timestamp: new Date(2024, 4, 3, 12, 45).getTime() },
    { id: '3', label: 'Café & Snack', amount: 45, type: 'EXPENSE', category: 'Nourriture', date: '03/05 09:15', timestamp: new Date(2024, 4, 3, 9, 15).getTime() },
    { id: '4', label: 'Carburant', amount: 300, type: 'EXPENSE', category: 'Transport', date: '02/05 15:30', timestamp: new Date(2024, 4, 2, 15, 30).getTime() },
    { id: '5', label: 'Dîner Restaurant', amount: 250, type: 'EXPENSE', category: 'Nourriture', date: '02/05 21:00', timestamp: new Date(2024, 4, 2, 21, 0).getTime() },
    { id: '6', label: 'Virement Reçu', amount: 5000, type: 'INCOME', date: '01/05 10:00', timestamp: new Date(2024, 4, 1, 10, 0).getTime() },
    { id: '7', label: 'Loyer', amount: 3500, type: 'EXPENSE', category: 'Autres', date: '01/05 08:00', timestamp: new Date(2024, 4, 1, 8, 0).getTime() },
  ]);

  const addTransaction = (label: string, amount: number, type: 'INCOME' | 'EXPENSE', category?: string) => {
    const newTx: Transaction = {
      id: Date.now().toString(),
      label,
      amount,
      type,
      category,
      date: new Date().toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(',', ''),
      timestamp: Date.now()
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

  const handleCreditSettlement = (id: string) => {
    const entry = creditEntries.find(e => e.id === id);
    if (!entry) return;

    // Add corresponding transaction
    if (entry.type === 'OWE_ME') {
      // Someone paid me back (Income)
      const label = language === 'العربية' 
        ? `استرداد مستحق: ${entry.name}` 
        : `Remboursement : ${entry.name}`;
      addTransaction(label, entry.amount, 'INCOME', t.owedToMe);
    } else {
      // I paid someone back (Expense)
      const label = language === 'العربية' 
        ? `تسديد دين: ${entry.name}` 
        : `Paiement dette : ${entry.name}`;
      addTransaction(label, entry.amount, 'EXPENSE', t.owedByMe);
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
            transactions={transactions} 
            onAddClick={openModal}
            onViewAll={() => setActiveTab('history')}
            onDelete={deleteTransaction}
            onEdit={(tx) => updateTransaction(tx.id, tx)}
            widgetMode={widgetMode}
            language={language}
            currency={currency}
            creditEntries={creditEntries}
            onNavigateToCredits={() => setActiveTab('credits')}
          />
        );
      case 'stats':
        return (
          <Statistics 
            transactions={transactions}
            currency={currency}
            language={language}
            isDarkMode={isDarkMode}
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
            onAddClick={openModal}
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
            reminders={reminders}
            onRemindersChange={setReminders}
            transactions={transactions}
            predefinedItems={predefinedItems}
            onPredefinedItemsChange={setPredefinedItems}
          />
        );
      default:
        return (
          <Home 
            balance={balance} 
            transactions={transactions} 
            onAddClick={openModal}
            onViewAll={() => setActiveTab('history')}
            onDelete={deleteTransaction}
            onEdit={(tx) => updateTransaction(tx.id, tx)}
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
      className={`h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'} flex flex-col max-w-md mx-auto shadow-2xl relative overflow-hidden font-sans transition-colors duration-500`}
    >
      <AnimatePresence>
        {showSplash && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-[100] ${isDarkMode ? 'bg-slate-900' : 'bg-white'} flex flex-col items-center justify-center max-w-md mx-auto`}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-80 h-80 flex items-center justify-center mb-4"
            >
              <MasrofLogo className="w-full h-full" size="large" />
            </motion.div>
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className={`text-6xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'} tracking-tighter`}
            >
              Masro<span className="text-[#84cc16]">F</span>
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

      {/* Header & Navigation */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${isDarkMode ? 'bg-slate-900/80' : 'bg-white/80'} backdrop-blur-xl border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
        {/* Global Navigation Tabs (Compact & Artistic) */}
        <nav className="flex items-center justify-around px-2 pb-5 pt-3 max-w-full mx-auto gap-1">
          <TabButton 
            active={activeTab === 'home'} 
            onClick={() => setActiveTab('home')} 
            icon={<MasrofLogo className="w-10 h-10" size="small" />} 
            label="" 
            color="teal"
            isDarkMode={isDarkMode}
          />
          <TabButton 
            active={activeTab === 'history'} 
            onClick={() => setActiveTab('history')} 
            icon={<BookOpenText size={24} strokeWidth={3} />} 
            label={t.historique} 
            color="rose"
            isDarkMode={isDarkMode}
          />
          <TabButton 
            active={activeTab === 'credits'} 
            onClick={() => setActiveTab('credits')} 
            icon={<HandCoins size={24} strokeWidth={3} />} 
            label={t.credits} 
            color="credits"
            isDarkMode={isDarkMode}
          />
          <TabButton 
            active={activeTab === 'stats'} 
            onClick={() => setActiveTab('stats')} 
            icon={<BarChart3 size={24} strokeWidth={3} />} 
            label={(t as any).stats} 
            color="emerald"
            isDarkMode={isDarkMode}
          />
          <TabButton 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
            icon={<Settings2 size={24} strokeWidth={3} />} 
            label={t.options} 
            color="slate"
            isDarkMode={isDarkMode}
          />
        </nav>
      </header>

      {/* Main Container */}
      <main className={`flex-1 rounded-t-[32px] p-6 shadow-even transition-colors relative z-10 overflow-y-auto ${isDarkMode ? 'bg-slate-900 shadow-none' : 'bg-white'}`}>
        <div className="pb-32"> {/* Increased padding for the 3-dots menu space at the end of lists */}
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </div>
      </main>

      <AddTransactionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addTransaction}
        initialType={modalType}
        currency={currency}
        predefinedItems={predefinedItems}
      />
    </div>
  );
}

function TabButton({ 
  active, 
  onClick, 
  icon, 
  label, 
  isDarkMode,
  color = "teal"
}: { 
  active: boolean, 
  onClick: () => void, 
  icon: React.ReactNode, 
  label: string, 
  isDarkMode: boolean,
  color?: "teal" | "indigo" | "rose" | "slate" | "credits" | "emerald"
}) {
  const getActiveColors = () => {
    switch(color) {
      case "emerald": return { text: "text-emerald-600", bg: "bg-emerald-500/10", dot: "bg-emerald-500", glow: "rgba(16,185,129,0.3)" };
      case "indigo": return { text: "text-indigo-600", bg: "bg-indigo-500/10", dot: "bg-indigo-500", glow: "rgba(79,70,229,0.3)" };
      case "rose": return { text: "text-rose-600", bg: "bg-rose-500/10", dot: "bg-rose-500", glow: "rgba(225,29,72,0.3)" };
      case "credits": return { 
        text: "text-indigo-600", 
        bg: "bg-indigo-500/5", 
        dot: "bg-amber-500", 
        glow: "rgba(79,70,229,0.2)",
        iconColor: "#4F46E5"
      };
      case "slate": return { text: "text-slate-700", bg: "bg-slate-500/10", dot: "bg-slate-500", glow: "rgba(107,114,128,0.3)" };
      default: return { text: "text-teal-600", bg: "bg-teal-500/10", dot: "bg-teal-500", glow: "rgba(54,162,146,0.3)" };
    }
  };

  const colors = getActiveColors();

  return (
    <button 
      onClick={onClick}
      className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-3 transition-all duration-300 relative rounded-2xl group ${active ? colors.text + ' scale-105' : (isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600')}`}
    >
      {active && (
        <motion.div 
          layoutId="activeTabBg"
          className={`absolute inset-0 ${colors.bg} rounded-2xl -z-10 shadow-sm`}
          initial={false}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      <div className={`transition-transform duration-300 group-hover:scale-110 ${active ? `scale-110 drop-shadow-[0_0_12px_${colors.glow}]` : ''}`}>
        {active && (colors as any).iconColor ? (
          <div style={{ color: (colors as any).iconColor }}>
            {icon}
          </div>
        ) : icon}
      </div>
      {label && (
        <span className={`text-[12px] font-black uppercase tracking-[0.1em] transition-all duration-300 mt-1 whitespace-nowrap leading-none ${active ? 'opacity-100 translate-y-0' : 'opacity-60'}`}>
          {label}
        </span>
      )}
      {active && (
        <motion.div 
          layoutId="activeTabDot"
          className={`w-1.5 h-1.5 ${colors.dot} rounded-full absolute -bottom-1 shadow-sm`}
        />
      )}
    </button>
  );
}

