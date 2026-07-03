import fs from 'fs';
const content = fs.readFileSync('src/components/History.tsx', 'utf-8');

const regex = /\{\/\* Stats Grid \*\/\}[\s\S]*?<\/div>\s*<\/div>\s*\{\/\* Quick Actions/;
const newCode = `{/* Stats */}
          <div className="flex flex-col items-center justify-center relative px-2 mb-4 mt-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500">
                <ShoppingCart size={16} strokeWidth={2.5} />
              </div>
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t.achats}</span>
            </div>
            <p className="text-4xl font-black text-rose-600 tracking-tighter">
              {filteredTotals.totalExpense.toLocaleString('fr-FR')} 
              <span className="text-sm ml-1 font-bold text-slate-400 uppercase">{currency}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions`;

const finalContent = content.replace(regex, newCode);
fs.writeFileSync('src/components/History.tsx', finalContent);
