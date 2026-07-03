import fs from 'fs';
let content = fs.readFileSync('src/components/History.tsx', 'utf-8');

const regexEmpty = /<div className="space-y-4 pb-8" style=\{\{ height: "calc\(100vh - 210px\)" \}\}>\s*<GroupedVirtuoso/;

const emptyStateCode = `<div className="space-y-4 pb-8" style={{ height: "calc(100vh - 210px)" }}>
        {filteredTransactions.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 mx-2">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm ring-8 ring-slate-50">
              <Search size={40} className="text-slate-300" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-black text-slate-800 mb-2">Aucun résultat</h3>
            <p className="text-sm font-bold text-slate-400 max-w-[200px] mb-6">
              Nous n'avons trouvé aucune transaction correspondant à vos critères.
            </p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setFilter('ALL');
                setSelectedCategory(t.tous);
                setStartDate('');
                setEndDate('');
                setSelectedTags([]);
              }}
              className="px-6 py-3 bg-white text-slate-700 text-xs font-black uppercase tracking-widest rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors"
            >
              Réinitialiser
            </button>
          </div>
        ) : (
          <GroupedVirtuoso`;

content = content.replace(regexEmpty, emptyStateCode);

// Add the closing parenthesis for the conditional render
const regexCloseEmpty = /<\/GroupedVirtuoso>/;
const closeEmptyCode = `</GroupedVirtuoso>\n        )}`;
content = content.replace(regexCloseEmpty, closeEmptyCode);

fs.writeFileSync('src/components/History.tsx', content);
