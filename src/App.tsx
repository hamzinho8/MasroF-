import React, { useState, useEffect } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { LocalNotifications } from '@capacitor/local-notifications';
import { Preferences } from '@capacitor/preferences';
import { registerPlugin, Capacitor } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app';
import { importDataFromFile, autoBackup } from "./utils/backup";

const WidgetUpdater = registerPlugin<any>('WidgetUpdater');

import {
  ArrowRightLeft as HistoryIcon,
  PieChart,
  Settings as SettingsIcon,
  Wallet as HomeIcon,
  Handshake,
  Package,
  PackageOpen,
  Landmark
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Home from "./components/Home";
import Statistics from "./components/Statistics";
import Credits from "./components/Credits";
import Bank from "./components/Bank";
import HistoryView from "./components/History";
import SettingsView from "./components/Settings";
import { scheduleBackupReminder } from "./utils/notifications";
import LockScreen from "./components/LockScreen";
import Inventory from "./components/Inventory"; // newly added
import MasrofLogo from "./components/Logo";
import AddTransactionModal from "./components/AddTransactionModal";
import { Transaction, Reminder, CreditEntry, PredefinedItem, InventoryItem, ShoppingListItem } from "./types";
import { INITIAL_PREDEFINED_ITEMS } from "./constants";
import { useSwipeable } from "react-swipeable";

type Tab = "home" | "stats" | "history" | "credits" | "bank" | "inventory" | "settings";

export default function App() {
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    setIsInitializing(false);

    // Setup auto-backup on app going to background
    if (Capacitor.isNativePlatform()) {
      const listener = CapacitorApp.addListener('appStateChange', ({ isActive }) => {
        if (!isActive) {
          autoBackup();
        }
      });
      return () => {
        listener.then(l => l.remove()).catch(() => {});
      };
    }
  }, []);

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
  const [balanceThreshold, setBalanceThreshold] = useLocalStorage<number | null>("balanceThreshold", 50);
  const [bankBalanceThreshold, setBankBalanceThreshold] = useLocalStorage<number | null>("bankBalanceThreshold", 500);
  const [inventoryAlertThreshold, setInventoryAlertThreshold] = useLocalStorage<number | null>("inventoryAlertThreshold", 3);
  const [budgetAlertThreshold, setBudgetAlertThreshold] = useLocalStorage<number | null>("budgetAlertThreshold", 90);
  const [backupAlertInterval, setBackupAlertInterval] = useLocalStorage<number | null>("backupAlertInterval", 30);
  const [isDarkMode, setIsDarkMode] = useLocalStorage("isDarkMode", false);
  const [currency, setCurrency] = useLocalStorage("currency", "DH");
  const [appPin, setAppPin] = useLocalStorage<string | null>("appPin", null);
  const [appBiometric, setAppBiometric] = useLocalStorage<boolean>("appBiometric", true);
  const [isLocked, setIsLocked] = useState<boolean>(true);

  useEffect(() => {
    if (!appPin && !appBiometric) {
      setIsLocked(false);
    }
  }, [appPin, appBiometric]);

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
  const [inventoryItems, setInventoryItems] = useLocalStorage<InventoryItem[]>("inventoryItems", []);
  const [shoppingList, setShoppingList] = useLocalStorage<ShoppingListItem[]>("shoppingList", []);

  const [predefinedItems, setPredefinedItems] = useState<PredefinedItem[]>(
    () => {
      const saved = localStorage.getItem("predefinedItems");
      if (saved) {
        let items = JSON.parse(saved);
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
            item.name.toLowerCase() === "gaz" &&
            (item.iconName !== "Cylinder" || item.category !== "Logement")
          ) {
            migrated = true;
            return { ...item, name: "Gaz", iconName: "Cylinder", category: "Logement" };
          }
          if (
            (item.name.toLowerCase() === "bampers" || item.name.toLowerCase() === "bambers") && 
            (item.category !== "Sanitaire" || item.name !== "Bambers" || item.price !== 4.5 || !item.frequent)
          ) {
            migrated = true;
            return { ...item, name: "Bambers", category: "Sanitaire", price: 4.5, iconName: "Baby", frequent: true };
          }
          if (
            ["Fairy", "Tide", "Champo", "Aide Famille", "Inconnu"].includes(item.name) && !item.frequent
          ) {
            migrated = true;
            return { ...item, frequent: true };
          }
          if (
            item.name === "Cigarette" &&
            item.iconName !== "Cigarette"
          ) {
            migrated = true;
            return {
              ...item,
              frequent: true,
              category: "Loisirs",
              iconName: "Cigarette",
            };
          }
          return item;
        });

        const ensureItem = (name: string) => {
          const hasItem = items.some((item: any) => item.name === name);
          if (!hasItem) {
            migrated = true;
            const targetItem = INITIAL_PREDEFINED_ITEMS.find(
              (i) => i.name === name,
            );
            if (targetItem) items.push(targetItem);
          }
        };

        ensureItem("Gaz");
        ensureItem("Location");
        ensureItem("Électricité");
        ensureItem("Produits Sanitaires");
        ensureItem("Aide Famille");
        // Sanitaire items
        ensureItem("Savon");
        ensureItem("Fairy");
        ensureItem("Tide");
        ensureItem("Champo");
        ensureItem("Bambers");
        // Devoir items
        ensureItem("Parents");
        ensureItem("Enfants");
        ensureItem("Femme");
        ensureItem("Inconnu");

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
  const [categoryBudgets, setCategoryBudgets] = useLocalStorage<Record<string, number>>("categoryBudgets", {});

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
          const channelId = `reminders_default_v1`;

          await LocalNotifications.createChannel({
            id: channelId,
            name: 'Rappels',
            description: 'Rappels réguliers',
            importance: 5,
            visibility: 1,
            vibration: true
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
            
            let iconColor = '#0f1725'; // Default dark color 

            if (r.type === 'ACHAT') {
              iconColor = '#e11d48'; // rose-600
            } else if (r.type === 'RETRAIT') {
              iconColor = '#0d9488'; // teal-600
            }
            
            const channelId = `reminders_default_v1`;

            return {
              title: r.title,
              body: "Il est temps de checker votre trésorerie !",
              id: i + 1,
              channelId: channelId,
              smallIcon: "ic_notification",
              iconColor,
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

    if (Capacitor.isNativePlatform()) {
      let listenerRemoved = false;
      const listener = LocalNotifications.addListener('localNotificationReceived', (notification) => {
         // Do anything else needed
      });
      return () => {
         listenerRemoved = true;
         listener.then(l => l.remove()).catch(() => {});
      };
    }
  }, [reminders]);

  const [balance, setBalance] = useLocalStorage("balance", 0);
  const [bankBalance, setBankBalance] = useLocalStorage("bankBalance", 0);
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>("transactions", []);
  const prevBalanceRef = React.useRef(balance);

  const alertedBankRef = React.useRef(false);
  const alertedPocketRef = React.useRef(false);
  const alertedInventoryRef = React.useRef<Record<string, boolean>>({});
  const alertedCategoriesRef = React.useRef<Record<string, boolean>>({});
  const lastBackupAlertRef = React.useRef(Date.now());

  React.useEffect(() => {
    // 1. Bank Balance == 500 DH
    if (bankBalanceThreshold !== null && bankBalance <= bankBalanceThreshold && !alertedBankRef.current) {
        console.warn(`Alarme: Votre solde du compte bancaire a atteint le seuil critique (${bankBalance} ${currency}).`);
        alertedBankRef.current = true;
    } else if (bankBalanceThreshold !== null && bankBalance > bankBalanceThreshold) {
        alertedBankRef.current = false;
    }

    // 2. Pocket Balance == 50 DH
    if (balanceThreshold !== null && balance <= balanceThreshold && !alertedPocketRef.current) {
        console.warn(`Alarme: Le montant dans votre poche a atteint le seuil critique (${balance} ${currency}).`);
        alertedPocketRef.current = true;
    } else if (balanceThreshold !== null && balance > balanceThreshold) {
        alertedPocketRef.current = false;
    }

    // 3. Inventory Item == 3
    inventoryItems.forEach((item: any) => {
        if (inventoryAlertThreshold !== null && item.quantity === inventoryAlertThreshold && !alertedInventoryRef.current[item.id]) {
            console.warn(`Alarme Stock: La quantité de l'article "${item.name}" est ${inventoryAlertThreshold}.`);
            alertedInventoryRef.current[item.id] = true;
        } else if (inventoryAlertThreshold !== null && item.quantity !== inventoryAlertThreshold) {
            alertedInventoryRef.current[item.id] = false;
        }
    });

  }, [bankBalance, balance, inventoryItems, currency, bankBalanceThreshold, balanceThreshold, inventoryAlertThreshold]);

  React.useEffect(() => {
    // 4. Category Budget >= 90%
    const now = new Date();
    const startOfPeriod = new Date();
    startOfPeriod.setDate(1);
    startOfPeriod.setHours(0, 0, 0, 0);

    const expenses = transactions.filter(t => {
      const isCredit = (t.category && ["on me doit","je dois","مستحقات لي","ديون علي","owed to me","i owe","loans","debts","crédit +","crédit --"].includes(t.category.toLowerCase()));
      const isExpense = (t.type === 'EXPENSE' || (t.type as any) === 'expense') && !isCredit;
      return isExpense && t.timestamp >= startOfPeriod.getTime();
    });

    const categoryTotals: Record<string, number> = {};
    expenses.forEach(t => {
      let category = t.category || 'Autres';
      if (category === 'Food') category = 'Nourriture';
      else if (category === 'Leisure') category = 'Loisirs';
      else if (category === 'Others') category = 'Autres';
      categoryTotals[category] = (categoryTotals[category] || 0) + t.amount;
    });

    Object.entries(categoryBudgets).forEach(([cat, limit]) => {
      const total = categoryTotals[cat] || 0;
      const budgetThresholdRatio = budgetAlertThreshold !== null ? budgetAlertThreshold / 100 : 0.9;
      if (budgetAlertThreshold !== null && total >= limit * budgetThresholdRatio && !alertedCategoriesRef.current[cat]) {
         console.warn(`Alarme Budget: Vous avez atteint ou dépassé ${budgetAlertThreshold}% du budget pour la catégorie "${cat}" (${total.toFixed(2)} / ${limit} ${currency}).`);
         alertedCategoriesRef.current[cat] = true;
      } else if (budgetAlertThreshold !== null && total < limit * budgetThresholdRatio) {
         alertedCategoriesRef.current[cat] = false;
      }
    });
  }, [transactions, categoryBudgets, currency, budgetAlertThreshold]);

  React.useEffect(() => {
    // 5. Backup Alarm
    if (!backupAlertInterval) return;
    
    const checkBackupInterval = setInterval(() => {
      const hasUnbacked = localStorage.getItem('hasUnbackedChanges') === 'true';
      // Trigger if unbacked changes exist and interval passed since last alert
      if (hasUnbacked && Date.now() - lastBackupAlertRef.current > backupAlertInterval * 60 * 1000) {
          console.warn("Alarme Sauvegarde: Vous avez des modifications non enregistrées. Pensez à faire une sauvegarde de vos données !");
          lastBackupAlertRef.current = Date.now();
      }
    }, 60000); // check every minute

    return () => clearInterval(checkBackupInterval);
  }, [backupAlertInterval]);

  React.useEffect(() => {
    if (
      balanceThreshold !== null &&
      balance < balanceThreshold &&
      prevBalanceRef.current >= balanceThreshold
    ) {
      console.warn(
        `Attention ! Votre solde (${balance.toFixed(2)} ${currency}) est passé en dessous du seuil configuré (${balanceThreshold} ${currency}).`,
      );
    }
    prevBalanceRef.current = balance;

    async function updateWidget() {
      await Preferences.set({ key: 'widget_balance', value: balance.toString() });
      await Preferences.set({ key: 'widget_currency', value: currency });
      await Preferences.set({ key: 'widget_text_color', value: widgetTextColor });

      const alarms: string[] = [];
      const alarmColor = "#FCA5A5"; // lighter red for high priority alarms on dark bg
      const warnColor = "#FDBA74"; // lighter orange for warnings like stock on dark bg

      if (bankBalanceThreshold !== null && bankBalance <= bankBalanceThreshold) {
        alarms.push(`<b><font color="${alarmColor}">🏦 ${bankBalance.toFixed(2)} ${currency}</font></b>`);
      }

      if (balanceThreshold !== null && balance <= balanceThreshold) {
        alarms.push(`<b><font color="${alarmColor}">💵 ${balance.toFixed(2)} ${currency}</font></b>`);
      }

      if (inventoryAlertThreshold !== null) {
        inventoryItems.forEach(item => {
          if (item.quantity <= inventoryAlertThreshold) {
            alarms.push(`<b><font color="${warnColor}">📦 Stock bas: ${item.name} (${item.quantity})</font></b>`);
          }
        });
      }

      if (budgetAlertThreshold !== null) {
        const categoryTotals: Record<string, number> = {};
        transactions.forEach(t => {
           if (t.type === 'EXPENSE' && t.category) {
             categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
           }
        });
        Object.entries(categoryBudgets).forEach(([cat, limit]) => {
           const total = categoryTotals[cat] || 0;
           if (total >= limit * (budgetAlertThreshold / 100)) {
             alarms.push(`<b><font color="${alarmColor}">📊 Budget dépassé: ${cat}</font></b>`);
           }
        });
      }

      const newsItems: string[] = [...alarms];

      const UNICODE_ICONS: Record<string, string> = {
          Utensils: "🍽️", ShoppingBag: "🛍️", Car: "🚗", Gamepad2: "🎮", MoreHorizontal: "⋯",
          Coffee: "☕", Milk: "🥛", Wheat: "🌾", Box: "📦", Cookie: "🍪", Droplets: "💧",
          CupSoda: "🥤", Candy: "🍬", Zap: "⚡", CircleDot: "🎯", Soup: "🥣", TrainFront: "🚆",
          Fuel: "⛽", Flame: "🔥", Tv: "📺", Search: "🔍", Baby: "👶", Bean: "🫘", Cylinder: "🛢️",
          Cigarette: "🚬", Home: "🏠", HeartPulse: "💓", Heart: "❤️", Bath: "🛁", Lightbulb: "💡",
          Users: "👥", Sparkles: "✨", Shirt: "👕", Wind: "💨", HelpCircle: "❓", User: "👤",
          WashingMachine: "🧼"
      };

      (shoppingList || []).forEach((s) => {
        let colorHex = "#64748B"; // slate
        
        switch (s.category) {
            case "Nourriture": colorHex = "#0D9488"; break;
            case "Logement": colorHex = "#4F46E5"; break;
            case "Transport": colorHex = "#0284C7"; break;
            case "Sanitaire": colorHex = "#E11D48"; break;
            case "Shopping": colorHex = "#9333EA"; break;
            case "Loisirs": colorHex = "#D97706"; break;
            case "Devoir": colorHex = "#EA580C"; break;
            default: colorHex = "#475569"; break;
        }
        
        const iconStr = s.iconName ? (UNICODE_ICONS[s.iconName] || "📦") : "📦";
        newsItems.push(`<b><font color="${colorHex}">${iconStr} ${s.name}</font></b>`);
      });

      let newsHtml = newsItems.join("&nbsp;&nbsp;•&nbsp;&nbsp;");
      if (!newsHtml) {
          newsHtml = "<i>Aucun achat programmé.</i>";
      }
      
      await Preferences.set({ key: 'widget_news_html', value: newsHtml });

      if (typeof window !== "undefined") {
        WidgetUpdater.update().catch((err: any) => console.log('WidgetUpdater skip:', err));
      }
    }
    updateWidget();
  }, [balance, balanceThreshold, bankBalance, bankBalanceThreshold, inventoryItems, inventoryAlertThreshold, transactions, categoryBudgets, budgetAlertThreshold, currency, widgetTextColor, reminders, shoppingList]);

  const markUnbackedChanges = () => {
    localStorage.setItem('hasUnbackedChanges', 'true');
    scheduleBackupReminder();
  };

  const addTransaction = (
    label: string,
    amount: number,
    type: "INCOME" | "EXPENSE",
    category?: string,
    paidByBank: boolean = false,
    isPureInflow: boolean = false,
    inventoryData?: { quantity: number; color: string; bg: string; iconName: string }
  ) => {
    markUnbackedChanges();
    const newTx: Transaction = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
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

    if (inventoryData) {
      setInventoryItems((prev) => [
        {
          id: Date.now().toString() + Math.random().toString(36).substring(2, 9) + "_inv", // ensure unique ID
          name: label,
          quantity: inventoryData.quantity,
          addedAt: Date.now(),
          history: [],
          color: inventoryData.color,
          bg: inventoryData.bg,
          iconName: inventoryData.iconName,
        },
        ...prev,
      ]);
    }

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
    markUnbackedChanges();
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
    markUnbackedChanges();
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

  const [modalIsShoppingMode, setModalIsShoppingMode] = useState(false);
  const [modalInitialLabel, setModalInitialLabel] = useState('');
  const [modalInitialCategory, setModalInitialCategory] = useState('');
  const [modalInitialAmount, setModalInitialAmount] = useState<number | undefined>(undefined);
  const [shoppingItemSelectedId, setShoppingItemSelectedId] = useState<string | null>(null);

  const openModal = (type: "INCOME" | "EXPENSE") => {
    setModalType(type);
    setModalIsShoppingMode(false);
    setModalInitialLabel('');
    setModalInitialCategory('');
    setModalInitialAmount(undefined);
    setShoppingItemSelectedId(null);
    setIsModalOpen(true);
  };

  const openShoppingListAddModal = () => {
    setModalType("EXPENSE");
    setModalIsShoppingMode(true);
    setModalInitialLabel('');
    setModalInitialCategory('');
    setModalInitialAmount(undefined);
    setShoppingItemSelectedId(null);
    setIsModalOpen(true);
  };

  const openShoppingListCheckoutModal = (item: ShoppingListItem) => {
    setModalType("EXPENSE");
    setModalIsShoppingMode(false);
    setModalInitialLabel(item.name);
    setModalInitialCategory(item.category);
    setModalInitialAmount(item.expectedPrice);
    setShoppingItemSelectedId(item.id);
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

  const handleAddBankBalance = (amount: number) => {
    setBankBalance((prev) => prev + amount);
    const tx = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
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
  };

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <Home
            balance={balance}
            bankBalance={bankBalance}
            onAddBankBalance={handleAddBankBalance}
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
            reminders={reminders}
            shoppingList={shoppingList}
          />
        );
      case "stats":
        return (
          <Statistics
            transactions={transactions}
            currency={currency}
            language={language}
            isDarkMode={isDarkMode}
            categoryBudgets={categoryBudgets}
            onUpdateBudget={(cat, limit) => setCategoryBudgets(prev => ({...prev, [cat]: limit}))}
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
            onAddBankBalance={handleAddBankBalance}
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
      case "bank":
        return (
          <Bank
            language={language}
            currency={currency}
            transactions={transactions}
            onAddClick={(type) => openModal(type)}
            onAddBankBalance={handleAddBankBalance}
          />
        );
      case "inventory":
        return (
          <Inventory
            items={inventoryItems}
            onItemsChange={setInventoryItems}
            language={language}
            shoppingList={shoppingList}
            onShoppingListChange={setShoppingList}
            onAddShoppingItem={openShoppingListAddModal}
            onCheckoutShoppingItem={openShoppingListCheckoutModal}
            currency={currency}
            predefinedItems={predefinedItems}
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
            bankBalanceThreshold={bankBalanceThreshold}
            onBankBalanceThresholdChange={setBankBalanceThreshold}
            inventoryAlertThreshold={inventoryAlertThreshold}
            onInventoryAlertThresholdChange={setInventoryAlertThreshold}
            budgetAlertThreshold={budgetAlertThreshold}
            onBudgetAlertThresholdChange={setBudgetAlertThreshold}
            backupAlertInterval={backupAlertInterval}
            onBackupAlertIntervalChange={setBackupAlertInterval}
            appPin={appPin}
            onAppPinChange={setAppPin}
            appBiometric={appBiometric}
            onAppBiometricChange={setAppBiometric}
          />
        );
      default:
        return (
          <Home
            balance={balance}
            bankBalance={bankBalance}
            onAddBankBalance={handleAddBankBalance}
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
            reminders={reminders}
            shoppingList={shoppingList}
          />
        );
    }
  };

  const TABS: Tab[] = ["home", "history", "bank", "credits", "stats", "inventory", "settings"];
  
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

  if (isInitializing) {
    return (
      <div className={`h-screen ${isDarkMode ? "bg-slate-900 text-slate-200" : "bg-slate-50 text-slate-500"} flex items-center justify-center`}>
         <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-8 h-8 border-4 border-t-transparent border-[#2D8B96] rounded-full" />
      </div>
    );
  }

  if (isLocked && (appPin || appBiometric)) {
    return (
      <div className={`h-screen ${isDarkMode ? "bg-slate-900" : "bg-slate-50"} flex flex-col max-w-md mx-auto relative overflow-hidden font-sans`}>
        <LockScreen 
          correctPin={appPin || ""} 
          allowBiometric={appBiometric}
          onUnlock={() => setIsLocked(false)} 
        />
      </div>
    );
  }

  return (
    <div
      {...swipeHandlers}
      dir={isRtl ? "rtl" : "ltr"}
      className={`h-screen ${isDarkMode ? "bg-slate-900" : "bg-slate-50"} flex flex-col max-w-md mx-auto shadow-2xl relative overflow-hidden font-sans transition-colors duration-500`}
    >
      {/* Header & Navigation */}
      <header
        className={`sticky top-0 z-50 transition-colors duration-300 ${isDarkMode ? "bg-slate-900" : "bg-white"} border-b ${isDarkMode ? "border-slate-800" : "border-slate-100"}`}
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
            active={activeTab === "bank"}
            onClick={() => setActiveTab("bank")}
            icon={<Landmark size={28} strokeWidth={2.5} />}
            color="teal"
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
            active={activeTab === "inventory"}
            onClick={() => setActiveTab("inventory")}
            icon={<PackageOpen size={28} strokeWidth={2.5} />}
            color="indigo"
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
          {renderContent()}
        </div>
      </main>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={(label, amount, type, category, paidByBank, isPureInflow, inventoryData) => {
          if (modalIsShoppingMode) {
             const newItem: ShoppingListItem = {
               id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
               name: label,
               category: category || 'Autres',
               expectedPrice: amount,
               addedAt: Date.now(),
               iconName: inventoryData?.iconName || 'ShoppingBag'
             };
             setShoppingList(prev => [...prev, newItem]);
          } else {
             addTransaction(label, amount, type, category, paidByBank, isPureInflow, inventoryData);
             if (shoppingItemSelectedId) {
                setShoppingList(prev => prev.filter(i => i.id !== shoppingItemSelectedId));
             }
          }
        }}
        initialType={modalType}
        currency={currency}
        predefinedItems={predefinedItems}
        isShoppingMode={modalIsShoppingMode}
        initialLabel={modalInitialLabel}
        initialAmount={modalInitialAmount}
        initialCategory={modalInitialCategory}
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
