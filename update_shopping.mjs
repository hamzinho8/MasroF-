import fs from 'fs';

let content = fs.readFileSync('src/components/ShoppingListModal.tsx', 'utf-8');

// Insert the Bubble UI directly into the correct spot
const headerPattern = `<div className="flex-none p-6 pb-4 border-b border-slate-100 flex items-center justify-between bg-white z-10">`;

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
                className="px-6 pt-4 pb-2 bg-slate-50/50"
              >
                <div className="bg-emerald-50 border border-emerald-200 rounded-[20px] p-4 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
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

// Replace the old header with the new header + bubble
const startIdx = content.indexOf('{/* Header */}');
if (startIdx !== -1) {
  const endIdx = content.indexOf('{/* Body */}');
  if (endIdx !== -1) {
    const before = content.substring(0, startIdx);
    const after = content.substring(endIdx);
    content = before + bubbleCode + '\n          ' + after;
  }
}

// Now replace the onClick to be toggleSelection and add a checkbox UI to the card
const itemMappingStart = content.indexOf('<motion.div');
// It's safer to just replace onClick={() => onCheckoutShoppingItem(item)}
// And we also want to add a checkbox somewhere. We can add it before the icon.
content = content.replace(
  /onClick=\{\(\) => onCheckoutShoppingItem\(item\)\}/g,
  `onClick={(e) => toggleSelection(e, item)}`
);

// Insert a checkbox
const divStart = `className={\`w-14 h-14 rounded-[20px]`;
const checkboxCode = `
                      <div className="shrink-0 flex items-center justify-center w-8 mr-2">
                        <div className={\`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors \${item.isSelectedForWithdrawal ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 bg-slate-50'}\`}>
                          {item.isSelectedForWithdrawal && <Check size={14} strokeWidth={3} />}
                        </div>
                      </div>
                      <div 
                        className={\`w-14 h-14 rounded-[20px]`;

content = content.replace(divStart, checkboxCode);

// Also need to add the checkout button since we hijacked the click for selection.
// We can change the delete button area to have both a "Checkout" and "Delete" button.
const oldDeleteBtn = `
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onShoppingListChange(shoppingList.filter((sItem) => sItem.id !== item.id));
                          }}
                          className="mt-2 w-8 h-8 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-500 flex items-center justify-center transition-colors"
                        >
                          <X size={14} strokeWidth={3} />
                        </button>
`;

const newActions = `
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onCheckoutShoppingItem(item);
                            }}
                            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-indigo-100 text-slate-400 hover:text-indigo-500 flex items-center justify-center transition-colors"
                          >
                            <Check size={14} strokeWidth={3} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onShoppingListChange(shoppingList.filter((sItem) => sItem.id !== item.id));
                            }}
                            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-500 flex items-center justify-center transition-colors"
                          >
                            <X size={14} strokeWidth={3} />
                          </button>
                        </div>
`;
content = content.replace(oldDeleteBtn, newActions);

fs.writeFileSync('src/components/ShoppingListModal.tsx', content);

