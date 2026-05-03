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
  Brain
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import MasrofLogo from './Logo';

interface SettingsProps {
  widgetMode: 'balance' | 'spending';
  onWidgetModeChange: (mode: 'balance' | 'spending') => void;
  onResetTransactions: () => void;
  aiNotifications: boolean;
  onAiNotificationsChange: (enabled: boolean) => void;
}

export default function Settings({ 
  widgetMode, 
  onWidgetModeChange, 
  onResetTransactions,
  aiNotifications,
  onAiNotificationsChange
}: SettingsProps) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleReset = () => {
    onResetTransactions();
    setShowResetConfirm(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-10"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800 mb-1">Paramètres</h2>
          <p className="text-sm text-slate-500 font-medium">Personnalisez votre expérience</p>
        </div>
        <div className="w-14 h-14 rounded-full border-2 border-teal-brand shadow-md bg-white flex items-center justify-center">
           <MasrofLogo className="w-12 h-12" />
        </div>
      </div>

      {/* Premium Banner */}
      <div className="p-6 bg-gradient-to-r from-teal-brand to-liquid-green rounded-[32px] text-white relative overflow-hidden shadow-lg shadow-teal-brand/20">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-gold-soft" />
            <span className="text-[10px] font-black uppercase tracking-widest">MasroF Premium</span>
          </div>
          <p className="text-lg font-black italic">Libérez la puissance de l'or</p>
          <p className="text-xs opacity-80 leading-relaxed max-w-[200px]">Exportations illimitées, analyses IA avancées et plus encore.</p>
          <button className="bg-gold-soft text-liquid-green text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-wider mt-2 hover:bg-white transition-colors">
            Découvrir
          </button>
        </div>
        <CreditCard className="absolute -right-6 -bottom-6 text-white/10 rotate-12 scale-[3]" size={80} />
      </div>

      {/* Settings Groups */}
      <div className="space-y-6">
        <section>
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 px-4">Données du Widget</h3>
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
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 px-4">Intelligence IA</h3>
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
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${aiNotifications ? 'bg-teal-brand' : 'bg-slate-200'}`}
                  >
                    <motion.div 
                      animate={{ x: aiNotifications ? 24 : 0 }}
                      className="w-4 h-4 bg-white rounded-full shadow-sm"
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
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 px-4">Compte & Sécurité</h3>
          <div className="bg-white rounded-[32px] border border-slate-100 divide-y divide-slate-50 overflow-hidden shadow-sm">
            <SettingsItem icon={<User size={18} />} title="Profil Personnel" subtitle="Hamza, Houam" />
            <SettingsItem icon={<Shield size={18} />} title="Sécurité" subtitle="Code PIN & Biométrie" />
            <SettingsItem icon={<Bell size={18} />} title="Notifications" subtitle="Alertes de solde & rappels" />
          </div>
        </section>

        <section>
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 px-4">Préférences</h3>
          <div className="bg-white rounded-[32px] border border-slate-100 divide-y divide-slate-50 overflow-hidden shadow-sm">
            <SettingsItem icon={<Moon size={18} />} title="Mode Sombre" subtitle="Automatique" />
            <SettingsItem icon={<HelpCircle size={18} />} title="Aide & Support" showArrow={true} />
          </div>
        </section>

        <section>
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 px-4">Zone de danger</h3>
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

        <button className="w-full flex items-center justify-center gap-2 p-4 text-slate-400 font-black text-xs uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-colors">
          <LogOut size={16} />
          <span>Déconnexion</span>
        </button>
      </div>

      <p className="text-center text-[10px] text-slate-300 font-medium">MasroF v1.2.0 • Made with ❤️ in Morocco</p>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowResetConfirm(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] max-w-md mx-auto"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[120] bg-white rounded-[40px] p-8 max-w-[340px] mx-auto shadow-2xl text-center"
            >
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-danger-red mx-auto mb-6">
                <AlertTriangle size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-3">Êtes-vous sûr ?</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8">
                Cette action est irréversible. Toutes vos transactions et votre solde seront définitivement effacés.
              </p>
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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SettingsItem({ icon, title, subtitle, showArrow = true }: { icon: React.ReactNode, title: string, subtitle?: string, showArrow?: boolean }) {
  return (
    <div className="flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors cursor-pointer group">
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
