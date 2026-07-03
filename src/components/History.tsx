import React, { useState } from 'react';
import { Virtuoso, GroupedVirtuoso } from 'react-virtuoso';
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
  Search,
  CheckSquare,
  Square,
  AlertCircle,
  CheckCircle2,
  Trash,
  Mic,
  ScanLine
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
  onAddClick: (type: 'INCOME' | 'EXPENSE', mode?: 'manual' | 'scanner' | 'vocal') => void;
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
      activeText: 'text-white',
      colorHex: cat.colorHex
    })),
    { label: t.owedToMe, icon: <TrendingUp size={24} />, color: 'indigo', bg: 'bg-indigo-100', text: 'text-indigo-600', glow: 'bg-indigo-400', activeBg: 'bg-indigo-500', activeText: 'text-white', colorHex: undefined },
    { label: t.owedByMe, icon: <TrendingDown size={24} />, color: 'amber', bg: 'bg-amber-100', text: 'text-amber-600', glow: 'bg-amber-400', activeBg: 'bg-amber-500', activeText: 'text-white', colorHex: undefined }
  ];

  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month'>('week');
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [sortBy, setSortBy] = useState<SortType>('DATE_DESC');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(t.tous);
  const [activeInlineMenu, setActiveInlineMenu] = useState<'DATE' | 'TYPE' | 'CATEGORY' | 'SEARCH' | 'TAGS' | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [editingTagInput, setEditingTagInput] = useState("");
  const [visibleCount, setVisibleCount] = useState(30);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleEdit = (tx: Transaction) => {
    setActiveMenuId(null);
    setEditingTx(tx);
    setEditingTagInput("");
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTx) {
      onUpdate(editingTx.id, { label: editingTx.label, amount: editingTx.amount, tags: editingTx.tags });
      setEditingTx(null);
      setEditingTagInput("");
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
    let prevTotalExpense = 0;
    let totalIncome = 0;
    const expenseBuckets = [0, 0, 0, 0, 0, 0, 0];

    const hoursInDay = 1000 * 60 * 60 * 24;

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
      let includePrev = false;
      let bucketIndex = -1;
      
      if (timeframe === 'day') {
        include = day === now.getDate() && month === now.getMonth();
        
        const prevDay = new Date(now);
        prevDay.setDate(now.getDate() - 1);
        includePrev = day === prevDay.getDate() && month === prevDay.getMonth();
        
        if (include) {
          const hourMatch = tx.date.match(/ (d{2}):/);
          const hour = hourMatch ? parseInt(hourMatch[1]) : 12;
          bucketIndex = Math.min(6, Math.floor(hour / (24 / 7)));
        }
      } else if (timeframe === 'week') {
        const diffDays = (now.getTime() - txDate.getTime()) / hoursInDay;
        include = diffDays >= 0 && diffDays < 7;
        includePrev = diffDays >= 7 && diffDays < 14;
        
        if (include) {
          bucketIndex = Math.min(6, Math.max(0, 6 - Math.floor(diffDays)));
        }
      } else if (timeframe === 'month') {
        include = month === now.getMonth();
        
        const prevMonthDate = new Date(now);
        prevMonthDate.setMonth(now.getMonth() - 1);
        includePrev = month === prevMonthDate.getMonth();
        
        if (include) {
          bucketIndex = Math.min(6, Math.floor(day / (31 / 7)));
        }
      }
      
      if (include || includePrev) {
        const isBankAddedBalance = tx.type === "INCOME" && tx.paidByBank && ["Salaire", "Dépôt", "Autre", "Banque", "Virement"].includes(tx.category || "");
        const isRetrait = tx.type === "INCOME" && !tx.paidByBank && tx.label === "Retrait Banque";
        const isVirementExpense = tx.type === "EXPENSE" && !tx.paidByBank && tx.category === "Virement";

        if (!isBankAddedBalance && !isRetrait && !isVirementExpense) {
          const isCredit = (tx.category && ["on me doit","je dois","مستحقات لي","ديون علي","owed to me","i owe","loans","debts","crédit +","crédit --"].includes(tx.category.toLowerCase()));
          if (!isCredit) {
            if (tx.type === 'EXPENSE') {
              if (include) {
                totalExpense += tx.amount;
                if (bucketIndex >= 0 && bucketIndex <= 6) {
                  expenseBuckets[bucketIndex] += tx.amount;
                }
              }
              if (includePrev) prevTotalExpense += tx.amount;
            } else if (tx.type === 'INCOME' && !tx.paidByBank) {
              if (include) totalIncome += tx.amount;
            }
          }
        }
      }
    });

    let trendPercentage = 0;
    if (prevTotalExpense > 0) {
      trendPercentage = ((totalExpense - prevTotalExpense) / prevTotalExpense) * 100;
    }

    return { totalExpense, totalIncome, trendPercentage, prevTotalExpense, expenseBuckets };
  }, [transactions, timeframe]);

  const generateSparklinePath = (data: number[], width = 100, height = 30) => {
    if (!data || data.length < 2) return `M 0,${height} L ${width},${height}`;
    const max = Math.max(...data, 1); 
    const stepX = width / (data.length - 1);
    
    const points = data.map((d, i) => {
      const x = i * stepX;
      const y = (height - 4) - (d / max) * (height - 4) + 2; 
      return { x, y };
    });
    
    let path = `M ${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const cx = (p1.x + p2.x) / 2;
      path += ` C ${cx},${p1.y} ${cx},${p2.y} ${p2.x},${p2.y}`;
    }
    return path;
  };

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
      const isBankAddedBalance = tx.type === "INCOME" && tx.paidByBank && ["Salaire", "Dépôt", "Autre", "Banque", "Virement"].includes(tx.category || "");
      const isBankExpense = tx.type === "EXPENSE" && tx.paidByBank;
      const isRetrait = tx.type === "INCOME" && !tx.paidByBank && tx.label === "Retrait Banque";
      const isVirementExpense = tx.type === "EXPENSE" && !tx.paidByBank && tx.category === "Virement";
      
      if (isBankAddedBalance || isRetrait || isBankExpense || isVirementExpense) {
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

      const matchesTags = selectedTags.length === 0 || (tx.tags && selectedTags.some(tag => tx.tags!.includes(tag)));

      return matchesFilter && matchesSearch && matchesRange && matchesCategory && matchesTags;
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

    // Group transactions by date
  const groupedData = React.useMemo(() => {
    const groups: { date: string, transactions: Transaction[] }[] = [];
    const groupMap = new Map<string, Transaction[]>();
    
    filteredTransactions.forEach(tx => {
      const dateStr = tx.date.split(' ')[0];
      if (!groupMap.has(dateStr)) {
        groupMap.set(dateStr, []);
      }
      groupMap.get(dateStr)!.push(tx);
    });
    
    groupMap.forEach((txs, date) => {
      groups.push({ date, transactions: txs });
    });
    
    return groups;
  }, [filteredTransactions]);

  const groupCounts = React.useMemo(() => groupedData.map(g => g.transactions.length), [groupedData]);
  const flatTransactions = React.useMemo(() => groupedData.flatMap(g => g.transactions), [groupedData]);

    const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedIds(new Set());
  };

  const handleSelectTx = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredTransactions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredTransactions.map(tx => tx.id)));
    }
  };

  const handleDeleteSelected = () => {
    if (window.confirm(`Voulez-vous vraiment supprimer ces ${selectedIds.size} transactions ?`)) {
      selectedIds.forEach(id => onDelete(id));
      setSelectedIds(new Set());
      setIsSelectionMode(false);
    }
  };

  const clearDateRange = () => {
    setStartDate('');
    setEndDate('');
  };

  const allAvailableTags = React.useMemo(() => {
    const tags = new Set<string>();
    transactions.forEach(tx => {
      if (tx.tags) {
        tx.tags.forEach(tag => tags.add(tag));
      }
    });
    return Array.from(tags).sort();
  }, [transactions]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 pb-12"
    >
      {/* Premium Summary Card */}
      <div className="relative overflow-hidden rounded-[40px] shadow-2xl shadow-slate-200/50 border border-white/80 bg-white">
        {/* Background Gradient & Decorative Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-white z-0" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/5 rounded-full blur-3xl" />
        
        <div className="relative z-10 p-6">
          {/* Header with Full-Width Selector */}
          <div className="flex bg-slate-100/50 p-1.5 rounded-[28px] shadow-inner border border-slate-200/50 mb-10">
            <button 
              onClick={() => setTimeframe('day')}
              className={`flex-1 py-3 px-2 rounded-[22px] flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all duration-300 ${timeframe === 'day' ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <CalendarCheck size={16} strokeWidth={timeframe === 'day' ? 3 : 2} className={timeframe === 'day' ? 'text-rose-500' : ''} />
              <span className="text-[10px] font-bold uppercase tracking-widest">{getTimeframeLabel('day')}</span>
            </button>
            <button 
              onClick={() => setTimeframe('week')}
              className={`flex-1 py-3 px-2 rounded-[22px] flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all duration-300 ${timeframe === 'week' ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <CalendarRange size={16} strokeWidth={timeframe === 'week' ? 3 : 2} className={timeframe === 'week' ? 'text-rose-500' : ''} />
              <span className="text-[10px] font-bold uppercase tracking-widest">{getTimeframeLabel('week')}</span>
            </button>
            <button 
              onClick={() => setTimeframe('month')}
              className={`flex-1 py-3 px-2 rounded-[22px] flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all duration-300 ${timeframe === 'month' ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <CalendarDays size={16} strokeWidth={timeframe === 'month' ? 3 : 2} className={timeframe === 'month' ? 'text-rose-500' : ''} />
              <span className="text-[10px] font-bold uppercase tracking-widest">{getTimeframeLabel('month')}</span>
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-col items-center justify-center relative px-2 mb-4 mt-2">
            
            {/* Background Sparkline */}
            <div className="absolute bottom-0 left-0 right-0 h-24 opacity-20 pointer-events-none -mb-4">
              <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                <path 
                  d={generateSparklinePath(filteredTotals.expenseBuckets)} 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-rose-500" 
                />
                <path 
                  d={`${generateSparklinePath(filteredTotals.expenseBuckets)} L 100,30 L 0,30 Z`} 
                  fill="url(#gradient-expense-history)" 
                  stroke="none"
                />
                <defs>
                  <linearGradient id="gradient-expense-history" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.4" className="text-rose-500" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0" className="text-rose-500" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="flex items-center gap-2 mb-4 relative z-10">
              <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shadow-sm ring-4 ring-rose-50">
                <ShoppingCart size={14} strokeWidth={3} />
              </div>
              <span className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em]">{t.achats}</span>
            </div>
            
            <div className="flex items-baseline justify-center relative z-10">
              <span className="text-6xl font-black text-slate-800 tracking-tighter">
                {filteredTotals.totalExpense.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).split(',')[0]}
              </span>
              <span className="text-3xl font-black text-slate-400 tracking-tighter">
                ,{filteredTotals.totalExpense.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).split(',')[1]}
              </span>
              <span className="text-sm ml-2.5 font-bold text-slate-400 uppercase tracking-widest">{currency}</span>
            </div>
            
            <div className="flex items-center gap-2 mt-6 relative z-10">
              <div className="px-4 py-1.5 bg-slate-50/90 backdrop-blur-sm rounded-full border border-slate-100 flex items-center gap-2 shadow-sm">
                 <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total {getTimeframeLabel(timeframe)}</span>
              </div>
              
              {filteredTotals.prevTotalExpense > 0 && (
                <div className={`px-3 py-1.5 rounded-full border flex items-center gap-1 shadow-sm backdrop-blur-sm ${
                  filteredTotals.trendPercentage > 0 
                    ? 'bg-rose-50/90 border-rose-100 text-rose-600' 
                    : filteredTotals.trendPercentage < 0
                      ? 'bg-emerald-50/90 border-emerald-100 text-emerald-600'
                      : 'bg-slate-50/90 border-slate-100 text-slate-500'
                }`}>
                  {filteredTotals.trendPercentage > 0 ? (
                    <TrendingUp size={12} strokeWidth={3} />
                  ) : filteredTotals.trendPercentage < 0 ? (
                    <TrendingDown size={12} strokeWidth={3} />
                  ) : (
                    <span className="w-3 h-3 flex items-center justify-center font-bold text-[10px]">-</span>
                  )}
                  <span className="text-[10px] font-black tracking-wider">
                    {Math.abs(filteredTotals.trendPercentage).toFixed(0)}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions - Identical to Home style */}
      <div className="grid grid-cols-3 gap-3 px-1 mb-6">
        <button 
          onClick={() => onAddClick('EXPENSE')}
          className="group relative flex flex-col items-center justify-center gap-2 h-28 bg-white border-2 border-slate-50 rounded-[28px] transition-all hover:border-rose-100 hover:bg-rose-50/30 active:scale-95 shadow-sm"
        >
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
            <ShoppingBag size={24} strokeWidth={2.5} />
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-rose-600 transition-colors text-center px-1 leading-tight">
            {t.ajouterAchat}
          </span>
        </button>

        <button 
          onClick={() => onAddClick('EXPENSE', 'scanner')}
          className="group relative flex flex-col items-center justify-center gap-2 h-28 bg-white border-2 border-slate-50 rounded-[28px] transition-all hover:border-indigo-100 hover:bg-indigo-50/30 active:scale-95 shadow-sm"
        >
          <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
            <ScanLine size={24} strokeWidth={2.5} />
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-600 transition-colors text-center px-1 leading-tight">
            Scanner
          </span>
        </button>

        <button 
          onClick={() => onAddClick('EXPENSE', 'vocal')}
          className="group relative flex flex-col items-center justify-center gap-2 h-28 bg-white border-2 border-slate-50 rounded-[28px] transition-all hover:border-teal-100 hover:bg-teal-50/30 active:scale-95 shadow-sm"
        >
          <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
            <Mic size={24} strokeWidth={2.5} />
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-teal-600 transition-colors text-center px-1 leading-tight">
            Vocal
          </span>
        </button>
      </div>

      {/* Smart Search & Bulk Actions Bar */}
      <div className="px-1 space-y-3">
        <div className="flex items-center gap-2">
          {/* Search Bar */}
          <div className="flex-1 relative group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search size={16} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input 
              type="text" 
              placeholder={language === 'العربية' ? 'بحث...' : 'Rechercher...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-9 pr-4 text-xs font-bold text-slate-700 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 shadow-sm"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-rose-500"
              >
                <X size={14} />
              </button>
            )}
          </div>
          
          {/* Advanced Filters Button */}
          <button 
            onClick={() => setShowAdvancedFilters(true)}
            className="shrink-0 w-11 h-11 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-600 transition-all hover:bg-slate-50 active:scale-95 shadow-sm relative"
          >
            <Filter size={18} strokeWidth={2.5} />
            {(filter !== 'ALL' || selectedCategory !== t.tous || startDate || endDate || selectedTags.length > 0) && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            )}
          </button>
        </div>

        {/* Selection / Bulk Actions Bar */}
        <div className="flex items-center justify-between bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/50">
          <button 
            onClick={toggleSelectionMode}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-2 ${isSelectionMode ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-white hover:text-slate-700'}`}
          >
            <CheckSquare size={14} />
            {isSelectionMode ? 'Terminer' : 'Sélectionner'}
          </button>
          
          <AnimatePresence>
            {isSelectionMode && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-1"
              >
                <button 
                  onClick={handleSelectAll}
                  className="px-3 py-2 rounded-xl text-[10px] font-bold text-slate-600 hover:bg-white"
                >
                  {selectedIds.size === filteredTransactions.length ? 'Désélectionner tout' : 'Tout'}
                </button>
                {selectedIds.size > 0 && (
                  <button 
                    onClick={handleDeleteSelected}
                    className="px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-rose-500 text-white shadow-sm flex items-center gap-1.5 hover:bg-rose-600 active:scale-95"
                  >
                    <Trash size={12} />
                    Supprimer ({selectedIds.size})
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Advanced Filters Bottom Sheet */}
      <AnimatePresence>
        {showAdvancedFilters && (
          <React.Fragment>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAdvancedFilters(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-x-0 bottom-0 z-[101] bg-white rounded-t-[32px] shadow-2xl flex flex-col max-h-[85vh]"
            >
              <div className="p-4 flex justify-center shrink-0">
                <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
              </div>
              
              <div className="px-6 pb-4 shrink-0 flex items-center justify-between border-b border-slate-100">
                <h3 className="text-lg font-black text-slate-800">Filtres Avancés</h3>
                <button 
                  onClick={() => setShowAdvancedFilters(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-8">
                {/* Date Range */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black uppercase text-slate-400 tracking-widest">Période</span>
                    {(startDate || endDate) && (
                      <button onClick={clearDateRange} className="text-[10px] font-bold text-rose-500 uppercase">Effacer</button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input 
                      type="date" 
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-700"
                    />
                    <input 
                      type="date" 
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-700"
                    />
                  </div>
                </div>

                {/* Type */}
                <div className="space-y-3">
                  <span className="text-xs font-black uppercase text-slate-400 tracking-widest">Type</span>
                  <div className="grid grid-cols-3 gap-2">
                    {['ALL', 'EXPENSE', 'INCOME'].map((f) => (
                      <button 
                        key={f}
                        onClick={() => { setFilter(f as FilterType); if(f === 'INCOME') setSelectedCategory(t.tous); }}
                        className={`py-2.5 rounded-xl text-xs font-bold border-2 transition-all ${filter === f ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-100 bg-white text-slate-500'}`}
                      >
                        {f === 'ALL' ? t.tous : (f === 'EXPENSE' ? t.achats : t.retraits)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-3">
                  <span className="text-xs font-black uppercase text-slate-400 tracking-widest">Catégories</span>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => setSelectedCategory(t.tous)}
                      className={`px-4 py-2 rounded-full text-xs font-bold border-2 transition-all ${selectedCategory === t.tous ? 'border-slate-800 bg-slate-800 text-white' : 'border-slate-100 bg-white text-slate-600'}`}
                    >
                      {t.tous}
                    </button>
                    {CATEGORY_MAP.map(cat => (
                      <button 
                        key={cat.label}
                        onClick={() => setSelectedCategory(cat.label)}
                        className={`px-4 py-2 rounded-full text-xs font-bold border-2 transition-all flex items-center gap-2 ${selectedCategory === cat.label ? `border-${cat.color}-600 bg-${cat.color}-600 text-white` : 'border-slate-100 bg-white text-slate-600'}`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Tags */}
                {allAvailableTags.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black uppercase text-slate-400 tracking-widest">Tags</span>
                      {selectedTags.length > 0 && (
                        <button onClick={() => setSelectedTags([])} className="text-[10px] font-bold text-rose-500 uppercase">Effacer tout</button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {allAvailableTags.map(tag => (
                        <button
                          key={tag}
                          onClick={() => {
                            if (selectedTags.includes(tag)) setSelectedTags(selectedTags.filter(t => t !== tag));
                            else setSelectedTags([...selectedTags, tag]);
                          }}
                          className={`px-4 py-2 rounded-full text-xs font-bold border-2 transition-all ${selectedTags.includes(tag) ? 'border-purple-600 bg-purple-600 text-white' : 'border-slate-100 bg-white text-slate-600'}`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </React.Fragment>
        )}
      </AnimatePresence>

      {/* List */}
      <div className="space-y-4 pb-8" style={{ height: "calc(100vh - 210px)" }}>
        {filteredTransactions.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 mx-2">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm ring-8 ring-slate-50">
              <Search size={40} className="text-slate-300" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-black text-slate-800 mb-2">Aucun résultat</h3>
            <p className="text-sm font-bold text-slate-400 max-w-[200px] mb-6">
              Nous n'avons trouvé aucune transaction correspondant à vos critères.
            </p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setFilter('ALL');
                setSelectedCategory(t.tous);
                setStartDate('');
                setEndDate('');
                setSelectedTags([]);
              }}
              className="px-6 py-3 bg-white text-slate-700 text-xs font-black uppercase tracking-widest rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors"
            >
              Réinitialiser
            </button>
          </div>
        ) : (
          <GroupedVirtuoso
          className="w-full h-full"
          groupCounts={groupCounts}
          groupContent={(index) => {
            const date = groupedData[index].date;
            
            // Generate a readable date
            const today = new Date();
            const dateParts = date.split('/');
            let label = date;
            if (dateParts.length === 2) {
              const d = parseInt(dateParts[0]);
              const m = parseInt(dateParts[1]) - 1;
              if (d === today.getDate() && m === today.getMonth()) {
                label = language === 'العربية' ? 'اليوم' : language === 'English' ? 'Today' : 'Aujourd\'hui';
              } else {
                const prev = new Date(today);
                prev.setDate(today.getDate() - 1);
                if (d === prev.getDate() && m === prev.getMonth()) {
                  label = language === 'العربية' ? 'أمس' : language === 'English' ? 'Yesterday' : 'Hier';
                }
              }
            }

            return (
              <div className="bg-white/90 backdrop-blur-md py-2 sticky top-0 z-20 mb-2 mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-4 bg-slate-200 rounded-full" />
                  <span className="text-xs font-black uppercase tracking-widest text-slate-500">
                    {label}
                  </span>
                </div>
                <div className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-full">
                  {groupedData[index].transactions.length}
                </div>
              </div>
            );
          }}
          itemContent={(index, groupIndex) => {
            const tx = flatTransactions[index];
            const isSelected = selectedIds.has(tx.id);
            const isHighAmount = tx.type === 'EXPENSE' && tx.amount > 1000;
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
              glow: isCreditPlus ? 'bg-indigo-400' : (isCreditMinus ? 'bg-amber-400' : (isExpense ? 'bg-slate-400' : 'bg-emerald-400')),
              colorHex: undefined
            } as any;

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
                'purple': 'hover:border-purple-200 hover:shadow-purple-500/10',
                'red': 'hover:border-red-200 hover:shadow-red-500/10',
                'amber': 'hover:border-amber-200 hover:shadow-amber-500/10',
                'green': 'hover:border-green-200 hover:shadow-green-500/10',
                'slate': 'hover:border-slate-200 hover:shadow-slate-500/10',
                'blue': 'hover:border-blue-200 hover:shadow-blue-500/10',
                'indigo': 'hover:border-indigo-200 hover:shadow-indigo-500/10',
                'rose': 'hover:border-rose-200 hover:shadow-rose-500/10',
                'orange': 'hover:border-orange-200 hover:shadow-orange-500/10',
                'stone': 'hover:border-stone-200 hover:shadow-stone-500/10',
                'gray': 'hover:border-gray-200 hover:shadow-gray-500/10'
              };
              return colors[color] || 'hover:border-slate-200';
            };

            if (isCreditPlus || isCreditMinus) {
              const isReceive = isCreditPlus;
              return (
                <div key={tx.id} className="py-1 flex items-center gap-3">
                  {isSelectionMode && (
                    <button 
                      onClick={() => handleSelectTx(tx.id)}
                      className="shrink-0 w-8 h-8 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 transition-colors"
                    >
                      {isSelected ? <CheckSquare size={20} className="text-rose-500" /> : <Square size={20} className="text-slate-300" />}
                    </button>
                  )}
                  <motion.div initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 }}
                  className={`flex-1 group flex items-center gap-4 p-5 rounded-[32px] border transition-transform relative shadow-sm ${
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
                    {tx.tags && tx.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {tx.tags.map(tag => (
                          <span key={tag} className="text-[8px] font-black uppercase bg-white/50 text-slate-500 px-1.5 py-0.5 rounded-full tracking-widest border border-slate-200">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
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

            const txColor = info.colorHex || categoryMatch.colorHex;

            return (
                <div key={tx.id} className="py-1 flex items-center gap-3">
                  {isSelectionMode && (
                    <button 
                      onClick={() => handleSelectTx(tx.id)}
                      className="shrink-0 w-8 h-8 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 transition-colors"
                    >
                      {isSelected ? <CheckSquare size={20} className="text-rose-500" /> : <Square size={20} className="text-slate-300" />}
                    </button>
                  )}
                  <motion.div initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.03 }}
                className={`flex-1 flex items-center gap-4 p-4 rounded-[32px] border transition-transform group relative ${getCardStyle()}`}
                style={{ 
                  overflow: activeMenuId === tx.id ? 'visible' : 'hidden',
                  zIndex: activeMenuId === tx.id ? 50 : 1
                }}
              >
                {/* Icon Container */}
                <div 
                  className={`w-14 h-14 rounded-[22px] flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-sm ${
                    (!isExpense && !isCreditPlus && !isCreditMinus) 
                      ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                      : (!txColor ? `${categoryMatch.bg} ${categoryMatch.text}` : '')
                  }`}
                  style={isExpense && txColor ? { backgroundColor: `${txColor}20`, color: txColor } : undefined}
                >
                  {(isExpense || isCreditPlus || isCreditMinus) ? (
                    info.iconSvg ? (
                      <div dangerouslySetInnerHTML={{ __html: info.iconSvg }} className="w-6 h-6 flex items-center justify-center text-current svg-container" />
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
                    <span className="text-[10px] flex items-center gap-1 font-bold text-slate-400 mb-1">
                      <Calendar size={10} className="text-slate-300" />
                      {tx.date}
                    </span>
                    {tx.tags && tx.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {tx.tags.map(tag => (
                          <span key={tag} className="text-[9px] font-black uppercase bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full tracking-widest">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
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
                       <Tag size={10} className={!isExpense ? 'text-emerald-600' : (!txColor ? categoryMatch.text : '')} style={isExpense && txColor ? { color: txColor } : undefined} />
                       <span 
                         className={`text-[9px] font-black uppercase tracking-wider ${!isExpense ? 'text-emerald-600' : (!txColor ? categoryMatch.text : '')}`}
                         style={isExpense && txColor ? { color: txColor } : undefined}
                       >
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
        )}

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

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Tags</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(editingTx.tags || []).map((tag) => (
                        <div
                          key={tag}
                          className="flex items-center gap-1 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold border border-indigo-100"
                        >
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => setEditingTx({ ...editingTx, tags: (editingTx.tags || []).filter(t => t !== tag) })}
                            className="hover:text-indigo-900 focus:outline-none"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Ajouter un tag..."
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-teal-brand/20 transition-all"
                      value={editingTagInput}
                      onChange={(e) => setEditingTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const newTag = editingTagInput.trim();
                          if (newTag && !(editingTx.tags || []).includes(newTag)) {
                            setEditingTx({ ...editingTx, tags: [...(editingTx.tags || []), newTag] });
                          }
                          setEditingTagInput("");
                        }
                      }}
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
