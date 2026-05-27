import React, { useState } from "react";
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
  Calculator,
  Copy,
  Minimize2,
  Divide,
  X,
  Landmark,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Transaction, CreditEntry } from "../types";

interface HomeProps {
  balance: number;
  bankBalance: number;
  onAddBankBalance: (amount: number) => void;
  transactions: Transaction[];
  onAddClick: (type: "INCOME" | "EXPENSE") => void;
  onViewAll: () => void;
  onDelete: (id: string) => void;
  onEdit: (tx: Transaction) => void;
  widgetMode: "balance" | "spending";
  widgetBalanceType: "cash" | "bank";
  widgetColor: "default" | "blue" | "purple" | "rose";
  language: string;
  currency: string;
  creditEntries: CreditEntry[];
  onNavigateToCredits: () => void;
}

export default function Home({
  balance,
  bankBalance,
  onAddBankBalance,
  transactions,
  onAddClick,
  onViewAll,
  onDelete,
  onEdit,
  widgetMode,
  widgetBalanceType,
  widgetColor,
  language,
  currency,
  creditEntries,
  onNavigateToCredits,
}: HomeProps) {
  const [timeframe, setTimeframe] = useState<"day" | "week" | "month">("week");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);

  const translations = {
    Français: {
      bonjour: "Bonjour",
      dansMaPoche: "Dans ma Poche",
      depensesHebdo: "Dépenses Hebdo",
      argentDispo: "Argent liquide disponible",
      cumulAchats: "Cumul de vos achats cette semaine",
      sommaireJour: "Sommaire du Jour",
      sommaireSemaine: "Sommaire de la Semaine",
      sommaireMois: "Sommaire du Mois",
      sommaire: "Sommaire",
      achatTotal: "Achat Total",
      tirageBanque: "Tirage Banque",
      ajouterAchat: "Ajouter Achat",
      ajouterRetrait: "Ajouter Retrait",
      analyses: "Analyses de Trésorerie",
      grandLivre: "Historique",
      voirTout: "Voir tout",
      retraits: "Retraits",
      depenses: "Dépenses",
      achats: "Achats",
      nourriture: "Nourriture",
      shopping: "Shopping",
      transport: "Transport",
      loisirs: "Loisirs",
      autres: "Autres",
      owedToMe: "On me doit",
      owedByMe: "Je dois",
    },
    العربية: {
      bonjour: "مرحباً",
      dansMaPoche: "في جيبي",
      depensesHebdo: "المصاريف الأسبوعية",
      argentDispo: "المبلغ المتوفر حالياً",
      cumulAchats: "مجموع مشترياتك هذا الأسبوع",
      sommaireJour: "ملخص اليوم",
      sommaireSemaine: "ملخص الأسبوع",
      sommaireMois: "ملخص الشهر",
      sommaire: "ملخص",
      achatTotal: "مجموع المشتريات",
      tirageBanque: "سحب بنكي",
      ajouterAchat: "إضافة شراء",
      ajouterRetrait: "إضافة سحب",
      analyses: "تحليلات الخزينة",
      grandLivre: "سجل المعاملات",
      voirTout: "عرض الكل",
      retraits: "السحوبات",
      depenses: "المصاريف",
      achats: "المشتريات",
      nourriture: "طعام",
      shopping: "تسوق",
      transport: "نقل",
      loisirs: "ترفيه",
      autres: "أخرى",
      owedToMe: "مستحقات لي",
      owedByMe: "ديون علي",
    },
    English: {
      bonjour: "Hello",
      dansMaPoche: "In my Pocket",
      depensesHebdo: "Weekly Spending",
      argentDispo: "Cash available",
      cumulAchats: "Your total purchases this week",
      sommaireJour: "Daily Summary",
      sommaireSemaine: "Weekly Summary",
      sommaireMois: "Monthly Summary",
      sommaire: "Summary",
      achatTotal: "Total Purchase",
      tirageBanque: "Bank Withdrawal",
      ajouterAchat: "Add Purchase",
      ajouterRetrait: "Add Withdrawal",
      analyses: "Treasury Analytics",
      grandLivre: "History",
      voirTout: "View all",
      retraits: "Withdrawals",
      depenses: "Expenses",
      achats: "Purchases",
      nourriture: "Food",
      shopping: "Shopping",
      transport: "Transport",
      loisirs: "Leisure",
      autres: "Others",
      owedToMe: "Owed to me",
      owedByMe: "I owe",
    },
  };

  const t =
    translations[language as keyof typeof translations] ||
    translations["Français"];

  const CATEGORY_MAP = [
    {
      label: t.nourriture,
      icon: <Utensils size={24} />,
      color: "teal",
      bg: "bg-teal-100",
      text: "text-teal-600",
      glow: "bg-teal-400",
    },
    {
      label: t.shopping,
      icon: <ShoppingBag size={24} />,
      color: "rose",
      bg: "bg-rose-100",
      text: "text-rose-600",
      glow: "bg-rose-400",
    },
    {
      label: t.transport,
      icon: <Car size={24} />,
      color: "sky",
      bg: "bg-sky-100",
      text: "text-sky-600",
      glow: "bg-sky-400",
    },
    {
      label: t.loisirs,
      icon: <Gamepad2 size={24} />,
      color: "purple",
      bg: "bg-purple-100",
      text: "text-purple-600",
      glow: "bg-purple-400",
    },
    {
      label: t.autres,
      icon: <MoreHorizontal size={24} />,
      color: "slate",
      bg: "bg-slate-100",
      text: "text-slate-600",
      glow: "bg-slate-400",
    },
  ];

  const getSummaryTitle = () => {
    if (timeframe === "day") return t.sommaireJour;
    if (timeframe === "month") return t.sommaireMois;
    return t.sommaireSemaine;
  };

  const totalOweMe = creditEntries
    .filter((e) => e.type === "OWE_ME")
    .reduce((acc, e) => acc + e.amount, 0);

  const totalIOwe = creditEntries
    .filter((e) => e.type === "I_OWE")
    .reduce((acc, e) => acc + e.amount, 0);

  const creditTranslations = {
    Français: {
      oweMe: "ON ME DOIT",
      iOwe: "JE DOIS",
      resume: "Résumé des crédits",
    },
    العربية: {
      oweMe: "لي عند الآخرين",
      iOwe: "علي للآخرين",
      resume: "ملخص الديون",
    },
    English: { oweMe: "OWED TO ME", iOwe: "I OWE", resume: "Credits Summary" },
  };
  const ct =
    creditTranslations[language as keyof typeof creditTranslations] ||
    creditTranslations["Français"];

  const filteredTotals = React.useMemo(() => {
    const now = new Date();
    const startOfPeriod = new Date();

    if (timeframe === "day") {
      startOfPeriod.setHours(0, 0, 0, 0);
    } else if (timeframe === "week") {
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      startOfPeriod.setDate(diff);
      startOfPeriod.setHours(0, 0, 0, 0);
    } else if (timeframe === "month") {
      startOfPeriod.setDate(1);
      startOfPeriod.setHours(0, 0, 0, 0);
    }

    let totalExpense = 0;
    let totalIncome = 0;

    transactions.forEach((tx) => {
      if (tx.timestamp >= startOfPeriod.getTime()) {
        const isCredit = (tx.category && ["on me doit","je dois","مستحقات لي","ديون علي","owed to me","i owe","loans","debts","crédit +","crédit --"].includes(tx.category.toLowerCase()));
        if (!isCredit) {
          if (tx.type === "EXPENSE") totalExpense += tx.amount;
          else if (tx.type === "INCOME" && !tx.paidByBank) totalIncome += tx.amount;
        }
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

  const gradients: Record<string, string> = {
    default: "linear-gradient(90deg, #AED8D3 0%, #FAD8A0 100%)",
    blue: "linear-gradient(90deg, #93C5FD 0%, #E0E7FF 100%)",
    purple: "linear-gradient(90deg, #D8B4FE 0%, #F3E8FF 100%)",
    rose: "linear-gradient(90deg, #FDA4AF 0%, #FFE4E6 100%)",
  };

  const widgetBackground =
    widgetMode === "balance"
      ? gradients[widgetColor] || gradients["default"]
      : "linear-gradient(90deg, #F9B29B 0%, #C8E6C9 100%)";

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      {/* Main Widget Card */}
      <div
        className="relative min-h-[12rem] h-auto rounded-[24px] overflow-hidden shadow-lg mb-8 transition-all hover:scale-[1.01] cursor-pointer"
        style={{ background: widgetBackground }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${widgetMode}-${widgetBalanceType}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="relative z-10 py-5 px-6 h-full w-full flex flex-col justify-center"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowBankModal(true);
              }}
              className="absolute top-4 right-4 w-10 h-10 bg-white/40 rounded-xl flex items-center justify-center text-slate-800 hover:bg-white/60 transition-colors active:scale-95 shadow-sm border border-white/30 z-10"
            >
              <Plus size={20} strokeWidth={3} />
            </button>

            {widgetMode === "balance" && widgetBalanceType === "bank" && (
              <div className="flex flex-col items-start mb-1 z-10 relative mt-1 w-full">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <h2 className="text-slate-900/60 font-bold uppercase tracking-widest text-[10px]">
                      Solde Bancaire
                    </h2>
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <div className="text-4xl font-black text-slate-900 tracking-tighter">
                    {bankBalance.toLocaleString("fr-FR", {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                  <span className="text-xl font-bold text-slate-900/40 uppercase">
                    {currency}
                  </span>
                </div>
              </div>
            )}

            {widgetMode === "spending" && (
              <div className={`flex flex-col items-start relative z-10 w-full`}>
                <div className="flex items-center gap-2 mb-1 w-full justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full bg-slate-400`} />
                    <h2 className="text-slate-900/60 font-bold uppercase tracking-widest text-[10px]">
                      {t.depensesHebdo}
                    </h2>
                  </div>
                </div>

                <div className="flex items-end justify-between w-full">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <div className="text-4xl font-black text-slate-900 tracking-tighter">
                        {filteredTotals.totalExpense.toLocaleString("fr-FR")}
                      </div>
                      <span className="text-xl font-bold text-slate-900/40 uppercase">
                        {currency}
                      </span>
                    </div>
                    <p className="text-xs text-slate-900 font-bold mt-1 uppercase tracking-tight">
                      {t.cumulAchats}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {widgetMode === "balance" && widgetBalanceType === "cash" && (
              <>
                <div className="flex flex-col items-start mb-3 z-10 relative mt-1 w-full border-b border-slate-900/10 pb-3">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                      <h2 className="text-slate-900/60 font-bold uppercase tracking-widest text-[10px]">
                        Solde Bancaire
                      </h2>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <div className="text-4xl font-black text-slate-900 tracking-tighter">
                      {bankBalance.toLocaleString("fr-FR", {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                    <span className="text-xl font-bold text-slate-900/40 uppercase">
                      {currency}
                    </span>
                  </div>
                </div>

                <div
                  className={`flex flex-col items-start relative z-10 w-full`}
                >
                  <div className="flex items-center gap-2 mb-1 w-full justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full bg-emerald-600 animate-pulse`}
                      />
                      <h2 className="text-slate-900/60 font-bold uppercase tracking-widest text-[10px]">
                        {t.dansMaPoche}
                      </h2>
                    </div>
                  </div>

                  <div className="flex items-end justify-between w-full">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <div className="text-4xl font-black text-slate-900 tracking-tighter">
                          {balance.toLocaleString("fr-FR", {
                            minimumFractionDigits: 2,
                          })}
                        </div>
                        <span className="text-xl font-bold text-slate-900/40 uppercase">
                          {currency}
                        </span>
                      </div>
                      <p className="text-xs text-slate-900 font-bold mt-1 uppercase tracking-tight">
                        {t.argentDispo}
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowCalculator(true);
                      }}
                      className="w-10 h-10 bg-white/40 rounded-xl flex items-center justify-center text-slate-800 hover:bg-white/60 transition-colors active:scale-95 shadow-sm border border-white/30"
                    >
                      <Calculator size={20} />
                    </button>
                  </div>
                </div>
              </>
            )}

            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10 transform scale-150 text-slate-900 pointer-events-none">
              {widgetMode === "balance" ? (
                widgetBalanceType === "bank" ? (
                  <Landmark size={80} />
                ) : (
                  <Wallet size={80} />
                )
              ) : (
                <TrendingDown size={80} />
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {widgetMode === "balance" && widgetBalanceType === "bank" && (
        <div className="mb-8">
          <div className="bg-white/90 rounded-2xl px-5 py-4 border border-teal-brand/10 shadow-sm flex items-center justify-between hover:bg-white transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                <Wallet size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {t.argentDispo}
                </p>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <p className="text-sm font-black text-slate-700">
                    {balance.toLocaleString("fr-FR", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                  <span className="text-[10px] font-bold text-slate-400">
                    {currency}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowCalculator(true);
              }}
              className="w-10 h-10 bg-white border border-teal-brand/10 rounded-xl flex items-center justify-center text-teal-brand hover:bg-teal-brand/5 shadow-sm active:scale-95 transition-all"
            >
              <Calculator size={18} />
            </button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showCalculator && (
          <CalculatorModal onClose={() => setShowCalculator(false)} />
        )}
        {showBankModal && (
          <AddBankBalanceModal
            onClose={() => setShowBankModal(false)}
            onAdd={onAddBankBalance}
            currency={currency}
          />
        )}
      </AnimatePresence>

      {/* Quick Actions - Modern Redesign (Moved up) */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <button
          onClick={() => onAddClick("EXPENSE")}
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
          onClick={() => onAddClick("INCOME")}
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

      {/* Credits Buttons - Matching summary card style exactly */}
      <div className="mb-8">
        <h3 className="text-slate-900 font-black tracking-tight mb-4 px-1">
          Total Crédit
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div
            onClick={onNavigateToCredits}
            className="p-4 rounded-2xl border-2 border-indigo-100 bg-indigo-50/30 relative overflow-hidden group cursor-pointer transition-all hover:border-indigo-200 hover:shadow-sm active:scale-[0.98]"
          >
            <div className="relative z-10">
              <p className="text-[10px] text-slate-400 mb-1 font-black uppercase tracking-widest">
                {ct.oweMe}
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-indigo-600 leading-none">
                  {totalOweMe}
                </span>
                <span className="text-[10px] font-bold text-indigo-400 uppercase">
                  {currency}
                </span>
              </div>
            </div>
            <TrendingUp
              className="absolute -right-2 -bottom-2 text-indigo-500/10 rotate-12 group-hover:scale-110 transition-transform"
              size={48}
            />
          </div>

          <div
            onClick={onNavigateToCredits}
            className="p-4 rounded-2xl border-2 border-amber-100 bg-amber-50/30 relative overflow-hidden group cursor-pointer transition-all hover:border-amber-200 hover:shadow-sm active:scale-[0.98]"
          >
            <div className="relative z-10">
              <p className="text-[10px] text-slate-400 mb-1 font-black uppercase tracking-widest">
                {ct.iOwe}
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-amber-600 leading-none">
                  {totalIOwe}
                </span>
                <span className="text-[10px] font-bold text-amber-400 uppercase">
                  {currency}
                </span>
              </div>
            </div>
            <TrendingDown
              className="absolute -right-2 -bottom-2 text-amber-500/10 rotate-12 group-hover:scale-110 transition-transform"
              size={48}
            />
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
              onClick={() => setTimeframe("day")}
              className={`p-1.5 rounded-lg transition-all ${timeframe === "day" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"}`}
            >
              <CalendarCheck size={16} />
            </button>
            <button
              onClick={() => setTimeframe("week")}
              className={`p-1.5 rounded-lg transition-all ${timeframe === "week" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"}`}
            >
              <CalendarRange size={16} />
            </button>
            <button
              onClick={() => setTimeframe("month")}
              className={`p-1.5 rounded-lg transition-all ${timeframe === "month" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"}`}
            >
              <CalendarDays size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl border-2 border-danger-red/20 bg-danger-red/5 relative overflow-hidden group hover:border-danger-red/40 transition-all">
            <div className="relative z-10">
              <p className="text-xs text-slate-500 mb-1 font-medium">
                {t.achatTotal}
              </p>
              <p className="text-xl font-black text-danger-red leading-none">
                {filteredTotals.totalExpense.toLocaleString("fr-FR")} {currency}
              </p>
            </div>
            <ShoppingCart
              className="absolute -right-2 -bottom-2 text-danger-red/10 rotate-12 group-hover:scale-110 transition-transform"
              size={48}
            />
          </div>
          <div className="p-4 rounded-2xl border-2 border-bank-blue/20 bg-bank-blue/5 relative overflow-hidden group hover:border-bank-blue/40 transition-all">
            <div className="relative z-10">
              <p className="text-xs text-slate-500 mb-1 font-medium">
                {t.retraits}
              </p>
              <p className="text-xl font-black text-bank-blue leading-none">
                {filteredTotals.totalIncome.toLocaleString("fr-FR")} {currency}
              </p>
            </div>
            <Plus
              className="absolute -right-2 -bottom-2 text-bank-blue/10 rotate-12 group-hover:scale-110 transition-transform"
              size={48}
            />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div onClick={() => setActiveMenuId(null)}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-slate-900 font-black tracking-tight">
            {t.grandLivre}
          </h3>
          <button
            onClick={onViewAll}
            className="text-[10px] font-black text-rose-600 uppercase tracking-widest bg-rose-50 px-3 py-1.5 rounded-lg hover:bg-rose-100 transition-colors"
          >
            {t.voirTout}
          </button>
        </div>
        <div className="space-y-4">
          {transactions.slice(0, 3).map((tx, index) => {
            const isExpense = tx.type === "EXPENSE";
            const isCreditPlus =
              tx.category === t.owedToMe || tx.category === "Crédit +";
            const isCreditMinus =
              tx.category === t.owedByMe || tx.category === "Crédit --";

            // Case-insensitive matching to handle "TRANSPORT" vs "Transport"
            const categoryMatch = (CATEGORY_MAP || []).find(
              (c) =>
                c.label &&
                c.label.toLowerCase() === (tx.category || "").toLowerCase(),
            ) || {
              icon: isCreditPlus ? (
                <TrendingUp size={24} />
              ) : isCreditMinus ? (
                <TrendingDown size={24} />
              ) : isExpense ? (
                <ShoppingCart size={24} />
              ) : (
                <ArrowDownToLine size={24} />
              ),
              color: isCreditPlus
                ? "indigo"
                : isCreditMinus
                  ? "amber"
                  : isExpense
                    ? "slate"
                    : "emerald",
              bg: isCreditPlus
                ? "bg-indigo-600"
                : isCreditMinus
                  ? "bg-amber-500"
                  : isExpense
                    ? "bg-slate-100"
                    : "bg-emerald-500",
              text: isCreditPlus
                ? "text-white"
                : isCreditMinus
                  ? "text-white"
                  : isExpense
                    ? "text-slate-600"
                    : "text-white",
              glow: isCreditPlus
                ? "bg-indigo-400"
                : isCreditMinus
                  ? "bg-amber-400"
                  : isExpense
                    ? "bg-slate-400"
                    : "bg-emerald-400",
            };

            const getCardStyle = () => {
              if (isCreditPlus)
                return "bg-indigo-50/30 border-indigo-100/50 hover:border-indigo-200 hover:shadow-indigo-500/5";
              if (isCreditMinus)
                return "bg-amber-50/30 border-amber-100/50 hover:border-amber-200 hover:shadow-amber-500/5";
              if (!isExpense)
                return "bg-emerald-50/30 border-emerald-100/50 hover:border-emerald-200 hover:shadow-emerald-500/5 text-emerald-600";
              return `bg-white border-slate-100 shadow-sm ${getHoverColor(categoryMatch.color)}`;
            };

            const getHoverColor = (color: string) => {
              const colors: Record<string, string> = {
                amber: "hover:border-amber-200 hover:shadow-amber-500/10",
                rose: "hover:border-rose-200 hover:shadow-rose-500/10",
                sky: "hover:border-sky-200 hover:shadow-sky-500/10",
                purple: "hover:border-purple-200 hover:shadow-purple-500/10",
                slate: "hover:border-slate-200 hover:shadow-slate-500/10",
                emerald: "hover:border-emerald-200 hover:shadow-emerald-500/10",
                indigo: "hover:border-indigo-200 hover:shadow-indigo-500/10",
                teal: "hover:border-teal-200 hover:shadow-teal-500/10",
              };
              return colors[color] || "hover:border-slate-200";
            };

            if (isCreditPlus || isCreditMinus) {
              const isReceive = isCreditPlus;
              return (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.03 }}
                  className={`group flex items-center gap-4 p-5 rounded-[32px] border transition-transform relative bg-opacity-95 shadow-sm ${
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
                                onClick={() => {
                                  setEditingTx(tx);
                                  setActiveMenuId(null);
                                }}
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
              );
            }

            return (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center gap-4 p-5 rounded-[32px] border transition-transform group relative bg-opacity-95 shadow-sm ${getCardStyle()}`}
                style={{
                  overflow: activeMenuId === tx.id ? "visible" : "hidden",
                  zIndex: activeMenuId === tx.id ? 50 : 1,
                }}
              >
                {/* Visual Category Ornament */}
                {isExpense && (
                  <div
                    className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full blur-3xl opacity-0 group-hover:opacity-15 transition-opacity pointer-events-none ${categoryMatch.glow}`}
                  />
                )}

                <div
                  className={`shrink-0 w-14 h-14 rounded-[22px] flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-sm ${
                    !isExpense && !isCreditPlus && !isCreditMinus
                      ? "bg-emerald-500 text-white shadow-emerald-500/20"
                      : `${categoryMatch.bg} ${categoryMatch.text}`
                  }`}
                >
                  {isExpense || isCreditPlus || isCreditMinus ? (
                    categoryMatch.icon
                  ) : (
                    <ArrowDownToLine size={24} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-black text-slate-800 text-sm tracking-tight truncate mb-1">
                    {tx.label}
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-400">
                      <Calendar size={12} className="text-slate-300" />
                      {tx.date}
                    </span>
                    {!isCreditPlus && !isCreditMinus && (
                      <span
                        className={`text-[10px] font-black uppercase tracking-[0.1em] ${!isExpense ? "text-emerald-500" : categoryMatch.text}`}
                      >
                        {tx.category || (!isExpense ? t.retraits : t.achats)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="shrink-0 text-right flex items-center gap-3">
                  <div className="flex flex-col items-end">
                    <p
                      className={`font-black tracking-tighter text-lg leading-none ${!isExpense ? "text-emerald-600" : isCreditMinus ? "text-amber-600" : isCreditPlus ? "text-indigo-600" : "text-slate-900"}`}
                    >
                      {!isExpense ? "+" : "-"}
                      {tx.amount.toLocaleString("fr-FR")}
                      <span className="text-[11px] ml-1 font-bold uppercase text-slate-400">
                        {currency}
                      </span>
                    </p>
                    {(isCreditPlus || isCreditMinus) && (
                      <span
                        className={`text-[10px] font-black uppercase tracking-[0.1em] mt-1 ${isCreditPlus ? "text-indigo-600" : "text-amber-600"}`}
                      >
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
                              onClick={() => {
                                setEditingTx(tx);
                                setActiveMenuId(null);
                              }}
                              className="w-full px-5 py-3.5 text-left text-xs font-black text-slate-600 hover:bg-slate-50 hover:text-teal-600 flex items-center gap-3 transition-colors uppercase tracking-widest whitespace-nowrap active:bg-slate-100"
                            >
                              <Pencil size={15} />
                              Modifier
                            </button>
                            <div className="h-px bg-slate-50 mx-4 my-1" />
                            <button
                              onClick={() => {
                                if (
                                  window.confirm(
                                    "Supprimer cette transaction ?",
                                  )
                                ) {
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
              className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/60"
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
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">
                    Modifier
                  </h3>
                  <button
                    onClick={() => setEditingTx(null)}
                    className="p-2 bg-slate-50 rounded-full text-slate-400"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSaveEdit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">
                      Libellé
                    </label>
                    <input
                      type="text"
                      required
                      value={editingTx.label}
                      onChange={(e) =>
                        setEditingTx({ ...editingTx, label: e.target.value })
                      }
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-800 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-inner"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">
                      Montant ({currency})
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={isNaN(editingTx.amount) ? "" : editingTx.amount}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setEditingTx({
                          ...editingTx,
                          amount: isNaN(val) ? NaN : val,
                        });
                      }}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-black text-slate-800 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-inner text-xl"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-5 bg-teal-brand text-white rounded-[24px] font-black uppercase tracking-widest shadow-xl shadow-teal-brand/20 active:scale-95 transition-all mt-4"
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

function CalculatorModal({ onClose }: { onClose: () => void }) {
  const [display, setDisplay] = useState("0");
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [copied, setCopied] = useState(false);

  const clear = () => {
    setDisplay("0");
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(display);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? digit : display + digit);
    }
  };

  const inputDot = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
    }
  };

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operator) {
      const currentValue = prevValue || 0;
      let newValue = currentValue;

      switch (operator) {
        case "+":
          newValue = currentValue + inputValue;
          break;
        case "-":
          newValue = currentValue - inputValue;
          break;
        case "x":
          newValue = currentValue * inputValue;
          break;
        case "/":
          newValue = currentValue / inputValue;
          break;
        default:
          newValue = inputValue;
      }
      setPrevValue(newValue);
      setDisplay(String(newValue));
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[1000] max-w-md mx-auto"
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1001] bg-slate-900 p-4 rounded-[28px] w-[260px] shadow-2xl border border-white/10"
      >
        {/* Display */}
        <div className="bg-slate-800/50 rounded-xl p-4 mb-3 text-right overflow-hidden shadow-inner border border-white/5">
          <div className="text-[8px] h-3 font-black uppercase text-teal-400/50 tracking-widest mb-1 italic">
            {prevValue !== null
              ? `${prevValue} ${operator || ""}`
              : "Masrof Calc"}
          </div>
          <div className="text-2xl font-black text-white tracking-tighter truncate">
            {display}
          </div>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={clear}
            className="h-10 rounded-xl bg-slate-800 text-rose-500 font-black text-sm active:scale-95 transition-all"
          >
            C
          </button>
          <button
            onClick={() => performOperation("/")}
            className="h-10 rounded-xl bg-slate-800/50 text-teal-400 font-black text-sm active:scale-95 transition-all"
          >
            <Divide size={14} />
          </button>
          <button
            onClick={() => performOperation("x")}
            className="h-10 rounded-xl bg-slate-800/50 text-teal-400 font-black text-sm active:scale-95 transition-all"
          >
            ×
          </button>
          <button
            onClick={onClose}
            className="h-10 rounded-xl bg-slate-800 text-white font-black flex items-center justify-center active:scale-95 transition-all"
          >
            <Minimize2 size={14} />
          </button>

          {[7, 8, 9].map((n) => (
            <button
              key={n}
              onClick={() => inputDigit(String(n))}
              className="h-10 rounded-xl bg-slate-800 text-white font-black text-sm active:scale-95 transition-all hover:bg-slate-750"
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => performOperation("-")}
            className="h-10 rounded-xl bg-slate-800/50 text-teal-400 font-black text-lg active:scale-95 transition-all"
          >
            −
          </button>

          {[4, 5, 6].map((n) => (
            <button
              key={n}
              onClick={() => inputDigit(String(n))}
              className="h-10 rounded-xl bg-slate-800 text-white font-black text-sm active:scale-95 transition-all hover:bg-slate-750"
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => performOperation("+")}
            className="h-10 rounded-xl bg-slate-800/50 text-teal-400 font-black text-lg active:scale-95 transition-all"
          >
            +
          </button>

          {[1, 2, 3].map((n) => (
            <button
              key={n}
              onClick={() => inputDigit(String(n))}
              className="h-10 rounded-xl bg-slate-800 text-white font-black text-sm active:scale-95 transition-all hover:bg-slate-750"
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => performOperation("=")}
            className="h-10 rounded-xl bg-teal-500 text-white font-black text-lg active:scale-95 transition-all shadow-[0_0_15px_rgba(20,184,166,0.3)]"
          >
            =
          </button>

          <button
            onClick={() => inputDigit("0")}
            className="h-10 rounded-xl bg-slate-800 text-white font-black text-sm col-span-2 active:scale-95 transition-all hover:bg-slate-750"
          >
            0
          </button>
          <button
            onClick={inputDot}
            className="h-10 rounded-xl bg-slate-800 text-white font-black text-sm active:scale-95 transition-all"
          >
            .
          </button>
          <button
            onClick={copyToClipboard}
            className={`h-10 rounded-xl flex items-center justify-center transition-all active:scale-95 ${copied ? "bg-emerald-500 text-white" : "bg-slate-800 text-teal-400"}`}
          >
            <Copy size={14} />
          </button>
        </div>
      </motion.div>
    </>
  );
}

function AddBankBalanceModal({
  onClose,
  onAdd,
  currency,
}: {
  onClose: () => void;
  onAdd: (amount: number) => void;
  currency: string;
}) {
  const [amount, setAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount && !isNaN(Number(amount))) {
      onAdd(Number(amount));
      onClose();
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[1000] max-w-md mx-auto"
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 z-[1001] bg-white rounded-t-[40px] p-8 max-w-md mx-auto shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            Ajouter Salaire / Dépôt
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">
              Montant ({currency})
            </label>
            <input
              type="number"
              step="0.1"
              required
              autoFocus
              placeholder="0.0"
              className="w-full h-16 bg-slate-50 border border-slate-100 rounded-2xl px-5 font-black text-slate-800 text-3xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all text-center font-mono"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full h-16 rounded-3xl flex items-center justify-center gap-3 font-black text-white text-lg shadow-lg transform transition-all active:scale-[0.98] bg-blue-600 shadow-blue-600/20"
          >
            <Check size={24} strokeWidth={3} />
            <span>Confirmer</span>
          </button>
        </form>
      </motion.div>
    </>
  );
}
