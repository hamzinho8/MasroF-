import React from 'react';
import { 
  Plus, 
  ShoppingCart, 
  TrendingDown,
  TrendingUp,
  Wallet
} from 'lucide-react';
import { motion } from 'motion/react';

interface Transaction {
  id: string;
  label: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  date: string;
}

interface HomeProps {
  balance: number;
  transactions: Transaction[];
  weeklyAchat: number;
  weeklyBank: number;
}

export default function Home({ balance, transactions, weeklyAchat, weeklyBank }: HomeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      <p className="text-lg font-medium text-slate-600 mb-5">Bonjour, Hamza !</p>

      {/* Balance Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-40 rounded-[24px] overflow-hidden p-6 shadow-lg mb-8 transition-transform hover:scale-[1.02]"
        style={{ background: 'linear-gradient(90deg, #AED8D3 0%, #FAD8A0 100%)' }}
      >
        <div className="relative z-10">
          <h2 className="text-slate-800 font-bold mb-1">Dans ma Poche</h2>
          <div className="text-3xl font-black text-liquid-green mb-1">
            {balance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH
          </div>
          <p className="text-xs text-slate-700 opacity-80">Argent liquide disponible</p>
        </div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 transform scale-150 text-teal-brand">
          <ShoppingCart size={80} />
        </div>
      </motion.div>

      {/* Weekly Summary */}
      <div className="mb-8">
        <h3 className="text-slate-900 font-bold mb-3">Sommaire cette Semaine</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl border-2 border-danger-red/20 bg-danger-red/5 relative overflow-hidden group hover:border-danger-red/40 transition-all">
            <div className="relative z-10">
              <p className="text-xs text-slate-500 mb-1 font-medium">Achat Total</p>
              <p className="text-xl font-black text-danger-red leading-none">{weeklyAchat} DH</p>
            </div>
            <ShoppingCart className="absolute -right-2 -bottom-2 text-danger-red/10 rotate-12 group-hover:scale-110 transition-transform" size={48} />
          </div>
          <div className="p-4 rounded-2xl border-2 border-bank-blue/20 bg-bank-blue/5 relative overflow-hidden group hover:border-bank-blue/40 transition-all">
            <div className="relative z-10">
              <p className="text-xs text-slate-500 mb-1 font-medium">Tirage Banque</p>
              <p className="text-xl font-black text-bank-blue leading-none">{weeklyBank} DH</p>
            </div>
            <Plus className="absolute -right-2 -bottom-2 text-bank-blue/10 rotate-12 group-hover:scale-110 transition-transform" size={48} />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <button className="flex items-center justify-center gap-2 h-14 bg-red-100 text-danger-red rounded-2xl font-bold text-sm hover:bg-red-200 transition-colors shadow-sm">
          <Plus size={18} />
          <span>Ajouter Achat</span>
        </button>
        <button className="flex items-center justify-center gap-2 h-14 bg-blue-100 text-bank-blue rounded-2xl font-bold text-sm hover:bg-blue-200 transition-colors shadow-sm">
          <Plus size={18} />
          <span>Ajouter Retrait</span>
        </button>
      </div>

      {/* Stats Quick View */}
      <div className="mb-8">
        <h3 className="text-slate-900 font-bold mb-3">Analyses de Trésorerie</h3>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2">
          <div className="min-w-[160px] p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Retraits</p>
            <p className="text-lg font-black text-slate-800">8 500 DH</p>
            <div className="h-10 mt-2 flex items-end gap-1 px-1">
              <div className="flex-1 bg-teal-brand/20 h-4 rounded-full" />
              <div className="flex-1 bg-teal-brand/20 h-6 rounded-full" />
              <div className="flex-1 bg-teal-brand/40 h-8 rounded-full" />
              <div className="flex-1 bg-teal-brand h-10 rounded-full" />
            </div>
          </div>
          <div className="min-w-[160px] p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Dépenses</p>
            <p className="text-lg font-black text-slate-800">3 200 DH</p>
            <div className="h-10 mt-2 flex items-end gap-1 px-1">
              <div className="flex-1 bg-rose-400/20 h-8 rounded-full" />
              <div className="flex-1 bg-rose-400/40 h-6 rounded-full" />
              <div className="flex-1 bg-rose-400 h-9 rounded-full" />
              <div className="flex-1 bg-rose-400/30 h-4 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-slate-900 font-bold">Grand Livre</h3>
          <button className="text-xs font-bold text-rose-600 hover:underline">Voir tout</button>
        </div>
        <div className="space-y-3">
          {transactions.map(tx => (
            <div key={tx.id} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-white hover:border-teal-brand/20 hover:shadow-sm transition-all cursor-pointer">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'INCOME' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                {tx.type === 'INCOME' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-800 text-sm">{tx.label}</p>
                <p className="text-[10px] text-slate-400 font-medium">{tx.date}</p>
              </div>
              <p className={`font-black tracking-tight ${tx.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {tx.type === 'INCOME' ? '+' : '-'}{tx.amount.toLocaleString('fr-FR')} DH
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
