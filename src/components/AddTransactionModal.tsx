import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Check, 
  Utensils, 
  ShoppingBag, 
  Car, 
  Gamepad2, 
  MoreHorizontal 
} from 'lucide-react';

interface Category {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const CATEGORIES: Category[] = [
  { id: 'Nourriture', label: 'Nourriture', icon: <Utensils size={18} />, color: 'text-teal-700', bgColor: 'bg-teal-50' },
  { id: 'Shopping', label: 'Shopping', icon: <ShoppingBag size={18} />, color: 'text-blue-700', bgColor: 'bg-blue-50' },
  { id: 'Transport', label: 'Transport', icon: <Car size={18} />, color: 'text-amber-700', bgColor: 'bg-amber-50' },
  { id: 'Loisirs', label: 'Loisirs', icon: <Gamepad2 size={18} />, color: 'text-orange-700', bgColor: 'bg-orange-50' },
  { id: 'Autres', label: 'Autres', icon: <MoreHorizontal size={18} />, color: 'text-rose-700', bgColor: 'bg-rose-50' },
];

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (label: string, amount: number, type: 'INCOME' | 'EXPENSE', category?: string) => void;
  initialType: 'INCOME' | 'EXPENSE';
}

export default function AddTransactionModal({ isOpen, onClose, onAdd, initialType }: AddTransactionModalProps) {
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>(initialType);
  const [selectedCategory, setSelectedCategory] = useState<string>('Autres');

  React.useEffect(() => {
    if (isOpen) {
      setType(initialType);
      setLabel('');
      setAmount('');
      setSelectedCategory('Autres');
    }
  }, [isOpen, initialType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount) {
      const finalLabel = type === 'INCOME' ? 'Retrait Banque' : (label.trim() || 'Achat');
      onAdd(finalLabel, parseFloat(amount), type, type === 'EXPENSE' ? selectedCategory : undefined);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] max-w-md mx-auto"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-[120] bg-white rounded-t-[40px] p-8 max-w-md mx-auto shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                {type === 'INCOME' ? 'Retrait Banque' : 'Nouvel Achat'}
              </h2>
              <button onClick={onClose} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-4">
                <button
                  type="button"
                  onClick={() => setType('EXPENSE')}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${type === 'EXPENSE' ? 'bg-white text-danger-red shadow-sm' : 'text-slate-400'}`}
                >
                  Achat
                </button>
                <button
                  type="button"
                  onClick={() => setType('INCOME')}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${type === 'INCOME' ? 'bg-white text-bank-blue shadow-sm' : 'text-slate-400'}`}
                >
                  Retrait
                </button>
              </div>

              <div className="space-y-5">
                {type === 'EXPENSE' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Catégorie</label>
                      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
                        {CATEGORIES.map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`flex flex-col items-center gap-2 min-w-[70px] p-3 rounded-2xl border transition-all ${selectedCategory === cat.id ? `border-teal-brand bg-teal-brand/5 ring-2 ring-teal-brand/10` : 'border-slate-100 bg-slate-50'}`}
                          >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cat.bgColor} ${cat.color} ${selectedCategory === cat.id ? 'scale-110' : ''} transition-transform`}>
                              {cat.icon}
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-tight ${selectedCategory === cat.id ? 'text-teal-brand' : 'text-slate-400'}`}>
                              {cat.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Libellé (Optionnel)</label>
                      <input
                        type="text"
                        placeholder="Qu'avez-vous acheté ?"
                        className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-5 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-brand/20 transition-all"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                      />
                    </div>
                  </>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Montant (DH)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    autoFocus={type === 'INCOME'}
                    placeholder="0.0"
                    className="w-full h-16 bg-slate-50 border border-slate-100 rounded-2xl px-5 font-black text-slate-800 text-3xl focus:outline-none focus:ring-2 focus:ring-teal-brand/20 transition-all text-center"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className={`w-full h-16 rounded-3xl flex items-center justify-center gap-3 font-black text-white text-lg shadow-lg transform transition-all active:scale-[0.98] ${type === 'EXPENSE' ? 'bg-danger-red shadow-danger-red/20' : 'bg-bank-blue shadow-bank-blue/20'}`}
              >
                <Check size={24} strokeWidth={3} />
                <span>Confirmer</span>
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
