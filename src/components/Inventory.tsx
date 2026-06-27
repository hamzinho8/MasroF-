import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, PackageOpen, Plus, Minus, X, Info, Search, History as HistoryIcon, User, ListTodo, ShoppingCart, Tag, ChevronDown, ChevronUp } from 'lucide-react';
import { InventoryItem, InventoryDecreaseAction, ShoppingListItem, PredefinedItem } from '../types';
import { ICON_MAP, CATEGORIES } from '../constants';

interface InventoryProps {
  items: InventoryItem[];
  onItemsChange: (items: InventoryItem[]) => void;
  language: 'Français' | 'العربية' | 'English';
  shoppingList: ShoppingListItem[];
  onShoppingListChange: (list: ShoppingListItem[]) => void;
  onAddShoppingItem: () => void;
  onCheckoutShoppingItem: (item: ShoppingListItem) => void;
  currency: string;
  predefinedItems: PredefinedItem[];
}

export default function Inventory({ items, onItemsChange, language, shoppingList, onShoppingListChange, onAddShoppingItem, onCheckoutShoppingItem, currency, predefinedItems }: InventoryProps) {
  const [activeTab, setActiveTab] = useState<'inventory' | 'shoppingList'>('inventory');
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [selectedItemInfo, setSelectedItemInfo] = useState<InventoryItem | null>(null);
  
  const translations = {
    Français: {
      title: "Stock",
      shoppingList: "Liste d'achats",
      add: "Ajouter",
      addShopping: "Programmer Achat",
      search: "Rechercher...",
      empty: "Aucun article dans le stock",
      emptyShoppingList: "Votre liste d'achats est vide",
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
      shoppingList: "قائمة التسوق",
      add: "إضافة",
      addShopping: "برمجة شراء",
      search: "بحث...",
      empty: "لا توجد عناصر في المخزون",
      emptyShoppingList: "قائمة التسوق فارغة",
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
      shoppingList: "Shopping List",
      add: "Add",
      addShopping: "Schedule Buy",
      search: "Search...",
      empty: "No items in stock",
      emptyShoppingList: "Your shopping list is empty",
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
    const existingIndex = items.findIndex(i => i.name.toLowerCase() === name.toLowerCase());
    
    if (existingIndex >= 0) {
      const updatedItems = [...items];
      updatedItems[existingIndex] = {
        ...updatedItems[existingIndex],
        quantity: updatedItems[existingIndex].quantity + quantity
      };
      onItemsChange(updatedItems);
    } else {
      const newItem: InventoryItem = {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
        name,
        quantity,
        addedAt: Date.now(),
        history: []
      };
      onItemsChange([newItem, ...items]);
    }
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
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      dateStr
    };

    const updatedItems = items.map(i => {
      if (i.id === item.id) {
        if (i.unitType === 'grams' || i.unitType === 'liters') {
          const updated = {
            ...i,
            usageCount: (i.usageCount || 0) + 1,
            history: [newAction, ...i.history]
          };
          if (selectedItemInfo && selectedItemInfo.id === item.id) {
            setSelectedItemInfo(updated);
          }
          return updated;
        }

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

  const handleDeclareEmpty = (item: InventoryItem) => {
    const updatedItems = items.map(i => {
      if (i.id === item.id) {
        const updated = {
          ...i,
          quantity: 0
        };
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

  const toggleImportant = (id: string) => {
    const updatedItems = items.map(i => i.id === id ? { ...i, isImportant: !i.isImportant } : i);
    onItemsChange(updatedItems);
    if (selectedItemInfo?.id === id) {
      setSelectedItemInfo({ ...selectedItemInfo, isImportant: !selectedItemInfo.isImportant });
    }
  };

  const activeItems = items.filter(item => item.quantity > 0);
  const consumedItems = items.filter(item => item.quantity === 0);

  const [expandedConsumedGroups, setExpandedConsumedGroups] = useState<string[]>([]);

  const groupedConsumedItems = React.useMemo(() => {
    const groups: Record<string, {
      name: string;
      items: InventoryItem[];
    }> = {};

    consumedItems.forEach(item => {
      const key = item.name.toLowerCase().trim();
      if (!groups[key]) {
        groups[key] = {
          name: item.name,
          items: []
        };
      }
      groups[key].items.push(item);
    });

    return Object.values(groups).sort((a, b) => b.items.length - a.items.length);
  }, [consumedItems]);

  const toggleConsumedGroup = (groupName: string) => {
    setExpandedConsumedGroups(prev => 
      prev.includes(groupName) ? prev.filter(g => g !== groupName) : [...prev, groupName]
    );
  };

  const getAverageLifespan = (groupItems: InventoryItem[]) => {
    let totalMs = 0;
    let count = 0;
    groupItems.forEach(item => {
      if (item.history && item.history.length > 0) {
        const lastAction = item.history[0].timestamp; // most recent
        totalMs += (lastAction - item.addedAt);
        count++;
      }
    });
    if (count === 0) return null;
    const days = Math.round((totalMs / count) / (1000 * 60 * 60 * 24));
    return Math.max(1, days);
  };

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
          onClick={() => activeTab === 'inventory' ? setIsAddItemModalOpen(true) : onAddShoppingItem()}
          className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-5 py-2.5 rounded-2xl text-sm font-bold shadow-md shadow-indigo-500/20 hover:from-violet-500 hover:to-indigo-500 active:scale-95 transition-all"
        >
          <Plus size={18} strokeWidth={3} />
          {activeTab === 'inventory' ? t.add : t.addShopping}
        </button>
      </div>

      <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-6">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex-1 py-2.5 text-sm font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'inventory' 
              ? 'bg-white text-violet-700 shadow-sm' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Package size={16} />
          {t.inventory}
        </button>
        <button
          onClick={() => setActiveTab('shoppingList')}
          className={`flex-1 py-2.5 text-sm font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'shoppingList' 
              ? 'bg-white text-indigo-700 shadow-sm' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <ListTodo size={16} />
          {t.shoppingList}
        </button>
      </div>

      <div className="relative">
      <AnimatePresence mode="wait">
        {activeTab === 'inventory' ? (
          <motion.div 
            key="inventory-content"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex flex-col gap-6"
          >
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
              {activeItems.map((item, index) => {
                const predefinedItem = predefinedItems.find(p => p.name.toLowerCase() === item.name.toLowerCase());
                const categoryId = predefinedItem?.category || 'Autres';
                const cat = CATEGORIES.find(c => c.id === categoryId) || CATEGORIES.find(c => c.id === 'Autres')!;
                // Fallback to item.iconName if no predefined icon is found
                const iconName = predefinedItem?.iconName || item.iconName;
                const IconComponent = (iconName && ICON_MAP[iconName]) ? ICON_MAP[iconName] as React.ElementType : PackageOpen;
                const iconColorClass = cat.color;
                const bgClass = cat.bgColor;
                
                return (
                  <motion.div
                    key={`${item.id}-${index}`}
                    layoutId={`card-${item.id}-${index}`}
                    onClick={() => setSelectedItemInfo(item)}
                    className="group flex items-center gap-4 p-5 rounded-[32px] border transition-transform relative shadow-sm bg-slate-50/90 border-slate-100 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-500/10 cursor-pointer overflow-hidden"
                  >
                    <div className={`shrink-0 w-14 h-14 rounded-[22px] flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-sm ${bgClass} ${iconColorClass} relative z-10 opacity-90`}>
                      {predefinedItem?.iconSvg ? (
                         <div dangerouslySetInnerHTML={{ __html: predefinedItem.iconSvg }} className="w-6 h-6 text-current" />
                      ) : (
                         <IconComponent size={24} />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-center py-1 relative z-10">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-black text-slate-800 text-sm tracking-tight truncate italic select-none">
                          {item.name}
                        </p>
                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleImportant(item.id); }}
                          className={`shrink-0 transition-colors z-20 relative p-1 rounded-full ${item.isImportant ? 'text-amber-500' : 'text-slate-300 hover:text-slate-400 bg-white/50 hover:bg-white border border-transparent hover:border-slate-200'}`}
                        >
                          <Tag size={14} className={item.isImportant ? "fill-amber-500" : ""} />
                        </button>
                      </div>
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
                      <span className="text-xl font-black text-slate-700 leading-none">
                        {item.unitType === 'grams' || item.unitType === 'liters' ? (item.usageCount || 0) : item.quantity}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 text-right">
                        {item.unitType === 'grams' || item.unitType === 'liters' ? (language === 'Français' ? 'Utilisations' : 'Usages') : (language === 'Français' ? 'Qté' : language === 'العربية' ? 'كمية' : 'Qty')}
                      </span>
                      {(item.unitType === 'grams' || item.unitType === 'liters') && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeclareEmpty(item);
                          }}
                          className="mt-2 text-[10px] bg-red-100 text-red-600 font-bold px-2 py-1 rounded-lg uppercase tracking-wider hover:bg-red-200 transition-colors"
                        >
                          Épuisé
                        </button>
                      )}
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
                {groupedConsumedItems.map((group) => {
                  const predefinedItem = predefinedItems.find(p => p.name.toLowerCase() === group.name.toLowerCase());
                  const categoryId = predefinedItem?.category || 'Autres';
                  const cat = CATEGORIES.find(c => c.id === categoryId) || CATEGORIES.find(c => c.id === 'Autres')!;
                  const iconName = predefinedItem?.iconName || group.items[0].iconName;
                  const IconComponent = (iconName && ICON_MAP[iconName]) ? ICON_MAP[iconName] as React.ElementType : PackageOpen;
                  const isExpanded = expandedConsumedGroups.includes(group.name);
                  const avgLifespan = getAverageLifespan(group.items);

                  return (
                    <div key={group.name} className="flex flex-col gap-2">
                      <div
                        onClick={() => toggleConsumedGroup(group.name)}
                        className="group flex flex-col gap-3 p-5 rounded-[32px] border transition-all relative shadow-sm bg-slate-50/90 border-slate-100 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-500/10 cursor-pointer overflow-hidden z-0"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`shrink-0 w-14 h-14 rounded-[22px] flex items-center justify-center transition-all duration-500 shadow-sm relative z-10 ${cat.bgColor} ${cat.color} opacity-90`}>
                            {predefinedItem?.iconSvg ? (
                               <div dangerouslySetInnerHTML={{ __html: predefinedItem.iconSvg }} className="w-6 h-6 text-current" />
                            ) : (
                               <IconComponent size={24} />
                            )}
                          </div>

                          <div className="flex-1 min-w-0 flex flex-col justify-center py-1 relative z-10">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-black text-slate-800 text-sm tracking-tight truncate italic select-none">
                                {group.name}
                              </p>
                              <span className="px-2 py-0.5 rounded-full bg-slate-200 text-[10px] font-bold text-slate-500">
                                x{group.items.length}
                              </span>
                            </div>
                            <div className="flex flex-col gap-1">
                              {avgLifespan !== null && (
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
                                  <span className="text-[9px] flex items-center gap-1 font-bold uppercase tracking-wider text-indigo-500 shrink-0">
                                    <HistoryIcon size={10} className="text-indigo-500" />
                                    {language === 'Français' ? 'Durée de vie moy. : ' : language === 'العربية' ? 'متوسط العمر : ' : 'Avg lifespan : '}
                                    {avgLifespan} {language === 'Français' ? 'jours' : language === 'العربية' ? 'أيام' : 'days'}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col items-end shrink-0 pl-2 relative z-10">
                            <div className="text-slate-300 group-hover:text-slate-500 transition-colors">
                              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </div>
                          </div>
                        </div>

                        {/* Accordion Content */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="border-t border-slate-100 pt-3 mt-1 flex flex-col gap-2"
                            >
                              {group.items.map((item, idx) => (
                                <div key={`${item.id}-${idx}`} className="flex items-center justify-between py-2 px-3 bg-white rounded-2xl shadow-sm border border-slate-50">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                                      <span className="text-[10px] font-black">{idx + 1}</span>
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                        {new Date(item.addedAt).toLocaleDateString(language === 'Français' ? 'fr-FR' : language === 'العربية' ? 'ar-MA' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                      </span>
                                      {item.history && item.history.length > 0 && (
                                        <span className="text-[10px] font-bold text-rose-500 flex items-center gap-1 mt-0.5">
                                          <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                                          {new Date(item.history[0].timestamp).toLocaleDateString(language === 'Français' ? 'fr-FR' : language === 'العربية' ? 'ar-MA' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); setSelectedItemInfo(item); }}
                                    className="px-3 py-1.5 rounded-xl bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider hover:bg-slate-100 transition-colors"
                                  >
                                    {t.details}
                                  </button>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          </div>
        )}
        </motion.div>
        ) : (
          <motion.div 
            key="shoppingList-content"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex flex-col gap-6"
          >
            {shoppingList.length === 0 ? (
              <div className="text-center py-16 px-6 rounded-[40px] border-2 border-dashed border-slate-200 bg-slate-50/50">
                <div className="w-20 h-20 rounded-full bg-slate-200/50 flex items-center justify-center mx-auto mb-5 text-slate-400">
                  <ListTodo size={40} />
                </div>
                <p className="text-slate-500 font-bold text-lg">{t.emptyShoppingList}</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {shoppingList.map((item, idx) => {
                  const IconComp = (item.iconName && ICON_MAP[item.iconName]) ? ICON_MAP[item.iconName] as React.ElementType : PackageOpen;
                  const cat = CATEGORIES.find(c => c.id === item.category) || CATEGORIES.find(c => c.id === 'Autres')!;
                  
                  return (
                    <motion.div
                      key={`${item.id}-${idx}`}
                      onClick={() => onCheckoutShoppingItem(item)}
                      className={`group flex items-center gap-4 p-5 rounded-[32px] border transition-transform relative shadow-sm hover:shadow-xl cursor-pointer overflow-hidden ${cat.lightBg} border-slate-100`}
                    >
                      <div className={`shrink-0 w-14 h-14 rounded-[22px] flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-sm ${cat.bgColor} ${cat.color} relative z-10 opacity-90`}>
                        {item.iconSvg ? (
                             <div dangerouslySetInnerHTML={{ __html: item.iconSvg }} className="w-6 h-6 text-current" />
                        ) : (
                             <IconComp size={24} />
                        )}
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-center py-1 relative z-10">
                        <p className="font-black text-slate-800 text-sm tracking-tight truncate mb-1 italic select-none">
                          {item.name}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.category}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end shrink-0 pl-2 relative z-10">
                        {item.expectedPrice ? (
                          <span className="text-sm font-black text-slate-700 leading-none">{item.expectedPrice} {currency}</span>
                        ) : null}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onShoppingListChange(shoppingList.filter((sItem) => sItem.id !== item.id));
                          }}
                          className="mt-2 w-8 h-8 rounded-full bg-slate-200 hover:bg-rose-100 text-slate-500 hover:text-rose-500 flex items-center justify-center transition-colors"
                        >
                          <X size={14} strokeWidth={3} />
                        </button>
                      </div>
                      <div className="absolute -right-4 -bottom-4 opacity-[0.02] transform group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500 pointer-events-none text-slate-900 z-0">
                        <ShoppingCart size={100} />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      </div>

      {/* Add Item Modal */}
      <AnimatePresence>
        {isAddItemModalOpen && (
          <AddItemModal 
            onClose={() => setIsAddItemModalOpen(false)} 
            onAdd={handleAddItem}
            t={t}
            language={language}
            predefinedItems={predefinedItems}
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

function AddItemModal({ onClose, onAdd, t, language, predefinedItems }: any) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Nourriture');
  const [showFrequent, setShowFrequent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && quantity && parseInt(quantity, 10) >= 0) {
      onAdd(name.trim(), parseInt(quantity, 10)); // We could pass category too if InventoryItem takes it in the future
    }
  };

  const handleCategoryClick = (catId: string) => {
    setSelectedCategory(catId);
    setShowFrequent(false);
  };

  const handleItemClick = (item: any) => {
    setName(item.name);
    setQuantity(item.quantity ? item.quantity.toString() : '1');
  };

  const displayedItems = showFrequent 
    ? (predefinedItems || []).filter((item: any) => item.frequent)
    : (predefinedItems || []).filter((item: any) => item.category === selectedCategory);

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
        className="bg-white w-full max-w-md rounded-[32px] p-6 shadow-2xl overflow-y-auto max-h-[90vh]"
        onClick={e => e.stopPropagation()}
        dir={language === 'العربية' ? 'rtl' : 'ltr'}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl items-center font-black text-slate-800">{t.add}</h3>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-6 mb-6">
          {/* Categories Grid */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">
              Catégorie
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`flex flex-col items-center gap-1.5 p-2 px-1 rounded-2xl border transition-all ${
                    selectedCategory === cat.id && !showFrequent
                      ? `bg-white shadow-md scale-105 border-transparent ring-2 ring-violet-500/20` 
                      : 'border-slate-100 bg-slate-50 opacity-60'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${cat.bgColor} ${cat.color} ${(selectedCategory === cat.id && !showFrequent) ? 'scale-110' : ''} transition-transform`}>
                    {(() => { const CatIcon = ICON_MAP[cat.iconName] || ICON_MAP['MoreHorizontal']; return <CatIcon size={20} />; })()}
                  </div>
                  <span className={`text-[8px] font-black uppercase tracking-tight text-center truncate w-full ${
                    (selectedCategory === cat.id && !showFrequent) ? 'text-violet-600' : 'text-slate-400'
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
                  className="text-[9px] font-black text-violet-600 uppercase tracking-widest hover:underline"
                >
                  Voir Fréquents
                </button>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2 w-full">
              <AnimatePresence mode="popLayout">
                {displayedItems.map((item: any, index: number) => {
                  const Icon = ICON_MAP[item.iconName] || Package;
                  const cat = CATEGORIES.find(c => c.id === item.category) || CATEGORIES[7];
                  return (
                    <motion.button
                      key={`${item.id}-${index}`}
                      type="button"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.15, delay: index * 0.02 }}
                      className={`flex items-center gap-2 p-2 bg-white rounded-full border border-slate-100 shadow-sm active:scale-95 transition-all text-left group hover:border-${cat.color ? cat.color.replace('text-', '') : 'violet-200'}`}
                      onClick={() => handleItemClick(item)}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 group-active:scale-90 transition-transform ${cat.bgColor} ${cat.color}`}>
                        <Icon size={16} />
                      </div>
                      <div className="flex flex-col min-w-0 pr-1">
                        <span className="text-[11px] font-bold text-slate-700 truncate">{item.name}</span>
                      </div>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
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
              disabled={item.quantity <= 0 && item.unitType !== 'grams' && item.unitType !== 'liters'}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex flex-col items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-500/30 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed group border-2 border-indigo-400/20"
            >
              <span className="text-3xl font-black tracking-tighter leading-none mt-1">
                {item.unitType === 'grams' || item.unitType === 'liters' ? (item.usageCount || 0) : item.quantity}
              </span>
              <div className="flex items-center gap-0.5 opacity-80 mt-0.5 group-active:text-rose-200 transition-colors">
                {item.unitType === 'grams' || item.unitType === 'liters' ? (
                  <span className="text-[9px] font-black uppercase tracking-widest leading-none">+1</span>
                ) : (
                  <>
                    <Minus size={10} strokeWidth={4} />
                    <span className="text-[9px] font-black uppercase tracking-widest leading-none">1</span>
                  </>
                )}
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
