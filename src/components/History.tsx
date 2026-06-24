import React, { useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { 
  CalendarCheck,
  CalendarDays,
  CalendarRange,
  ShoppingCart,
  Wallet,
  Plus,
  Filter, 
  TrendingUp, 
  TrendingDown, 
  Download,
  Calendar,
  Tag,
  X,
  LayoutGrid,
  ShoppingBag,
  ArrowDownToLine,
  Utensils,
  Car,
  Gamepad2,
  MoreHorizontal,
  MoreVertical,
  Trash2,
  Pencil,
  ListFilter,
  Landmark,
  Home as HomeIcon,
  HeartPulse,
  Heart,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { Transaction, PredefinedItem } from '../types';
import { INITIAL_PREDEFINED_ITEMS, ICON_MAP, CATEGORIES as APP_CATEGORIES, getArticleInfo } from '../constants';

interface HistoryProps {
  transactions: Transaction[];
  predefinedItems?: PredefinedItem[];
  language: string;
  currency: string;
  onDelete: (id: string) => void;
  onUpdate: (id: string, tx: Partial<Transaction>) => void;
  onAddClick: (type: 'INCOME' | 'EXPENSE') => void;
}

type FilterType = 'ALL' | 'INCOME' | 'EXPENSE';
type SortType = 'DATE_DESC' | 'DATE_ASC' | 'AMOUNT_DESC' | 'AMOUNT_ASC';

export default function History({ transactions, predefinedItems, language, currency, onDelete, onUpdate, onAddClick }: HistoryProps) {
  const translations = {
    'Français': {
      title: 'Historique',
      subtitle: 'Historique détaillé de vos transactions',
      searchPlaceholder: 'Rechercher une transaction...',
      tous: 'Tous',
      achats: 'Achats',
      retraits: 'Retraits',
      sortBy: 'Trier par',
      important: 'Important',
      noResult: 'Aucune transaction ne correspond à vos critères.',
      resetFilters: 'Réinitialiser les filtres',
      exportData: 'Exporter les données (PDF)',
      ajouterAchat: 'Ajouter Achat',
      ajouterRetrait: 'Ajouter Retrait',
      dateRecent: 'Date (Récents)',
      dateAncien: 'Date (Anciens)',
      montantMax: 'Montant (Max)',
      montantMin: 'Montant (Min)',
      nourriture: 'Nourriture',
      shopping: 'Shopping',
      transport: 'Transport',
      loisirs: 'Loisirs',
      autres: 'Autres',
      owedToMe: 'On me doit',
      owedByMe: 'Je dois',
    },
    'العربية': {
      title: 'السجل العام',
      subtitle: 'تاريخ مفصل لمعاملاتك',
      searchPlaceholder: 'البحث عن معاملة...',
      tous: 'الكل',
      achats: 'المشتريات',
      retraits: 'السحوبات',
      sortBy: 'ترتيب حسب',
      important: 'مهم',
      noResult: 'لا توجد معاملات تطابق معاييرك.',
      resetFilters: 'إعادة ضبط الفلاتر',
      exportData: 'تصدير البيانات (PDF)',
      ajouterAchat: 'إضافة شراء',
      ajouterRetrait: 'إضافة سحب',
      dateRecent: 'التاريخ (الأحدث)',
      dateAncien: 'التاريخ (الأقدم)',
      montantMax: 'المبلغ (الأقصى)',
      montantMin: 'المبلغ (الأدنى)',
      nourriture: 'طعام',
      shopping: 'تسوق',
      transport: 'نقل',
      loisirs: 'ترفيه',
      autres: 'أخرى',
      owedToMe: 'مستحقات لي',
      owedByMe: 'ديون علي',
    },
    'English': {
      title: 'General Ledger',
      subtitle: 'Detailed history of your transactions',
      searchPlaceholder: 'Search a transaction...',
      tous: 'All',
      achats: 'Purchases',
      retraits: 'Withdrawals',
      sortBy: 'Sort by',
      important: 'Important',
      noResult: 'No transactions match your criteria.',
      resetFilters: 'Reset filters',
      exportData: 'Export data (PDF)',
      ajouterAchat: 'Add Purchase',
      ajouterRetrait: 'Add Withdrawal',
      dateRecent: 'Date (Newest)',
      dateAncien: 'Date (Oldest)',
      montantMax: 'Amount (Max)',
      montantMin: 'Amount (Min)',
      nourriture: 'Food',
      shopping: 'Shopping',
      transport: 'Transport',
      loisirs: 'Leisure',
      autres: 'Others',
      owedToMe: 'On me doit',
      owedByMe: 'Je dois',
    }
  };

  const t = translations[language as keyof typeof translations] || translations['Français'];
  
  const CATEGORY_MAP = [
    ...APP_CATEGORIES.map(cat => ({
      label: cat.label,
      icon: (() => { const IconComp = ICON_MAP[cat.iconName] || MoreHorizontal; return <IconComp size={24} />; })(),
      color: cat.colorString,
      bg: cat.bgColor,
      text: cat.color,
      glow: `bg-${cat.colorString}-400`,
      activeBg: `bg-${cat.colorString}-500`,
      activeText: 'text-white'
    })),
    { label: t.owedToMe, icon: <TrendingUp size={24} />, color: 'indigo', bg: 'bg-indigo-100', text: 'text-indigo-600', glow: 'bg-indigo-400', activeBg: 'bg-indigo-500', activeText: 'text-white' },
    { label: t.owedByMe, icon: <TrendingDown size={24} />, color: 'amber', bg: 'bg-amber-100', text: 'text-amber-600', glow: 'bg-amber-400', activeBg: 'bg-amber-500', activeText: 'text-white' }
  ];

  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month'>('week');
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [sortBy, setSortBy] = useState<SortType>('DATE_DESC');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(t.tous);
  const [activeInlineMenu, setActiveInlineMenu] = useState<'DATE' | 'TYPE' | 'CATEGORY' | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [visibleCount, setVisibleCount] = useState(30);

  const handleEdit = (tx: Transaction) => {
    setActiveMenuId(null);
    setEditingTx(tx);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTx) {
      onUpdate(editingTx.id, { label: editingTx.label, amount: editingTx.amount });
      setEditingTx(null);
    }
  };

  const parseTxDate = (dateStr: string) => {
    const [dayMonth] = dateStr.split(' ');
    const [day, month] = dayMonth.split('/').map(Number);
    const year = new Date().getFullYear();
    return new Date(year, month - 1, day);
  };

  const filteredTotals = React.useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    let totalExpense = 0;
    let totalIncome = 0;

    transactions.forEach(tx => {
      const dateStr = tx.date.split(' ')[0];
      const [dayPart, monthPart] = dateStr.split('/');
      
      if (!dayPart || !monthPart) return;
      
      const day = parseInt(dayPart);
      const month = parseInt(monthPart) - 1;
      
      const txDate = new Date(currentYear, month, day);
      if (txDate > now) {
        txDate.setFullYear(currentYear - 1);
      }
      
      let include = false;
      const hoursInDay = 1000 * 60 * 60 * 24;
      
      if (timeframe === 'day') {
        include = day === now.getDate() && month === now.getMonth();
      } else if (timeframe === 'week') {
        const diffDays = (now.getTime() - txDate.getTime()) / hoursInDay;
        include = diffDays >= 0 && diffDays < 7;
      } else if (timeframe === 'month') {
        include = month === now.getMonth();
      }
      
      if (include) {
        const isBankAddedBalance = tx.type === "INCOME" && tx.paidByBank && ["Salaire", "Dépôt", "Autre", "Banque"].includes(tx.category || "");
        const isRetrait = tx.type === "INCOME" && !tx.paidByBank && tx.label === "Retrait Banque";

        if (!isBankAddedBalance && !isRetrait) {
          const isCredit = (tx.category && ["on me doit","je dois","مستحقات لي","ديون علي","owed to me","i owe","loans","debts","crédit +","crédit --"].includes(tx.category.toLowerCase()));
          if (!isCredit) {
            if (tx.type === 'EXPENSE') totalExpense += tx.amount;
            else if (tx.type === 'INCOME' && !tx.paidByBank) totalIncome += tx.amount;
          }
        }
      }
    });

    return { totalExpense, totalIncome };
  }, [transactions, timeframe]);

  const getSummaryTitle = () => {
    if (timeframe === 'day') return language === 'العربية' ? 'اليوم' : language === 'English' ? 'Day' : 'Jour';
    if (timeframe === 'month') return language === 'العربية' ? 'الشهر' : language === 'English' ? 'Month' : 'Mois';
    return language === 'العربية' ? 'الأسبوع' : language === 'English' ? 'Semaine' : 'Semaine';
  };

  const getTimeframeLabel = (tf: 'day' | 'week' | 'month') => {
    if (tf === 'day') return language === 'العربية' ? 'اليوم' : language === 'English' ? 'Today' : 'Jour';
    if (tf === 'week') return language === 'العربية' ? 'الأسبوع' : language === 'English' ? 'Week' : 'Semaine';
    if (tf === 'month') return language === 'العربية' ? 'الشهر' : language === 'English' ? 'Month' : 'Mois';
    return '';
  };

  const filteredTransactions = transactions
    .filter(tx => {
      // Hide bank transactions
      const isBankAddedBalance = tx.type === "INCOME" && tx.paidByBank && ["Salaire", "Dépôt", "Autre", "Banque"].includes(tx.category || "");
      const isRetrait = tx.type === "INCOME" && !tx.paidByBank && tx.label === "Retrait Banque";
      
      if (isBankAddedBalance || isRetrait) {
        return false;
      }
      
      const matchesFilter = filter === 'ALL' || tx.type === filter;
      const matchesSearch = tx.label.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === t.tous || tx.category === selectedCategory;
      
      let matchesRange = true;
      if (startDate || endDate) {
        const txTime = tx.timestamp || parseTxDate(tx.date).getTime();
        
        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          if (txTime < start.getTime()) matchesRange = false;
        }
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          if (txTime > end.getTime()) matchesRange = false;
        }
      }

      return matchesFilter && matchesSearch && matchesRange && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'DATE_DESC': return b.timestamp - a.timestamp;
        case 'DATE_ASC': return a.timestamp - b.timestamp;
        case 'AMOUNT_DESC': return b.amount - a.amount;
        case 'AMOUNT_ASC': return a.amount - b.amount;
        default: return 0;
      }
    });

  const clearDateRange = () => {
    setStartDate('');
    setEndDate('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 pb-12"
    >
      {/* Premium Summary Card */}
      <div className="relative overflow-hidden rounded-[38px] shadow-xl shadow-slate-200/40 border border-white">
        {/* Background Gradient & Decorative Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-white to-emerald-50 z-0" />
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] w-64 h-64 bg-rose-400/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 p-5">
          {/* Header with Full-Width Selector */}
          <div className="flex bg-white/80 p-1 rounded-3xl shadow-sm border border-white/50 mb-8">
            <button 
              onClick={() => setTimeframe('day')}
              className={`flex-1 py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 ${timeframe === 'day' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-500 hover:bg-white/40'}`}
            >
              <CalendarCheck size={18} strokeWidth={timeframe === 'day' ? 2.5 : 2} />
              <span className="text-[10px] font-black uppercase tracking-wider">{getTimeframeLabel('day')}</span>
            </button>
            <button 
              onClick={() => setTimeframe('week')}
              className={`flex-1 py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 ${timeframe === 'week' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-500 hover:bg-white/40'}`}
            >
              <CalendarRange size={18} strokeWidth={timeframe === 'week' ? 2.5 : 2} />
              <span className="text-[10px] font-black uppercase tracking-wider">{getTimeframeLabel('week')}</span>
            </button>
            <button 
              onClick={() => setTimeframe('month')}
              className={`flex-1 py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 ${timeframe === 'month' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-500 hover:bg-white/40'}`}
            >
              <CalendarDays size={18} strokeWidth={timeframe === 'month' ? 2.5 : 2} />
              <span className="text-[10px] font-black uppercase tracking-wider">{getTimeframeLabel('month')}</span>
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-6 relative px-2 mb-2">
            {/* Divider */}
            <div className="absolute left-1/2 top-4 bottom-4 w-px bg-slate-200/50" />
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500">
                  <ShoppingCart size={16} strokeWidth={2.5} />
                </div>
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t.achats}</span>
              </div>
              <p className="text-2xl font-black text-rose-600 tracking-tighter">
                {filteredTotals.totalExpense.toLocaleString('fr-FR')} 
                <span className="text-xs ml-1 font-bold text-slate-400 uppercase">{currency}</span>
              </p>
            </div>

            <div className="space-y-1 pl-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-500">
                  <Plus size={16} strokeWidth={2.5} />
                </div>
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t.retraits}</span>
              </div>
              <p className="text-2xl font-black text-sky-600 tracking-tighter">
                {filteredTotals.totalIncome.toLocaleString('fr-FR')} 
                <span className="text-xs ml-1 font-bold text-slate-400 uppercase">{currency}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions - Identical to Home style */}
      <div className="grid grid-cols-2 gap-4 px-1 mb-6">
        <button 
          onClick={() => onAddClick('EXPENSE')}
          className="group relative flex flex-col items-center justify-center gap-3 h-28 bg-white border-2 border-slate-50 rounded-[28px] transition-all hover:border-rose-100 hover:bg-rose-50/30 active:scale-95 shadow-sm"
        >
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
            <ShoppingBag size={24} strokeWidth={2.5} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-rose-600 transition-colors">
            {t.ajouterAchat}
          </span>
        </button>
        <button 
          onClick={() => onAddClick('INCOME')}
          className="group relative flex flex-col items-center justify-center gap-3 h-28 bg-white border-2 border-slate-50 rounded-[28px] transition-all hover:border-teal-100 hover:bg-teal-50/30 active:scale-95 shadow-sm"
        >
          <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
            <ArrowDownToLine size={24} strokeWidth={2.5} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-teal-600 transition-colors">
            {t.ajouterRetrait}
          </span>
        </button>
      </div>

      {/* New Professional Filter Pills Section */}
      <div className="grid grid-cols-2 gap-2 px-1">
        {/* Date Filter Pill */}
        <button 
          onClick={() => setActiveInlineMenu(activeInlineMenu === 'DATE' ? null : 'DATE')}
          className={`flex items-center gap-2 px-2 py-2.5 rounded-[28px] transition-all active:scale-95 shadow-sm border ${activeInlineMenu === 'DATE' ? 'bg-emerald-900 border-emerald-900 text-white' : 'bg-emerald-50/40 border-emerald-100/50 hover:bg-emerald-100/40'}`}
        >
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${activeInlineMenu === 'DATE' ? 'bg-white/20 border-white/20 text-white' : 'bg-white border-emerald-50 text-emerald-600'}`}>
            <Calendar size={16} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col items-start leading-none min-w-0 text-left">
            <span className={`text-[8px] font-bold uppercase tracking-tighter shrink-0 ${activeInlineMenu === 'DATE' ? 'text-emerald-100/60' : 'text-slate-400'}`}>{language === 'العربية' ? 'التاريخ' : 'Date'}</span>
            <span className={`text-[10px] font-black truncate w-full ${activeInlineMenu === 'DATE' ? 'text-white' : 'text-emerald-800'}`}>
              {startDate || endDate ? (language === 'العربية' ? 'مخصص' : 'Perso.') : (language === 'العربية' ? 'Aujourd\'hui' : 'Aujourd\'hui')}
            </span>
          </div>
        </button>

        {/* Type Filter Pill */}
        <button 
          onClick={() => setActiveInlineMenu(activeInlineMenu === 'TYPE' ? null : 'TYPE')}
          className={`flex items-center gap-2 px-2 py-2.5 rounded-[28px] transition-all active:scale-95 shadow-sm border ${activeInlineMenu === 'TYPE' ? 'bg-indigo-900 border-indigo-900 text-white' : 'bg-indigo-50/40 border-indigo-100/50 hover:bg-indigo-100/40'}`}
        >
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${activeInlineMenu === 'TYPE' ? 'bg-white/20 border-white/20 text-white' : 'bg-white border-indigo-50 text-indigo-600'}`}>
            <ListFilter size={16} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col items-start leading-none min-w-0 text-left">
            <span className={`text-[8px] font-bold uppercase tracking-tighter shrink-0 ${activeInlineMenu === 'TYPE' ? 'text-indigo-100/60' : 'text-slate-400'}`}>{language === 'العربية' ? 'النوع' : 'Type'}</span>
            <span className={`text-[10px] font-black truncate w-full ${activeInlineMenu === 'TYPE' ? 'text-white' : 'text-indigo-800'}`}>
              {filter === 'ALL' ? t.tous : (filter === 'EXPENSE' ? t.achats : t.retraits)}
            </span>
          </div>
        </button>

        {/* Category Filter Pill */}
        <button 
          onClick={() => setActiveInlineMenu(activeInlineMenu === 'CATEGORY' ? null : 'CATEGORY')}
          className={`flex items-center gap-2 px-2 py-2.5 rounded-[28px] transition-all active:scale-95 shadow-sm border ${activeInlineMenu === 'CATEGORY' ? 'bg-rose-900 border-rose-900 text-white' : 'bg-rose-50/40 border-rose-100/50 hover:bg-rose-100/40'}`}
        >
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${activeInlineMenu === 'CATEGORY' ? 'bg-white/20 border-white/20 text-white' : 'bg-white border-rose-50 text-rose-600'}`}>
            <Tag size={16} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col items-start leading-none min-w-0 text-left">
            <span className={`text-[8px] font-bold uppercase tracking-tighter shrink-0 ${activeInlineMenu === 'CATEGORY' ? 'text-rose-100/60' : 'text-slate-400'}`}>{language === 'العربية' ? 'فئة' : 'Catégorie'}</span>
            <span className={`text-[10px] font-black truncate w-full ${activeInlineMenu === 'CATEGORY' ? 'text-white' : 'text-rose-700'}`}>
              {selectedCategory === t.tous ? (language === 'العربية' ? 'الكل' : 'Toutes') : selectedCategory}
            </span>
          </div>
        </button>

        {/* Search Filter Pill */}
        <button 
          onClick={() => setActiveInlineMenu(activeInlineMenu === 'SEARCH' ? null : 'SEARCH')}
          className={`flex items-center gap-2 px-2 py-2.5 rounded-[28px] transition-all active:scale-95 shadow-sm border ${activeInlineMenu === 'SEARCH' ? 'bg-amber-900 border-amber-900 text-white' : 'bg-amber-50/40 border-amber-100/50 hover:bg-amber-100/40'}`}
        >
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${activeInlineMenu === 'SEARCH' ? 'bg-white/20 border-white/20 text-white' : 'bg-white border-amber-50 text-amber-600'}`}>
            <Search size={16} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col items-start leading-none min-w-0 text-left">
            <span className={`text-[8px] font-bold uppercase tracking-tighter shrink-0 ${activeInlineMenu === 'SEARCH' ? 'text-amber-100/60' : 'text-slate-400'}`}>{language === 'العربية' ? 'بحث' : 'Recherche'}</span>
            <span className={`text-[10px] font-black truncate w-full ${activeInlineMenu === 'SEARCH' ? 'text-white' : 'text-amber-800'}`}>
              {searchQuery ? searchQuery : (language === 'العربية' ? 'الكل' : 'Tous')}
            </span>
          </div>
        </button>
      </div>

      {/* Unified Inline Expansion Menu */}
      <AnimatePresence mode="wait">
        {activeInlineMenu && (
          <motion.div
            key={activeInlineMenu}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="overflow-hidden bg-white/95 rounded-[32px] border border-white/80 shadow-lg shadow-slate-200/40 mx-1"
          >
            <div className="p-6">
              {activeInlineMenu === 'DATE' && (
                <div className="space-y-4 text-center">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{language === 'العربية' ? 'فلتر التاريخ' : 'Filtre Date'}</span>
                    {(startDate || endDate) && (
                      <button onClick={clearDateRange} className="px-3 py-1.5 rounded-lg bg-rose-50 text-[9px] font-black uppercase text-rose-500 flex items-center gap-2 transition-all hover:bg-rose-100">
                        <X size={12} />
                        Effacer
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5 text-left">
                      <label className="text-[8px] font-black uppercase text-slate-400 tracking-tighter ml-2">DEP.</label>
                      <input 
                        type="date" 
                        className="w-full bg-slate-50 border-none rounded-xl p-3 text-[10px] font-bold text-slate-700 outline-none transition-all focus:bg-slate-100"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5 text-left">
                      <label className="text-[8px] font-black uppercase text-slate-400 tracking-tighter ml-2">JUSQ.</label>
                      <input 
                        type="date" 
                        className="w-full bg-slate-50 border-none rounded-xl p-3 text-[10px] font-bold text-slate-700 outline-none transition-all focus:bg-slate-100"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeInlineMenu === 'TYPE' && (
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => { setFilter('ALL'); setActiveInlineMenu(null); }}
                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${filter === 'ALL' ? 'border-indigo-600 bg-indigo-600 text-white shadow-md' : 'border-slate-50 bg-slate-50/50 text-slate-400'}`}
                  >
                    <LayoutGrid size={20} />
                    <span className="text-[9px] font-black uppercase tracking-tight">{t.tous}</span>
                  </button>
                  <button 
                    onClick={() => { setFilter('EXPENSE'); setActiveInlineMenu(null); }}
                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${filter === 'EXPENSE' ? 'border-rose-500 bg-rose-500 text-white shadow-md' : 'border-slate-50 bg-slate-50/50 text-slate-400'}`}
                  >
                    <ShoppingBag size={20} />
                    <span className="text-[9px] font-black uppercase tracking-tight">{t.achats}</span>
                  </button>
                  <button 
                    onClick={() => { setFilter('INCOME'); setActiveInlineMenu(null); setSelectedCategory(t.tous); }}
                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${filter === 'INCOME' ? 'border-sky-500 bg-sky-500 text-white shadow-md' : 'border-slate-50 bg-slate-50/50 text-slate-400'}`}
                  >
                    <ArrowDownToLine size={20} />
                    <span className="text-[9px] font-black uppercase tracking-tight">{t.retraits}</span>
                  </button>
                </div>
              )}

              {activeInlineMenu === 'CATEGORY' && (
                <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto px-1 py-1">
                  <button 
                    onClick={() => { setSelectedCategory(t.tous); setActiveInlineMenu(null); }}
                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${selectedCategory === t.tous ? 'border-slate-900 bg-slate-900 text-white shadow-md' : 'border-slate-50 bg-slate-50/50 text-slate-400'}`}
                  >
                    <LayoutGrid size={20} />
                    <span className="text-[9px] font-black uppercase tracking-tight line-clamp-1">{t.tous}</span>
                  </button>
                  {CATEGORY_MAP.map(cat => (
                    <button 
                      key={cat.label}
                      onClick={() => { setSelectedCategory(cat.label); setActiveInlineMenu(null); }}
                      className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${selectedCategory === cat.label ? `border-${cat.color}-600 bg-${cat.color}-600 text-white shadow-md` : 'border-slate-50 bg-slate-50/50 text-slate-400'}`}
                    >
                      <div className={selectedCategory === cat.label ? 'text-white' : cat.text}>
                        {cat.icon}
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-tight line-clamp-1 w-full text-center">{cat.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {activeInlineMenu === 'SEARCH' && (
                <div className="space-y-4 text-center">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{language === 'العربية' ? 'بحث بالإسم' : 'Recherche par nom'}</span>
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="px-3 py-1.5 rounded-lg bg-rose-50 text-[9px] font-black uppercase text-rose-500 flex items-center gap-2 transition-all hover:bg-rose-100">
                        <X size={12} />
                        Effacer
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-12 text-sm font-black text-slate-700 outline-none transition-all focus:bg-slate-100 placeholder:text-slate-300 placeholder:font-bold"
                      placeholder={language === 'العربية' ? 'ابحث عن عنصر...' : 'Rechercher un article...'}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} strokeWidth={2.5} />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      <div className="space-y-4 pb-8" style={{ height: "calc(100vh - 210px)" }}>
        <Virtuoso
          className="w-full h-full"
          data={filteredTransactions}
          totalCount={filteredTransactions.length}
          itemContent={(index, tx) => {
            // Case-insensitive matching to handle "TRANSPORT" vs "Transport"
            const isExpense = tx.type === 'EXPENSE';
            const isCreditPlus = tx.category === t.owedToMe || tx.category === 'Crédit +';
            const isCreditMinus = tx.category === t.owedByMe || tx.category === 'Crédit --';

            const categoryMatch = (CATEGORY_MAP || []).find(c => 
              c.label && c.label.toLowerCase() === (tx.category || '').toLowerCase()
            ) || {
              icon: isCreditPlus ? <TrendingUp size={24} /> : (isCreditMinus ? <TrendingDown size={24} /> : (tx.type === 'EXPENSE' ? <ShoppingBag size={24} /> : <ArrowDownToLine size={24} />)),
              color: isCreditPlus ? 'indigo' : (isCreditMinus ? 'amber' : (isExpense ? 'slate' : 'emerald')),
              bg: isCreditPlus ? 'bg-indigo-600' : (isCreditMinus ? 'bg-amber-500' : (isExpense ? 'bg-slate-100' : 'bg-emerald-500')),
              text: isCreditPlus ? 'text-white' : (isCreditMinus ? 'text-white' : (isExpense ? 'text-slate-600' : 'text-white')),
              glow: isCreditPlus ? 'bg-indigo-400' : (isCreditMinus ? 'bg-amber-400' : (isExpense ? 'bg-slate-400' : 'bg-emerald-400'))
            };

            const info = getArticleInfo(tx.label, tx.category, predefinedItems);
            const CustomIconComp = info.iconName ? ICON_MAP[info.iconName] : null;

            const getCardStyle = () => {
              if (isCreditPlus) return 'bg-indigo-50/30 border-indigo-100/50 hover:border-indigo-200 hover:shadow-indigo-500/5';
              if (isCreditMinus) return 'bg-amber-50/30 border-amber-100/50 hover:border-amber-200 hover:shadow-amber-500/5';
              if (!isExpense) return 'bg-emerald-50/30 border-emerald-100/50 hover:border-emerald-200 hover:shadow-emerald-500/5';
              return `bg-white border-slate-100 shadow-sm ${getHoverColor(categoryMatch.color)}`;
            };

            const getHoverColor = (color: string) => {
              const colors: Record<string, string> = {
                'amber': 'hover:border-amber-200 hover:shadow-amber-500/10',
                'rose': 'hover:border-rose-200 hover:shadow-rose-500/10',
                'sky': 'hover:border-sky-200 hover:shadow-sky-500/10',
                'purple': 'hover:border-purple-200 hover:shadow-purple-500/10',
                'slate': 'hover:border-slate-200 hover:shadow-slate-500/10',
                'emerald': 'hover:border-emerald-200 hover:shadow-emerald-500/10',
                'teal': 'hover:border-teal-200 hover:shadow-teal-500/10'
              };
              return colors[color] || 'hover:border-slate-200';
            };

            if (isCreditPlus || isCreditMinus) {
              const isReceive = isCreditPlus;
              return (
                <div key={tx.id} className="py-2">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 }}
                  className={`group flex items-center gap-4 p-5 rounded-[32px] border transition-transform relative shadow-sm ${
                    isReceive
                      ? "bg-indigo-50/30 border-indigo-100/50 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/10"
                      : "bg-amber-50/30 border-amber-100/50 hover:border-amber-200 hover:shadow-xl hover:shadow-amber-500/10"
                  }`}
                  style={{
                    overflow: activeMenuId === tx.id ? "visible" : "hidden",
                    zIndex: activeMenuId === tx.id ? 50 : 1,
                  }}
                >
                  <div
                    className={`shrink-0 w-14 h-14 rounded-[22px] flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-sm ${
                      isReceive
                        ? "bg-indigo-600 text-white shadow-indigo-600/20"
                        : "bg-amber-500 text-white shadow-amber-500/20"
                    }`}
                  >
                    {isReceive ? (
                      <TrendingUp size={24} />
                    ) : (
                      <TrendingDown size={24} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-center py-1">
                    <p className="font-black text-slate-800 text-sm tracking-tight truncate mb-1 italic select-none">
                      {tx.label.replace(/Prêt à |Emprunt de /i, '')}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
                      <span className="text-[9px] flex items-center gap-1 font-bold uppercase tracking-wider text-slate-400 shrink-0">
                        <Calendar
                          size={10}
                          className={
                            isReceive ? "text-indigo-500" : "text-amber-500"
                          }
                        />
                        {tx.date}
                      </span>
                      <span
                        className={`text-[9px] font-black uppercase tracking-[0.1em] truncate max-w-[100px] ${isReceive ? "text-indigo-600" : "text-amber-600"}`}
                      >
                        {isReceive ? t.owedToMe : t.owedByMe}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2 pl-2 border-l border-slate-100">
                    <div className="flex flex-col items-end">
                      <p
                        className={`font-black tracking-tighter text-base leading-none ${isReceive ? "text-indigo-600" : "text-amber-600"}`}
                      >
                        {tx.amount.toLocaleString("fr-FR")}
                      </p>
                      <span className="text-[9px] font-bold uppercase text-slate-400 mt-0.5">
                        {currency}
                      </span>
                    </div>

                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setActiveMenuId(
                            activeMenuId === tx.id ? null : tx.id,
                          );
                        }}
                        className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-xl transition-colors text-slate-300 group-hover:text-slate-500 relative z-[60]"
                      >
                        <MoreVertical size={20} />
                      </button>

                      <AnimatePresence>
                        {activeMenuId === tx.id && (
                          <>
                            <div
                              className="fixed inset-0 z-[80]"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setActiveMenuId(null);
                              }}
                            />
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: 10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: 10 }}
                              className="absolute right-0 top-12 bg-white border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl py-2 w-48 z-[150] overflow-hidden"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={() => handleEdit(tx)}
                                className="w-full px-5 py-3.5 text-left text-xs font-black text-slate-600 hover:bg-slate-50 hover:text-teal-600 flex items-center gap-3 transition-colors uppercase tracking-widest whitespace-nowrap active:bg-slate-100"
                              >
                                <Pencil size={15} />
                                Modifier
                              </button>
                              <div className="h-px bg-slate-50 mx-4 my-1" />
                              <button
                                onClick={() => {
                                  if (window.confirm('Supprimer cette transaction ?')) {
                                    onDelete(tx.id);
                                    setActiveMenuId(null);
                                  }
                                }}
                                className="w-full px-5 py-3.5 text-left text-xs font-black text-rose-500 hover:bg-rose-50 flex items-center gap-3 transition-colors uppercase tracking-widest whitespace-nowrap active:bg-rose-100"
                              >
                                <Trash2 size={15} />
                                Supprimer
                              </button>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
                </div>
              );
            }

            return (
              <div key={tx.id} className="py-2">
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.03 }}
                className={`flex items-center gap-4 p-4 rounded-[32px] border transition-transform group relative ${getCardStyle()}`}
                style={{ 
                  overflow: activeMenuId === tx.id ? 'visible' : 'hidden',
                  zIndex: activeMenuId === tx.id ? 50 : 1
                }}
              >
                {/* Icon Container */}
                <div className={`w-14 h-14 rounded-[22px] flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-sm ${
                  (!isExpense && !isCreditPlus && !isCreditMinus) 
                    ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                    : `${categoryMatch.bg} ${categoryMatch.text}`
                }`}>
                  {(isExpense || isCreditPlus || isCreditMinus) ? (
                    info.iconSvg ? (
                      <div dangerouslySetInnerHTML={{ __html: info.iconSvg }} className="w-6 h-6 text-current" />
                    ) : (CustomIconComp ? <CustomIconComp size={24} /> : categoryMatch.icon)
                  ) : <ArrowDownToLine size={24} />}
                </div>
                
                {/* Content middle */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col gap-1">
                    {tx.amount > 1000 && (
                      <span className="w-fit px-2 py-0.5 rounded-lg bg-indigo-500 text-white text-[7px] font-black uppercase tracking-widest mb-0.5">
                        {t.important}
                      </span>
                    )}
                    <p className="font-black text-slate-800 text-sm tracking-tight truncate leading-tight">
                      {tx.label}
                    </p>
                    <span className="text-[10px] flex items-center gap-1 font-bold text-slate-400">
                      <Calendar size={10} className="text-slate-300" />
                      {tx.date}
                    </span>
                  </div>
                </div>

                {/* Amount and category right */}
                <div className="text-right flex items-center gap-2">
                  <div className="flex flex-col items-end gap-1">
                    <p className={`font-black tracking-tighter text-lg leading-none ${!isExpense ? 'text-emerald-600' : (isCreditMinus ? 'text-amber-600' : (isCreditPlus ? 'text-indigo-600' : 'text-slate-900'))}`}>
                      {!isExpense ? '+' : '-'}{tx.amount.toLocaleString('fr-FR')} 
                      <span className="text-[11px] ml-1 font-bold uppercase text-slate-400">{currency}</span>
                    </p>
                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-white/50 border border-slate-100/50">
                       <Tag size={10} className={isExpense ? categoryMatch.text : 'text-emerald-600'} />
                       <span className={`text-[9px] font-black uppercase tracking-wider ${isExpense ? categoryMatch.text : 'text-emerald-600'}`}>
                         {(isCreditPlus || isCreditMinus) ? tx.category : (tx.category ? tx.category : (isExpense ? t.autres : t.retraits))}
                       </span>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveMenuId(activeMenuId === tx.id ? null : tx.id);
                      }}
                      className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 rounded-xl transition-colors text-slate-300 group-hover:text-slate-500 relative z-[60]"
                    >
                      <MoreVertical size={20} />
                    </button>
                    
                    <AnimatePresence>
                      {activeMenuId === tx.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-[80]" 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setActiveMenuId(null);
                            }}
                          />
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="absolute right-0 top-12 bg-white border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl py-2 w-48 z-[150] overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button 
                              onClick={() => handleEdit(tx)}
                              className="w-full px-5 py-3.5 text-left text-xs font-black text-slate-600 hover:bg-slate-50 hover:text-teal-600 flex items-center gap-3 transition-colors uppercase tracking-widest whitespace-nowrap active:bg-slate-100"
                            >
                              <Pencil size={15} />
                              Modifier
                            </button>
                            <div className="h-px bg-slate-50 mx-4 my-1" />
                            <button 
                              onClick={() => { 
                                if(window.confirm('Supprimer cette transaction ?')) {
                                  onDelete(tx.id); 
                                  setActiveMenuId(null); 
                                }
                              }}
                              className="w-full px-5 py-3.5 text-left text-xs font-black text-rose-500 hover:bg-rose-50 flex items-center gap-3 transition-colors uppercase tracking-widest whitespace-nowrap active:bg-rose-100"
                            >
                              <Trash2 size={15} />
                              Supprimer
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
              </div>
            );
          }}
        />

        {/* Inline Edit Modal */}
        <AnimatePresence>
          {editingTx && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/60"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-[32px] w-full max-w-sm p-8 shadow-2xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-black text-slate-800">Modifier l'achat</h3>
                  <button onClick={() => setEditingTx(null)} className="p-2 bg-slate-50 rounded-full text-slate-400">
                    <X size={20} />
                  </button>
                </div>
                
                <form onSubmit={handleSaveEdit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Libellé</label>
                    <input 
                      type="text" 
                      required
                      value={editingTx.label}
                      onChange={(e) => setEditingTx({...editingTx, label: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-teal-brand/20 transition-all"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Montant ({currency})</label>
                    <input 
                      type="number" 
                      step="0.01"
                      required
                      value={isNaN(editingTx.amount) ? '' : editingTx.amount}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setEditingTx({...editingTx, amount: isNaN(val) ? NaN : val});
                      }}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-teal-brand/20 transition-all font-mono"
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full py-5 bg-teal-brand text-white rounded-[24px] font-black uppercase tracking-widest shadow-lg shadow-teal-brand/20 active:scale-95 transition-all mt-4"
                  >
                    Enregistrer les modifications
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {filteredTransactions.length === 0 && (
          <div className="py-20 text-center space-y-4">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                <Filter size={32} />
             </div>
              <p className="text-slate-400 font-medium text-sm">{t.noResult}</p>
              <button 
                onClick={() => {setFilter('ALL'); setSearchQuery(''); setSelectedCategory(t.tous); clearDateRange();}}
                className="text-xs font-black text-teal-brand uppercase tracking-widest hover:underline"
              >
                {t.resetFilters}
              </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function FilterTab({ active, onClick, label, color = "text-slate-500", bg = "bg-slate-100" }: { active: boolean, onClick: () => void, label: string, color?: string, bg?: string }) {
  return (
    <button 
      onClick={onClick}
      className={`px-6 py-2.5 rounded-2xl text-xs font-black transition-all whitespace-nowrap shadow-sm ${active ? `${bg} ${color}` : 'bg-white text-slate-400 border border-slate-100'}`}
    >
      {label}
    </button>
  );
}
