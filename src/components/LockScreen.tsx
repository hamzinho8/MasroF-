import React, { useState, useEffect } from "react";
import { Lock, Delete } from "lucide-react";
import MasrofLogo from "./Logo";

interface LockScreenProps {
  onUnlock: () => void;
  correctPin: string;
}

export default function LockScreen({ onUnlock, correctPin }: LockScreenProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (pin.length === 4) {
      if (pin === correctPin) {
        onUnlock();
      } else {
        setError(true);
        setTimeout(() => {
          setPin("");
          setError(false);
        }, 500);
      }
    }
  }, [pin, correctPin, onUnlock]);

  const handleKeyPress = (num: number) => {
    if (pin.length < 4) {
      setPin(prev => prev + num);
      setError(false);
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#F0F7F8] flex flex-col items-center justify-center p-6 bg-cover bg-center">
      <div className="absolute top-12">
        <MasrofLogo className="w-16 h-16 text-[#2D8B96]" />
      </div>

      <div className="flex flex-col items-center mb-12">
        <div className="w-16 h-16 bg-[#2D8B96]/10 rounded-full flex items-center justify-center mb-6">
          <Lock size={32} className="text-[#2D8B96]" />
        </div>
        <h2 className="text-2xl font-black text-[#1B5E66] uppercase tracking-tighter mb-2 text-center">
          Verrouillage<br/>Masrof
        </h2>
        <p className="text-sm font-bold text-[#1B5E66]/60 uppercase tracking-widest text-center">
          Entrez votre code PIN
        </p>
      </div>

      <div className={`flex items-center gap-4 mb-12 ${error ? "animate-pulse" : ""}`}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              pin.length > i 
                ? error 
                  ? "bg-red-500 scale-110 shadow-[0_0_10px_rgba(239,68,68,0.5)]" 
                  : "bg-[#2D8B96] scale-110 shadow-[0_0_10px_rgba(45,139,150,0.5)]"
                : "bg-[#2D8B96]/20"
            }`}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 max-w-[280px] w-full mt-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => handleKeyPress(num)}
            className="h-16 rounded-full bg-white text-[#1B5E66] text-2xl font-black shadow-sm border border-[#2D8B96]/10 active:bg-[#2D8B96]/10 active:scale-95 transition-all flex items-center justify-center"
          >
            {num}
          </button>
        ))}
        <div />
        <button
          onClick={() => handleKeyPress(0)}
          className="h-16 rounded-full bg-white text-[#1B5E66] text-2xl font-black shadow-sm border border-[#2D8B96]/10 active:bg-[#2D8B96]/10 active:scale-95 transition-all flex items-center justify-center"
        >
          0
        </button>
        <button
          onClick={handleDelete}
          className="h-16 rounded-full bg-transparent text-[#1B5E66]/60 active:text-[#2D8B96] active:scale-95 transition-all flex items-center justify-center"
        >
          <Delete size={28} />
        </button>
      </div>
      
      {error && (
        <p className="fixed bottom-12 text-xs font-bold text-red-500 uppercase tracking-widest animate-bounce">
          Code PIN incorrect
        </p>
      )}
    </div>
  );
}
