import React, { useState, useEffect } from "react";
import { Lock, Delete } from "lucide-react";
import MasrofLogo from "./Logo";
import { motion, AnimatePresence } from "motion/react";

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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-[#F0F7F8] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background decorations for Glassmorphism feel */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#2D8B96]/20 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#1B5E66]/20 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-pulse" style={{ animationDelay: '2s' }} />

      {/* Main Glass Container */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center p-8 bg-white/40 backdrop-blur-xl rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/50 w-[90%] max-w-sm pb-10"
      >
        <div className="flex flex-col items-center mb-8">
          <MasrofLogo size="small" className="w-24 h-24 mb-4 drop-shadow-md" />
          
          <div className="flex items-center gap-2 mb-2 bg-white/50 px-4 py-2 rounded-full border border-white/60 shadow-sm">
            <Lock size={16} className="text-[#1B5E66]" />
            <h2 className="text-sm font-black text-[#1B5E66] uppercase tracking-wider">
              Verrouillage Masrof
            </h2>
          </div>
          <p className="text-[10px] font-bold text-[#1B5E66]/60 uppercase tracking-widest text-center mt-2">
            Entrez votre code PIN
          </p>
        </div>

        <div className="flex items-center gap-6 mb-10">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              animate={
                error 
                  ? { x: [-5, 5, -5, 5, 0], backgroundColor: "#ef4444" }
                  : pin.length > i 
                    ? { scale: [1, 1.2, 1], backgroundColor: "#2D8B96" }
                    : { scale: 1, backgroundColor: "rgba(45,139,150,0.2)" }
              }
              transition={{ duration: 0.3 }}
              className={`w-4 h-4 rounded-full ${pin.length > i && !error ? 'shadow-[0_0_12px_rgba(45,139,150,0.6)]' : ''}`}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-y-4 gap-x-6 w-full px-2 relative">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num)}
              className="h-16 w-16 mx-auto rounded-full bg-white/70 text-[#1B5E66] text-2xl font-black shadow-sm border border-white/80 hover:bg-white active:bg-white active:scale-90 transition-all flex items-center justify-center backdrop-blur-md"
            >
              {num}
            </button>
          ))}
          <div />
          <button
            onClick={() => handleKeyPress(0)}
            className="h-16 w-16 mx-auto rounded-full bg-white/70 text-[#1B5E66] text-2xl font-black shadow-sm border border-white/80 hover:bg-white active:bg-white active:scale-90 transition-all flex items-center justify-center backdrop-blur-md"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="h-16 w-16 mx-auto rounded-full bg-transparent text-[#1B5E66]/60 hover:text-[#2D8B96] hover:bg-white/40 active:scale-90 transition-all flex items-center justify-center"
          >
            <Delete size={28} />
          </button>
        </div>
        
        <AnimatePresence>
          {error && (
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute bottom-4 text-xs font-bold text-red-500 uppercase tracking-widest"
            >
              Code PIN incorrect
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
