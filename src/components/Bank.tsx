import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  CalendarCheck,
  CalendarRange,
  CalendarDays,
  Calendar,
  Landmark,
  ArrowDownToLine,
  Utensils,
  ShoppingBag,
  Car,
  Gamepad2,
  MoreHorizontal
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Transaction } from "../types";
import AddBankBalanceModal from "./AddBankBalanceModal";
import { ICON_MAP, INITIAL_PREDEFINED_ITEMS, getArticleInfo } from '../constants';

interface BankProps {
  language: string;
  currency: string;
  transactions?: Transaction[];
  onAddClick?: (type: "INCOME" | "EXPENSE") => void;
  onAddBankBalance?: (amount: number) => void;
}

export default function Bank({
  language,
  currency,
  transactions = [],
  onAddClick,
  onAddBankBalance,
}: BankProps) {
  const [showBankModal, setShowBankModal] = useState(false);
  const [bankTimeframe, setBankTimeframe] = useState<"day" | "week" | "month">("day");

  const filteredBankTotals = React.useMemo(() => {
    const now = new Date();
    const startOfPeriod = new Date();

    if (bankTimeframe === "day") {
      startOfPeriod.setHours(0, 0, 0, 0);
    } else if (bankTimeframe === "week") {
      const day = now.getDay() || 7;
      startOfPeriod.setDate(now.getDate() - day + 1);
      startOfPeriod.setHours(0, 0, 0, 0);
    } else {
      startOfPeriod.setDate(1);
      startOfPeriod.setHours(0, 0, 0, 0);
    }

    let totalExpense = 0;
    let totalIncome = 0;

    transactions
      .filter(
        (tx) =>
          tx.timestamp >= startOfPeriod.getTime() &&
          tx.timestamp <= now.getTime(),
      )
      .forEach((tx) => {
        if (tx.type === "INCOME" && tx.paidByBank) {
          totalIncome += tx.amount;
        } else if (tx.type === "EXPENSE" && tx.paidByBank) {
          totalExpense += tx.amount;
        } else if (tx.type === "INCOME" && !tx.paidByBank) {
          totalExpense += tx.amount;
        }
      });

    return { totalIncome, totalExpense };
  }, [transactions, bankTimeframe]);

  const getTimeframeLabel = (frame: "day" | "week" | "month") => {
    if (language === "Français")
      return frame === "day" ? "Jour" : frame === "week" ? "Semaine" : "Mois";
    if (language === "العربية")
      return frame === "day" ? "اليوم" : frame === "week" ? "أسبوع" : "شهر";
    return frame === "day" ? "Day" : frame === "week" ? "Week" : "Month";
  };

  const bankTransactions = transactions.filter((tx) => {
    return (
      (tx.type === "INCOME" && tx.paidByBank) ||
      (tx.type === "EXPENSE" && tx.paidByBank) ||
      (tx.type === "INCOME" && !tx.paidByBank)
    );
  });

  const getCategoryMap = () => [
    {
      label: language === "Français" ? "Nourriture" : language === "العربية" ? "طعام" : "Food",
      icon: <Utensils size={24} />,
      color: "teal",
      bg: "bg-teal-100",
      text: "text-teal-600",
      glow: "bg-teal-400",
    },
    {
      label: language === "Français" ? "Shopping" : language === "العربية" ? "تسوق" : "Shopping",
      icon: <ShoppingBag size={24} />,
      color: "rose",
      bg: "bg-rose-100",
      text: "text-rose-600",
      glow: "bg-rose-400",
    },
    {
      label: language === "Français" ? "Transport" : language === "العربية" ? "نقل" : "Transport",
      icon: <Car size={24} />,
      color: "sky",
      bg: "bg-sky-100",
      text: "text-sky-600",
      glow: "bg-sky-400",
    },
    {
      label: language === "Français" ? "Loisirs" : language === "العربية" ? "ترفيه" : "Entertainment",
      icon: <Gamepad2 size={24} />,
      color: "purple",
      bg: "bg-purple-100",
      text: "text-purple-600",
      glow: "bg-purple-400",
    },
    {
      label: language === "Français" ? "Autres" : language === "العربية" ? "أخرى" : "Other",
      icon: <MoreHorizontal size={24} />,
      color: "slate",
      bg: "bg-slate-100",
      text: "text-slate-600",
      glow: "bg-slate-400",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6 pb-12"
    >
      <div className="space-y-4 pt-2">
        <AnimatePresence>
          {showBankModal && (
            <AddBankBalanceModal
              onClose={() => setShowBankModal(false)}
              onAdd={(amount) => {
                if (onAddBankBalance) {
                  onAddBankBalance(amount);
                }
              }}
              currency={currency}
            />
          )}
        </AnimatePresence>

        {/* Premium Summary Card (Bank) */}
        <div className="relative overflow-hidden rounded-[38px] shadow-xl shadow-slate-200/40 border border-white mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-white to-sky-50 z-0" />
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-teal-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-[-20%] left-[-10%] w-64 h-64 bg-sky-400/10 rounded-full blur-3xl" />

          <div className="relative z-10 p-5">
            <div className="flex bg-white/40 backdrop-blur-md p-1 rounded-3xl shadow-sm border border-white/50 mb-8">
              <button
                onClick={() => setBankTimeframe("day")}
                className={`flex-1 py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 ${bankTimeframe === "day" ? "bg-slate-900 text-white shadow-xl" : "text-slate-500 hover:bg-white/40"}`}
              >
                <CalendarCheck size={18} strokeWidth={bankTimeframe === "day" ? 2.5 : 2} />
                <span className="text-[10px] font-black uppercase tracking-wider">{getTimeframeLabel("day")}</span>
              </button>
              <button
                onClick={() => setBankTimeframe("week")}
                className={`flex-1 py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 ${bankTimeframe === "week" ? "bg-slate-900 text-white shadow-xl" : "text-slate-500 hover:bg-white/40"}`}
              >
                <CalendarRange size={18} strokeWidth={bankTimeframe === "week" ? 2.5 : 2} />
                <span className="text-[10px] font-black uppercase tracking-wider">{getTimeframeLabel("week")}</span>
              </button>
              <button
                onClick={() => setBankTimeframe("month")}
                className={`flex-1 py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 ${bankTimeframe === "month" ? "bg-slate-900 text-white shadow-xl" : "text-slate-500 hover:bg-white/40"}`}
              >
                <CalendarDays size={18} strokeWidth={bankTimeframe === "month" ? 2.5 : 2} />
                <span className="text-[10px] font-black uppercase tracking-wider">{getTimeframeLabel("month")}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 relative px-2 mb-2">
              <div className="absolute left-1/2 top-4 bottom-4 w-px bg-slate-200/50" />
              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-600">
                    <TrendingUp size={16} strokeWidth={2.5} />
                  </div>
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    {language === "Français" ? "Dépôts" : language === "العربية" ? "إيداعات" : "Deposits"}
                  </span>
                </div>
                <p className="text-2xl font-black text-teal-600 tracking-tighter">
                  {filteredBankTotals.totalIncome.toLocaleString("fr-FR")}
                  <span className="text-xs ml-1 font-bold text-slate-400 uppercase">{currency}</span>
                </p>
              </div>

              <div className="space-y-1 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-500/10 flex items-center justify-center text-slate-600">
                    <TrendingDown size={16} strokeWidth={2.5} />
                  </div>
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    {language === "Français" ? "Sorties" : language === "العربية" ? "نفقات" : "Outflows"}
                  </span>
                </div>
                <p className="text-2xl font-black text-slate-600 tracking-tighter">
                  {filteredBankTotals.totalExpense.toLocaleString("fr-FR")}
                  <span className="text-xs ml-1 font-bold text-slate-400 uppercase">{currency}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 px-1 mb-6">
          <button
            onClick={() => setShowBankModal(true)}
            className="group relative flex flex-col items-center justify-center gap-3 h-28 bg-white border-2 border-slate-50 rounded-[28px] transition-all hover:border-emerald-100 hover:bg-emerald-50/30 active:scale-95 shadow-sm"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
              <Landmark size={24} strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-emerald-600 transition-colors">
              {language === "Français" ? "Ajouter Salaire" : language === "العربية" ? "إضافة راتب" : "Add Salary"}
            </span>
          </button>
          <button
            onClick={() => onAddClick && onAddClick("INCOME")}
            className="group relative flex flex-col items-center justify-center gap-3 h-28 bg-white border-2 border-slate-50 rounded-[28px] transition-all hover:border-teal-100 hover:bg-teal-50/30 active:scale-95 shadow-sm"
          >
            <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
              <ArrowDownToLine size={24} strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-teal-600 transition-colors">
              {language === "Français" ? "Ajouter Retrait" : language === "العربية" ? "إضافة سحب" : "Add Withdrawal"}
            </span>
          </button>
        </div>

        {/* Bank Transactions List */}
        {bankTransactions.length === 0 ? (
          <div className="text-center py-12 text-slate-400 font-medium italic">
            {language === "Français" ? "Aucune transaction bancaire" : language === "العربية" ? "لا توجد معاملات بنكية" : "No bank transactions"}
          </div>
        ) : (
          <div className="space-y-4">
            {bankTransactions.map((tx, index) => {
              const isIncome = tx.type === "INCOME" && tx.paidByBank;
              const isRetrait = tx.type === "INCOME" && !tx.paidByBank;

              const categoryMatch = getCategoryMap().find(
                (c) => c.label && c.label.toLowerCase() === (tx.category || "").toLowerCase()
              ) || {
                icon: isIncome ? <TrendingUp size={24} /> : isRetrait ? <ArrowDownToLine size={24} /> : <ShoppingBag size={24} />,
                color: isIncome ? "teal" : isRetrait ? "emerald" : "slate",
                bg: isIncome ? "bg-teal-100" : isRetrait ? "bg-emerald-500" : "bg-slate-100",
                text: isIncome ? "text-teal-600" : isRetrait ? "text-white" : "text-slate-600",
                glow: isIncome ? "bg-teal-400" : isRetrait ? "bg-emerald-400" : "bg-slate-400",
              };

              const getCardStyle = () => {
                const colors: Record<string, string> = {
                  rose: "hover:border-rose-200 hover:shadow-rose-500/10",
                  sky: "hover:border-sky-200 hover:shadow-sky-500/10",
                  indigo: "hover:border-indigo-200 hover:shadow-indigo-500/10",
                  amber: "hover:border-amber-200 hover:shadow-amber-500/10",
                  purple: "hover:border-purple-200 hover:shadow-purple-500/10",
                  slate: "hover:border-slate-200 hover:shadow-slate-500/10",
                  emerald: "hover:border-emerald-200 hover:shadow-emerald-500/10",
                  teal: "hover:border-teal-200 hover:shadow-teal-500/10",
                };
                return colors[categoryMatch.color] || "hover:border-slate-200";
              };

              const info = getArticleInfo(tx.label, tx.category);
              const IconComp = info.iconName ? ICON_MAP[info.iconName] : null;

              return (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center gap-4 p-4 rounded-[32px] border transition-all relative backdrop-blur-sm bg-white shadow-sm group ${getCardStyle()}`}
                >
                  <div className={`shrink-0 w-14 h-14 rounded-[22px] flex items-center justify-center transition-all shadow-sm ${categoryMatch.bg} ${categoryMatch.text}`}>
                    {IconComp ? <IconComp size={24} /> : categoryMatch.icon}
                  </div>

                  <div className="flex-1 min-w-0 py-1">
                    <p className="font-black text-slate-800 text-sm tracking-tight truncate mb-1">
                      {tx.label}
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-400">
                        <Calendar size={12} className="text-slate-300" />
                        {tx.date}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2 pl-2 border-l border-slate-100">
                    <div className="flex flex-col items-end">
                      <p className={`font-black tracking-tighter text-base leading-none ${isIncome ? "text-teal-600" : "text-slate-800"}`}>
                        {isIncome ? "+" : "-"}
                        {tx.amount.toLocaleString("fr-FR")}
                      </p>
                      <span className="text-[9px] font-bold uppercase text-slate-400 mt-1">
                        {currency}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
