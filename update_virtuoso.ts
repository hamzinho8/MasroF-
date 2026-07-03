import fs from 'fs';
let content = fs.readFileSync('src/components/History.tsx', 'utf-8');

const regexList = /<div className="space-y-4 pb-8" style=\{\{ height: "calc\(100vh - 210px\)" \}\}>\s*<Virtuoso[\s\S]*?className="w-full h-full"[\s\S]*?data=\{filteredTransactions\}[\s\S]*?totalCount=\{filteredTransactions.length\}[\s\S]*?itemContent=\{\(index, tx\) => \{/;

const newListCode = `<div className="space-y-4 pb-8" style={{ height: "calc(100vh - 210px)" }}>
        <GroupedVirtuoso
          className="w-full h-full"
          groupCounts={groupCounts}
          groupContent={(index) => {
            const date = groupedData[index].date;
            
            // Generate a readable date
            const today = new Date();
            const dateParts = date.split('/');
            let label = date;
            if (dateParts.length === 2) {
              const d = parseInt(dateParts[0]);
              const m = parseInt(dateParts[1]) - 1;
              if (d === today.getDate() && m === today.getMonth()) {
                label = language === 'العربية' ? 'اليوم' : language === 'English' ? 'Today' : 'Aujourd\\'hui';
              } else {
                const prev = new Date(today);
                prev.setDate(today.getDate() - 1);
                if (d === prev.getDate() && m === prev.getMonth()) {
                  label = language === 'العربية' ? 'أمس' : language === 'English' ? 'Yesterday' : 'Hier';
                }
              }
            }

            return (
              <div className="bg-white/90 backdrop-blur-md py-2 sticky top-0 z-20 mb-2 mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-4 bg-slate-200 rounded-full" />
                  <span className="text-xs font-black uppercase tracking-widest text-slate-500">
                    {label}
                  </span>
                </div>
                <div className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-full">
                  {groupedData[index].transactions.length}
                </div>
              </div>
            );
          }}
          itemContent={(index, groupIndex) => {
            const tx = flatTransactions[index];
            const isSelected = selectedIds.has(tx.id);
            const isHighAmount = tx.type === 'EXPENSE' && tx.amount > 1000;`;

content = content.replace(regexList, newListCode);

// Add the selection wrapping around the main motion div
// First, we find the return statement for the item Content: `return ( \n <div key={tx.id} className="py-2">`

const regexReturn1 = /return \(\s*<div key=\{tx\.id\} className="py-2">\s*<motion\.div/g;
const newReturn1 = `return (
                <div key={tx.id} className="py-1 flex items-center gap-3">
                  {isSelectionMode && (
                    <button 
                      onClick={() => handleSelectTx(tx.id)}
                      className="shrink-0 w-8 h-8 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 transition-colors"
                    >
                      {isSelected ? <CheckSquare size={20} className="text-rose-500" /> : <Square size={20} className="text-slate-300" />}
                    </button>
                  )}
                  <motion.div className="flex-1"`;

content = content.replace(regexReturn1, newReturn1);

// Add anomaly indicator
const regexAmount1 = /<p className="font-black text-slate-800 text-lg tracking-tighter shrink-0 select-none">/g;
const newAmount1 = `{isHighAmount && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center text-white shadow-sm ring-4 ring-white animate-pulse" title="Montant élevé">
                          <AlertCircle size={12} strokeWidth={3} />
                        </div>
                      )}
                      <p className="font-black text-slate-800 text-lg tracking-tighter shrink-0 select-none">`;

content = content.replace(regexAmount1, newAmount1);


// Replace the closing tag for Virtuoso
content = content.replace(/<\/Virtuoso>/g, '</GroupedVirtuoso>');

fs.writeFileSync('src/components/History.tsx', content);
