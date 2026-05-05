import React, { useState } from 'react';
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
  Pencil
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CreditEntry } from '../types';

interface CreditsProps {
  language: string;
  currency: string;
  entries: CreditEntry[];
  setEntries: React.Dispatch<React.SetStateAction<CreditEntry[]>>;
  onSettle?: (id: string) => void;
}

// Expert decorative backgrounds - Pure "Claire" Clean Style (Background Only)
export const HandReceiveBackground = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="bgGreenClaire" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
    <rect width="200" height="200" rx="40" fill="url(#bgGreenClaire)" />
  </svg>
);

export const HandGiveBackground = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="bgRedClaire" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F43F5E" />
        <stop offset="100%" stopColor="#BE123C" />
      </linearGradient>
    </defs>
    <rect width="200" height="200" rx="40" fill="url(#bgRedClaire)" />
  </svg>
);

export default function Credits({ language, currency, entries, setEntries, onSettle }: CreditsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newType, setNewType] = useState<'OWE_ME' | 'I_OWE'>('OWE_ME');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const translations = {
    'Français': {
      title: 'Gestion des Crédits',
      subtitle: 'Suivez vos dettes et vos créances',
      totalOweMe: 'On me doit',
      totalIOwe: 'Je dois',
      addEntry: 'Ajouter',
      namePlaceholder: 'Nom de la personne',
      amountPlaceholder: 'Montant',
      typeOweMe: 'On me doit (Créance)',
      typeIOwe: 'Je dois (Dette)',
      cancel: 'Annuler',
      confirm: 'Confirmer',
      noEntries: 'Aucun crédit pour le moment',
      history: 'Historique des Crédits',
      owedToMe: 'ON ME DOIT',
      owedByMe: 'JE DOIS',
      settle: 'Régler (Solder)',
      edit: 'Modifier',
    },
    'العربية': {
      title: 'إدارة الديون',
      subtitle: 'تتبع ديونك ومستحقاتك',
      totalOweMe: 'لي عند الآخرين',
      totalIOwe: 'علي للآخرين',
      addEntry: 'إضافة',
      namePlaceholder: 'اسم الشخص',
      amountPlaceholder: 'المبلغ',
      typeOweMe: 'لي عند الآخرين (دين لي)',
      typeIOwe: 'علي للآخرين (دين علي)',
      cancel: 'إلغاء',
      confirm: 'تأكيد',
      noEntries: 'لا توجد ديون حالياً',
      history: 'سجل الديون',
      owedToMe: 'مستحقات لي',
      owedByMe: 'ديون علي',
      settle: 'تسوية (سداد)',
      edit: 'تعديل',
    },
    'English': {
      title: 'Credits Management',
      subtitle: 'Track your debts and loans',
      totalOweMe: 'Owed to me',
      totalIOwe: 'I owe',
      addEntry: 'Add Entry',
      namePlaceholder: 'Person name',
      amountPlaceholder: 'Amount',
      typeOweMe: 'Owed to me (Loan)',
      typeIOwe: 'I owe (Debt)',
      cancel: 'Cancel',
      confirm: 'Confirm',
      noEntries: 'No credits at the moment',
      history: 'Credits History',
      owedToMe: 'Loans',
      owedByMe: 'Debts',
      settle: 'Settle (Delete)',
      edit: 'Modify',
    }
  };

  const t = translations[language as keyof typeof translations] || translations['Français'];
  const isRtl = language === 'العربية';

  const formTitle = editingId 
    ? (language === 'Français' ? 'Modifier le crédit' : language === 'العربية' ? 'تعديل السجل' : 'Edit Credit')
    : t.addEntry;

  const totalOweMe = entries
    .filter(e => e.type === 'OWE_ME')
    .reduce((acc, e) => acc + e.amount, 0);

  const totalIOwe = entries
    .filter(e => e.type === 'I_OWE')
    .reduce((acc, e) => acc + e.amount, 0);

  const handleAddEntry = () => {
    if (!newName || !newAmount) return;

    if (editingId) {
      setEntries(prev => prev.map(e => 
        e.id === editingId 
          ? { ...e, name: newName, amount: parseFloat(newAmount), type: newType }
          : e
      ));
      setEditingId(null);
    } else {
      const newEntry: CreditEntry = {
        id: Date.now().toString(),
        name: newName,
        amount: parseFloat(newAmount),
        type: newType,
        date: new Date().toLocaleDateString(language === 'Français' ? 'fr-FR' : 'en-US'),
      };
      setEntries(prev => [newEntry, ...prev]);
    }
    
    setNewName('');
    setNewAmount('');
    setIsAdding(false);
  };

  const handleEditClick = (entry: CreditEntry) => {
    setEditingId(entry.id);
    setNewName(entry.name);
    setNewAmount(entry.amount.toString());
    setNewType(entry.type);
    setIsAdding(true);
    setActiveMenuId(null);
  };

  const handleSettleEntry = (id: string) => {
    if (onSettle) {
      onSettle(id);
    } else {
      setEntries(prev => prev.filter(e => e.id !== id));
    }
    setActiveMenuId(null);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-7 pb-12"
      onClick={() => setActiveMenuId(null)}
    >
      {/* Counters Section - Side-by-side Rectangular Style */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {/* On me doit - Receive */}
        <div 
          className="flex flex-col h-30 p-5 rounded-[32px] text-white relative overflow-hidden text-center justify-center items-center shadow-xl active:scale-95 transition-transform"
        >
          <HandReceiveBackground className="absolute w-full h-full inset-0 pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center justify-center">
            <p className="text-[10px] uppercase font-black tracking-[0.2em] text-white/90 mb-2">{t.owedToMe}</p>
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-3xl font-black text-white leading-none">{totalOweMe}</span>
              <span className="text-[11px] font-bold text-white opacity-90">{currency}</span>
            </div>
          </div>
        </div>

        {/* Je dois - Give */}
        <div 
          className="flex flex-col h-30 p-5 rounded-[32px] text-white relative overflow-hidden text-center justify-center items-center shadow-xl active:scale-95 transition-transform"
        >
          <HandGiveBackground className="absolute w-full h-full inset-0 pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center justify-center">
            <p className="text-[10px] uppercase font-black tracking-[0.2em] text-white/90 mb-2">{t.owedByMe}</p>
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-3xl font-black text-white leading-none">{totalIOwe}</span>
              <span className="text-[11px] font-bold text-white opacity-90">{currency}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="ps-1">
        <h2 className="text-[28px] font-black text-[#0B1E3F] leading-tight mb-1">{t.title}</h2>
        <p className="text-[14px] text-slate-400 font-medium">{t.subtitle}</p>
      </div>

      <div className="relative">
        <button 
          onClick={(e) => { e.stopPropagation(); setIsAdding(true); }}
          className="w-full h-16 bg-[#0B1220] text-white rounded-[24px] flex items-center justify-center gap-3 font-black shadow-xl shadow-slate-900/20 active:scale-95 transition-all text-lg"
        >
          <UserPlus size={24} strokeWidth={2.5} />
          {t.addEntry}
        </button>
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-slate-800">{formTitle}</h3>
              {editingId && (
                <button 
                  onClick={() => {
                    setIsAdding(false);
                    setEditingId(null);
                    setNewName('');
                    setNewAmount('');
                  }}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600"
                >
                  {t.cancel}
                </button>
              )}
            </div>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder={t.namePlaceholder}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full h-12 px-4 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-teal-brand/30 outline-none font-medium text-slate-800 transition-all"
              />
              <div className="flex gap-4">
                <input 
                  type="number" 
                  placeholder={t.amountPlaceholder}
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="flex-1 h-12 px-4 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-teal-brand/30 outline-none font-black text-slate-800 transition-all text-xl"
                />
                <div className={`h-12 flex items-center px-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-400`}>
                  {currency}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setNewType('OWE_ME')}
                  className={`h-12 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all border-2 ${newType === 'OWE_ME' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-white border-slate-100 text-slate-400'}`}
                >
                  <Coins size={16} />
                  {t.owedToMe}
                </button>
                <button 
                  onClick={() => setNewType('I_OWE')}
                  className={`h-12 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all border-2 ${newType === 'I_OWE' ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-white border-slate-100 text-slate-400'}`}
                >
                  <Wallet size={16} />
                  {t.owedByMe}
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                  setNewName('');
                  setNewAmount('');
                }}
                className="flex-1 h-12 rounded-xl font-bold text-slate-400 hover:bg-slate-50 transition-all"
              >
                {t.cancel}
              </button>
              <button 
                onClick={handleAddEntry}
                className="flex-1 h-12 rounded-xl bg-teal-brand text-white font-black shadow-lg shadow-teal-brand/20 active:scale-95 transition-all"
              >
                {t.confirm}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      <div className="space-y-4 pt-6">
        <h3 className="text-[#0B1E3F] text-xl font-bold flex items-center gap-3 px-1">
          <History size={24} className="text-[#36A292]" />
          {t.history}
        </h3>
        
        {entries.length === 0 ? (
          <div className="text-center py-12 text-slate-400 font-medium italic">
            {t.noEntries}
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map(entry => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                key={entry.id} 
                className="group flex items-center gap-4 p-4 rounded-3xl border border-slate-100 bg-white hover:border-teal-brand/20 hover:shadow-md transition-all relative"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${entry.type === 'OWE_ME' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {entry.type === 'OWE_ME' ? <Coins size={22} strokeWidth={2.5} /> : <Wallet size={22} strokeWidth={2.5} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-slate-800 text-sm truncate">{entry.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{entry.date}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <p className={`font-black text-lg tracking-tight ${entry.type === 'OWE_ME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {entry.amount.toLocaleString()} {currency}
                  </p>
                </div>
                
                {/* 3-dots menu for deleting/managing */}
                <div className="relative">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenuId(activeMenuId === entry.id ? null : entry.id);
                    }}
                    className={`p-3 -m-1 rounded-2xl transition-all ${activeMenuId === entry.id ? 'bg-slate-100 text-slate-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                  >
                    <MoreVertical size={20} strokeWidth={2.5} />
                  </button>
                  <AnimatePresence>
                    {activeMenuId === entry.id && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                        className="absolute right-0 top-full mt-1 w-40 bg-white border border-slate-100 shadow-xl rounded-2xl p-2 z-20"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button 
                          onClick={() => handleEditClick(entry)}
                          className="w-full flex items-center gap-2 p-2.5 text-[11px] font-black uppercase tracking-wider text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
                        >
                          <Pencil size={14} strokeWidth={2.5} />
                          {t.edit}
                        </button>
                        <button 
                          onClick={() => handleSettleEntry(entry.id)}
                          className="w-full flex items-center gap-2 p-2.5 text-[11px] font-black uppercase tracking-wider text-rose-500 hover:bg-rose-50 rounded-xl transition-colors mt-1"
                        >
                          <Trash2 size={14} strokeWidth={2.5} />
                          {t.settle}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

