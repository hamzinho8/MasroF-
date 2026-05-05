import React, { useState } from 'react';
import { 
  Plus, 
  ShoppingCart, 
  TrendingDown,
  TrendingUp,
  Wallet,
  ShoppingBag,
  ArrowDownToLine,
  CalendarDays,
  CalendarRange,
  CalendarCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Transaction, CreditEntry } from '../types';
import { HandReceiveBackground, HandGiveBackground } from './Credits';

interface HomeProps {
  balance: number;
  transactions: Transaction[];
  weeklyAchat: number;
  weeklyBank: number;
  onAddClick: (type: 'INCOME' | 'EXPENSE') => void;
  onViewAll: () => void;
  widgetMode: 'balance' | 'spending';
  language: string;
  currency: string;
  creditEntries: CreditEntry[];
  onNavigateToCredits: () => void;
}

export default function Home({ 
  balance, 
  transactions, 
  weeklyAchat, 
  weeklyBank, 
  onAddClick, 
  onViewAll, 
  widgetMode, 
  language, 
  currency,
  creditEntries,
  onNavigateToCredits
}: HomeProps) {
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month'>('week');

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
      grandLivre: 'Grand Livre',
      voirTout: 'Voir tout',
      retraits: 'Retraits',
      depenses: 'Dépenses',
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
      grandLivre: 'السجل العام',
      voirTout: 'عرض الكل',
      retraits: 'السحوبات',
      depenses: 'المصاريف',
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
      grandLivre: 'General Ledger',
      voirTout: 'View all',
      retraits: 'Withdrawals',
      depenses: 'Expenses',
    }
  };

  const t = translations[language as keyof typeof translations] || translations['Français'];

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
                : `${weeklyAchat.toLocaleString('fr-FR')} ${currency}`}
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

      {/* Credits Buttons - Now below the main card, rectangular */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div 
          onClick={onNavigateToCredits}
          className="flex flex-col h-30 p-5 rounded-[24px] text-white shadow-xl relative overflow-hidden text-center justify-center items-center cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <HandReceiveBackground className="absolute w-full h-full inset-0 pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center justify-center">
            <p className="text-[10px] uppercase font-black tracking-[0.2em] text-white/90 mb-2">{ct.oweMe}</p>
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-3xl font-black leading-none text-white">{totalOweMe}</span>
              <span className="text-[11px] font-bold text-white opacity-80 uppercase">{currency}</span>
            </div>
          </div>
        </div>

        <div 
          onClick={onNavigateToCredits}
          className="flex flex-col h-30 p-5 rounded-[24px] text-white shadow-xl relative overflow-hidden text-center justify-center items-center cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <HandGiveBackground className="absolute w-full h-full inset-0 pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center justify-center">
            <p className="text-[10px] uppercase font-black tracking-[0.2em] text-white/90 mb-2">{ct.iOwe}</p>
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-3xl font-black leading-none text-white">{totalIOwe}</span>
              <span className="text-[11px] font-bold text-white opacity-80 uppercase">{currency}</span>
            </div>
          </div>
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
              <p className="text-xl font-black text-danger-red leading-none">{weeklyAchat.toLocaleString('fr-FR')} {currency}</p>
            </div>
            <ShoppingCart className="absolute -right-2 -bottom-2 text-danger-red/10 rotate-12 group-hover:scale-110 transition-transform" size={48} />
          </div>
          <div className="p-4 rounded-2xl border-2 border-bank-blue/20 bg-bank-blue/5 relative overflow-hidden group hover:border-bank-blue/40 transition-all">
            <div className="relative z-10">
              <p className="text-xs text-slate-500 mb-1 font-medium">{t.tirageBanque}</p>
              <p className="text-xl font-black text-bank-blue leading-none">{weeklyBank.toLocaleString('fr-FR')} {currency}</p>
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
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-slate-900 font-bold">{t.grandLivre}</h3>
          <button 
            onClick={onViewAll}
            className="text-xs font-bold text-rose-600 hover:underline"
          >
            {t.voirTout}
          </button>
        </div>
        <div className="space-y-3">
          {transactions.map(tx => (
            <div key={tx.id} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-white hover:border-teal-brand/20 hover:shadow-sm transition-all cursor-pointer">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'INCOME' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                {tx.type === 'INCOME' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-800 text-sm">{tx.label}</p>
                <p className="text-[10px] text-slate-400 font-medium">{tx.date}</p>
              </div>
              <p className={`font-black tracking-tight ${tx.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {tx.type === 'INCOME' ? '+' : '-'}{tx.amount.toLocaleString('fr-FR')} {currency}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
