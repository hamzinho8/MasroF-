import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'small' | 'large';
}

export default function MasrofLogo({ className = "w-40 h-40", size = 'large' }: LogoProps) {
  if (size === 'small') {
    return (
      <div className={`flex items-center justify-center bg-slate-800 rounded-lg border border-white/10 p-1 ${className}`}>
        <span className="text-[8px] font-black text-[#84cc16] text-center leading-tight uppercase tracking-tighter">
          [ICÔNE_LOGO_PNG_PETIT]
        </span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center bg-slate-900 rounded-3xl border-2 border-[#84cc16]/30 p-6 text-center shadow-2xl ${className}`}>
      <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-white/20 rounded-xl mb-2">
        <span className="text-xs font-black text-white uppercase tracking-widest">
          [CADRE_LOGO_PNG_GRAND]
        </span>
      </div>
      <span className="text-[10px] font-bold text-[#84cc16] opacity-60 uppercase tracking-widest">
        Fichier PNG Source
      </span>
    </div>
  );
}
