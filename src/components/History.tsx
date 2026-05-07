import React, { useState } from 'react';
import { 
  CalendarCheck,
  CalendarDays,
  CalendarRange,
  ShoppingCart,
  Plus,
  Filter, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpDown,
  Download,
  Calendar,
  Tag,
  X,
  ChevronDown,
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
  ListFilter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Transaction {
  id: string;
  label: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  category?: string;
  date: string;
}



interface HistoryProps {
  transactions: Transaction[];
  language: string;
  currency: string;
  onDelete: (id: string) => void;
  onUpdate: (id: string, tx: Partial<Transaction>) => void;
}

type FilterType = 'ALL' | 'INCOME' | 'EXPENSE';
type SortType = 'DATE_DESC' | 'DATE_ASC' | 'AMOUNT_DESC' | 'AMOUNT_ASC';

export default function History({ transactions, language, currency, onDelete, onUpdate }: HistoryProps) {
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
    { label: t.nourriture, icon: <Utensils size={24} />, color: 'teal', bg: 'bg-teal-100', text: 'text-teal-600', glow: 'bg-teal-400', activeBg: 'bg-teal-500', activeText: 'text-white' },
    { label: t.shopping, icon: <ShoppingBag size={24} />, color: 'rose', bg: 'bg-rose-100', text: 'text-rose-600', glow: 'bg-rose-400', activeBg: 'bg-rose-500', activeText: 'text-white' },
    { label: t.transport, icon: <Car size={24} />, color: 'sky', bg: 'bg-sky-100', text: 'text-sky-600', glow: 'bg-sky-400', activeBg: 'bg-sky-500', activeText: 'text-white' },
    { label: t.loisirs, icon: <Gamepad2 size={24} />, color: 'purple', bg: 'bg-purple-100', text: 'text-purple-600', glow: 'bg-purple-400', activeBg: 'bg-purple-500', activeText: 'text-white' },
    { label: t.owedToMe, icon: <TrendingUp size={24} />, color: 'indigo', bg: 'bg-indigo-100', text: 'text-indigo-600', glow: 'bg-indigo-400', activeBg: 'bg-indigo-500', activeText: 'text-white' },
    { label: t.owedByMe, icon: <TrendingDown size={24} />, color: 'amber', bg: 'bg-amber-100', text: 'text-amber-600', glow: 'bg-amber-400', activeBg: 'bg-amber-500', activeText: 'text-white' },
    { label: t.autres, icon: <MoreHorizontal size={24} />, color: 'slate', bg: 'bg-slate-100', text: 'text-slate-600', glow: 'bg-slate-400', activeBg: 'bg-slate-500', activeText: 'text-white' },
  ];

  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month'>('week');
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [sortBy, setSortBy] = useState<SortType>('DATE_DESC');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(t.tous);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

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
        if (tx.type === 'EXPENSE') totalExpense += tx.amount;
        else totalIncome += tx.amount;
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
      const matchesFilter = filter === 'ALL' || tx.type === filter;
      const matchesSearch = tx.label.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === t.tous || tx.category === selectedCategory;
      
      let matchesRange = true;
      if (startDate || endDate) {
        const txDate = parseTxDate(tx.date);
        txDate.setHours(0, 0, 0, 0);

        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          if (txDate < start) matchesRange = false;
        }
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(0, 0, 0, 0);
          if (txDate > end) matchesRange = false;
        }
      }

      return matchesFilter && matchesSearch && matchesRange && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'DATE_DESC': return b.date.localeCompare(a.date);
        case 'DATE_ASC': return a.date.localeCompare(b.date);
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
          <div className="flex bg-white/40 backdrop-blur-md p-1 rounded-3xl shadow-sm border border-white/50 mb-8">
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

      {/* New Professional Filter Pills Section */}
      <div className="grid grid-cols-3 gap-2 px-1">
        {/* Date Filter Pill */}
        <button 
          onClick={() => setShowDatePicker(!showDatePicker)}
          className="flex items-center gap-3 px-3 py-2.5 bg-emerald-50/40 border border-emerald-100/50 rounded-[28px] transition-all active:scale-95 hover:bg-emerald-100/40 shadow-sm"
        >
          <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-50">
            <Calendar size={18} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col items-start leading-tight min-w-0">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter shrink-0">{language === 'العربية' ? 'التاريخ' : 'Date'}:</span>
            <span className="text-xs font-black text-emerald-800 truncate w-full">
              {startDate || endDate ? (language === 'العربية' ? 'مخصص' : 'Perso.') : (language === 'العربية' ? 'الشهر الماضي' : 'Mois dernier')}
            </span>
          </div>
        </button>

        {/* Type Filter Pill */}
        <button 
          onClick={() => setShowFilterModal(true)}
          className="flex items-center gap-3 px-3 py-2.5 bg-indigo-50/40 border border-indigo-100/50 rounded-[28px] transition-all active:scale-95 hover:bg-indigo-100/40 shadow-sm"
        >
          <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-indigo-600 shrink-0 border border-indigo-50">
            <ListFilter size={18} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col items-start leading-tight min-w-0">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter shrink-0">{language === 'العربية' ? 'النوع' : 'Type'}:</span>
            <span className="text-xs font-black text-indigo-800 truncate w-full">
              {filter === 'ALL' ? t.tous : (filter === 'EXPENSE' ? t.achats : t.retraits)}
            </span>
          </div>
        </button>

        {/* Category Filter Pill */}
        <button 
          onClick={() => {
            // If the category bar is hidden because filter is INCOME, we still want to show all/toutes
            if (filter !== 'INCOME') {
              // category bar is visible below, scrolling to it or just letting user see it
            }
          }}
          className="flex items-center gap-3 px-3 py-2.5 bg-rose-50/40 border border-rose-100/50 rounded-[28px] transition-all active:scale-95 hover:bg-rose-100/40 shadow-sm"
        >
          <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-rose-600 shrink-0 border border-rose-50">
            <Tag size={18} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col items-start leading-tight min-w-0">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter shrink-0">{language === 'العربية' ? 'فيئة' : 'Catégorie'}:</span>
            <span className="text-xs font-black text-rose-700 truncate w-full">
              {selectedCategory === t.tous ? (language === 'العربية' ? 'الكل' : 'Toutes') : selectedCategory}
            </span>
          </div>
        </button>
      </div>

      {/* Artistic Category Icons Bar - Only shown if expense filter is active */}
      {filter !== 'INCOME' && (
        <div className="flex items-center justify-between px-3 bg-white/40 backdrop-blur-md py-4 rounded-[32px] border border-white/60 shadow-sm mx-1">
          <button 
             onClick={() => setSelectedCategory(t.tous)}
             className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${selectedCategory === t.tous ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}
          >
             <LayoutGrid size={20} />
          </button>
          {CATEGORY_MAP.map(cat => (
            <button
              key={cat.label}
              onClick={() => setSelectedCategory(cat.label)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 active:scale-75 relative group ${
                selectedCategory === cat.label 
                  ? `${cat.activeBg} ${cat.activeText} shadow-md scale-110` 
                  : `${cat.bg} ${cat.text} opacity-60 hover:opacity-100`
              }`}
            >
              {cat.icon}
            </button>
          ))}
        </div>
      )}

        {/* Date Range Picker */}
        <AnimatePresence>
          {showDatePicker && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-white rounded-[32px] border-2 border-slate-50 shadow-xl shadow-slate-200/50"
            >
              <div className="p-6 space-y-5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Période personnalisé</span>
                  {(startDate || endDate) && (
                    <button onClick={clearDateRange} className="px-3 py-1.5 rounded-lg bg-rose-50 text-[10px] font-black uppercase text-rose-500 flex items-center gap-2 transition-all hover:bg-rose-100">
                      <X size={12} />
                      Effacer
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-tighter ml-2">DEPUIS</label>
                    <input 
                      type="date" 
                      className="w-full bg-slate-50 border-none rounded-2xl p-3 text-xs font-bold text-slate-700 outline-none transition-all focus:bg-slate-100"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-tighter ml-2">JUSQU'À</label>
                    <input 
                      type="date" 
                      className="w-full bg-slate-50 border-none rounded-2xl p-3 text-xs font-bold text-slate-700 outline-none transition-all focus:bg-slate-100"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      {/* Sorting Controls */}
      <div className="flex items-center justify-between bg-slate-50/30 px-5 py-4 rounded-[24px] border border-slate-100/50">
        <div className="flex items-center gap-3 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
          <ArrowUpDown size={14} className="text-rose-500" />
          <span>{t.sortBy}</span>
        </div>
        <button 
          onClick={() => setShowSortModal(true)}
          className="text-[11px] font-black text-slate-700 flex items-center gap-2 transition-all active:scale-95 bg-white py-2 px-4 rounded-xl shadow-sm border border-slate-100"
        >
          {sortBy === 'DATE_DESC' ? t.dateRecent : 
           sortBy === 'DATE_ASC' ? t.dateAncien : 
           sortBy === 'AMOUNT_DESC' ? t.montantMax : t.montantMin}
          <ChevronDown size={14} className="text-rose-500" />
        </button>
      </div>

      {/* Premium Type Filter Modal (Bottom Sheet) */}
      <AnimatePresence>
        {showFilterModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilterModal(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[100]"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[40px] z-[101] p-10 shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-10" />
              
              <h3 className="text-2xl font-black text-slate-900 mb-8 text-center tracking-tight">{language === 'العربية' ? 'نوع المعاملة' : 'Type de Transaction'}</h3>
              
              <div className="grid grid-cols-1 gap-4">
                <button 
                  onClick={() => { setFilter('ALL'); setShowFilterModal(false); }}
                  className={`flex items-center gap-4 p-5 rounded-3xl border-2 transition-all ${filter === 'ALL' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-50 bg-slate-50 text-slate-500'}`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${filter === 'ALL' ? 'bg-indigo-500 text-white' : 'bg-white text-slate-400 shadow-sm'}`}>
                    <LayoutGrid size={24} />
                  </div>
                  <span className="text-lg font-black uppercase tracking-tight">{t.tous}</span>
                </button>
                
                <button 
                  onClick={() => { setFilter('EXPENSE'); setShowFilterModal(false); }}
                  className={`flex items-center gap-4 p-5 rounded-3xl border-2 transition-all ${filter === 'EXPENSE' ? 'border-rose-500 bg-rose-50 text-rose-700' : 'border-slate-50 bg-slate-50 text-slate-500'}`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${filter === 'EXPENSE' ? 'bg-rose-500 text-white' : 'bg-white text-slate-400 shadow-sm'}`}>
                    <ShoppingBag size={24} />
                  </div>
                  <span className="text-lg font-black uppercase tracking-tight">{t.achats}</span>
                </button>
                
                <button 
                  onClick={() => { setFilter('INCOME'); setShowFilterModal(false); setSelectedCategory(t.tous); }}
                  className={`flex items-center gap-4 p-5 rounded-3xl border-2 transition-all ${filter === 'INCOME' ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-slate-50 bg-slate-50 text-slate-500'}`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${filter === 'INCOME' ? 'bg-sky-500 text-white' : 'bg-white text-slate-400 shadow-sm'}`}>
                    <ArrowDownToLine size={24} />
                  </div>
                  <span className="text-lg font-black uppercase tracking-tight">{t.retraits}</span>
                </button>
              </div>

              <div className="mt-10 pt-6 border-t border-slate-50">
                <button 
                  onClick={() => setShowFilterModal(false)}
                  className="w-full py-4 text-xs font-black text-slate-400 uppercase tracking-[0.3em]"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Premium Sort Modal (Bottom Sheet) */}
      <AnimatePresence>
        {showSortModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSortModal(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[100]"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[40px] z-[101] p-10 shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-10" />
              
              <h3 className="text-2xl font-black text-slate-900 mb-8 text-center tracking-tight">{t.sortBy}</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <SortOption 
                  label={t.dateRecent} 
                  active={sortBy === 'DATE_DESC'} 
                  onClick={() => { setSortBy('DATE_DESC'); setShowSortModal(false); }} 
                  icon={<Calendar size={22} />}
                  color="rose"
                />
                <SortOption 
                  label={t.dateAncien} 
                  active={sortBy === 'DATE_ASC'} 
                  onClick={() => { setSortBy('DATE_ASC'); setShowSortModal(false); }} 
                  icon={<Calendar size={22} className="opacity-50" />}
                  color="rose"
                />
                <SortOption 
                  label={t.montantMax} 
                  active={sortBy === 'AMOUNT_DESC'} 
                  onClick={() => { setSortBy('AMOUNT_DESC'); setShowSortModal(false); }} 
                  icon={<TrendingUp size={22} />}
                  color="rose"
                />
                <SortOption 
                  label={t.montantMin} 
                  active={sortBy === 'AMOUNT_ASC'} 
                  onClick={() => { setSortBy('AMOUNT_ASC'); setShowSortModal(false); }} 
                  icon={<TrendingDown size={22} />}
                  color="rose"
                />
              </div>

              <div className="mt-10 pt-6 border-t border-slate-50">
                <button 
                  onClick={() => setShowSortModal(false)}
                  className="w-full py-4 text-xs font-black text-slate-400 uppercase tracking-[0.3em]"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* List */}
      <div className="space-y-4 pb-8">
        <AnimatePresence mode="popLayout">
          {filteredTransactions.map((tx, index) => {
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

            const getCardStyle = () => {
              if (isCreditPlus) return 'bg-indigo-50/30 border-indigo-100/50 hover:border-indigo-200';
              if (isCreditMinus) return 'bg-amber-50/30 border-amber-100/50 hover:border-amber-200';
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
                'indigo': 'hover:border-indigo-200 hover:shadow-indigo-500/10',
                'emerald': 'hover:border-emerald-200 hover:shadow-emerald-500/10',
                'teal': 'hover:border-teal-200 hover:shadow-teal-500/10'
              };
              return colors[color] || 'hover:border-slate-200';
            };

            return (
              <motion.div 
                key={tx.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.03 }}
                className={`flex items-center gap-4 p-4 rounded-[32px] border transition-all group relative backdrop-blur-sm ${getCardStyle()}`}
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
                  {(isExpense || isCreditPlus || isCreditMinus) ? categoryMatch.icon : <ArrowDownToLine size={24} />}
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
            );
          })}
        </AnimatePresence>

        {/* Inline Edit Modal */}
        <AnimatePresence>
          {editingTx && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm"
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

function SortOption({ label, active, onClick, icon, color = "indigo" }: { label: string, active: boolean, onClick: () => void, icon: React.ReactNode, color?: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-4 p-7 rounded-[38px] border-2 transition-all active:scale-95 ${
        active 
          ? `border-${color}-500 bg-${color}-50/50 text-${color}-600 shadow-xl shadow-${color}-500/10 scale-[1.02]` 
          : 'border-slate-50 bg-slate-50 text-slate-400'
      }`}
    >
      <div className={`w-14 h-14 rounded-[22px] flex items-center justify-center transition-all ${
        active 
          ? `bg-${color}-500 text-white shadow-lg shadow-${color}-500/30` 
          : 'bg-white shadow-sm'
      }`}>
        {icon}
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      {active && (
        <motion.div 
          layoutId="activeSort"
          className={`w-1.5 h-1.5 bg-${color}-500 rounded-full mt-1`}
        />
      )}
    </button>
  );
}
