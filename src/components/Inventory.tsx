import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, Plus, Minus, X, Info, Search, History as HistoryIcon, User } from 'lucide-react';
import { InventoryItem, InventoryDecreaseAction } from '../types';

interface InventoryProps {
  items: InventoryItem[];
  onItemsChange: (items: InventoryItem[]) => void;
  language: 'Français' | 'العربية' | 'English';
}

export default function Inventory({ items, onItemsChange, language }: InventoryProps) {
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [selectedItemInfo, setSelectedItemInfo] = useState<InventoryItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
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
      inventory: "Inventaire"
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
      inventory: "المخزون"
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
      inventory: "Inventory"
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

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all"
        >
          <Plus size={18} strokeWidth={3} />
          {t.add}
        </button>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
          <Search size={18} />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.search}
          className="w-full bg-slate-100 border-none rounded-2xl py-3 pl-11 pr-4 text-slate-700 font-medium placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
        />
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-[32px] border-2 border-dashed border-slate-200">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Package size={32} />
          </div>
          <p className="text-slate-500 font-medium">{t.empty}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {filteredItems.map(item => (
            <motion.div
              key={item.id}
              layoutId={`card-${item.id}`}
              onClick={() => setSelectedItemInfo(item)}
              className="bg-white rounded-3xl p-5 border shadow-sm border-slate-100 cursor-pointer hover:border-indigo-100 hover:shadow-indigo-500/5 transition-all active:scale-95 relative overflow-hidden group"
            >
              <div className="flex flex-col h-full justify-between gap-4 relative z-10">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                    <Package size={20} />
                  </div>
                  <div className="bg-slate-100 px-2 py-1 rounded-lg">
                    <span className="text-xs font-black text-slate-700">{item.quantity}</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm truncate">{item.name}</h3>
                </div>
              </div>
              <div className="absolute right-0 bottom-0 opacity-[0.03] transform translate-x-1/4 translate-y-1/4 pointer-events-none">
                <Package size={80} />
              </div>
            </motion.div>
          ))}
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
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
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
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 font-medium focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
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
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 font-medium focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
              required
            />
          </div>
          <div className="pt-4">
            <button
              type="submit"
              disabled={!name.trim() || !quantity}
              className="w-full bg-indigo-600 text-white font-bold rounded-2xl py-4 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 active:scale-95 transition-all shadow-sm shadow-indigo-200"
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
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
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
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
              <Package size={28} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800 line-clamp-2">{item.name}</h3>
              <p className="text-sm font-medium text-slate-500">{t.details}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors shrink-0 ml-2">
            <X size={20} />
          </button>
        </div>

        <div className="bg-slate-50 p-6 rounded-[24px] mb-6 border border-slate-100 flex justify-between items-center shrink-0">
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">{t.currentQty}</p>
            <p className="text-4xl font-black text-slate-800">{item.quantity}</p>
          </div>
          <button
            onClick={onDecrease}
            disabled={item.quantity <= 0}
            className="flex flex-col items-center justify-center gap-1 bg-white border-2 border-rose-100 text-rose-600 rounded-2xl h-20 w-24 hover:bg-rose-50 hover:border-rose-200 active:scale-95 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <div className="group-active:-translate-y-1 transition-transform">
              <Minus size={24} strokeWidth={3} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest">{t.decreaseByOne}</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto min-h-[150px] relative">
          <div className="sticky top-0 bg-white/90 backdrop-blur pb-2 pt-1 mb-2">
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <HistoryIcon size={16} className="text-indigo-500" />
              {t.history}
            </h4>
          </div>
          
          {item.history.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-400 font-medium text-sm">{t.noHistory}</p>
            </div>
          ) : (
            <div className="space-y-3 pb-4">
              {item.history.map((action: any) => (
                <div key={action.id} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center">
                      <Minus size={16} strokeWidth={3} />
                    </div>
                    <span className="font-bold text-slate-700">-1</span>
                  </div>
                  <span className="text-xs font-medium text-slate-500">{action.dateStr}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t border-slate-100 flex justify-center shrink-0">
            <button
                onClick={() => {
                    const confirmMsg = language === 'Français' ? 'Voulez-vous vraiment supprimer cet article ?' : language === 'العربية' ? 'هل تريد حقاً حذف هذا العنصر؟' : 'Do you really want to delete this item?';
                    if (window.confirm(confirmMsg)) {
                        onDelete();
                    }
                }}
                className="text-xs font-bold text-red-500 hover:text-red-600 uppercase tracking-widest py-2 px-4 rounded-xl hover:bg-red-50 transition-colors"
                >
                    {language === 'Français' ? 'Supprimer l\'article' : language === 'العربية' ? 'حذف العنصر' : 'Delete item'}
            </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
