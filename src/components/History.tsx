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
  
  const CATEGORY_MAP = [
    { label: t.tous, icon: <LayoutGrid size={18} /> },
    { label: t.nourriture, icon: <Utensils size={18} /> },
    { label: t.shopping, icon: <ShoppingBag size={18} /> },
    { label: t.transport, icon: <Car size={18} /> },
    { label: t.loisirs, icon: <Gamepad2 size={18} /> },
    { label: t.autres, icon: <MoreHorizontal size={18} /> },
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{t.title}</h2>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{t.subtitle}</p>
        </div>
        <div className="flex gap-2">
          <button className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 active:scale-95 transition-all">
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Modern Search & Filters Container */}
      <div className="bg-slate-50/50 rounded-[40px] p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-white p-1 rounded-[22px] flex items-center relative shadow-sm border border-slate-100">
            {(['ALL', 'EXPENSE', 'INCOME'] as const).map((type) => (
              <button 
                key={type}
                onClick={() => {
                  setFilter(type);
                  if (type === 'INCOME') setSelectedCategory(t.tous);
                }}
                className={`relative z-10 flex-1 py-3 flex flex-col items-center justify-center gap-1 transition-all duration-500 active:scale-95 ${filter === type ? 'text-white' : 'text-slate-400'}`}
              >
                {type === 'ALL' ? <LayoutGrid size={18} /> : type === 'EXPENSE' ? <ShoppingBag size={18} /> : <ArrowDownToLine size={18} />}
                <span className="text-[7px] font-black uppercase tracking-widest">{type === 'ALL' ? t.tous : type === 'EXPENSE' ? t.achats : t.retraits}</span>
                {filter === type && (
                  <motion.div 
                    layoutId="activeFilterTab"
                    className="absolute inset-0 bg-slate-800 rounded-[18px] -z-10"
                    transition={{ type: "spring", bounce: 0.1, duration: 0.5 }}
                  />
                )}
              </button>
            ))}
          </div>
          
          <button 
            onClick={() => setShowDatePicker(!showDatePicker)}
            className={`w-14 h-14 rounded-[22px] flex items-center justify-center transition-all active:scale-90 shadow-sm ${showDatePicker || startDate || endDate ? 'bg-teal-brand text-white' : 'bg-white text-slate-400 border border-slate-100'}`}
          >
            <Calendar size={20} />
          </button>
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <Search className="text-slate-300 group-focus-within:text-teal-brand transition-all duration-300" size={18} />
          </div>
          <input 
            type="text"
            placeholder={t.searchPlaceholder}
            className="w-full bg-white border-none rounded-[24px] py-4 pl-14 pr-6 text-sm font-bold text-slate-800 placeholder:text-slate-300 placeholder:font-medium focus:ring-4 focus:ring-teal-brand/5 shadow-sm transition-all outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Modern Category Grid (No Scroll) */}
        {filter !== 'INCOME' && (
          <div className="grid grid-cols-3 gap-3">
            {CATEGORY_MAP.map(cat => (
              <button
                key={cat.label}
                onClick={() => setSelectedCategory(cat.label)}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all active:scale-95 border-2 ${
                  selectedCategory === cat.label 
                    ? 'bg-teal-brand/5 border-teal-brand shadow-sm' 
                    : 'bg-white border-slate-100/50 text-slate-400'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  selectedCategory === cat.label 
                    ? 'bg-teal-brand text-white' 
                    : 'bg-slate-50 text-slate-400'
                }`}>
                  {cat.icon}
                </div>
                <span className={`text-[8px] font-black uppercase tracking-widest transition-colors ${
                  selectedCategory === cat.label ? 'text-teal-brand' : 'text-slate-400'
                }`}>
                  {cat.label}
                </span>
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
      <div className="flex items-center justify-between bg-white/50 px-4 py-3 rounded-2xl border border-slate-50">
        <div className="flex items-center gap-2 text-slate-300 text-[10px] font-black uppercase tracking-widest">
          <ArrowUpDown size={12} />
          <span>{t.sortBy}</span>
        </div>
        <button 
          onClick={() => setShowSortModal(true)}
          className="text-[10px] font-black text-slate-800 flex items-center gap-2 transition-all active:scale-95 px-3 py-1.5 rounded-lg hover:bg-slate-50"
        >
          {sortBy === 'DATE_DESC' ? t.dateRecent : 
           sortBy === 'DATE_ASC' ? t.dateAncien : 
           sortBy === 'AMOUNT_DESC' ? t.montantMax : t.montantMin}
          <ChevronDown size={14} className="text-teal-brand" />
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

              <div className="text-right flex items-center gap-2">
                <p className={`font-black tracking-tight text-base ${tx.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {tx.type === 'INCOME' ? '+' : '-'}{tx.amount.toLocaleString('fr-FR')} 
                  <span className="text-[10px] ml-0.5">{currency}</span>
                </p>
                
                <div className="relative">
                  <button 
                    onClick={() => setActiveMenuId(activeMenuId === tx.id ? null : tx.id)}
                    className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                  >
                    <MoreVertical size={16} />
                  </button>
                  
                  <AnimatePresence>
                    {activeMenuId === tx.id && (
                      <>
                        <div 
                          className="fixed inset-0 z-30" 
                          onClick={() => setActiveMenuId(null)}
                        />
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9, x: -10 }}
                          animate={{ opacity: 1, scale: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.9, x: -10 }}
                          className="absolute right-0 top-8 bg-white border border-slate-100 shadow-xl rounded-xl py-2 w-32 z-40"
                        >
                          <button 
                            onClick={() => handleEdit(tx)}
                            className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <Pencil size={14} className="text-teal-brand" />
                            Modifier
                          </button>
                          <button 
                            onClick={() => { onDelete(tx.id); setActiveMenuId(null); }}
                            className="w-full px-4 py-2 text-left text-xs font-bold text-rose-500 hover:bg-rose-50 flex items-center gap-2"
                          >
                            <Trash2 size={14} />
                            Supprimer
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ))}
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
