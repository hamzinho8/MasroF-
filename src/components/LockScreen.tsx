import React, { useState, useEffect } from "react";
import { Lock, Delete, Fingerprint } from "lucide-react";
import MasrofLogo from "./Logo";
import { motion, AnimatePresence } from "motion/react";
import { NativeBiometric } from "@capgo/capacitor-native-biometric";

interface LockScreenProps {
  onUnlock: () => void;
  correctPin: string;
  allowBiometric: boolean;
}

export default function LockScreen({ onUnlock, correctPin, allowBiometric }: LockScreenProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  useEffect(() => {
    const checkBiometric = async () => {
      if (!allowBiometric) return;
      try {
        const result = await NativeBiometric.isAvailable();
        if (result.isAvailable) setBiometricAvailable(true);
      } catch (e) {
        console.log("Biometric checks failed", e);
      }
    };
    checkBiometric();
  }, [allowBiometric]);

  const handleBiometricAuth = async () => {
    try {
      const verified = await NativeBiometric.verifyIdentity({
        title: "Connexion Masrof",
        subtitle: "Utilisez votre empreinte digitale pour déverrouiller",
        reason: "Sécurisation de vos données financières",
      });
      if (verified) {
        onUnlock();
      }
    } catch (e) {
      console.log("Biometric auth failed", e);
    }
  };

  useEffect(() => {
    if (biometricAvailable) {
      handleBiometricAuth();
    }
  }, [biometricAvailable]);

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
      className="fixed inset-0 z-[200] bg-[#F4F6F2] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background decorations for Glassmorphism feel */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#669A13]/20 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#050B39]/20 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-pulse" style={{ animationDelay: '2s' }} />

      {/* Main Glass Container */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center p-8 bg-white/60 backdrop-blur-xl rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(5,11,57,0.07)] border border-white/50 w-[90%] max-w-sm pb-10"
      >
        <div className="flex flex-col items-center mb-8">
          <MasrofLogo size="small" className="w-24 h-24 mb-4 drop-shadow-md" />
          
          <div className="flex items-center gap-2 mb-2 bg-white/50 px-4 py-2 rounded-full border border-white/60 shadow-sm">
            <Lock size={16} className="text-[#050B39]" />
            <h2 className="text-sm font-black text-[#050B39] uppercase tracking-wider">
              Verrouillage Masrof
            </h2>
          </div>
          <p className="text-[10px] font-bold text-[#050B39]/60 uppercase tracking-widest text-center mt-2">
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
                    ? { scale: [1, 1.2, 1], backgroundColor: "#669A13" }
                    : { scale: 1, backgroundColor: "rgba(102,154,19,0.2)" }
              }
              transition={{ duration: 0.3 }}
              className={`w-4 h-4 rounded-full ${pin.length > i && !error ? 'shadow-[0_0_12px_rgba(102,154,19,0.6)]' : ''}`}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-y-4 gap-x-6 w-full px-2 relative">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num)}
              className="h-16 w-16 mx-auto rounded-full bg-white/70 text-[#050B39] text-2xl font-black shadow-sm border border-white/80 hover:bg-white active:bg-white active:scale-90 transition-all flex items-center justify-center backdrop-blur-md"
            >
              {num}
            </button>
          ))}
          <div />
          <button
            onClick={() => handleKeyPress(0)}
            className="h-16 w-16 mx-auto rounded-full bg-white/70 text-[#050B39] text-2xl font-black shadow-sm border border-white/80 hover:bg-white active:bg-white active:scale-90 transition-all flex items-center justify-center backdrop-blur-md"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            onContextMenu={(e) => {
              e.preventDefault();
              if (biometricAvailable) handleBiometricAuth();
            }}
            className="h-16 w-16 mx-auto rounded-full bg-transparent text-[#050B39]/60 hover:text-[#669A13] hover:bg-white/40 active:scale-90 transition-all flex items-center justify-center"
          >
            <Delete size={28} />
          </button>
        </div>
        
        <AnimatePresence>
          {biometricAvailable && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onClick={handleBiometricAuth}
              className="absolute -bottom-16 text-teal-700/80 hover:text-teal-900 transition-colors bg-teal-100/50 p-3 rounded-full flex flex-col items-center justify-center backdrop-blur-md border border-teal-200/50"
            >
              <Fingerprint size={32} />
               <span className="text-[10px] font-bold uppercase mt-1">Biométrie</span>
            </motion.button>
          )}
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
