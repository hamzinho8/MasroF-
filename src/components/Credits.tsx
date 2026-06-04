import React, { useState } from "react";
import {
  Plus,
  Minus,
  Users,
  Trash2,
  CircleDollarSign,
  UserPlus,
  Coins,
  Wallet,
  MoreVertical,
  History,
  Pencil,
  Calendar,
  TrendingUp,
  TrendingDown,
  X,
  HandCoins,
  Utensils,
  ShoppingBag,
  Car,
  Gamepad2,
  MoreHorizontal,
  ArrowDownToLine,
  CalendarCheck,
  CalendarRange,
  CalendarDays,
  Landmark,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CreditEntry, Transaction } from "../types";
import AddBankBalanceModal from "./AddBankBalanceModal";

interface CreditsProps {
  language: string;
  currency: string;
  entries: CreditEntry[];
  setEntries: React.Dispatch<React.SetStateAction<CreditEntry[]>>;
  onSettle?: (id: string, settleSource: 'compte' | 'poche') => void;
  transactions?: Transaction[];
  onAddClick?: (type: "INCOME" | "EXPENSE") => void;
  onAddTransaction?: (label: string, amount: number, type: "INCOME" | "EXPENSE", category?: string, paidByBank?: boolean, isPureInflow?: boolean) => void;
  onAddBankBalance?: (amount: number) => void;
}

// decorative backgrounds removed

export default function Credits({
  language,
  currency,
  entries,
  setEntries,
  onSettle,
  transactions = [],
  onAddClick,
  onAddTransaction,
  onAddBankBalance,
}: CreditsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newType, setNewType] = useState<"OWE_ME" | "I_OWE">("OWE_ME");
  const [source, setSource] = useState<"poche" | "compte" | "rien">("poche");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showBankModal, setShowBankModal] = useState(false);

  const translations = {
    Français: {
      title: "Gestion des Crédits",
      subtitle: "Suivez vos dettes et vos créances",
      totalOweMe: "On me doit",
      totalIOwe: "Je dois",
      addEntry: "Ajouter",
      namePlaceholder: "Nom de la personne",
      amountPlaceholder: "Montant",
      typeOweMe: "On me doit (Créance)",
      typeIOwe: "Je dois (Dette)",
      cancel: "Annuler",
      confirm: "Confirmer",
      noEntries: "Aucun crédit pour le moment",
      history: "Historique des Crédits",
      owedToMe: "ON ME DOIT",
      owedByMe: "JE DOIS",
      settle: "Régler (Solder)",
      edit: "Modifier",
    },
    العربية: {
      title: "إدارة الديون",
      subtitle: "تتبع ديونك ومستحقاتك",
      totalOweMe: "لي عند الآخرين",
      totalIOwe: "علي للآخرين",
      addEntry: "إضافة",
      namePlaceholder: "اسم الشخص",
      amountPlaceholder: "المبلغ",
      typeOweMe: "لي عند الآخرين (دين لي)",
      typeIOwe: "علي للآخرين (دين علي)",
      cancel: "إلغاء",
      confirm: "تأكيد",
      noEntries: "لا توجد ديون حالياً",
      history: "سجل الديون",
      owedToMe: "مستحقات لي",
      owedByMe: "ديون علي",
      settle: "تسوية (سداد)",
      edit: "تعديل",
    },
    English: {
      title: "Credits Management",
      subtitle: "Track your debts and loans",
      totalOweMe: "Owed to me",
      totalIOwe: "I owe",
      addEntry: "Add Entry",
      namePlaceholder: "Person name",
      amountPlaceholder: "Amount",
      typeOweMe: "Owed to me (Loan)",
      typeIOwe: "I owe (Debt)",
      cancel: "Cancel",
      confirm: "Confirm",
      noEntries: "No credits at the moment",
      history: "Credits History",
      owedToMe: "Loans",
      owedByMe: "Debts",
      settle: "Settle (Delete)",
      edit: "Modify",
    },
  };

  const t =
    translations[language as keyof typeof translations] ||
    translations["Français"];
  const isRtl = language === "العربية";

  const formTitle = editingId
    ? language === "Français"
      ? "Modifier le crédit"
      : language === "العربية"
        ? "تعديل السجل"
        : "Edit Credit"
    : t.addEntry;

  const totalOweMe = entries
    .filter((e) => e.type === "OWE_ME")
    .reduce((acc, e) => acc + e.amount, 0);

  const totalIOwe = entries
    .filter((e) => e.type === "I_OWE")
    .reduce((acc, e) => acc + e.amount, 0);

  const handleAddEntry = () => {
    if (!newName || !newAmount) return;

    if (editingId) {
      setEntries((prev) =>
        prev.map((e) =>
          e.id === editingId
            ? {
                ...e,
                name: newName,
                amount: parseFloat(newAmount),
                type: newType,
                source: source,
              }
            : e,
        ),
      );
      setEditingId(null);
    } else {
      const newEntry: CreditEntry = {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
        name: newName,
        amount: parseFloat(newAmount),
        type: newType,
        date: new Date().toLocaleDateString(
          language === "Français" ? "fr-FR" : "en-US",
        ),
        source: source,
      };
      setEntries((prev) => [newEntry, ...prev]);

      if (onAddTransaction && source !== "rien") {
        const floatAmount = parseFloat(newAmount);
        if (newType === "OWE_ME") {
          // If they owe me, I gave them money (EXPENSE)
          onAddTransaction(`Prêt à ${newName}`, floatAmount, "EXPENSE", t.owedByMe, source === "compte");
        } else if (newType === "I_OWE") {
          // If I owe them, they gave me money (INCOME)
          onAddTransaction(`Emprunt de ${newName}`, floatAmount, "INCOME", t.owedToMe, source === "compte", true);
        }
      }
    }

    setNewName("");
    setNewAmount("");
    setSource("poche");
    setIsAdding(false);
  };

  const handleEditClick = (entry: CreditEntry) => {
    setEditingId(entry.id);
    setNewName(entry.name);
    setNewAmount(entry.amount.toString());
    setNewType(entry.type);
    setSource(entry.source || "poche");
    setIsAdding(true);
    setActiveMenuId(null);
  };

  const [settlingId, setSettlingId] = useState<string | null>(null);

  const handleSettleEntry = (id: string, settleSource: 'compte' | 'poche') => {
    if (onSettle) {
      onSettle(id, settleSource);
    } else {
      setEntries((prev) => prev.filter((e) => e.id !== id));
    }
    setActiveMenuId(null);
    setSettlingId(null);
  };

  const [bankTimeframe, setBankTimeframe] = useState<"day" | "week" | "month">(
    "day",
  );

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

    let totalExpense = 0; // Everything strictly drawn from the bank (purchases directly from bank, and withdrawals from bank)
    let totalIncome = 0; // Salaries/deposits into the bank

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
      label:
        language === "Français"
          ? "Nourriture"
          : language === "العربية"
            ? "طعام"
            : "Food",
      icon: <Utensils size={24} />,
      color: "teal",
      bg: "bg-teal-100",
      text: "text-teal-600",
      glow: "bg-teal-400",
    },
    {
      label:
        language === "Français"
          ? "Shopping"
          : language === "العربية"
            ? "تسوق"
            : "Shopping",
      icon: <ShoppingBag size={24} />,
      color: "rose",
      bg: "bg-rose-100",
      text: "text-rose-600",
      glow: "bg-rose-400",
    },
    {
      label:
        language === "Français"
          ? "Transport"
          : language === "العربية"
            ? "نقل"
            : "Transport",
      icon: <Car size={24} />,
      color: "sky",
      bg: "bg-sky-100",
      text: "text-sky-600",
      glow: "bg-sky-400",
    },
    {
      label:
        language === "Français"
          ? "Loisirs"
          : language === "العربية"
            ? "ترفيه"
            : "Entertainment",
      icon: <Gamepad2 size={24} />,
      color: "purple",
      bg: "bg-purple-100",
      text: "text-purple-600",
      glow: "bg-purple-400",
    },
    {
      label:
        language === "Français"
          ? "Autres"
          : language === "العربية"
            ? "أخرى"
            : "Other",
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
      onClick={() => setActiveMenuId(null)}
    >
      {/* Artistic Credits Summary Card - Matched dimensions with Home.tsx */}
      <div
        className="relative h-44 rounded-[24px] overflow-hidden shadow-2xl shadow-slate-200/40 mb-8 transition-all hover:scale-[1.01] border border-white/20 active:scale-95"
        style={{
          background: "linear-gradient(135deg, #4f46e5 0%, #f59e0b 100%)",
        }}
      >
        {/* Artistic Background Elements - Restore arrows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <TrendingUp
            size={120}
            className="absolute -left-8 -top-8 text-white/10 -rotate-12"
          />
          <TrendingDown
            size={120}
            className="absolute -right-8 -bottom-8 text-white/10 rotate-12"
          />
        </div>

        {/* Central Plus Button - Fully Transparent Background */}
        <div className="absolute inset-0 flex items-center justify-center z-30">
          <motion.button
            whileHover={{ scale: 1.2, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              setIsAdding(true);
            }}
            className="w-20 h-20 bg-transparent text-white flex items-center justify-center transition-all z-40 outline-none"
          >
            <Plus
              size={52}
              strokeWidth={2.5}
              className="drop-shadow-lg opacity-80 hover:opacity-100 transition-opacity"
            />
          </motion.button>
        </div>

        <div className="relative z-10 p-7 h-full flex flex-col justify-between">
          {/* TOP LEFT: On me doit - Bigger and Styled */}
          <div className="flex flex-col items-start pt-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="bg-white/10 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/10">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white leading-none">
                  {t.owedToMe}
                </p>
              </div>
            </div>
            <div className="flex items-baseline gap-1.5 translate-x-1">
              <span className="text-4xl font-black text-white tracking-tighter drop-shadow-lg leading-none">
                {totalOweMe.toLocaleString("fr-FR")}
              </span>
              <span className="text-[10px] font-bold text-white/60 uppercase">
                {currency}
              </span>
            </div>
          </div>

          {/* BOTTOM RIGHT: Je dois - Bigger and Styled */}
          <div className="flex flex-col items-end text-right pb-1">
            <div className="flex items-baseline justify-end gap-1.5 translate-x-[-4px]">
              <span className="text-4xl font-black text-white tracking-tighter drop-shadow-lg leading-none">
                {totalIOwe.toLocaleString("fr-FR")}
              </span>
              <span className="text-[10px] font-bold text-white/60 uppercase">
                {currency}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="bg-white/10 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/10">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white leading-none">
                  {t.owedByMe}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Form Modal-like */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="p-6 bg-white rounded-[32px] border-2 border-slate-100 shadow-xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-1">
                <h3 className="font-black text-xl text-slate-800 tracking-tight">
                  {formTitle}
                </h3>
                <div className="w-8 h-1 bg-indigo-500 rounded-full" />
              </div>
              {editingId && (
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setEditingId(null);
                    setNewName("");
                    setNewAmount("");
                  }}
                  className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Personne
                </label>
                <input
                  type="text"
                  placeholder={t.namePlaceholder}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500/20 focus:bg-white outline-none font-bold text-slate-800 transition-all shadow-inner"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Montant
                </label>
                <div className="flex gap-4">
                  <input
                    type="number"
                    placeholder={t.amountPlaceholder}
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="flex-1 h-14 px-6 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500/20 focus:bg-white outline-none font-black text-slate-800 transition-all text-2xl shadow-inner"
                  />
                  <div className="h-14 flex items-center px-5 bg-white border-2 border-slate-50 rounded-2xl font-black text-slate-400 shadow-sm">
                    {currency}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Type de crédit
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setNewType("OWE_ME")}
                    className={`h-14 rounded-2xl flex items-center justify-center gap-3 font-black text-[11px] uppercase tracking-widest transition-all border-2 ${newType === "OWE_ME" ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/30" : "bg-white border-slate-100 text-slate-400 hover:border-indigo-200"}`}
                  >
                    <Coins size={18} />
                    {t.owedToMe}
                  </button>
                  <button
                    onClick={() => setNewType("I_OWE")}
                    className={`h-14 rounded-2xl flex items-center justify-center gap-3 font-black text-[11px] uppercase tracking-widest transition-all border-2 ${newType === "I_OWE" ? "bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/30" : "bg-white border-slate-100 text-slate-400 hover:border-amber-200"}`}
                  >
                    <Wallet size={18} />
                    {t.owedByMe}
                  </button>
                </div>
              </div>

              {!editingId && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    {language === "Français" ? "Déduire de / Ajouter à" : language === "العربية" ? "خصم من / إضافة إلى" : "Deduct from / Add to"}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setSource("poche")}
                      className={`h-12 rounded-2xl flex items-center justify-center font-black text-[10px] uppercase tracking-wider transition-all border-2 ${source === "poche" ? "bg-slate-800 border-slate-800 text-white shadow-md shadow-slate-800/20" : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"}`}
                    >
                      {language === "Français" ? "Ma poche" : language === "العربية" ? "جيبي" : "Pocket"}
                    </button>
                    <button
                      onClick={() => setSource("compte")}
                      className={`h-12 rounded-2xl flex items-center justify-center font-black text-[10px] uppercase tracking-wider transition-all border-2 ${source === "compte" ? "bg-teal-600 border-teal-600 text-white shadow-md shadow-teal-600/20" : "bg-white border-slate-100 text-slate-400 hover:border-teal-200"}`}
                    >
                      {language === "Français" ? "Mon compte" : language === "العربية" ? "حسابي" : "Bank"}
                    </button>
                    <button
                      onClick={() => setSource("rien")}
                      className={`h-12 rounded-2xl flex items-center justify-center font-black text-[10px] uppercase tracking-wider transition-all border-2 ${source === "rien" ? "bg-slate-100 border-slate-200 text-slate-500 shadow-inner" : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"}`}
                    >
                      {language === "Français" ? "Rien" : language === "العربية" ? "لا شيء" : "Nothing"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                  setNewName("");
                  setNewAmount("");
                }}
                className="flex-1 h-16 rounded-[24px] font-black text-slate-400 hover:bg-slate-50 transition-all uppercase text-xs tracking-widest"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleAddEntry}
                className="flex-1 h-16 rounded-[24px] bg-indigo-600 text-white font-black shadow-xl shadow-indigo-600/20 active:scale-95 transition-all text-sm uppercase tracking-widest"
              >
                {t.confirm}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      <div className="space-y-4 pt-6">
        <h3 className="text-slate-800 text-xl font-bold flex items-center gap-3 px-1">
          <History size={24} className="text-indigo-600" />
          {t.history}
        </h3>

        {entries.length === 0 ? (
          <div className="text-center py-12 text-slate-400 font-medium italic">
            {t.noEntries}
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry, index) => {
              const isReceive = entry.type === "OWE_ME";
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={`${entry.id}-${index}`}
                  className={`group flex items-center gap-4 p-5 rounded-[32px] border transition-all relative backdrop-blur-sm shadow-sm ${
                    isReceive
                      ? "bg-indigo-50/30 border-indigo-100/50 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/10"
                      : "bg-amber-50/30 border-amber-100/50 hover:border-amber-200 hover:shadow-xl hover:shadow-amber-500/10"
                  }`}
                  style={{
                    overflow: activeMenuId === entry.id ? "visible" : "hidden",
                    zIndex: activeMenuId === entry.id ? 50 : 1,
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
                      {entry.name}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
                      <span className="text-[9px] flex items-center gap-1 font-bold uppercase tracking-wider text-slate-400 shrink-0">
                        <Calendar
                          size={10}
                          className={
                            isReceive ? "text-indigo-500" : "text-amber-500"
                          }
                        />
                        {entry.date}
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
                        {entry.amount.toLocaleString("fr-FR")}
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
                            activeMenuId === entry.id ? null : entry.id,
                          );
                        }}
                        className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-xl transition-colors text-slate-300 group-hover:text-slate-500 relative z-[60]"
                      >
                        <MoreVertical size={20} />
                      </button>
                      <AnimatePresence>
                        {activeMenuId === entry.id && (
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
                                onClick={() => handleEditClick(entry)}
                                className="w-full px-5 py-3.5 text-left text-xs font-black text-slate-600 hover:bg-slate-50 hover:text-teal-600 flex items-center gap-3 transition-colors uppercase tracking-widest whitespace-nowrap active:bg-slate-100"
                              >
                                <Pencil size={15} />
                                {t.edit}
                              </button>
                              <div className="h-px bg-slate-50 mx-4 my-1" />
                              <button
                                onClick={() => { setSettlingId(entry.id); setActiveMenuId(null); }}
                                className="w-full px-5 py-3.5 text-left text-xs font-black text-rose-500 hover:bg-rose-50 flex items-center gap-3 transition-colors uppercase tracking-widest whitespace-nowrap active:bg-rose-100"
                              >
                                <CircleDollarSign size={15} />
                                {t.settle}
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
        )}
      </div>

      {/* SECTION: Historique du compteur bancaire */}
      <div className="space-y-4 pt-8 mt-8 border-t-[3px] border-slate-100 border-dashed">
        <h3 className="text-slate-800 text-xl font-bold flex items-center gap-3 px-1 mb-6">
          <Wallet size={24} className="text-teal-600" />
          {language === "Français"
            ? "Historique Bancaire"
            : language === "العربية"
              ? "سجل البنك"
              : "Bank History"}
        </h3>

        <AnimatePresence>
          {settlingId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setSettlingId(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-[32px] p-6 w-full max-w-sm shadow-2xl border border-slate-100 flex flex-col gap-6"
              >
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-black text-slate-800 tracking-tight text-center">
                    {language === "Français" ? "Choisir la destination" : language === "العربية" ? "اختر الوجهة" : "Choose destination"}
                  </h3>
                  <p className="text-sm font-medium text-slate-500 text-center">
                    {language === "Français" ? "Où voulez-vous solder ce crédit ?" : language === "العربية" ? "أين تريد تسوية هذا الرصيد؟" : "Where do you want to settle this credit?"}
                  </p>
                </div>
                
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => handleSettleEntry(settlingId, "poche")}
                    className="w-full h-16 rounded-[24px] bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 font-black flex items-center justify-center gap-3 active:scale-95 transition-all text-sm uppercase tracking-widest"
                  >
                    <Wallet size={20} />
                    {language === "Français" ? "Ma poche" : language === "العربية" ? "جيبي" : "Pocket"}
                  </button>
                  <button
                    onClick={() => handleSettleEntry(settlingId, "compte")}
                    className="w-full h-16 rounded-[24px] bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 active:scale-95 transition-all text-sm uppercase tracking-widest font-black flex items-center justify-center gap-3"
                  >
                    <Landmark size={20} />
                    {language === "Français" ? "Mon compte" : language === "العربية" ? "حسابي" : "Bank Account"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
                <CalendarCheck
                  size={18}
                  strokeWidth={bankTimeframe === "day" ? 2.5 : 2}
                />
                <span className="text-[10px] font-black uppercase tracking-wider">
                  {getTimeframeLabel("day")}
                </span>
              </button>
              <button
                onClick={() => setBankTimeframe("week")}
                className={`flex-1 py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 ${bankTimeframe === "week" ? "bg-slate-900 text-white shadow-xl" : "text-slate-500 hover:bg-white/40"}`}
              >
                <CalendarRange
                  size={18}
                  strokeWidth={bankTimeframe === "week" ? 2.5 : 2}
                />
                <span className="text-[10px] font-black uppercase tracking-wider">
                  {getTimeframeLabel("week")}
                </span>
              </button>
              <button
                onClick={() => setBankTimeframe("month")}
                className={`flex-1 py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 ${bankTimeframe === "month" ? "bg-slate-900 text-white shadow-xl" : "text-slate-500 hover:bg-white/40"}`}
              >
                <CalendarDays
                  size={18}
                  strokeWidth={bankTimeframe === "month" ? 2.5 : 2}
                />
                <span className="text-[10px] font-black uppercase tracking-wider">
                  {getTimeframeLabel("month")}
                </span>
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
                    {language === "Français"
                      ? "Dépôts"
                      : language === "العربية"
                        ? "إيداعات"
                        : "Deposits"}
                  </span>
                </div>
                <p className="text-2xl font-black text-teal-600 tracking-tighter">
                  {filteredBankTotals.totalIncome.toLocaleString("fr-FR")}
                  <span className="text-xs ml-1 font-bold text-slate-400 uppercase">
                    {currency}
                  </span>
                </p>
              </div>

              <div className="space-y-1 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-500/10 flex items-center justify-center text-slate-600">
                    <TrendingDown size={16} strokeWidth={2.5} />
                  </div>
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    {language === "Français"
                      ? "Sorties"
                      : language === "العربية"
                        ? "نفقات"
                        : "Outflows"}
                  </span>
                </div>
                <p className="text-2xl font-black text-slate-600 tracking-tighter">
                  {filteredBankTotals.totalExpense.toLocaleString("fr-FR")}
                  <span className="text-xs ml-1 font-bold text-slate-400 uppercase">
                    {currency}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions - Identical to Home & History style */}
        <div className="grid grid-cols-2 gap-4 px-1 mb-6">
          <button
            onClick={() => setShowBankModal(true)}
            className="group relative flex flex-col items-center justify-center gap-3 h-28 bg-white border-2 border-slate-50 rounded-[28px] transition-all hover:border-emerald-100 hover:bg-emerald-50/30 active:scale-95 shadow-sm"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
              <Landmark size={24} strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-emerald-600 transition-colors">
              {language === "Français"
                ? "Ajouter Salaire"
                : language === "العربية"
                  ? "إضافة راتب"
                  : "Add Salary"}
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
              {language === "Français"
                ? "Ajouter Retrait"
                : language === "العربية"
                  ? "إضافة سحب"
                  : "Add Withdrawal"}
            </span>
          </button>
        </div>

        {/* Bank Transactions List */}
        {bankTransactions.length === 0 ? (
          <div className="text-center py-12 text-slate-400 font-medium italic">
            {language === "Français"
              ? "Aucune transaction bancaire"
              : language === "العربية"
                ? "لا توجد معاملات بنكية"
                : "No bank transactions"}
          </div>
        ) : (
          <div className="space-y-4">
            {bankTransactions.map((tx, index) => {
              const isIncome = tx.type === "INCOME" && tx.paidByBank; // Salaire / Dépôt
              const isExpense = tx.type === "EXPENSE"; // Achat carte
              const isRetrait = tx.type === "INCOME" && !tx.paidByBank; // Retrait poche

              const categoryMatch = getCategoryMap().find(
                (c) =>
                  c.label &&
                  c.label.toLowerCase() === (tx.category || "").toLowerCase(),
              ) || {
                icon: isIncome ? (
                  <TrendingUp size={24} />
                ) : isRetrait ? (
                  <ArrowDownToLine size={24} />
                ) : (
                  <ShoppingBag size={24} />
                ),
                color: isIncome ? "teal" : isRetrait ? "emerald" : "slate",
                bg: isIncome
                  ? "bg-teal-100"
                  : isRetrait
                    ? "bg-emerald-500"
                    : "bg-slate-100",
                text: isIncome
                  ? "text-teal-600"
                  : isRetrait
                    ? "text-white"
                    : "text-slate-600",
                glow: isIncome
                  ? "bg-teal-400"
                  : isRetrait
                    ? "bg-emerald-400"
                    : "bg-slate-400",
              };

              // Use exact identical card visual style as History page items
              const getCardStyle = () => {
                const colors: Record<string, string> = {
                  rose: "hover:border-rose-200 hover:shadow-rose-500/10",
                  sky: "hover:border-sky-200 hover:shadow-sky-500/10",
                  indigo: "hover:border-indigo-200 hover:shadow-indigo-500/10",
                  amber: "hover:border-amber-200 hover:shadow-amber-500/10",
                  purple: "hover:border-purple-200 hover:shadow-purple-500/10",
                  slate: "hover:border-slate-200 hover:shadow-slate-500/10",
                  emerald:
                    "hover:border-emerald-200 hover:shadow-emerald-500/10",
                  teal: "hover:border-teal-200 hover:shadow-teal-500/10",
                };
                return colors[categoryMatch.color] || "hover:border-slate-200";
              };

              return (
                <motion.div
                  key={`${tx.id}-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center gap-4 p-4 rounded-[32px] border transition-all relative backdrop-blur-sm bg-white shadow-sm group ${getCardStyle()}`}
                >
                  <div
                    className={`shrink-0 w-14 h-14 rounded-[22px] flex items-center justify-center transition-all shadow-sm ${categoryMatch.bg} ${categoryMatch.text}`}
                  >
                    {categoryMatch.icon}
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
                      <p
                        className={`font-black tracking-tighter text-base leading-none ${isIncome ? "text-teal-600" : "text-slate-800"}`}
                      >
                        {isIncome ? "+" : "-"}
                        {tx.amount.toLocaleString("fr-FR")}
                      </p>
                      <span className="text-[9px] font-bold uppercase text-slate-400 mt-0.5">
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
