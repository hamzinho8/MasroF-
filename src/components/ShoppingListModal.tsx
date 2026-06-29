import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ListTodo, PackageOpen, Plus } from 'lucide-react';
import { ShoppingListItem } from '../types';
import { ICON_MAP, CATEGORIES } from '../constants';

interface ShoppingListModalProps {
  isOpen: boolean;
  onClose: () => void;
  shoppingList: ShoppingListItem[];
  onShoppingListChange: (list: ShoppingListItem[]) => void;
  onAddShoppingItem: () => void;
  onCheckoutShoppingItem: (item: ShoppingListItem) => void;
  language: 'Français' | 'العربية' | 'English';
  currency: string;
}

export default function ShoppingListModal({
  isOpen,
  onClose,
  shoppingList,
  onShoppingListChange,
  onAddShoppingItem,
  onCheckoutShoppingItem,
  language,
  currency,
}: ShoppingListModalProps) {
  if (!isOpen) return null;

  const t = {
    Français: {
      title: "Liste d'achats",
      empty: "Votre liste d'achats est vide",
      add: "Programmer Achat"
    },
    العربية: {
      title: "قائمة التسوق",
      empty: "قائمة التسوق فارغة",
      add: "برمجة شراء"
    },
    English: {
      title: "Shopping List",
      empty: "Your shopping list is empty",
      add: "Schedule Buy"
    }
  }[language];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full sm:w-[500px] bg-white rounded-t-[40px] sm:rounded-[40px] shadow-2xl flex flex-col h-[85vh] sm:h-[80vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex-none p-6 pb-4 border-b border-slate-100 flex items-center justify-between bg-white z-10">
            <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <ListTodo size={20} strokeWidth={2.5} />
              </div>
              {t.title}
            </h2>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
            {shoppingList.length === 0 ? (
              <div className="text-center py-16 px-6 rounded-[40px] border-2 border-dashed border-slate-200 bg-white">
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-5 text-slate-400">
                  <ListTodo size={40} />
                </div>
                <p className="text-slate-500 font-bold text-lg">{t.empty}</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {shoppingList.map((item, idx) => {
                  const IconComp = (item.iconName && ICON_MAP[item.iconName]) ? ICON_MAP[item.iconName] as React.ElementType : PackageOpen;
                  const cat = CATEGORIES.find(c => c.id === item.category) || CATEGORIES.find(c => c.id === 'Autres')!;
                  
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => onCheckoutShoppingItem(item)}
                      className="group flex items-center p-4 rounded-[28px] border-2 border-transparent bg-white shadow-sm hover:border-indigo-100 hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center shrink-0 shadow-inner ${cat.bgColor} ${cat.color}`}>
                        {item.iconSvg ? (
                          <div dangerouslySetInnerHTML={{ __html: item.iconSvg }} className="w-6 h-6 text-current" />
                        ) : (
                          <IconComp size={24} />
                        )}
                      </div>
                      
                      <div className="ml-4 flex-1 min-w-0">
                        <h4 className="font-black text-slate-800 text-[15px] truncate">{item.name}</h4>
                        {item.expectedPrice ? (
                          <p className="text-xs font-bold text-slate-400 mt-1">Est. {item.expectedPrice} {currency}</p>
                        ) : (
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{cat.label}</p>
                        )}
                      </div>

                      <div className="ml-4 flex flex-col items-end shrink-0">
                        {item.expectedPrice ? (
                          <span className="text-sm font-black text-slate-700 leading-none">{item.expectedPrice} {currency}</span>
                        ) : null}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onShoppingListChange(shoppingList.filter((sItem) => sItem.id !== item.id));
                          }}
                          className="mt-2 w-8 h-8 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-500 flex items-center justify-center transition-colors"
                        >
                          <X size={14} strokeWidth={3} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex-none p-6 pt-4 border-t border-slate-100 bg-white">
            <button
              onClick={() => {
                onClose();
                onAddShoppingItem();
              }}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-indigo-500/25"
            >
              <Plus size={20} strokeWidth={3} />
              {t.add}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
