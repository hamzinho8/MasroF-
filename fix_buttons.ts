import fs from 'fs';
let content = fs.readFileSync('src/components/History.tsx', 'utf-8');

// Update imports
content = content.replace(
  `  CheckCircle2,
  Trash
} from 'lucide-react';`,
  `  CheckCircle2,
  Trash,
  Mic,
  ScanLine
} from 'lucide-react';`
);

// Update Quick Actions
const oldQuickActions = `      {/* Quick Actions - Identical to Home style */}
      <div className="grid grid-cols-1 px-1 mb-6">
        <button 
          onClick={() => onAddClick('EXPENSE')}
          className="group relative flex flex-col items-center justify-center gap-3 h-28 bg-white border-2 border-slate-50 rounded-[28px] transition-all hover:border-rose-100 hover:bg-rose-50/30 active:scale-95 shadow-sm"
        >
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
            <ShoppingBag size={24} strokeWidth={2.5} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-rose-600 transition-colors">
            {t.ajouterAchat}
          </span>
        </button>
        
      </div>`;

const newQuickActions = `      {/* Quick Actions - Identical to Home style */}
      <div className="grid grid-cols-3 gap-3 px-1 mb-6">
        <button 
          onClick={() => onAddClick('EXPENSE')}
          className="group relative flex flex-col items-center justify-center gap-2 h-28 bg-white border-2 border-slate-50 rounded-[28px] transition-all hover:border-rose-100 hover:bg-rose-50/30 active:scale-95 shadow-sm"
        >
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
            <ShoppingBag size={24} strokeWidth={2.5} />
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-rose-600 transition-colors text-center px-1 leading-tight">
            {t.ajouterAchat}
          </span>
        </button>

        <button 
          onClick={() => {}}
          className="group relative flex flex-col items-center justify-center gap-2 h-28 bg-white border-2 border-slate-50 rounded-[28px] transition-all hover:border-indigo-100 hover:bg-indigo-50/30 active:scale-95 shadow-sm"
        >
          <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
            <ScanLine size={24} strokeWidth={2.5} />
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-600 transition-colors text-center px-1 leading-tight">
            Scanner
          </span>
        </button>

        <button 
          onClick={() => {}}
          className="group relative flex flex-col items-center justify-center gap-2 h-28 bg-white border-2 border-slate-50 rounded-[28px] transition-all hover:border-teal-100 hover:bg-teal-50/30 active:scale-95 shadow-sm"
        >
          <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
            <Mic size={24} strokeWidth={2.5} />
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-teal-600 transition-colors text-center px-1 leading-tight">
            Vocal
          </span>
        </button>
      </div>`;

content = content.replace(oldQuickActions, newQuickActions);

fs.writeFileSync('src/components/History.tsx', content);
