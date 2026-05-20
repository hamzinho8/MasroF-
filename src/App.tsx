import React, { useState, useEffect } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { LocalNotifications } from '@capacitor/local-notifications';
import { Preferences } from '@capacitor/preferences';
import { registerPlugin, Capacitor } from '@capacitor/core';

const WidgetUpdater = registerPlugin<any>('WidgetUpdater');

import {
  ArrowRightLeft as HistoryIcon,

  PieChart,
  Settings as SettingsIcon,
  Wallet as HomeIcon,
  Handshake,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Home from "./components/Home";
import Statistics from "./components/Statistics";
import Credits from "./components/Credits";
import HistoryView from "./components/History";
import SettingsView from "./components/Settings";
import MasrofLogo from "./components/Logo";
import AddTransactionModal from "./components/AddTransactionModal";
import { Transaction, Reminder, CreditEntry, PredefinedItem } from "./types";
import { INITIAL_PREDEFINED_ITEMS } from "./constants";
import { useSwipeable } from "react-swipeable";

type Tab = "home" | "stats" | "history" | "credits" | "settings";

export default function App() {
  const [activeTab, setActiveTab] = useLocalStorage<Tab>("activeTab", "home");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
  const [widgetMode, setWidgetMode] = useLocalStorage<"balance" | "spending">(
    "widgetMode",
    "balance",
  );
  const [widgetBalanceType, setWidgetBalanceType] = useLocalStorage<"cash" | "bank">(
    "widgetBalanceType",
    "cash",
  );
  const [widgetColor, setWidgetColor] = useLocalStorage<
    "default" | "blue" | "purple" | "rose"
  >("widgetColor", "default");
  const [widgetTextColor, setWidgetTextColor] = useLocalStorage<string>("widgetTextColor", "#FFFFFF");
  const [aiNotifications, setAiNotifications] = useLocalStorage("aiNotifications", true);
  const [balanceThreshold, setBalanceThreshold] = useLocalStorage<number | null>("balanceThreshold", 500);
  const [isDarkMode, setIsDarkMode] = useLocalStorage("isDarkMode", false);
  const [currency, setCurrency] = useLocalStorage("currency", "DH");
  const [language, setLanguage] = useLocalStorage<"Français" | "العربية" | "English">(
    "language",
    "Français",
  );

  const translations = {
    Français: {
      accueil: "Accueil",
      historique: "Historique",
      credits: "Crédits",
      options: "Options",
      stats: "Stat",
      trésorerie: "Votre trésorerie, simplifiée",
      owedToMe: "On me doit",
      owedByMe: "Je dois",
    },
    العربية: {
      accueil: "الرئيسية",
      historique: "السجل",
      credits: "ديون",
      options: "الإعدادات",
      stats: "الإحصائيات",
      trésorerie: "خزينتك، بكل بساطة",
      owedToMe: "مستحقات لي",
      owedByMe: "ديون علي",
    },
    English: {
      accueil: "Home",
      historique: "History",
      credits: "Credits",
      options: "Settings",
      stats: "Stats",
      trésorerie: "Your treasury, simplified",
      owedToMe: "Owed to me",
      owedByMe: "I owe",
    },
  };

  const [creditEntries, setCreditEntries] = useLocalStorage<CreditEntry[]>("creditEntries", []);

  const [predefinedItems, setPredefinedItems] = useState<PredefinedItem[]>(
    () => {
      const saved = localStorage.getItem("predefinedItems");
      if (saved) {
        let items = JSON.parse(saved);
        // Migration: Rename Cisset to Sucette and update icons
        let migrated = false;
        items = items.map((item: any) => {
          if (item.name === "Cisset") {
            migrated = true;
            return { ...item, name: "Sucette", iconName: "Candy" };
          }
          if (item.name === "Danone" && item.iconName !== "Milk") {
            migrated = true;
            return { ...item, iconName: "Milk" };
          }
          if (item.name === "Cafe grain" && item.iconName !== "Bean") {
            migrated = true;
            return { ...item, iconName: "Bean" };
          }
          if (
            (item.name === "Gaz" || item.name === "gaz") &&
            item.iconName !== "Cylinder"
          ) {
            migrated = true;
            return { ...item, name: "Gaz", iconName: "Cylinder" };
          }
          if (
            item.name === "Cigarette" &&
            (item.iconName !== "Cigarette" || item.price !== 30)
          ) {
            migrated = true;
            return {
              ...item,
              frequent: true,
              category: "Loisirs",
              iconName: "Cigarette",
              price: 30,
            };
          }
          return item;
        });

        // Ensure Gaz exists if not present (as it's a new default)
        const hasGaz = items.some((item: any) => item.name === "Gaz");
        if (!hasGaz) {
          migrated = true;
          const gazItem = INITIAL_PREDEFINED_ITEMS.find(
            (i) => i.name === "Gaz",
          );
          if (gazItem) items.push(gazItem);
        }

        if (migrated) {
          localStorage.setItem("predefinedItems", JSON.stringify(items));
        }
        return items;
      }
      return INITIAL_PREDEFINED_ITEMS;
    },
  );

  React.useEffect(() => {
    localStorage.setItem("predefinedItems", JSON.stringify(predefinedItems));
  }, [predefinedItems]);

  const t =
    translations[language as keyof typeof translations] ||
    translations["Français"];
  const isRtl = language === "العربية";
  const [reminders, setReminders] = useLocalStorage<Reminder[]>("reminders", []);

  useEffect(() => {
    async function syncNotifications() {
      if (!Capacitor.isNativePlatform()) {
        console.log("Local notifications skipped: not running on native platform.");
        return;
      }
      try {
        let permStatus = await LocalNotifications.checkPermissions();
        if (permStatus.display !== 'granted') {
          permStatus = await LocalNotifications.requestPermissions();
        }

        if (permStatus.display !== 'granted') {
          return;
        }

        try {
          await LocalNotifications.createChannel({
            id: 'reminders',
            name: 'Rappels',
            description: 'Rappels quotidiens',
            importance: 5,
            visibility: 1,
            vibration: true,
          });
        } catch (e) {
          console.error("Error creating channel", e);
        }

        const pending = await LocalNotifications.getPending();
        if (pending.notifications.length > 0) {
          await LocalNotifications.cancel({ notifications: pending.notifications });
        }

        const toSchedule = reminders
          .filter(r => r.enabled)
          .map((r, i) => {
            const [hours, minutes] = r.time.split(':').map(Number);
            
            return {
              title: r.title,
              body: "Il est temps de checker votre trésorerie !",
              id: i + 1,
              channelId: 'reminders',
              smallIcon: 'ic_stat_notification',
              largeIcon: 'ic_launcher',
              schedule: { 
                repeats: true,
                on: { hour: hours, minute: minutes },
                allowWhileIdle: true
              },
            };
          });

        if (toSchedule.length > 0) {
          await LocalNotifications.schedule({ notifications: toSchedule });
        }
      } catch (err) {
        console.error("Local notifications not supported or failed", err);
      }
    }
    syncNotifications();
  }, [reminders]);

  const [balance, setBalance] = useLocalStorage("balance", 0);
  const prevBalanceRef = React.useRef(balance);

  React.useEffect(() => {
    if (
      balanceThreshold !== null &&
      balance < balanceThreshold &&
      prevBalanceRef.current >= balanceThreshold
    ) {
      alert(
        `Attention ! Votre solde (${balance.toFixed(2)} ${currency}) est passé en dessous du seuil configuré (${balanceThreshold} ${currency}).`,
      );
    }
    prevBalanceRef.current = balance;

    async function updateWidget() {
      await Preferences.set({ key: 'widget_balance', value: balance.toString() });
      await Preferences.set({ key: 'widget_currency', value: currency });
      await Preferences.set({ key: 'widget_text_color', value: widgetTextColor });
      if (typeof window !== "undefined") {
        WidgetUpdater.update().catch((err: any) => console.log('WidgetUpdater skip:', err));
      }
    }
    updateWidget();
  }, [balance, balanceThreshold, currency, widgetTextColor]);

  const [bankBalance, setBankBalance] = useLocalStorage("bankBalance", 0);
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>("transactions", []);

  const addTransaction = (
    label: string,
    amount: number,
    type: "INCOME" | "EXPENSE",
    category?: string,
    paidByBank: boolean = false,
    isPureInflow: boolean = false,
  ) => {
    const newTx: Transaction = {
      id: Date.now().toString(),
      label,
      amount,
      type,
      category,
      date: new Date()
        .toLocaleString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })
        .replace(",", ""),
      timestamp: Date.now(),
      paidByBank,
      isPureInflow,
    };

    setTransactions((prev) => [newTx, ...prev]);
    if (type === "INCOME") {
      if (isPureInflow) {
        if (paidByBank) {
          setBankBalance((prev) => prev + amount);
        } else {
          setBalance((prev) => prev + amount);
        }
      } else {
        setBalance((prev) => prev + amount);
        setBankBalance((prev) => prev - amount); // Retrait déduit du compte bancaire
      }
    } else {
      if (paidByBank) {
        setBankBalance((prev) => prev - amount);
      } else {
        setBalance((prev) => prev - amount);
      }
    }
  };

  const deleteTransaction = (id: string) => {
    const tx = transactions.find((t) => t.id === id);
    if (!tx) return;

    if (tx.type === "INCOME") {
      if (tx.isPureInflow) {
        if (tx.paidByBank) {
          setBankBalance((prev) => prev - tx.amount);
        } else {
          setBalance((prev) => prev - tx.amount);
        }
      } else {
        setBalance((prev) => prev - tx.amount);
        setBankBalance((prev) => prev + tx.amount);
      }
    } else {
      if (tx.paidByBank) {
        setBankBalance((prev) => prev + tx.amount);
      } else {
        setBalance((prev) => prev + tx.amount);
      }
    }
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const updateTransaction = (id: string, updatedTx: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((tx) => {
        if (tx.id === id) {
          const result = { ...tx, ...updatedTx };
          if (updatedTx.amount !== undefined) {
            const diff = updatedTx.amount - tx.amount;
            if (tx.type === "INCOME") {
              if (tx.isPureInflow) {
                if (tx.paidByBank) setBankBalance((b) => b + diff);
                else setBalance((b) => b + diff);
              } else {
                setBalance((b) => b + diff);
                setBankBalance((b) => b - diff);
              }
            } else {
              if (tx.paidByBank) setBankBalance((b) => b - diff);
              else setBalance((b) => b - diff);
            }
          }
          return result;
        }
        return tx;
      }),
    );
  };

  const resetTransactions = () => {
    setTransactions([]);
    setBalance(0);
    setBankBalance(0);
  };

  const openModal = (type: "INCOME" | "EXPENSE") => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCreditSettlement = (id: string, settleSource: 'compte' | 'poche' = 'poche') => {
    const entry = creditEntries.find((e) => e.id === id);
    if (!entry) return;

    // Add corresponding transaction
    const paidByBank = settleSource === "compte";
    if (entry.type === "OWE_ME") {
      // Someone paid me back (Income)
      const label =
        language === "العربية"
          ? `استرداد مستحق: ${entry.name}`
          : `Remboursement : ${entry.name}`;
      addTransaction(label, entry.amount, "INCOME", t.owedToMe, paidByBank, true);
    } else {
      // I paid someone back (Expense)
      const label =
        language === "العربية"
          ? `تسديد دين: ${entry.name}`
          : `Paiement dette : ${entry.name}`;
      addTransaction(label, entry.amount, "EXPENSE", t.owedByMe, paidByBank, true);
    }

    // Remove credit entry
    setCreditEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <Home
            balance={balance}
            bankBalance={bankBalance}
            onAddBankBalance={(amount) => {
              setBankBalance((prev) => prev + amount);
              const tx = {
                id: Date.now().toString(),
                label:
                  language === "Français"
                    ? "Salaire / Dépôt"
                    : language === "العربية"
                      ? "راتب / إيداع"
                      : "Salary / Deposit",
                amount,
                type: "INCOME",
                category: "Banque",
                date: new Date()
                  .toLocaleString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                  .replace(",", ""),
                timestamp: Date.now(),
                paidByBank: true,
                isPureInflow: true,
              } as Transaction;
              setTransactions((prev) => [tx, ...prev]);
            }}
            transactions={transactions}
            onAddClick={openModal}
            onViewAll={() => setActiveTab("history")}
            onDelete={deleteTransaction}
            onEdit={(tx) => updateTransaction(tx.id, tx)}
            widgetMode={widgetMode}
            widgetBalanceType={widgetBalanceType}
            widgetColor={widgetColor}
            language={language}
            currency={currency}
            creditEntries={creditEntries}
            onNavigateToCredits={() => setActiveTab("credits")}
          />
        );
      case "stats":
        return (
          <Statistics
            transactions={transactions}
            currency={currency}
            language={language}
            isDarkMode={isDarkMode}
          />
        );
      case "credits":
        return (
          <Credits
            language={language}
            currency={currency}
            entries={creditEntries}
            setEntries={setCreditEntries}
            onSettle={handleCreditSettlement}
            transactions={transactions}
            onAddClick={openModal}
            onAddTransaction={addTransaction}
            onAddBankBalance={(amount) => {
              setBankBalance((prev) => prev + amount);
              const tx = {
                id: Date.now().toString(),
                label:
                  language === "Français"
                    ? "Salaire / Dépôt"
                    : language === "العربية"
                      ? "راتب / إيداع"
                      : "Salary / Deposit",
                amount,
                type: "INCOME",
                date: new Intl.DateTimeFormat("fr-FR", {
                  day: "2-digit",
                  month: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })
                  .format(new Date())
                  .replace(",", ""),
                timestamp: Date.now(),
                paidByBank: true,
                isPureInflow: true,
              } as Transaction;
              setTransactions((prev) => [tx, ...prev]);
            }}
          />
        );
      case "history":
        return (
          <HistoryView
            transactions={transactions}
            language={language}
            currency={currency}
            onDelete={deleteTransaction}
            onUpdate={updateTransaction}
            onAddClick={openModal}
          />
        );
      case "settings":
        return (
          <SettingsView
            widgetMode={widgetMode}
            onWidgetModeChange={setWidgetMode}
            widgetBalanceType={widgetBalanceType}
            onWidgetBalanceTypeChange={setWidgetBalanceType}
            widgetColor={widgetColor}
            onWidgetColorChange={setWidgetColor}
            widgetTextColor={widgetTextColor}
            onWidgetTextColorChange={setWidgetTextColor}
            onResetTransactions={resetTransactions}
            aiNotifications={aiNotifications}
            onAiNotificationsChange={setAiNotifications}
            isDarkMode={isDarkMode}
            onDarkModeChange={setIsDarkMode}
            currency={currency}
            onCurrencyChange={setCurrency}
            language={language}
            onLanguageChange={(lang) => setLanguage(lang as any)}
            reminders={reminders}
            onRemindersChange={setReminders}
            transactions={transactions}
            predefinedItems={predefinedItems}
            onPredefinedItemsChange={setPredefinedItems}
            balanceThreshold={balanceThreshold}
            onBalanceThresholdChange={setBalanceThreshold}
          />
        );
      default:
        return (
          <Home
            balance={balance}
            bankBalance={bankBalance}
            onAddBankBalance={(amount) => {
              setBankBalance((prev) => prev + amount);
              const tx = {
                id: Date.now().toString(),
                label:
                  language === "Français"
                    ? "Salaire / Dépôt"
                    : language === "العربية"
                      ? "راتب / إيداع"
                      : "Salary / Deposit",
                amount,
                type: "INCOME",
                category: "Banque",
                date: new Date()
                  .toLocaleString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                  .replace(",", ""),
                timestamp: Date.now(),
                paidByBank: true,
                isPureInflow: true,
              } as Transaction;
              setTransactions((prev) => [tx, ...prev]);
            }}
            transactions={transactions}
            onAddClick={openModal}
            onViewAll={() => setActiveTab("history")}
            onDelete={deleteTransaction}
            onEdit={(tx) => updateTransaction(tx.id, tx)}
            widgetMode={widgetMode}
            widgetBalanceType={widgetBalanceType}
            widgetColor={widgetColor}
            language={language}
            currency={currency}
            creditEntries={creditEntries}
            onNavigateToCredits={() => setActiveTab("credits")}
          />
        );
    }
  };

  const TABS: Tab[] = ["home", "history", "credits", "stats", "settings"];
  
  const handleSwipe = (dir: "Left" | "Right") => {
    const currentIndex = TABS.indexOf(activeTab);
    if (dir === "Left") {
      const nextIndex = isRtl ? currentIndex - 1 : currentIndex + 1;
      if (nextIndex >= 0 && nextIndex < TABS.length) setActiveTab(TABS[nextIndex]);
    } else if (dir === "Right") {
      const prevIndex = isRtl ? currentIndex + 1 : currentIndex - 1;
      if (prevIndex >= 0 && prevIndex < TABS.length) setActiveTab(TABS[prevIndex]);
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleSwipe("Left"),
    onSwipedRight: () => handleSwipe("Right"),
    preventScrollOnSwipe: false,
    trackMouse: false
  });

  return (
    <div
      {...swipeHandlers}
      dir={isRtl ? "rtl" : "ltr"}
      className={`h-screen ${isDarkMode ? "bg-slate-900" : "bg-slate-50"} flex flex-col max-w-md mx-auto shadow-2xl relative overflow-hidden font-sans transition-colors duration-500`}
    >
      {/* Header & Navigation */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${isDarkMode ? "bg-slate-900/95" : "bg-white/95"} backdrop-blur-md border-b ${isDarkMode ? "border-slate-800" : "border-slate-100"}`}
      >
        {/* Global Navigation Tabs (Compact & Artistic) */}
        <nav className="flex items-center justify-around px-2 pb-5 pt-3 max-w-full mx-auto gap-1">
          <TabButton
            active={activeTab === "home"}
            onClick={() => setActiveTab("home")}
            icon={<HomeIcon size={28} strokeWidth={2.5} />}
            color="teal"
            isDarkMode={isDarkMode}
          />
          <TabButton
            active={activeTab === "history"}
            onClick={() => setActiveTab("history")}
            icon={<HistoryIcon size={28} strokeWidth={2.5} />}
            color="rose"
            isDarkMode={isDarkMode}
          />
          <TabButton
            active={activeTab === "credits"}
            onClick={() => setActiveTab("credits")}
            icon={<Handshake size={28} strokeWidth={2.5} />}
            color="credits"
            isDarkMode={isDarkMode}
          />
          <TabButton
            active={activeTab === "stats"}
            onClick={() => setActiveTab("stats")}
            icon={<PieChart size={28} strokeWidth={2.5} />}
            color="emerald"
            isDarkMode={isDarkMode}
          />
          <TabButton
            active={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
            icon={<SettingsIcon size={28} strokeWidth={2.5} />}
            color="slate"
            isDarkMode={isDarkMode}
          />
        </nav>
      </header>

      {/* Main Container */}
      <main
        className={`flex-1 rounded-t-[32px] p-6 shadow-even transition-colors relative z-10 overflow-y-auto ${isDarkMode ? "bg-slate-900 shadow-none" : "bg-white"}`}
      >
        <div className="pb-32">
          {" "}
          {/* Increased padding for the 3-dots menu space at the end of lists */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addTransaction}
        initialType={modalType}
        currency={currency}
        predefinedItems={predefinedItems}
      />
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  isDarkMode,
  color = "teal",
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  isDarkMode: boolean;
  color?: "teal" | "indigo" | "rose" | "slate" | "credits" | "emerald";
}) {
  const getActiveColors = () => {
    switch (color) {
      case "emerald":
        return {
          text: "text-emerald-600",
          bg: "bg-emerald-500/10",
          dot: "bg-emerald-500",
          glow: "rgba(16,185,129,0.3)",
        };
      case "indigo":
        return {
          text: "text-indigo-600",
          bg: "bg-indigo-500/10",
          dot: "bg-indigo-500",
          glow: "rgba(79,70,229,0.3)",
        };
      case "rose":
        return {
          text: "text-rose-600",
          bg: "bg-rose-500/10",
          dot: "bg-rose-500",
          glow: "rgba(225,29,72,0.3)",
        };
      case "credits":
        return {
          text: "text-indigo-600",
          bg: "bg-indigo-500/5",
          dot: "bg-amber-500",
          glow: "rgba(79,70,229,0.2)",
          iconColor: "#4F46E5",
        };
      case "slate":
        return {
          text: "text-slate-700",
          bg: "bg-slate-500/10",
          dot: "bg-slate-500",
          glow: "rgba(107,114,128,0.3)",
        };
      default:
        return {
          text: "text-teal-600",
          bg: "bg-teal-500/10",
          dot: "bg-teal-500",
          glow: "rgba(54,162,146,0.3)",
        };
    }
  };

  const colors = getActiveColors();

  return (
    <button
      onClick={onClick}
      className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-3 transition-all duration-300 relative rounded-2xl group ${active ? colors.text + " scale-105" : isDarkMode ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-600"}`}
    >
      {active && (
        <motion.div
          layoutId="activeTabBg"
          className={`absolute inset-0 ${colors.bg} rounded-2xl -z-10 shadow-sm`}
          initial={false}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      <div
        className={`transition-transform duration-300 group-hover:scale-110 ${active ? `scale-110 drop-shadow-[0_0_12px_${colors.glow}]` : ""}`}
      >
        {active && (colors as any).iconColor ? (
          <div style={{ color: (colors as any).iconColor }}>{icon}</div>
        ) : (
          icon
        )}
      </div>
      {active && (
        <motion.div
          layoutId="activeTabDot"
          className={`w-1.5 h-1.5 ${colors.dot} rounded-full absolute -bottom-1 shadow-sm`}
        />
      )}
    </button>
  );
}
