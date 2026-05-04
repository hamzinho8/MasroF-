import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Moon, 
  HelpCircle, 
  LogOut,
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
  Calendar as CalendarIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import MasrofLogo from './Logo';
import { Reminder } from '../App';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface SettingsProps {
  widgetMode: 'balance' | 'spending';
  onWidgetModeChange: (mode: 'balance' | 'spending') => void;
  onResetTransactions: () => void;
  aiNotifications: boolean;
  onAiNotificationsChange: (enabled: boolean) => void;
  isDarkMode: boolean;
  onDarkModeChange: (enabled: boolean) => void;
  currency: string;
  onCurrencyChange: (currency: string) => void;
  language: string;
  onLanguageChange: (lang: string) => void;
  userProfile: { name: string, email: string, avatar: string };
  onProfileUpdate: (profile: { name: string, email: string, avatar: string }) => void;
  reminders: Reminder[];
  onRemindersChange: (reminders: Reminder[]) => void;
  transactions: any[];
}

export default function Settings({ 
  widgetMode, 
  onWidgetModeChange, 
  onResetTransactions,
  aiNotifications,
  onAiNotificationsChange,
  isDarkMode,
  onDarkModeChange,
  currency,
  onCurrencyChange,
  language,
  onLanguageChange,
  userProfile,
  onProfileUpdate,
  reminders,
  onRemindersChange,
  transactions
}: SettingsProps) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [showReminderAdd, setShowReminderAdd] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [tempProfile, setTempProfile] = useState(userProfile);
  const [showSelector, setShowSelector] = useState<'CURRENCY' | 'LANGUAGE' | null>(null);

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

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    onProfileUpdate(tempProfile);
    setShowProfileEdit(false);
  };

  const currencies = ['DH', 'EUR', 'USD', 'MAD'];
  const languages = ['Français', 'العربية', 'English'];

  const toggleReminder = (id: string) => {
    onRemindersChange(reminders.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const deleteReminder = (id: string) => {
    onRemindersChange(reminders.filter(r => r.id !== id));
  };

  const addNewReminder = (newReminder: Omit<Reminder, 'id'>) => {
    onRemindersChange([...reminders, { ...newReminder, id: `rem-${Date.now()}` }]);
    setShowReminderAdd(false);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('MasroF - Rapport de Transactions', 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Généré le: ${new Date().toLocaleString('fr-FR')}`, 14, 30);
    doc.text(`Utilisateur: ${userProfile.name}`, 14, 38);
    doc.text(`Solde actuel: ${transactions.reduce((acc, tx) => tx.type === 'INCOME' ? acc + tx.amount : acc - tx.amount, 0).toFixed(2)} ${currency}`, 14, 46);
    
    // Table
    const tableData = transactions.map(tx => [
      tx.date,
      tx.label,
      tx.category || (tx.type === 'INCOME' ? 'Banque' : 'Marché'),
      tx.type === 'INCOME' ? 'Retrait' : 'Achat',
      `${tx.amount.toFixed(2)} ${currency}`
    ]);

    autoTable(doc, {
      startY: 55,
      head: [['Date', 'Description', 'Catégorie', 'Type', 'Montant']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [20, 184, 166] }, // Teal-brand
    });

    doc.save(`Masrof_Rapport_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const labels = {
    'Français': {
      title: 'Paramètres',
      subtitle: 'Personnalisez votre expérience',
      widgetTitle: 'Données du Widget',
      iaTitle: 'Intelligence IA',
      rappelsTitle: 'Rappels Programmés',
      prefTitle: 'Préférences',
      dangerTitle: 'Zone de danger',
      exportTitle: 'Exporter mes données',
      exportSubtitle: 'Télécharger un rapport PDF',
    },
    'العربية': {
      title: 'الإعدادات',
      subtitle: 'خصص تجربتك',
      widgetTitle: 'بيانات الواجهة',
      iaTitle: 'ذكاء اصطناعي',
      rappelsTitle: 'التذكيرات المبرمجة',
      prefTitle: 'التفضيلات',
      dangerTitle: 'منطقة الخطر',
      exportTitle: 'تصدير بياناتي',
      exportSubtitle: 'تحميل تقرير PDF',
    },
    'English': {
      title: 'Settings',
      subtitle: 'Customize your experience',
      widgetTitle: 'Widget Data',
      iaTitle: 'AI Intelligence',
      rappelsTitle: 'Scheduled Reminders',
      prefTitle: 'Preferences',
      dangerTitle: 'Danger Zone',
      exportTitle: 'Export my data',
      exportSubtitle: 'Download PDF report',
    }
  };

  const currentLabels = labels[language as keyof typeof labels] || labels['Français'];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-10"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800 mb-1">{currentLabels.title}</h2>
          <p className="text-sm text-slate-500 font-medium">{currentLabels.subtitle}</p>
        </div>
        <button 
          onClick={() => setShowProfileEdit(true)}
          className="relative group active:scale-95 transition-transform"
        >
          <div className="w-14 h-14 rounded-full border-2 border-teal-brand shadow-md bg-white flex items-center justify-center overflow-hidden">
             {userProfile.avatar ? (
               <img src={userProfile.avatar} alt="Avatar" className="w-full h-full object-cover" />
             ) : (
               <MasrofLogo className="w-12 h-12" currency={currency} />
             )}
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-teal-brand rounded-full border-4 border-white flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform">
            <User size={10} />
          </div>
        </button>
      </div>

      {/* Reset Success Message */}
      <AnimatePresence>
        {resetSuccess && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-liquid-green/10 border border-liquid-green/20 rounded-2xl flex items-center gap-3 text-liquid-green"
          >
            <Check size={18} />
            <span className="text-xs font-black uppercase tracking-wider">Données réinitialisées avec succès !</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Groups */}
      <div className="space-y-6">
        <section>
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 px-4">{currentLabels.widgetTitle}</h3>
          <div className="bg-white rounded-[32px] border border-slate-100 p-4 shadow-sm">
            <div className="flex bg-slate-100 p-1.5 rounded-2xl">
              <button
                onClick={() => onWidgetModeChange('balance')}
                className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${widgetMode === 'balance' ? 'bg-white text-teal-brand shadow-sm' : 'text-slate-400'}`}
              >
                Solde Actuel
              </button>
              <button
                onClick={() => onWidgetModeChange('spending')}
                className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${widgetMode === 'spending' ? 'bg-white text-teal-brand shadow-sm' : 'text-slate-400'}`}
              >
                Dépenses Hebdo
              </button>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 px-4">{currentLabels.iaTitle}</h3>
          <div className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-brand/10 flex items-center justify-center text-teal-brand shrink-0">
                <Brain size={24} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-black text-slate-800">Notifications Intelligentes</h4>
                  <button 
                    onClick={() => onAiNotificationsChange(!aiNotifications)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 relative ${aiNotifications ? 'bg-teal-brand' : 'bg-slate-200'}`}
                  >
                    <motion.div 
                      layout
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className={`w-4 h-4 bg-white rounded-full shadow-sm absolute top-1 ${aiNotifications ? 'right-1' : 'left-1'}`}
                    />
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                  Notre IA analyse vos habitudes de dépenses pour vous suggérer des économies personnalisées et des alertes intelligentes.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4 px-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">{currentLabels.rappelsTitle}</h3>
            <button 
              onClick={() => setShowReminderAdd(true)}
              className="w-8 h-8 rounded-full bg-teal-brand text-white flex items-center justify-center active:scale-95 transition-transform"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {reminders.length === 0 ? (
                <div className="bg-white rounded-[24px] border border-slate-100 p-6 text-center shadow-sm">
                  <p className="text-xs text-slate-400 font-medium italic">Aucun rappel programmé</p>
                </div>
              ) : (
                reminders.map((reminder) => (
                  <motion.div 
                    layout
                    key={reminder.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="bg-white rounded-[28px] border border-slate-100 p-5 shadow-sm flex items-center gap-4 group"
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${reminder.enabled ? 'bg-teal-brand/10 text-teal-brand' : 'bg-slate-50 text-slate-300'}`}>
                      {reminder.type === 'ACHAT' ? <CreditCard size={20} /> : reminder.type === 'RETRAIT' ? <AlarmClock size={20} /> : <Clock size={20} />}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-black transition-colors ${reminder.enabled ? 'text-slate-800' : 'text-slate-400 line-through'}`}>{reminder.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-black uppercase tracking-tighter transition-colors ${reminder.enabled ? 'text-teal-brand' : 'text-slate-300'}`}>
                          {reminder.time}
                        </span>
                        {reminder.frequency && reminder.frequency !== 'ONCE' && (
                          <>
                            <span className="text-slate-200">|</span>
                            <span className="text-[10px] font-bold text-teal-brand/70 uppercase tracking-tighter">
                              {reminder.frequency === 'DAILY' ? 'Chaque jour' : reminder.frequency === 'WEEKLY' ? 'Chaque semaine' : 'Chaque mois'}
                            </span>
                          </>
                        )}
                        {reminder.date && (
                          <>
                            <span className="text-slate-200">|</span>
                            <span className="text-[10px] font-medium text-slate-400">{reminder.date}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                         onClick={() => deleteReminder(reminder.id)}
                         className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                      <button 
                        onClick={() => toggleReminder(reminder.id)}
                        className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 relative ${reminder.enabled ? 'bg-teal-brand' : 'bg-slate-200'}`}
                      >
                        <motion.div 
                          layout
                          className={`w-4 h-4 bg-white rounded-full shadow-sm absolute top-1 ${reminder.enabled ? 'right-1' : 'left-1'}`}
                        />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </section>


        <section>
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 px-4">{currentLabels.prefTitle}</h3>
          <div className="bg-white rounded-[32px] border border-slate-100 divide-y divide-slate-50 overflow-hidden shadow-sm">
            <div className="flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors cursor-pointer group" onClick={() => onDarkModeChange(!isDarkMode)}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isDarkMode ? 'bg-slate-800 text-gold-soft' : 'bg-slate-50 text-slate-400'}`}>
                <Moon size={18} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-800">Mode Sombre</p>
                <p className="text-[10px] text-slate-400 font-medium">{isDarkMode ? 'Activé' : 'Désactivé'}</p>
              </div>
              <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 relative ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                <motion.div 
                  layout
                  className={`w-4 h-4 bg-white rounded-full shadow-sm absolute top-1 ${isDarkMode ? 'right-1' : 'left-1'}`}
                />
              </div>
            </div>
            <SettingsItem 
              icon={<Shield size={18} />} 
              title="Monnaie" 
              subtitle={`Devise par défaut: ${currency}`} 
              onClick={() => setShowSelector('CURRENCY')}
            />
            <SettingsItem 
              icon={<Sparkles size={18} />} 
              title="Langue" 
              subtitle={language} 
              onClick={() => setShowSelector('LANGUAGE')}
            />
            <SettingsItem 
              icon={<HelpCircle size={18} />} 
              title="Aide & Support" 
              onClick={() => setShowHelp(true)}
              showArrow={true} 
            />
          </div>
        </section>

        <section>
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 px-4">{currentLabels.exportTitle}</h3>
          <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
            <button 
              onClick={exportToPDF}
              className="w-full flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors group"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-brand/10 flex items-center justify-center text-teal-brand transition-colors">
                <CreditCard size={18} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-bold text-slate-800">{currentLabels.exportTitle}</p>
                <p className="text-[10px] text-slate-400 font-medium">{currentLabels.exportSubtitle}</p>
              </div>
              <ChevronRight size={16} className="text-slate-300" />
            </button>
          </div>
        </section>

        <section>
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 px-4">{currentLabels.dangerTitle}</h3>
          <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
            <button 
              onClick={() => setShowResetConfirm(true)}
              className="w-full flex items-center gap-4 p-5 hover:bg-red-50 transition-colors group"
            >
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-danger-red transition-colors">
                <Trash2 size={18} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-bold text-danger-red">Réinitialiser les données</p>
                <p className="text-[10px] text-slate-400 font-medium">Efface l'historique et remet le solde à zéro</p>
              </div>
              <ChevronRight size={16} className="text-slate-300" />
            </button>
          </div>
        </section>

        <button 
          onClick={() => {
            if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
              window.location.reload();
            }
          }}
          className="w-full h-14 flex items-center justify-center gap-2 text-slate-400 font-black text-xs uppercase tracking-widest hover:bg-slate-100 rounded-[24px] transition-all hover:text-slate-600 active:scale-95"
        >
          <LogOut size={16} />
          <span>Déconnexion</span>
        </button>
      </div>

      <p className="text-center text-[10px] text-slate-300 font-medium pb-10">MasroF v1.2.0 • Made with ❤️ in Morocco</p>

      {/* Help & Support Modal */}
      <AnimatePresence>
        {showHelp && (
          <SupportModal onClose={() => setShowHelp(false)} />
        )}
      </AnimatePresence>

      {/* Reminder Add Modal */}
      <AnimatePresence>
        {showReminderAdd && (
          <ReminderForm onClose={() => setShowReminderAdd(false)} onSave={addNewReminder} />
        )}
      </AnimatePresence>

      {/* Profile Edit Modal */}
      <AnimatePresence>
        {showProfileEdit && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowProfileEdit(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] max-w-md mx-auto"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed inset-x-4 bottom-4 z-[120] bg-white rounded-[40px] p-8 max-w-md mx-auto shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Modifier Profil</h3>
                <button onClick={() => setShowProfileEdit(false)} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleProfileSave} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Nom Complet</label>
                  <input 
                    type="text" 
                    value={tempProfile.name}
                    onChange={(e) => setTempProfile({...tempProfile, name: e.target.value})}
                    className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-5 font-bold text-slate-800"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Email</label>
                  <input 
                    type="email" 
                    value={tempProfile.email}
                    onChange={(e) => setTempProfile({...tempProfile, email: e.target.value})}
                    className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-5 font-bold text-slate-800"
                  />
                </div>
                <button type="submit" className="w-full h-16 bg-teal-brand text-white font-black rounded-2xl shadow-lg shadow-teal-brand/20">
                  Enregistrer les modifications
                </button>
              </form>
            </motion.div>
          </>
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
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] max-w-md mx-auto"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed inset-x-4 bottom-4 z-[120] bg-white rounded-[40px] p-8 max-w-md mx-auto shadow-2xl"
            >
              <h3 className="text-xl font-black text-slate-800 mb-6">
                Sélectionner {showSelector === 'CURRENCY' ? 'la Devise' : 'la Langue'}
              </h3>
              <div className="space-y-3">
                {(showSelector === 'CURRENCY' ? currencies : languages).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      if (showSelector === 'CURRENCY') onCurrencyChange(opt);
                      else onLanguageChange(opt);
                      setShowSelector(null);
                    }}
                    className={`w-full p-5 rounded-2xl border transition-all flex items-center justify-between ${
                      (showSelector === 'CURRENCY' ? currency : language) === opt 
                        ? 'border-teal-brand bg-teal-brand/5 text-teal-brand' 
                        : 'border-slate-100 text-slate-600'
                    }`}
                  >
                    <span className="font-bold">{opt}</span>
                    {(showSelector === 'CURRENCY' ? currency : language) === opt && <Check size={18} />}
                  </button>
                ))}
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
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] max-w-md mx-auto"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[120] bg-white rounded-[40px] p-8 max-w-[340px] mx-auto shadow-2xl text-center"
            >
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-danger-red mx-auto mb-6">
                <AlertTriangle size={40} className={isResetting ? "animate-pulse" : ""} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-3">
                {isResetting ? 'Réinitialisation...' : 'Êtes-vous sûr ?'}
              </h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8">
                {isResetting 
                  ? 'Veuillez patienter pendant que nous effaçons vos données.' 
                  : 'Cette action est irréversible. Toutes vos transactions et votre solde seront définitivement effacés.'}
              </p>
              {!isResetting && (
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleReset}
                    className="w-full h-14 bg-danger-red text-white font-black rounded-2xl shadow-lg shadow-danger-red/20 active:scale-95 transition-transform"
                  >
                    Oui, réinitialiser
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="w-full h-14 bg-slate-100 text-slate-500 font-black rounded-2xl active:scale-95 transition-transform"
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

function ReminderForm({ onClose, onSave }: { onClose: () => void, onSave: (reminder: Omit<Reminder, 'id'>) => void }) {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('08:00');
  const [date, setDate] = useState('');
  const [frequency, setFrequency] = useState<'ONCE' | 'DAILY' | 'WEEKLY' | 'MONTHLY'>('ONCE');
  const [type, setType] = useState<'ACHAT' | 'RETRAIT' | 'AUTRE'>('AUTRE');

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
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] max-w-md mx-auto"
      />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        className="fixed inset-x-4 bottom-4 z-[120] bg-white rounded-[40px] p-8 max-w-md mx-auto shadow-2xl"
      >
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">Nouveau Rappel</h3>
          <button onClick={onClose} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Type de Rappel</label>
            <div className="grid grid-cols-3 gap-3">
              {(['ACHAT', 'RETRAIT', 'AUTRE'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`p-3 rounded-2xl border text-[10px] font-black uppercase tracking-wider transition-all ${type === t ? 'border-teal-brand bg-teal-brand/5 text-teal-brand' : 'border-slate-100 text-slate-400'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Titre / Description</label>
            <input 
              type="text" 
              placeholder="ex: Me rappeler de saisir mes achats"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-5 font-bold text-slate-800"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Fréquence</label>
            <div className="grid grid-cols-2 gap-3">
              {(['ONCE', 'DAILY', 'WEEKLY', 'MONTHLY'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFrequency(f)}
                  className={`p-3 rounded-2xl border text-[10px] font-black uppercase tracking-wider transition-all ${frequency === f ? 'border-teal-brand bg-teal-brand/5 text-teal-brand' : 'border-slate-100 text-slate-400'}`}
                >
                  {f === 'ONCE' ? 'Une fois' : f === 'DAILY' ? 'Quotidien' : f === 'WEEKLY' ? 'Hebdo' : 'Mensuel'}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Heure</label>
              <input 
                type="time" 
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-5 font-bold text-slate-800"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Date (Optionnel)</label>
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-5 font-bold text-slate-800"
              />
            </div>
          </div>
          <button type="submit" className="w-full h-16 bg-teal-brand text-white font-black rounded-2xl shadow-lg shadow-teal-brand/20 mt-4">
            Programmer le rappel
          </button>
        </form>
      </motion.div>
    </>
  );
}

function SupportModal({ onClose }: { onClose: () => void }) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    { q: "Comment ajouter un revenu ?", a: "Appuyez sur le bouton '+' en bas de l'écran d'accueil, puis sélectionnez 'Retrait Banque' pour ajouter de l'argent à votre compte." },
    { q: "Puis-je exporter mes données ?", a: "Cette fonctionnalité arrive bientôt dans la version v1.3.0 ! Vous pourrez exporter en PDF et CSV." },
    { q: "Le mode sombre est-il disponible ?", a: "Oui, vous pouvez l'activer directement dans la section 'Préférences' des paramètres." },
    { q: "Mes données sont-elles sécurisées ?", a: "Absolument. MasroF stocke toutes vos données localement sur votre appareil pour une confidentialité totale." }
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] max-w-md mx-auto"
      />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        className="fixed inset-x-4 bottom-4 z-[120] bg-white rounded-[40px] p-8 max-w-md mx-auto shadow-2xl max-h-[85vh] overflow-y-auto scrollbar-hide"
      >
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">Aide & Support</h3>
          <button onClick={onClose} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-8">
          <section>
            <div className="bg-teal-brand/5 border border-teal-brand/10 rounded-3xl p-6 mb-8 text-center">
              <div className="w-16 h-16 bg-teal-brand/10 rounded-full flex items-center justify-center text-teal-brand mx-auto mb-4">
                <HelpCircle size={32} />
              </div>
              <h4 className="text-sm font-black text-slate-800 mb-2">Besoin d'aide supplémentaire ?</h4>
              <p className="text-[10px] text-slate-500 font-medium mb-4 leading-relaxed">
                Notre équipe est disponible pour répondre à toutes vos questions sur l'application.
              </p>
              <button 
                onClick={() => window.open('mailto:support@masrof.app')}
                className="w-full h-12 bg-teal-brand text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-lg shadow-teal-brand/20 active:scale-95 transition-transform"
              >
                Contacter le support
              </button>
            </div>
          </section>

          <section>
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Questions Fréquentes</h4>
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
                  <button 
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between"
                  >
                    <span className="text-[13px] font-bold text-slate-700">{faq.q}</span>
                    <ChevronRight size={16} className={`text-slate-400 transition-transform ${activeFaq === idx ? 'rotate-90' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {activeFaq === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                      >
                        <div className="p-5 pt-0 text-[11px] text-slate-500 leading-relaxed font-medium bg-white/50">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </section>
          
          <div className="pt-4 pb-4">
            <p className="text-[10px] text-slate-300 text-center font-medium italic">
              Vous utilisez la version d'évaluation v1.2.0. Copyright © 2026 Masrof App Group.
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
}

function SettingsItem({ icon, title, subtitle, showArrow = true, onClick }: { 
  icon: React.ReactNode, 
  title: string, 
  subtitle?: string, 
  showArrow?: boolean,
  onClick?: () => void 
}) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors cursor-pointer group ${onClick ? 'active:scale-[0.98]' : ''}`}
    >
      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-teal-brand/10 group-hover:text-teal-brand transition-colors">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-slate-800">{title}</p>
        {subtitle && <p className="text-[10px] text-slate-400 font-medium">{subtitle}</p>}
      </div>
      {showArrow && <ChevronRight size={16} className="text-slate-300" />}
    </div>
  );
}
