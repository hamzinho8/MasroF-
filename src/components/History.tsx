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
  ChevronDown
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
}

type FilterType = 'ALL' | 'INCOME' | 'EXPENSE';
type SortType = 'DATE_DESC' | 'DATE_ASC' | 'AMOUNT_DESC' | 'AMOUNT_ASC';

export default function History({ transactions, language, currency }: HistoryProps) {
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
    }
  };

  const t = translations[language as keyof typeof translations] || translations['Français'];
  const CATEGORIES = [t.tous, t.nourriture, t.shopping, t.transport, t.loisirs, t.autres];

  const [filter, setFilter] = useState<FilterType>('ALL');
  const [sortBy, setSortBy] = useState<SortType>('DATE_DESC');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(t.tous);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);

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
      const matchesCategory = selectedCategory === 'Tous' || tx.category === selectedCategory;
      
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">{t.title}</h2>
        <p className="text-sm text-slate-500 font-medium">{t.subtitle}</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder={t.searchPlaceholder} 
            className="w-full h-12 bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-brand/20 transition-all font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2 items-center">
          <div className="flex-1 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <FilterTab active={filter === 'ALL'} onClick={() => { setFilter('ALL'); setSelectedCategory(t.tous); }} label={t.tous} />
            <FilterTab active={filter === 'EXPENSE'} onClick={() => setFilter('EXPENSE')} label={t.achats} color="text-danger-red" bg="bg-red-50" />
            <FilterTab active={filter === 'INCOME'} onClick={() => { setFilter('INCOME'); setSelectedCategory(t.tous); }} label={t.retraits} color="text-bank-blue" bg="bg-blue-50" />
          </div>
          
          <button 
            onClick={() => setShowDatePicker(!showDatePicker)}
            className={`p-2.5 rounded-2xl border transition-all ${showDatePicker || startDate || endDate ? 'bg-teal-brand text-white border-teal-brand shadow-md' : 'bg-white text-slate-400 border-slate-100 shadow-sm'}`}
          >
            <Calendar size={18} />
          </button>
        </div>

        {/* Category Filter - Only shows for Achats or All */}
        {filter !== 'INCOME' && (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all whitespace-nowrap ${selectedCategory === cat ? 'bg-slate-800 text-white shadow-sm' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
              >
                {cat}
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
              className="overflow-hidden bg-slate-50 rounded-2xl border border-slate-100"
            >
              <div className="p-4 space-y-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Période personnalisé</span>
                  {(startDate || endDate) && (
                    <button onClick={clearDateRange} className="text-[10px] font-black uppercase text-rose-500 hover:underline flex items-center gap-1">
                      <X size={10} />
                      Effacer
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[8px] font-bold text-slate-500 ml-1">DEPUIS</label>
                    <input 
                      type="date" 
                      className="w-full h-10 bg-white border border-slate-200 rounded-xl px-3 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-brand/20"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-bold text-slate-500 ml-1">JUSQU'À</label>
                    <input 
                      type="date" 
                      className="w-full h-10 bg-white border border-slate-200 rounded-xl px-3 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-brand/20"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sorting Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
          <ArrowUpDown size={14} />
          <span>{t.sortBy}</span>
        </div>
        <button 
          onClick={() => setShowSortModal(true)}
          className="text-xs font-black text-teal-brand bg-teal-brand/10 px-4 py-2 rounded-xl flex items-center gap-2 transition-all active:scale-95"
        >
          {sortBy === 'DATE_DESC' ? t.dateRecent : 
           sortBy === 'DATE_ASC' ? t.dateAncien : 
           sortBy === 'AMOUNT_DESC' ? t.montantMax : t.montantMin}
          <ChevronDown size={14} />
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
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[40px] z-[101] p-8 shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-8" />
              
              <h3 className="text-xl font-black text-slate-800 mb-6 text-center">{t.sortBy}</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <SortOption 
                  label={t.dateRecent} 
                  active={sortBy === 'DATE_DESC'} 
                  onClick={() => { setSortBy('DATE_DESC'); setShowSortModal(false); }} 
                  icon={<Calendar size={20} />}
                />
                <SortOption 
                  label={t.dateAncien} 
                  active={sortBy === 'DATE_ASC'} 
                  onClick={() => { setSortBy('DATE_ASC'); setShowSortModal(false); }} 
                  icon={<Calendar size={20} className="opacity-50" />}
                />
                <SortOption 
                  label={t.montantMax} 
                  active={sortBy === 'AMOUNT_DESC'} 
                  onClick={() => { setSortBy('AMOUNT_DESC'); setShowSortModal(false); }} 
                  icon={<TrendingUp size={20} />}
                />
                <SortOption 
                  label={t.montantMin} 
                  active={sortBy === 'AMOUNT_ASC'} 
                  onClick={() => { setSortBy('AMOUNT_ASC'); setShowSortModal(false); }} 
                  icon={<TrendingDown size={20} />}
                />
              </div>

              <button 
                onClick={() => setShowSortModal(false)}
                className="w-full mt-8 py-4 text-sm font-black text-slate-400 uppercase tracking-widest"
              >
                Fermer
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* List */}
      <div className="space-y-3 pb-8">
        <AnimatePresence mode="popLayout">
          {filteredTransactions.map((tx, index) => (
            <motion.div 
              key={tx.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-4 p-4 rounded-3xl border border-slate-100 bg-white hover:border-teal-brand/20 hover:shadow-md transition-all group"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${tx.type === 'INCOME' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {tx.type === 'INCOME' ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-bold text-slate-800 text-sm truncate">{tx.label}</p>
                  {tx.amount > 1000 && (
                    <span className="px-1.5 py-0.5 rounded-md bg-gold-soft/10 text-gold-deep text-[8px] font-black uppercase">{t.important}</span>
                  )}
</div>
                <div className="flex items-center gap-3 text-slate-400">
                  <span className="text-[10px] flex items-center gap-1 font-medium italic">
                    <Calendar size={10} />
                    {tx.date}
                  </span>
                  <span className="text-[10px] flex items-center gap-1 font-medium italic">
                    <Tag size={10} />
                    {tx.category ? tx.category : (tx.type === 'INCOME' ? 'Banque' : 'Marché')}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <p className={`font-black tracking-tight text-base ${tx.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {tx.type === 'INCOME' ? '+' : '-'}{tx.amount.toLocaleString('fr-FR')} 
                  <span className="text-[10px] ml-0.5">{currency}</span>
                </p>
              </div>
            </motion.div>
          ))}
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

function SortOption({ label, active, onClick, icon }: { label: string, active: boolean, onClick: () => void, icon: React.ReactNode }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-3 p-6 rounded-[32px] border-2 transition-all active:scale-95 ${active ? 'border-teal-brand bg-teal-brand/5 text-teal-brand' : 'border-slate-50 bg-slate-50 text-slate-400'}`}
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${active ? 'bg-teal-brand text-white' : 'bg-white shadow-sm'}`}>
        {icon}
      </div>
      <span className="text-[10px] font-black uppercase tracking-tight">{label}</span>
      {active && (
        <motion.div 
          layoutId="activeSort"
          className="w-1.5 h-1.5 bg-teal-brand rounded-full mt-1"
        />
      )}
    </button>
  );
}
