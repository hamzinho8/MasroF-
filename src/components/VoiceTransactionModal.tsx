import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, X, Loader2, CheckCircle2 } from 'lucide-react';

interface VoiceTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (
    label: string,
    amount: number,
    type: "INCOME" | "EXPENSE",
    category?: string
  ) => void;
  language: string;
}

export default function VoiceTransactionModal({
  isOpen,
  onClose,
  onAddTransaction,
  language
}: VoiceTransactionModalProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [parsedData, setParsedData] = useState<{ label: string; amount: number; type: "INCOME" | "EXPENSE" } | null>(null);
  const [error, setError] = useState("");
  
  const recognitionRef = useRef<any>(null);

  const t = {
    Français: {
      title: "Saisie Vocale",
      instruction: "Parlez pour ajouter une transaction...",
      listening: "Écoute en cours...",
      examples: "Exemple: 'Achat café 15' ou 'Revenu salaire 5000'",
      error: "Je n'ai pas pu comprendre. Réessayez.",
      confirm: "Confirmer",
      success: "Transaction ajoutée!"
    },
    العربية: {
      title: "إدخال صوتي",
      instruction: "تحدث لإضافة معاملة...",
      listening: "جاري الاستماع...",
      examples: "مثال: 'شراء قهوة 15' أو 'دخل راتب 5000'",
      error: "لم أتمكن من الفهم. حاول مرة أخرى.",
      confirm: "تأكيد",
      success: "تمت إضافة المعاملة!"
    },
    English: {
      title: "Voice Input",
      instruction: "Speak to add a transaction...",
      listening: "Listening...",
      examples: "Example: 'Bought coffee 15' or 'Income salary 5000'",
      error: "I couldn't understand that. Please try again.",
      confirm: "Confirm",
      success: "Transaction added!"
    }
  }[language as 'Français' | 'العربية' | 'English'] || {
    title: "Saisie Vocale",
    instruction: "Parlez pour ajouter une transaction...",
    listening: "Écoute en cours...",
    examples: "Exemple: 'Achat café 15' ou 'Revenu salaire 5000'",
    error: "Je n'ai pas pu comprendre. Réessayez.",
    confirm: "Confirmer",
    success: "Transaction ajoutée!"
  };

  useEffect(() => {
    if (!isOpen) {
      stopListening();
      setTranscript("");
      setParsedData(null);
      setError("");
      return;
    }

    // Initialize speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language === 'Français' ? 'fr-FR' : language === 'العربية' ? 'ar-SA' : 'en-US';

      recognition.onstart = () => setIsListening(true);
      
      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const result = event.results[current][0].transcript;
        setTranscript(result);
        
        if (event.results[current].isFinal) {
          parseTranscript(result);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setError(t.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      
      // Auto start
      setTimeout(() => startListening(), 300);
    } else {
      setError("Speech recognition is not supported in this browser.");
    }
  }, [isOpen, language]);

  const startListening = () => {
    setError("");
    setParsedData(null);
    setTranscript("");
    try {
      recognitionRef.current?.start();
    } catch (e) {
      // already started
    }
  };

  const stopListening = () => {
    try {
      recognitionRef.current?.stop();
    } catch(e) {}
    setIsListening(false);
  };

  const parseTranscript = (text: string) => {
    const lowerText = text.toLowerCase();
    
    // Very simple NLP parsing logic
    let type: "INCOME" | "EXPENSE" = "EXPENSE";
    let amount = 0;
    let label = text;

    // Detect Income keywords
    if (lowerText.match(/(revenu|salaire|rentrée|income|salary|دخل|راتب)/i)) {
      type = "INCOME";
    }

    // Extract numbers
    const numbers = lowerText.match(/\d+([.,]\d+)?/g);
    if (numbers && numbers.length > 0) {
      // Get the last number found as the amount
      amount = parseFloat(numbers[numbers.length - 1].replace(',', '.'));
      // Remove the number from the label
      label = lowerText.replace(numbers[numbers.length - 1], '').trim();
    }

    // Clean up common filler words
    label = label.replace(/^(achat de|achat|j'ai acheté|j'ai payé|bought|payé pour|شراء|دفعت لـ)\s+/i, '').trim();
    
    // Capitalize first letter
    label = label.charAt(0).toUpperCase() + label.slice(1);

    if (amount > 0 && label) {
      setParsedData({ type, amount, label: label.substring(0, 30) });
    } else {
      setError(t.error);
    }
  };

  const handleConfirm = () => {
    if (parsedData) {
      onAddTransaction(parsedData.label, parsedData.amount, parsedData.type, "Autres");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-sm bg-white rounded-[32px] shadow-2xl p-6 overflow-hidden text-center"
        >
          {/* Animated background waves */}
          {isListening && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10">
              <motion.div
                animate={{ scale: [1, 2, 2.5], opacity: [0.5, 0.2, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                className="w-32 h-32 bg-indigo-600 rounded-full absolute"
              />
              <motion.div
                animate={{ scale: [1, 2, 2.5], opacity: [0.5, 0.2, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                className="w-32 h-32 bg-violet-600 rounded-full absolute"
              />
            </div>
          )}

          <div className="flex justify-end mb-2">
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200"
            >
              <X size={16} />
            </button>
          </div>

          <h3 className="text-xl font-black text-slate-800 tracking-tight mb-2">
            {t.title}
          </h3>
          
          <p className="text-sm font-bold text-slate-400 mb-8 px-4">
            {t.examples}
          </p>

          {/* Mic Button */}
          <div className="relative flex justify-center mb-8">
            <button
              onClick={isListening ? stopListening : startListening}
              className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 relative z-10 ${
                isListening 
                  ? 'bg-gradient-to-tr from-rose-500 to-rose-400 text-white scale-110 shadow-rose-500/30' 
                  : 'bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-indigo-500/30 hover:scale-105'
              }`}
            >
              {isListening ? (
                <div className="flex gap-1 items-center">
                  <motion.div animate={{ height: [12, 24, 12] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1.5 bg-white rounded-full" />
                  <motion.div animate={{ height: [16, 32, 16] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-1.5 bg-white rounded-full" />
                  <motion.div animate={{ height: [12, 24, 12] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} className="w-1.5 bg-white rounded-full" />
                </div>
              ) : (
                <Mic size={36} strokeWidth={2.5} />
              )}
            </button>
          </div>

          <div className="min-h-[80px] flex flex-col justify-center items-center">
            {transcript && !parsedData && !error && (
              <p className="text-lg font-bold text-slate-700 mb-2 italic">"{transcript}"</p>
            )}
            
            {error && (
              <p className="text-sm font-bold text-rose-500 mb-2">{error}</p>
            )}

            {parsedData && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full bg-slate-50 rounded-2xl p-4 mb-4 border border-slate-100"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Montant</span>
                  <span className={`text-lg font-black ${parsedData.type === 'INCOME' ? 'text-teal-500' : 'text-rose-500'}`}>
                    {parsedData.type === 'INCOME' ? '+' : '-'}{parsedData.amount}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Libellé</span>
                  <span className="font-bold text-slate-700">{parsedData.label}</span>
                </div>
              </motion.div>
            )}
          </div>

          {parsedData && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleConfirm}
              className="w-full py-3.5 rounded-xl font-black text-white bg-slate-900 hover:bg-slate-800 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2 mt-2"
            >
              <CheckCircle2 size={18} />
              {t.confirm}
            </motion.button>
          )}

          {!parsedData && !error && (
            <p className="text-xs font-bold text-slate-400 mt-4">
              {isListening ? t.listening : t.instruction}
            </p>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
