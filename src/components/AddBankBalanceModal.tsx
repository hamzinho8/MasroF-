import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Landmark, ArrowDownToLine, Wallet } from 'lucide-react';

interface AddBankBalanceModalProps {
  onClose: () => void;
  onAdd: (amount: number, label: string, category: string) => void;
  currency: string;
}

export default function AddBankBalanceModal({ onClose, onAdd, currency }: AddBankBalanceModalProps) {
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState<'Salaire' | 'Dépôt' | 'Autre'>('Salaire');
  const [customLabel, setCustomLabel] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount && !isNaN(Number(amount))) {
      let finalLabel = source;
      let finalCategory = "Banque";
      if (source === 'Salaire') {
        finalLabel = "Salaire";
        finalCategory = "Salaire";
      } else if (source === 'Dépôt') {
        finalLabel = "Dépôt Bancaire";
        finalCategory = "Dépôt";
      } else {
        finalLabel = customLabel || "Autre Entrée";
        finalCategory = "Autre";
      }
      onAdd(Number(amount), finalLabel, finalCategory);
      onClose();
    }
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[1000] max-w-md mx-auto"
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1001] bg-white p-6 rounded-[28px] w-[320px] shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-black text-slate-800">Ajouter au solde</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Type d'ajout</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSource('Salaire')}
                className={`py-2 px-1 rounded-xl flex flex-col items-center gap-1 transition-all border-2 ${source === 'Salaire' ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-transparent bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
              >
                <Landmark size={18} />
                <span className="text-[9px] font-bold uppercase">Salaire</span>
              </button>
              <button
                type="button"
                onClick={() => setSource('Dépôt')}
                className={`py-2 px-1 rounded-xl flex flex-col items-center gap-1 transition-all border-2 ${source === 'Dépôt' ? 'border-sky-500 bg-sky-50 text-sky-600' : 'border-transparent bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
              >
                <ArrowDownToLine size={18} />
                <span className="text-[9px] font-bold uppercase">Dépôt</span>
              </button>
              <button
                type="button"
                onClick={() => setSource('Autre')}
                className={`py-2 px-1 rounded-xl flex flex-col items-center gap-1 transition-all border-2 ${source === 'Autre' ? 'border-purple-500 bg-purple-50 text-purple-600' : 'border-transparent bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
              >
                <Wallet size={18} />
                <span className="text-[9px] font-bold uppercase">Autre</span>
              </button>
            </div>
          </div>

          {source === 'Autre' && (
            <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2">
              <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Libellé (Optionnel)</label>
              <input
                type="text"
                placeholder="Ex: Remboursement..."
                className="w-full h-12 bg-slate-50 border border-slate-100 rounded-2xl px-4 font-bold text-slate-800 text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Montant ({currency})</label>
            <input
              type="number"
              step="0.1"
              required
              autoFocus
              className={`w-full h-14 bg-slate-50 border-2 rounded-2xl px-5 font-black text-slate-800 text-2xl focus:outline-none transition-all text-center ${source === 'Salaire' ? 'border-emerald-100 focus:border-emerald-500' : source === 'Dépôt' ? 'border-sky-100 focus:border-sky-500' : 'border-purple-100 focus:border-purple-500'}`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className={`w-full h-14 rounded-2xl text-white font-black uppercase tracking-widest shadow-lg active:scale-[0.98] transition-all ${source === 'Salaire' ? 'bg-emerald-500 shadow-emerald-500/20 hover:bg-emerald-600' : source === 'Dépôt' ? 'bg-sky-500 shadow-sky-500/20 hover:bg-sky-600' : 'bg-purple-500 shadow-purple-500/20 hover:bg-purple-600'}`}
          >
            Confirmer
          </button>
        </form>
      </motion.div>
    </>
  );
}
