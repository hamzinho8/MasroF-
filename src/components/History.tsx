import React, { useState } from 'react';
import { 
  Search, 
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
  Pencil
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
      title: 'Grand Livre',
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

  const [filter, setFilter] = useState<FilterType>('ALL');
  const [sortBy, setSortBy] = useState<SortType>('DATE_DESC');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(t.tous);
  const [showDatePicker, setShowDatePicker] = useState(false);
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
      <div className="flex items-center justify-between ps-1">
        <div className="space-y-0.5">
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{t.title}</h2>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{t.subtitle}</p>
        </div>
        <div className="flex gap-2">
          <button className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400 active:scale-95 transition-all border border-slate-100">
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Modern Search & Filters Container */}
      <div className="bg-white/40 backdrop-blur-md rounded-[40px] p-5 space-y-5 border border-white/60 shadow-sm">
        {/* Top bar with types and date picker */}
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-slate-100/50 p-1 rounded-[24px] flex items-center relative border border-slate-200/50">
            {(['ALL', 'EXPENSE', 'INCOME'] as const).map((type) => (
              <button 
                key={type}
                onClick={() => {
                  setFilter(type);
                  if (type === 'INCOME') setSelectedCategory(t.tous);
                }}
                className={`relative z-10 flex-1 py-3 flex flex-col items-center justify-center gap-1 transition-all duration-300 active:scale-95 ${filter === type ? 'text-white' : 'text-slate-400'}`}
              >
                <div className="relative">
                  {type === 'ALL' ? <LayoutGrid size={18} /> : type === 'EXPENSE' ? <ShoppingBag size={18} /> : <ArrowDownToLine size={18} />}
                  {filter === type && (
                    <motion.div 
                      layoutId="tabDot"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"
                    />
                  )}
                </div>
                <span className="text-[7px] font-black uppercase tracking-widest">{type === 'ALL' ? t.tous : type === 'EXPENSE' ? t.achats : t.retraits}</span>
                {filter === type && (
                  <motion.div 
                    layoutId="activeFilterTab"
                    className="absolute inset-0 bg-slate-900 rounded-[20px] -z-10"
                    transition={{ type: "spring", bounce: 0.1, duration: 0.6 }}
                  />
                )}
              </button>
            ))}
          </div>
          
          <button 
            onClick={() => setShowDatePicker(!showDatePicker)}
            className={`w-14 h-14 rounded-[24px] flex items-center justify-center transition-all active:scale-90 shadow-sm border ${showDatePicker || startDate || endDate ? 'bg-teal-brand border-teal-brand text-white' : 'bg-white border-slate-100 text-slate-400'}`}
          >
            <Calendar size={20} />
          </button>
        </div>

        {/* Search Input Box */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <Search className="text-slate-300 group-focus-within:text-indigo-500 transition-all duration-300" size={18} />
          </div>
          <input 
            type="text"
            placeholder={t.searchPlaceholder}
            className="w-full bg-white border border-slate-100 rounded-[24px] py-4 pl-14 pr-6 text-sm font-bold text-slate-800 placeholder:text-slate-300 placeholder:font-medium focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-200 shadow-sm transition-all outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Artistic Category Icons Bar - NO TEXT */}
        {filter !== 'INCOME' && (
          <div className="flex items-center justify-between px-2 bg-slate-50/50 py-3 rounded-[28px] border border-slate-100/50">
            {CATEGORY_MAP.map(cat => (
              <button
                key={cat.label}
                onClick={() => setSelectedCategory(cat.label)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 active:scale-75 relative group ${
                  selectedCategory === cat.label 
                    ? `${cat.activeBg} ${cat.activeText} shadow-md scale-110` 
                    : `${cat.bg} ${cat.text} hover:scale-105 opacity-60 hover:opacity-100`
                }`}
              >
                {cat.icon}
                {/* Tooltip for accessibility/UX */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[8px] font-black uppercase px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                  {cat.label}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

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
          <ArrowUpDown size={14} className="text-indigo-500" />
          <span>{t.sortBy}</span>
        </div>
        <button 
          onClick={() => setShowSortModal(true)}
          className="text-[11px] font-black text-slate-700 flex items-center gap-2 transition-all active:scale-95 bg-white py-2 px-4 rounded-xl shadow-sm border border-slate-100"
        >
          {sortBy === 'DATE_DESC' ? t.dateRecent : 
           sortBy === 'DATE_ASC' ? t.dateAncien : 
           sortBy === 'AMOUNT_DESC' ? t.montantMax : t.montantMin}
          <ChevronDown size={14} className="text-indigo-500" />
        </button>
      </div>

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
                  color="indigo"
                />
                <SortOption 
                  label={t.dateAncien} 
                  active={sortBy === 'DATE_ASC'} 
                  onClick={() => { setSortBy('DATE_ASC'); setShowSortModal(false); }} 
                  icon={<Calendar size={22} className="opacity-50" />}
                  color="indigo"
                />
                <SortOption 
                  label={t.montantMax} 
                  active={sortBy === 'AMOUNT_DESC'} 
                  onClick={() => { setSortBy('AMOUNT_DESC'); setShowSortModal(false); }} 
                  icon={<TrendingUp size={22} />}
                  color="indigo"
                />
                <SortOption 
                  label={t.montantMin} 
                  active={sortBy === 'AMOUNT_ASC'} 
                  onClick={() => { setSortBy('AMOUNT_ASC'); setShowSortModal(false); }} 
                  icon={<TrendingDown size={22} />}
                  color="indigo"
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
                className={`flex items-center gap-5 p-5 rounded-[32px] border transition-all group relative backdrop-blur-sm shadow-sm ${getCardStyle()}`}
                style={{ 
                  overflow: activeMenuId === tx.id ? 'visible' : 'hidden',
                  zIndex: activeMenuId === tx.id ? 50 : 1
                }}
              >
                {/* Visual Category Ornament */}
                {isExpense && (
                  <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full blur-3xl opacity-0 group-hover:opacity-15 transition-opacity ${categoryMatch.glow} pointer-events-none`} />
                )}

                <div className={`w-14 h-14 rounded-[22px] flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-sm ${
                  (!isExpense && !isCreditPlus && !isCreditMinus) 
                    ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                    : `${categoryMatch.bg} ${categoryMatch.text}`
                }`}>
                  {(isExpense || isCreditPlus || isCreditMinus) ? categoryMatch.icon : <ArrowDownToLine size={24} />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-black text-slate-800 text-sm tracking-tight truncate">{tx.label}</p>
                    {tx.amount > 1000 && (
                      <span className="px-2 py-0.5 rounded-full bg-indigo-500 text-white text-[7px] font-black uppercase tracking-widest">{t.important}</span>
                    )}
                  </div>
                    <div className="flex items-center gap-4 text-slate-400">
                      <span className="text-[10px] flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-400">
                        <Calendar size={12} className="text-indigo-500" />
                        {tx.date}
                      </span>
                      {(!isCreditPlus && !isCreditMinus) && (
                        <span className={`text-[10px] flex items-center gap-1.5 font-black uppercase tracking-[0.1em] ${isExpense ? categoryMatch.text : 'text-emerald-600'}`}>
                          <Tag size={12} />
                          {tx.category ? tx.category : (isExpense ? t.autres : t.retraits)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-4">
                    <div className="flex flex-col items-end">
                      <p className={`font-black tracking-tighter text-lg leading-none ${!isExpense ? 'text-emerald-600' : (isCreditMinus ? 'text-amber-600' : (isCreditPlus ? 'text-indigo-600' : 'text-slate-900'))}`}>
                        {!isExpense ? '+' : '-'}{tx.amount.toLocaleString('fr-FR')} 
                        <span className="text-[11px] ml-1 font-bold uppercase text-slate-400">{currency}</span>
                      </p>
                      {(isCreditPlus || isCreditMinus) && (
                        <span className={`text-[10px] font-black uppercase tracking-[0.1em] mt-1 ${isCreditPlus ? 'text-indigo-600' : 'text-amber-600'}`}>
                          {tx.category}
                        </span>
                      )}
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

      {/* Export Action */}
      <div className="pt-4">
        <button className="w-full h-14 border-2 border-dashed border-slate-200 rounded-3xl flex items-center justify-center gap-3 text-slate-400 font-bold text-sm hover:border-teal-brand hover:text-teal-brand transition-all">
          <Download size={18} />
          <span>{t.exportData}</span>
        </button>
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
