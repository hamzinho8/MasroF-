import React, { useRef, useState } from "react";
import { Camera, X, Plus, Image as ImageIcon, Loader2, Sparkles, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import { PredefinedItem } from "../types";
import { CATEGORIES, ICON_MAP } from "../constants";

interface ReceiptScannerModalProps {
  onClose: () => void;
  predefinedItems: PredefinedItem[];
  onAddPredefinedItem: (item: PredefinedItem) => void;
}

export default function ReceiptScannerModal({ onClose, predefinedItems, onAddPredefinedItem }: ReceiptScannerModalProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedItem, setScannedItem] = useState<{name: string, price: number, category: string, iconName: string} | null>(null);
  const [isRegeneratingIcon, setIsRegeneratingIcon] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setError(null);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const result = e.target?.result as string;
      if (result) {
        try {
          const response = await fetch('/api/scan-single-item', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageBase64: result })
          });

          if (response.ok) {
            const data = await response.json();
            if (data && data.name) {
               setScannedItem({
                 name: data.name || '',
                 price: data.price || 0,
                 category: data.category || 'Autres',
                 iconName: data.iconName || 'PackageOpen'
               });
            } else {
               setError("L'IA n'a pas pu identifier cet article. Veuillez réessayer.");
            }
          } else {
             setError("Une erreur est survenue avec le serveur de l'IA. Veuillez réessayer.");
          }
        } catch (err) {
          console.error("Scanning error", err);
          setError("Problème de connexion. Veuillez réessayer.");
        }
      } else {
         setError("Impossible de lire l'image.");
      }
      setIsScanning(false);
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleRegenerateIcon = async () => {
    if (!scannedItem) return;
    setIsRegeneratingIcon(true);
    try {
      const response = await fetch('/api/regenerate-icon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemName: scannedItem.name, category: scannedItem.category })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.iconName) {
           setScannedItem({ ...scannedItem, iconName: data.iconName });
        }
      }
    } catch (e) {
      console.error(e);
    }
    setIsRegeneratingIcon(false);
  };

  const handleAdd = () => {
    if (!scannedItem) return;
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
    onAddPredefinedItem({
        id,
        name: scannedItem.name,
        price: scannedItem.price,
        category: scannedItem.category,
        iconName: scannedItem.iconName,
        frequent: true
    });
    onClose();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[1000]"
        onClick={onClose}
      />

      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 max-h-[90vh] h-[85vh] flex flex-col bg-slate-50 rounded-t-[32px] shadow-2xl z-[1001] overflow-hidden max-w-md mx-auto"
      >
        <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800">Scanner Article</h2>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-0.5">Par Intelligence Artificielle</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 active:bg-slate-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
            {!isScanning && !scannedItem && (
                <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-[24px] border border-slate-100 shadow-sm mt-4">
                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-4">
                        <ImageIcon size={32} />
                    </div>
                    <p className="text-slate-600 font-medium mb-6">Prenez une photo d'un de vos articles d'achat pour que notre IA l'analyse et l'ajoute à votre catalogue.</p>
                    
                    {error && (
                      <div className="w-full bg-rose-50 text-rose-600 text-sm font-bold p-4 rounded-xl mb-6 shadow-sm border border-rose-100">
                        {error}
                      </div>
                    )}

                    <div className="flex w-full gap-3">
                      <button 
                          onClick={() => cameraInputRef.current?.click()}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 px-2 rounded-2xl hover:opacity-90 transition shadow-sm flex flex-col items-center justify-center gap-2"
                      >
                          <Camera size={24} />
                          <span className="text-xs">Prendre Photo</span>
                      </button>
                      <button 
                          onClick={() => galleryInputRef.current?.click()}
                          className="flex-1 bg-white border-2 border-blue-100 text-blue-600 font-bold py-4 px-2 rounded-2xl hover:bg-blue-50 transition shadow-sm flex flex-col items-center justify-center gap-2"
                      >
                          <ImageIcon size={24} />
                          <span className="text-xs">Depuis Galerie</span>
                      </button>
                    </div>
                    <input 
                        type="file" 
                        accept="image/*" 
                        capture="environment"
                        ref={cameraInputRef} 
                        className="hidden" 
                        onChange={handleImageSelection} 
                    />
                    <input 
                        type="file" 
                        accept="image/*" 
                        ref={galleryInputRef} 
                        className="hidden" 
                        onChange={handleImageSelection} 
                    />
                </div>
            )}

            {isScanning && (
                <div className="flex flex-col items-center justify-center p-12 mt-12">
                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 animate-pulse" />
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg relative border border-blue-100">
                             <Sparkles size={32} className="text-blue-500 animate-pulse" />
                        </div>
                    </div>
                    <p className="text-slate-600 font-bold mb-2">L'IA analyse votre image...</p>
                    <p className="text-slate-400 text-sm text-center">Détection de l'article, du prix estimé et génération de l'icône appropriée.</p>
                </div>
            )}

            {scannedItem && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                        <div className="flex items-center gap-4 mb-6 relative">
                            <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-700 shadow-inner group">
                                {(()=>{ 
                                   const IconComponent = (ICON_MAP as Record<string, React.ElementType>)[scannedItem.iconName] || ICON_MAP['PackageOpen'];
                                   return <IconComponent size={40} className="text-blue-600 transition-transform group-hover:scale-110" />
                                })()}
                            </div>
                            <div className="flex-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Icône</label>
                                <button 
                                    onClick={handleRegenerateIcon}
                                    disabled={isRegeneratingIcon}
                                    className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-sm font-bold active:bg-blue-100 transition-colors"
                                >
                                    {isRegeneratingIcon ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                                    Régénérer
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 ml-1">Nom de l'article</label>
                                <input 
                                    type="text"
                                    value={scannedItem.name}
                                    onChange={(e) => setScannedItem({...scannedItem, name: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>
                            
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 ml-1">Prix (DH)</label>
                                    <input 
                                        type="number"
                                        step="0.01"
                                        value={scannedItem.price}
                                        onChange={(e) => setScannedItem({...scannedItem, price: parseFloat(e.target.value) || 0})}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>
                                <div className="flex-[1.5]">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 ml-1">Catégorie</label>
                                    <select 
                                        value={scannedItem.category}
                                        onChange={(e) => setScannedItem({...scannedItem, category: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                                    >
                                        {CATEGORIES.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>

        {scannedItem && (
            <div className="p-6 bg-white border-t border-slate-100 flex-shrink-0 absolute bottom-0 left-0 right-0">
                <button
                    onClick={handleAdd}
                    className="w-full bg-slate-900 text-white font-black py-4 px-6 rounded-2xl hover:bg-slate-800 transition shadow-sm active:scale-[0.98] flex items-center justify-center gap-2"
                >
                    <Plus size={20} />
                    Valider et Ajouter au catalogue
                </button>
            </div>
        )}
      </motion.div>
    </>
  );
}
