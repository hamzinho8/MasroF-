import fs from 'fs';
const content = fs.readFileSync('src/components/Home.tsx', 'utf-8');

const modalCode = `
function BudgetCategoryDetailsModal({
  category,
  onClose,
  transactions,
  language
}: {
  category: string;
  onClose: () => void;
  transactions: any[];
  language: string;
}) {
  const categoryMatch = CATEGORY_MAP.find((c) => c.label.toLowerCase() === category.toLowerCase()) || CATEGORY_MAP[0];
  
  const categoryTransactions = transactions.filter(t => {
    const isCredit =
        t.category &&
        [
          "on me doit",
          "je dois",
          "مستحقات لي",
          "ديون علي",
          "owed to me",
          "i owe",
          "loans",
          "debts",
          "crédit +",
          "crédit --",
        ].includes(t.category.toLowerCase());
    return (t.type === "EXPENSE" || (t.type as any) === "expense") && !isCredit && (t.category || "Autres").toLowerCase() === category.toLowerCase();
  }).sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-xl"
      >
        <div className="p-6 border-b border-slate-100 flex justify-between items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
          <div className="flex items-center gap-3 relative z-10">
            <div
              className={\`w-12 h-12 rounded-2xl flex items-center justify-center \$\{
                !categoryMatch.colorHex ? \`\$\{categoryMatch.bg\} \$\{categoryMatch.text\}\` : ''
              \}\`}
              style={categoryMatch.colorHex ? { backgroundColor: \`\$\{categoryMatch.colorHex\}20\`, color: categoryMatch.colorHex } : undefined}
            >
              {categoryMatch.icon}
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight leading-none mb-1">
                {category}
              </h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Dernières dépenses
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 transition-colors relative z-10"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {categoryTransactions.length > 0 ? (
            <div className="space-y-3">
              {categoryTransactions.map((tx) => {
                const date = new Date(tx.timestamp);
                return (
                  <div key={tx.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div>
                      <p className="text-sm font-bold text-slate-700">{tx.label || category}</p>
                      <p className="text-[10px] font-medium text-slate-400">
                        {date.toLocaleDateString(language === 'Français' ? 'fr-FR' : language === 'العربية' ? 'ar-MA' : 'en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <span className="text-sm font-black text-slate-800">
                      {tx.amount.toLocaleString("fr-FR")} DH
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-400 text-sm font-medium">Aucune dépense récente.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

`;

const exportIdx = content.indexOf('export default function Home');
let newContent = content.slice(0, exportIdx) + modalCode + content.slice(exportIdx);

// Add the modal at the end of Home return
const regex3 = /(<ReceiptScannerModal\n\s+onClose=\{\(\) => setShowReceiptScannerModal\(false\)\}\n\s+\/>\n\s+\)\})/;
const newCode3 = `$1
        {selectedBudgetCategory && (
          <BudgetCategoryDetailsModal
            category={selectedBudgetCategory}
            onClose={() => setSelectedBudgetCategory(null)}
            transactions={transactions}
            language={language}
          />
        )}`;

newContent = newContent.replace(regex3, newCode3);

fs.writeFileSync('src/components/Home.tsx', newContent);
