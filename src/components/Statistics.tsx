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
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
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
  const [period, setPeriod] = useState<"day" | "week" | "month">("week");
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
          (t.type === "EXPENSE" || (t.type as any) === "expense") && !isCredit;
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

  const periodStats = useMemo(() => {
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
        (t.type === "EXPENSE" || (t.type as any) === "expense") && !isCredit;
      return isExpense && t.timestamp >= startOfPeriod.getTime();
    });

    const grouped: Record<
      string,
      { total: number; articles: Record<string, number> }
    > = {};
    const mainCategories = [
      "Nourriture",
      "Shopping",
      "Transport",
      "Loisirs",
      "Autres",
    ];
    mainCategories.forEach(
      (cat) => (grouped[cat] = { total: 0, articles: {} })
    );

    expenses.forEach((t) => {
      let category = t.category || "Autres";
      if (category === "Food") category = "Nourriture";
      else if (category === "Leisure") category = "Loisirs";
      else if (category === "Others") category = "Autres";

      if (!grouped[category]) grouped[category] = { total: 0, articles: {} };
      grouped[category].total += t.amount;
      const articleName = t.label || "Article";
      grouped[category].articles[articleName] =
        (grouped[category].articles[articleName] || 0) + t.amount;
    });

    return grouped;
  }, [transactions, period]);

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
          (t.type === "EXPENSE" || (t.type as any) === "expense") && !isCredit;
        if (!isExpense || t.timestamp < startOfPeriod.getTime()) return false;
        let category = t.category || "Autres";
        if (category === "Food") category = "Nourriture";
        else if (category === "Leisure") category = "Loisirs";
        else if (category === "Others") category = "Autres";
        return category === selectedPieCategory;
      })
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [transactions, selectedPieCategory, period]);

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
                        className={`w-12 h-12 rounded-2xl ${style.bg} flex items-center justify-center`}
                        style={{ color: style.color }}
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
                                        className={`w-6 h-6 rounded-md flex items-center justify-center ${info.bgColor} ${info.color}`}
                                      >
                                        <div
                                          dangerouslySetInnerHTML={{
                                            __html: info.iconSvg,
                                          }}
                                          className="w-3 h-3 text-current"
                                        />
                                      </div>
                                    ) : IconComp ? (
                                      <div
                                        className={`w-6 h-6 rounded-md flex items-center justify-center ${info.bgColor} ${info.color}`}
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
                !isCredit;
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
                            className={`w-8 h-8 rounded-xl flex items-center justify-center ${info.bgColor} ${info.color}`}
                          >
                            <div
                              dangerouslySetInnerHTML={{ __html: info.iconSvg }}
                              className="w-4 h-4 text-current"
                            />
                          </div>
                        ) : (
                          IconComp && (
                            <div
                              className={`w-8 h-8 rounded-xl flex items-center justify-center ${info.bgColor} ${info.color}`}
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
