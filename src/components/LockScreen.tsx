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
  const [biometricAttempts, setBiometricAttempts] = useState(0);
  const [showPinPad, setShowPinPad] = useState(!allowBiometric || !!correctPin);
  const MAX_ATTEMPTS = 3;

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
    if (biometricAttempts >= MAX_ATTEMPTS) return;

    try {
      await NativeBiometric.verifyIdentity({
        title: "Connexion Masrof",
        subtitle: `Tentative ${biometricAttempts + 1}/${MAX_ATTEMPTS}`,
        reason: "Utilisez votre empreinte digitale pour déverrouiller",
        useFallback: true,
      });
      onUnlock();
    } catch (e: any) {
      console.log("Biometric auth failed", e);
      setBiometricAttempts(prev => {
        const next = prev + 1;
        if (next >= MAX_ATTEMPTS && correctPin) {
          setShowPinPad(true);
        }
        return next;
      });
      
      if (e?.code === 'biometryNotAvailable' && !correctPin) {
         onUnlock();
      }
    }
  };

  useEffect(() => {
    if (biometricAvailable && biometricAttempts === 0) {
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
      className="fixed inset-0 z-[200] bg-slate-50 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-[80px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-500/10 rounded-full mix-blend-multiply filter blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />

      {/* Main Container */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center p-8 bg-white rounded-[32px] shadow-xl border border-slate-100 w-[90%] max-w-sm pb-10"
      >
        <div className="flex flex-col items-center mb-8">
          <MasrofLogo size="small" className="w-24 h-24 mb-4 drop-shadow-sm" />
          
          <div className="flex items-center gap-2 mb-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-100 shadow-sm">
            <Lock size={16} className="text-slate-800" />
            <h2 className="text-sm font-black text-slate-800 tracking-tight">
              VERROUILLAGE
            </h2>
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center mt-2">
            {showPinPad && correctPin ? "Entrez votre code PIN" : "Verrouillage Biométrique"}
          </p>
        </div>

        {showPinPad && correctPin ? (
          <>
            <div className="flex items-center gap-6 mb-10">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  animate={
                    error 
                      ? { x: [-5, 5, -5, 5, 0], backgroundColor: "#ef4444" }
                      : pin.length > i 
                        ? { scale: [1, 1.2, 1], backgroundColor: "#a855f7" }
                        : { scale: 1, backgroundColor: "#f3e8ff" }
                  }
                  transition={{ duration: 0.3 }}
                  className={`w-4 h-4 rounded-full ${pin.length > i && !error ? 'shadow-[0_0_10px_rgba(168,85,247,0.5)]' : ''}`}
                />
              ))}
            </div>

            <div className="grid grid-cols-3 gap-y-4 gap-x-6 w-full px-2 relative">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => handleKeyPress(num)}
                  className="h-16 w-16 mx-auto rounded-full bg-slate-50 text-slate-800 text-2xl font-black shadow-sm border border-slate-100 hover:bg-slate-100 active:bg-slate-200 active:scale-95 transition-all flex items-center justify-center"
                >
                  {num}
                </button>
              ))}
              <div />
              <button
                onClick={() => handleKeyPress(0)}
                className="h-16 w-16 mx-auto rounded-full bg-slate-50 text-slate-800 text-2xl font-black shadow-sm border border-slate-100 hover:bg-slate-100 active:bg-slate-200 active:scale-95 transition-all flex items-center justify-center"
              >
                0
              </button>
              <button
                onClick={handleDelete}
                onContextMenu={(e) => {
                  e.preventDefault();
                  if (biometricAvailable) handleBiometricAuth();
                }}
                className="h-16 w-16 mx-auto rounded-full bg-transparent text-slate-400 hover:text-purple-500 hover:bg-purple-50 active:scale-95 transition-all flex items-center justify-center"
              >
                <Delete size={28} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 w-full px-6 text-center">
             <button
                onClick={handleBiometricAuth}
                disabled={biometricAttempts >= MAX_ATTEMPTS}
                className={`flex items-center justify-center p-6 rounded-full transition-colors mb-4 border ${biometricAttempts >= MAX_ATTEMPTS ? 'bg-red-50 border-red-100' : 'bg-purple-50 hover:bg-purple-100 border-purple-100'} disabled:opacity-50 disabled:cursor-not-allowed`}
             >
                <Fingerprint size={48} className={`${biometricAttempts >= MAX_ATTEMPTS ? "text-red-500" : "text-purple-500"} ${biometricAttempts === 0 ? "animate-pulse" : ""}`} />
             </button>
             {biometricAttempts >= MAX_ATTEMPTS ? (
               <div className="space-y-4">
                 <p className="text-sm font-bold text-red-500">Trop de tentatives.</p>
                 {correctPin && (
                   <button
                     onClick={() => setShowPinPad(true)}
                     className="px-6 py-3 bg-purple-500 text-white rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-purple-500/20 active:scale-95 transition-all"
                   >
                     Utiliser le code PIN
                   </button>
                 )}
               </div>
             ) : (
               <>
                 <p className="text-sm font-medium text-slate-500 mb-2">Toucher le capteur d'empreinte pour déverrouiller Masrof.</p>
                 {biometricAttempts > 0 && (
                   <p className="text-xs font-bold text-amber-500">Essais restants : {MAX_ATTEMPTS - biometricAttempts}</p>
                 )}
               </>
             )}
          </div>
        )}
        
        <AnimatePresence>
          {biometricAvailable && showPinPad && correctPin && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onClick={handleBiometricAuth}
              disabled={biometricAttempts >= MAX_ATTEMPTS}
              className={`absolute -bottom-16 ${biometricAttempts >= MAX_ATTEMPTS ? 'text-red-500 bg-red-50 border-red-200' : 'text-purple-500 hover:text-purple-600 bg-white hover:bg-purple-50 border-slate-100 shadow-sm'} transition-colors p-3 rounded-full flex flex-col items-center justify-center border disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Fingerprint size={32} />
               <span className="text-[10px] font-bold uppercase mt-1">
                 {biometricAttempts >= MAX_ATTEMPTS ? 'Bloqué' : 'Biométrie'}
               </span>
            </motion.button>
          )}
          {error && (
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute bottom-4 text-[11px] font-bold text-red-500 uppercase tracking-widest"
            >
              Code PIN incorrect
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
