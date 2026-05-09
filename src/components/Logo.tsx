import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'small' | 'large';
}

export default function MasrofLogo({ className = "w-40 h-40", size = 'large' }: LogoProps) {
  const svgContent = (
    <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <radialGradient id="bg" cx="50%" cy="40%">
          <stop offset="0%" stopColor="#0f1725"/>
          <stop offset="100%" stopColor="#05070d"/>
        </radialGradient>
        <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff4c4"/>
          <stop offset="20%" stopColor="#f7d66b"/>
          <stop offset="55%" stopColor="#c8962e"/>
          <stop offset="100%" stopColor="#8d6412"/>
        </linearGradient>
        <linearGradient id="silver" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff"/>
          <stop offset="40%" stopColor="#d8d8d8"/>
          <stop offset="70%" stopColor="#9f9f9f"/>
          <stop offset="100%" stopColor="#f4f4f4"/>
        </linearGradient>
        <radialGradient id="glass" cx="45%" cy="40%">
          <stop offset="0%" stopColor="#7ea5c8"/>
          <stop offset="50%" stopColor="#2d3f53"/>
          <stop offset="100%" stopColor="#101820"/>
        </radialGradient>
        <linearGradient id="whiteText" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff"/>
          <stop offset="100%" stopColor="#dcdcdc"/>
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#000000" floodOpacity={0.5}/>
        </filter>
        <filter id="motion">
          <feGaussianBlur stdDeviation="3 0"/>
        </filter>
      </defs>
      
      {/* Conditionally render background based on size or context */}
      {size === 'large' && <rect width="100%" height="100%" fill="url(#bg)"/>}

      <g opacity="0.4" filter="url(#glow)">
        <path d="M120 420 C240 470 320 500 470 500" stroke="#f8d26a" strokeWidth="3" fill="none"/>
        <path d="M120 455 C250 500 330 525 470 520" stroke="#f8d26a" strokeWidth="2" fill="none"/>
        <path d="M120 500 C240 535 320 560 470 560" stroke="#f8d26a" strokeWidth="2" fill="none"/>
        <path d="M120 550 C250 580 350 600 470 590" stroke="#f8d26a" strokeWidth="3" fill="none"/>
      </g>
      <g transform="translate(90,380) rotate(-7)" filter="url(#motion)">
        <rect x="0" y="0" width="220" height="70" rx="6" fill="#dce9c9"/>
        <text x="20" y="45" fill="#4e7a4d" fontSize="28" fontFamily="Arial" fontWeight="bold">20</text>
        <rect x="30" y="95" width="220" height="70" rx="6" fill="#dfc39b"/>
        <text x="50" y="140" fill="#9b5d2f" fontSize="28" fontFamily="Arial" fontWeight="bold">50</text>
        <rect x="0" y="190" width="220" height="70" rx="6" fill="#c7d6ea"/>
        <text x="20" y="235" fill="#3b5c91" fontSize="28" fontFamily="Arial" fontWeight="bold">100</text>
        <rect x="25" y="285" width="220" height="70" rx="6" fill="#e4d4bb"/>
        <text x="45" y="330" fill="#9b642f" fontSize="28" fontFamily="Arial" fontWeight="bold">200</text>
      </g>
      <g filter="url(#glow)">
        <line x1="650" y1="470" x2="640" y2="310" stroke="#ffd86a" strokeWidth="4"/>
        <line x1="680" y1="490" x2="740" y2="250" stroke="#ffd86a" strokeWidth="5"/>
        <line x1="720" y1="500" x2="850" y2="260" stroke="#ffd86a" strokeWidth="7"/>
        <circle cx="620" cy="300" r="38" fill="url(#silver)"/>
        <circle cx="620" cy="300" r="32" fill="none" stroke="#eeeeee" strokeWidth="2"/>
        <text x="607" y="312" fontSize="30" fill="#888" fontFamily="Arial" fontWeight="bold">2</text>
        <circle cx="740" cy="220" r="48" fill="url(#silver)"/>
        <circle cx="740" cy="220" r="40" fill="none" stroke="#efefef" strokeWidth="2"/>
        <text x="726" y="236" fontSize="42" fill="#888" fontFamily="Arial" fontWeight="bold">1</text>
        <circle cx="785" cy="405" r="50" fill="url(#gold)"/>
        <circle cx="785" cy="405" r="42" fill="none" stroke="#fff0c2" strokeWidth="2"/>
        <text x="770" y="420" fontSize="44" fill="#ffffff" fontFamily="Arial" fontWeight="bold">5</text>
        <circle cx="900" cy="250" r="68" fill="url(#gold)"/>
        <circle cx="900" cy="250" r="58" fill="none" stroke="#fff0c2" strokeWidth="3"/>
        <text x="865" y="275" fontSize="56" fill="#ffffff" fontFamily="Arial" fontWeight="bold">10</text>
      </g>
      <g filter="url(#shadow)">
        <g transform="rotate(38 720 640)">
          <rect x="700" y="620" width="230" height="44" rx="22" fill="#101216" stroke="url(#gold)" strokeWidth="5"/>
          <circle cx="925" cy="642" r="20" fill="url(#gold)"/>
        </g>
        <circle cx="570" cy="530" r="145" fill="none" stroke="url(#gold)" strokeWidth="18"/>
        <circle cx="570" cy="530" r="132" fill="url(#glass)" stroke="#111" strokeWidth="10"/>
        <ellipse cx="520" cy="470" rx="75" ry="40" fill="rgba(255,255,255,0.18)" opacity="0.22"/>
      </g>
      <g filter="url(#shadow)">
        <circle cx="545" cy="535" r="58" fill="url(#silver)"/>
        <text x="522" y="555" fontSize="62" fill="#888" fontFamily="Arial" fontWeight="bold">1</text>
        <circle cx="650" cy="540" r="58" fill="url(#gold)"/>
        <text x="628" y="560" fontSize="62" fill="#fff" fontFamily="Arial" fontWeight="bold">2</text>
        <circle cx="485" cy="600" r="52" fill="#c98249"/>
        <text x="465" y="618" fontSize="54" fill="#fff" fontFamily="Arial" fontWeight="bold">5</text>
        <circle cx="595" cy="645" r="62" fill="url(#gold)"/>
        <text x="552" y="667" fontSize="60" fill="#fff" fontFamily="Arial" fontWeight="bold">10</text>
      </g>
      
      {/* Hide text if small icon */}
      {size === 'large' && (
        <g filter="url(#shadow)">
          <text x="180" y="860" fontSize="150" fontFamily="Poppins, Arial, sans-serif" fontWeight="700" letterSpacing="-8" fill="url(#whiteText)">
            Masro<tspan dx="-18">F</tspan>
          </text>
        </g>
      )}

      {/* Lines only for large */}
      {size === 'large' && (
        <g opacity="0.9">
          <line x1="260" y1="920" x2="470" y2="920" stroke="#7bff38" strokeWidth="5" strokeLinecap="round"/>
          <circle cx="512" cy="920" r="10" fill="#7bff38"/>
          <line x1="555" y1="920" x2="760" y2="920" stroke="#7bff38" strokeWidth="5" strokeLinecap="round"/>
        </g>
      )}
    </svg>
  );

  if (size === 'small') {
    return (
      <div className={`flex items-center justify-center p-1 rounded-xl overflow-hidden ${className}`}>
        {svgContent}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center p-2 text-center rounded-[40px] drop-shadow-2xl overflow-hidden ${className}`}>
      {svgContent}
    </div>
  );
}
