import fs from 'fs';
const content = fs.readFileSync('src/components/History.tsx', 'utf-8');

const regex = /\{\/\* Stats \*\/\}[\s\S]*?<div className="flex flex-col items-center justify-center relative px-2 mb-4 mt-2">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\{\/\* Quick Actions/;

const newCode = `{/* Stats */}
          <div className="flex flex-col items-center justify-center relative px-2 mb-4 mt-2">
            
            {/* Background Sparkline */}
            <div className="absolute bottom-0 left-0 right-0 h-24 opacity-20 pointer-events-none -mb-4">
              <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                <path 
                  d={generateSparklinePath(filteredTotals.expenseBuckets)} 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-rose-500" 
                />
                <path 
                  d={\`\${generateSparklinePath(filteredTotals.expenseBuckets)} L 100,30 L 0,30 Z\`} 
                  fill="url(#gradient-expense-history)" 
                  stroke="none"
                />
                <defs>
                  <linearGradient id="gradient-expense-history" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.4" className="text-rose-500" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0" className="text-rose-500" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="flex items-center gap-2 mb-4 relative z-10">
              <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shadow-sm ring-4 ring-rose-50">
                <ShoppingCart size={14} strokeWidth={3} />
              </div>
              <span className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em]">{t.achats}</span>
            </div>
            
            <div className="flex items-baseline justify-center relative z-10">
              <span className="text-6xl font-black text-slate-800 tracking-tighter">
                {filteredTotals.totalExpense.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).split(',')[0]}
              </span>
              <span className="text-3xl font-black text-slate-400 tracking-tighter">
                ,{filteredTotals.totalExpense.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).split(',')[1]}
              </span>
              <span className="text-sm ml-2.5 font-bold text-slate-400 uppercase tracking-widest">{currency}</span>
            </div>
            
            <div className="flex items-center gap-2 mt-6 relative z-10">
              <div className="px-4 py-1.5 bg-slate-50/90 backdrop-blur-sm rounded-full border border-slate-100 flex items-center gap-2 shadow-sm">
                 <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total {getTimeframeLabel(timeframe)}</span>
              </div>
              
              {filteredTotals.prevTotalExpense > 0 && (
                <div className={\`px-3 py-1.5 rounded-full border flex items-center gap-1 shadow-sm backdrop-blur-sm \${
                  filteredTotals.trendPercentage > 0 
                    ? 'bg-rose-50/90 border-rose-100 text-rose-600' 
                    : filteredTotals.trendPercentage < 0
                      ? 'bg-emerald-50/90 border-emerald-100 text-emerald-600'
                      : 'bg-slate-50/90 border-slate-100 text-slate-500'
                }\`}>
                  {filteredTotals.trendPercentage > 0 ? (
                    <TrendingUp size={12} strokeWidth={3} />
                  ) : filteredTotals.trendPercentage < 0 ? (
                    <TrendingDown size={12} strokeWidth={3} />
                  ) : (
                    <span className="w-3 h-3 flex items-center justify-center font-bold text-[10px]">-</span>
                  )}
                  <span className="text-[10px] font-black tracking-wider">
                    {Math.abs(filteredTotals.trendPercentage).toFixed(0)}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions`;

const finalContent = content.replace(regex, newCode);
fs.writeFileSync('src/components/History.tsx', finalContent);
