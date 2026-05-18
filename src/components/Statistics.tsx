import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronDown, 
  Calendar, 
  Clock, 
  BarChart3, 
  Utensils, 
  ShoppingBag, 
  Car, 
  Gamepad2, 
  CreditCard,
  Target
} from 'lucide-react';

import { Transaction } from '../types';

interface StatisticsProps {
  transactions: Transaction[];
  currency: string;
  language: string;
  isDarkMode: boolean;
}

const CATEGORY_STYLES: Record<string, { color: string; icon: React.ReactNode; bg: string }> = {
  'Nourriture': { color: '#1B7C86', icon: <Utensils size={18} />, bg: 'bg-[#1B7C86]/10' },
  'Food': { color: '#1B7C86', icon: <Utensils size={18} />, bg: 'bg-[#1B7C86]/10' },
  'أكل': { color: '#1B7C86', icon: <Utensils size={18} />, bg: 'bg-[#1B7C86]/10' },
  'Shopping': { color: '#E11D48', icon: <ShoppingBag size={18} />, bg: 'bg-rose-100' },
  'تسوق': { color: '#E11D48', icon: <ShoppingBag size={18} />, bg: 'bg-rose-100' },
  'Transport': { color: '#0EA5E9', icon: <Car size={18} />, bg: 'bg-sky-100' },
  'نقليات': { color: '#0EA5E9', icon: <Car size={18} />, bg: 'bg-sky-100' },
  'Loisirs': { color: '#8B5CF6', icon: <Gamepad2 size={18} />, bg: 'bg-purple-100' },
  'Leisure': { color: '#8B5CF6', icon: <Gamepad2 size={18} />, bg: 'bg-purple-100' },
  'ترفيه': { color: '#8B5CF6', icon: <Gamepad2 size={18} />, bg: 'bg-purple-100' },
  'Autres': { color: '#64748B', icon: <CreditCard size={18} />, bg: 'bg-slate-100' },
  'Others': { color: '#64748B', icon: <CreditCard size={18} />, bg: 'bg-slate-100' },
  'أخرى': { color: '#64748B', icon: <CreditCard size={18} />, bg: 'bg-slate-100' },
};

export default function Statistics({ transactions, currency, language, isDarkMode }: StatisticsProps) {
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('week');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const periodStats = useMemo(() => {
    const now = new Date();
    const startOfPeriod = new Date();
    if (period === 'day') startOfPeriod.setHours(0, 0, 0, 0);
    else if (period === 'week') {
      const d = now.getDay();
      const diff = now.getDate() - d + (d === 0 ? -6 : 1);
      startOfPeriod.setDate(diff);
      startOfPeriod.setHours(0, 0, 0, 0);
    } else if (period === 'month') {
      startOfPeriod.setDate(1);
      startOfPeriod.setHours(0, 0, 0, 0);
    }

    const expenses = transactions.filter(t => {
      const isCredit = (t.category && ["on me doit","je dois","مستحقات لي","ديون علي","owed to me","i owe","loans","debts","crédit +","crédit --"].includes(t.category.toLowerCase()));
      const isExpense = (t.type === 'EXPENSE' || (t.type as any) === 'expense') && !isCredit;
      return isExpense && t.timestamp >= startOfPeriod.getTime();
    });

    const grouped: Record<string, { total: number; articles: Record<string, number> }> = {};
    const mainCategories = ['Nourriture', 'Shopping', 'Transport', 'Loisirs', 'Autres'];
    mainCategories.forEach(cat => grouped[cat] = { total: 0, articles: {} });

    expenses.forEach(t => {
      let category = t.category || 'Autres';
      if (category === 'Food') category = 'Nourriture';
      else if (category === 'Leisure') category = 'Loisirs';
      else if (category === 'Others') category = 'Autres';

      if (!grouped[category]) grouped[category] = { total: 0, articles: {} };
      grouped[category].total += t.amount;
      const articleName = t.label || 'Article';
      grouped[category].articles[articleName] = (grouped[category].articles[articleName] || 0) + t.amount;
    });

    return grouped;
  }, [transactions, period]);

  const periods = [
    { id: 'day', label: language === 'Français' ? 'Jour' : 'Day', icon: <Clock size={14} /> },
    { id: 'week', label: language === 'Français' ? 'Semaine' : 'Week', icon: <Calendar size={14} /> },
    { id: 'month', label: language === 'Français' ? 'Mois' : 'Month', icon: <BarChart3 size={14} /> },
  ];

  return (
    <div className="flex flex-col h-full bg-transparent px-4 pb-24 overflow-y-auto">
      {/* Title 1 */}
      <div className="mt-6 mb-2">
        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-[#1B7C86] ml-1">
          {language === 'Français' ? 'Récapitulatif par Catégorie' : 'Category Summary'}
        </h2>
      </div>

      {/* Period Selector */}
      <div className="flex items-center justify-between gap-2 p-1 bg-slate-900/5 dark:bg-white/5 rounded-2xl mb-6 border border-white/10">
        {periods.map((p) => (
          <button
            key={p.id}
            onClick={() => setPeriod(p.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
              period === p.id 
                ? 'bg-[#1B7C86] text-white shadow-lg shadow-[#1B7C86]/20' 
                : 'text-slate-500 hover:bg-white/10'
            }`}
          >
            {p.icon}
            {p.label}
          </button>
        ))}
      </div>

      {/* Stats Board (Category Table) */}
      <div className="space-y-3 mb-10">
        {Object.entries(periodStats as Record<string, { total: number; articles: Record<string, number> }>).filter(([_, data]) => data.total > 0).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-slate-400 bg-white/50 dark:bg-white/5 rounded-3xl border border-dashed border-slate-200 dark:border-white/10">
            <Target size={32} className="mb-2 opacity-20" />
            <p className="font-bold text-[10px] tracking-widest uppercase">Aucune dépense par catégorie</p>
          </div>
        ) : (
          (Object.entries(periodStats) as [string, { total: number; articles: Record<string, number> }][])
            .filter(([_, data]) => data.total > 0)
            .map(([category, data]) => {
            const style = CATEGORY_STYLES[category] || { color: '#64748B', icon: <BarChart3 size={18} />, bg: 'bg-slate-100' };
            const isExpanded = expandedCategories.includes(category);

            return (
              <div key={category} className={`rounded-3xl overflow-hidden border transition-all duration-300 ${isDarkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-white border-slate-100 shadow-sm'}`}>
                <button 
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center justify-between p-5 group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl ${style.bg} flex items-center justify-center`} style={{ color: style.color }}>
                      {style.icon}
                    </div>
                    <div className="text-left">
                      <h3 className="text-sm font-black uppercase tracking-widest" style={{ color: isDarkMode ? 'white' : style.color }}>
                        {category}
                      </h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                        {Object.keys(data.articles).length} Articles
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-black tracking-tighter" style={{ color: isDarkMode ? 'white' : '#0F172A' }}>
                        {data.total.toLocaleString()} <span className="text-xs opacity-40">{currency}</span>
                      </p>
                    </div>
                    <div className={`p-1 rounded-full transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-slate-100 dark:bg-white/10' : ''}`}>
                      <ChevronDown size={18} className="text-slate-400" />
                    </div>
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-slate-50/50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-white/5"
                    >
                      <div className="p-4 space-y-2">
                        {Object.entries(data.articles).map(([article, amount]) => (
                          <div key={article} className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-white dark:hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: style.color }} />
                              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 capitalize">{article}</span>
                            </div>
                            <span className="text-xs font-black text-slate-900 dark:text-white tabular-nums">
                              {amount.toLocaleString()} {currency}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>

      {/* Top 10 Title */}
      <div className="mt-4 mb-4">
        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-[#1B7C86] ml-1">
          {language === 'Français' ? 'Top 10 des Achats' : 'Top 10 Purchases'}
        </h2>
      </div>

      <div className={`rounded-[32px] overflow-hidden border ${isDarkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-white border-slate-100 shadow-sm'} mb-10`}>
        <div className="p-2">
          {(() => {
            const now = new Date();
            const startOfPeriod = new Date();
            if (period === 'day') startOfPeriod.setHours(0, 0, 0, 0);
            else if (period === 'week') {
              const d = now.getDay();
              const diff = now.getDate() - d + (d === 0 ? -6 : 1);
              startOfPeriod.setDate(diff);
              startOfPeriod.setHours(0, 0, 0, 0);
            } else if (period === 'month') {
              startOfPeriod.setDate(1);
              startOfPeriod.setHours(0, 0, 0, 0);
            }

            const periodExpenses = transactions.filter(t => {
              const isCredit = (t.category && ["on me doit","je dois","مستحقات لي","ديون علي","owed to me","i owe","loans","debts","crédit +","crédit --"].includes(t.category.toLowerCase()));
              const isExpense = (t.type === 'EXPENSE' || (t.type as any) === 'expense') && !isCredit;
              return isExpense && t.timestamp >= startOfPeriod.getTime();
            });

            const topMap: Record<string, { count: number, category: string }> = {};
            periodExpenses.forEach(t => {
              const name = t.label || 'Article';
              if (!topMap[name]) {
                topMap[name] = { count: 0, category: t.category || 'Autres' };
              }
              topMap[name].count += 1;
            });

            const topArticles = Object.entries(topMap)
              .map(([name, d]) => ({ name, ...d }))
              .sort((a, b) => b.count - a.count)
              .slice(0, 10);

            if (topArticles.length === 0) {
              return (
                <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                  <BarChart3 size={32} className="mb-2 opacity-20" />
                  <p className="font-bold text-[10px] tracking-widest uppercase">Aucune donnée disponible</p>
                </div>
              );
            }

            return (
              <div className="space-y-1">
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 dark:border-white/5 mb-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Article</span>
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Fréquence</span>
                </div>
                {topArticles.map((art, idx) => {
                  const style = CATEGORY_STYLES[art.category] || { color: '#64748B' };
                  return (
                    <motion.div 
                      key={art.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-black text-slate-300 dark:text-white/20 w-4">{idx + 1}.</span>
                        <div className="flex flex-col">
                          <span className="text-sm font-black capitalize" style={{ color: style.color }}>
                            {art.name}
                          </span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                            {art.category}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-black text-slate-900 dark:text-white">
                          {art.count}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          fois
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
