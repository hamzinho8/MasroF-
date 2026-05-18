const fs = require('fs');

const renderBlock = `            if (isCreditPlus || isCreditMinus) {
              const isReceive = isCreditPlus;
              return (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.03 }}
                  className={\`group flex items-center gap-4 p-5 rounded-[32px] border transition-all relative backdrop-blur-sm shadow-sm \${
                    isReceive
                      ? "bg-indigo-50/30 border-indigo-100/50 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/10"
                      : "bg-amber-50/30 border-amber-100/50 hover:border-amber-200 hover:shadow-xl hover:shadow-amber-500/10"
                  }\`}
                  style={{
                    overflow: activeMenuId === tx.id ? "visible" : "hidden",
                    zIndex: activeMenuId === tx.id ? 50 : 1,
                  }}
                >
                  <div
                    className={\`shrink-0 w-14 h-14 rounded-[22px] flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-sm \${
                      isReceive
                        ? "bg-indigo-600 text-white shadow-indigo-600/20"
                        : "bg-amber-500 text-white shadow-amber-500/20"
                    }\`}
                  >
                    {isReceive ? (
                      <TrendingUp size={24} />
                    ) : (
                      <TrendingDown size={24} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-center py-1">
                    <p className="font-black text-slate-800 text-sm tracking-tight truncate mb-1 italic select-none">
                      {tx.label.replace(/Prêt à |Emprunt de /i, '')}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
                      <span className="text-[9px] flex items-center gap-1 font-bold uppercase tracking-wider text-slate-400 shrink-0">
                        <Calendar
                          size={10}
                          className={
                            isReceive ? "text-indigo-500" : "text-amber-500"
                          }
                        />
                        {tx.date}
                      </span>
                      <span
                        className={\`text-[9px] font-black uppercase tracking-[0.1em] truncate max-w-[100px] \${isReceive ? "text-indigo-600" : "text-amber-600"}\`}
                      >
                        {isReceive ? t.owedToMe : t.owedByMe}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2 pl-2 border-l border-slate-100">
                    <div className="flex flex-col items-end">
                      <p
                        className={\`font-black tracking-tighter text-base leading-none \${isReceive ? "text-indigo-600" : "text-amber-600"}\`}
                      >
                        {tx.amount.toLocaleString("fr-FR")}
                      </p>
                      <span className="text-[9px] font-bold uppercase text-slate-400 mt-0.5">
                        {currency}
                      </span>
                    </div>

                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setActiveMenuId(
                            activeMenuId === tx.id ? null : tx.id,
                          );
                        }}
                        className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-xl transition-colors text-slate-300 group-hover:text-slate-500 relative z-[60]"
                      >
                        <MoreVertical size={20} />
                      </button>

                      <AnimatePresence>
                        {activeMenuId === tx.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, x: 20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.9, x: 20 }}
                            className="absolute right-12 top-0 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-1.5 flex gap-1 z-[70]"
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(tx);
                              }}
                              className="w-9 h-9 flex items-center justify-center text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(tx.id);
                                setActiveMenuId(null);
                              }}
                              className="w-9 h-9 flex items-center justify-center text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              );
            }
`;

function replaceInHistory() {
  let content = fs.readFileSync('src/components/History.tsx', 'utf8');
  let target = 'return (\n              <motion.div';
  content = content.replace(target, renderBlock + '\n            ' + target);
  fs.writeFileSync('src/components/History.tsx', content);
}

replaceInHistory();
console.log('updated history');
