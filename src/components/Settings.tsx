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
  Settings2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import MasrofLogo from "./Logo";
import { Reminder, PredefinedItem } from "../types";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { ICON_MAP } from "../constants";
import {
  Utensils,
  ShoppingBag,
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
}: SettingsProps) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showSelector, setShowSelector] = useState<
    "CURRENCY" | "LANGUAGE" | null
  >(null);
  const [showArticleManager, setShowArticleManager] = useState(false);
  const [showReminderManager, setShowReminderManager] = useState(false);

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

  const exportToPDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.text("MasroF - Rapport de Transactions", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Généré le: ${new Date().toLocaleString("fr-FR")}`, 14, 30);
    doc.text(
      `Solde actuel: ${transactions.reduce((acc, tx) => (tx.type === "INCOME" ? acc + tx.amount : acc - tx.amount), 0).toFixed(2)} ${currency}`,
      14,
      38,
    );

    // Table
    const tableData = transactions.map((tx) => [
      tx.date,
      tx.label,
      tx.category || (tx.type === "INCOME" ? "Banque" : "Marché"),
      tx.type === "INCOME" ? "Retrait" : "Achat",
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
              icon={<Plus />}
              title="GESTION DES ARTICLES"
              subtitle={`${predefinedItems.length} ARTICLES CONFIGURÉS`}
              onClick={() => setShowArticleManager(true)}
              showArrow={true}
            />
            <SettingsItem
              icon={<Bell />}
              title="GESTION DES RAPPELS"
              subtitle={`${reminders.length} RAPPELS ACTIFS`}
              onClick={() => setShowReminderManager(true)}
              showArrow={true}
            />
            <SettingsItem
              icon={<Download />}
              title="EXPORTER MES DONNÉES"
              subtitle="Télécharger un rapport PDF"
              onClick={exportToPDF}
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
              icon={<Shield />}
              title="MONNAIE"
              subtitle={`Devise par défaut: ${currency}`}
              onClick={() => setShowSelector("CURRENCY")}
              showArrow={true}
            />
          </div>

          {/* Section: Widget Data */}
          <div className="py-4 px-6 bg-[#F0F7F8]/30 space-y-6">
            <div>
              <h3 className="text-[11px] font-black text-[#1B5E66] uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#2D8B96] rounded-full shadow-[0_0_8px_#2D8B96]" />
                DONNÉES DU WIDGET
              </h3>
              <div className="bg-[#2D8B96]/20 p-1.5 rounded-2xl border border-[#2D8B96]/20 inline-flex w-full overflow-hidden">
                <button
                  onClick={() => onWidgetModeChange("balance")}
                  className={`flex-1 py-3 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${widgetMode === "balance" ? "bg-[#E5C366] text-[#1B5E66] shadow-[0_0_15px_rgba(229,195,102,0.4)] scale-[1.02]" : "text-[#1B5E66]/60"}`}
                >
                  SOLDE ACTUEL
                </button>
                <button
                  onClick={() => onWidgetModeChange("spending")}
                  className={`flex-1 py-3 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${widgetMode === "spending" ? "bg-[#E5C366] text-[#1B5E66] shadow-[0_0_15px_rgba(229,195,102,0.4)] scale-[1.02]" : "text-[#1B5E66]/60"}`}
                >
                  DÉPENSES HEBDO
                </button>
              </div>
            </div>

            {widgetMode === "balance" && (
              <div>
                <p className="text-[10px] text-[#1B5E66] font-bold uppercase tracking-widest mb-3">
                  Affichage principal :
                </p>
                <div className="bg-[#2D8B96]/10 p-1.5 rounded-2xl border border-[#2D8B96]/10 inline-flex w-full overflow-hidden">
                  <button
                    onClick={() => onWidgetBalanceTypeChange("cash")}
                    className={`flex-1 py-2 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${widgetBalanceType === "cash" ? "bg-white text-[#1B5E66] shadow-sm" : "text-[#1B5E66]/50"}`}
                  >
                    Argent Dispo
                  </button>
                  <button
                    onClick={() => onWidgetBalanceTypeChange("bank")}
                    className={`flex-1 py-2 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${widgetBalanceType === "bank" ? "bg-white text-[#1B5E66] shadow-sm" : "text-[#1B5E66]/50"}`}
                  >
                    Solde Bancaire
                  </button>
                </div>
              </div>
            )}

            <div>
              <p className="text-[10px] text-[#1B5E66] font-bold uppercase tracking-widest mb-3">
                Couleur d'accentuation :
              </p>
              <div className="flex items-center gap-3">
                {[
                  { id: "default", color: "bg-[#AED8D3]" },
                  { id: "blue", color: "bg-blue-300" },
                  { id: "purple", color: "bg-purple-300" },
                  { id: "rose", color: "bg-rose-300" },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => onWidgetColorChange(c.id as any)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${c.color} ${widgetColor === c.id ? "border-[#1B5E66] scale-110 shadow-md" : "border-transparent opacity-60 hover:opacity-100"}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Section: Widget Native Android */}
          <div className="py-4 px-6 bg-[#F0F7F8]/50 border-t border-[#2D8B96]/5">
            <h3 className="text-[11px] font-black text-[#1B5E66] uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#1B5E66] rounded-full shadow-[0_0_8px_#1B5E66]" />
              WIDGET NATIVE ANDROID
            </h3>
            <p className="text-[10px] text-[#1B5E66] font-bold uppercase tracking-widest mb-3">
              Couleur du texte :
            </p>
            <div className="flex items-center gap-3">
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
                  className={`w-8 h-8 rounded-full border border-gray-300 transition-all ${c.color} ${widgetTextColor === c.id ? "ring-2 ring-offset-2 ring-[#1B5E66] scale-110 shadow-md opacity-100" : "opacity-60 hover:opacity-100"}`}
                />
              ))}
            </div>
            <p className="text-[10px] text-[#1B5E66]/60 mt-3">
              Le fond du widget Android est transparent. Modifiez la couleur du texte pour l'adapter à votre fond d'écran.
            </p>
          </div>

          {/* Section: Alerte Solde */}
          <div className="py-4 px-6 bg-[#F0F7F8]/30 border-t border-[#2D8B96]/5">
            <h3 className="text-[11px] font-black text-[#1B5E66] uppercase tracking-[0.4em] mb-6 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#E5C366] rounded-full shadow-[0_0_8px_#E5C366]" />
              ALERTE SOLDE BAS
            </h3>
            <div className="bg-white/50 p-4 rounded-3xl border border-[#2D8B96]/10 flex flex-col gap-3">
              <p className="text-[10px] text-[#1B5E66] font-bold uppercase tracking-widest">
                Seuil minimal (optionnel) :
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={balanceThreshold ?? ""}
                  onChange={(e) =>
                    onBalanceThresholdChange(
                      e.target.value ? parseFloat(e.target.value) : null,
                    )
                  }
                  placeholder="ex: 500"
                  className="flex-1 h-12 bg-white border border-[#2D8B96]/20 rounded-xl px-4 text-sm font-bold text-[#1B5E66] outline-none focus:border-[#2D8B96]"
                />
                <span className="text-sm font-black text-[#2D8B96] w-12">
                  {currency}
                </span>
              </div>
            </div>
          </div>

          {/* Section: Intelligence IA */}
          <div className="py-4 px-0">
            <h3 className="text-[11px] font-black text-[#1B5E66] uppercase tracking-[0.4em] mb-4 px-6 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#2D8B96] rounded-full shadow-[0_0_8px_#2D8B96]" />
              INTELLIGENCE IA
            </h3>
            <div className="px-6 py-6 flex items-center gap-4 bg-gradient-to-r from-[#2D8B96]/5 to-transparent border-y border-[#2D8B96]/10">
              <div className="w-12 h-12 rounded-full border-2 border-[#2D8B96]/30 flex items-center justify-center text-[#2D8B96] shadow-[0_0_20px_rgba(45,139,150,0.2)]">
                <Brain size={24} strokeWidth={1} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-[#1B5E66] uppercase tracking-tight">
                  Notifications Intelligentes
                </p>
                <p className="text-[9px] font-medium text-[#2D8B96] leading-relaxed uppercase tracking-tighter max-w-[200px]">
                  Notre IA neural network analysis
                </p>
              </div>
              <Switch
                active={aiNotifications}
                onToggle={() => onAiNotificationsChange(!aiNotifications)}
              />
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
                Séléction {showSelector === "CURRENCY" ? "Devise" : "Langue"}
              </h3>
              <div className="space-y-3">
                {(showSelector === "CURRENCY" ? currencies : languages).map(
                  (opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        if (showSelector === "CURRENCY") onCurrencyChange(opt);
                        else onLanguageChange(opt);
                        setShowSelector(null);
                      }}
                      className={`w-full p-5 rounded-2xl border transition-all flex items-center justify-between group ${
                        (showSelector === "CURRENCY" ? currency : language) ===
                        opt
                          ? "border-[#2D8B96] bg-[#2D8B96]/10 text-[#1B5E66] shadow-[0_0_15px_rgba(45,139,150,0.2)]"
                          : "border-[#2D8B96]/10 text-[#1B5E66]/40"
                      }`}
                    >
                      <span className="font-bold italic uppercase tracking-widest text-sm">
                        {opt}
                      </span>
                      {(showSelector === "CURRENCY" ? currency : language) ===
                        opt && (
                        <div className="w-5 h-5 rounded-full bg-[#E5C366] shadow-[0_0_8px_#E5C366]" />
                      )}
                    </button>
                  ),
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
      { ...newReminder, id: `rem-${Date.now()}` },
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
                <div className="w-10 h-10 rounded-xl bg-teal-brand/5 flex items-center justify-center text-teal-brand">
                  {reminder.type === "ACHAT" ? (
                    <CreditCard size={18} />
                  ) : (
                    <ArrowDownRight size={18} />
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
                          type="time"
                          value={reminder.time}
                          onChange={(e) =>
                            handleUpdate(reminder.id, { time: e.target.value })
                          }
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
              className={`p-3 rounded-2xl border text-[10px] font-black uppercase tracking-wider transition-all ${type === t ? "border-[#2D8B96] bg-[#2D8B96]/10 text-[#1B5E66] shadow-[0_0_10px_rgba(45,139,150,0.1)]" : "border-[#2D8B96]/10 text-[#1B5E66]/40"}`}
            >
              {t}
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
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full h-14 bg-white border border-[#2D8B96]/30 rounded-2xl px-5 font-bold text-[#1B5E66] outline-none"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-[#1B5E66]/40 tracking-widest ml-1">
            Date
          </label>
          <input
            type="date"
            value={date}
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
                  className={`p-3 rounded-2xl border text-[10px] font-black uppercase tracking-wider transition-all ${type === t ? "border-[#2D8B96] bg-[#2D8B96]/10 text-[#1B5E66] shadow-[0_0_10px_rgba(45,139,150,0.1)]" : "border-[#2D8B96]/10 text-[#1B5E66]/40"}`}
                >
                  {t}
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
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full h-14 bg-white/50 border border-[#2D8B96]/30 rounded-2xl px-5 font-bold text-[#1B5E66] outline-none"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-[#1B5E66]/40 tracking-widest ml-1">
                Date
              </label>
              <input
                type="date"
                value={date}
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
      id: `item-${Date.now()}`,
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
        {React.cloneElement(icon as React.ReactElement, {
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
