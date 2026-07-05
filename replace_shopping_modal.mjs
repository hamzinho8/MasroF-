import fs from 'fs';

let content = fs.readFileSync('src/components/ShoppingListModal.tsx', 'utf-8');

// We need to add toggle logic for isSelectedForWithdrawal
// First, update the import to include Banknote if we want
content = content.replace("import { X, ListTodo, PackageOpen, Plus } from 'lucide-react';", "import { X, ListTodo, PackageOpen, Plus, Banknote, Check } from 'lucide-react';");

// Inside ShoppingListModal, we'll calculate total
const totalCalcCode = `
  const selectedForWithdrawal = shoppingList.filter(item => item.isSelectedForWithdrawal);
  const totalWithdrawal = selectedForWithdrawal.reduce((sum, item) => sum + (item.expectedPrice || 0), 0);

  const toggleSelection = (e: React.MouseEvent, clickedItem: ShoppingListItem) => {
    e.stopPropagation();
    const updatedList = shoppingList.map(item => 
      item.id === clickedItem.id 
        ? { ...item, isSelectedForWithdrawal: !item.isSelectedForWithdrawal } 
        : item
    );
    onShoppingListChange(updatedList);
  };
`;

content = content.replace("}[language];\n\n  return (", "}[language];\n\n" + totalCalcCode + "\n  return (");

// Add the bubble above the list
const bubbleCode = `
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
          
          <AnimatePresence>
            {selectedForWithdrawal.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-6 pt-4 pb-2"
              >
                <div className="bg-emerald-50 border border-emerald-200 rounded-[20px] p-4 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <Banknote size={20} strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-emerald-800">Retrait à prévoir</p>
                      <p className="text-xs font-medium text-emerald-600/80">{selectedForWithdrawal.length} article(s) sélectionné(s)</p>
                    </div>
                  </div>
                  <div className="text-xl font-black text-emerald-600">
                    {totalWithdrawal} <span className="text-sm">{currency}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
`;

content = content.replace(
  /{[\s\S]*?\/\* Header \*\/[\s\S]*?<\/div>\s*<\/div>/, // Wait, this regex might be tricky
  `          {/* Header */}`
);

fs.writeFileSync('src/components/ShoppingListModal.tsx', content);
