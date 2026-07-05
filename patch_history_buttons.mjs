import fs from 'fs';

let content = fs.readFileSync('src/components/History.tsx', 'utf-8');

const targetSection = `      {/* Quick Actions - Identical to Home style */}
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
          onClick={() => onAddClick('EXPENSE', 'scanner')}
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
          onClick={() => onAddClick('EXPENSE', 'vocal')}
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

const newSection = `      {/* Quick Actions - Premium Redesign */}
      <div className="grid grid-cols-3 gap-3 px-1 mb-6">
        <button 
          onClick={() => onAddClick('EXPENSE')}
          className="group relative flex flex-col items-center justify-center gap-2 h-28 bg-gradient-to-br from-rose-500 to-pink-600 rounded-[28px] transition-all duration-300 hover:shadow-[0_8px_25px_rgb(225,29,72,0.4)] hover:-translate-y-1 active:scale-95 shadow-[0_4px_15px_rgb(225,29,72,0.2)] border border-rose-400/50 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-colors" />
          <div className="w-12 h-12 rounded-full bg-white/20 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner backdrop-blur-md border border-white/30 z-10">
            <ShoppingBag size={24} strokeWidth={2.5} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-white/90 group-hover:text-white transition-colors text-center px-1 leading-tight z-10 drop-shadow-md">
            {t.ajouterAchat}
          </span>
        </button>

        <button 
          onClick={() => onAddClick('EXPENSE', 'scanner')}
          className="group relative flex flex-col items-center justify-center gap-2 h-28 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-[28px] transition-all duration-300 hover:shadow-[0_8px_25px_rgb(79,70,229,0.4)] hover:-translate-y-1 active:scale-95 shadow-[0_4px_15px_rgb(79,70,229,0.2)] border border-indigo-400/50 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-colors" />
          <div className="w-12 h-12 rounded-full bg-white/20 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner backdrop-blur-md border border-white/30 z-10">
            <ScanLine size={24} strokeWidth={2.5} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-white/90 group-hover:text-white transition-colors text-center px-1 leading-tight z-10 drop-shadow-md">
            Scanner
          </span>
        </button>

        <button 
          onClick={() => onAddClick('EXPENSE', 'vocal')}
          className="group relative flex flex-col items-center justify-center gap-2 h-28 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-[28px] transition-all duration-300 hover:shadow-[0_8px_25px_rgb(20,184,166,0.4)] hover:-translate-y-1 active:scale-95 shadow-[0_4px_15px_rgb(20,184,166,0.2)] border border-teal-300/50 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-colors" />
          <div className="w-12 h-12 rounded-full bg-white/20 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner backdrop-blur-md border border-white/30 z-10">
            <Mic size={24} strokeWidth={2.5} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-white/90 group-hover:text-white transition-colors text-center px-1 leading-tight z-10 drop-shadow-md">
            Vocal
          </span>
        </button>
      </div>`;

content = content.replace(targetSection, newSection);

fs.writeFileSync('src/components/History.tsx', content);

console.log("Success");
