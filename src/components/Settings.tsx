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
  Upload,
  Save,
  Search,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import MasrofLogo from "./Logo";
import { Reminder, PredefinedItem } from "../types";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { ICON_MAP, CATEGORIES as APP_CATEGORIES } from "../constants";
import { importDataFromFile, exportDataToFile, quickLocalBackup } from "../utils/backup";
import { useLocalStorage } from "../hooks/useLocalStorage";
import {
  Utensils,
  Car,
  Gamepad2,
  MoreHorizontal,
  Home as HomeLucide,
  HeartPulse,
  Heart,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  GripVertical,
  Home,
  Database,
  RefreshCw,
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
  balanceCustomMessage: string;
  onBalanceCustomMessageChange: (message: string) => void;
  bankBalanceThreshold: number | null;
  onBankBalanceThresholdChange: (threshold: number | null) => void;
  bankBalanceCustomMessage: string;
  onBankBalanceCustomMessageChange: (message: string) => void;
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
  { id: "Gourmandises", icon: <Utensils size={18} /> },
  { id: "Protéines", icon: <Utensils size={18} /> },
  { id: "Essentiel", icon: <Utensils size={18} /> },
  { id: "Plantes", icon: <Utensils size={18} /> },
  { id: "Logement", icon: <HomeLucide size={18} /> },
  { id: "Transport", icon: <Car size={18} /> },
  { id: "Santé", icon: <HeartPulse size={18} /> },
  { id: "Shopping", icon: <ShoppingBag size={18} /> },
  { id: "Loisirs", icon: <Gamepad2 size={18} /> },
  { id: "Famille", icon: <Heart size={18} /> },
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
  balanceCustomMessage,
  onBalanceCustomMessageChange,
  bankBalanceThreshold,
  onBankBalanceThresholdChange,
  bankBalanceCustomMessage,
  onBankBalanceCustomMessageChange,
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
  const [searchQuery, setSearchQuery] = useState("");
  const [showScannerFab, setShowScannerFab] = useLocalStorage<boolean>(
    "showScannerFab",
    true
  );
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
  const [apiKeyInput, setApiKeyInput] = useState(
    () =>
      localStorage.getItem("userGeminiApiKey") ||
      localStorage.getItem("gemini_api_key") ||
      ""
  );
  const [openRouterKeyInput, setOpenRouterKeyInput] = useState(
    () => localStorage.getItem("openrouter_api_key") || ""
  );
  const [aiProvider, setAiProvider] = useState<"gemini" | "openrouter">(
    () =>
      (localStorage.getItem("ai_provider") as "gemini" | "openrouter") ||
      "gemini"
  );
  const [soundType, setSoundType] = useState(
    () => localStorage.getItem("notificationSoundType") || "checkout"
  );
  const [showArticleManager, setShowArticleManager] = useState(false);
  const [showReminderManager, setShowReminderManager] = useState(false);
  const [showAlarmManager, setShowAlarmManager] = useState(false);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [showHomeSectionsManager, setShowHomeSectionsManager] = useState(false);
  const [backupReminder, setBackupReminder] = useState(
    () => localStorage.getItem("backupReminderEnabled") === "true"
  );
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const handleQuickBackup = async () => {
    const success = await quickLocalBackup();
    if (success) {
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 3000);
    } else {
      alert("Aucun emplacement précédent trouvé ou permission refusée. Veuillez utiliser 'Sauvegarder sous...'.");
    }
  };
  const [iconMatcherVersion, setIconMatcherVersion] = useLocalStorage(
    "iconMatcherVersion",
    "1.0.0"
  );
  const [isSyncingIconMatcher, setIsSyncingIconMatcher] = useState(false);

  const handleIconMatcherSync = () => {
    setIsSyncingIconMatcher(true);
    setTimeout(() => {
      // Mock network fetch & update
      const parts = iconMatcherVersion.split(".");
      parts[2] = (parseInt(parts[2] || "0") + 1).toString();
      setIconMatcherVersion(parts.join("."));
      setIsSyncingIconMatcher(false);
    }, 1500);
  };

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
    { id: "bell", label: "Cloche (Bell)" },
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
      `Solde (Dépenses): ${transactions
        .reduce((acc, tx) => (tx.type === "EXPENSE" ? acc + tx.amount : acc), 0)
        .toFixed(2)} ${currency}`,
      14,
      38
    );

    // Table
    const tableData = transactions.map((tx) => [
      tx.date,
      tx.label,
      tx.category || (tx.type === "INCOME" ? "Banque" : "Marché"),
      tx.type === "INCOME"
        ? tx.paidByBank
          ? "Salaire / Dépôt"
          : "Retrait"
        : "Achat",
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
      alert(
        language === "Français"
          ? "Données restaurées avec succès. L'application va redémarrer."
          : "Data restored successfully. App will restart."
      );
      window.location.reload();
    } else {
      alert(
        language === "Français"
          ? "Aucune sauvegarde trouvée ou fichier corrompu."
          : "No backup found or file corrupted."
      );
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
      className="relative min-h-screen bg-slate-50 text-slate-800 font-sans pb-24"
    >
      <AnimatePresence>
        {showSaveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-teal-500 text-white px-6 py-3 rounded-full shadow-xl z-50 flex items-center gap-2"
          >
            <Save size={18} />
            <span className="text-sm font-medium">Sauvegarde réussie !</span>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Background Holographic Motif */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-indigo-50 to-transparent opacity-80" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto space-y-6 px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-800">
              Paramètres
            </h2>
            <p className="text-sm font-bold text-slate-400 mt-1">
              Personnalisez votre expérience
            </p>
          </div>
          <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center border border-slate-100">
            <Settings2 size={24} className="text-purple-500" />
          </div>
        </div>

        {/* Quick Search Bar */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={18} className="text-purple-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un paramètre..."
            className="w-full bg-white border border-slate-100 rounded-[20px] py-4 pl-12 pr-4 text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-purple-200 focus:ring-4 focus:ring-purple-50 transition-all shadow-sm"
          />
        </div>

        {/* Group: Général */}
        <div className="space-y-2">
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-4">
            Général
          </h3>
          <div className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-slate-100">
            <SettingsItem
              icon={<Sparkles />}
              title="Langue"
              subtitle={language}
              onClick={() => setShowSelector("LANGUAGE")}
            />
            <SettingsItem
              icon={<Coins />}
              title="Devise"
              subtitle={`Devise par défaut: ${currency}`}
              onClick={() => setShowSelector("CURRENCY")}
            />
            <SettingsItem
              icon={<Home />}
              title="Sections de l'accueil"
              subtitle="Organiser et masquer les sections"
              onClick={() => setShowHomeSectionsManager(true)}
            />
            <SettingsItem
              icon={<Smartphone />}
              title="Réglages Widget"
              subtitle={
                widgetMode === "spending"
                  ? "Dépenses hebdo"
                  : widgetBalanceType === "cash"
                  ? "Argent Dispo"
                  : "Solde Bancaire"
              }
              onClick={() => setShowSelector("WIDGET_SETTINGS")}
            />
          </div>
        </div>

        {/* Group: Personnalisation */}
        <div className="space-y-2">
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-4">
            Personnalisation
          </h3>
          <div className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-slate-100">
            <div className="px-5 py-4 flex items-center gap-4 bg-white border-b border-slate-100">
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
                <Moon size={20} strokeWidth={2} />
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-bold text-slate-800 tracking-tight">
                  Mode Sombre
                </p>
                <p className="text-[11px] font-medium text-slate-400">
                  {isDarkMode ? "Activé" : "Désactivé"}
                </p>
              </div>
              <Switch
                active={isDarkMode}
                onToggle={() => onDarkModeChange(!isDarkMode)}
              />
            </div>
            <SettingsItem
              icon={<Plus />}
              title="Gestion des articles"
              subtitle={`${predefinedItems.length} articles configurés`}
              onClick={() => setShowArticleManager(true)}
            />
          </div>
        </div>

        {/* Group: Sécurité */}
        <div className="space-y-2">
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-4">
            Sécurité
          </h3>
          <div className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-slate-100">
            <div className="px-5 py-4 flex items-center justify-between bg-white border-b border-slate-100">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
                  <Shield size={20} strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-bold text-slate-800 tracking-tight">
                    Verrouillage App (Code)
                  </p>
                  <p className="text-[11px] font-medium text-slate-400">
                    {appPin ? "Activé" : "Désactivé"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {appPin && (
                  <button
                    onClick={() => {
                      setPinSetupStep(1);
                      setTempPin("");
                      setShowSelector("PIN_SETUP");
                    }}
                    className="text-[10px] font-black uppercase text-indigo-500 bg-indigo-50 px-3 py-1.5 rounded-full active:scale-95 transition-all"
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
            <div className="px-5 py-4 flex items-center justify-between bg-white">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
                  <Sparkles size={20} strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-bold text-slate-800 tracking-tight">
                    Biométrie
                  </p>
                  <p className="text-[11px] font-medium text-slate-400">
                    {appBiometric ? "Activée" : "Désactivée"}
                  </p>
                </div>
              </div>
              <Switch
                active={appBiometric}
                onToggle={() => onAppBiometricChange(!appBiometric)}
              />
            </div>
          </div>
        </div>

        {/* Group: Fonctionnalités Avancées */}
        <div className="space-y-2">
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-4">
            Fonctionnalités
          </h3>
          <div className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-slate-100">
            <SettingsItem
              icon={<Brain />}
              title="Intelligence Artificielle"
              subtitle={
                apiKeyInput || openRouterKeyInput
                  ? "Clé configurée"
                  : "Non configurée (Requise pour scan OCR)"
              }
              onClick={() => setShowSelector("API_SETTINGS")}
            />
            <SettingsItem
              icon={<Bell />}
              title="Notifications & Alertes"
              subtitle="Rappels, alarmes et sauvegarde"
              onClick={() => setShowNotificationCenter(true)}
            />
            <SettingsItem
              icon={<Database />}
              title="Base de données IconMatcher"
              subtitle={
                isSyncingIconMatcher
                  ? "Synchronisation..."
                  : `Version ${iconMatcherVersion}`
              }
              onClick={handleIconMatcherSync}
              showArrow={false}
              rightContent={
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleIconMatcherSync();
                  }}
                  disabled={isSyncingIconMatcher}
                  className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 hover:bg-purple-100 transition-colors disabled:opacity-50"
                  title="Synchroniser"
                >
                  <RefreshCw
                    size={14}
                    className={isSyncingIconMatcher ? "animate-spin" : ""}
                  />
                </button>
              }
            />
          </div>
        </div>

        {/* Group: Données */}
        <div className="space-y-2">
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-4">
            Données
          </h3>
          <div className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-slate-100">
            <SettingsItem
              icon={<Download />}
              title="Rapport PDF"
              subtitle="Télécharger un rapport détaillé"
              onClick={exportToPDF}
            />
            <SettingsItem
              icon={<Save />}
              title="Sauvegarde locale rapide"
              subtitle="Sauvegarder sur le même emplacement"
              onClick={handleQuickBackup}
            />
            <SettingsItem
              icon={<Download />}
              title="Sauvegarder sous..."
              subtitle="Créer ou partager une sauvegarde"
              onClick={async () => await exportDataToFile()}
            />
            <SettingsItem
              icon={<Upload />}
              title="Restaurer"
              subtitle="Importer une sauvegarde"
              onClick={handleRestoreData}
            />
          </div>
        </div>

        {/* Group: Support & Danger */}
        <div className="space-y-2">
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-4">
            Support
          </h3>
          <div className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-slate-100">
            <SettingsItem
              icon={<HelpCircle />}
              title="Aide & Support"
              subtitle="Questions fréquentes et tutoriels"
              onClick={() => setShowHelp(true)}
            />
            <SettingsItem
              icon={<Trash2 />}
              title="Réinitialiser"
              subtitle="Effacer toutes les données"
              onClick={() => setShowResetConfirm(true)}
              danger={true}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
              <Settings2 size={24} className="text-purple-500 opacity-50" />
            </div>
          </div>
          <h3 className="text-lg font-black text-slate-800 tracking-tight">Masrof</h3>
          <p className="text-[11px] font-bold text-slate-400 mt-1">Version 2.0.0</p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <button className="text-xs font-bold text-slate-500 hover:text-purple-500 transition-colors">Conditions</button>
            <div className="w-1 h-1 rounded-full bg-slate-300" />
            <button className="text-xs font-bold text-slate-500 hover:text-purple-500 transition-colors">Confidentialité</button>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-8">© 2026 Masrof. Tous droits réservés.</p>
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
            balanceCustomMessage={balanceCustomMessage}
            onBalanceCustomMessageChange={onBalanceCustomMessageChange}
            bankBalanceThreshold={bankBalanceThreshold}
            onBankBalanceThresholdChange={onBankBalanceThresholdChange}
            bankBalanceCustomMessage={bankBalanceCustomMessage}
            onBankBalanceCustomMessageChange={onBankBalanceCustomMessageChange}
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

      <AnimatePresence>
        {showHomeSectionsManager && (
          <HomeSectionsManagerModal
            onClose={() => setShowHomeSectionsManager(false)}
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
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110] max-w-md mx-auto"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-x-0 bottom-0 z-[120] bg-slate-50 border-t border-slate-100 rounded-t-[32px] p-8 max-h-[85vh] overflow-y-auto max-w-md mx-auto shadow-2xl pb-safe"
            >
              <h3 className="text-xl font-black text-slate-800 mb-6 tracking-tight">
                {showSelector === "WIDGET_SETTINGS"
                  ? "Réglages Widget"
                  : showSelector === "PIN_SETUP"
                  ? "Configurer Code PIN"
                  : showSelector === "API_SETTINGS"
                  ? "Intelligence Artificielle"
                  : `Sélection ${
                      showSelector === "CURRENCY"
                        ? "Devise"
                        : showSelector === "LANGUAGE"
                        ? "Langue"
                        : ""
                    }`}
              </h3>
              <div className="space-y-3">
                {showSelector === "API_SETTINGS" ? (
                  <div className="flex flex-col py-2">
                    <p className="text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-widest">
                      Clé API Google Gemini :
                    </p>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 mb-4 transition-all"
                      placeholder="AIzaSy..."
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                    />

                    <p className="text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-widest">
                      Clé API OpenRouter :
                    </p>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 mb-4 transition-all"
                      placeholder="sk-or-v1-..."
                      value={openRouterKeyInput}
                      onChange={(e) => setOpenRouterKeyInput(e.target.value)}
                    />

                    <p className="text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-widest">
                      Bouton Magique Scanner IA (FAB) :
                    </p>
                    <div
                      className="flex items-center justify-between px-4 py-4 mb-6 bg-slate-50 border border-slate-100 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => setShowScannerFab(!showScannerFab)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
                          <Sparkles size={20} strokeWidth={2} />
                        </div>
                        <div>
                          <h4 className="text-[14px] font-bold text-slate-800 tracking-tight">
                            Afficher le bouton
                          </h4>
                        </div>
                      </div>
                      <Switch
                        active={showScannerFab}
                        onToggle={() => setShowScannerFab(!showScannerFab)}
                      />
                    </div>

                    <button
                      className="w-full bg-purple-500 hover:bg-purple-600 text-white font-black py-4 rounded-2xl transition-colors shadow-lg shadow-purple-500/20 active:scale-95 text-sm"
                      onClick={() => {
                        window.localStorage.setItem(
                          "userGeminiApiKey",
                          apiKeyInput
                        );
                        window.localStorage.setItem(
                          "gemini_api_key",
                          apiKeyInput
                        );
                        window.localStorage.setItem(
                          "openrouter_api_key",
                          openRouterKeyInput
                        );
                        window.localStorage.setItem("ai_provider", aiProvider);
                        setShowSelector(null);
                      }}
                    >
                      Enregistrer
                    </button>
                    <p className="text-[11px] text-slate-400 mt-4 text-center font-medium">
                      Nécessaire pour le scan des factures et articles. Stocké
                      localement.
                    </p>
                  </div>
                ) : showSelector === "PIN_SETUP" ? (
                  <div className="flex flex-col items-center py-6">
                    <p className="text-sm font-bold text-slate-500 mb-8 uppercase tracking-widest text-center">
                      {pinSetupStep === 1
                        ? "Saisissez un code à 4 chiffres"
                        : "Confirmez votre code"}
                    </p>
                    <div
                      className={`flex items-center gap-4 mb-10 ${
                        pinError ? "animate-pulse" : ""
                      }`}
                    >
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`w-4 h-4 rounded-full transition-all duration-300 ${
                            tempPin.length > i
                              ? pinError
                                ? "bg-red-500 scale-110 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                                : "bg-purple-500 scale-110 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                              : "bg-purple-100"
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
                                    localStorage.setItem(
                                      "temp_pin_setup",
                                      newPin
                                    );
                                  } else {
                                    const expected =
                                      localStorage.getItem("temp_pin_setup");
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
                          className="h-14 rounded-full bg-slate-50 text-slate-800 text-xl font-black active:bg-slate-100 active:scale-95 transition-all flex items-center justify-center border border-slate-100"
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
                        className="h-14 rounded-full bg-transparent text-slate-400 active:text-purple-500 active:scale-95 transition-all flex items-center justify-center text-xs font-bold uppercase"
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
                                  localStorage.setItem(
                                    "temp_pin_setup",
                                    newPin
                                  );
                                } else {
                                  const expected =
                                    localStorage.getItem("temp_pin_setup");
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
                        className="h-14 rounded-full bg-slate-50 text-slate-800 text-xl font-black active:bg-slate-100 active:scale-95 transition-all flex items-center justify-center border border-slate-100"
                      >
                        0
                      </button>
                      <button
                        onClick={() => setTempPin((p) => p.slice(0, -1))}
                        className="h-14 rounded-full bg-transparent text-slate-400 active:text-purple-500 active:scale-95 transition-all flex items-center justify-center"
                      >
                        <X size={24} />
                      </button>
                    </div>
                  </div>
                ) : showSelector === "WIDGET_SETTINGS" ? (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                        Données à afficher
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          {
                            id: "cash",
                            label: "Argent Dispo",
                            action: () => {
                              onWidgetModeChange("balance");
                              onWidgetBalanceTypeChange("cash");
                            },
                          },
                          {
                            id: "bank",
                            label: "Solde Bancaire",
                            action: () => {
                              onWidgetModeChange("balance");
                              onWidgetBalanceTypeChange("bank");
                            },
                          },
                          {
                            id: "spending",
                            label: "Dépenses Hebdo",
                            action: () => {
                              onWidgetModeChange("spending");
                            },
                          },
                        ].map((opt) => {
                          const isActive =
                            widgetMode === "spending"
                              ? opt.id === "spending"
                              : opt.id === widgetBalanceType;
                          return (
                            <button
                              key={opt.id}
                              onClick={() => opt.action()}
                              className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between ${
                                isActive
                                  ? "bg-purple-50 border-purple-200 text-purple-600 shadow-sm"
                                  : "border-slate-100 text-slate-500 hover:bg-slate-50"
                              }`}
                            >
                              <span className="font-bold text-sm tracking-tight">
                                {opt.label}
                              </span>
                              {isActive && (
                                <div className="w-5 h-5 rounded-full bg-purple-500 shadow-sm" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                        Couleur du texte
                      </h4>
                      <div className="flex gap-3">
                        {[
                          { id: "#000000", color: "bg-black" },
                          { id: "#FFFFFF", color: "bg-white" },
                          { id: "#3b82f6", color: "bg-blue-500" },
                          { id: "#22c55e", color: "bg-green-500" },
                          { id: "#ef4444", color: "bg-red-500" },
                        ].map((c) => (
                          <button
                            key={c.id}
                            onClick={() => onWidgetTextColorChange(c.id)}
                            className={`w-10 h-10 rounded-full border border-slate-200 transition-all ${
                              c.color
                            } ${
                              widgetTextColor === c.id
                                ? "ring-2 ring-offset-2 ring-purple-500 scale-110 shadow-md opacity-100"
                                : "opacity-60 hover:opacity-100"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => setShowSelector(null)}
                      className="w-full bg-slate-800 text-white rounded-2xl p-4 font-bold tracking-wide text-sm mt-4 active:scale-95 transition-transform shadow-lg shadow-slate-800/20"
                    >
                      Terminé
                    </button>
                  </div>
                ) : (
                  (() => {
                    let options: {
                      id: string;
                      label: string;
                      color?: string;
                    }[] = [];
                    let activeValue = "";

                    if (showSelector === "CURRENCY") {
                      options = currencies.map((c) => ({ id: c, label: c }));
                      activeValue = currency;
                    } else if (showSelector === "LANGUAGE") {
                      options = languages.map((l) => ({ id: l, label: l }));
                      activeValue = language;
                    }

                    return options.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          if (showSelector === "CURRENCY")
                            onCurrencyChange(opt.id);
                          else if (showSelector === "LANGUAGE")
                            onLanguageChange(opt.id);
                          setShowSelector(null);
                        }}
                        className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between group ${
                          activeValue === opt.id
                            ? "border-purple-200 bg-purple-50 text-purple-600 shadow-sm"
                            : "border-slate-100 text-slate-500 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {opt.color && (
                            <div
                              className={`w-6 h-6 rounded-full shadow-sm border border-black/10 ${opt.color}`}
                            />
                          )}
                          <span className="font-bold tracking-tight text-sm">
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
                                  audio
                                    .play()
                                    .catch((err) =>
                                      console.log(
                                        "Erreur de lecture: " + err.message
                                      )
                                    );
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
                  })()
                )}
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
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110] max-w-md mx-auto"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-x-0 bottom-0 z-[120] bg-slate-50 border-t border-slate-100 rounded-t-[32px] p-8 max-w-md mx-auto shadow-2xl text-center pb-safe"
            >
              <div className="w-16 h-16 bg-rose-50 border border-rose-100 rounded-[24px] flex items-center justify-center text-rose-500 mx-auto mb-6 shadow-sm">
                <AlertTriangle
                  size={32}
                  strokeWidth={2}
                  className={isResetting ? "animate-pulse" : ""}
                />
              </div>
              <h3 className="text-2xl font-black text-rose-600 mb-3 tracking-tight">
                {isResetting ? "Réinitialisation..." : "Zone Critique"}
              </h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8">
                {isResetting
                  ? "Veuillez patienter pendant la suppression de vos données."
                  : "Cette action est irréversible. Toutes vos transactions et historiques seront définitivement supprimés."}
              </p>
              {!isResetting && (
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleReset}
                    className="w-full h-14 bg-rose-500 text-white font-bold rounded-2xl shadow-lg shadow-rose-500/20 active:scale-95 transition-transform text-[13px] uppercase tracking-widest"
                  >
                    Confirmer la suppression
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="w-full h-14 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl active:scale-95 transition-colors text-[13px] tracking-widest uppercase hover:bg-slate-50 shadow-sm"
                  >
                    Annuler
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
      className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
        active ? "bg-indigo-500" : "bg-slate-200"
      }`}
    >
      <motion.div
        animate={{
          x: active ? 26 : 2,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
      />
    </button>
  );
}

function AlarmSettingsModal({
  onClose,
  balanceThreshold,
  onBalanceThresholdChange,
  balanceCustomMessage,
  onBalanceCustomMessageChange,
  bankBalanceThreshold,
  onBankBalanceThresholdChange,
  bankBalanceCustomMessage,
  onBankBalanceCustomMessageChange,
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
  balanceCustomMessage: string;
  onBalanceCustomMessageChange: (message: string) => void;
  bankBalanceThreshold: number | null;
  onBankBalanceThresholdChange: (threshold: number | null) => void;
  bankBalanceCustomMessage: string;
  onBankBalanceCustomMessageChange: (message: string) => void;
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
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110] max-w-md mx-auto"
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed inset-x-0 bottom-0 z-[120] bg-slate-50 border-t border-slate-100 rounded-t-[32px] max-h-[85vh] overflow-y-auto max-w-md mx-auto shadow-2xl pb-safe"
      >
        <div className="sticky top-0 bg-slate-50/95 backdrop-blur-xl z-10 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xl font-black text-slate-800 tracking-tight">
            Seuils d'Alertes
          </h3>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-500 hover:bg-slate-100 border border-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <label className="text-[11px] font-bold uppercase text-slate-400 tracking-widest ml-1">
              Solde Compte Bancaire
            </label>
            <div className="flex gap-4">
              <input
                type="number"
                placeholder="Ex: 500"
                value={bankBalanceThreshold ?? ""}
                onChange={(e) =>
                  onBankBalanceThresholdChange(
                    e.target.value ? Number(e.target.value) : null
                  )
                }
                className="w-1/3 h-14 bg-white border border-slate-100 rounded-2xl px-5 font-bold text-slate-800 outline-none focus:border-purple-200 focus:ring-4 focus:ring-purple-50 transition-all shadow-sm"
              />
              <input
                type="text"
                placeholder="Message (Optionnel)"
                value={bankBalanceCustomMessage}
                onChange={(e) =>
                  onBankBalanceCustomMessageChange(e.target.value)
                }
                className="w-2/3 h-14 bg-white border border-slate-100 rounded-2xl px-5 font-bold text-slate-800 outline-none focus:border-purple-200 focus:ring-4 focus:ring-purple-50 transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[11px] font-bold uppercase text-slate-400 tracking-widest ml-1">
              Argent dans ma Poche
            </label>
            <div className="flex gap-4">
              <input
                type="number"
                placeholder="Ex: 50"
                value={balanceThreshold ?? ""}
                onChange={(e) =>
                  onBalanceThresholdChange(
                    e.target.value ? Number(e.target.value) : null
                  )
                }
                className="w-1/3 h-14 bg-white border border-slate-100 rounded-2xl px-5 font-bold text-slate-800 outline-none focus:border-purple-200 focus:ring-4 focus:ring-purple-50 transition-all shadow-sm"
              />
              <input
                type="text"
                placeholder="Message (Optionnel)"
                value={balanceCustomMessage}
                onChange={(e) => onBalanceCustomMessageChange(e.target.value)}
                className="w-2/3 h-14 bg-white border border-slate-100 rounded-2xl px-5 font-bold text-slate-800 outline-none focus:border-purple-200 focus:ring-4 focus:ring-purple-50 transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[11px] font-bold uppercase text-slate-400 tracking-widest ml-1">
              Quantité Stock Article
            </label>
            <div className="flex gap-4">
              <input
                type="number"
                placeholder="Ex: 3"
                value={inventoryAlertThreshold ?? ""}
                onChange={(e) =>
                  onInventoryAlertThresholdChange(
                    e.target.value ? Number(e.target.value) : null
                  )
                }
                className="w-full h-14 bg-white border border-slate-100 rounded-2xl px-5 font-bold text-slate-800 outline-none focus:border-purple-200 focus:ring-4 focus:ring-purple-50 transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[11px] font-bold uppercase text-slate-400 tracking-widest ml-1">
              Budget de Catégorie (%)
            </label>
            <div className="flex gap-4">
              <input
                type="number"
                placeholder="Ex: 90"
                min={0}
                max={100}
                value={budgetAlertThreshold ?? ""}
                onChange={(e) =>
                  onBudgetAlertThresholdChange(
                    e.target.value ? Number(e.target.value) : null
                  )
                }
                className="w-full h-14 bg-white border border-slate-100 rounded-2xl px-5 font-bold text-slate-800 outline-none focus:border-purple-200 focus:ring-4 focus:ring-purple-50 transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[11px] font-bold uppercase text-slate-400 tracking-widest ml-1">
              Intervalle Alarme Sauvegarde (Min)
            </label>
            <div className="flex gap-4">
              <input
                type="number"
                placeholder="Ex: 30"
                value={backupAlertInterval ?? ""}
                onChange={(e) =>
                  onBackupAlertIntervalChange(
                    e.target.value ? Number(e.target.value) : null
                  )
                }
                className="w-full h-14 bg-white border border-slate-100 rounded-2xl px-5 font-bold text-slate-800 outline-none focus:border-purple-200 focus:ring-4 focus:ring-purple-50 transition-all shadow-sm"
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
      reminders.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  };

  const handleAdd = (newReminder: Omit<Reminder, "id">) => {
    onRemindersChange([
      ...reminders,
      {
        ...newReminder,
        id: `rem-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      },
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
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110] max-w-md mx-auto"
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed inset-x-0 bottom-0 z-[120] bg-slate-50 border-t border-slate-100 rounded-t-[32px] p-8 max-w-md mx-auto shadow-2xl max-h-[85vh] overflow-y-auto pb-safe"
      >
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-black text-slate-800 tracking-tight">
            Gestion des Rappels
          </h3>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-500 border border-slate-100 hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="w-full mb-8 py-4 bg-purple-50 border border-dashed border-purple-200 rounded-2xl flex items-center justify-center gap-2 text-purple-500 font-bold tracking-wide hover:bg-purple-100 transition-all text-sm"
        >
          <Plus size={18} />
          Nouveau Rappel
        </button>

        <AnimatePresence>
          {showAddForm && (
            <div className="mb-10 p-6 bg-white rounded-[24px] border border-slate-100 relative shadow-sm">
              <button
                onClick={() => setShowAddForm(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
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
          <label className="text-[11px] font-bold uppercase text-slate-400 tracking-widest ml-1">
            Vos Rappels ({reminders.length})
          </label>
          {reminders.map((reminder) => {
            const isEditing = editingId === reminder.id;
            return (
              <div
                key={reminder.id}
                className="bg-white border border-slate-100 rounded-[24px] p-4 flex items-center gap-4 transition-all hover:shadow-md group shadow-sm"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                    reminder.type === "ACHAT"
                      ? "bg-rose-50 text-rose-500"
                      : reminder.type === "RETRAIT"
                      ? "bg-purple-50 text-purple-500"
                      : "bg-sky-50 text-sky-500"
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
                    <div className="space-y-3 p-2 bg-slate-50 rounded-[16px] border border-slate-100">
                      <input
                        type="text"
                        value={reminder.title}
                        onChange={(e) =>
                          handleUpdate(reminder.id, { title: e.target.value })
                        }
                        className="w-full bg-white border border-slate-100 px-3 py-2 text-sm font-bold rounded-[12px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
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
                            let val = e.target.value.replace(/[^0-9]/g, "");
                            if (val.length >= 3) {
                              val = val.slice(0, 2) + ":" + val.slice(2, 4);
                            }
                            handleUpdate(reminder.id, { time: val });
                          }}
                          className="bg-white border border-slate-100 px-3 py-2 text-sm font-bold rounded-[12px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                        />
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-purple-500 text-white text-[12px] font-bold tracking-wide rounded-[12px]"
                        >
                          OK
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-[14px] font-bold text-slate-800 tracking-tight">
                        {reminder.title}
                      </p>
                      <p className="text-[11px] font-medium text-slate-400 mt-0.5">
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
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isEditing
                        ? "bg-purple-500 text-white"
                        : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                    }`}
                  >
                    {isEditing ? <Check size={14} /> : <Settings2 size={14} />}
                  </button>
                  <button
                    onClick={() => handleDelete(reminder.id)}
                    className="w-8 h-8 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center transition-colors hover:bg-rose-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
          {reminders.length === 0 && !showAddForm && (
            <div className="text-center py-10 opacity-50">
              <Bell size={40} className="mx-auto mb-3 text-slate-400" />
              <p className="text-[11px] font-bold text-slate-400">
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
        <label className="text-[11px] font-bold uppercase text-slate-400 tracking-widest ml-1">
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
                  ? t === "ACHAT"
                    ? "border-rose-100 bg-rose-50 text-rose-500 shadow-sm"
                    : t === "RETRAIT"
                    ? "border-purple-200 bg-purple-50 text-purple-600 shadow-sm"
                    : "border-sky-200 bg-sky-50 text-sky-500 shadow-sm"
                  : "border-slate-100 bg-white text-slate-400 hover:border-slate-200"
              }`}
            >
              {t === "ACHAT" ? (
                <ShoppingBag size={18} strokeWidth={2.5} />
              ) : t === "RETRAIT" ? (
                <ArrowDownToLine size={18} strokeWidth={2.5} />
              ) : (
                <Coins size={18} strokeWidth={2.5} />
              )}
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {t}
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-[11px] font-bold uppercase text-slate-400 tracking-widest ml-1">
          Titre / Description
        </label>
        <input
          type="text"
          placeholder="ex: Rappel mensuel..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full h-14 bg-white border border-slate-100 rounded-2xl px-5 font-bold text-slate-800 placeholder-slate-300 outline-none focus:border-purple-200 focus:ring-4 focus:ring-purple-50 transition-all shadow-sm"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-[11px] font-bold uppercase text-slate-400 tracking-widest ml-1">
          Fréquence
        </label>
        <div className="grid grid-cols-2 gap-3">
          {(["ONCE", "DAILY", "WEEKLY", "MONTHLY"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFrequency(f)}
              className={`p-3 rounded-2xl border text-[11px] font-bold uppercase tracking-wider transition-all ${
                frequency === f
                  ? "border-purple-200 bg-purple-50 text-purple-600 shadow-sm"
                  : "border-slate-100 text-slate-400 hover:bg-slate-50"
              }`}
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
          <label className="text-[11px] font-bold uppercase text-slate-400 tracking-widest ml-1">
            Heure
          </label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="HH:MM"
            maxLength={5}
            value={time}
            onChange={(e) => {
              let val = e.target.value.replace(/[^0-9]/g, "");
              if (val.length >= 3) {
                val = val.slice(0, 2) + ":" + val.slice(2, 4);
              }
              setTime(val);
            }}
            className="w-full h-14 bg-white border border-slate-100 rounded-2xl px-5 font-bold text-slate-800 outline-none focus:border-purple-200 focus:ring-4 focus:ring-purple-50 transition-all shadow-sm"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase text-slate-400 tracking-widest ml-1">
            Date
          </label>
          <input
            ref={dateRef}
            type="date"
            value={date}
            onClick={() => {
              try {
                dateRef.current?.showPicker();
              } catch (e) {}
            }}
            onChange={(e) => setDate(e.target.value)}
            className="w-full h-14 bg-white border border-slate-100 rounded-2xl px-5 font-bold text-slate-800 outline-none focus:border-purple-200 focus:ring-4 focus:ring-purple-50 transition-all shadow-sm"
          />
        </div>
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 h-14 bg-slate-100 text-slate-500 font-bold rounded-2xl uppercase tracking-widest text-[11px] hover:bg-slate-200 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="flex-2 px-6 h-14 bg-purple-500 text-white font-bold rounded-2xl shadow-lg shadow-purple-500/20 uppercase tracking-widest active:scale-95 transition-all text-[11px]"
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
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110] max-w-md mx-auto"
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed inset-x-0 bottom-0 z-[120] bg-slate-50 border-t border-slate-100 rounded-t-[32px] p-8 max-w-md mx-auto shadow-2xl pb-safe"
      >
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-black text-slate-800 tracking-tight">
            Nouveau Rappel
          </h3>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 border border-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-slate-400 tracking-widest ml-1">
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
                      ? t === "ACHAT"
                        ? "border-rose-100 bg-rose-50 text-rose-500 shadow-sm"
                        : t === "RETRAIT"
                        ? "border-purple-200 bg-purple-50 text-purple-600 shadow-sm"
                        : "border-sky-200 bg-sky-50 text-sky-500 shadow-sm"
                      : "border-slate-100 bg-white text-slate-400 hover:border-slate-200"
                  }`}
                >
                  {t === "ACHAT" ? (
                    <ShoppingBag size={18} strokeWidth={2.5} />
                  ) : t === "RETRAIT" ? (
                    <ArrowDownToLine size={18} strokeWidth={2.5} />
                  ) : (
                    <Coins size={18} strokeWidth={2.5} />
                  )}
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    {t}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-slate-400 tracking-widest ml-1">
              Titre / Description
            </label>
            <input
              type="text"
              placeholder="ex: Rappel mensuel..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-14 bg-white border border-slate-100 rounded-2xl px-5 font-bold text-slate-800 placeholder-slate-300 outline-none focus:border-purple-200 focus:ring-4 focus:ring-purple-50 transition-all shadow-sm"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-slate-400 tracking-widest ml-1">
              Fréquence
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(["ONCE", "DAILY", "WEEKLY", "MONTHLY"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFrequency(f)}
                  className={`p-3 rounded-2xl border text-[11px] font-bold uppercase tracking-wider transition-all ${
                    frequency === f
                      ? "border-purple-200 bg-purple-50 text-purple-600 shadow-sm"
                      : "border-slate-100 text-slate-400 hover:bg-slate-50"
                  }`}
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
              <label className="text-[11px] font-bold uppercase text-slate-400 tracking-widest ml-1">
                Heure
              </label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="HH:MM"
                maxLength={5}
                value={time}
                onChange={(e) => {
                  let val = e.target.value.replace(/[^0-9]/g, "");
                  if (val.length >= 3) {
                    val = val.slice(0, 2) + ":" + val.slice(2, 4);
                  }
                  setTime(val);
                }}
                className="w-full h-14 bg-white border border-slate-100 rounded-2xl px-5 font-bold text-slate-800 outline-none focus:border-purple-200 focus:ring-4 focus:ring-purple-50 transition-all shadow-sm"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase text-slate-400 tracking-widest ml-1">
                Date
              </label>
              <input
                ref={dateRef2}
                type="date"
                value={date}
                onClick={() => {
                  try {
                    dateRef2.current?.showPicker();
                  } catch (e) {}
                }}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-14 bg-white border border-slate-100 rounded-2xl px-5 font-bold text-slate-800 outline-none focus:border-purple-200 focus:ring-4 focus:ring-purple-50 transition-all shadow-sm"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full h-16 bg-purple-500 text-white font-bold rounded-2xl shadow-lg shadow-purple-500/20 uppercase tracking-widest active:scale-95 transition-all text-[13px]"
          >
            Activer le Rappel
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
    category: "Gourmandises",
    frequent: false,
    iconName: "Box",
  });

  const handleUpdate = (id: string, updates: Partial<PredefinedItem>) => {
    onItemsChange(
      items.map((item) => (item.id === id ? { ...item, ...updates } : item))
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
      category: "Gourmandises",
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
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110] max-w-md mx-auto"
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed inset-x-0 bottom-0 z-[120] bg-slate-50 border-t border-slate-100 rounded-t-[32px] p-8 max-w-md mx-auto shadow-2xl max-h-[85vh] overflow-y-auto pb-safe"
      >
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-black text-slate-800 tracking-tight">
            Gestion des Articles
          </h3>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-500 border border-slate-100 hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4 mb-10">
          <label className="text-[11px] font-bold uppercase text-slate-400 tracking-widest ml-1">
            Ajouter un Article
          </label>
          <div className="bg-white p-4 rounded-[24px] border border-slate-100 shadow-sm space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Nom"
                value={newItem.name}
                onChange={(e) =>
                  setNewItem({ ...newItem, name: e.target.value })
                }
                className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-purple-200 focus:ring-4 focus:ring-purple-50 transition-all text-slate-800 placeholder-slate-400"
              />
              <input
                type="number"
                placeholder="Prix"
                value={newItem.price}
                onChange={(e) =>
                  setNewItem({ ...newItem, price: e.target.value })
                }
                className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-purple-200 focus:ring-4 focus:ring-purple-50 transition-all text-slate-800 placeholder-slate-400"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setNewItem({ ...newItem, category: cat.id })}
                  className={`flex-shrink-0 px-3 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all ${
                    newItem.category === cat.id
                      ? "border-purple-500 bg-purple-500 text-white shadow-sm shadow-purple-500/20"
                      : "border-slate-100 text-slate-500 bg-slate-50 hover:bg-slate-100"
                  }`}
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
              <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                Achat fréquent ?
              </span>
            </label>
            <button
              onClick={handleAdd}
              disabled={!newItem.name || !newItem.price}
              className="w-full h-12 bg-purple-500 text-white font-bold rounded-xl shadow-sm shadow-purple-500/20 uppercase tracking-widest text-[11px] disabled:opacity-50 active:scale-95 transition-transform"
            >
              Ajouter à la liste
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <label className="text-[11px] font-bold uppercase text-slate-400 tracking-widest ml-1">
              Articles Existants ({items.length})
            </label>
          </div>
          
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={16} className="text-purple-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher un article..."
              onChange={(e) => {
                const query = e.target.value.toLowerCase();
                // We'll implement a simple client-side filter
                // However, state is needed. We can just use standard HTML input filtering
                const els = document.querySelectorAll('.article-item-row');
                els.forEach((el) => {
                  const text = el.getAttribute('data-name')?.toLowerCase() || "";
                  if (text.includes(query)) {
                    (el as HTMLElement).style.display = 'flex';
                  } else {
                    (el as HTMLElement).style.display = 'none';
                  }
                });
              }}
              className="w-full bg-white border border-slate-100 rounded-2xl py-3 pl-11 pr-4 text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-purple-200 focus:ring-4 focus:ring-purple-50 transition-all shadow-sm"
            />
          </div>

          {items.map((item, index) => {
            const IconComp = (ICON_MAP[item.iconName] ||
              ICON_MAP["Box"]) as React.ElementType;
            const cat =
              APP_CATEGORIES.find((c) => c.id === item.category) ||
              APP_CATEGORIES.find((c) => c.id === "Autres")!;
            const isEditing = editingId === item.id;

            return (
              <div
                key={`${item.id}-${index}`}
                data-name={item.name}
                className={`article-item-row bg-white border border-slate-100 rounded-[24px] p-4 flex items-center gap-4 transition-all hover:shadow-md group shadow-sm`}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 group-active:scale-95 transition-transform shadow-sm"
                  style={{ backgroundColor: item.colorHex ? `${item.colorHex}20` : cat.bgColor, color: item.colorHex || cat.colorHex }}
                >
                  {item.iconSvg ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: item.iconSvg }}
                      className="w-5 h-5 flex items-center justify-center text-current svg-container"
                    />
                  ) : (
                    <IconComp size={18} />
                  )}
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
                        className="bg-white border border-slate-100 px-3 py-2 text-sm font-bold rounded-[12px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 shadow-sm"
                      />
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) =>
                          handleUpdate(item.id, {
                            price: parseFloat(e.target.value),
                          })
                        }
                        className="bg-white border border-slate-100 px-3 py-2 text-sm font-bold rounded-[12px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 shadow-sm"
                      />
                    </div>
                  ) : (
                    <>
                      <p className="text-[14px] font-bold text-slate-800 tracking-tight">
                        {item.name}
                      </p>
                      <p className="text-[11px] font-medium text-slate-400 mt-0.5">
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
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      item.frequent
                        ? "bg-amber-100 text-amber-500"
                        : "bg-slate-50 text-slate-300 hover:bg-slate-100"
                    }`}
                  >
                    <Sparkles
                      size={14}
                      fill={item.frequent ? "currentColor" : "none"}
                    />
                  </button>
                  <button
                    onClick={() => setEditingId(isEditing ? null : item.id)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isEditing
                        ? "bg-purple-500 text-white"
                        : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                    }`}
                  >
                    {isEditing ? <Check size={14} /> : <Settings2 size={14} />}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="w-8 h-8 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center transition-colors hover:bg-rose-100"
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
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110] max-w-md mx-auto"
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed inset-x-0 bottom-0 z-[120] bg-slate-50 border-t border-slate-100 rounded-t-[32px] p-8 max-w-md mx-auto shadow-2xl max-h-[85vh] overflow-y-auto scrollbar-hide pb-safe"
      >
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-black text-slate-800 tracking-tight">
            Aide & Support
          </h3>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-8">
          <section>
            <div className="bg-purple-50 border border-purple-100 rounded-[24px] p-6 mb-8 text-center shadow-sm">
              <div className="w-20 h-20 bg-white border border-purple-100 rounded-full flex items-center justify-center text-purple-500 mx-auto mb-4 shadow-sm">
                <HelpCircle size={40} strokeWidth={1} />
              </div>
              <h4 className="text-sm font-black text-purple-600 mb-2 uppercase">
                Besoin d'assistance ?
              </h4>
              <p className="text-[11px] text-purple-400 font-bold mb-6 leading-relaxed uppercase tracking-tighter">
                L'IA MasroF et notre équipe sont à votre service 24/7.
              </p>
              <button
                onClick={() => window.open("mailto:support@masrof.app")}
                className="w-full h-14 bg-purple-500 text-white font-bold rounded-2xl text-[11px] uppercase tracking-widest shadow-lg shadow-purple-500/20 active:scale-95 transition-transform"
              >
                Ouvrir un ticket support
              </button>
            </div>
          </section>

          <section>
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 ml-2">
              Protocoles & FAQ
            </h4>
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-[20px] overflow-hidden border border-slate-100 shadow-sm"
                >
                  <button
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-[12px] font-bold text-slate-800 tracking-tight uppercase">
                      {faq.q}
                    </span>
                    <ChevronRight
                      size={16}
                      className={`text-purple-500 transition-transform ${
                        activeFaq === idx ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {activeFaq === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                      >
                        <div className="p-5 pt-0 text-[12px] text-slate-500 leading-relaxed font-medium border-t border-slate-100/50">
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
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110] max-w-md mx-auto"
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed inset-x-0 bottom-0 z-[120] bg-slate-50 border-t border-slate-100 rounded-t-[32px] max-h-[85vh] overflow-y-auto max-w-md mx-auto shadow-2xl pb-safe"
      >
        <div className="sticky top-0 bg-slate-50/95 backdrop-blur-xl z-10 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xl font-black text-slate-800 tracking-tight">
            Notifications
          </h3>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-500 hover:bg-slate-100 border border-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-white rounded-[24px] overflow-hidden border border-slate-100 shadow-sm flex flex-col">
            <SettingsItem
              icon={<AlarmClock />}
              title="Gestion des rappels"
              subtitle={`${remindersCount} actifs`}
              onClick={onOpenReminderManager}
            />
            <SettingsItem
              icon={<AlertTriangle />}
              title="Seuils d'alertes et alarmes"
              subtitle="Compte Bancaire, Poche, Stock, Budget"
              onClick={onOpenAlarmManager}
            />
          </div>

          <div className="bg-white rounded-[24px] overflow-hidden border border-slate-100 shadow-sm">
            <div className="px-5 py-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-purple-500 bg-purple-50">
                <Bell size={20} strokeWidth={2} />
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-bold text-slate-800 tracking-tight">
                  Rappel de Sauvegarde
                </p>
                <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                  Notifie si non sauvegardées
                </p>
              </div>
              <Switch
                active={backupReminder}
                onToggle={async () => {
                  const newValue = !backupReminder;
                  setBackupReminder(newValue);
                  localStorage.setItem(
                    "backupReminderEnabled",
                    newValue.toString()
                  );
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
    </>
  );
}

function SettingsItem({
  icon,
  title,
  subtitle,
  showArrow = true,
  onClick,
  rightContent,
  danger = false,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  showArrow?: boolean;
  onClick?: () => void;
  rightContent?: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-4 px-5 py-4 bg-white hover:bg-slate-50 transition-colors cursor-pointer group border-b border-slate-100 last:border-none ${
        onClick ? "active:bg-slate-100" : ""
      }`}
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
          danger
            ? "bg-rose-50 text-rose-500"
            : "bg-purple-50 text-purple-500 group-hover:bg-purple-100 group-hover:text-purple-600"
        }`}
      >
        {React.cloneElement(icon as React.ReactElement<any>, {
          size: 20,
          strokeWidth: 2,
        })}
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={`text-[14px] font-bold tracking-tight ${
            danger ? "text-rose-600" : "text-slate-800"
          }`}
        >
          {title}
        </p>
        {subtitle && (
          <p className="text-[11px] font-medium text-slate-400 mt-0.5 line-clamp-1">
            {subtitle}
          </p>
        )}
      </div>
      {rightContent}
      {showArrow && !rightContent && (
        <ChevronRight
          size={18}
          className="text-slate-300 group-hover:text-slate-400 transition-colors"
        />
      )}
    </div>
  );
}

function HomeSectionsManagerModal({ onClose }: { onClose: () => void }) {
  const DEFAULT_HOME_SECTIONS = [
    { id: "mainWidget", label: "Widget Principal", visible: true },
    { id: "quickActions", label: "Actions Rapides", visible: true },
    { id: "latestPurchases", label: "Derniers Achats", visible: true },
    { id: "credits", label: "Mes Crédits", visible: true },
    { id: "summary", label: "Sommaire", visible: true },
    { id: "favorites", label: "Favoris", visible: true },
    { id: "ras", label: "RAS", visible: true },
    { id: "budgets", label: "Budgets par Catégorie", visible: true },
    { id: "inshallah", label: "Estimation du Jour", visible: true },
  ];

  const [sections, setSections] = useLocalStorage<any[]>(
    "homeSectionsOrder",
    DEFAULT_HOME_SECTIONS
  );
  const [localSections, setLocalSections] = useState([...sections]);

  // Ensure any newly added sections in code update are present
  React.useEffect(() => {
    const defaultIds = DEFAULT_HOME_SECTIONS.map((s) => s.id);
    const localIds = localSections.map((s) => s.id);

    // Add missing sections in their correct relative positions based on DEFAULT_HOME_SECTIONS
    const missing = DEFAULT_HOME_SECTIONS.filter(
      (s) => !localIds.includes(s.id)
    );
    if (missing.length > 0) {
      setLocalSections((prev) => {
        let updated = [...prev];
        missing.forEach(missingSection => {
           const defaultIdx = DEFAULT_HOME_SECTIONS.findIndex(s => s.id === missingSection.id);
           if (defaultIdx === -1) {
             updated.push(missingSection);
           } else {
             // Find the section that comes just before it in default
             let insertAfterIdx = -1;
             for (let i = defaultIdx - 1; i >= 0; i--) {
                const predecessorId = DEFAULT_HOME_SECTIONS[i].id;
                const currentIdx = updated.findIndex(s => s.id === predecessorId);
                if (currentIdx !== -1) {
                  insertAfterIdx = currentIdx;
                  break;
                }
             }
             if (insertAfterIdx !== -1) {
               updated.splice(insertAfterIdx + 1, 0, missingSection);
             } else {
               updated.push(missingSection);
             }
           }
        });
        return updated;
      });
    }
  }, []);

  const handleToggleVisibility = (id: string) => {
    setLocalSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s))
    );
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setLocalSections((prev) => {
      const next = [...prev];
      const temp = next[index - 1];
      next[index - 1] = next[index];
      next[index] = temp;
      return next;
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === localSections.length - 1) return;
    setLocalSections((prev) => {
      const next = [...prev];
      const temp = next[index + 1];
      next[index + 1] = next[index];
      next[index] = temp;
      return next;
    });
  };

  const handleSave = () => {
    setSections(localSections);
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
          <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-500">
            <Layout size={20} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">
              Sections de l'Accueil
            </h3>
            <p className="text-sm font-medium text-slate-400 mt-0.5">
              Organisez l'affichage
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 -mx-2 px-2 hide-scrollbar">
          <div className="space-y-3 pb-2">
            {localSections.map((item, index) => {
              const isVisible = item.visible;
              return (
                <div
                  key={item.id}
                  className={`w-full flex items-center justify-between p-3 rounded-[20px] border transition-all shadow-sm ${
                    isVisible
                      ? "border-slate-100 bg-white"
                      : "border-slate-50 bg-slate-50 opacity-70"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleVisibility(item.id)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                        isVisible
                          ? "bg-purple-500 text-white shadow-sm shadow-purple-500/20"
                          : "bg-slate-200 text-slate-400"
                      }`}
                    >
                      {isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                    <span
                      className={`font-bold ${
                        isVisible
                          ? "text-slate-800"
                          : "text-slate-400 line-through"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      disabled={index === 0}
                      onClick={() => handleMoveUp(index)}
                      className={`p-2 rounded-lg flex items-center justify-center transition-colors ${
                        index === 0
                          ? "text-slate-200"
                          : "text-slate-500 hover:bg-slate-100 active:bg-slate-200"
                      }`}
                    >
                      <ArrowUp size={18} />
                    </button>
                    <button
                      disabled={index === localSections.length - 1}
                      onClick={() => handleMoveDown(index)}
                      className={`p-2 rounded-lg flex items-center justify-center transition-colors ${
                        index === localSections.length - 1
                          ? "text-slate-200"
                          : "text-slate-500 hover:bg-slate-100 active:bg-slate-200"
                      }`}
                    >
                      <ArrowDown size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-6 mt-2 shrink-0">
          <button
            onClick={handleSave}
            className="w-full h-14 bg-purple-500 active:bg-purple-600 text-white rounded-2xl font-bold text-[13px] uppercase tracking-widest transition-colors shadow-lg shadow-purple-500/20"
          >
            Appliquer
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
