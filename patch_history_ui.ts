import fs from 'fs';
const content = fs.readFileSync('src/components/History.tsx', 'utf-8');

const regex = /\{\/\* Premium Summary Card \*\/\}[\s\S]*?\{\/\* Quick Actions - Identical to Home style \*\/\}/;

const newCode = `{/* Premium Summary Card */}
      <div className="relative overflow-hidden rounded-[40px] shadow-2xl shadow-slate-200/50 border border-white/80 bg-white">
        {/* Background Gradient & Decorative Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-white z-0" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/5 rounded-full blur-3xl" />
        
        <div className="relative z-10 p-6">
          {/* Header with Full-Width Selector */}
          <div className="flex bg-slate-100/50 p-1.5 rounded-[28px] shadow-inner border border-slate-200/50 mb-10">
            <button 
              onClick={() => setTimeframe('day')}
              className={\`flex-1 py-3 px-2 rounded-[22px] flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all duration-300 \${timeframe === 'day' ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/50' : 'text-slate-500 hover:text-slate-700'}\`}
            >
              <CalendarCheck size={16} strokeWidth={timeframe === 'day' ? 3 : 2} className={timeframe === 'day' ? 'text-rose-500' : ''} />
              <span className="text-[10px] font-bold uppercase tracking-widest">{getTimeframeLabel('day')}</span>
            </button>
            <button 
              onClick={() => setTimeframe('week')}
              className={\`flex-1 py-3 px-2 rounded-[22px] flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all duration-300 \${timeframe === 'week' ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/50' : 'text-slate-500 hover:text-slate-700'}\`}
            >
              <CalendarRange size={16} strokeWidth={timeframe === 'week' ? 3 : 2} className={timeframe === 'week' ? 'text-rose-500' : ''} />
              <span className="text-[10px] font-bold uppercase tracking-widest">{getTimeframeLabel('week')}</span>
            </button>
            <button 
              onClick={() => setTimeframe('month')}
              className={\`flex-1 py-3 px-2 rounded-[22px] flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all duration-300 \${timeframe === 'month' ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/50' : 'text-slate-500 hover:text-slate-700'}\`}
            >
              <CalendarDays size={16} strokeWidth={timeframe === 'month' ? 3 : 2} className={timeframe === 'month' ? 'text-rose-500' : ''} />
              <span className="text-[10px] font-bold uppercase tracking-widest">{getTimeframeLabel('month')}</span>
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-col items-center justify-center relative px-2 mb-4 mt-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shadow-sm ring-4 ring-rose-50">
                <ShoppingCart size={14} strokeWidth={3} />
              </div>
              <span className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em]">{t.achats}</span>
            </div>
            
            <div className="flex items-baseline justify-center">
              <span className="text-6xl font-black text-slate-800 tracking-tighter">
                {filteredTotals.totalExpense.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).split(',')[0]}
              </span>
              <span className="text-3xl font-black text-slate-400 tracking-tighter">
                ,{filteredTotals.totalExpense.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).split(',')[1]}
              </span>
              <span className="text-sm ml-2.5 font-bold text-slate-400 uppercase tracking-widest">{currency}</span>
            </div>
            
            <div className="mt-6 px-4 py-1.5 bg-slate-50 rounded-full border border-slate-100 flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total {getTimeframeLabel(timeframe)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions - Identical to Home style */}`;

const finalContent = content.replace(regex, newCode);
fs.writeFileSync('src/components/History.tsx', finalContent);
