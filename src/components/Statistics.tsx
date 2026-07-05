import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
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
  Target,
  X,
  Sparkles,
  Loader2,
  Cpu,
} from "lucide-react";

import { Transaction, PredefinedItem } from "../types";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, ScatterChart, Scatter, ZAxis, XAxis, YAxis, CartesianGrid, ComposedChart, BarChart, Bar, AreaChart, Area, ReferenceLine } from "recharts";
import { createPortal } from "react-dom";
import {
  ICON_MAP,
  INITIAL_PREDEFINED_ITEMS,
  CATEGORIES as APP_CATEGORIES,
  getArticleInfo,
} from "../constants";
import { generateAIContent } from "../utils/ai";

interface StatisticsProps {
  transactions: Transaction[];
  predefinedItems?: PredefinedItem[];
  currency: string;
  language: string;
  isDarkMode: boolean;
  categoryBudgets?: Record<string, number>;
  onUpdateBudget?: (category: string, limit: number) => void;
}

const CATEGORY_STYLES: Record<
  string,
  { color: string; icon: React.ReactNode; bg: string }
> = Object.fromEntries(
  APP_CATEGORIES.map((cat) => [
    cat.id,
    {
      color: cat.colorHex,
      icon: (() => {
        const IconComp = ICON_MAP[cat.iconName] || ICON_MAP["MoreHorizontal"];
        return <IconComp size={18} />;
      })(),
      bg: cat.bgColor,
    },
  ])
);

export default function Statistics({
  transactions,
  predefinedItems = [],
  currency,
  language,
  isDarkMode,
  categoryBudgets = {},
  onUpdateBudget,
}: StatisticsProps) {
  const [period, setPeriod] = useState<"day" | "week" | "month">("month");
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [selectedPieCategory, setSelectedPieCategory] = useState<string | null>(
    null
  );

  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [summaryText, setSummaryText] = useState<string | null>(null);
  const [aiProvider, setAiProvider] = useState<"gemini" | "openrouter">(
    (localStorage.getItem("ai_provider") as "gemini" | "openrouter") || "gemini"
  );

  const generateSummary = async (provider: "gemini" | "openrouter") => {
    setIsGeneratingSummary(true);
    setSummaryText(null);
    setAiProvider(provider);
    localStorage.setItem("ai_provider", provider);
    try {
      const apiKeyValue =
        window.localStorage.getItem("gemini_api_key") ||
        window.localStorage.getItem("userGeminiApiKey");
      const openRouterKeyValue = localStorage.getItem("openrouter_api_key");

      if (provider === "gemini" && !apiKeyValue) {
        setSummaryText(
          "Veuillez configurer votre clé API Gemini dans les paramètres."
        );
        setIsGeneratingSummary(false);
        return;
      }
      if (provider === "openrouter" && !openRouterKeyValue) {
        setSummaryText(
          "Veuillez configurer votre clé API OpenRouter dans les paramètres."
        );
        setIsGeneratingSummary(false);
        return;
      }

      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const monthExpenses = transactions.filter((t) => {
        const isCredit =
          t.category &&
          [
            "on me doit",
            "je dois",
            "مستحقات لي",
            "ديون علي",
            "owed to me",
            "i owe",
            "loans",
            "debts",
            "crédit +",
            "crédit --",
          ].includes(t.category.toLowerCase());
        const isExpense =
          (t.type === "EXPENSE" || (t.type as any) === "expense") && !isCredit && t.category !== "Virement";
        return isExpense && t.timestamp >= startOfMonth.getTime();
      });

      const promptText = `
Voici les dépenses du mois en cours de l'utilisateur:
${JSON.stringify(
  monthExpenses.map((t) => ({
    article: t.label,
    montant: t.amount,
    catégorie: t.category,
    date: new Date(t.timestamp).toLocaleDateString(),
  }))
)}

Analyse ces données, identifie les plus grandes dépenses, donne ton avis sur les habitudes de dépenses et propose 2-3 conseils brefs pour optimiser le budget. Fais un résumé court (max 100-150 mots) et convivial en français. N'utilise pas le markdown JSON dans ta réponse.`;

      const parts = [{ text: promptText }];
      const textResult = await generateAIContent(
        aiProvider,
        apiKeyValue,
        openRouterKeyValue,
        parts,
        500
      );
      setSummaryText(textResult.trim());
    } catch (err: any) {
      console.debug(err);
      setSummaryText(err.message || "Erreur lors de la génération du résumé.");
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const timeRange = useMemo(() => {
    const now = new Date();
    let start = new Date();
    let end = new Date();
    let startPrev = new Date();
    let endPrev = new Date();
    let daysIn = 1;
    let elapsed = 1;

    if (period === "day") {
      start.setHours(0,0,0,0);
      end.setHours(23,59,59,999);
      startPrev = new Date(start.getTime() - 86400000);
      endPrev = new Date(end.getTime() - 86400000);
      daysIn = 1;
      elapsed = 1;
    } else if (period === "week") {
      const d = now.getDay();
      const diff = now.getDate() - d + (d === 0 ? -6 : 1);
      start.setDate(diff);
      start.setHours(0,0,0,0);
      end = new Date(start.getTime() + 6 * 86400000);
      end.setHours(23,59,59,999);
      startPrev = new Date(start.getTime() - 7 * 86400000);
      endPrev = new Date(end.getTime() - 7 * 86400000);
      daysIn = 7;
      elapsed = Math.max(1, Math.min(7, Math.floor((now.getTime() - start.getTime()) / 86400000) + 1));
    } else if (period === "month") {
      start.setDate(1);
      start.setHours(0,0,0,0);
      end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
      end.setHours(23,59,59,999);
      startPrev = new Date(start.getFullYear(), start.getMonth() - 1, 1);
      endPrev = new Date(startPrev.getFullYear(), startPrev.getMonth() + 1, 0);
      endPrev.setHours(23,59,59,999);
      daysIn = end.getDate();
      elapsed = Math.max(1, Math.min(daysIn, now.getDate()));
    }
    return { start, end, startPrev, endPrev, daysIn, elapsed };
  }, [period]);

  const periodStats = useMemo(() => {
    const { start } = timeRange;
    const expenses = transactions.filter((t) => {
      const isCredit =
        t.category &&
        [
          "on me doit",
          "je dois",
          "مستحقات لي",
          "ديون علي",
          "owed to me",
          "i owe",
          "loans",
          "debts",
          "crédit +",
          "crédit --",
        ].includes(t.category.toLowerCase());
      const isExpense =
        (t.type === "EXPENSE" || (t.type as any) === "expense") && !isCredit && t.category !== "Virement";
      return isExpense && t.timestamp >= start.getTime();
    });

    const grouped: Record<
      string,
      { total: number; articles: Record<string, number> }
    > = {};
    const mainCategories = APP_CATEGORIES.map(c => c.id);
    mainCategories.forEach(
      (cat) => (grouped[cat] = { total: 0, articles: {} })
    );

    expenses.forEach((t) => {
      let category = t.category || "Autres";
      if (category === "Food" || category === "Nourriture") {
         const pref = INITIAL_PREDEFINED_ITEMS.find(p => p.name.toLowerCase() === (t.label || '').toLowerCase());
         category = pref ? pref.category : "Autres";
      }
      else if (category === "Leisure") category = "Loisirs";
      else if (category === "Others") category = "Autres";

      if (!grouped[category]) grouped[category] = { total: 0, articles: {} };
      grouped[category].total += t.amount;
      const articleName = t.label || "Article";
      grouped[category].articles[articleName] =
        (grouped[category].articles[articleName] || 0) + t.amount;
    });

    return grouped;
  }, [transactions, timeRange]);

  const { currentTotal, prevTotal, popPercentage, runRate, projectedTotal } = useMemo(() => {
    const { start, end, startPrev, endPrev, daysIn, elapsed } = timeRange;
    
    const filterExp = (t: Transaction, s: Date, e: Date) => {
      const isCredit = t.category && ["on me doit", "je dois", "مستحقات لي", "ديون علي", "owed to me", "i owe", "loans", "debts", "crédit +", "crédit --"].includes(t.category.toLowerCase());
      return (t.type === "EXPENSE" || (t.type as any) === "expense") && !isCredit && t.category !== "Virement" && t.timestamp >= s.getTime() && t.timestamp <= e.getTime();
    };

    const currExp = transactions.filter(t => filterExp(t, start, end));
    const prevExp = transactions.filter(t => filterExp(t, startPrev, endPrev));

    const cTotal = currExp.reduce((sum, t) => sum + t.amount, 0);
    const pTotal = prevExp.reduce((sum, t) => sum + t.amount, 0);

    let pop = 0;
    if (pTotal > 0) {
      pop = ((cTotal - pTotal) / pTotal) * 100;
    }

    const rRate = cTotal / elapsed;
    const projected = rRate * daysIn;

    return { currentTotal: cTotal, prevTotal: pTotal, popPercentage: pop, runRate: rRate, projectedTotal: projected };
  }, [transactions, timeRange]);

  // Waterfall Chart Data
  const waterfallData = useMemo(() => {
    const { start, end } = timeRange;
    const periodTx = transactions.filter(t => t.timestamp >= start.getTime() && t.timestamp <= end.getTime());
    
    let totalIncome = 0;
    const categoryExpenses: Record<string, number> = {};

    periodTx.forEach(t => {
      const isCredit = t.category && ["on me doit", "je dois", "مستحقات لي", "ديون علي", "owed to me", "i owe", "loans", "debts", "crédit +", "crédit --"].includes(t.category.toLowerCase());
      if (isCredit || t.category === "Virement") return;

      if (t.type === 'INCOME' || (t.type as any) === 'income') {
        totalIncome += t.amount;
      } else if (t.type === 'EXPENSE' || (t.type as any) === 'expense') {
        let cat = t.category || "Autres";
        if (cat === "Food" || cat === "Nourriture") {
           const pref = INITIAL_PREDEFINED_ITEMS.find(p => p.name.toLowerCase() === (t.label || '').toLowerCase());
           cat = pref ? pref.category : "Autres";
        }
        else if (cat === "Leisure") cat = "Loisirs";
        else if (cat === "Others") cat = "Autres";
        categoryExpenses[cat] = (categoryExpenses[cat] || 0) + t.amount;
      }
    });

    const data: any[] = [];
    let currentBalance = totalIncome;
    
    data.push({
      name: language === 'العربية' ? 'مداخيل' : "Revenus",
      start: 0,
      end: totalIncome,
      amount: totalIncome,
      isExpense: false
    });

    Object.entries(categoryExpenses).sort((a, b) => b[1] - a[1]).forEach(([cat, amount]) => {
      if (amount <= 0) return;
      data.push({
        name: cat,
        start: currentBalance - amount,
        end: currentBalance,
        amount: amount,
        isExpense: true
      });
      currentBalance -= amount;
    });

    data.push({
      name: language === 'العربية' ? 'رصيد نهائي' : "Solde",
      start: 0,
      end: currentBalance,
      amount: currentBalance,
      isExpense: false,
      isTotal: true
    });

    return data;
  }, [transactions, timeRange, language]);

  // Vampire Expenses (Scatter Chart)
  const vampireData = useMemo(() => {
    const { start, end } = timeRange;
    const expenses = transactions.filter((t) => {
      const isCredit = t.category && ["on me doit", "je dois"].some(c => t.category!.toLowerCase().includes(c));
      return (t.type === "EXPENSE" || (t.type as any) === "expense") && !isCredit && t.category !== "Virement" && t.timestamp >= start.getTime() && t.timestamp <= end.getTime();
    });

    const map: Record<string, { count: number; total: number; category: string }> = {};
    expenses.forEach(t => {
      const name = t.label || "Article";
      if (!map[name]) map[name] = { count: 0, total: 0, category: t.category || "Autres" };
      map[name].count += 1;
      map[name].total += t.amount;
    });

    return Object.entries(map).map(([name, data]) => ({
      name,
      count: data.count,
      avgCost: data.total / data.count,
      total: data.total,
      category: data.category,
      color: CATEGORY_STYLES[data.category]?.color || "#64748B"
    })).filter(d => d.count > 1).sort((a, b) => b.total - a.total).slice(0, 15);
  }, [transactions, timeRange]);

  // Heatmap Data (Activity by day for current month/week)
  const heatmapData = useMemo(() => {
    const { start, end } = timeRange;
    const days: Array<{ date: Date, dateStr: string, amount: number }> = [];
    let current = new Date(start);
    while (current <= end) {
      days.push({
        date: new Date(current),
        dateStr: current.toLocaleDateString(),
        amount: 0
      });
      current.setDate(current.getDate() + 1);
    }

    transactions.forEach(t => {
      const isCredit = t.category && ["on me doit", "je dois"].some(c => t.category!.toLowerCase().includes(c));
      if ((t.type === "EXPENSE" || (t.type as any) === "expense") && !isCredit && t.timestamp >= start.getTime() && t.timestamp <= end.getTime()) {
        const dStr = new Date(t.timestamp).toLocaleDateString();
        const day = days.find(d => d.dateStr === dStr);
        if (day) day.amount += t.amount;
      }
    });

    return days;
  }, [transactions, timeRange]);

  const monthlyComparisonData = useMemo(() => {
    const data: any[] = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999);
      
      const monthTx = transactions.filter(t => {
        const isCredit = t.category && ["on me doit", "je dois", "مستحقات لي", "ديون علي", "owed to me", "i owe", "loans", "debts", "crédit +", "crédit --"].includes(t.category.toLowerCase());
        const isExpense = (t.type === "EXPENSE" || (t.type as any) === "expense") && !isCredit && t.category !== "Virement";
        return isExpense && t.timestamp >= monthStart.getTime() && t.timestamp <= monthEnd.getTime();
      });

      const total = monthTx.reduce((sum, t) => sum + t.amount, 0);
      
      data.push({
        name: monthStart.toLocaleDateString(language === 'Français' ? 'fr-FR' : language === 'العربية' ? 'ar-SA' : 'en-US', { month: 'short' }),
        amount: total,
      });
    }
    
    return data;
  }, [transactions, language]);

  const periods = [
    {
      id: "day",
      label: language === "Français" ? "Jour" : "Day",
      icon: <Clock size={14} />,
    },
    {
      id: "week",
      label: language === "Français" ? "Semaine" : "Week",
      icon: <Calendar size={14} />,
    },
    {
      id: "month",
      label: language === "Français" ? "Mois" : "Month",
      icon: <BarChart3 size={14} />,
    },
  ];

  const pieData = useMemo(() => {
    return Object.entries(periodStats)
      .filter(([_, data]) => data.total > 0)
      .map(([category, data]) => ({
        name: category,
        value: data.total,
        color: CATEGORY_STYLES[category]?.color || "#64748B",
      }));
  }, [periodStats]);

  const selectedCategoryTransactions = useMemo(() => {
    if (!selectedPieCategory) return [];

    const { start, end } = timeRange;

    return transactions
      .filter((t) => {
        const isCredit =
          t.category &&
          [
            "on me doit",
            "je dois",
            "مستحقات لي",
            "ديون علي",
            "owed to me",
            "i owe",
            "loans",
            "debts",
            "crédit +",
            "crédit --",
          ].includes(t.category.toLowerCase());
        const isExpense =
          (t.type === "EXPENSE" || (t.type as any) === "expense") && !isCredit && t.category !== "Virement";
        if (!isExpense || t.timestamp < start.getTime() || t.timestamp > end.getTime()) return false;
        let category = t.category || "Autres";
        if (category === "Food" || category === "Nourriture") {
           const pref = INITIAL_PREDEFINED_ITEMS.find(p => p.name.toLowerCase() === (t.label || '').toLowerCase());
           category = pref ? pref.category : "Autres";
        }
        else if (category === "Leisure") category = "Loisirs";
        else if (category === "Others") category = "Autres";
        return category === selectedPieCategory;
      })
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [transactions, selectedPieCategory, timeRange]);

  const handlePieClick = (data: any) => {
    const categoryName = data?.name || data?.payload?.name;
    if (categoryName) {
      setSelectedPieCategory(categoryName);
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent px-4 pb-24 overflow-y-auto relative">
      {/* Title 1 */}
      <div className="mb-2 mt-6">
        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-[#1B7C86] ml-1">
          {language === "Français"
            ? "Récapitulatif par Catégorie"
            : "Category Summary"}
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
                ? "bg-[#1B7C86] text-white shadow-lg shadow-[#1B7C86]/20"
                : "text-slate-500 hover:bg-white/10"
            }`}
          >
            {p.icon}
            {p.label}
          </button>
        ))}
      </div>

      {/* KPI Dashboard (PoP & Run-Rate) */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className={`p-4 rounded-[24px] border ${isDarkMode ? "bg-slate-800/40 border-slate-700" : "bg-white border-slate-100 shadow-sm"}`}>
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
            {language === 'Français' ? 'Dépenses Totales' : language === 'العربية' ? 'إجمالي النفقات' : 'Total Expenses'}
          </div>
          <div className={`text-xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-800"}`}>
            {currentTotal.toLocaleString()} <span className="text-[10px] uppercase opacity-50">{currency}</span>
          </div>
          {prevTotal > 0 && (
            <div className={`text-[10px] font-bold uppercase mt-2 flex items-center gap-1 ${popPercentage > 0 ? 'text-rose-500 bg-rose-500/10' : 'text-emerald-500 bg-emerald-500/10'} px-2 py-1 rounded-lg w-max`}>
              {popPercentage > 0 ? '+' : ''}{popPercentage.toFixed(1)}% 
              <span className="opacity-70 ml-1">{language === 'Français' ? 'vs préc.' : 'vs prev.'}</span>
            </div>
          )}
        </div>
        <div className={`p-4 rounded-[24px] border ${isDarkMode ? "bg-slate-800/40 border-slate-700" : "bg-white border-slate-100 shadow-sm"}`}>
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
            {language === 'Français' ? 'Projection Fin Période' : language === 'العربية' ? 'التوقعات' : 'Projected'}
          </div>
          <div className={`text-xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-800"}`}>
            {projectedTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className="text-[10px] uppercase opacity-50">{currency}</span>
          </div>
          <div className="text-[10px] font-bold text-slate-500 uppercase mt-2 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg w-max">
            {runRate.toLocaleString(undefined, { maximumFractionDigits: 0 })} {currency} / {language === 'Français' ? 'jour' : 'day'}
          </div>
        </div>
      </div>

      {/* Pie Chart */}
      {pieData.length > 0 && (
        <div
          className={`rounded-[32px] overflow-hidden border ${
            isDarkMode
              ? "bg-slate-800/40 border-slate-700"
              : "bg-white border-slate-100 shadow-sm"
          } mb-6`}
        >
          <div className="p-4 h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                  onClick={handlePieClick}
                  className="cursor-pointer"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [
                    `${Number(value).toLocaleString()} ${currency}`,
                    "",
                  ]}
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    padding: "12px",
                    boxShadow:
                      "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                    background: isDarkMode ? "#1e293b" : "#ffffff",
                  }}
                  itemStyle={{
                    color: isDarkMode ? "#ffffff" : "#0F172A",
                    fontWeight: "900",
                    fontSize: "14px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Heatmap (Activité) */}
      {heatmapData.length > 0 && period === "month" && (
        <div className="mb-6">
          <div className="mb-4">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-[#1B7C86] ml-1">
              {language === "Français" ? "Intensité des Dépenses" : "Spending Heatmap"}
            </h2>
          </div>
          <div className={`rounded-[32px] overflow-hidden border p-4 h-[120px] w-full ${isDarkMode ? "bg-slate-800/40 border-slate-700" : "bg-white border-slate-100 shadow-sm"} flex items-end gap-1`}>
            {heatmapData.map((day, idx) => {
              const maxAmt = Math.max(...heatmapData.map(d => d.amount), 1);
              const heightPct = Math.max((day.amount / maxAmt) * 100, 4);
              const isToday = day.date.toLocaleDateString() === new Date().toLocaleDateString();
              
              return (
                <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                  <div 
                    className={`w-full rounded-sm transition-all duration-300 ${day.amount > 0 ? 'bg-rose-500' : 'bg-slate-200 dark:bg-slate-700'}`} 
                    style={{ height: `${heightPct}%`, opacity: day.amount > 0 ? Math.max(0.3, day.amount / maxAmt) : 0.3 }}
                  />
                  {isToday && <div className="absolute -bottom-2 w-1 h-1 rounded-full bg-slate-800 dark:bg-white" />}
                  
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full mb-2 hidden group-hover:block z-10 w-max pointer-events-none">
                    <div className={`text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg ${isDarkMode ? "bg-slate-700 text-white" : "bg-slate-800 text-white"}`}>
                      {day.date.getDate()} {day.date.toLocaleDateString(undefined, {month: 'short'})}: {day.amount.toLocaleString()} {currency}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Monthly Comparison Chart */}
      {monthlyComparisonData.length > 0 && period === "month" && (
        <div className="mb-6">
          <div className="mb-4">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-[#1B7C86] ml-1">
              {language === "Français" ? "Comparaison Mensuelle" : language === 'العربية' ? 'مقارنة شهرية' : "Monthly Comparison"}
            </h2>
          </div>
          <div className={`rounded-[32px] overflow-hidden border p-4 h-[250px] w-full ${isDarkMode ? "bg-slate-800/40 border-slate-700" : "bg-white border-slate-100 shadow-sm"}`}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyComparisonData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#334155" : "#e2e8f0"} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: isDarkMode ? "#94a3b8" : "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: isDarkMode ? "#94a3b8" : "#64748b" }} axisLine={false} tickLine={false} tickFormatter={(val) => `${val >= 1000 ? (val/1000).toFixed(1) + 'k' : val}`} />
                <Tooltip
                  cursor={{ fill: isDarkMode ? '#334155' : '#f1f5f9' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className={`p-3 rounded-2xl shadow-lg border ${isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-100 text-slate-800"}`}>
                          <p className="font-bold text-xs mb-1">{data.name}</p>
                          <p className="font-black text-sm text-rose-500">
                            {data.amount.toLocaleString()} {currency}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="amount" fill="#1B7C86" radius={[4, 4, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Waterfall Chart */}
      {waterfallData.length > 0 && (
        <div className="mb-6">
          <div className="mb-4">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-[#1B7C86] ml-1">
              {language === "Français" ? "Cascade Cash Flow" : "Cash Flow Waterfall"}
            </h2>
          </div>
          <div className={`rounded-[32px] overflow-hidden border p-4 h-[300px] w-full ${isDarkMode ? "bg-slate-800/40 border-slate-700" : "bg-white border-slate-100 shadow-sm"}`}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={waterfallData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#334155" : "#e2e8f0"} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: isDarkMode ? "#94a3b8" : "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: isDarkMode ? "#94a3b8" : "#64748b" }} axisLine={false} tickLine={false} tickFormatter={(val) => `${val/1000}k`} />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className={`p-3 rounded-2xl shadow-lg border ${isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-100 text-slate-800"}`}>
                          <p className="font-bold text-xs mb-1">{data.name}</p>
                          <p className={`font-black text-sm ${data.isExpense ? "text-rose-500" : "text-emerald-500"}`}>
                            {data.isExpense ? "-" : (data.isTotal ? "" : "+")}{data.amount.toLocaleString()} {currency}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="start" stackId="a" fill="transparent" />
                <Bar dataKey="amount" stackId="a" radius={[4,4,4,4]}>
                  {waterfallData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.isTotal ? "#3b82f6" : entry.isExpense ? "#ef4444" : "#10b981"} />
                  ))}
                </Bar>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Vampire Expenses (Matrice Coût vs Fréquence) */}
      {vampireData.length > 0 && (
        <div className="mb-6">
          <div className="mb-4">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-[#1B7C86] ml-1">
              {language === "Français" ? "Dépenses Vampires" : "Vampire Expenses"}
            </h2>
            <p className="text-[10px] text-slate-400 ml-1 font-bold uppercase tracking-widest mt-1">
              {language === "Français" ? "Coût Moyen vs Fréquence" : "Avg Cost vs Frequency"}
            </p>
          </div>
          <div className={`rounded-[32px] overflow-hidden border p-4 h-[300px] w-full ${isDarkMode ? "bg-slate-800/40 border-slate-700" : "bg-white border-slate-100 shadow-sm"}`}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#334155" : "#e2e8f0"} />
                <XAxis type="number" dataKey="count" name="Fréquence" tick={{ fontSize: 10, fill: isDarkMode ? "#94a3b8" : "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis type="number" dataKey="avgCost" name="Coût Moyen" tick={{ fontSize: 10, fill: isDarkMode ? "#94a3b8" : "#64748b" }} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}`} />
                <ZAxis type="number" dataKey="total" range={[100, 1000]} name="Total" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className={`p-3 rounded-2xl shadow-lg border ${isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-100 text-slate-800"}`}>
                          <p className="font-bold text-xs mb-1 capitalize">{data.name}</p>
                          <div className="flex flex-col gap-1 text-[10px] uppercase font-bold text-slate-500">
                            <p>Fréq: <span className="text-slate-800 dark:text-white font-black">{data.count}x</span></p>
                            <p>Moyen: <span className="text-slate-800 dark:text-white font-black">{Math.round(data.avgCost).toLocaleString()} {currency}</span></p>
                            <p className="text-rose-500 mt-1 font-black">Total: {data.total.toLocaleString()} {currency}</p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter data={vampireData} shape="circle">
                  {vampireData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} opacity={0.8} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Stats Board (Category Table) */}
      <div className="space-y-3 mb-10">
        {Object.entries(
          periodStats as Record<
            string,
            { total: number; articles: Record<string, number> }
          >
        ).filter(([_, data]) => data.total > 0).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-slate-400 bg-white/50 dark:bg-white/5 rounded-3xl border border-dashed border-slate-200 dark:border-white/10">
            <Target size={32} className="mb-2 opacity-20" />
            <p className="font-bold text-[10px] tracking-widest uppercase">
              Aucune dépense par catégorie
            </p>
          </div>
        ) : (
          (
            Object.entries(periodStats) as [
              string,
              { total: number; articles: Record<string, number> }
            ][]
          )
            .filter(([_, data]) => data.total > 0)
            .map(([category, data]) => {
              const style = CATEGORY_STYLES[category] || {
                color: "#64748B",
                icon: <BarChart3 size={18} />,
                bg: "bg-slate-100",
              };
              const isExpanded = expandedCategories.includes(category);

              return (
                <div
                  key={category}
                  className={`rounded-3xl overflow-hidden border transition-all duration-300 ${
                    isDarkMode
                      ? "bg-slate-800/40 border-slate-700"
                      : "bg-white border-slate-100 shadow-sm"
                  }`}
                >
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full flex items-center justify-between p-5 group"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-2xl ${!style.color ? style.bg : ''} flex items-center justify-center`}
                        style={style.color ? { color: style.color, backgroundColor: `${style.color}20` } : undefined}
                      >
                        {style.icon}
                      </div>
                      <div className="text-left">
                        <h3
                          className="text-sm font-black uppercase tracking-widest"
                          style={{ color: isDarkMode ? "white" : style.color }}
                        >
                          {category}
                        </h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                          {Object.keys(data.articles).length} Articles
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p
                          className="text-lg font-black tracking-tighter"
                          style={{ color: isDarkMode ? "white" : "#0F172A" }}
                        >
                          {data.total.toLocaleString()}{" "}
                          <span className="text-xs opacity-40">{currency}</span>
                        </p>
                        {categoryBudgets[category] && (
                          <p
                            className="text-[9px] font-bold uppercase mt-0.5"
                            style={{
                              color:
                                data.total > categoryBudgets[category]
                                  ? "#ef4444"
                                  : "#64748b",
                            }}
                          >
                            / {categoryBudgets[category].toLocaleString()}{" "}
                            {currency}
                          </p>
                        )}
                      </div>
                      <div
                        className={`p-1 rounded-full transition-transform duration-300 ${
                          isExpanded
                            ? "rotate-180 bg-slate-100 dark:bg-white/10"
                            : ""
                        }`}
                      >
                        <ChevronDown size={18} className="text-slate-400" />
                      </div>
                    </div>
                  </button>

                  {categoryBudgets[category] && (
                    <div className="px-6 pb-4">
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(
                              (data.total / categoryBudgets[category]) * 100,
                              100
                            )}%`,
                            backgroundColor:
                              data.total > categoryBudgets[category]
                                ? "#ef4444"
                                : style.color,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-slate-50/50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-white/5"
                      >
                        <div className="p-4 space-y-2">
                          {onUpdateBudget && (
                            <div className="flex items-center gap-2 mb-4 px-2">
                              <input
                                type="number"
                                placeholder="Budget limite..."
                                className="flex-1 bg-white dark:bg-slate-800 border-none rounded-xl text-xs font-bold px-3 py-2 outline-none w-24"
                                defaultValue={categoryBudgets[category] || ""}
                                onBlur={(e) => {
                                  const val = parseFloat(e.target.value);
                                  if (!isNaN(val))
                                    onUpdateBudget(category, val);
                                  else if (e.target.value === "")
                                    onUpdateBudget(category, 0); // clear
                                }}
                              />
                              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                                Configuration
                              </span>
                            </div>
                          )}
                          {Object.entries(data.articles).map(
                            ([article, amount]) => {
                              const info = getArticleInfo(
                                article,
                                category,
                                predefinedItems
                              );
                              const IconComp = info.iconName
                                ? ICON_MAP[info.iconName]
                                : null;

                              return (
                                <div
                                  key={article}
                                  className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-white dark:hover:bg-white/5 transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    {info.iconSvg ? (
                                      <div
                                        className={`w-6 h-6 rounded-md flex items-center justify-center ${!info.colorHex ? `${info.bgColor} ${info.color}` : ''}`}
                                        style={info.colorHex ? { backgroundColor: `${info.colorHex}20`, color: info.colorHex } : undefined}
                                      >
                                        <div
                                          dangerouslySetInnerHTML={{
                                            __html: info.iconSvg,
                                          }}
                                          className="w-3 h-3 flex items-center justify-center text-current svg-container"
                                        />
                                      </div>
                                    ) : IconComp ? (
                                      <div
                                        className={`w-6 h-6 rounded-md flex items-center justify-center ${!info.colorHex ? `${info.bgColor} ${info.color}` : ''}`}
                                        style={info.colorHex ? { backgroundColor: `${info.colorHex}20`, color: info.colorHex } : undefined}
                                      >
                                        <IconComp size={12} />
                                      </div>
                                    ) : (
                                      <div
                                        className="w-1.5 h-1.5 rounded-full"
                                        style={{
                                          backgroundColor: info.colorHex,
                                        }}
                                      />
                                    )}
                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300 capitalize">
                                      {article}
                                    </span>
                                  </div>
                                  <span className="text-xs font-black text-slate-900 dark:text-white tabular-nums">
                                    {amount.toLocaleString()} {currency}
                                  </span>
                                </div>
                              );
                            }
                          )}
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
          {language === "Français" ? "Top 10 des Achats" : "Top 10 Purchases"}
        </h2>
      </div>

      <div
        className={`rounded-[32px] overflow-hidden border ${
          isDarkMode
            ? "bg-slate-800/40 border-slate-700"
            : "bg-white border-slate-100 shadow-sm"
        } mb-10`}
      >
        <div className="p-2">
          {(() => {
            const now = new Date();
            const startOfPeriod = new Date();
            if (period === "day") startOfPeriod.setHours(0, 0, 0, 0);
            else if (period === "week") {
              const d = now.getDay();
              const diff = now.getDate() - d + (d === 0 ? -6 : 1);
              startOfPeriod.setDate(diff);
              startOfPeriod.setHours(0, 0, 0, 0);
            } else if (period === "month") {
              startOfPeriod.setDate(1);
              startOfPeriod.setHours(0, 0, 0, 0);
            }

            const periodExpenses = transactions.filter((t) => {
              const isCredit =
                t.category &&
                [
                  "on me doit",
                  "je dois",
                  "مستحقات لي",
                  "ديون علي",
                  "owed to me",
                  "i owe",
                  "loans",
                  "debts",
                  "crédit +",
                  "crédit --",
                ].includes(t.category.toLowerCase());
              const isExpense =
                (t.type === "EXPENSE" || (t.type as any) === "expense") &&
                !isCredit && t.category !== "Virement";
              return isExpense && t.timestamp >= startOfPeriod.getTime();
            });

            const topMap: Record<string, { count: number; category: string }> =
              {};
            periodExpenses.forEach((t) => {
              const name = t.label || "Article";
              if (!topMap[name]) {
                topMap[name] = { count: 0, category: t.category || "Autres" };
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
                  <p className="font-bold text-[10px] tracking-widest uppercase">
                    Aucune donnée disponible
                  </p>
                </div>
              );
            }

            return (
              <div className="space-y-1">
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 dark:border-white/5 mb-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    Article
                  </span>
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    Fréquence
                  </span>
                </div>
                {topArticles.map((art, idx) => {
                  const info = getArticleInfo(
                    art.name,
                    art.category,
                    predefinedItems
                  );
                  const IconComp = info.iconName
                    ? ICON_MAP[info.iconName]
                    : null;

                  return (
                    <motion.div
                      key={art.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-black text-slate-300 dark:text-white/20 w-4">
                          {idx + 1}.
                        </span>
                        {info.iconSvg ? (
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center ${!info.colorHex ? `${info.bgColor} ${info.color}` : ''}`}
                            style={info.colorHex ? { backgroundColor: `${info.colorHex}20`, color: info.colorHex } : undefined}
                          >
                            <div
                              dangerouslySetInnerHTML={{ __html: info.iconSvg }}
                              className="w-4 h-4 flex items-center justify-center text-current svg-container"
                            />
                          </div>
                        ) : (
                          IconComp && (
                            <div
                              className={`w-8 h-8 rounded-xl flex items-center justify-center ${!info.colorHex ? `${info.bgColor} ${info.color}` : ''}`}
                              style={info.colorHex ? { backgroundColor: `${info.colorHex}20`, color: info.colorHex } : undefined}
                            >
                              <IconComp size={16} />
                            </div>
                          )
                        )}
                        <div className="flex flex-col">
                          <span
                            className="text-sm font-black capitalize"
                            style={{ color: info.colorHex }}
                          >
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
      {/* Budget Setup Modal (Optional if needed here, but usually handled in App/Home) */}
      <AnimatePresence>
        {selectedPieCategory !== null &&
          createPortal(
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`fixed inset-0 z-[100] flex flex-col ${
                isDarkMode ? "bg-slate-900" : "bg-slate-50"
              }`}
            >
              <div
                className={`flex items-center gap-4 p-6 pt-10 sticky top-0 z-10 ${
                  isDarkMode ? "bg-slate-900/90" : "bg-slate-50/90"
                } backdrop-blur-md`}
              >
                <button
                  onClick={() => setSelectedPieCategory(null)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform active:scale-95 ${
                    isDarkMode
                      ? "bg-slate-800 text-white"
                      : "bg-white text-slate-800 shadow-sm border border-slate-100"
                  }`}
                >
                  <X size={20} />
                </button>
                <h2 className="text-xl font-black uppercase tracking-widest">
                  {selectedPieCategory}
                </h2>
              </div>

              <div className="flex-1 overflow-y-auto px-6 pb-24">
                <div className="mb-6 mt-4">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                    Total {selectedPieCategory}
                  </div>
                  <div
                    className={`text-4xl font-black leading-none ${
                      CATEGORY_STYLES[selectedPieCategory]?.color
                        ? ""
                        : "text-slate-800 dark:text-white"
                    }`}
                    style={{
                      color: CATEGORY_STYLES[selectedPieCategory]?.color,
                    }}
                  >
                    {selectedCategoryTransactions
                      .reduce((sum, t) => sum + t.amount, 0)
                      .toLocaleString("fr-FR")}{" "}
                    <span className="text-2xl">{currency}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {selectedCategoryTransactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                      <p className="font-bold text-xs uppercase tracking-widest">
                        Aucune transaction
                      </p>
                    </div>
                  ) : (
                    selectedCategoryTransactions.map((tx) => (
                      <div
                        key={tx.id}
                        className={`p-4 rounded-2xl border flex items-center justify-between ${
                          isDarkMode
                            ? "bg-slate-800/50 border-slate-700"
                            : "bg-white border-slate-100 shadow-sm"
                        }`}
                      >
                        <div>
                          <p
                            className={`font-bold text-sm ${
                              isDarkMode ? "text-white" : "text-slate-800"
                            }`}
                          >
                            {tx.label || tx.category}
                          </p>
                          <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">
                            {new Date(tx.timestamp).toLocaleDateString()} •{" "}
                            {new Date(tx.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-rose-500">
                            -{tx.amount.toLocaleString("fr-FR")} {currency}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>,
            document.body
          )}
      </AnimatePresence>
    </div>
  );
}
