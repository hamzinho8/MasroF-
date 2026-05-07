import React from 'react';

export default function MasrofLogo({ className = "w-10 h-10", currency = "DH" }: { className?: string, currency?: string }) {
  return (
    <div className={`relative ${className} flex items-center justify-center`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Main Background Circle */}
        <defs>
          <linearGradient id="logoBgGradient" x1="0" y1="0" x2="100" y2="100">
            <stop offset="0%" stopColor="#107B86" />
            <stop offset="100%" stopColor="#084E55" />
          </linearGradient>
          <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F5DF9E" />
            <stop offset="50%" stopColor="#E5C366" />
            <stop offset="100%" stopColor="#B8860B" />
          </linearGradient>
          <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodOpacity="0.25" />
          </filter>
        </defs>
        
        {/* Outer Glow Circle */}
        <circle cx="50" cy="50" r="48" fill="#F0F7F8" opacity="0.5" />
        
        {/* Teal Circle with Gold Border */}
        <circle cx="50" cy="50" r="44" fill="url(#logoBgGradient)" stroke="url(#goldGradient)" strokeWidth="3" />
        
        {/* Inner Content Group */}
        <g filter="url(#shadow)">
          {/* Treasure Chest Base */}
          <path d="M30 52H70V74C70 76.2 68.2 78 66 78H34C31.8 78 30 76.2 30 74V52Z" fill="url(#goldGradient)" />
          
          {/* Moorish Arch Lid */}
          <path d="M30 52H70V48C70 38 62 32 50 32C38 32 30 38 30 48V52Z" fill="url(#goldGradient)" />
          <path d="M38 52V46C38 42 42 38 50 38C58 38 62 42 62 46V52H38Z" fill="#107B86" opacity="0.4" />
          <path d="M42 52V48C42 45 45 43 50 43C55 43 58 45 58 48V52H42Z" fill="#F0F7F8" />
          
          {/* Keyhole */}
          <circle cx="62" cy="62" r="2.5" fill="#333" />
          <path d="M62 64L62 68" stroke="#333" strokeWidth="2" strokeLinecap="round" />
          
          {/* Coin with Dynamic Currency */}
          <circle cx="48" cy="71" r="11" fill="url(#goldGradient)" stroke="#B8860B" strokeWidth="1" />
          <text x="48" y="75" fontSize={currency.length > 2 ? "5" : "7"} fontWeight="900" fill="#333" textAnchor="middle" fontFamily="var(--font-sans)">{currency}</text>
          
          {/* Tag */}
          <g transform="rotate(30, 78, 48)">
            <rect x="70" y="40" width="16" height="22" rx="2" fill="#F0F7F8" />
            <line x1="74" y1="45" x2="82" y2="45" stroke="#107B86" strokeWidth="1.5" />
            <line x1="74" y1="50" x2="82" y2="50" stroke="#107B86" strokeWidth="1.5" />
            <line x1="74" y1="55" x2="82" y2="55" stroke="#107B86" strokeWidth="1.5" />
          </g>
          
          {/* Key */}
          <path d="M40 82H60M60 82C60 84 62 86 64 86C66 86 68 84 68 82C68 80 66 78 64 78C62 78 60 80 60 82ZM44 82V85M48 82V85" stroke="url(#goldGradient)" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}

