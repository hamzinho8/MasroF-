import React, { useState, useMemo } from "react";
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
  MoreHorizontal,
  Search,
  Filter,
  CreditCard,
  Wifi,
  ChevronRight,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  EyeOff,
  Wallet,
  MoreVertical,
  Edit2,
  Trash2,
  Repeat,
  Target,
  X,
  Check,
  ArrowRight,
  Settings,
  Home,
  MonitorPlay,
  LayoutGrid,
  List,
  CheckCircle2,
  Clock
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "motion/react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Transaction, PredefinedItem } from "../types";
import AddBankBalanceModal from "./AddBankBalanceModal";
import { ICON_MAP, getArticleInfo, CATEGORIES } from "../constants";
import { useLocalStorage } from "../hooks/useLocalStorage";
import ManageUpcomingModal, { UpcomingTransaction } from "./ManageUpcomingModal";

interface BankProps {
  language: string;
  currency: string;
  bankBalance: number;
  transactions?: Transaction[];
  predefinedItems?: PredefinedItem[];
  creditEntries?: import("../types").CreditEntry[];
  onAddClick?: (type: "INCOME" | "EXPENSE") => void;
  onAddBankBalance?: (amount: number, label: string, category: string) => void;
  onAddTransaction?: (
    label: string,
    amount: number,
    type: "INCOME" | "EXPENSE",
    category: string,
    paidByBank?: boolean,
    isPureInflow?: boolean
  ) => void;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, tx: Partial<Transaction>) => void;
}

export default function Bank({
  language,
  currency,
  bankBalance,
  transactions = [],
  predefinedItems = [],
  creditEntries = [],
  onAddClick,
  onAddBankBalance,
  onAddTransaction,
  onDelete,
  onUpdate,
}: BankProps) {
  const [showBankModal, setShowBankModal] = useState(false);
  const [bankTimeframe, setBankTimeframe] = useState<"day" | "week" | "month">(
    "month"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showBalance, setShowBalance] = useLocalStorage<boolean>("showBankBalance", false);
  const [filter, setFilter] = useState<"ALL" | "IN" | "OUT">("ALL");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [savingsGoal, setSavingsGoal] = useLocalStorage<number>("bankSavingsGoal", 10000); // Target
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null); // For bottom sheet
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(savingsGoal.toString());
  const [isManageUpcomingModalOpen, setIsManageUpcomingModalOpen] = useState(false);

  const [upcomingTransactions, setUpcomingTransactions] = useLocalStorage<UpcomingTransaction[]>(
    "upcomingTransactions",
    [
      {
        id: "upc-1",
        label: "Loyer",
        amount: 2500,
        dateStr: "Le 1er du mois",
        dayOfMonth: 1,
        paidByBank: true,
        categoryId: "Logement",
        iconName: "Home",
        colorHex: "#6366f1",
      },
      {
        id: "upc-2",
        label: "Internet",
        amount: 200,
        dateStr: "Le 5 du mois",
        dayOfMonth: 5,
        paidByBank: true,
        categoryId: "Logement",
        iconName: "Wifi",
        colorHex: "#3b82f6",
      },
      {
        id: "upc-3",
        label: "Netflix",
        amount: 95,
        dateStr: "Le 15 du mois",
        dayOfMonth: 15,
        paidByBank: false,
        categoryId: "Loisirs",
        iconName: "MonitorPlay",
        colorHex: "#ef4444",
      }
    ]
  );
  
  const [isCompactUpcoming, setIsCompactUpcoming] = useLocalStorage<boolean>("isCompactUpcoming", false);

  const handleValidateUpcoming = (tx: UpcomingTransaction) => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    // Avoid double payment in the same month if user already clicked
    if (tx.lastPaidMonth === currentMonth) return;

    const catId = tx.categoryId || "Autres";
    if (tx.paidByBank !== false) {
      if (onAddTransaction) {
        onAddTransaction(tx.label, tx.amount, "EXPENSE", CATEGORIES.find(c => c.id === catId)?.id || "Autres", true, false);
      }
    } else {
      if (onAddTransaction) {
        onAddTransaction(tx.label, tx.amount, "EXPENSE", CATEGORIES.find(c => c.id === catId)?.id || "Autres", false, false);
      }
    }

    setUpcomingTransactions(prev => 
      prev.map(t => t.id === tx.id ? { ...t, lastPaidMonth: currentMonth } : t)
    );
  };

  const bankTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        return (
          (tx.type === "INCOME" && tx.paidByBank) ||
          (tx.type === "EXPENSE" && tx.paidByBank) ||
          (tx.type === "INCOME" && !tx.paidByBank)
        );
      })
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [transactions]);

  const resteBalance = useMemo(() => {
    let currentBal = 0;
    let lastReste = 0;

    // Sort oldest to newest
    const sorted = [...bankTransactions].reverse();
    sorted.forEach((tx) => {
      const isIncome = tx.type === "INCOME" && tx.paidByBank;

      if (tx.category === "Salaire") {
        lastReste = currentBal;
      }

      if (isIncome) currentBal += tx.amount;
      else currentBal -= tx.amount;
    });

    return lastReste;
  }, [bankTransactions]);

  const { totalIncome, totalExpense, balance, chartData } = useMemo(() => {
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

    let tIncome = 0;
    let tExpense = 0;

    const periodTx = bankTransactions.filter(
      (tx) =>
        tx.timestamp >= startOfPeriod.getTime() && tx.timestamp <= now.getTime()
    );

    const chartPoints: Record<string, number> = {};

    // Build chart data backwards
    periodTx.forEach((tx) => {
      const isIncome = tx.type === "INCOME" && tx.paidByBank;
      if (isIncome) {
        tIncome += tx.amount;
      } else {
        tExpense += tx.amount;
      }
    });

    // We can simulate a curve by just tracking daily aggregated balance for the period
    const startBalance = bankBalance - tIncome + tExpense;
    let runBalance = startBalance;
    const sortedPeriodTx = [...periodTx].reverse();

    if (sortedPeriodTx.length === 0) {
      chartPoints[now.toLocaleDateString()] = bankBalance;
      chartPoints[startOfPeriod.toLocaleDateString()] = bankBalance;
    } else {
      sortedPeriodTx.forEach((tx) => {
        const isIncome = tx.type === "INCOME" && tx.paidByBank;
        runBalance += isIncome ? tx.amount : -tx.amount;
        chartPoints[new Date(tx.timestamp).toLocaleDateString()] = runBalance;
      });
    }

    const cData = Object.entries(chartPoints).map(([date, bal]) => ({
      date,
      balance: bal,
    }));

    return {
      totalIncome: tIncome,
      totalExpense: tExpense,
      balance: bankBalance,
      chartData: cData,
    };
  }, [bankTransactions, bankTimeframe, bankBalance]);

  // Calculate Projected Balance
  const projectedBalance = useMemo(() => {
    let projected = bankBalance;
    
    // Add "Owe me" and subtract "I owe"
    if (creditEntries) {
      creditEntries.forEach(entry => {
        if (entry.type === "OWE_ME") projected += entry.amount;
        else if (entry.type === "I_OWE") projected -= entry.amount;
      });
    }

    // Subtract upcoming transactions that are paid by bank
    upcomingTransactions.forEach(tx => {
      if (tx.paidByBank !== false) {
        projected -= tx.amount;
      }
    });

    return projected;
  }, [bankBalance, creditEntries, upcomingTransactions]);

  const getTimeframeLabel = (frame: "day" | "week" | "month") => {
    if (language === "Français")
      return frame === "day" ? "Jour" : frame === "week" ? "Semaine" : "Mois";
    if (language === "العربية")
      return frame === "day" ? "اليوم" : frame === "week" ? "أسبوع" : "شهر";
    return frame === "day" ? "Day" : frame === "week" ? "Week" : "Month";
  };

  const filteredTransactions = useMemo(() => {
    let txs = bankTransactions;
    if (filter === "IN") {
      txs = txs.filter((tx) => tx.type === "INCOME" && tx.paidByBank);
    } else if (filter === "OUT") {
      txs = txs.filter(
        (tx) =>
          (tx.type === "EXPENSE" && tx.paidByBank) ||
          (tx.type === "INCOME" && !tx.paidByBank)
      );
    }

    if (searchQuery) {
      txs = txs.filter(
        (tx) =>
          tx.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (tx.category &&
            tx.category.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    return txs;
  }, [bankTransactions, searchQuery, filter]);

  // Group by Time
  const groupedTransactions = useMemo(() => {
    const groups: { title: string; data: Transaction[] }[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todayTx: Transaction[] = [];
    const yesterdayTx: Transaction[] = [];
    const thisWeekTx: Transaction[] = [];
    const olderTx: Transaction[] = [];

    filteredTransactions.forEach((tx) => {
      const txDate = new Date(tx.timestamp);
      txDate.setHours(0, 0, 0, 0);

      if (txDate.getTime() === today.getTime()) {
        todayTx.push(tx);
      } else if (txDate.getTime() === yesterday.getTime()) {
        yesterdayTx.push(tx);
      } else if (txDate.getTime() > today.getTime() - 7 * 24 * 60 * 60 * 1000) {
        thisWeekTx.push(tx);
      } else {
        olderTx.push(tx);
      }
    });

    const tToday =
      language === "Français"
        ? "Aujourd'hui"
        : language === "العربية"
        ? "اليوم"
        : "Today";
    const tYesterday =
      language === "Français"
        ? "Hier"
        : language === "العربية"
        ? "أمس"
        : "Yesterday";
    const tThisWeek =
      language === "Français"
        ? "Cette Semaine"
        : language === "العربية"
        ? "هذا الأسبوع"
        : "This Week";
    const tOlder =
      language === "Français"
        ? "Plus Ancien"
        : language === "العربية"
        ? "أقدم"
        : "Older";

    if (todayTx.length > 0) groups.push({ title: tToday, data: todayTx });
    if (yesterdayTx.length > 0)
      groups.push({ title: tYesterday, data: yesterdayTx });
    if (thisWeekTx.length > 0)
      groups.push({ title: tThisWeek, data: thisWeekTx });
    if (olderTx.length > 0) groups.push({ title: tOlder, data: olderTx });

    return groups;
  }, [filteredTransactions, language]);

  // 3D Card Animation Values
  const cardX = useMotionValue(0);
  const cardY = useMotionValue(0);
  const rotateX = useTransform(cardY, [-100, 100], [10, -10]);
  const rotateY = useTransform(cardX, [-100, 100], [-10, 10]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    cardX.set(event.clientX - rect.left - rect.width / 2);
    cardY.set(event.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    cardX.set(0);
    cardY.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6 pb-12 overflow-x-hidden"
    >
      <div className="space-y-4 pt-2 px-1">
        <AnimatePresence>
          {showBankModal && (
            <AddBankBalanceModal
              onClose={() => setShowBankModal(false)}
              onAdd={(amount, label, category) => {
                if (onAddBankBalance) {
                  onAddBankBalance(amount, label, category);
                }
              }}
              currency={currency}
            />
          )}
        </AnimatePresence>

        {/* Premium Glassmorphic Bank Card (Static) */}
        <div className="mb-2">
          <div
            className="relative overflow-hidden rounded-[32px] shadow-2xl shadow-indigo-500/20 border border-white/60 bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 p-6 text-white min-h-[220px] flex flex-col justify-between"
          >
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-white/20 pointer-events-none" />
            <div className="absolute top-[-30%] right-[-20%] w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-30%] left-[-20%] w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Card Header */}
            <div className="relative z-10 flex justify-between items-center w-full mb-6">
              <div className="flex items-center gap-2">
                <Landmark size={24} className="text-indigo-300" />
                <span className="font-bold tracking-widest text-xs uppercase opacity-80">
                  {language === "Français"
                    ? "Banque Principale"
                    : language === "العربية"
                    ? "البنك الرئيسي"
                    : "Main Bank"}
                </span>
              </div>
              <Wifi size={24} className="rotate-90 opacity-50" />
            </div>

            {/* Balance and Savings Goal */}
            <div className="relative z-10 flex-1 flex flex-col justify-center mb-4">
              <div className="flex items-baseline gap-2 mt-2">
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="opacity-70 hover:opacity-100 transition-opacity mr-1"
                >
                  {showBalance ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
                <span className="text-4xl font-black tracking-tighter">
                  {showBalance ? bankBalance.toLocaleString("fr-FR") : "****"}
                </span>
                {showBalance && (
                  <span className="text-xl font-bold opacity-70 uppercase">
                    {currency}
                  </span>
                )}
              </div>

              {/* Stacked balances: Reste mois préc, Solde Prévisionnel, Obj Mois */}
              <div className="mt-8 flex flex-col gap-3">
                {/* Reste */}
                <div className="flex items-center gap-3 opacity-90">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">
                    {language === "Français"
                      ? "Reste mois préc:"
                      : language === "العربية"
                      ? "الباقي من الشهر السابق:"
                      : "Reste prev month:"}
                  </span>
                  <span className="text-[12px] font-black text-white tracking-wide">
                    {`${resteBalance.toLocaleString("fr-FR")} ${currency}`}
                  </span>
                </div>

                {/* Solde Prévisionnel */}
                <div className="flex items-center gap-3 opacity-90">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">
                    {language === "Français" ? "Solde Prévisionnel:" : "Projected Balance:"}
                  </span>
                  <span className={`text-[12px] font-black tracking-wide ${projectedBalance < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {`${projectedBalance.toLocaleString("fr-FR")} ${currency}`}
                  </span>
                </div>

                {/* Obj Mois */}
                <div className="flex items-center gap-3 opacity-90 group relative">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">
                    {language === "Français"
                      ? "Obj Mois:"
                      : language === "العربية"
                      ? "هدف الشهر:"
                      : "Monthly Goal:"}
                  </span>
                  {isEditingGoal ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={tempGoal}
                        onChange={(e) => setTempGoal(e.target.value)}
                        className="w-20 bg-white/10 border border-white/20 rounded px-1.5 py-0.5 text-[12px] font-black text-white focus:outline-none focus:border-white/50"
                        autoFocus
                      />
                      <button
                        onClick={() => {
                          const newGoal = Number(tempGoal);
                          if (newGoal > 0) setSavingsGoal(newGoal);
                          setIsEditingGoal(false);
                        }}
                        className="p-1 bg-white/10 text-white rounded hover:bg-white/20 transition-colors"
                      >
                        <Check size={12} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 relative">
                      <span className="text-[12px] font-black text-white tracking-wide">
                        {`/ ${savingsGoal.toLocaleString("fr-FR")} ${currency}`}
                      </span>
                      <button
                        onClick={() => setIsEditingGoal(true)}
                        className="p-1 hover:bg-white/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100 absolute -right-6"
                      >
                        <Settings size={12} className="text-white/90" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="flex bg-slate-100 p-1 rounded-2xl shadow-inner border border-slate-200/50 mb-4">
          <button
            onClick={() => setBankTimeframe("day")}
            className={`flex-1 py-2.5 px-2 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 ${
              bankTimeframe === "day"
                ? "bg-white text-slate-900 shadow-sm font-bold"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <span className="text-[11px] uppercase tracking-wider">
              {getTimeframeLabel("day")}
            </span>
          </button>
          <button
            onClick={() => setBankTimeframe("week")}
            className={`flex-1 py-2.5 px-2 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 ${
              bankTimeframe === "week"
                ? "bg-white text-slate-900 shadow-sm font-bold"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <span className="text-[11px] uppercase tracking-wider">
              {getTimeframeLabel("week")}
            </span>
          </button>
          <button
            onClick={() => setBankTimeframe("month")}
            className={`flex-1 py-2.5 px-2 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 ${
              bankTimeframe === "month"
                ? "bg-white text-slate-900 shadow-sm font-bold"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <span className="text-[11px] uppercase tracking-wider">
              {getTimeframeLabel("month")}
            </span>
          </button>
        </div>

        {/* Analytics Section (Graph & KPI) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-[28px] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                {language === "Français"
                  ? "Flux de trésorerie"
                  : language === "العربية"
                  ? "التدفق النقدي"
                  : "Cash Flow"}
              </span>
              <Activity size={16} className="text-slate-300" />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-500">
                  <ArrowUpRight size={14} strokeWidth={3} />
                  <span className="text-[10px] font-bold uppercase">
                    {language === "Français" ? "Entrées" : "In"}
                  </span>
                </div>
                <p className="text-lg font-black text-slate-800">
                  +{totalIncome.toLocaleString()}{" "}
                  <span className="text-[9px] text-slate-400 uppercase">
                    {currency}
                  </span>
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-rose-500">
                  <ArrowDownRight size={14} strokeWidth={3} />
                  <span className="text-[10px] font-bold uppercase">
                    {language === "Français" ? "Sorties" : "Out"}
                  </span>
                </div>
                <p className="text-lg font-black text-slate-800">
                  -{totalExpense.toLocaleString()}{" "}
                  <span className="text-[9px] text-slate-400 uppercase">
                    {currency}
                  </span>
                </p>
              </div>
            </div>

            {/* Sparkline Graph */}
            {chartData.length > 0 && (
              <div className="h-[80px] w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient
                        id="colorBalance"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#6366f1"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#6366f1"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <RechartsTooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                      formatter={(val: any) => [
                        `${val} ${currency}`,
                        "Balance",
                      ]}
                      labelStyle={{ display: "none" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="balance"
                      stroke="#6366f1"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorBalance)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => setShowBankModal(true)}
            className="group flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-[20px] transition-all hover:bg-slate-800 active:scale-95 shadow-lg shadow-slate-900/20"
          >
            <Landmark size={18} />
            <span className="text-[11px] font-black uppercase tracking-wider">
              {language === "Français"
                ? "Salaire"
                : language === "العربية"
                ? "راتب"
                : "Salary"}
            </span>
          </button>
          <button
            onClick={() => onAddClick && onAddClick("INCOME")}
            className="group flex items-center justify-center gap-2 py-4 bg-white text-slate-800 border-2 border-slate-100 rounded-[20px] transition-all hover:border-slate-200 active:scale-95 shadow-sm"
          >
            <ArrowDownToLine size={18} />
            <span className="text-[11px] font-black uppercase tracking-wider">
              {language === "Français"
                ? "Retrait"
                : language === "العربية"
                ? "سحب"
                : "Withdraw"}
            </span>
          </button>
        </div>

        {/* Transactions à Venir */}
        <div className="mb-6">
          <div className="flex items-center justify-between px-1 mb-4">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-800 flex items-center gap-2">
              {language === "Français"
                ? "Prévues"
                : language === "العربية"
                ? "المعاملات القادمة"
                : "Upcoming"}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setIsCompactUpcoming(!isCompactUpcoming)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
              >
                {isCompactUpcoming ? <LayoutGrid size={16} /> : <List size={16} />}
              </button>
              <button
                onClick={() => setIsManageUpcomingModalOpen(true)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
              >
                <Settings size={16} />
              </button>
            </div>
          </div>
          
          <div className={isCompactUpcoming ? "flex flex-col gap-2 px-1" : "flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar -mx-1 px-1"}>
            {upcomingTransactions.map((tx) => {
              const cat = CATEGORIES.find(c => c.id === tx.categoryId) || CATEGORIES[7];
              let IconComp = tx.iconName ? (ICON_MAP[tx.iconName] || ShoppingBag) : (ICON_MAP[cat.iconName] || ShoppingBag);
              
              const txColor = tx.colorHex || cat.colorHex;

              // Urgency calculation
              const today = new Date().getDate();
              const targetDay = tx.dayOfMonth || parseInt(tx.dateStr.replace(/\D/g, "")) || 1;
              let diff = targetDay - today;
              if (diff < 0) diff += 30; // approx days in month to next occurrence
              
              const isUrgent = diff <= 3;
              const isToday = diff === 0 || diff === 30;
              
              const urgencyColor = isToday ? "text-rose-500 bg-rose-50" : isUrgent ? "text-orange-500 bg-orange-50" : "text-slate-400 bg-slate-50";

              const currentMonthStr = new Date().toISOString().slice(0, 7);
              const isPaidThisMonth = tx.lastPaidMonth === currentMonthStr;

              if (isCompactUpcoming) {
                return (
                  <div key={tx.id} className="bg-white border border-slate-100 rounded-[20px] p-3 flex items-center gap-3 shadow-sm relative overflow-hidden group">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${txColor}20`, color: txColor }}
                    >
                      <IconComp size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-slate-800 text-[13px] truncate">
                        {tx.label}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md flex items-center gap-1 ${urgencyColor}`}>
                          <Clock size={10} />
                          {isToday ? "Aujourd'hui" : `J-${diff}`}
                        </span>
                        <span className="text-rose-600 font-black text-[11px] truncate">
                          -{tx.amount} {currency}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleValidateUpcoming(tx)}
                      disabled={isPaidThisMonth}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform ${isPaidThisMonth ? 'bg-rose-50 text-rose-500 cursor-not-allowed' : 'bg-indigo-50 text-indigo-600 active:scale-95'}`}
                    >
                      <CheckCircle2 size={20} />
                    </button>
                  </div>
                );
              }

              return (
                <div
                  key={tx.id}
                  className="snap-start shrink-0 w-[140px] bg-white border border-slate-100 rounded-[24px] p-4 flex flex-col shadow-sm relative overflow-hidden group"
                >
                  <div className="flex flex-col gap-3 h-full">
                    <div className="flex items-start justify-between">
                      <div
                        className="w-10 h-10 rounded-[14px] flex items-center justify-center"
                        style={{ backgroundColor: `${txColor}20`, color: txColor }}
                      >
                        <IconComp size={20} />
                      </div>
                      <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md flex items-center gap-1 ${urgencyColor}`}>
                        {isToday ? "Auj." : `J-${diff}`}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-slate-800 text-[14px] leading-tight line-clamp-2">
                        {tx.label}
                      </p>
                      <p className="text-rose-600 font-black text-[15px] mt-1 truncate">
                        -{tx.amount} <span className="text-[10px] uppercase">{currency}</span>
                      </p>
                    </div>
                    <button 
                      onClick={() => handleValidateUpcoming(tx)}
                      disabled={isPaidThisMonth}
                      className={`w-full mt-2 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-wider flex items-center justify-center gap-1 transition-transform ${isPaidThisMonth ? 'bg-rose-50 text-rose-500 cursor-not-allowed' : 'bg-indigo-50 text-indigo-600 active:scale-95'}`}
                    >
                      <CheckCircle2 size={14} />
                      {language === "Français" ? (isPaidThisMonth ? "Payé" : "Payer") : (isPaidThisMonth ? "Paid" : "Pay")}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Transactions Header & Search */}
        <div className="flex flex-col gap-3 mb-4 mt-8">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-800">
              {language === "Français"
                ? "Historique"
                : language === "العربية"
                ? "تاريخ"
                : "History"}
            </h3>
            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
              {filteredTransactions.length}
            </span>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder={
                  language === "Français" ? "Rechercher..." : "Search..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border-2 border-slate-100 rounded-[20px] py-3.5 pl-12 pr-4 text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 transition-colors shadow-sm"
              />
            </div>
            <div className="flex bg-white rounded-[20px] border-2 border-slate-100 p-1 shadow-sm shrink-0">
              <button
                onClick={() => setFilter("ALL")}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors ${
                  filter === "ALL"
                    ? "bg-slate-100 text-slate-800"
                    : "text-slate-400 hover:bg-slate-50"
                }`}
              >
                {language === "Français" ? "Tout" : "All"}
              </button>
              <button
                onClick={() => setFilter("IN")}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors ${
                  filter === "IN"
                    ? "bg-emerald-50 text-emerald-600"
                    : "text-slate-400 hover:bg-slate-50"
                }`}
              >
                In
              </button>
              <button
                onClick={() => setFilter("OUT")}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors ${
                  filter === "OUT"
                    ? "bg-rose-50 text-rose-600"
                    : "text-slate-400 hover:bg-slate-50"
                }`}
              >
                Out
              </button>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        {groupedTransactions.length === 0 ? (
          <div className="text-center py-16 px-4 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Search size={24} className="text-slate-300" />
            </div>
            <p className="text-slate-400 font-bold text-sm">
              {language === "Français"
                ? "Aucune transaction trouvée"
                : language === "العربية"
                ? "لا توجد معاملات"
                : "No transactions found"}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {groupedTransactions.map((group, groupIndex) => (
              <div key={group.title} className="space-y-3">
                <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400 pl-4 sticky top-0 bg-[#f8fafc] z-10 py-1">
                  {group.title}
                </h4>
                {group.data.map((tx, index) => {
                  const isIncome = tx.type === "INCOME" && tx.paidByBank;
                  const isRetrait = tx.type === "INCOME" && !tx.paidByBank;

                  const info = getArticleInfo(
                    tx.label,
                    tx.category,
                    predefinedItems
                  );
                  const IconComp = info.iconName
                    ? ICON_MAP[info.iconName]
                    : null;

                  // Expert Styling Map
                  const styleMap = {
                    salaire: {
                      bg: "bg-emerald-50",
                      text: "text-emerald-600",
                      border: "border-emerald-100",
                      icon: <Landmark size={20} />,
                    },
                    depot: {
                      bg: "bg-sky-50",
                      text: "text-sky-600",
                      border: "border-sky-100",
                      icon: <ArrowDownToLine size={20} />,
                    },
                    autreEntree: {
                      bg: "bg-purple-50",
                      text: "text-purple-600",
                      border: "border-purple-100",
                      icon: <Wallet size={20} />,
                    },
                    retrait: {
                      bg: "bg-rose-50",
                      text: "text-rose-600",
                      border: "border-rose-100",
                      icon: <ArrowDownToLine size={20} />,
                    },
                  };

                  const isOwedToMe =
                    tx.category &&
                    [
                      "on me doit",
                      "مستحقات لي",
                      "owed to me",
                      "crédit +",
                    ].includes(tx.category.toLowerCase());
                  const isOwedByMe =
                    tx.category &&
                    ["je dois", "ديون علي", "i owe", "crédit --"].includes(
                      tx.category.toLowerCase()
                    );

                  let style;
                  let indicatorColor = "";
                  if (isIncome) {
                    if (tx.category === "Salaire") {
                      style = styleMap.salaire;
                      indicatorColor = "bg-emerald-500";
                    } else if (tx.category === "Dépôt") {
                      style = styleMap.depot;
                      indicatorColor = "bg-sky-500";
                    } else if (isOwedToMe) {
                      style = {
                        bg: "bg-indigo-600 shadow-sm shadow-indigo-600/20",
                        text: "text-white",
                        border: "border-indigo-100",
                        icon: <TrendingUp size={20} />,
                      };
                      indicatorColor = "bg-indigo-600";
                    } else {
                      style = styleMap.autreEntree;
                      indicatorColor = "bg-purple-500";
                    }
                  } else if (isRetrait) {
                    style = styleMap.retrait;
                    indicatorColor = "bg-rose-500";
                  } else {
                    if (isOwedByMe) {
                      style = {
                        bg: "bg-amber-500 shadow-sm shadow-amber-500/20",
                        text: "text-white",
                        border: "border-amber-100",
                        icon: <TrendingDown size={20} />,
                      };
                      indicatorColor = "bg-amber-500";
                    } else {
                      const cat =
                        CATEGORIES.find((c) => c.id === tx.category) ||
                        CATEGORIES[7]; // Autres fallback
                      const CatIcon = IconComp || ICON_MAP[cat.iconName] || ShoppingBag;
                      style = {
                        bg: cat.bgColor,
                        text: cat.color,
                        border: cat.borderColor,
                        icon: <CatIcon size={20} />,
                      };
                      indicatorColor = `bg-${cat.colorString}-500`;
                    }
                  }

                  const isMenuOpen = openMenuId === tx.id;

                  return (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`group relative flex items-center gap-4 p-4 rounded-[28px] border bg-white ${style.border} shadow-sm hover:shadow-md transition-all cursor-pointer`}
                      onClick={() => !isMenuOpen && setSelectedTx(tx)}
                    >
                      <div
                        className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-[28px] ${indicatorColor} opacity-0 group-hover:opacity-100 transition-opacity`}
                      />

                      <div
                        className={`shrink-0 w-12 h-12 rounded-[20px] flex items-center justify-center transition-transform group-hover:scale-110 ${style.bg} ${style.text}`}
                      >
                        {isIncome || isRetrait || isOwedToMe || isOwedByMe ? (
                          style.icon
                        ) : info.iconSvg ? (
                          <div
                            dangerouslySetInnerHTML={{ __html: info.iconSvg }}
                            className="w-5 h-5 text-current"
                          />
                        ) : IconComp ? (
                          <IconComp size={20} />
                        ) : (
                          style.icon
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="font-black text-slate-800 text-sm tracking-tight truncate">
                            {isIncome && tx.category === "Salaire"
                              ? "Salaire"
                              : isIncome && tx.category === "Dépôt"
                              ? "Dépôt"
                              : isRetrait
                              ? "Retrait"
                              : isIncome && !isOwedToMe
                              ? tx.label
                              : isOwedToMe || isOwedByMe
                              ? tx.label.replace(/^(Emprunt de |Prêt à |Remboursement : |Remboursement partiel : |Paiement partiel dette : |استرداد مستحق: |استرداد جزئي: |تسديد دين جزئي: |Borrow from |Loan to |Repayment : |Partial repayment : )/i, "")
                              : tx.label}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-bold text-slate-400 capitalize">
                            {tx.category ||
                              (language === "Français" ? "Autre" : "Other")}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-slate-200" />
                          <span className="text-[10px] font-bold text-slate-400">
                            {tx.date}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0 flex flex-col items-end pr-1">
                        <p
                          className={`font-black tracking-tighter text-[15px] ${
                            isIncome ? "text-emerald-600" : "text-rose-600"
                          }`}
                        >
                          {isIncome ? "+" : "-"}
                          {tx.amount.toLocaleString("fr-FR")}
                        </p>
                        <span className="text-[9px] font-black uppercase text-slate-400 mt-0.5">
                          {currency}
                        </span>
                      </div>

                      <div className="relative shrink-0 flex items-center justify-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(isMenuOpen ? null : tx.id);
                          }}
                          className={`p-2 rounded-xl transition-colors ${
                            isMenuOpen
                              ? "bg-slate-100 text-slate-800"
                              : "text-slate-300 hover:bg-slate-50 hover:text-slate-600"
                          }`}
                        >
                          <MoreVertical size={18} />
                        </button>

                        <AnimatePresence>
                          {isMenuOpen && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -10 }}
                              className="absolute right-0 top-10 w-36 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-20 overflow-hidden"
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingTx(tx);
                                  setOpenMenuId(null);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-slate-50 transition-colors text-left"
                              >
                                <Edit2 size={14} className="text-slate-500" />
                                <span className="text-xs font-bold text-slate-700">
                                  Modifier
                                </span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (onDelete) onDelete(tx.id);
                                  setOpenMenuId(null);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-rose-50 transition-colors text-left"
                              >
                                <Trash2 size={14} className="text-rose-500" />
                                <span className="text-xs font-bold text-rose-600">
                                  Supprimer
                                </span>
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Transaction Details Bottom Sheet */}
      <AnimatePresence>
        {selectedTx && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 backdrop-blur-sm p-4 sm:p-0 sm:items-center">
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-white rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div
                    className={`w-16 h-16 rounded-[24px] flex items-center justify-center ${
                      selectedTx.type === "INCOME"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-rose-50 text-rose-600"
                    }`}
                  >
                    {selectedTx.type === "INCOME" ? (
                      <TrendingUp size={28} />
                    ) : (
                      <TrendingDown size={28} />
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedTx(null)}
                    className="p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-1">
                  {selectedTx.label}
                </h3>
                <p className="text-sm font-bold text-slate-400 capitalize mb-6">
                  {selectedTx.category}
                </p>

                <div className="bg-slate-50 rounded-[24px] p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      {language === "Français" ? "Montant" : "Amount"}
                    </span>
                    <span
                      className={`text-xl font-black ${
                        selectedTx.type === "INCOME"
                          ? "text-emerald-600"
                          : "text-slate-800"
                      }`}
                    >
                      {selectedTx.type === "INCOME" ? "+" : "-"}
                      {selectedTx.amount.toLocaleString("fr-FR")}{" "}
                      <span className="text-sm">{currency}</span>
                    </span>
                  </div>
                  <div className="h-px w-full bg-slate-200" />
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      {language === "Français" ? "Date" : "Date"}
                    </span>
                    <span className="text-sm font-bold text-slate-700">
                      {selectedTx.date}
                    </span>
                  </div>
                  <div className="h-px w-full bg-slate-200" />
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      {language === "Français" ? "Type" : "Type"}
                    </span>
                    <span className="text-sm font-bold text-slate-700">
                      {selectedTx.type === "INCOME" ? "Revenu" : "Dépense"}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Transaction Modal */}
      <AnimatePresence>
        {editingTx && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[32px] p-6 w-full max-w-sm shadow-2xl border border-slate-100"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-black text-slate-800">
                  Modifier Transaction
                </h3>
                <button
                  onClick={() => setEditingTx(null)}
                  className="p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-2">
                    Label
                  </label>
                  <input
                    type="text"
                    value={editingTx.label}
                    onChange={(e) =>
                      setEditingTx({ ...editingTx, label: e.target.value })
                    }
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-2">
                    Montant
                  </label>
                  <input
                    type="number"
                    value={editingTx.amount || ""}
                    onChange={(e) =>
                      setEditingTx({
                        ...editingTx,
                        amount: Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  if (onUpdate && editingTx) {
                    onUpdate(editingTx.id, {
                      label: editingTx.label,
                      amount: editingTx.amount,
                    });
                  }
                  setEditingTx(null);
                }}
                className="w-full mt-6 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30"
              >
                Sauvegarder
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ManageUpcomingModal
        isOpen={isManageUpcomingModalOpen}
        onClose={() => setIsManageUpcomingModalOpen(false)}
        transactions={upcomingTransactions}
        onSave={setUpcomingTransactions}
        language={language}
        currency={currency}
      />
    </motion.div>
  );
}
