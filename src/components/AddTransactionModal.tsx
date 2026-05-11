import React, { useState, useMemo } from 'react';
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
import { PredefinedItem } from '../types';
import { ICON_MAP } from '../constants';

interface Category {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const CATEGORIES: Category[] = [
  { id: 'Nourriture', label: 'Nourriture', icon: <Utensils size={18} />, color: 'text-teal-700', bgColor: 'bg-teal-100' },
  { id: 'Shopping', label: 'Shopping', icon: <ShoppingBag size={18} />, color: 'text-rose-600', bgColor: 'bg-rose-100' },
  { id: 'Transport', label: 'Transport', icon: <Car size={18} />, color: 'text-sky-600', bgColor: 'bg-sky-100' },
  { id: 'Loisirs', label: 'Loisirs', icon: <Gamepad2 size={18} />, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  { id: 'Autres', label: 'Autres', icon: <MoreHorizontal size={18} />, color: 'text-slate-600', bgColor: 'bg-slate-100' },
];

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (label: string, amount: number, type: 'INCOME' | 'EXPENSE', category?: string, paidByBank?: boolean) => void;
  initialType: 'INCOME' | 'EXPENSE';
  currency: string;
  predefinedItems: PredefinedItem[];
}

export default function AddTransactionModal({ isOpen, onClose, onAdd, initialType, currency, predefinedItems }: AddTransactionModalProps) {
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>(initialType);
  const [selectedCategory, setSelectedCategory] = useState<string>('Autres');
  const [showFrequent, setShowFrequent] = useState(true);
  const [paidByBank, setPaidByBank] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setType(initialType);
      setLabel('');
      setAmount('');
      setSelectedCategory('Autres');
      setShowFrequent(true);
      setPaidByBank(false);
    }
  }, [isOpen, initialType]);

  const handleCategoryClick = (catId: string) => {
    setSelectedCategory(catId);
    setShowFrequent(false);
  };

  const handleItemSelect = (name: string, price: number, category: string) => {
    setLabel(name);
    setAmount(price.toString());
    setSelectedCategory(category);
  };

  const filteredItems = useMemo(() => {
    if (showFrequent) {
      return predefinedItems.filter(item => item.frequent);
    }
    return predefinedItems.filter(item => item.category === selectedCategory);
  }, [showFrequent, selectedCategory, predefinedItems]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount) {
      const finalLabel = type === 'INCOME' ? 'Retrait Banque' : (label.trim() || 'Achat');
      onAdd(finalLabel, parseFloat(amount), type, type === 'EXPENSE' ? selectedCategory : undefined, paidByBank);
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
              <div className="space-y-5">
                {type === 'EXPENSE' && (
                  <>
                     <div className="space-y-2">
                      <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Catégorie</label>
                      <div className="grid grid-cols-5 gap-2">
                        {CATEGORIES.map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => handleCategoryClick(cat.id)}
                            className={`flex flex-col items-center gap-1.5 p-2 px-1 rounded-2xl border transition-all ${
                              selectedCategory === cat.id && !showFrequent
                                ? `bg-white shadow-md scale-105 border-transparent ring-2 ${
                                    cat.id === 'Nourriture' ? 'ring-teal-500/20' : 
                                    cat.id === 'Shopping' ? 'ring-rose-500/20' : 
                                    cat.id === 'Transport' ? 'ring-sky-500/20' : 
                                    cat.id === 'Loisirs' ? 'ring-purple-500/20' : 
                                    'ring-slate-400/20'
                                  }` 
                                : 'border-slate-100 bg-slate-50 opacity-60'
                            }`}
                          >
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${cat.bgColor} ${cat.color} ${(selectedCategory === cat.id && !showFrequent) ? 'scale-110' : ''} transition-transform`}>
                              {cat.icon}
                            </div>
                            <span className={`text-[8px] font-black uppercase tracking-tight text-center truncate w-full ${
                              (selectedCategory === cat.id && !showFrequent)
                                ? (cat.id === 'Nourriture' ? 'text-teal-600' : 
                                   cat.id === 'Shopping' ? 'text-rose-600' : 
                                   cat.id === 'Transport' ? 'text-sky-600' : 
                                   cat.id === 'Loisirs' ? 'text-purple-600' : 
                                   'text-slate-800')
                                : 'text-slate-400'
                            }`}>
                              {cat.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Predefined Items Quick Select */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between px-1">
                        <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">
                          {showFrequent ? 'Achats Fréquents' : `Articles: ${selectedCategory}`}
                        </label>
                        {!showFrequent && (
                          <button 
                            type="button" 
                            onClick={() => setShowFrequent(true)}
                            className="text-[9px] font-black text-teal-600 uppercase tracking-widest hover:underline"
                          >
                            Voir Fréquents
                          </button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <AnimatePresence mode="popLayout">
                          {filteredItems.map((item) => {
                            const cat = CATEGORIES.find(c => c.id === item.category) || CATEGORIES[4];
                            const IconComponent = (ICON_MAP[item.iconName] || ICON_MAP['Box']) as React.ElementType;
                            return (
                              <motion.button
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                type="button"
                                onClick={() => handleItemSelect(item.name, item.price, item.category)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-full border border-slate-100 shadow-sm transition-all active:scale-95 bg-white hover:border-teal-500/30 ${label === item.name ? 'ring-2 ring-teal-500/20 border-teal-500/50' : ''}`}
                              >
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${cat.bgColor} ${cat.color}`}>
                                  <IconComponent size={14} />
                                </div>
                                <div className="flex flex-col items-start leading-none">
                                  <span className="text-[11px] font-black text-slate-700">{item.name}</span>
                                  <span className="text-[9px] font-bold text-slate-400">{item.price} {currency}</span>
                                </div>
                              </motion.button>
                            );
                          })}
                        </AnimatePresence>
                        {filteredItems.length === 0 && (
                          <p className="text-[10px] text-slate-400 italic px-1 py-1">Mode manuel activé pour cette catégorie</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Libellé (Optionnel)</label>
                      <input
                        type="text"
                        placeholder="Qu'avez-vous acheté ?"
                        className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-5 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all font-mono"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                      />
                    </div>
                  </>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Montant ({currency})</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    autoFocus={type === 'INCOME'}
                    placeholder="0.0"
                    className="w-full h-16 bg-slate-50 border border-slate-100 rounded-2xl px-5 font-black text-slate-800 text-3xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all text-center font-mono"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>

                {type === 'EXPENSE' && (
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-4 rounded-2xl cursor-pointer" onClick={() => setPaidByBank(!paidByBank)}>
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${paidByBank ? 'bg-teal-500 text-white' : 'bg-slate-200 text-transparent'}`}>
                      <Check size={16} strokeWidth={3} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-800 tracking-tight">Payé par solde bancaire</span>
                      <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Ne pas déduire de la poche</span>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className={`w-full h-16 rounded-3xl flex items-center justify-center gap-3 font-black text-white text-lg shadow-lg transform transition-all active:scale-[0.98] ${type === 'EXPENSE' ? 'bg-slate-800 shadow-slate-800/20' : 'bg-teal-brand shadow-teal-brand/20'}`}
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
