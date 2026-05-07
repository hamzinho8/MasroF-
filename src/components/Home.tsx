import React, { useState } from 'react';
import { 
  Plus, 
  ShoppingCart, 
  TrendingDown,
  TrendingUp,
  Wallet,
  ShoppingBag,
  ArrowDownToLine,
  Calendar,
  CalendarDays,
  CalendarRange,
  CalendarCheck,
  Utensils,
  Car,
  Gamepad2,
  MoreHorizontal,
  LayoutGrid,
  MoreVertical,
  Pencil,
  Trash2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Transaction, CreditEntry } from '../types';

interface HomeProps {
  balance: number;
  transactions: Transaction[];
  onAddClick: (type: 'INCOME' | 'EXPENSE') => void;
  onViewAll: () => void;
  onDelete: (id: string) => void;
  onEdit: (tx: Transaction) => void;
  widgetMode: 'balance' | 'spending';
  language: string;
  currency: string;
  creditEntries: CreditEntry[];
  onNavigateToCredits: () => void;
}

export default function Home({ 
  balance, 
  transactions, 
  onAddClick, 
  onViewAll, 
  onDelete,
  onEdit,
  widgetMode, 
  language, 
  currency,
  creditEntries,
  onNavigateToCredits
}: HomeProps) {
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month'>('week');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  const translations = {
    'Français': {
      bonjour: 'Bonjour',
      dansMaPoche: 'Dans ma Poche',
      depensesHebdo: 'Dépenses Hebdo',
      argentDispo: 'Argent liquide disponible',
      cumulAchats: 'Cumul de vos achats cette semaine',
      sommaireJour: 'Sommaire du Jour',
      sommaireSemaine: 'Sommaire de la Semaine',
      sommaireMois: 'Sommaire du Mois',
      sommaire: 'Sommaire',
      achatTotal: 'Achat Total',
      tirageBanque: 'Tirage Banque',
      ajouterAchat: 'Ajouter Achat',
      ajouterRetrait: 'Ajouter Retrait',
      analyses: 'Analyses de Trésorerie',
      grandLivre: 'Historique',
      voirTout: 'Voir tout',
      retraits: 'Retraits',
      depenses: 'Dépenses',
      achats: 'Achats',
      nourriture: 'Nourriture',
      shopping: 'Shopping',
      transport: 'Transport',
      loisirs: 'Loisirs',
      autres: 'Autres',
      owedToMe: 'On me doit',
      owedByMe: 'Je dois',
    },
    'العربية': {
      bonjour: 'مرحباً',
      dansMaPoche: 'في جيبي',
      depensesHebdo: 'المصاريف الأسبوعية',
      argentDispo: 'المبلغ المتوفر حالياً',
      cumulAchats: 'مجموع مشترياتك هذا الأسبوع',
      sommaireJour: 'ملخص اليوم',
      sommaireSemaine: 'ملخص الأسبوع',
      sommaireMois: 'ملخص الشهر',
      sommaire: 'ملخص',
      achatTotal: 'مجموع المشتريات',
      tirageBanque: 'سحب بنكي',
      ajouterAchat: 'إضافة شراء',
      ajouterRetrait: 'إضافة سحب',
      analyses: 'تحليلات الخزينة',
      grandLivre: 'سجل المعاملات',
      voirTout: 'عرض الكل',
      retraits: 'السحوبات',
      depenses: 'المصاريف',
      achats: 'المشتريات',
      nourriture: 'طعام',
      shopping: 'تسوق',
      transport: 'نقل',
      loisirs: 'ترفيه',
      autres: 'أخرى',
      owedToMe: 'مستحقات لي',
      owedByMe: 'ديون علي',
    },
    'English': {
      bonjour: 'Hello',
      dansMaPoche: 'In my Pocket',
      depensesHebdo: 'Weekly Spending',
      argentDispo: 'Cash available',
      cumulAchats: 'Your total purchases this week',
      sommaireJour: 'Daily Summary',
      sommaireSemaine: 'Weekly Summary',
      sommaireMois: 'Monthly Summary',
      sommaire: 'Summary',
      achatTotal: 'Total Purchase',
      tirageBanque: 'Bank Withdrawal',
      ajouterAchat: 'Add Purchase',
      ajouterRetrait: 'Add Withdrawal',
      analyses: 'Treasury Analytics',
      grandLivre: 'History',
      voirTout: 'View all',
      retraits: 'Withdrawals',
      depenses: 'Expenses',
      achats: 'Purchases',
      nourriture: 'Food',
      shopping: 'Shopping',
      transport: 'Transport',
      loisirs: 'Leisure',
      autres: 'Others',
      owedToMe: 'Owed to me',
      owedByMe: 'I owe',
    }
  };

  const t = translations[language as keyof typeof translations] || translations['Français'];

  const CATEGORY_MAP = [
    { label: t.nourriture, icon: <Utensils size={24} />, color: 'teal', bg: 'bg-teal-100', text: 'text-teal-600', glow: 'bg-teal-400' },
    { label: t.shopping, icon: <ShoppingBag size={24} />, color: 'rose', bg: 'bg-rose-100', text: 'text-rose-600', glow: 'bg-rose-400' },
    { label: t.transport, icon: <Car size={24} />, color: 'sky', bg: 'bg-sky-100', text: 'text-sky-600', glow: 'bg-sky-400' },
    { label: t.loisirs, icon: <Gamepad2 size={24} />, color: 'purple', bg: 'bg-purple-100', text: 'text-purple-600', glow: 'bg-purple-400' },
    { label: t.autres, icon: <MoreHorizontal size={24} />, color: 'slate', bg: 'bg-slate-100', text: 'text-slate-600', glow: 'bg-slate-400' },
  ];

  const getSummaryTitle = () => {
    if (timeframe === 'day') return t.sommaireJour;
    if (timeframe === 'month') return t.sommaireMois;
    return t.sommaireSemaine;
  };

  const totalOweMe = creditEntries
    .filter(e => e.type === 'OWE_ME')
    .reduce((acc, e) => acc + e.amount, 0);

  const totalIOwe = creditEntries
    .filter(e => e.type === 'I_OWE')
    .reduce((acc, e) => acc + e.amount, 0);

  const creditTranslations = {
    'Français': { oweMe: 'ON ME DOIT', iOwe: 'JE DOIS', resume: 'Résumé des crédits' },
    'العربية': { oweMe: 'لي عند الآخرين', iOwe: 'علي للآخرين', resume: 'ملخص الديون' },
    'English': { oweMe: 'OWED TO ME', iOwe: 'I OWE', resume: 'Credits Summary' }
  };
  const ct = creditTranslations[language as keyof typeof creditTranslations] || creditTranslations['Français'];

  const filteredTotals = React.useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    let totalExpense = 0;
    let totalIncome = 0;

    transactions.forEach(tx => {
      // Parse "DD/MM HH:mm" or "DD/MM"
      const dateStr = tx.date.split(' ')[0];
      const [dayPart, monthPart] = dateStr.split('/');
      
      if (!dayPart || !monthPart) return;
      
      const day = parseInt(dayPart);
      const month = parseInt(monthPart) - 1;
      
      const txDate = new Date(currentYear, month, day);
      // Ensure we handle year transitions (e.g. if we are in Jan and tx is from Dec)
      if (txDate > now) {
        txDate.setFullYear(currentYear - 1);
      }
      
      let include = false;
      const hoursInDay = 1000 * 60 * 60 * 24;
      
      if (timeframe === 'day') {
        include = day === now.getDate() && month === now.getMonth();
      } else if (timeframe === 'week') {
        const diffDays = (now.getTime() - txDate.getTime()) / hoursInDay;
        // Last 7 days
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

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTx) {
      onEdit(editingTx);
      setEditingTx(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      {/* Main Widget Card */}
      <div 
        className="relative h-44 rounded-[24px] overflow-hidden shadow-lg mb-8 transition-all hover:scale-[1.01] cursor-pointer"
        style={{ background: widgetMode === 'balance' ? 'linear-gradient(90deg, #AED8D3 0%, #FAD8A0 100%)' : 'linear-gradient(90deg, #F9B29B 0%, #C8E6C9 100%)' }}
      >
        <AnimatePresence mode="wait">
          <motion.div 
            key={widgetMode}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="relative z-10 p-6 h-full w-full flex flex-col justify-center"
          >
            <h2 className="text-slate-800 font-bold mb-1">
              {widgetMode === 'balance' ? t.dansMaPoche : t.depensesHebdo}
            </h2>
            <div className="text-3xl font-black text-slate-900 mb-1">
              {widgetMode === 'balance' 
                ? `${balance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} ${currency}`
                : `${filteredTotals.totalExpense.toLocaleString('fr-FR')} ${currency}`}
            </div>
            <p className="text-xs text-slate-700 font-medium opacity-80">
              {widgetMode === 'balance' ? t.argentDispo : t.cumulAchats}
            </p>
            
            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20 transform scale-150 text-slate-900 pointer-events-none">
              {widgetMode === 'balance' ? <Wallet size={80} /> : <TrendingDown size={80} />}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Credits Buttons - Matching summary card style exactly */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <div 
          onClick={onNavigateToCredits}
          className="p-4 rounded-2xl border-2 border-indigo-500/20 bg-indigo-50/50 relative overflow-hidden group cursor-pointer transition-all hover:border-indigo-500/40 hover:shadow-sm active:scale-[0.98]"
        >
          <div className="relative z-10">
            <p className="text-xs text-slate-500 mb-1 font-medium">{ct.oweMe}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-indigo-600 leading-none">{totalOweMe}</span>
              <span className="text-[10px] font-bold text-indigo-500 uppercase">{currency}</span>
            </div>
          </div>
          <TrendingUp className="absolute -right-2 -bottom-2 text-indigo-500/10 rotate-12 group-hover:scale-110 transition-transform" size={48} />
        </div>

        <div 
          onClick={onNavigateToCredits}
          className="p-4 rounded-2xl border-2 border-amber-500/20 bg-amber-50/50 relative overflow-hidden group cursor-pointer transition-all hover:border-amber-500/40 hover:shadow-sm active:scale-[0.98]"
        >
          <div className="relative z-10">
            <p className="text-xs text-slate-500 mb-1 font-medium">{ct.iOwe}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-amber-600 leading-none">{totalIOwe}</span>
              <span className="text-[10px] font-bold text-amber-500 uppercase">{currency}</span>
            </div>
          </div>
          <TrendingDown className="absolute -right-2 -bottom-2 text-amber-500/10 rotate-12 group-hover:scale-110 transition-transform" size={48} />
        </div>
      </div>

      {/* Summary Section */}
      <div className="mb-8 space-y-4">
        {/* Summary Title with Filter Icon */}
        <div className="flex justify-between items-center px-1">
          <h3 className="text-slate-900 font-bold">{getSummaryTitle()}</h3>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setTimeframe('day')}
              className={`p-1.5 rounded-lg transition-all ${timeframe === 'day' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
            >
              <CalendarCheck size={16} />
            </button>
            <button 
              onClick={() => setTimeframe('week')}
              className={`p-1.5 rounded-lg transition-all ${timeframe === 'week' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
            >
              <CalendarRange size={16} />
            </button>
            <button 
              onClick={() => setTimeframe('month')}
              className={`p-1.5 rounded-lg transition-all ${timeframe === 'month' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
            >
              <CalendarDays size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl border-2 border-danger-red/20 bg-danger-red/5 relative overflow-hidden group hover:border-danger-red/40 transition-all">
            <div className="relative z-10">
              <p className="text-xs text-slate-500 mb-1 font-medium">{t.achatTotal}</p>
              <p className="text-xl font-black text-danger-red leading-none">{filteredTotals.totalExpense.toLocaleString('fr-FR')} {currency}</p>
            </div>
            <ShoppingCart className="absolute -right-2 -bottom-2 text-danger-red/10 rotate-12 group-hover:scale-110 transition-transform" size={48} />
          </div>
          <div className="p-4 rounded-2xl border-2 border-bank-blue/20 bg-bank-blue/5 relative overflow-hidden group hover:border-bank-blue/40 transition-all">
            <div className="relative z-10">
              <p className="text-xs text-slate-500 mb-1 font-medium">{t.retraits}</p>
              <p className="text-xl font-black text-bank-blue leading-none">{filteredTotals.totalIncome.toLocaleString('fr-FR')} {currency}</p>
            </div>
            <Plus className="absolute -right-2 -bottom-2 text-bank-blue/10 rotate-12 group-hover:scale-110 transition-transform" size={48} />
          </div>
        </div>
      </div>

      {/* Quick Actions - Modern Redesign */}
      <div className="grid grid-cols-2 gap-4 mb-8">
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

      {/* Recent Activity */}
      <div onClick={() => setActiveMenuId(null)}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-slate-900 font-black tracking-tight">{t.grandLivre}</h3>
          <button 
            onClick={onViewAll}
            className="text-[10px] font-black text-rose-600 uppercase tracking-widest bg-rose-50 px-3 py-1.5 rounded-lg hover:bg-rose-100 transition-colors"
          >
            {t.voirTout}
          </button>
        </div>
        <div className="space-y-4">
          {transactions.slice(0, 3).map((tx, index) => {
            const isExpense = tx.type === 'EXPENSE';
            const isCreditPlus = tx.category === t.owedToMe || tx.category === 'Crédit +';
            const isCreditMinus = tx.category === t.owedByMe || tx.category === 'Crédit --';
            
            // Case-insensitive matching to handle "TRANSPORT" vs "Transport"
            const categoryMatch = (CATEGORY_MAP || []).find(c => 
              c.label && c.label.toLowerCase() === (tx.category || '').toLowerCase()
            ) || {
              icon: isCreditPlus ? <TrendingUp size={24} /> : (isCreditMinus ? <TrendingDown size={24} /> : (isExpense ? <ShoppingCart size={24} /> : <ArrowDownToLine size={24} />)),
              color: isCreditPlus ? 'indigo' : (isCreditMinus ? 'amber' : (isExpense ? 'slate' : 'emerald')),
              bg: isCreditPlus ? 'bg-indigo-600' : (isCreditMinus ? 'bg-amber-500' : (isExpense ? 'bg-slate-100' : 'bg-emerald-500')),
              text: isCreditPlus ? 'text-white' : (isCreditMinus ? 'text-white' : (isExpense ? 'text-slate-600' : 'text-white')),
              glow: isCreditPlus ? 'bg-indigo-400' : (isCreditMinus ? 'bg-amber-400' : (isExpense ? 'bg-slate-400' : 'bg-emerald-400'))
            };

            const getCardStyle = () => {
              if (isCreditPlus) return 'bg-indigo-50/30 border-indigo-100/50 hover:border-indigo-200';
              if (isCreditMinus) return 'bg-amber-50/30 border-amber-100/50 hover:border-amber-200';
              if (!isExpense) return 'bg-emerald-50/30 border-emerald-100/50 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/5 text-emerald-600';
              return `bg-white border-slate-100 ${getHoverColor(categoryMatch.color)}`;
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center gap-4 p-5 rounded-[32px] border transition-all group relative shadow-sm ${getCardStyle()}`}
                style={{ 
                  overflow: activeMenuId === tx.id ? 'visible' : 'hidden',
                  zIndex: activeMenuId === tx.id ? 50 : 1
                }}
              >
                {/* Visual Category Ornament */}
                {isExpense && (
                  <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full blur-3xl opacity-0 group-hover:opacity-15 transition-opacity pointer-events-none ${categoryMatch.glow}`} />
                )}

                <div className={`shrink-0 w-14 h-14 rounded-[22px] flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-sm ${
                  (!isExpense && !isCreditPlus && !isCreditMinus) 
                    ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                    : `${categoryMatch.bg} ${categoryMatch.text}`
                }`}>
                  {(isExpense || isCreditPlus || isCreditMinus) ? categoryMatch.icon : <ArrowDownToLine size={24} />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-black text-slate-800 text-sm tracking-tight truncate mb-1">{tx.label}</p>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-400">
                      <Calendar size={12} className="text-indigo-500" />
                      {tx.date}
                    </span>
                    {(!isCreditPlus && !isCreditMinus) && (
                      <span className={`text-[10px] font-black uppercase tracking-[0.1em] ${!isExpense ? 'text-emerald-600' : categoryMatch.text}`}>
                        {tx.category || (!isExpense ? t.retraits : t.achats)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="shrink-0 text-right flex items-center gap-3">
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
                              onClick={() => { setEditingTx(tx); setActiveMenuId(null); }}
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
        </div>

        {/* Inline Edit Modal */}
        <AnimatePresence>
          {editingTx && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setEditingTx(null)}
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-[32px] w-full max-w-sm p-8 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Modifier</h3>
                  <button onClick={() => setEditingTx(null)} className="p-2 bg-slate-50 rounded-full text-slate-400">
                    <X size={20} />
                  </button>
                </div>
                
                <form onSubmit={handleSaveEdit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Libellé</label>
                    <input 
                      type="text" 
                      required
                      value={editingTx.label}
                      onChange={(e) => setEditingTx({...editingTx, label: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-800 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-inner"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Montant ({currency})</label>
                    <input 
                      type="number" 
                      step="0.01"
                      required
                      value={isNaN(editingTx.amount) ? '' : editingTx.amount}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setEditingTx({...editingTx, amount: isNaN(val) ? NaN : val});
                      }}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-black text-slate-800 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-inner text-xl"
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full py-5 bg-[#0B1E3F] text-white rounded-[24px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 active:scale-95 transition-all mt-4"
                  >
                    Enregistrer
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
