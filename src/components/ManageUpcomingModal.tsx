import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2, Edit2, Home, Wifi, MonitorPlay, Calendar } from "lucide-react";

export interface UpcomingTransaction {
  id: string;
  label: string;
  amount: number;
  dateStr: string;
  iconName: string;
  colorHex: string;
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
  const [editDateStr, setEditDateStr] = useState("");
  const [editIconName, setEditIconName] = useState("Home");
  const [editColorHex, setEditColorHex] = useState("#6366f1");

  const ICONS = ["Home", "Wifi", "MonitorPlay", "Calendar"];
  const COLORS = ["#6366f1", "#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"];

  React.useEffect(() => {
    if (isOpen) {
      setLocalTx(transactions);
      setEditingId(null);
    }
  }, [isOpen, transactions]);

  const handleSaveEdit = () => {
    if (!editLabel || !editAmount) return;

    if (editingId === "new") {
      const newTx: UpcomingTransaction = {
        id: "upc-" + Date.now(),
        label: editLabel,
        amount: parseFloat(editAmount),
        dateStr: editDateStr || "Le 1er du mois",
        iconName: editIconName,
        colorHex: editColorHex,
      };
      const newLocal = [...localTx, newTx];
      setLocalTx(newLocal);
      onSave(newLocal);
    } else {
      const newLocal = localTx.map(t => t.id === editingId ? {
        ...t,
        label: editLabel,
        amount: parseFloat(editAmount),
        dateStr: editDateStr,
        iconName: editIconName,
        colorHex: editColorHex,
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
      setEditDateStr(tx.dateStr);
      setEditIconName(tx.iconName);
      setEditColorHex(tx.colorHex);
    } else {
      setEditingId("new");
      setEditLabel("");
      setEditAmount("");
      setEditDateStr("");
      setEditIconName("Home");
      setEditColorHex("#6366f1");
    }
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
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Nom</label>
                  <input
                    type="text"
                    value={editLabel}
                    onChange={(e) => setEditLabel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:border-indigo-500 font-medium"
                    placeholder="Ex: Loyer"
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
                  <label className="block text-xs font-bold text-slate-500 mb-1">Date / Répétition</label>
                  <input
                    type="text"
                    value={editDateStr}
                    onChange={(e) => setEditDateStr(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:border-indigo-500 font-medium"
                    placeholder="Ex: Le 5 du mois"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Icône</label>
                  <div className="flex gap-2">
                    {ICONS.map(ic => (
                      <button
                        key={ic}
                        onClick={() => setEditIconName(ic)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-colors ${
                          editIconName === ic ? "border-indigo-500 bg-indigo-50 text-indigo-500" : "border-slate-100 text-slate-400 bg-white"
                        }`}
                      >
                        {ic === "Home" && <Home size={18} />}
                        {ic === "Wifi" && <Wifi size={18} />}
                        {ic === "MonitorPlay" && <MonitorPlay size={18} />}
                        {ic === "Calendar" && <Calendar size={18} />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Couleur</label>
                  <div className="flex gap-2">
                    {COLORS.map(col => (
                      <button
                        key={col}
                        onClick={() => setEditColorHex(col)}
                        className={`w-8 h-8 rounded-full border-2 transition-transform ${
                          editColorHex === col ? "scale-110 border-slate-800" : "border-transparent scale-100"
                        }`}
                        style={{ backgroundColor: col }}
                      />
                    ))}
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
                {localTx.map(tx => (
                  <div key={tx.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800">{tx.label}</span>
                      <span className="text-xs font-medium text-slate-500">{tx.dateStr} • {tx.amount} {currency}</span>
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
                ))}

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
