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
  Settings,
  Target,
  AlertTriangle,
  Home as HomeIcon,
  HeartPulse,
  Heart,
  PackageOpen,
  Eye,
  EyeOff,
  Sparkles,
  Camera,
  Wifi,
  WifiOff,
  Mic,
  ListTodo,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Transaction, CreditEntry, Reminder, ShoppingListItem } from "../types";
import { useLocalStorage } from "../hooks/useLocalStorage";
import {
  ICON_MAP,
  CATEGORIES as APP_CATEGORIES,
  INITIAL_PREDEFINED_ITEMS,
  getArticleInfo,
} from "../constants";
import CalendarView from "./CalendarView";
import ReceiptScannerModal from "./ReceiptScannerModal";
import InshallahEstimationCard from "./InshallahEstimationCard";
import AddBankBalanceModal from "./AddBankBalanceModal";
import VoiceTransactionModal from "./VoiceTransactionModal";

interface HomeProps {
  balance: number;
  bankBalance: number;
  onAddBankBalance: (amount: number, label: string, category: string) => void;
  transactions: Transaction[];
  onAddClick: (
    type: "INCOME" | "EXPENSE",
    prefill?: { name: string; category: string; price: number }
  ) => void;
  onAddTransaction?: (
    label: string,
    amount: number,
    type: "INCOME" | "EXPENSE",
    category?: string,
    paidByBank?: boolean,
    isPureInflow?: boolean,
    inventoryData?: {
      quantity: number;
      color: string;
      bg: string;
      iconName: string;
      iconSvg?: string;
    }
  ) => void;
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
  reminders?: Reminder[];
  shoppingList?: ShoppingListItem[];
  inventoryItems?: import("../types").InventoryItem[];
  onInventoryItemsChange?: (items: import("../types").InventoryItem[]) => void;
  predefinedItems: import("../types").PredefinedItem[];
  onAddPredefinedItem: (item: import("../types").PredefinedItem) => void;
  onUpdatePredefinedItem: (
    id: string,
    updates: Partial<import("../types").PredefinedItem>
  ) => void;
  onOpenShoppingList: () => void;
}

export default function Home({
  balance,
  bankBalance,
  onAddBankBalance,
  transactions,
  onAddClick,
  onAddTransaction,
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
  reminders = [],
  shoppingList = [],
  inventoryItems = [],
  onInventoryItemsChange,
  predefinedItems,
  onAddPredefinedItem,
  onUpdatePredefinedItem,
  onOpenShoppingList,
}: HomeProps) {
  const [timeframe, setTimeframe] = useState<"day" | "week" | "month">("week");
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showReceiptScannerModal, setShowReceiptScannerModal] = useState(false);
  const [categoryBudgetsRaw, setCategoryBudgetsRaw] = useLocalStorage<any>(
    "categoryBudgets",
    {}
  );
  const categoryBudgets = React.useMemo(() => {
    if (!categoryBudgetsRaw) return {};
    if (Array.isArray(categoryBudgetsRaw)) {
      return categoryBudgetsRaw.reduce(
        (acc: any, b: any) => ({ ...acc, [b.category]: b.limit }),
        {}
      );
    }
    if (typeof categoryBudgetsRaw === "object") {
      const clean: Record<string, number> = {};
      Object.entries(categoryBudgetsRaw).forEach(([k, v]) => {
        if (typeof v === "number") {
          clean[k] = v;
        } else if (
          v &&
          typeof v === "object" &&
          (v as any).category &&
          typeof (v as any).limit === "number"
        ) {
          clean[(v as any).category] = (v as any).limit;
        }
      });
      return clean;
    }
    return {};
  }, [categoryBudgetsRaw]);

  const setCategoryBudgets = (
    updater: React.SetStateAction<Record<string, number>>
  ) => {
    setCategoryBudgetsRaw((prevRaw: any) => {
      let currentClean: Record<string, number> = {};
      if (Array.isArray(prevRaw)) {
        currentClean = prevRaw.reduce(
          (acc: any, b: any) => ({ ...acc, [b.category]: b.limit }),
          {}
        );
      } else if (prevRaw && typeof prevRaw === "object") {
        Object.entries(prevRaw).forEach(([k, v]) => {
          if (typeof v === "number") {
            currentClean[k] = v;
          } else if (
            v &&
            typeof v === "object" &&
            (v as any).category &&
            typeof (v as any).limit === "number"
          ) {
            currentClean[(v as any).category] = (v as any).limit;
          }
        });
      }
      return typeof updater === "function" ? updater(currentClean) : updater;
    });
  };
  const [showRasSettingModal, setShowRasSettingModal] = useState(false);
  const [rasHiddenItems, setRasHiddenItems] = useLocalStorage<string[]>(
    "rasHiddenItems",
    []
  );
  const [favoriteItemIds, setFavoriteItemIds] = useLocalStorage<string[]>(
    "favoriteItemIds",
    []
  );
  const [showFavoritesSettingModal, setShowFavoritesSettingModal] =
    useState(false);
  const [favoriteUsage, setFavoriteUsage] = useLocalStorage<
    Record<string, { count: number; resetsAt: number }>
  >("favoriteUsage", {});

  const getNext230AM = () => {
    const now = new Date();
    const next = new Date(now);
    next.setHours(2, 30, 0, 0);
    if (now.getTime() >= next.getTime()) {
      next.setDate(next.getDate() + 1);
    }
    return next.getTime();
  };

  const handleFavoriteClick = (item: any) => {
    if (onAddTransaction) {
      onAddTransaction(
        item.name,
        item.price,
        "EXPENSE",
        item.category,
        false,
        false
      );
      
      const predefinedItem = predefinedItems.find(p => p.id === item.id);
      const limit = predefinedItem?.dailyLimit || 1;

      setFavoriteUsage((prev) => {
        const currentUsage = prev[item.id] || { count: 0, resetsAt: 0 };
        const now = Date.now();
        const count = currentUsage.resetsAt < now ? 1 : currentUsage.count + 1;
        return {
          ...prev,
          [item.id]: {
            count,
            resetsAt: currentUsage.resetsAt < now ? getNext230AM() : currentUsage.resetsAt,
          }
        };
      });
    } else {
      onAddClick("EXPENSE", {
        name: item.name,
        category: item.category,
        price: item.price,
      });
    }
  };

  const [hideBankBalance, setHideBankBalance] = useLocalStorage<boolean>(
    "hideBankBalance",
    true
  );
  const [showScannerFab] = useLocalStorage<boolean>("showScannerFab", true);
  const [isOnline, setIsOnline] = React.useState(true);

  const DEFAULT_HOME_SECTIONS = [
    { id: "mainWidget", label: "Widget Principal", visible: true },
    { id: "quickActions", label: "Actions Rapides", visible: true },
    { id: "credits", label: "Mes Crédits", visible: true },
    { id: "summary", label: "Sommaire", visible: true },
    { id: "favorites", label: "Favoris", visible: true },
    { id: "ras", label: "RAS", visible: true },
    { id: "budgets", label: "Budgets par Catégorie", visible: true },
    { id: "inshallah", label: "Estimation du Jour", visible: true },
  ];
  const [homeSectionsOrder] = useLocalStorage<any[]>("homeSectionsOrder", DEFAULT_HOME_SECTIONS);
  const getOrder = (id: string) => homeSectionsOrder.findIndex((s) => s.id === id);
  const isVisible = (id: string) => homeSectionsOrder.find((s) => s.id === id)?.visible ?? true;

  React.useEffect(() => {
    let unmounted = false;

    const initNetwork = async () => {
      try {
        const { Network } = await import("@capacitor/network");

        const updateStatus = async () => {
          const status = await Network.getStatus();
          if (!unmounted) setIsOnline(status.connected);
        };
        updateStatus();

        await Network.addListener("networkStatusChange", (status) => {
          if (!unmounted) setIsOnline(status.connected);
        });
      } catch (e) {
        // Fallback for non-capacitor environments if needed, though Network usually works in web
        if (!unmounted) setIsOnline(navigator.onLine);
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);
        return () => {
          window.removeEventListener("online", handleOnline);
          window.removeEventListener("offline", handleOffline);
        };
      }
    };

    initNetwork();

    return () => {
      unmounted = true;
      import("@capacitor/network")
        .then(({ Network }) => {
          Network.removeAllListeners();
        })
        .catch(() => {});
    };
  }, []);

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
      budgetsTitle: "Budgets par Catégorie",
      noBudgetsYet:
        "Aucun budget défini. Appuyez sur l'icône de réglage pour commencer.",
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
      budgetsTitle: "ميزانيات الفئات",
      noBudgetsYet: "لم يتم تحديد ميزانية. اضغط على أيقونة الإعداد للبدء.",
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
      budgetsTitle: "Category Budgets",
      noBudgetsYet: "No budgets defined. Tap the settings icon to start.",
    },
  };

  const t =
    translations[language as keyof typeof translations] ||
    translations["Français"];

  const CATEGORY_MAP = APP_CATEGORIES.map((cat) => ({
    label: cat.label,
    icon: (() => {
      const IconComp = ICON_MAP[cat.iconName] || MoreHorizontal;
      return <IconComp size={24} />;
    })(),
    color: cat.colorString,
    bg: cat.bgColor,
    text: cat.color,
    glow: `bg-${cat.colorString}-400`,
  }));

  const getSummaryTitle = () => {
    if (timeframe === "day") return t.sommaireJour;
    if (timeframe === "month") return t.sommaireMois;
    return t.sommaireSemaine;
  };

  const totalOweMe = creditEntries
    .filter((e) => e.type === "OWE_ME" && !e.settled)
    .reduce((acc, e) => acc + e.amount, 0);

  const totalIOwe = creditEntries
    .filter((e) => e.type === "I_OWE" && !e.settled)
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
        const isCredit =
          tx.category &&
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
          ].includes(tx.category.toLowerCase());
        const isVirementExpense = tx.type === "EXPENSE" && tx.category === "Virement";

        if (!isCredit && !isVirementExpense) {
          if (tx.type === "EXPENSE") totalExpense += tx.amount;
          else if (tx.type === "INCOME" && !tx.paidByBank)
            totalIncome += tx.amount;
        }
      }
    });

    return { totalExpense, totalIncome };
  }, [transactions, timeframe]);

  const currentMonthExpenses = React.useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const spends = new Map<string, number>();

    transactions.forEach((tx) => {
      if (tx.type === "EXPENSE" && tx.timestamp >= startOfMonth.getTime()) {
        const cat = (tx.category || "Autres").toLowerCase();
        spends.set(cat, (spends.get(cat) || 0) + tx.amount);
      }
    });

    return spends;
  }, [transactions]);

  const handleDecreaseInventory = (item: import("../types").InventoryItem) => {
    if (item.quantity <= 0 || !onInventoryItemsChange) return;

    const now = new Date();
    const dateStr = now
      .toLocaleDateString(
        language === "Français"
          ? "fr-FR"
          : language === "العربية"
          ? "ar-MA"
          : "en-US",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      )
      .replace(",", "");

    const newAction: import("../types").InventoryDecreaseAction = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      dateStr,
    };

    const updatedItems = inventoryItems.map((i) => {
      if (i.id === item.id) {
        if (i.unitType === 'grams' || i.unitType === 'liters') {
          return {
            ...i,
            usageCount: (i.usageCount || 0) + 1,
            history: [...i.history, newAction],
          };
        }
        return {
          ...i,
          quantity: i.quantity - 1,
          history: [...i.history, newAction],
        };
      }
      return i;
    });

    onInventoryItemsChange(updatedItems);
  };

  const handleDeclareEmpty = (item: import("../types").InventoryItem) => {
    if (!onInventoryItemsChange) return;
    const updatedItems = inventoryItems.map((i) => {
      if (i.id === item.id) {
        return {
          ...i,
          quantity: 0,
        };
      }
      return i;
    });
    onInventoryItemsChange(updatedItems);
  };

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
      className="flex flex-col"
    >
      {/* Main Widget Card */}
      {isVisible("mainWidget") && (
        <div style={{ order: getOrder("mainWidget") }}>
          <div
            className="relative min-h-[12rem] h-auto rounded-[24px] overflow-hidden shadow-lg mb-8 transition-all hover:scale-[1.01] cursor-pointer"
            style={{ background: widgetBackground }}
          >
        <div
          className="absolute top-4 right-4 z-20 flex items-center justify-center p-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 shadow-sm"
          title={isOnline ? "Connecté" : "Hors-ligne"}
        >
          {isOnline ? (
            <Wifi size={14} className="text-emerald-500" />
          ) : (
            <WifiOff size={14} className="text-red-500" />
          )}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${widgetMode}-${widgetBalanceType}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="relative z-10 py-5 px-6 h-full w-full flex flex-col justify-center"
          >
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
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setHideBankBalance(!hideBankBalance);
                    }}
                    className="flex items-center justify-center pointer-events-auto text-slate-800 active:scale-95 transition-transform"
                  >
                    {hideBankBalance ? (
                      <EyeOff size={28} strokeWidth={2.5} />
                    ) : (
                      <Eye size={28} strokeWidth={2.5} />
                    )}
                  </button>
                  <div className="flex items-baseline gap-2">
                    <div className="text-4xl font-black text-slate-900 tracking-tighter">
                      {hideBankBalance
                        ? "****"
                        : bankBalance.toLocaleString("fr-FR", {
                            minimumFractionDigits: 2,
                          })}
                    </div>
                    <span className="text-xl font-bold text-slate-900/40 uppercase">
                      {currency}
                    </span>
                  </div>
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
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setHideBankBalance(!hideBankBalance);
                      }}
                      className="flex items-center justify-center pointer-events-auto text-slate-800 active:scale-95 transition-transform"
                    >
                      {hideBankBalance ? (
                        <EyeOff size={28} strokeWidth={2.5} />
                      ) : (
                        <Eye size={28} strokeWidth={2.5} />
                      )}
                    </button>
                    <div className="flex items-baseline gap-2">
                      <div className="text-4xl font-black text-slate-900 tracking-tighter">
                        {hideBankBalance
                          ? "****"
                          : bankBalance.toLocaleString("fr-FR", {
                              minimumFractionDigits: 2,
                            })}
                      </div>
                      <span className="text-xl font-bold text-slate-900/40 uppercase">
                        {currency}
                      </span>
                    </div>
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
        <VoiceTransactionModal
          isOpen={isVoiceModalOpen}
          onClose={() => setIsVoiceModalOpen(false)}
          onAddTransaction={onAddTransaction || (() => {})}
          language={language}
        />
      </AnimatePresence>

      {/* Quick Actions - Modern Redesign (Moved up) */}
      {isVisible("quickActions") && (
      <div className="grid grid-cols-3 gap-3 mb-4" style={{ order: getOrder("quickActions") }}>
        <button
          onClick={() => onAddClick("EXPENSE")}
          className="group relative flex flex-col items-center justify-center gap-2 h-24 bg-white border-2 border-slate-50 rounded-[24px] transition-all hover:border-rose-100 hover:bg-rose-50/30 active:scale-95 shadow-sm"
        >
          <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
            <ShoppingBag size={20} strokeWidth={2.5} />
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-rose-600 transition-colors text-center leading-tight">
            {t.ajouterAchat}
          </span>
        </button>
        <button
          onClick={() => setIsVoiceModalOpen(true)}
          className="group relative flex flex-col items-center justify-center gap-2 h-24 bg-gradient-to-b from-indigo-50 to-violet-50 border-2 border-indigo-100/50 rounded-[24px] transition-all hover:border-indigo-200 active:scale-95 shadow-sm overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/40" />
          <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-600 transition-all shadow-md shadow-indigo-500/20 relative z-10">
            <Mic size={20} strokeWidth={2.5} />
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600/70 group-hover:text-indigo-600 transition-colors text-center leading-tight relative z-10">
            {language === 'Français' ? 'Saisie Vocale' : language === 'العربية' ? 'إدخال صوتي' : 'Voice Input'}
          </span>
        </button>
        <button
          onClick={onOpenShoppingList}
          className="group relative flex flex-col items-center justify-center gap-2 h-24 bg-white border-2 border-slate-50 rounded-[24px] transition-all hover:border-violet-100 hover:bg-violet-50/30 active:scale-95 shadow-sm"
        >
          <div className="w-10 h-10 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
            <ListTodo size={20} strokeWidth={2.5} />
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-violet-600 transition-colors text-center leading-tight">
            + Liste
          </span>
        </button>
      </div>
      )}

      {/* Credits Buttons - Matching summary card style exactly */}
      {isVisible("credits") && (
      <div className="mb-8" style={{ order: getOrder("credits") }}>
        <h3 className="text-slate-900 font-black tracking-tight mb-4 px-1">
          Mes Crédits
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
      )}

      {/* Summary Section */}
      {isVisible("summary") && (
      <div className="mb-8 space-y-4" style={{ order: getOrder("summary") }}>
        {/* Summary Title with Filter Icon */}
        <div className="flex justify-between items-center px-1">
          <h3 className="text-slate-900 font-bold">{getSummaryTitle()}</h3>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setTimeframe("day")}
              className={`p-1.5 rounded-lg transition-all ${
                timeframe === "day"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-400"
              }`}
            >
              <CalendarCheck size={16} />
            </button>
            <button
              onClick={() => setTimeframe("week")}
              className={`p-1.5 rounded-lg transition-all ${
                timeframe === "week"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-400"
              }`}
            >
              <CalendarRange size={16} />
            </button>
            <button
              onClick={() => setTimeframe("month")}
              className={`p-1.5 rounded-lg transition-all ${
                timeframe === "month"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-400"
              }`}
            >
              <CalendarDays size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowCalendarModal(true)}
            className="text-left p-4 rounded-2xl border-2 border-danger-red/20 bg-danger-red/5 relative overflow-hidden group hover:border-danger-red/40 transition-all cursor-pointer"
          >
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
          </button>
          <button
            onClick={() => setShowCalendarModal(true)}
            className="text-left p-4 rounded-2xl border-2 border-bank-blue/20 bg-bank-blue/5 relative overflow-hidden group hover:border-bank-blue/40 transition-all cursor-pointer"
          >
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
          </button>
        </div>
      </div>
      )}

      {/* Favorites Shortcuts */}
      {isVisible("favorites") && (
      <div className="mb-2 overflow-hidden -mx-1 px-1" style={{ order: getOrder("favorites") }}>
        <div className="flex justify-between items-center mb-4 px-1">
          <h3 className="text-slate-900 font-black tracking-tight flex items-center gap-2">
            Favoris
          </h3>
          <button
            onClick={() => setShowFavoritesSettingModal(true)}
            className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Settings size={16} />
          </button>
        </div>
        {favoriteItemIds.length === 0 ? (
          <div
            className="text-center py-4 border-2 border-dashed border-slate-200 rounded-[24px] mb-4 text-slate-400 text-sm font-medium mx-1"
            onClick={() => setShowFavoritesSettingModal(true)}
          >
            Appuyez sur l'icône réglage pour épingler vos achats fréquents
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-3 pb-6 px-2 pt-2">
            {predefinedItems.filter(
              (i) => {
                if (!favoriteItemIds.includes(i.id)) return false;
                const usage = favoriteUsage[i.id];
                if (!usage || usage.resetsAt < Date.now()) return true;
                const limit = i.dailyLimit || 1;
                return usage.count < limit;
              }
            ).map((item, index) => {
              const info = getArticleInfo(item.name, item.category, predefinedItems);
              const IconComponent =
                info.iconName && ICON_MAP[info.iconName]
                  ? (ICON_MAP[info.iconName] as React.ElementType)
                  : PackageOpen;
              const textClass = info.color || "text-slate-800";

              const isSpecialItem = item.id === '1' || item.id === '2';
              const usageCount = favoriteUsage[item.id]?.count || 0;
              const remainingUses = (item.dailyLimit || 1) - usageCount;
              const hasStackEffect = isSpecialItem && remainingUses > 1;

              return (
                <div key={`${item.id}-${index}`} className="relative w-full aspect-square">
                  {/* Layer 2 (Bottom layer shadow effect) */}
                  <div 
                    className={`absolute inset-0 rounded-full border transition-all duration-300 ease-out pointer-events-none ${isSpecialItem ? `${info.bgColor || "bg-slate-50"} ${info.borderColor || "border-white"} brightness-90` : 'bg-white border-slate-100'} ${hasStackEffect ? 'opacity-100 translate-x-[6px] translate-y-[6px] shadow-sm' : 'opacity-0 translate-x-0 translate-y-0'}`} 
                  />
                  {/* Layer 1 (Middle layer shadow effect) */}
                  <div 
                    className={`absolute inset-0 rounded-full border transition-all duration-300 ease-out delay-75 pointer-events-none ${isSpecialItem ? `${info.bgColor || "bg-slate-50"} ${info.borderColor || "border-white"} brightness-95` : 'bg-white border-slate-100'} ${hasStackEffect ? 'opacity-100 translate-x-[3px] translate-y-[3px] shadow-sm' : 'opacity-0 translate-x-0 translate-y-0'}`} 
                  />
                  
                  {/* Actual Button */}
                  <button
                    onClick={() => handleFavoriteClick(item)}
                    className={`absolute inset-0 w-full h-full rounded-full p-2 flex flex-col items-center justify-center overflow-hidden transition-all duration-300 shadow-sm border border-white active:scale-95 group ${
                      info.bgColor || "bg-slate-50"
                    } hover:brightness-95 ${hasStackEffect ? '-translate-x-[2px] -translate-y-[2px]' : 'translate-x-0 translate-y-0 z-10'}`}
                  >
                    <div
                      className={`z-10 relative flex items-center justify-center ${textClass} mb-0.5`}
                    >
                      {info.iconSvg || item.iconSvg ? (
                        <div
                          dangerouslySetInnerHTML={{ __html: (info.iconSvg || item.iconSvg) as string }}
                          className="w-5 h-5 sm:w-6 sm:h-6 text-current svg-container"
                        />
                      ) : (
                        <IconComponent
                          size={24}
                          className="sm:w-[26px] sm:h-[26px]"
                          strokeWidth={2.5}
                        />
                      )}
                    </div>
                    <span
                      className={`z-10 text-[8px] sm:text-[9px] font-bold ${textClass} uppercase truncate w-full px-1 text-center mt-0.5`}
                    >
                      {item.name}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
      )}

      {/* Inventory Shortcuts */}
      {isVisible("ras") && inventoryItems &&
        inventoryItems.filter((i) => i.quantity > 0).length > 0 && (
          <div className="mb-2 overflow-hidden -mx-1 px-1" style={{ order: getOrder("ras") }}>
            <div className="flex justify-between items-center mb-4 px-1">
              <h3 className="text-slate-900 font-black tracking-tight flex items-center gap-2">
                RAS
              </h3>
              <button
                onClick={() => setShowRasSettingModal(true)}
                className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors shadow-sm"
              >
                <Settings size={16} />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2 pb-4 px-1">
              {inventoryItems
                .filter((i) => i.quantity > 0 && !rasHiddenItems.includes(i.id))
                .map((item, index) => {
                  const info = getArticleInfo(item.name, item.category || "Autres", predefinedItems);
                  const IconComponent =
                    info.iconName && ICON_MAP[info.iconName]
                      ? (ICON_MAP[info.iconName] as React.ElementType)
                      : PackageOpen;
                  const bgClass = info.bgColor || item.bg || "bg-violet-600";
                  const textClass = info.color || item.color || "text-slate-800";

                  return (
                    <div
                      key={`${item.id}-${index}`}
                      onClick={() => handleDecreaseInventory(item)}
                      className={`w-full h-[86px] rounded-[24px] flex flex-col items-center justify-center relative overflow-hidden transition-all shadow-sm border border-white hover:border-slate-200 active:scale-95 group cursor-pointer ${
                        bgClass.replace("100", "50")
                      }`}
                    >
                      {/* Plus/minus icon that appears on hover/active (optional visual cue) */}
                      <div
                        className={`absolute right-1 top-1 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 shadow-sm ${textClass}`}
                      >
                        <span className="text-xs font-black leading-none mb-0.5">
                          -
                        </span>
                      </div>

                      {(item.unitType === 'grams' || item.unitType === 'liters') && (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeclareEmpty(item);
                          }}
                          className={`absolute left-1 top-1 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-red-100 text-red-600 shadow-sm z-20 hover:bg-red-200`}
                          title="Déclarer épuisé"
                        >
                          <span className="text-[10px] font-black leading-none mb-0.5">X</span>
                        </div>
                      )}

                      <div
                        className={`z-10 relative flex items-center justify-center ${textClass} mb-1 mt-1`}
                      >
                        <span className="absolute -top-1.5 -left-1.5 text-[11px] font-black leading-none">
                          {item.unitType === 'grams' || item.unitType === 'liters' ? (item.usageCount || 0) : item.quantity}
                        </span>
                        {item.iconSvg || info.iconSvg ? (
                          <div
                            dangerouslySetInnerHTML={{ __html: item.iconSvg || info.iconSvg || "" }}
                            className="w-6 h-6 text-current"
                          />
                        ) : (
                          <IconComponent size={26} strokeWidth={2.5} />
                        )}
                      </div>
                      <span
                        className={`z-10 text-[9px] font-bold ${textClass} uppercase truncate w-full px-2 text-center mt-1`}
                      >
                        {item.name}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

      {/* Category Budgets Activity Instead of History */}
      {isVisible("budgets") && (
      <div style={{ order: getOrder("budgets") }}>
        <div className="flex justify-between items-center mb-4 px-1">
          <h3 className="text-slate-900 font-black tracking-tight flex items-center gap-2">
            {t.budgetsTitle}
          </h3>
          <button
            onClick={() => setShowBudgetModal(true)}
            className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Settings size={14} />
          </button>
        </div>

        <div className="space-y-4">
          {Object.keys(categoryBudgets).length === 0 ? (
            <div className="text-center bg-white border border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center">
              <Target size={32} className="text-slate-200 mb-3" />
              <p className="text-xs text-slate-400 font-medium">
                {t.noBudgetsYet}
              </p>
            </div>
          ) : (
            Object.entries(categoryBudgets).map(
              ([category, limitRaw], index) => {
                const limit = typeof limitRaw === "number" ? limitRaw : 0;
                const spent =
                  currentMonthExpenses.get(category.toLowerCase()) || 0;
                const percent = Math.min((spent / limit) * 100, 100);
                const isOver = spent > limit;
                const isClose = !isOver && percent > 80;

                const categoryMatch =
                  CATEGORY_MAP.find(
                    (c) => c.label.toLowerCase() === category.toLowerCase()
                  ) || CATEGORY_MAP[0];

                return (
                  <div
                    key={`${category}-${index}`}
                    className={`bg-white rounded-3xl p-5 border shadow-sm ${
                      isOver
                        ? "border-rose-200 shadow-rose-100"
                        : isClose
                        ? "border-amber-200 shadow-amber-100"
                        : "border-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-4 mb-1">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center border border-white shadow-sm ${categoryMatch.bg} ${categoryMatch.text}`}
                      >
                        {categoryMatch.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold text-slate-800 tracking-tight text-sm">
                            {category}
                          </h4>
                          <span
                            className={`text-xs font-black tracking-tighter ${
                              isOver ? "text-rose-600" : "text-slate-500"
                            }`}
                          >
                            {spent.toLocaleString("fr-FR")} /{" "}
                            <span className="text-slate-400">
                              {limit.toLocaleString("fr-FR")} {currency}
                            </span>
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full mt-2 overflow-hidden shadow-inner">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className={`h-full rounded-full ${
                              isOver
                                ? "bg-rose-500"
                                : isClose
                                ? "bg-amber-500"
                                : "bg-teal-500"
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                    {isOver && (
                      <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-rose-500 mt-3 bg-rose-50 px-2 py-1.5 rounded-lg w-fit border border-rose-100/50">
                        <AlertTriangle size={10} />
                        Dépassement de{" "}
                        {Math.abs(limit - spent).toLocaleString("fr-FR")}{" "}
                        {currency}
                      </div>
                    )}
                    {isClose && (
                      <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-amber-500 mt-3 bg-amber-50 px-2 py-1.5 rounded-lg w-fit border border-amber-100/50">
                        Reste {Math.abs(limit - spent).toLocaleString("fr-FR")}{" "}
                        {currency}
                      </div>
                    )}
                  </div>
                );
              }
            )
          )}
        </div>
      </div>
      )}

      {isVisible("inshallah") && (
      <div style={{ order: getOrder("inshallah") }}>
        <InshallahEstimationCard 
          transactions={transactions} 
          currency={currency} 
          language={language}
          balance={balance}
          bankBalance={bankBalance}
        />
      </div>
      )}

      {/* FAB AI Scanner */}
      {showScannerFab && (
        <button
          onClick={() => setShowReceiptScannerModal(true)}
          className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full shadow-lg shadow-blue-500/40 flex items-center justify-center text-white z-50 hover:scale-105 active:scale-95 transition-transform"
        >
          <Sparkles size={24} fill="currentColor" className="text-white" />
        </button>
      )}

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

      <AnimatePresence>
        {showFavoritesSettingModal && (
          <FavoritesSettingsModal
            onClose={() => setShowFavoritesSettingModal(false)}
            predefinedItems={INITIAL_PREDEFINED_ITEMS}
            favoriteItemIds={favoriteItemIds}
            setFavoriteItemIds={setFavoriteItemIds}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showRasSettingModal && inventoryItems && (
          <RasSettingsModal
            onClose={() => setShowRasSettingModal(false)}
            inventoryItems={inventoryItems}
            rasHiddenItems={rasHiddenItems}
            setRasHiddenItems={setRasHiddenItems}
            predefinedItems={predefinedItems}
          />
        )}
        {showBudgetModal && (
          <BudgetSettingsModal
            onClose={() => setShowBudgetModal(false)}
            categoryBudgets={categoryBudgets}
            setCategoryBudgets={setCategoryBudgets}
            categories={CATEGORY_MAP}
            currency={currency}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCalendarModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setShowCalendarModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md relative flex flex-col gap-4"
            >
              <div className="flex justify-end">
                <button
                  onClick={() => setShowCalendarModal(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-white shadow-lg hover:bg-slate-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <CalendarView transactions={transactions} currency={currency} />
            </motion.div>
          </motion.div>
        )}

        {showReceiptScannerModal && (
          <ReceiptScannerModal
            onClose={() => setShowReceiptScannerModal(false)}
            predefinedItems={predefinedItems}
            onAddPredefinedItem={onAddPredefinedItem}
            onUpdatePredefinedItem={onUpdatePredefinedItem}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function BudgetSettingsModal({
  onClose,
  categoryBudgets,
  setCategoryBudgets,
  categories,
  currency,
}: {
  onClose: () => void;
  categoryBudgets: Record<string, number>;
  setCategoryBudgets: (b: Record<string, number>) => void;
  categories: any[];
  currency: string;
}) {
  const [budgets, setBudgets] =
    useState<Record<string, number>>(categoryBudgets);

  const handleSave = () => {
    setCategoryBudgets(budgets);
    onClose();
  };

  const handleBudgetChange = (category: string, amountStr: string) => {
    const val = parseFloat(amountStr);
    const limit = isNaN(val) ? 0 : val;
    setBudgets((prev) => {
      const next = { ...prev };
      if (limit === 0) {
        delete next[category];
      } else {
        next[category] = limit;
      }
      return next;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/60"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-[32px] w-full max-w-sm p-6 shadow-2xl relative max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6 shrink-0">
          <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Settings size={20} className="text-teal-600" />
            Réglage Limites
          </h3>
          <button
            onClick={onClose}
            className="p-2 bg-slate-50 rounded-full text-slate-400"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto pr-2 pb-4 flex-1">
          {categories.map((c) => {
            const currentBudget = budgets[c.label] || "";
            return (
              <div
                key={c.label}
                className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${c.bg} ${c.text}`}
                >
                  {c.icon}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-800 mb-1">
                    {c.label}
                  </p>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={currentBudget}
                      onChange={(e) =>
                        handleBudgetChange(c.label, e.target.value)
                      }
                      placeholder="0"
                      className="w-full bg-white border border-slate-200 rounded-lg py-2 pl-3 pr-10 text-sm font-black text-slate-800 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all font-mono"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 uppercase pointer-events-none">
                      {currency}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="shrink-0 pt-4 mt-2 border-t border-slate-100 bg-white">
          <button
            onClick={handleSave}
            className="w-full py-4 bg-teal-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-teal-600/20 active:scale-95 transition-all text-sm"
          >
            Enregistrer
          </button>
        </div>
      </motion.div>
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
            className={`h-10 rounded-xl flex items-center justify-center transition-all active:scale-95 ${
              copied
                ? "bg-emerald-500 text-white"
                : "bg-slate-800 text-teal-400"
            }`}
          >
            <Copy size={14} />
          </button>
        </div>
      </motion.div>
    </>
  );
}

function FavoritesSettingsModal({
  onClose,
  predefinedItems,
  favoriteItemIds,
  setFavoriteItemIds,
}: {
  onClose: () => void;
  predefinedItems: any[];
  favoriteItemIds: string[];
  setFavoriteItemIds: (ids: string[]) => void;
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>(favoriteItemIds);

  const handleToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    setFavoriteItemIds(selectedIds);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 sm:p-6 bg-slate-900/60 transition-opacity"
      onClick={onClose}
    >
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={(e, info) => {
          if (info.offset.y > 100) onClose();
        }}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-md rounded-t-[32px] sm:rounded-3xl p-6 sm:p-8 flex flex-col max-h-[85vh] shadow-2xl relative"
      >
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 shrink-0" />

        <div className="flex items-center gap-3 mb-6 shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
            <Settings size={20} className="text-slate-600" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">
              Articles Favoris
            </h3>
            <p className="text-sm font-medium text-slate-500 mt-0.5">
              Sélect. les favoris
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 -mx-2 px-2 hide-scrollbar">
          <div className="space-y-3 pb-2">
            {predefinedItems.map((item, index) => {
              const info = getArticleInfo(item.name, item.category, predefinedItems);
              const IconComponent =
                info.iconName && ICON_MAP[info.iconName]
                  ? (ICON_MAP[info.iconName] as React.ElementType)
                  : PackageOpen;
              const isSelected = selectedIds.includes(item.id);
              const textClass = info.color || "text-slate-800";
              const bgClass = info.bgColor || "bg-slate-100";
              return (
                <button
                  key={`${item.id}-${index}`}
                  onClick={() => handleToggle(item.id)}
                  className="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-100 active:bg-slate-50 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${textClass} ${bgClass}`}
                    >
                      {info.iconSvg || item.iconSvg ? (
                        <div
                          dangerouslySetInnerHTML={{ __html: info.iconSvg || item.iconSvg }}
                          className="w-5 h-5 text-current svg-container"
                        />
                      ) : (
                        <IconComponent size={20} />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-700 leading-none mb-1">
                        {item.name}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        {item.price} Dhs
                      </span>
                    </div>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected
                        ? "bg-teal-500 border-teal-500"
                        : "border-slate-300 group-active:border-slate-400"
                    }`}
                  >
                    {isSelected && (
                      <svg
                        viewBox="0 0 14 14"
                        fill="none"
                        className="w-4 h-4 text-white"
                      >
                        <path
                          d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-6 mt-2 shrink-0">
          <button
            onClick={handleSave}
            className="w-full h-14 bg-slate-900 active:bg-slate-800 text-white rounded-2xl font-black text-[15px] uppercase tracking-widest transition-colors shadow-xl shadow-slate-900/20"
          >
            Enregistrer
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function RasSettingsModal({
  onClose,
  inventoryItems,
  rasHiddenItems,
  setRasHiddenItems,
  predefinedItems,
}: {
  onClose: () => void;
  inventoryItems: any[];
  rasHiddenItems: string[];
  setRasHiddenItems: (ids: string[]) => void;
  predefinedItems: any[];
}) {
  const [hiddenIds, setHiddenIds] = useState<string[]>(rasHiddenItems);

  const handleToggle = (id: string) => {
    setHiddenIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    setRasHiddenItems(hiddenIds);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 sm:p-6 bg-slate-900/60 transition-opacity"
      onClick={onClose}
    >
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={(e, info) => {
          if (info.offset.y > 100) onClose();
        }}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-md rounded-t-[32px] sm:rounded-3xl p-6 sm:p-8 flex flex-col max-h-[85vh] shadow-2xl relative"
      >
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 shrink-0" />

        <div className="flex items-center gap-3 mb-6 shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
            <Settings size={20} className="text-slate-600" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">
              Paramètres RAS
            </h3>
            <p className="text-sm font-medium text-slate-500 mt-0.5">
              Visibilité des articles
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 -mx-2 px-2 hide-scrollbar">
          <div className="space-y-3 pb-2">
            {inventoryItems
              .filter((item) => item.quantity > 0)
              .map((item, index) => {
                const info = getArticleInfo(item.name, item.category || "Autres", predefinedItems);
                const IconComponent =
                  info.iconName && ICON_MAP[info.iconName]
                    ? (ICON_MAP[info.iconName] as React.ElementType)
                    : PackageOpen;
                const isVisible = !hiddenIds.includes(item.id);
                const textClass = item.color || "text-slate-800";
                const bgClass = item.bg
                  ? item.bg.replace("100", "50")
                  : "bg-slate-100";
                return (
                  <button
                    key={`${item.id}-${index}`}
                    onClick={() => handleToggle(item.id)}
                    className="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-100 active:bg-slate-50 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${textClass} ${bgClass}`}
                      >
                        {item.iconSvg ? (
                          <div
                            dangerouslySetInnerHTML={{ __html: item.iconSvg }}
                            className="w-5 h-5 text-current"
                          />
                        ) : (
                          <IconComponent size={20} />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{item.name}</p>
                        <p className="text-xs font-medium text-slate-400">
                          {item.unitType === 'grams' || item.unitType === 'liters' ? `${item.usageCount || 0} utilisations` : `${item.quantity} en stock`}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                        isVisible
                          ? "bg-teal-500 text-white"
                          : "bg-slate-100 text-transparent"
                      }`}
                    >
                      <Check size={14} strokeWidth={4} />
                    </div>
                  </button>
                );
              })}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 shrink-0">
          <button
            onClick={handleSave}
            className="w-full py-4 rounded-2xl bg-teal-600 text-white font-bold flex items-center justify-center shadow-lg active:scale-95 transition-all text-sm uppercase tracking-widest"
          >
            Enregistrer
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
