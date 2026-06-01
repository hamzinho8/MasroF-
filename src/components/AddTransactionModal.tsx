import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Camera as CameraIcon } from '@capacitor/camera'; // capacitor camera
import { CameraResultType, CameraSource } from '@capacitor/camera';
import { GoogleGenAI } from '@google/genai';
import { 
  X, 
  Check, 
  Utensils, 
  ShoppingBag, 
  Car, 
  Gamepad2, 
  MoreHorizontal,
  ScanText,
  Loader2
} from 'lucide-react';
import { PredefinedItem } from '../types';
import { ICON_MAP } from '../constants';

interface Category {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const CATEGORIES: Category[] = [
  { id: 'Nourriture', label: 'Nourriture', icon: <Utensils size={18} />, color: 'text-teal-700', bgColor: 'bg-teal-100' },
  { id: 'Shopping', label: 'Shopping', icon: <ShoppingBag size={18} />, color: 'text-rose-600', bgColor: 'bg-rose-100' },
  { id: 'Transport', label: 'Transport', icon: <Car size={18} />, color: 'text-sky-600', bgColor: 'bg-sky-100' },
  { id: 'Loisirs', label: 'Loisirs', icon: <Gamepad2 size={18} />, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  { id: 'Autres', label: 'Autres', icon: <MoreHorizontal size={18} />, color: 'text-slate-600', bgColor: 'bg-slate-100' },
];

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (label: string, amount: number, type: 'INCOME' | 'EXPENSE', category?: string, paidByBank?: boolean, isPureInflow?: boolean, inventoryData?: { quantity: number; color: string; bg: string; iconName: string }) => void;
  initialType: 'INCOME' | 'EXPENSE';
  currency: string;
  predefinedItems: PredefinedItem[];
}

interface ScannedItem {
  id: string;
  title: string;
  amount: number;
  category: string;
}

export default function AddTransactionModal({ isOpen, onClose, onAdd, initialType, currency, predefinedItems }: AddTransactionModalProps) {
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>(initialType);
  const [selectedCategory, setSelectedCategory] = useState<string>('Autres');
  const [showFrequent, setShowFrequent] = useState(true);
  const [paidByBank, setPaidByBank] = useState(false);
  const [addToInventory, setAddToInventory] = useState(false);
  const [inventoryQty, setInventoryQty] = useState('1');
  const [isScanning, setIsScanning] = useState(false);
  const [scannedItems, setScannedItems] = useState<ScannedItem[] | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setType(initialType);
      setLabel('');
      setAmount('');
      setSelectedCategory('Autres');
      setShowFrequent(true);
      setPaidByBank(false);
      setAddToInventory(false);
      setInventoryQty('1');
      setScannedItems(null);
    }
  }, [isOpen, initialType]);

  const handleCategoryClick = (catId: string) => {
    setSelectedCategory(catId);
    setShowFrequent(false);
  };

  const handleScanReceipt = async () => {
    try {
      setIsScanning(true);
      const image = await Camera.getPhoto({
        quality: 60,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt,
        saveToGallery: true
      });

      if (!image.dataUrl) {
        setIsScanning(false);
        return;
      }

      let data: any = null;
      let usedFallback = false;

      // Try server first, fallback to mock/error
      try {
        const response = await fetch('/api/scan-items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: image.dataUrl
          })
        });

        if (response.ok) {
          data = await response.json();
        } else {
          throw new Error("Server OCR failed");
        }
      } catch (err) {
        // Fallback for Android standalone APK without backend
        if (import.meta.env.VITE_GEMINI_API_KEY) {
          usedFallback = true;
          const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
          const genResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
              {
                role: "user",
                parts: [
                  {
                    inlineData: {
                      data: image.dataUrl!.split(',')[1],
                      mimeType: image.dataUrl!.split(';')[0].split(':')[1] || "image/jpeg"
                    }
                  },
                  {
                    text: "Analyze this image (which could be a receipt or photo of multiple items) and extract all items purchased. For each item, estimate or read the price, category, and title. Note: category must be strictly one of ['Nourriture', 'Shopping', 'Transport', 'Loisirs', 'Autres']. Respond purely with a JSON array format like: [{\"amount\": 12.50, \"category\": \"Nourriture\", \"title\": \"Pizza\"}, ...]. If you can't identify any items, return an empty array []. Return ONLY valid JSON array, no markdown blocks."
                  }
                ]
              }
            ]
          });
          const text = genResponse.text || "[]";
          const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
          data = JSON.parse(cleanText);
        } else {
          alert("L'API OCR est inaccessible. Veuillez configurer le backend ou la clé API.");
          return;
        }
      }

      if (data && Array.isArray(data)) {
        if (data.length > 0) {
          setScannedItems(data.map((item: any, index: number) => ({
            id: index.toString(),
            title: item.title || 'Achat',
            amount: item.amount || 0,
            category: CATEGORIES.some(c => c.id === item.category) ? item.category : 'Autres'
          })));
        } else {
          alert("Aucun article n'a été détecté dans l'image.");
        }
      } else if (data) {
        // Fallback if returned an object instead of array
        setScannedItems([{
          id: '0',
          title: data.title || 'Achat',
          amount: data.amount || 0,
          category: CATEGORIES.some(c => c.id === data.category) ? data.category : 'Autres'
        }]);
      }
    } catch (e: any) {
      console.log('Camera error / OCR failed:', e);
      alert("Erreur lors de la numérisation : " + e.message);
    } finally {
      setIsScanning(false);
    }
  };

  const handleItemSelect = (name: string, price: number, category: string) => {
    setLabel(name);
    setAmount(price.toString());
    setSelectedCategory(category);
  };

  const handleScanItemChange = (id: string, field: keyof ScannedItem, value: any) => {
    setScannedItems(prev => prev ? prev.map(i => i.id === id ? { ...i, [field]: value } : i) : null);
  };

  const handleConfirmScannedItem = (item: ScannedItem) => {
    if (!item.amount || item.amount <= 0) return;
    onAdd(item.title || 'Achat', item.amount, 'EXPENSE', item.category, paidByBank, false);
    setScannedItems(prev => {
      const remaining = prev ? prev.filter(i => i.id !== item.id) : null;
      if (remaining && remaining.length === 0) {
        setTimeout(onClose, 300); // close modal if last item
        return null;
      }
      return remaining;
    });
  };

  const handleRejectScannedItem = (id: string) => {
    setScannedItems(prev => {
      const remaining = prev ? prev.filter(i => i.id !== id) : null;
      if (remaining && remaining.length === 0) {
        setTimeout(onClose, 300);
        return null;
      }
      return remaining;
    });
  };

  const filteredItems = useMemo(() => {
    if (showFrequent) {
      return predefinedItems.filter(item => item.frequent);
    }
    return predefinedItems.filter(item => item.category === selectedCategory);
  }, [showFrequent, selectedCategory, predefinedItems]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount) {
      const finalLabel = type === 'INCOME' ? 'Retrait Banque' : (label.trim() || 'Achat');
      let invReq = undefined;
      
      if (type === 'EXPENSE' && addToInventory) {
        const cat = CATEGORIES.find(c => c.id === selectedCategory) || CATEGORIES[4];
        let iconName = 'Box'; // fallback
        if (cat.id === 'Nourriture') iconName = 'Utensils';
        else if (cat.id === 'Shopping') iconName = 'ShoppingBag';
        else if (cat.id === 'Transport') iconName = 'Car';
        else if (cat.id === 'Loisirs') iconName = 'Gamepad2';
        else if (cat.id === 'Autres') iconName = 'MoreHorizontal';
        
        invReq = {
          quantity: parseInt(inventoryQty) || 1,
          color: cat.color,
          bg: cat.bgColor,
          iconName
        };
      }
      
      onAdd(finalLabel, parseFloat(amount), type, type === 'EXPENSE' ? selectedCategory : undefined, paidByBank, false, invReq);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] max-w-md mx-auto"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-[120] bg-white rounded-t-[40px] p-8 max-w-md mx-auto shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                {scannedItems !== null ? 'Articles Scannés' : (type === 'INCOME' ? 'Retrait Banque' : 'Nouvel Achat')}
              </h2>
              <div className="flex items-center gap-2">
                {type === 'EXPENSE' && scannedItems === null && (
                  <button 
                    onClick={handleScanReceipt} 
                    disabled={isScanning}
                    className="h-10 px-4 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest hover:bg-teal-100 transition-colors"
                  >
                    {isScanning ? <Loader2 size={16} className="animate-spin" /> : <ScanText size={16} />}
                    <span className="hidden sm:inline">Scanner</span>
                  </button>
                )}
                <button onClick={onClose} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>

            {scannedItems !== null ? (
              <div className="space-y-4">
                {scannedItems.length === 0 ? (
                  <div className="text-center py-10 opacity-60">
                    <p className="text-slate-600 font-bold mb-4">Aucun article détecté.</p>
                    <button onClick={() => setScannedItems(null)} className="h-12 px-6 bg-slate-200 rounded-full font-black text-slate-700">Retour</button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Bulk options could go here, like paying by bank flag */}
                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-4 rounded-2xl cursor-pointer mb-4" onClick={() => setPaidByBank(!paidByBank)}>
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${paidByBank ? 'bg-teal-500 text-white' : 'bg-slate-200 text-transparent'}`}>
                        <Check size={16} strokeWidth={3} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-800 tracking-tight">Payer par solde bancaire</span>
                        <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest">S'applique à tous les articles valides</span>
                      </div>
                    </div>

                    {scannedItems.map((item) => (
                      <div key={item.id} className="bg-white border rounded-2xl p-4 shadow-sm space-y-3 relative overflow-hidden">
                         <div className="grid grid-cols-[1fr_80px] gap-3">
                           <div>
                              <input 
                                value={item.title} 
                                onChange={(e) => handleScanItemChange(item.id, 'title', e.target.value)}
                                className="w-full text-sm font-black text-slate-800 bg-transparent outline-none border-b border-transparent focus:border-teal-200 transition-colors"
                                placeholder="Nom de l'article"
                              />
                           </div>
                           <div>
                              <input 
                                type="number" 
                                step="0.1"
                                value={item.amount || ''}
                                onChange={(e) => handleScanItemChange(item.id, 'amount', parseFloat(e.target.value))}
                                className="w-full text-sm font-black text-teal-700 bg-teal-50 rounded-lg px-2 py-1 outline-none text-right"
                                placeholder={`0.0 ${currency}`}
                              />
                           </div>
                         </div>
                         <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
                            {CATEGORIES.map(cat => (
                              <button 
                                key={cat.id} 
                                type="button" 
                                onClick={() => handleScanItemChange(item.id, 'category', cat.id)}
                                className={`flex-shrink-0 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full border transition-all ${item.category === cat.id ? 'bg-teal-500 text-white border-teal-500' : 'bg-slate-50 text-slate-500 border-slate-200'}`}
                              >
                                {cat.label}
                              </button>
                            ))}
                         </div>
                         <div className="flex gap-2">
                           <button onClick={() => handleConfirmScannedItem(item)} className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 rounded-xl text-sm transition-colors">Valider</button>
                           <button onClick={() => handleRejectScannedItem(item.id)} className="px-4 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold py-2 rounded-xl text-sm transition-colors"><X size={18} /></button>
                         </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-5">
                {type === 'EXPENSE' && (
                  <>
                     <div className="space-y-2">
                      <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Catégorie</label>
                      <div className="grid grid-cols-5 gap-2">
                        {CATEGORIES.map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => handleCategoryClick(cat.id)}
                            className={`flex flex-col items-center gap-1.5 p-2 px-1 rounded-2xl border transition-all ${
                              selectedCategory === cat.id && !showFrequent
                                ? `bg-white shadow-md scale-105 border-transparent ring-2 ${
                                    cat.id === 'Nourriture' ? 'ring-teal-500/20' : 
                                    cat.id === 'Shopping' ? 'ring-rose-500/20' : 
                                    cat.id === 'Transport' ? 'ring-sky-500/20' : 
                                    cat.id === 'Loisirs' ? 'ring-purple-500/20' : 
                                    'ring-slate-400/20'
                                  }` 
                                : 'border-slate-100 bg-slate-50 opacity-60'
                            }`}
                          >
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${cat.bgColor} ${cat.color} ${(selectedCategory === cat.id && !showFrequent) ? 'scale-110' : ''} transition-transform`}>
                              {cat.icon}
                            </div>
                            <span className={`text-[8px] font-black uppercase tracking-tight text-center truncate w-full ${
                              (selectedCategory === cat.id && !showFrequent)
                                ? (cat.id === 'Nourriture' ? 'text-teal-600' : 
                                   cat.id === 'Shopping' ? 'text-rose-600' : 
                                   cat.id === 'Transport' ? 'text-sky-600' : 
                                   cat.id === 'Loisirs' ? 'text-purple-600' : 
                                   'text-slate-800')
                                : 'text-slate-400'
                            }`}>
                              {cat.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Predefined Items Quick Select */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between px-1">
                        <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">
                          {showFrequent ? 'Achats Fréquents' : `Articles: ${selectedCategory}`}
                        </label>
                        {!showFrequent && (
                          <button 
                            type="button" 
                            onClick={() => setShowFrequent(true)}
                            className="text-[9px] font-black text-teal-600 uppercase tracking-widest hover:underline"
                          >
                            Voir Fréquents
                          </button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <AnimatePresence mode="popLayout">
                          {filteredItems.map((item) => {
                            const cat = CATEGORIES.find(c => c.id === item.category) || CATEGORIES[4];
                            const IconComponent = (ICON_MAP[item.iconName] || ICON_MAP['Box']) as React.ElementType;
                            return (
                              <motion.button
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                type="button"
                                onClick={() => handleItemSelect(item.name, item.price, item.category)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-full border border-slate-100 shadow-sm transition-all active:scale-95 bg-white hover:border-teal-500/30 ${label === item.name ? 'ring-2 ring-teal-500/20 border-teal-500/50' : ''}`}
                              >
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${cat.bgColor} ${cat.color}`}>
                                  <IconComponent size={14} />
                                </div>
                                <div className="flex flex-col items-start leading-none">
                                  <span className="text-[11px] font-black text-slate-700">{item.name}</span>
                                  <span className="text-[9px] font-bold text-slate-400">{item.price} {currency}</span>
                                </div>
                              </motion.button>
                            );
                          })}
                        </AnimatePresence>
                        {filteredItems.length === 0 && (
                          <p className="text-[10px] text-slate-400 italic px-1 py-1">Mode manuel activé pour cette catégorie</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Libellé (Optionnel)</label>
                      <input
                        type="text"
                        placeholder="Qu'avez-vous acheté ?"
                        className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-5 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all font-mono"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                      />
                    </div>
                  </>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Montant ({currency})</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    autoFocus={type === 'INCOME'}
                    placeholder="0.0"
                    className="w-full h-16 bg-slate-50 border border-slate-100 rounded-2xl px-5 font-black text-slate-800 text-3xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all text-center font-mono"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>

                {type === 'EXPENSE' && (
                  <>
                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-4 rounded-2xl cursor-pointer" onClick={() => setPaidByBank(!paidByBank)}>
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${paidByBank ? 'bg-teal-500 text-white' : 'bg-slate-200 text-transparent'}`}>
                        <Check size={16} strokeWidth={3} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-800 tracking-tight">Payé par solde bancaire</span>
                        <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Ne pas déduire de la poche</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-4 rounded-2xl cursor-pointer" onClick={() => setAddToInventory(!addToInventory)}>
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${addToInventory ? 'bg-violet-500 text-white' : 'bg-slate-200 text-transparent'}`}>
                          <Check size={16} strokeWidth={3} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-800 tracking-tight">Ajouter au stockage</span>
                          <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Enregistrer dans l'inventaire</span>
                        </div>
                      </div>

                      <AnimatePresence>
                        {addToInventory && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0, marginTop: -12 }} 
                            animate={{ opacity: 1, height: 'auto', marginTop: 0 }} 
                            exit={{ opacity: 0, height: 0, marginTop: -12 }}
                            className="space-y-1.5 overflow-hidden"
                          >
                            <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Quantité (Articles)</label>
                            <input
                              type="number"
                              min="1"
                              placeholder="1"
                              className="w-full h-14 bg-violet-50/50 border border-violet-100 rounded-2xl px-5 font-black text-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all font-mono"
                              value={inventoryQty}
                              onChange={(e) => setInventoryQty(e.target.value)}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </>
                )}
              </div>

              <button
                type="submit"
                className={`w-full h-16 rounded-3xl flex items-center justify-center gap-3 font-black text-white text-lg shadow-lg transform transition-all active:scale-[0.98] ${type === 'EXPENSE' ? 'bg-slate-800 shadow-slate-800/20' : 'bg-teal-brand shadow-teal-brand/20'}`}
              >
                <Check size={24} strokeWidth={3} />
                <span>Confirmer</span>
              </button>
            </form>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
