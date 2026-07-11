import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Plus, Trash2, Edit2, Wallet, Landmark, ShoppingBag, Box, Home, Wifi, MonitorPlay, Calendar } from "lucide-react";
import { ICON_MAP, CATEGORIES, INITIAL_PREDEFINED_ITEMS, getArticleInfo } from "../constants";

export interface UpcomingTransaction {
  id: string;
  label: string;
  amount: number;
  dateStr: string;
  iconName: string;
  colorHex: string;
  categoryId?: string;
  dayOfMonth?: number;
  paidByBank?: boolean;
  lastPaidMonth?: string;
  frequency?: 'monthly' | 'custom_days';
  intervalDays?: number;
  lastPaidDate?: string; // YYYY-MM-DD
}

interface ManageUpcomingModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: UpcomingTransaction[];
  onSave: (transactions: UpcomingTransaction[]) => void;
  language: string;
  currency: string;
}

export default function ManageUpcomingModal({
  isOpen,
  onClose,
  transactions,
  onSave,
  language,
  currency,
}: ManageUpcomingModalProps) {
  const [localTx, setLocalTx] = useState<UpcomingTransaction[]>(transactions);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [editLabel, setEditLabel] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editDayOfMonth, setEditDayOfMonth] = useState<number>(1);
  const [editPaidByBank, setEditPaidByBank] = useState<boolean>(true);
  const [editCategoryId, setEditCategoryId] = useState<string>("Logement");
  const [editIconName, setEditIconName] = useState<string>("");
  const [editColorHex, setEditColorHex] = useState<string>("");
  const [editFrequency, setEditFrequency] = useState<'monthly' | 'custom_days'>('monthly');
  const [editIntervalDays, setEditIntervalDays] = useState<number>(6);

  React.useEffect(() => {
    if (isOpen) {
      setLocalTx(transactions);
      setEditingId(null);
    }
  }, [isOpen, transactions]);

  const handleSaveEdit = () => {
    if (!editLabel || !editAmount) return;

    const dateStr = editFrequency === 'custom_days' ? `Chaque ${editIntervalDays} jours` : `Le ${editDayOfMonth} du mois`;
    const selectedCat = CATEGORIES.find(c => c.id === editCategoryId) || CATEGORIES.find(c => c.id === 'Autres')!; // fallback to Autres

    if (editingId === "new") {
      const newTx: UpcomingTransaction = {
        id: "upc-" + Date.now(),
        label: editLabel,
        amount: parseFloat(editAmount),
        dateStr: dateStr,
        dayOfMonth: editDayOfMonth,
        paidByBank: editPaidByBank,
        categoryId: editCategoryId,
        iconName: editIconName || selectedCat.iconName,
        colorHex: editColorHex || selectedCat.colorHex,
        frequency: editFrequency,
        intervalDays: editIntervalDays,
      };
      const newLocal = [...localTx, newTx];
      setLocalTx(newLocal);
      onSave(newLocal);
    } else {
      const newLocal = localTx.map(t => t.id === editingId ? {
        ...t,
        label: editLabel,
        amount: parseFloat(editAmount),
        dateStr: dateStr,
        dayOfMonth: editDayOfMonth,
        paidByBank: editPaidByBank,
        categoryId: editCategoryId,
        iconName: editIconName || selectedCat.iconName,
        colorHex: editColorHex || selectedCat.colorHex,
        frequency: editFrequency,
        intervalDays: editIntervalDays,
      } : t);
      setLocalTx(newLocal);
      onSave(newLocal);
    }
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    const newLocal = localTx.filter(t => t.id !== id);
    setLocalTx(newLocal);
    onSave(newLocal);
  };

  const startEdit = (tx?: UpcomingTransaction) => {
    if (tx) {
      setEditingId(tx.id);
      setEditLabel(tx.label);
      setEditAmount(tx.amount.toString());
      setEditDayOfMonth(tx.dayOfMonth || parseInt(tx.dateStr.replace(/\D/g, "")) || 1);
      setEditPaidByBank(tx.paidByBank !== false); // default to true
      setEditCategoryId(tx.categoryId || "Logement");
      setEditIconName(tx.iconName || "");
      setEditColorHex(tx.colorHex || "");
      setEditFrequency(tx.frequency || 'monthly');
      setEditIntervalDays(tx.intervalDays || 6);
    } else {
      setEditingId("new");
      setEditLabel("");
      setEditAmount("");
      setEditDayOfMonth(1);
      setEditPaidByBank(true);
      setEditCategoryId("Logement");
      setEditIconName("");
      setEditColorHex("");
      setEditFrequency('monthly');
      setEditIntervalDays(6);
    }
  };

  const handleCategoryClick = (catId: string) => {
    setEditCategoryId(catId);
    setEditIconName("");
    setEditColorHex("");
  };

  const handleItemClick = (item: any) => {
    setEditLabel(item.name);
    setEditAmount(item.price ? item.price.toString() : editAmount);
    if (item.iconName) setEditIconName(item.iconName);
    if (item.colorHex) setEditColorHex(item.colorHex);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[85vh]"
        >
          <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-xl font-black text-slate-800">
              {language === "Français" ? "Gérer les transactions prévues" : "Manage Upcoming"}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-200/50 text-slate-500 flex items-center justify-center active:scale-95 transition-transform"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1">
            {editingId ? (
              <div className="space-y-6">
                
                {/* Category Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Catégorie</label>
                  <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
                    {CATEGORIES.map((cat) => {
                      const IconComp = ICON_MAP[cat.iconName] || ShoppingBag;
                      const isSelected = editCategoryId === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => handleCategoryClick(cat.id)}
                          className={`flex flex-col items-center gap-1.5 p-2 px-1 rounded-2xl border transition-all ${
                            isSelected
                              ? `bg-white ${cat.borderColor} shadow-sm scale-105 border-2`
                              : "border-transparent bg-transparent hover:bg-slate-50"
                          }`}
                        >
                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                              isSelected ? cat.bgColor : "bg-slate-50"
                            } transition-colors`}
                          >
                            <IconComp
                              size={22}
                              className={isSelected ? cat.color : "text-slate-400"}
                            />
                          </div>
                          <span
                            className={`text-[9px] font-black uppercase tracking-wider ${
                              isSelected ? cat.color : "text-slate-400"
                            }`}
                          >
                            {cat.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Predefined Items (Frequent Purchases) */}
                {editCategoryId && (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                      Articles: {editCategoryId}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {INITIAL_PREDEFINED_ITEMS.filter((item) => item.category === editCategoryId).slice(0, 8).map((item) => {
                        const iconName = item.iconName || "Box";
                        const IconComp = ICON_MAP[iconName] || Box;
                        const cat = CATEGORIES.find((c) => c.id === item.category) || CATEGORIES.find(c => c.id === 'Autres')!;

                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleItemClick(item)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-2xl border transition-all hover:bg-slate-50 ${
                              editLabel === item.name
                                ? "border-indigo-300 bg-indigo-50/50"
                                : "border-slate-100 bg-white"
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${cat.bgColor}`}>
                              <IconComp size={14} className={cat.color} />
                            </div>
                            <div className="flex flex-col items-start">
                              <span className="text-[11px] font-black text-slate-700">{item.name}</span>
                              {item.price > 0 && (
                                <span className="text-[9px] font-bold text-slate-400">
                                  {item.price} {currency}
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Libellé</label>
                  <input
                    type="text"
                    value={editLabel}
                    onChange={(e) => setEditLabel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:border-indigo-500 font-medium"
                    placeholder="Qu'avez-vous acheté ?"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Montant ({currency})</label>
                  <input
                    type="number"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:border-indigo-500 font-medium"
                    placeholder="Ex: 2500"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Type de récurrence</label>
                  <div className="flex gap-2 mb-4">
                    <button
                      type="button"
                      onClick={() => setEditFrequency('monthly')}
                      className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all border-2 ${editFrequency === 'monthly' ? 'bg-indigo-50 border-indigo-600 text-indigo-700' : 'bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100'}`}
                    >
                      Chaque mois
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditFrequency('custom_days')}
                      className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all border-2 ${editFrequency === 'custom_days' ? 'bg-indigo-50 border-indigo-600 text-indigo-700' : 'bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100'}`}
                    >
                      Périodique
                    </button>
                  </div>

                  {editFrequency === 'monthly' ? (
                    <>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Jour du mois</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="1"
                          max="31"
                          value={editDayOfMonth}
                          onChange={(e) => setEditDayOfMonth(parseInt(e.target.value))}
                          className="flex-1 accent-indigo-600"
                        />
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center font-black text-indigo-600">
                          {editDayOfMonth}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Tous les (X) jours</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          min="1"
                          max="365"
                          value={editIntervalDays}
                          onChange={(e) => setEditIntervalDays(parseInt(e.target.value) || 1)}
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:border-indigo-500 font-medium"
                          placeholder="Ex: 6 (pour 6 jours)"
                        />
                        <div className="px-4 h-12 rounded-xl bg-slate-100 flex items-center justify-center font-black text-indigo-600 uppercase text-xs">
                          Jours
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2">Source de paiement</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setEditPaidByBank(true)}
                      className={`flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border-2 transition-colors ${
                        editPaidByBank ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-200 bg-white text-slate-500 hover:border-indigo-200"
                      }`}
                    >
                      <Landmark size={20} />
                      <span className="font-bold text-[13px]">Banque</span>
                    </button>
                    <button
                      onClick={() => setEditPaidByBank(false)}
                      className={`flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border-2 transition-colors ${
                        !editPaidByBank ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-200 bg-white text-slate-500 hover:border-indigo-200"
                      }`}
                    >
                      <Wallet size={20} />
                      <span className="font-bold text-[13px]">Poche</span>
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-2xl"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={!editLabel || !editAmount}
                    className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-2xl disabled:opacity-50"
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {localTx.map(tx => {
                  const info = getArticleInfo(tx.label, tx.categoryId, INITIAL_PREDEFINED_ITEMS);
                  const cat = CATEGORIES.find(c => c.id === tx.categoryId) || CATEGORIES.find(c => c.id === 'Autres')!;
                  
                  let IconComp = ICON_MAP[tx.iconName] || ShoppingBag;
                  if (!tx.iconName && tx.categoryId && cat) {
                    IconComp = ICON_MAP[cat.iconName] || ShoppingBag;
                  }
                  
                  const txColor = info.colorHex || cat.colorHex;
                  const inlineBgColor = `${txColor}20`;
                  const inlineIconColor = txColor;

                  return (
                    <div key={tx.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: inlineBgColor, color: inlineIconColor }}
                        >
                          <IconComp size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800">{tx.label}</span>
                          <span className="text-xs font-medium text-slate-500">Le {tx.dayOfMonth || tx.dateStr.replace(/\D/g, "") || 1} • {tx.amount} {currency}</span>
                          <span className="text-[10px] font-bold mt-1 text-indigo-600 bg-indigo-50 w-max px-2 py-0.5 rounded">
                            {tx.paidByBank !== false ? "Banque" : "Poche"}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(tx)}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(tx.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}

                <button
                  onClick={() => startEdit()}
                  className="w-full py-4 mt-2 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center gap-2 text-slate-500 font-bold hover:bg-slate-50 hover:border-slate-300 transition-colors"
                >
                  <Plus size={18} />
                  Ajouter une transaction
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
