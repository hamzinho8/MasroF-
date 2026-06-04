import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, PackageOpen, Plus, Minus, X, Info, Search, History as HistoryIcon, User } from 'lucide-react';
import { InventoryItem, InventoryDecreaseAction } from '../types';
import { ICON_MAP } from '../constants';

interface InventoryProps {
  items: InventoryItem[];
  onItemsChange: (items: InventoryItem[]) => void;
  language: 'Français' | 'العربية' | 'English';
}

export default function Inventory({ items, onItemsChange, language }: InventoryProps) {
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [selectedItemInfo, setSelectedItemInfo] = useState<InventoryItem | null>(null);
  
  const translations = {
    Français: {
      title: "Stock",
      add: "Ajouter Article",
      search: "Rechercher...",
      empty: "Aucun article dans le stock",
      name: "Nom de l'article",
      quantity: "Quantité initiale",
      save: "Enregistrer",
      cancel: "Annuler",
      details: "Détails de l'article",
      currentQty: "Quantité actuelle",
      decreaseByOne: "Retirer 1",
      history: "Historique des retraits",
      noHistory: "Aucun retrait enregistré",
      inventory: "Inventaire",
      consumed: "Articles consommés"
    },
    العربية: {
      title: "المخزون",
      add: "إضافة عنصر",
      search: "بحث...",
      empty: "لا توجد عناصر في المخزون",
      name: "اسم العنصر",
      quantity: "الكمية الأولية",
      save: "حفظ",
      cancel: "إلغاء",
      details: "تفاصيل العنصر",
      currentQty: "الكمية الحالية",
      decreaseByOne: "سحب 1",
      history: "سجل السحوبات",
      noHistory: "لا توجد سحوبات مسجلة",
      inventory: "المخزون",
      consumed: "عناصر مستهلكة"
    },
    English: {
      title: "Stock",
      add: "Add Item",
      search: "Search...",
      empty: "No items in stock",
      name: "Item Name",
      quantity: "Initial Quantity",
      save: "Save",
      cancel: "Cancel",
      details: "Item Details",
      currentQty: "Current Quantity",
      decreaseByOne: "Remove 1",
      history: "Withdrawal History",
      noHistory: "No withdrawals recorded",
      inventory: "Inventory",
      consumed: "Consumed Items"
    }
  };

  const t = translations[language];

  const handleAddItem = (name: string, quantity: number) => {
    const newItem: InventoryItem = {
      id: Date.now().toString(),
      name,
      quantity,
      addedAt: Date.now(),
      history: []
    };
    onItemsChange([newItem, ...items]);
    setIsAddItemModalOpen(false);
  };

  const handleDecrease = (item: InventoryItem) => {
    if (item.quantity <= 0) return;
    
    const now = new Date();
    const dateStr = now.toLocaleDateString(
      language === 'Français' ? 'fr-FR' : (language === 'العربية' ? 'ar-MA' : 'en-US'), 
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    ).replace(',', '');
    
    const newAction: InventoryDecreaseAction = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      dateStr
    };

    const updatedItems = items.map(i => {
      if (i.id === item.id) {
        const updated = {
          ...i,
          quantity: i.quantity - 1,
          history: [newAction, ...i.history]
        };
        // Update selected item info live if it's open
        if (selectedItemInfo && selectedItemInfo.id === item.id) {
          setSelectedItemInfo(updated);
        }
        return updated;
      }
      return i;
    });

    onItemsChange(updatedItems);
  };

  const handleDelete = (id: string) => {
    const updatedItems = items.filter(i => i.id !== id);
    onItemsChange(updatedItems);
    if (selectedItemInfo?.id === id) {
      setSelectedItemInfo(null);
    }
  };

  const activeItems = items.filter(item => item.quantity > 0);
  const consumedItems = items.filter(item => item.quantity === 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-md mx-auto"
    >
      <div className="flex justify-between items-center mb-6 px-1">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">{t.title}</h2>
        <button
          onClick={() => setIsAddItemModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-5 py-2.5 rounded-2xl text-sm font-bold shadow-md shadow-indigo-500/20 hover:from-violet-500 hover:to-indigo-500 active:scale-95 transition-all"
        >
          <Plus size={18} strokeWidth={3} />
          {t.add}
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 px-6 rounded-[40px] border-2 border-dashed border-slate-200 bg-slate-50/50">
          <div className="w-20 h-20 rounded-full bg-slate-200/50 flex items-center justify-center mx-auto mb-5 text-slate-400">
            <PackageOpen size={40} />
          </div>
          <p className="text-slate-500 font-bold text-lg">{t.empty}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {activeItems.length > 0 && (
            <div className="flex flex-col gap-3">
              {activeItems.map(item => {
                const IconComponent = (item.iconName && ICON_MAP[item.iconName]) ? ICON_MAP[item.iconName] as React.ElementType : PackageOpen;
                const iconColorClass = item.color ? item.color : "text-white";
                const bgClass = item.bg ? item.bg : "bg-violet-600";
                
                return (
                  <motion.div
                    key={item.id}
                    layoutId={`card-${item.id}`}
                    onClick={() => setSelectedItemInfo(item)}
                    className="group flex items-center gap-4 p-5 rounded-[32px] border transition-transform relative shadow-sm bg-slate-50/90 border-slate-100 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-500/10 cursor-pointer overflow-hidden"
                  >
                    <div className={`shrink-0 w-14 h-14 rounded-[22px] flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-sm ${bgClass} ${iconColorClass} relative z-10 opacity-90`}>
                      <IconComponent size={24} />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-center py-1 relative z-10">
                      <p className="font-black text-slate-800 text-sm tracking-tight truncate mb-1 italic select-none">
                        {item.name}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
                        <span className="text-[9px] flex items-center gap-1 font-bold uppercase tracking-wider text-slate-400 shrink-0">
                          <IconComponent size={10} className="text-slate-400" />
                          {new Date(item.addedAt).toLocaleDateString(language === 'Français' ? 'fr-FR' : language === 'العربية' ? 'ar-MA' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 tracking-wider">
                          {new Date(item.addedAt).toLocaleTimeString(language === 'Français' ? 'fr-FR' : language === 'العربية' ? 'ar-MA' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0 pl-2 relative z-10">
                      <span className="text-xl font-black text-slate-700 leading-none">{item.quantity}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        {language === 'Français' ? 'Qté' : language === 'العربية' ? 'كمية' : 'Qty'}
                      </span>
                    </div>
                    <div className="absolute -right-4 -bottom-4 opacity-[0.02] transform group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500 pointer-events-none text-slate-900 z-0">
                      <IconComponent size={100} />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {consumedItems.length > 0 && (
            <div className="mt-2">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                {t.consumed}
              </h3>
              <div className="flex flex-col gap-3">
                {consumedItems.map(item => {
                  const IconComponent = (item.iconName && ICON_MAP[item.iconName]) ? ICON_MAP[item.iconName] as React.ElementType : PackageOpen;
                  return (
                    <motion.div
                      key={item.id}
                      layoutId={`card-${item.id}`}
                      onClick={() => setSelectedItemInfo(item)}
                      className="group flex items-center gap-4 p-5 rounded-[32px] border transition-transform relative shadow-sm bg-slate-50 border-slate-200 hover:border-slate-300 cursor-pointer overflow-hidden opacity-60 hover:opacity-100 grayscale hover:grayscale-0"
                    >
                      <div className="shrink-0 w-14 h-14 rounded-[22px] flex items-center justify-center transition-all duration-500 shadow-sm bg-slate-200 text-slate-500 relative z-10">
                        <IconComponent size={24} />
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-center py-1 relative z-10">
                        <p className="font-black text-slate-800 text-sm tracking-tight truncate mb-1 italic select-none line-through">
                          {item.name}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
                          <span className="text-[9px] flex items-center gap-1 font-bold uppercase tracking-wider text-slate-400 shrink-0">
                            <IconComponent size={10} className="text-slate-400" />
                            {new Date(item.addedAt).toLocaleDateString(language === 'Français' ? 'fr-FR' : language === 'العربية' ? 'ar-MA' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end shrink-0 pl-2 relative z-10">
                        <span className="text-xl font-black text-slate-400 leading-none">0</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                          {language === 'Français' ? 'Épuisé' : language === 'العربية' ? 'نفذت' : 'Out'}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Item Modal */}
      <AnimatePresence>
        {isAddItemModalOpen && (
          <AddItemModal 
            onClose={() => setIsAddItemModalOpen(false)} 
            onAdd={handleAddItem}
            t={t}
            language={language}
          />
        )}
      </AnimatePresence>

      {/* Item Details Modal */}
      <AnimatePresence>
        {selectedItemInfo && (
          <ItemDetailsModal 
            item={selectedItemInfo} 
            onClose={() => setSelectedItemInfo(null)}
            onDecrease={() => handleDecrease(selectedItemInfo)}
            onDelete={() => handleDelete(selectedItemInfo.id)}
            t={t}
            language={language}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function AddItemModal({ onClose, onAdd, t, language }: any) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && quantity && parseInt(quantity, 10) >= 0) {
      onAdd(name.trim(), parseInt(quantity, 10));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-slate-900/60"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-white w-full max-w-md rounded-[32px] p-6 shadow-2xl"
        onClick={e => e.stopPropagation()}
        dir={language === 'العربية' ? 'rtl' : 'ltr'}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black text-slate-800">{t.add}</h3>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">{t.name}</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 font-medium focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all"
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">{t.quantity}</label>
            <input
              type="number"
              min="0"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 font-medium focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all"
              required
            />
          </div>
          <div className="pt-4">
            <button
              type="submit"
              disabled={!name.trim() || !quantity}
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-2xl py-4 disabled:opacity-50 disabled:cursor-not-allowed hover:from-violet-500 hover:to-indigo-500 active:scale-95 transition-all shadow-md shadow-indigo-500/20"
            >
              {t.save}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function ItemDetailsModal({ item, onClose, onDecrease, onDelete, t, language }: any) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-slate-900/60"
      onClick={onClose}
    >
      <motion.div
        layoutId={`card-${item.id}`}
        className="bg-white w-full max-w-md rounded-[32px] p-6 shadow-2xl max-h-[85vh] flex flex-col"
        onClick={e => e.stopPropagation()}
        dir={language === 'العربية' ? 'rtl' : 'ltr'}
      >
        <div className="flex justify-between items-start mb-6 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={onDecrease}
              disabled={item.quantity <= 0}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex flex-col items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-500/30 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed group border-2 border-indigo-400/20"
            >
              <span className="text-3xl font-black tracking-tighter leading-none mt-1">{item.quantity}</span>
              <div className="flex items-center gap-0.5 opacity-80 mt-0.5 group-active:text-rose-200 transition-colors">
                <Minus size={10} strokeWidth={4} />
                <span className="text-[9px] font-black uppercase tracking-widest leading-none">1</span>
              </div>
            </button>
            <div>
              <h3 className="text-xl font-black text-slate-800 line-clamp-2 leading-tight">{item.name}</h3>
              <p className="text-sm font-bold text-violet-500 mt-0.5">{t.details}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors shrink-0 ml-2">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto min-h-[150px] relative">
          <div className="sticky top-0 bg-white/95 pb-2 pt-1 mb-2 z-10">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <HistoryIcon size={14} className="text-violet-400" />
              {t.history}
            </h4>
          </div>
          
          {item.history.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100">
              <p className="text-slate-400 font-bold text-sm">{t.noHistory}</p>
            </div>
          ) : (
            <div className="space-y-3 pb-4">
              {item.history.map((action: any) => (
                <div key={action.id} className="flex justify-between items-center p-3 rounded-2xl bg-white border-2 border-slate-50 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[14px] bg-rose-50 text-rose-500 flex items-center justify-center">
                      <Minus size={18} strokeWidth={3} />
                    </div>
                    <div>
                      <span className="font-black text-slate-700 block">-1</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quantité</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg">{action.dateStr}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t-2 border-slate-100 flex justify-center shrink-0 overflow-hidden">
            <AnimatePresence mode="wait">
              {!showConfirmDelete ? (
                <motion.button
                    key="delete-btn"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onClick={() => setShowConfirmDelete(true)}
                    className="text-[10px] font-black text-rose-500 hover:text-rose-600 uppercase tracking-widest py-3 px-6 rounded-xl hover:bg-rose-50 transition-colors w-full"
                >
                    {language === 'Français' ? 'Supprimer cet article' : language === 'العربية' ? 'حذف هذا العنصر' : 'Delete this item'}
                </motion.button>
              ) : (
                <motion.div
                    key="confirm-delete"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2 w-full"
                >
                  <button
                      onClick={() => setShowConfirmDelete(false)}
                      className="flex-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest py-3 px-4 rounded-xl hover:bg-slate-200 transition-colors"
                  >
                      {language === 'Français' ? 'Annuler' : language === 'العربية' ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                      onClick={onDelete}
                      className="flex-1 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest py-3 px-4 rounded-xl hover:bg-rose-600 transition-colors shadow-sm shadow-rose-200"
                  >
                      {language === 'Français' ? 'Confirmer' : language === 'العربية' ? 'تأكيد' : 'Confirm'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
