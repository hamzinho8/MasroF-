import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';

interface AddBankBalanceModalProps {
  onClose: () => void;
  onAdd: (amount: number) => void;
  currency: string;
}

export default function AddBankBalanceModal({ onClose, onAdd, currency }: AddBankBalanceModalProps) {
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount && !isNaN(Number(amount))) {
      onAdd(Number(amount));
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
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1001] bg-white p-6 rounded-[28px] w-[300px] shadow-2xl"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-black text-slate-800">Ajouter au solde bancaire</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Montant du salaire / dépôt ({currency})</label>
            <input
              type="number"
              step="0.1"
              required
              autoFocus
              className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-5 font-black text-slate-800 text-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-center"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full h-14 rounded-2xl bg-blue-500 text-white font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all"
          >
            Confirmer
          </button>
        </form>
      </motion.div>
    </>
  );
}
