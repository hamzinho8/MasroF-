import React from 'react';

export default function MasrofLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <div className={`relative ${className} flex items-center justify-center`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Main Background Circle */}
        <defs>
          <linearGradient id="logoBgGradient" x1="0" y1="0" x2="100" y2="100">
            <stop offset="0%" stopColor="#2D8B96" />
            <stop offset="100%" stopColor="#1B5E66" />
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
            <feOffset dx="1" dy="2" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.4" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Outer Glow/Shadow Circle */}
        <circle cx="50" cy="50" r="48" fill="#F0F7F8" />
        
        {/* Teal Circle with Gold Border */}
        <circle cx="50" cy="50" r="44" fill="url(#logoBgGradient)" stroke="#E5C366" strokeWidth="2.5" />
        
        {/* Inner Content Group */}
        <g filter="url(#shadow)">
          {/* Treasure Chest Base */}
          <path d="M32 50H68V72C68 74.2091 66.2091 76 64 76H36C33.7909 76 32 74.2091 32 72V50Z" fill="#D4AF37" stroke="#333" strokeWidth="0.5" />
          <rect x="36" y="54" width="28" height="18" fill="#B8860B" opacity="0.3" />
          
          {/* Chest Details (Panels) */}
          <rect x="35" y="53" width="7" height="20" fill="white" fillOpacity="0.1" />
          <rect x="58" y="53" width="7" height="20" fill="white" fillOpacity="0.1" />
          
          {/* Chest Top with Moorish Arch */}
          <path d="M32 50H68V48C68 40 62 34 50 34C38 34 32 40 32 48V50Z" fill="#E5C366" stroke="#333" strokeWidth="0.5" />
          <path d="M38 50V46C38 42 42 38 50 38C58 38 62 42 62 46V50H38Z" fill="white" fillOpacity="0.9" />
          {/* The Arch Notch */}
          <path d="M42 50V48C42 45 45 42 50 42C55 42 58 45 58 48V50H42Z" fill="#2D8B96" fillOpacity="0.6" />
          
          {/* Keyhole */}
          <circle cx="61" cy="56" r="2.5" fill="#333" />
          <rect x="60.25" y="57" width="1.5" height="3" fill="#333" />
          
          {/* Coin with DH */}
          <circle cx="52" cy="70" r="10" fill="#FAD8A0" stroke="#B8860B" strokeWidth="1.5" />
          <text x="52" y="73.5" fontSize="7" fontWeight="900" fill="#B8860B" textAnchor="middle" fontFamily="sans-serif">DH</text>
          
          {/* Receipt/Tag */}
          <g transform="rotate(25, 75, 45)">
            <path d="M68 38L82 38L82 52L68 52L68 38Z" fill="white" stroke="#333" strokeWidth="0.5" />
            <line x1="72" y1="41" x2="78" y2="41" stroke="#333" strokeWidth="1" />
            <line x1="72" y1="45" x2="78" y2="45" stroke="#333" strokeWidth="1" />
            <line x1="72" y1="49" x2="78" y2="49" stroke="#333" strokeWidth="1" />
          </g>
          
          {/* Golden Key */}
          <path d="M45 80H65M65 80C65 81.6569 66.3431 83 68 83C69.6569 83 71 81.6569 71 80C71 78.3431 69.6569 77 68 77C66.3431 77 65 78.3431 65 80ZM48 80V83M52 80V83M56 80V83" stroke="#E5C366" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}

