import fs from 'fs';

let content = fs.readFileSync('src/components/Home.tsx', 'utf-8');

const targetSection = `<div className="grid grid-cols-1 gap-3">
          <button
            onClick={() => setShowCalendarModal(true)}
            className="text-left p-4 rounded-2xl border-2 border-danger-red/20 bg-danger-red/5 relative overflow-hidden group hover:border-danger-red/40 transition-all cursor-pointer"
          >
            <div className="relative z-10">
              <p className="text-xs text-slate-500 mb-1 font-medium">
                {t.achatTotal}
              </p>
              <p className="text-xl font-black text-danger-red leading-none mb-3">
                {filteredTotals.totalExpense.toLocaleString("fr-FR")} {currency}
              </p>
              <div className="h-0.5 w-full bg-danger-red/30 mt-4 rounded-full" />
            </div>
            <ShoppingCart
              className="absolute -right-2 -bottom-2 text-danger-red/10 rotate-12"
              size={48}
            />
          </button>
        </div>`;

const newSection = `<div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowCalendarModal(true)}
            className="text-left p-4 rounded-2xl border-2 border-danger-red/20 bg-danger-red/5 relative overflow-hidden group hover:border-danger-red/40 transition-all cursor-pointer"
          >
            <div className="relative z-10">
              <p className="text-xs text-slate-500 mb-1 font-medium">
                {t.achatTotal}
              </p>
              <p className="text-xl font-black text-danger-red leading-none mb-3 truncate">
                {filteredTotals.totalExpense.toLocaleString("fr-FR")} <span className="text-sm">{currency}</span>
              </p>
              <div className="h-8 w-full opacity-60">
                <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                  <path 
                    d={generateSparklinePath(filteredTotals.expenseBuckets)} 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="text-danger-red" 
                  />
                  <path 
                    d={\`\${generateSparklinePath(filteredTotals.expenseBuckets)} L 100,30 L 0,30 Z\`} 
                    fill="url(#gradient-expense)" 
                    stroke="none"
                  />
                  <defs>
                    <linearGradient id="gradient-expense" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" className="text-danger-red" />
                      <stop offset="100%" stopColor="currentColor" stopOpacity="0" className="text-danger-red" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
            <ShoppingCart
              className="absolute -right-2 -bottom-2 text-danger-red/10 rotate-12 group-hover:scale-110 transition-transform"
              size={48}
            />
          </button>

          <button
            onClick={() => setShowCalendarModal(true)}
            className="text-left p-4 rounded-2xl border-2 border-blue-500/20 bg-blue-500/5 relative overflow-hidden group hover:border-blue-500/40 transition-all cursor-pointer"
          >
            <div className="relative z-10">
              <p className="text-xs text-slate-500 mb-1 font-medium">
                {t.retraits}
              </p>
              <p className="text-xl font-black text-blue-500 leading-none mb-3 truncate">
                {filteredTotals.totalIncome.toLocaleString("fr-FR")} <span className="text-sm">{currency}</span>
              </p>
              <div className="h-8 w-full opacity-60">
                <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                  <path 
                    d={generateSparklinePath(filteredTotals.incomeBuckets)} 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="text-blue-500" 
                  />
                  <path 
                    d={\`\${generateSparklinePath(filteredTotals.incomeBuckets)} L 100,30 L 0,30 Z\`} 
                    fill="url(#gradient-income)" 
                    stroke="none"
                  />
                  <defs>
                    <linearGradient id="gradient-income" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" className="text-blue-500" />
                      <stop offset="100%" stopColor="currentColor" stopOpacity="0" className="text-blue-500" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
            <ArrowDownToLine
              className="absolute -right-2 -bottom-2 text-blue-500/10 rotate-12 group-hover:scale-110 transition-transform"
              size={48}
            />
          </button>
        </div>`;

content = content.replace(targetSection, newSection);
fs.writeFileSync('src/components/Home.tsx', content);

console.log("Replaced successfully.");
