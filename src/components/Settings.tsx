import React, { useState } from "react";
import {
  Bell,
  Shield,
  Moon,
  HelpCircle,
  LogOut,
  Download,
  CreditCard,
  ChevronRight,
  Sparkles,
  Trash2,
  AlertTriangle,
  X,
  Brain,
  Check,
  Plus,
  Clock,
  AlarmClock,
  ArrowDownRight,
  Calendar as CalendarIcon,
  ShoppingBag,
  ArrowDownToLine,
  Coins,
  Settings2,
  Music,
  Play,
  Layout,
  Palette,
  Smartphone,
  Upload
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import MasrofLogo from "./Logo";
import { Reminder, PredefinedItem } from "../types";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { ICON_MAP } from "../constants";
import { importDataFromFile, exportDataToFile } from "../utils/backup";
import {
  Utensils,
  Car,
  Gamepad2,
  MoreHorizontal,
} from "lucide-react";

interface SettingsProps {
  widgetMode: "balance" | "spending";
  onWidgetModeChange: (mode: "balance" | "spending") => void;
  widgetBalanceType: "cash" | "bank";
  onWidgetBalanceTypeChange: (type: "cash" | "bank") => void;
  widgetColor: "default" | "blue" | "purple" | "rose";
  onWidgetColorChange: (color: "default" | "blue" | "purple" | "rose") => void;
  widgetTextColor: string;
  onWidgetTextColorChange: (color: string) => void;
  onResetTransactions: () => void;
  aiNotifications: boolean;
  onAiNotificationsChange: (enabled: boolean) => void;
  isDarkMode: boolean;
  onDarkModeChange: (enabled: boolean) => void;
  currency: string;
  onCurrencyChange: (currency: string) => void;
  language: string;
  onLanguageChange: (lang: string) => void;
  reminders: Reminder[];
  onRemindersChange: (reminders: Reminder[]) => void;
  transactions: any[];
  predefinedItems: PredefinedItem[];
  onPredefinedItemsChange: (items: PredefinedItem[]) => void;
  balanceThreshold: number | null;
  onBalanceThresholdChange: (threshold: number | null) => void;
  bankBalanceThreshold: number | null;
  onBankBalanceThresholdChange: (threshold: number | null) => void;
  inventoryAlertThreshold: number | null;
  onInventoryAlertThresholdChange: (threshold: number | null) => void;
  budgetAlertThreshold: number | null;
  onBudgetAlertThresholdChange: (threshold: number | null) => void;
  backupAlertInterval: number | null;
  onBackupAlertIntervalChange: (interval: number | null) => void;
  appPin: string | null;
  onAppPinChange: (pin: string | null) => void;
  appBiometric: boolean;
  onAppBiometricChange: (enabled: boolean) => void;
}

const CATEGORIES = [
  { id: "Nourriture", icon: <Utensils size={18} /> },
  { id: "Shopping", icon: <ShoppingBag size={18} /> },
  { id: "Transport", icon: <Car size={18} /> },
  { id: "Loisirs", icon: <Gamepad2 size={18} /> },
  { id: "Autres", icon: <MoreHorizontal size={18} /> },
];

export default function Settings({
  widgetMode,
  onWidgetModeChange,
  widgetBalanceType,
  onWidgetBalanceTypeChange,
  widgetColor,
  onWidgetColorChange,
  widgetTextColor,
  onWidgetTextColorChange,
  onResetTransactions,
  aiNotifications,
  onAiNotificationsChange,
  isDarkMode,
  onDarkModeChange,
  currency,
  onCurrencyChange,
  language,
  onLanguageChange,
  reminders,
  onRemindersChange,
  transactions,
  predefinedItems,
  onPredefinedItemsChange,
  balanceThreshold,
  onBalanceThresholdChange,
  bankBalanceThreshold,
  onBankBalanceThresholdChange,
  inventoryAlertThreshold,
  onInventoryAlertThresholdChange,
  budgetAlertThreshold,
  onBudgetAlertThresholdChange,
  backupAlertInterval,
  onBackupAlertIntervalChange,
  appPin,
  onAppPinChange,
  appBiometric,
  onAppBiometricChange,
}: SettingsProps) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showSelector, setShowSelector] = useState<
    | "CURRENCY"
    | "LANGUAGE"
    | "WIDGET_SETTINGS"
    | "PIN_SETUP"
    | "API_SETTINGS"
    | "COLOR"
    | "SOUND"
    | null
  >(null);
  const [pinSetupStep, setPinSetupStep] = useState<1 | 2>(1);
  const [tempPin, setTempPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(() => localStorage.getItem("userGeminiApiKey") || "");
  const [soundType, setSoundType] = useState(() => localStorage.getItem("notificationSoundType") || "checkout");
  const [showArticleManager, setShowArticleManager] = useState(false);
  const [showReminderManager, setShowReminderManager] = useState(false);
  const [showAlarmManager, setShowAlarmManager] = useState(false);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [backupReminder, setBackupReminder] = useState(() => localStorage.getItem("backupReminderEnabled") === "true");

  const handleReset = () => {
    setIsResetting(true);
    setTimeout(() => {
      onResetTransactions();
      setIsResetting(false);
      setShowResetConfirm(false);
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }, 1500);
  };

  const currencies = ["DH", "EUR", "USD", "MAD"];
  const languages = ["Français", "العربية", "English"];
  const soundOptions = [
    { id: "default", label: "Défaut d'Android" },
    { id: "checkout", label: "Masrof (Checkout)" },
    { id: "bell", label: "Cloche (Bell)" }
  ];

  const exportToPDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.text("MasroF - Rapport de Transactions", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Généré le: ${new Date().toLocaleString("fr-FR")}`, 14, 30);
    doc.text(
      `Solde (Dépenses): ${transactions.reduce((acc, tx) => (tx.type === "EXPENSE" ? acc + tx.amount : acc), 0).toFixed(2)} ${currency}`,
      14,
      38,
    );

    // Table
    const tableData = transactions.map((tx) => [
      tx.date,
      tx.label,
      tx.category || (tx.type === "INCOME" ? "Banque" : "Marché"),
      tx.type === "INCOME" ? (tx.paidByBank ? "Salaire / Dépôt" : "Retrait") : "Achat",
      `${tx.amount.toFixed(2)} ${currency}`,
    ]);

    autoTable(doc, {
      startY: 55,
      head: [["Date", "Description", "Catégorie", "Type", "Montant"]],
      body: tableData,
      theme: "striped",
      headStyles: { fillColor: [45, 139, 150] }, // Teal-brand (#2D8B96)
    });

    doc.save(`Masrof_Rapport_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const handleRestoreData = async () => {
    const success = await importDataFromFile();
    if (success) {
      alert(language === "Français" ? "Données restaurées avec succès. L'application va redémarrer." : "Data restored successfully. App will restart.");
      window.location.reload();
    } else {
      alert(language === "Français" ? "Aucune sauvegarde trouvée ou fichier corrompu." : "No backup found or file corrupted.");
    }
  };

  const labels = {
    Français: {
      title: "Paramètres",
      subtitle: "Personnalisez votre expérience",
      widgetTitle: "Données du Widget",
      iaTitle: "Intelligence IA",
      rappelsTitle: "Rappels Programmés",
      prefTitle: "Préférences",
      dangerTitle: "Zone de danger",
      exportTitle: "Exporter mes données",
      exportSubtitle: "Télécharger un rapport PDF",
    },
    العربية: {
      title: "الإعدادات",
      subtitle: "خصص تجربتك",
      widgetTitle: "بيانات الواجهة",
      iaTitle: "ذكاء اصطناعي",
      rappelsTitle: "التذكيرات المبرمجة",
      prefTitle: "التفضيلات",
      dangerTitle: "منطقة الخطر",
      exportTitle: "تصدير بياناتي",
      exportSubtitle: "تحميل تقرير PDF",
    },
    English: {
      title: "Settings",
      subtitle: "Customize your experience",
      widgetTitle: "Widget Data",
      iaTitle: "AI Intelligence",
      rappelsTitle: "Scheduled Reminders",
      prefTitle: "Preferences",
      dangerTitle: "Danger Zone",
      exportTitle: "Export my data",
      exportSubtitle: "Download PDF report",
    },
  };

  const currentLabels =
    labels[language as keyof typeof labels] || labels["Français"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative min-h-screen bg-[#F0F7F8] text-[#1B5E66] font-sans selection:bg-[#2D8B96]/30 pb-24 overflow-hidden"
    >
      {/* Background Holographic Motif */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30">
        <svg width="100%" height="100%" className="w-full h-full opacity-10">
          <pattern
            id="grid-light"
            width="50"
            height="50"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 50 0 L 0 0 0 50"
              fill="none"
              stroke="#2D8B96"
              strokeWidth="0.5"
            />
            <circle cx="0" cy="0" r="1.5" fill="#2D8B96" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid-light)" />
        </svg>
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-white to-transparent opacity-60" />
        <motion.div
          animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-[#2D8B96]/20 rounded-full blur-[120px]"
        />
      </div>

      <div className="relative z-10 space-y-0">
        {/* Refined Header */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-teal-brand/10 p-10 flex items-center justify-center shadow-[0_4px_30px_rgba(45,139,150,0.05)]">
          <div className="flex flex-col items-center">
            <h2 className="text-4xl font-display font-black tracking-[-0.04em] text-teal-brand">
              Masrof<span className="text-gold-soft">.</span>
              <span className="text-slate-900/10 font-light">Config</span>
            </h2>
            <div className="flex items-center gap-3 mt-3">
              <div className="w-1 h-1 rounded-full bg-gold-soft animate-pulse" />
              <p className="text-[10px] font-display font-bold uppercase tracking-[0.4em] text-slate-400">
                Paramètres du Système
              </p>
            </div>
          </div>
        </div>

        {/* Edge-to-Edge Content Panel */}
        <div className="divide-y divide-[#2D8B96]/10 bg-white/40 backdrop-blur-sm">
          {/* Section: Language & Export */}
          <div className="p-0">
            <SettingsItem
              icon={<Sparkles />}
              title="LANGUE"
              subtitle={language}
              onClick={() => setShowSelector("LANGUAGE")}
              showArrow={true}
            />
            <SettingsItem
              icon={<Brain />}
              title="CLÉ API IA"
              subtitle={apiKeyInput ? "Clé configurée" : "Non configurée (Requise pour scan OCR)"}
              onClick={() => setShowSelector("API_SETTINGS")}
              showArrow={true}
            />
            <SettingsItem
              icon={<Plus />}
              title="GESTION DES ARTICLES"
              subtitle={`${predefinedItems.length} ARTICLES CONFIGURÉS`}
              onClick={() => setShowArticleManager(true)}
              showArrow={true}
            />
            <SettingsItem
              icon={<Bell />}
              title="NOTIFICATIONS & ALERTES"
              subtitle="Rappels, alarmes et sauvegarde"
              onClick={() => setShowNotificationCenter(true)}
              showArrow={true}
            />
            <SettingsItem
              icon={<Smartphone />}
              title="RÉGLAGES WIDGET ANDROID"
              subtitle={
                widgetMode === "spending"
                  ? "Dépenses hebdo"
                  : widgetBalanceType === "cash"
                  ? "Argent Dispo"
                  : "Solde Bancaire"
              }
              onClick={() => setShowSelector("WIDGET_SETTINGS")}
              showArrow={true}
            />
            <SettingsItem
              icon={<Download />}
              title="RAPPORT PDF"
              subtitle="Télécharger un rapport PDF"
              onClick={exportToPDF}
              showArrow={true}
            />
            <SettingsItem
              icon={<Download />}
              title="SAUVEGARDER MES DONNÉES"
              subtitle="Créer un fichier de sauvegarde (.dat)"
              onClick={async () => {
                await exportDataToFile();
              }}
              showArrow={true}
            />
            <SettingsItem
              icon={<Upload />}
              title="RESTAURATION DE DONNÉES"
              subtitle="Importer un fichier de sauvegarde crypté"
              onClick={handleRestoreData}
              showArrow={true}
            />
          </div>

          <div className="py-2 px-0">
            <div className="px-6 py-4 flex items-center gap-4 bg-white/40 border-y border-[#2D8B96]/5">
              <div className="w-10 h-10 rounded-full border border-[#2D8B96]/30 flex items-center justify-center text-[#2D8B96] shadow-[0_0_10px_rgba(45,139,150,0.1)]">
                <Moon size={18} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-[#1B5E66] uppercase tracking-tight">
                  Mode Sombre
                </p>
                <p className="text-[10px] font-black text-[#2D8B96] tracking-widest uppercase">
                  {isDarkMode ? "Activé" : "Désactivé"}
                </p>
              </div>
              <Switch
                active={isDarkMode}
                onToggle={() => onDarkModeChange(!isDarkMode)}
              />
            </div>
            <SettingsItem
              icon={<Coins />}
              title="MONNAIE"
              subtitle={`Devise par défaut: ${currency}`}
              onClick={() => setShowSelector("CURRENCY")}
              showArrow={true}
            />
          </div>

          <div className="py-2 px-0">
            <div className="px-6 py-4 flex items-center justify-between bg-white/40 border-y border-[#2D8B96]/5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full border border-[#2D8B96]/30 flex items-center justify-center text-[#2D8B96] shadow-[0_0_10px_rgba(45,139,150,0.1)]">
                  <Shield size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1B5E66] uppercase tracking-tight">
                    Verrouillage App (Code)
                  </p>
                  <p className="text-[10px] font-black text-[#2D8B96] tracking-widest uppercase">
                    {appPin ? "Activé" : "Désactivé"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {appPin && (
                  <button 
                    onClick={() => {
                      setPinSetupStep(1);
                      setTempPin("");
                      setShowSelector("PIN_SETUP");
                    }} 
                    className="text-[10px] font-black uppercase text-[#2D8B96] border border-[#2D8B96]/30 px-3 py-1.5 rounded-full active:scale-95 transition-all"
                  >
                    Modifier
                  </button>
                )}
                <Switch
                  active={!!appPin}
                  onToggle={() => {
                    if (appPin) {
                      onAppPinChange(null);
                    } else {
                      setPinSetupStep(1);
                      setTempPin("");
                      setShowSelector("PIN_SETUP");
                    }
                  }}
                />
              </div>
            </div>

            <div className="px-6 py-4 flex items-center justify-between bg-white/40 border-b border-[#2D8B96]/5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full border border-[#2D8B96]/30 flex items-center justify-center text-[#2D8B96] shadow-[0_0_10px_rgba(45,139,150,0.1)]">
                  <Sparkles size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1B5E66] uppercase tracking-tight">
                    Empreinte / Biométrie
                  </p>
                  <p className="text-[10px] font-black text-[#2D8B96] tracking-widest uppercase">
                    {appBiometric ? "Activée" : "Désactivée"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Switch
                  active={appBiometric}
                  onToggle={() => onAppBiometricChange(!appBiometric)}
                />
              </div>
            </div>
          </div>

          {/* Final Actions */}
          <div className="p-0">
            <SettingsItem
              icon={<HelpCircle />}
              title="AIDE & SUPPORT"
              onClick={() => setShowHelp(true)}
              showArrow={true}
            />
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full flex items-center gap-4 p-7 hover:bg-rose-50/50 transition-all border-b border-[#2D8B96]/5 group"
            >
              <div className="w-11 h-11 rounded-full border border-rose-500/30 flex items-center justify-center text-rose-500 group-hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all">
                <Trash2 size={20} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-black text-rose-600 uppercase tracking-[0.05em] italic">
                  REINITIALISER TOUTES LES DONNÉES
                </p>
                <p className="text-[10px] font-bold text-[#1B5E66]/40 uppercase tracking-tighter mt-0.5">
                  Effacer l'historique et remettre le solde à zéro
                </p>
              </div>
              <ChevronRight size={18} className="text-[#1B5E66]/20" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-12">
          <p className="text-[10px] font-black uppercase tracking-[0.6em] text-[#1B5E66]/20 italic">
            MASROF.PULSE v1.2.0 • CORE_SYSTEM_ACTIVE
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 2, delay: i * 0.4, repeat: Infinity }}
                className="w-1 h-1 bg-[#2D8B96] rounded-full shadow-[0_0_5px_#2D8B96]"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Help & Support Modal */}
      <AnimatePresence>
        {showHelp && <SupportModal onClose={() => setShowHelp(false)} />}
      </AnimatePresence>

      {/* Article Manager Modal */}
      <AnimatePresence>
        {showArticleManager && (
          <ArticleManagerModal
            onClose={() => setShowArticleManager(false)}
            items={predefinedItems}
            onItemsChange={onPredefinedItemsChange}
            currency={currency}
          />
        )}
      </AnimatePresence>

      {/* Alarm Settings Modal */}
      <AnimatePresence>
        {showAlarmManager && (
          <AlarmSettingsModal
            onClose={() => setShowAlarmManager(false)}
            balanceThreshold={balanceThreshold}
            onBalanceThresholdChange={onBalanceThresholdChange}
            bankBalanceThreshold={bankBalanceThreshold}
            onBankBalanceThresholdChange={onBankBalanceThresholdChange}
            inventoryAlertThreshold={inventoryAlertThreshold}
            onInventoryAlertThresholdChange={onInventoryAlertThresholdChange}
            budgetAlertThreshold={budgetAlertThreshold}
            onBudgetAlertThresholdChange={onBudgetAlertThresholdChange}
            backupAlertInterval={backupAlertInterval}
            onBackupAlertIntervalChange={onBackupAlertIntervalChange}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNotificationCenter && (
          <NotificationCenterModal
            onClose={() => setShowNotificationCenter(false)}
            remindersCount={reminders.length}
            onOpenReminderManager={() => setShowReminderManager(true)}
            onOpenAlarmManager={() => setShowAlarmManager(true)}
            backupReminder={backupReminder}
            setBackupReminder={setBackupReminder}
          />
        )}
      </AnimatePresence>

      {/* Reminder Manager Modal */}
      <AnimatePresence>
        {showReminderManager && (
          <ReminderManagerModal
            onClose={() => setShowReminderManager(false)}
            reminders={reminders}
            onRemindersChange={onRemindersChange}
          />
        )}
      </AnimatePresence>

      {/* Selector Modal (Currency/Language) */}
      <AnimatePresence>
        {showSelector && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSelector(null)}
              className="fixed inset-0 bg-[#00FFFF]/5 backdrop-blur-md z-[110] max-w-md mx-auto"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="fixed inset-x-0 bottom-0 z-[120] bg-white/95 backdrop-blur-2xl border-t border-[#2D8B96]/30 rounded-t-[40px] p-8 max-w-md mx-auto shadow-[0_-10px_40px_rgba(45,139,150,0.15)]"
            >
              <h3 className="text-xl font-black text-[#1B5E66] mb-6 italic uppercase tracking-tighter">
                {showSelector === "WIDGET_SETTINGS" ? "Réglages Widget" : 
                 showSelector === "PIN_SETUP" ? "Configurer Code PIN" :
                 showSelector === "API_SETTINGS" ? "Clé API IA" :
                 `Sélection ${
                  showSelector === "CURRENCY" ? "Devise" :
                  showSelector === "LANGUAGE" ? "Langue" : ""
                }`}
              </h3>
              <div className="space-y-3">
                {showSelector === "API_SETTINGS" ? (
                  <div className="flex flex-col py-2">
                    <p className="text-xs text-[#1B5E66]/70 mb-4 font-bold">
                      Saisissez votre clé API Google Gemini :
                    </p>
                    <input
                      type="text"
                      className="w-full bg-[#1B5E66]/5 border border-[#1B5E66]/10 rounded-2xl px-4 py-3 text-sm font-bold text-[#1B5E66] focus:outline-none focus:ring-2 focus:ring-[#2D8B96]/50 mb-4"
                      placeholder="AIzaSy..."
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                    />
                    <button
                      className="w-full bg-[#2D8B96] hover:bg-[#1B5E66] text-white font-black italic uppercase tracking-wider py-4 rounded-2xl transition-colors shadow-lg shadow-[#2D8B96]/20"
                      onClick={() => {
                        window.localStorage.setItem("userGeminiApiKey", apiKeyInput);
                        setShowSelector(null);
                      }}
                    >
                      Enregistrer
                    </button>
                    <p className="text-[10px] text-[#1B5E66]/50 mt-4 text-center font-bold">
                      Nécessaire pour le scan des factures. Stocké localement.
                    </p>
                  </div>
                ) : showSelector === "PIN_SETUP" ? (
                  <div className="flex flex-col items-center py-6">
                    <p className="text-sm font-bold text-[#1B5E66]/60 mb-8 uppercase tracking-widest text-center">
                      {pinSetupStep === 1 
                        ? "Saisissez un code à 4 chiffres" 
                        : "Confirmez votre code"}
                    </p>
                    <div className={`flex items-center gap-4 mb-10 ${pinError ? "animate-pulse" : ""}`}>
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`w-4 h-4 rounded-full transition-all duration-300 ${
                            tempPin.length > i 
                              ? pinError
                                ? "bg-red-500 scale-110 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                                : "bg-[#2D8B96] scale-110 shadow-[0_0_10px_rgba(45,139,150,0.5)]"
                              : "bg-[#2D8B96]/20"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-4 w-full max-w-[240px]">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <button
                          key={num}
                          onClick={() => {
                            if (tempPin.length < 4) {
                              const newPin = tempPin + num;
                              setTempPin(newPin);
                              setPinError(false);
                              if (newPin.length === 4) {
                                setTimeout(() => {
                                  if (pinSetupStep === 1) {
                                    setPinSetupStep(2);
                                    setTempPin("");
                                    // Hack to store first step pin without another state variable
                                    localStorage.setItem("temp_pin_setup", newPin);
                                  } else {
                                    const expected = localStorage.getItem("temp_pin_setup");
                                    if (expected === newPin) {
                                      onAppPinChange(newPin);
                                      setShowSelector(null);
                                      localStorage.removeItem("temp_pin_setup");
                                    } else {
                                      setPinError(true);
                                      setTimeout(() => {
                                        setPinSetupStep(1);
                                        setTempPin("");
                                        setPinError(false);
                                      }, 800);
                                    }
                                  }
                                }, 300);
                              }
                            }
                          }}
                          className="h-14 rounded-full bg-[#F0F7F8] text-[#1B5E66] text-xl font-black shadow-sm active:bg-[#2D8B96]/20 active:scale-95 transition-all flex items-center justify-center"
                        >
                          {num}
                        </button>
                      ))}
                      <button
                        onClick={() => {
                          setPinSetupStep(1);
                          setTempPin("");
                          setShowSelector(null);
                        }}
                        className="h-14 rounded-full bg-transparent text-[#1B5E66]/60 active:text-[#2D8B96] active:scale-95 transition-all flex items-center justify-center text-xs font-bold uppercase"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={() => {
                          if (tempPin.length < 4) {
                            const newPin = tempPin + "0";
                            setTempPin(newPin);
                            setPinError(false);
                            if (newPin.length === 4) {
                              setTimeout(() => {
                                if (pinSetupStep === 1) {
                                  setPinSetupStep(2);
                                  setTempPin("");
                                  localStorage.setItem("temp_pin_setup", newPin);
                                } else {
                                  const expected = localStorage.getItem("temp_pin_setup");
                                  if (expected === newPin) {
                                    onAppPinChange(newPin);
                                    setShowSelector(null);
                                    localStorage.removeItem("temp_pin_setup");
                                  } else {
                                    setPinError(true);
                                    setTimeout(() => {
                                      setPinSetupStep(1);
                                      setTempPin("");
                                      setPinError(false);
                                    }, 800);
                                  }
                                }
                              }, 300);
                            }
                          }
                        }}
                        className="h-14 rounded-full bg-[#F0F7F8] text-[#1B5E66] text-xl font-black shadow-sm active:bg-[#2D8B96]/20 active:scale-95 transition-all flex items-center justify-center"
                      >
                        0
                      </button>
                      <button
                        onClick={() => setTempPin(p => p.slice(0, -1))}
                        className="h-14 rounded-full bg-transparent text-[#1B5E66]/60 active:text-[#2D8B96] active:scale-95 transition-all flex items-center justify-center"
                      >
                        <X size={24} />
                      </button>
                    </div>
                  </div>
                ) : showSelector === "WIDGET_SETTINGS" ? (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-[#1B5E66]/60 mb-3">Données à afficher</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          { id: "cash", label: "Argent Dispo", action: () => { onWidgetModeChange("balance"); onWidgetBalanceTypeChange("cash"); } },
                          { id: "bank", label: "Solde Bancaire", action: () => { onWidgetModeChange("balance"); onWidgetBalanceTypeChange("bank"); } },
                          { id: "spending", label: "Dépenses Hebdo", action: () => { onWidgetModeChange("spending"); } }
                        ].map(opt => {
                          const isActive = widgetMode === "spending" ? opt.id === "spending" : opt.id === widgetBalanceType;
                          return (
                            <button
                              key={opt.id}
                              onClick={() => opt.action()}
                              className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between ${isActive ? 'bg-[#2D8B96]/10 border-[#2D8B96] text-[#1B5E66] shadow-[0_0_15px_rgba(45,139,150,0.2)]' : 'border-[#2D8B96]/10 text-[#1B5E66]/40'}`}
                            >
                              <span className="font-bold text-sm tracking-widest uppercase italic">{opt.label}</span>
                              {isActive && <div className="w-5 h-5 rounded-full bg-[#E5C366] shadow-[0_0_8px_#E5C366]" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-[#1B5E66]/60 mb-3">Couleur du texte</h4>
                      <div className="flex gap-3">
                        {[
                          { id: "#000000", color: "bg-black" },
                          { id: "#FFFFFF", color: "bg-white" },
                          { id: "#3b82f6", color: "bg-blue-500" },
                          { id: "#22c55e", color: "bg-green-500" },
                          { id: "#ef4444", color: "bg-red-500" }
                        ].map(c => (
                           <button
                             key={c.id}
                             onClick={() => onWidgetTextColorChange(c.id)}
                             className={`w-10 h-10 rounded-full border border-gray-300 transition-all ${c.color} ${widgetTextColor === c.id ? "ring-2 ring-offset-2 ring-[#1B5E66] scale-110 shadow-md opacity-100" : "opacity-60 hover:opacity-100"}`}
                           />
                        ))}
                      </div>
                    </div>
                    <button onClick={() => setShowSelector(null)} className="w-full bg-[#2D8B96] text-white rounded-2xl p-5 font-bold uppercase tracking-widest text-sm mt-2 active:scale-95 transition-transform">Terminé</button>
                  </div>
                ) : (() => {
                  let options: { id: string; label: string; color?: string }[] = [];
                  let activeValue = "";
                  
                  if (showSelector === "CURRENCY") {
                    options = currencies.map(c => ({ id: c, label: c }));
                    activeValue = currency;
                  } else if (showSelector === "LANGUAGE") {
                    options = languages.map(l => ({ id: l, label: l }));
                    activeValue = language;
                  }

                  return options.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        if (showSelector === "CURRENCY") onCurrencyChange(opt.id);
                        else if (showSelector === "LANGUAGE") onLanguageChange(opt.id);
                        setShowSelector(null);
                      }}
                      className={`w-full p-5 rounded-2xl border transition-all flex items-center justify-between group ${
                        activeValue === opt.id
                          ? "border-[#2D8B96] bg-[#2D8B96]/10 text-[#1B5E66] shadow-[0_0_15px_rgba(45,139,150,0.2)]"
                          : "border-[#2D8B96]/10 text-[#1B5E66]/40"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {opt.color && (
                          <div className={`w-6 h-6 rounded-full shadow-sm border border-black/10 ${opt.color}`} />
                        )}
                        <span className="font-bold italic uppercase tracking-widest text-sm">
                          {opt.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        {showSelector === "SOUND" && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              if (opt.id === "default") {
                                console.log("Son système par défaut.");
                              } else {
                                const audio = new Audio(`/${opt.id}.wav`);
                                audio.play().catch(err => console.log("Erreur de lecture: " + err.message));
                              }
                            }}
                            className="w-8 h-8 rounded-full bg-[#2D8B96]/10 border border-[#2D8B96]/20 flex items-center justify-center text-[#2D8B96] hover:bg-[#2D8B96]/20 transition-colors"
                          >
                            <Play size={14} className="ml-0.5" />
                          </div>
                        )}
                        {activeValue === opt.id && (
                          <div className="w-5 h-5 rounded-full bg-[#E5C366] shadow-[0_0_8px_#E5C366]" />
                        )}
                      </div>
                    </button>
                  ));
                })()}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Confirmation Modal for Reset */}
      <AnimatePresence>
        {showResetConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isResetting && setShowResetConfirm(false)}
              className="fixed inset-0 bg-[#00FFFF]/5 backdrop-blur-sm z-[110] max-w-md mx-auto"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[120] bg-white/95 backdrop-blur-2xl border border-rose-200 rounded-[40px] p-8 max-w-[340px] mx-auto shadow-[0_0_50px_rgba(239,68,68,0.2)] text-center"
            >
              <div className="w-20 h-20 bg-rose-50 border border-rose-200 rounded-full flex items-center justify-center text-rose-500 mx-auto mb-6">
                <AlertTriangle
                  size={40}
                  className={isResetting ? "animate-pulse" : ""}
                />
              </div>
              <h3 className="text-xl font-black text-rose-600 mb-3 tracking-tighter uppercase italic">
                {isResetting ? "PURGE EN COURS..." : "ZONE CRITIQUE"}
              </h3>
              <p className="text-[#000080]/50 font-bold text-[10px] leading-relaxed mb-8 uppercase tracking-tight">
                {isResetting
                  ? "Veuillez patienter pendant que nous effaçons les vecteurs de données."
                  : "Cette action est irréversible. Toutes les séquences temporelles seront purgées."}
              </p>
              {!isResetting && (
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleReset}
                    className="w-full h-14 bg-rose-500 text-white font-black rounded-2xl shadow-[0_0_20px_rgba(239,68,68,0.3)] active:scale-95 transition-transform text-xs tracking-widest italic"
                  >
                    CONFIRMER LA PURGE
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="w-full h-14 bg-slate-100 text-[#000080]/40 font-black rounded-2xl active:scale-95 transition-transform text-xs tracking-widest"
                  >
                    ANNULER
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Switch({
  active,
  onToggle,
}: {
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={`relative w-12 h-6 rounded-full border border-[#1B5E66]/20 transition-all duration-300 ${
        active
          ? "bg-[#1B5E66]/10 shadow-[0_0_10px_rgba(45,139,150,0.2)]"
          : "bg-slate-200/50"
      }`}
    >
      <motion.div
        animate={{
          x: active ? 26 : 4,
          backgroundColor: active ? "#E5C366" : "#475569",
          boxShadow: active ? "0 0 10px #E5C366" : "none",
        }}
        className="absolute top-1 w-4 h-4 rounded-full shadow-sm"
      />
    </button>
  );
}

function AlarmSettingsModal({
  onClose,
  balanceThreshold,
  onBalanceThresholdChange,
  bankBalanceThreshold,
  onBankBalanceThresholdChange,
  inventoryAlertThreshold,
  onInventoryAlertThresholdChange,
  budgetAlertThreshold,
  onBudgetAlertThresholdChange,
  backupAlertInterval,
  onBackupAlertIntervalChange,
}: {
  onClose: () => void;
  balanceThreshold: number | null;
  onBalanceThresholdChange: (threshold: number | null) => void;
  bankBalanceThreshold: number | null;
  onBankBalanceThresholdChange: (threshold: number | null) => void;
  inventoryAlertThreshold: number | null;
  onInventoryAlertThresholdChange: (threshold: number | null) => void;
  budgetAlertThreshold: number | null;
  onBudgetAlertThresholdChange: (threshold: number | null) => void;
  backupAlertInterval: number | null;
  onBackupAlertIntervalChange: (interval: number | null) => void;
}) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-[#00FFFF]/5 backdrop-blur-md z-[110] max-w-md mx-auto"
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        className="fixed inset-x-0 bottom-0 z-[120] bg-white/95 backdrop-blur-2xl border-t border-[#2D8B96]/30 rounded-t-[40px] max-h-[90vh] overflow-y-auto max-w-md mx-auto shadow-[0_-10px_40px_rgba(45,139,150,0.15)] pb-safe"
      >
        <div className="sticky top-0 bg-white/95 backdrop-blur-xl z-10 px-8 py-6 border-b border-[#2D8B96]/10 flex items-center justify-between">
          <h3 className="text-xl font-black text-[#1B5E66] italic uppercase tracking-tighter">
            Seuils d'Alertes
          </h3>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-[#2D8B96]/10 text-[#2D8B96] flex items-center justify-center hover:bg-[#2D8B96] hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
              Solde Compte Bancaire
            </label>
            <div className="flex gap-4">
              <input
                type="number"
                placeholder="Ex: 500"
                value={bankBalanceThreshold ?? ""}
                onChange={(e) => onBankBalanceThresholdChange(e.target.value ? Number(e.target.value) : null)}
                className="w-full h-14 bg-white/50 border border-[#2D8B96]/30 rounded-2xl px-5 font-bold text-[#1B5E66] outline-none focus:border-[#2D8B96]"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
              Argent dans ma Poche
            </label>
            <div className="flex gap-4">
              <input
                type="number"
                placeholder="Ex: 50"
                value={balanceThreshold ?? ""}
                onChange={(e) => onBalanceThresholdChange(e.target.value ? Number(e.target.value) : null)}
                className="w-full h-14 bg-white/50 border border-[#2D8B96]/30 rounded-2xl px-5 font-bold text-[#1B5E66] outline-none focus:border-[#2D8B96]"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
              Quantité Stock Article
            </label>
            <div className="flex gap-4">
              <input
                type="number"
                placeholder="Ex: 3"
                value={inventoryAlertThreshold ?? ""}
                onChange={(e) => onInventoryAlertThresholdChange(e.target.value ? Number(e.target.value) : null)}
                className="w-full h-14 bg-white/50 border border-[#2D8B96]/30 rounded-2xl px-5 font-bold text-[#1B5E66] outline-none focus:border-[#2D8B96]"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
              Budget de Catégorie (%)
            </label>
            <div className="flex gap-4">
              <input
                type="number"
                placeholder="Ex: 90"
                min={0}
                max={100}
                value={budgetAlertThreshold ?? ""}
                onChange={(e) => onBudgetAlertThresholdChange(e.target.value ? Number(e.target.value) : null)}
                className="w-full h-14 bg-white/50 border border-[#2D8B96]/30 rounded-2xl px-5 font-bold text-[#1B5E66] outline-none focus:border-[#2D8B96]"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
              Intervalle Alarme Sauvegarde (Min)
            </label>
            <div className="flex gap-4">
              <input
                type="number"
                placeholder="Ex: 30"
                value={backupAlertInterval ?? ""}
                onChange={(e) => onBackupAlertIntervalChange(e.target.value ? Number(e.target.value) : null)}
                className="w-full h-14 bg-white/50 border border-[#2D8B96]/30 rounded-2xl px-5 font-bold text-[#1B5E66] outline-none focus:border-[#2D8B96]"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

function ReminderManagerModal({
  onClose,
  reminders,
  onRemindersChange,
}: {
  onClose: () => void;
  reminders: Reminder[];
  onRemindersChange: (reminders: Reminder[]) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleUpdate = (id: string, updates: Partial<Reminder>) => {
    onRemindersChange(
      reminders.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    );
  };

  const handleAdd = (newReminder: Omit<Reminder, "id">) => {
    onRemindersChange([
      ...reminders,
      { ...newReminder, id: `rem-${Date.now()}-${Math.random().toString(36).substring(2, 9)}` },
    ]);
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    onRemindersChange(reminders.filter((r) => r.id !== id));
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[110] max-w-md mx-auto"
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        className="fixed inset-x-0 bottom-0 z-[120] bg-white rounded-t-[40px] p-8 max-w-md mx-auto shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-black text-teal-brand tracking-tight uppercase italic">
            Gestion des Rappels
          </h3>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400"
          >
            <X size={20} />
          </button>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="w-full mb-8 py-4 bg-teal-brand/10 border border-dashed border-teal-brand/30 rounded-2xl flex items-center justify-center gap-2 text-teal-brand font-black uppercase text-xs tracking-widest hover:bg-teal-brand/20 transition-all"
        >
          <Plus size={16} />
          Nouveau Rappel
        </button>

        <AnimatePresence>
          {showAddForm && (
            <div className="mb-10 p-6 bg-slate-50 rounded-[32px] border border-teal-brand/10 relative">
              <button
                onClick={() => setShowAddForm(false)}
                className="absolute top-4 right-4 text-slate-300 hover:text-slate-500"
              >
                <X size={16} />
              </button>
              <ReminderFormFields
                onSave={handleAdd}
                onCancel={() => setShowAddForm(false)}
              />
            </div>
          )}
        </AnimatePresence>

        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
            Vos Rappels ({reminders.length})
          </label>
          {reminders.map((reminder) => {
            const isEditing = editingId === reminder.id;
            return (
              <div
                key={reminder.id}
                className="bg-white border border-slate-100 rounded-3xl p-4 flex items-center gap-4 transition-all hover:shadow-md group shadow-sm"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                    reminder.type === "ACHAT"
                      ? "bg-rose-50 text-rose-600"
                      : reminder.type === "RETRAIT"
                        ? "bg-teal-50 text-teal-600"
                        : "bg-indigo-600 text-white"
                  }`}
                >
                  {reminder.type === "ACHAT" ? (
                    <ShoppingBag size={20} strokeWidth={2.5} />
                  ) : reminder.type === "RETRAIT" ? (
                    <ArrowDownToLine size={20} strokeWidth={2.5} />
                  ) : (
                    <Coins size={20} strokeWidth={2.5} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  {isEditing ? (
                    <div className="space-y-3 p-2 bg-slate-50 rounded-2xl border border-teal-brand/5">
                      <input
                        type="text"
                        value={reminder.title}
                        onChange={(e) =>
                          handleUpdate(reminder.id, { title: e.target.value })
                        }
                        className="w-full bg-white border-none px-3 py-2 text-sm font-bold rounded-xl"
                        placeholder="Titre"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="HH:MM"
                          maxLength={5}
                          value={reminder.time}
                          onChange={(e) => {
                            let val = e.target.value.replace(/[^0-9]/g, '');
                            if (val.length >= 3) {
                              val = val.slice(0, 2) + ':' + val.slice(2, 4);
                            }
                            handleUpdate(reminder.id, { time: val });
                          }}
                          className="bg-white border-none px-3 py-2 text-sm font-bold rounded-xl"
                        />
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-teal-brand text-white text-[10px] font-black uppercase rounded-xl"
                        >
                          OK
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-black text-slate-800 uppercase tracking-tight">
                        {reminder.title}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                        {reminder.time} • {reminder.frequency}
                      </p>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    active={reminder.enabled}
                    onToggle={() =>
                      handleUpdate(reminder.id, { enabled: !reminder.enabled })
                    }
                  />
                  <button
                    onClick={() => setEditingId(isEditing ? null : reminder.id)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${isEditing ? "bg-teal-brand text-white" : "bg-slate-100 text-slate-400"}`}
                  >
                    {isEditing ? <Check size={14} /> : <Settings2 size={14} />}
                  </button>
                  <button
                    onClick={() => handleDelete(reminder.id)}
                    className="w-8 h-8 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center transition-opacity"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
          {reminders.length === 0 && !showAddForm && (
            <div className="text-center py-10 opacity-30">
              <Bell size={40} className="mx-auto mb-2" />
              <p className="text-[10px] font-black uppercase tracking-widest">
                Aucun rappel actif
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}

function ReminderFormFields({
  onSave,
  onCancel,
}: {
  onSave: (reminder: Omit<Reminder, "id">) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("08:00");
  const [date, setDate] = useState("");
  const [frequency, setFrequency] = useState<
    "ONCE" | "DAILY" | "WEEKLY" | "MONTHLY"
  >("ONCE");
  const [type, setType] = useState<"ACHAT" | "RETRAIT" | "AUTRE">("AUTRE");

  const timeRef = React.useRef<HTMLInputElement>(null);
  const dateRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    onSave({ title, time, date, type, frequency, enabled: true });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-[#1B5E66]/40 tracking-widest ml-1">
          Type de Rappel
        </label>
        <div className="grid grid-cols-3 gap-3">
          {(["ACHAT", "RETRAIT", "AUTRE"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`py-3 px-2 border-2 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${
                type === t 
                  ? t === "ACHAT" ? "border-rose-100 bg-rose-50 text-rose-600 shadow-sm"
                  : t === "RETRAIT" ? "border-teal-100 bg-teal-50 text-teal-600 shadow-sm"
                  : "border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "border-slate-50 bg-white text-slate-400 hover:border-slate-100"
              }`}
            >
              {t === "ACHAT" ? (
                <ShoppingBag size={18} strokeWidth={2.5} />
              ) : t === "RETRAIT" ? (
                <ArrowDownToLine size={18} strokeWidth={2.5} />
              ) : (
                <Coins size={18} strokeWidth={2.5} />
              )}
              <span className="text-[10px] font-black uppercase tracking-wider">
                {t}
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-[#1B5E66]/40 tracking-widest ml-1">
          Titre / Description
        </label>
        <input
          type="text"
          placeholder="ex: Rappel mensuel..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full h-14 bg-white border border-[#2D8B96]/30 rounded-2xl px-5 font-bold text-[#1B5E66] placeholder-[#1B5E66]/20 outline-none focus:border-[#2D8B96] focus:shadow-[0_0_15px_rgba(45,139,150,0.2)] transition-all"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-[#1B5E66]/40 tracking-widest ml-1">
          Fréquence
        </label>
        <div className="grid grid-cols-2 gap-3">
          {(["ONCE", "DAILY", "WEEKLY", "MONTHLY"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFrequency(f)}
              className={`p-3 rounded-2xl border text-[10px] font-black uppercase tracking-wider transition-all ${frequency === f ? "border-[#2D8B96] bg-[#2D8B96]/10 text-[#1B5E66] shadow-[0_0_10px_rgba(45,139,150,0.1)]" : "border-[#2D8B96]/10 text-[#1B5E66]/40"}`}
            >
              {f === "ONCE"
                ? "Une fois"
                : f === "DAILY"
                  ? "Chaque jour"
                  : f === "WEEKLY"
                    ? "Hebdo"
                    : "Mensuel"}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-[#1B5E66]/40 tracking-widest ml-1">
            Heure
          </label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="HH:MM"
            maxLength={5}
            value={time}
            onChange={(e) => {
              let val = e.target.value.replace(/[^0-9]/g, '');
              if (val.length >= 3) {
                val = val.slice(0, 2) + ':' + val.slice(2, 4);
              }
              setTime(val);
            }}
            className="w-full h-14 bg-white border border-[#2D8B96]/30 rounded-2xl px-5 font-bold text-[#1B5E66] outline-none"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-[#1B5E66]/40 tracking-widest ml-1">
            Date
          </label>
          <input
            ref={dateRef}
            type="date"
            value={date}
            onClick={() => { try { dateRef.current?.showPicker() } catch(e) {} }}
            onChange={(e) => setDate(e.target.value)}
            className="w-full h-14 bg-white border border-[#2D8B96]/30 rounded-2xl px-5 font-bold text-[#1B5E66] outline-none"
          />
        </div>
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 h-14 bg-slate-100 text-slate-400 font-black rounded-2xl uppercase tracking-widest text-[10px]"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="flex-2 h-14 bg-[#2D8B96] text-white font-black rounded-2xl shadow-[0_0_20px_rgba(45,139,150,0.4)] uppercase tracking-widest active:scale-95 transition-all text-[10px] italic"
        >
          Activer le Rappel
        </button>
      </div>
    </form>
  );
}

function ReminderForm({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (reminder: Omit<Reminder, "id">) => void;
}) {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("08:00");
  const [date, setDate] = useState("");
  const [frequency, setFrequency] = useState<
    "ONCE" | "DAILY" | "WEEKLY" | "MONTHLY"
  >("ONCE");
  const [type, setType] = useState<"ACHAT" | "RETRAIT" | "AUTRE">("AUTRE");

  const timeRef2 = React.useRef<HTMLInputElement>(null);
  const dateRef2 = React.useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    onSave({ title, time, date, type, frequency, enabled: true });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-[#00FFFF]/5 backdrop-blur-md z-[110] max-w-md mx-auto"
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        className="fixed inset-x-0 bottom-0 z-[120] bg-white/95 backdrop-blur-2xl border-t border-[#2D8B96]/30 rounded-t-[40px] p-8 max-w-md mx-auto shadow-[0_-10px_40px_rgba(45,139,150,0.15)]"
      >
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-black text-[#1B5E66] tracking-tight italic uppercase">
            Nouveau Rappel
          </h3>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-[#2D8B96]/10 border border-[#2D8B96]/20 rounded-full flex items-center justify-center text-[#2D8B96]"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-[#1B5E66]/40 tracking-widest ml-1">
              Type de Rappel
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(["ACHAT", "RETRAIT", "AUTRE"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`py-3 px-2 border-2 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${
                    type === t 
                      ? t === "ACHAT" ? "border-rose-100 bg-rose-50 text-rose-600 shadow-sm"
                      : t === "RETRAIT" ? "border-teal-100 bg-teal-50 text-teal-600 shadow-sm"
                      : "border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                      : "border-slate-50 bg-white text-slate-400 hover:border-slate-100"
                  }`}
                >
                  {t === "ACHAT" ? (
                    <ShoppingBag size={18} strokeWidth={2.5} />
                  ) : t === "RETRAIT" ? (
                    <ArrowDownToLine size={18} strokeWidth={2.5} />
                  ) : (
                    <Coins size={18} strokeWidth={2.5} />
                  )}
                  <span className="text-[10px] font-black uppercase tracking-wider">
                    {t}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-[#1B5E66]/40 tracking-widest ml-1">
              Titre / Description
            </label>
            <input
              type="text"
              placeholder="ex: Rappel mensuel..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-14 bg-white/50 border border-[#2D8B96]/30 rounded-2xl px-5 font-bold text-[#1B5E66] placeholder-[#1B5E66]/20 outline-none focus:border-[#2D8B96] focus:shadow-[0_0_15px_rgba(45,139,150,0.2)] transition-all"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-[#1B5E66]/40 tracking-widest ml-1">
              Fréquence
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(["ONCE", "DAILY", "WEEKLY", "MONTHLY"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFrequency(f)}
                  className={`p-3 rounded-2xl border text-[10px] font-black uppercase tracking-wider transition-all ${frequency === f ? "border-[#2D8B96] bg-[#2D8B96]/10 text-[#1B5E66] shadow-[0_0_10px_rgba(45,139,150,0.1)]" : "border-[#2D8B96]/10 text-[#1B5E66]/40"}`}
                >
                  {f === "ONCE"
                    ? "Une fois"
                    : f === "DAILY"
                      ? "Chaque jour"
                      : f === "WEEKLY"
                        ? "Hebdo"
                        : "Mensuel"}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-[#1B5E66]/40 tracking-widest ml-1">
                Heure
              </label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="HH:MM"
                maxLength={5}
                value={time}
                onChange={(e) => {
                  let val = e.target.value.replace(/[^0-9]/g, '');
                  if (val.length >= 3) {
                    val = val.slice(0, 2) + ':' + val.slice(2, 4);
                  }
                  setTime(val);
                }}
                className="w-full h-14 bg-white/50 border border-[#2D8B96]/30 rounded-2xl px-5 font-bold text-[#1B5E66] outline-none"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-[#1B5E66]/40 tracking-widest ml-1">
                Date
              </label>
              <input
                ref={dateRef2}
                type="date"
                value={date}
                onClick={() => { try { dateRef2.current?.showPicker() } catch(e) {} }}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-14 bg-white/50 border border-[#2D8B96]/30 rounded-2xl px-5 font-bold text-[#1B5E66] outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full h-16 bg-[#2D8B96] text-white font-black rounded-2xl shadow-[0_0_20px_rgba(45,139,150,0.4)] uppercase tracking-widest active:scale-95 transition-all text-sm italic"
          >
            ACTIVER LE RAPPEL
          </button>
        </form>
      </motion.div>
    </>
  );
}

function ArticleManagerModal({
  onClose,
  items,
  onItemsChange,
  currency,
}: {
  onClose: () => void;
  items: PredefinedItem[];
  onItemsChange: (items: PredefinedItem[]) => void;
  currency: string;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<{
    name: string;
    price: string;
    category: string;
    frequent: boolean;
    iconName: string;
  }>({
    name: "",
    price: "",
    category: "Nourriture",
    frequent: false,
    iconName: "Box",
  });

  const handleUpdate = (id: string, updates: Partial<PredefinedItem>) => {
    onItemsChange(
      items.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    );
  };

  const handleAdd = () => {
    if (!newItem.name || !newItem.price) return;
    const item: PredefinedItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: newItem.name,
      price: parseFloat(newItem.price),
      category: newItem.category,
      frequent: newItem.frequent,
      iconName: newItem.iconName,
    };
    onItemsChange([...items, item]);
    setNewItem({
      name: "",
      price: "",
      category: "Nourriture",
      frequent: false,
      iconName: "Box",
    });
  };

  const handleDelete = (id: string) => {
    onItemsChange(items.filter((item) => item.id !== id));
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[110] max-w-md mx-auto"
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        className="fixed inset-x-0 bottom-0 z-[120] bg-white rounded-t-[40px] p-8 max-w-md mx-auto shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-black text-teal-brand tracking-tight uppercase italic">
            Gestion des Articles
          </h3>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4 mb-10">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
            Ajouter un Article
          </label>
          <div className="bg-slate-50 p-4 rounded-3xl border border-teal-brand/10 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Nom"
                value={newItem.name}
                onChange={(e) =>
                  setNewItem({ ...newItem, name: e.target.value })
                }
                className="bg-white border border-teal-brand/5 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-teal-brand"
              />
              <input
                type="number"
                placeholder="Prix"
                value={newItem.price}
                onChange={(e) =>
                  setNewItem({ ...newItem, price: e.target.value })
                }
                className="bg-white border border-teal-brand/5 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-teal-brand"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setNewItem({ ...newItem, category: cat.id })}
                  className={`flex-shrink-0 px-3 py-2 rounded-xl border text-[9px] font-black uppercase tracking-wider transition-all ${newItem.category === cat.id ? "border-teal-brand bg-teal-brand text-white shadow-md shadow-teal-brand/20" : "border-teal-brand/10 text-teal-brand/50 bg-white"}`}
                >
                  {cat.id}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-3 py-2 px-1 cursor-pointer">
              <Switch
                active={newItem.frequent}
                onToggle={() =>
                  setNewItem({ ...newItem, frequent: !newItem.frequent })
                }
              />
              <span className="text-[10px] font-black uppercase text-teal-brand/60 tracking-wider">
                Achat fréquent ?
              </span>
            </label>
            <button
              onClick={handleAdd}
              disabled={!newItem.name || !newItem.price}
              className="w-full h-12 bg-teal-brand text-white font-black rounded-xl shadow-lg shadow-teal-brand/20 uppercase tracking-widest text-[11px] disabled:opacity-50"
            >
              Ajouter à la liste
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
            Articles Existants ({items.length})
          </label>
          {items.map((item) => {
            const IconComp = (ICON_MAP[item.iconName] ||
              ICON_MAP["Box"]) as React.ElementType;
            const isEditing = editingId === item.id;

            return (
              <div
                key={item.id}
                className="bg-white border border-slate-100 rounded-3xl p-4 flex items-center gap-4 transition-all hover:shadow-md group shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-brand/5 flex items-center justify-center text-teal-brand">
                  <IconComp size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  {isEditing ? (
                    <div className="flex flex-col gap-2">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) =>
                          handleUpdate(item.id, { name: e.target.value })
                        }
                        className="bg-slate-50 border-none px-2 py-1 text-sm font-bold rounded"
                      />
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) =>
                          handleUpdate(item.id, {
                            price: parseFloat(e.target.value),
                          })
                        }
                        className="bg-slate-50 border-none px-2 py-1 text-sm font-bold rounded"
                      />
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-black text-slate-800 uppercase tracking-tight">
                        {item.name}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                        {item.price} {currency} • {item.category}
                      </p>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      handleUpdate(item.id, { frequent: !item.frequent })
                    }
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${item.frequent ? "bg-amber-400 text-white" : "bg-slate-100 text-slate-300"}`}
                  >
                    <Sparkles
                      size={14}
                      fill={item.frequent ? "currentColor" : "none"}
                    />
                  </button>
                  <button
                    onClick={() => setEditingId(isEditing ? null : item.id)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${isEditing ? "bg-teal-brand text-white" : "bg-slate-100 text-slate-400"}`}
                  >
                    {isEditing ? <Check size={14} /> : <Settings2 size={14} />}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="w-8 h-8 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center transition-opacity"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </>
  );
}

function SupportModal({ onClose }: { onClose: () => void }) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "Comment ajouter un revenu ?",
      a: "Appuyez sur le bouton '+' en bas de l'écran d'accueil, puis sélectionnez 'Retrait Banque' pour ajouter de l'argent à votre compte.",
    },
    {
      q: "Puis-je exporter mes données ?",
      a: "Appuyez sur 'Exporter mes données' dans les paramètres pour générer un rapport PDF détaillé de vos transactions.",
    },
    {
      q: "Le mode sombre est-il disponible ?",
      a: "Oui, vous pouvez l'activer directement dans la section 'Préférences & IA' des paramètres.",
    },
    {
      q: "Mes données sont-elles sécurisées ?",
      a: "Absolument. MasroF stocke toutes vos données localement sur votre appareil pour une confidentialité totale.",
    },
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-[#00FFFF]/5 backdrop-blur-md z-[110] max-w-md mx-auto"
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        className="fixed inset-x-0 bottom-0 z-[120] bg-white/95 backdrop-blur-2xl border-t border-[#2D8B96]/30 rounded-t-[40px] p-8 max-w-md mx-auto shadow-[0_-10px_40px_rgba(45,139,150,0.15)] max-h-[85vh] overflow-y-auto scrollbar-hide"
      >
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-black text-[#1B5E66] tracking-tight italic uppercase">
            Aide & Support
          </h3>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-[#2D8B96]/10 border border-[#2D8B96]/20 rounded-full flex items-center justify-center text-[#2D8B96]"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-8">
          <section>
            <div className="bg-[#B0E0E6]/10 border border-[#2D8B96]/20 rounded-3xl p-6 mb-8 text-center shadow-[0_0_20px_rgba(45,139,150,0.05)]">
              <div className="w-20 h-20 bg-white border border-[#2D8B96]/30 rounded-full flex items-center justify-center text-[#2D8B96] mx-auto mb-4 shadow-[0_0_15px_rgba(45,139,150,0.2)]">
                <HelpCircle size={40} strokeWidth={1} />
              </div>
              <h4 className="text-sm font-black text-[#1B5E66] mb-2 uppercase italic">
                Besoin d'assistance ?
              </h4>
              <p className="text-[10px] text-[#1B5E66]/50 font-bold mb-6 leading-relaxed uppercase tracking-tighter">
                L'IA MasroF et notre équipe sont à votre service 24/7.
              </p>
              <button
                onClick={() => window.open("mailto:support@masrof.app")}
                className="w-full h-14 bg-[#2D8B96] text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.3em] shadow-[0_0_15px_rgba(45,139,150,0.3)] active:scale-95 transition-transform"
              >
                Ouvrir un ticket support
              </button>
            </div>
          </section>

          <section>
            <h4 className="text-[10px] font-black text-[#1B5E66]/30 uppercase tracking-[0.3em] mb-4 ml-2 italic">
              Protocoles & FAQ
            </h4>
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-white/50 rounded-2xl overflow-hidden border border-[#2D8B96]/10 shadow-sm"
                >
                  <button
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between"
                  >
                    <span className="text-[11px] font-bold text-[#1B5E66] tracking-tight uppercase italic">
                      {faq.q}
                    </span>
                    <ChevronRight
                      size={16}
                      className={`text-[#2D8B96] transition-transform ${activeFaq === idx ? "rotate-90" : ""}`}
                    />
                  </button>
                  <AnimatePresence>
                    {activeFaq === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                      >
                        <div className="p-5 pt-0 text-[10px] text-[#1B5E66]/60 leading-relaxed font-medium border-t border-[#2D8B96]/5">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </section>
        </div>
      </motion.div>
    </>
  );
}

function NotificationCenterModal({
  onClose,
  remindersCount,
  onOpenReminderManager,
  onOpenAlarmManager,
  backupReminder,
  setBackupReminder,
}: {
  onClose: () => void;
  remindersCount: number;
  onOpenReminderManager: () => void;
  onOpenAlarmManager: () => void;
  backupReminder: boolean;
  setBackupReminder: (v: boolean) => void;
}) {
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[70] bg-slate-50 flex flex-col font-sans"
    >
      <div className="pt-12 pb-4 px-6 bg-white shrink-0 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-black text-slate-800 tracking-tight">NOTIFICATIONS</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Alertes & Rappels</p>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-20 p-4 space-y-4">
        
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm flex flex-col divide-y divide-slate-50">
          <SettingsItem
            icon={<AlarmClock />}
            title="GESTION DES RAPPELS"
            subtitle={`${remindersCount} RAPPELS ACTIFS`}
            onClick={onOpenReminderManager}
            showArrow={true}
          />
          <SettingsItem
            icon={<AlertTriangle />}
            title="SEUILS D'ALERTES ET ALARMES"
            subtitle="Compte Bancaire, Poche, Stock, Budget"
            onClick={onOpenAlarmManager}
            showArrow={true}
          />
        </div>

        <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
            <div className="px-6 py-4 flex items-center gap-4 border-[#2D8B96]/5">
              <div className="w-10 h-10 rounded-full border border-sky-100 flex items-center justify-center text-sky-500 bg-sky-50 shadow-sm">
                <Bell size={18} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-[#1B5E66] uppercase tracking-tight">
                  RAPPEL DE SAUVEGARDE
                </p>
                <p className="text-[10px] font-black text-slate-500 uppercase leading-snug mt-0.5">
                  Notifie si des modifications ne sont pas sauvegardées
                </p>
              </div>
              <Switch
                active={backupReminder}
                onToggle={async () => {
                   const newValue = !backupReminder;
                   setBackupReminder(newValue);
                   localStorage.setItem("backupReminderEnabled", newValue.toString());
                   const extSync = await import("../utils/notifications");
                   if (newValue) {
                       extSync.scheduleBackupReminder();
                   }
                }}
              />
            </div>
        </div>

      </div>
    </motion.div>
  );
}

function SettingsItem({
  icon,
  title,
  subtitle,
  showArrow = true,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  showArrow?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-5 p-7 hover:bg-[#2D8B96]/5 transition-all cursor-pointer group border-b border-[#2D8B96]/10 last:border-none ${onClick ? "active:scale-[0.98]" : ""}`}
    >
      <div className="w-12 h-12 rounded-2xl border-2 border-[#2D8B96]/20 flex items-center justify-center text-[#2D8B96] shadow-[0_4px_12px_rgba(45,139,150,0.1)] group-hover:bg-[#2D8B96] group-hover:text-white transition-all duration-300">
        {React.cloneElement(icon as React.ReactElement<any>, {
          size: 22,
          strokeWidth: 1.5,
        })}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-display font-bold text-slate-800 tracking-tight group-hover:translate-x-1 transition-transform">
          {title}
        </p>
        {subtitle && (
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1.5 line-clamp-1">
            {subtitle}
          </p>
        )}
      </div>
      {showArrow && (
        <ChevronRight
          size={18}
          className="text-[#1B5E66]/20 group-hover:text-[#1B5E66] group-hover:translate-x-1 transition-all"
        />
      )}
    </div>
  );
}
