import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'small' | 'large';
}

export default function MasrofLogo({ className = "w-40 h-40", size = 'large' }: LogoProps) {
  if (size === 'small') {
    return (
      <div className={`flex items-center justify-center overflow-hidden ${className}`}>
        <img src="/logo.png" alt="MasroF" className="w-full h-full object-contain drop-shadow-sm" />
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center overflow-hidden ${className}`}>
      <img src="/logo.png" alt="MasroF" className="w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500" />
    </div>
  );
}
