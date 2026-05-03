import React from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { motion } from 'motion/react';
import { BarChart3, TrendingUp, ShoppingBag, CreditCard } from 'lucide-react';

const COLORS = ['#107B86', '#E5C366', '#B8860B', '#1E90FF', '#B22222'];

const categoryData = [
  { name: 'Nourriture', value: 1200 },
  { name: 'Loisirs', value: 450 },
  { name: 'Transport', value: 300 },
  { name: 'Shopping', value: 850 },
  { name: 'Autres', value: 400 },
];

const trendData = [
  { day: 'Lun', expense: 120, income: 0 },
  { day: 'Mar', expense: 450, income: 0 },
  { day: 'Mer', expense: 200, income: 2000 },
  { day: 'Jeu', expense: 150, income: 0 },
  { day: 'Ven', expense: 800, income: 0 },
  { day: 'Sam', expense: 950, income: 0 },
  { day: 'Dim', expense: 300, income: 0 },
];

export default function Stats() {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">Analyses Avancées</h2>
        <p className="text-sm text-slate-500 font-medium">Vue d'ensemble de vos flux financiers</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-teal-brand/5 p-4 rounded-3xl border border-teal-brand/10">
          <div className="w-10 h-10 bg-teal-brand/10 rounded-xl flex items-center justify-center text-teal-brand mb-3">
             <TrendingUp size={20} />
          </div>
          <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Plus Grand Revenu</p>
          <p className="text-lg font-black text-teal-brand">2 000 DH</p>
        </div>
        <div className="bg-rose-500/5 p-4 rounded-3xl border border-rose-500/10">
          <div className="w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-500 mb-3">
             <ShoppingBag size={20} />
          </div>
          <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Catégorie Phare</p>
          <p className="text-lg font-black text-rose-500">Nourriture</p>
        </div>
      </div>

      {/* Pie Chart: Categories */}
      <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-6 bg-teal-brand rounded-full" />
          <h3 className="text-slate-800 font-bold">Répartition par Catégorie</h3>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Line Chart: Trends */}
      <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-6 bg-gold-soft rounded-full" />
          <h3 className="text-slate-800 font-bold">Flux de la Semaine</h3>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#B22222" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#B22222" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#107B86" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#107B86" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#64748B', fontWeight: 500 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#64748B', fontWeight: 500 }}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area 
                type="monotone" 
                dataKey="expense" 
                stroke="#B22222" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorExpense)" 
                name="Dépenses"
              />
              <Area 
                type="monotone" 
                dataKey="income" 
                stroke="#107B86" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorIncome)" 
                name="Entrées"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insight Card */}
      <div className="p-6 bg-slate-900 rounded-[32px] text-white overflow-hidden relative">
        <div className="relative z-10">
          <p className="text-teal-brand font-black text-xs uppercase tracking-widest mb-2">Conseil Expert</p>
          <p className="text-sm font-medium leading-relaxed opacity-90">
            Vos dépenses en <span className="text-gold-soft font-bold">Nourriture</span> ont augmenté de 12% cette semaine. Pensez à optimiser vos achats groupés pour économiser.
          </p>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-10">
           <BarChart3 size={120} />
        </div>
      </div>
    </motion.div>
  );
}
