import fs from 'fs';
let content = fs.readFileSync('src/components/History.tsx', 'utf-8');

const regexFilters = /\{\/\* New Professional Filter Pills Section \*\/\}[\s\S]*?<\/AnimatePresence>/;

const newFilters = `{/* Smart Search & Bulk Actions Bar */}
      <div className="px-1 space-y-3">
        <div className="flex items-center gap-2">
          {/* Search Bar */}
          <div className="flex-1 relative group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search size={16} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input 
              type="text" 
              placeholder={language === 'العربية' ? 'بحث...' : 'Rechercher...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-9 pr-4 text-xs font-bold text-slate-700 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 shadow-sm"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-rose-500"
              >
                <X size={14} />
              </button>
            )}
          </div>
          
          {/* Advanced Filters Button */}
          <button 
            onClick={() => setShowAdvancedFilters(true)}
            className="shrink-0 w-11 h-11 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-600 transition-all hover:bg-slate-50 active:scale-95 shadow-sm relative"
          >
            <Filter size={18} strokeWidth={2.5} />
            {(filter !== 'ALL' || selectedCategory !== t.tous || startDate || endDate || selectedTags.length > 0) && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            )}
          </button>
        </div>

        {/* Selection / Bulk Actions Bar */}
        <div className="flex items-center justify-between bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/50">
          <button 
            onClick={toggleSelectionMode}
            className={\`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-2 \${isSelectionMode ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-white hover:text-slate-700'}\`}
          >
            <CheckSquare size={14} />
            {isSelectionMode ? 'Terminer' : 'Sélectionner'}
          </button>
          
          <AnimatePresence>
            {isSelectionMode && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-1"
              >
                <button 
                  onClick={handleSelectAll}
                  className="px-3 py-2 rounded-xl text-[10px] font-bold text-slate-600 hover:bg-white"
                >
                  {selectedIds.size === filteredTransactions.length ? 'Désélectionner tout' : 'Tout'}
                </button>
                {selectedIds.size > 0 && (
                  <button 
                    onClick={handleDeleteSelected}
                    className="px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-rose-500 text-white shadow-sm flex items-center gap-1.5 hover:bg-rose-600 active:scale-95"
                  >
                    <Trash size={12} />
                    Supprimer ({selectedIds.size})
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Advanced Filters Bottom Sheet */}
      <AnimatePresence>
        {showAdvancedFilters && (
          <React.Fragment>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAdvancedFilters(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-x-0 bottom-0 z-[101] bg-white rounded-t-[32px] shadow-2xl flex flex-col max-h-[85vh]"
            >
              <div className="p-4 flex justify-center shrink-0">
                <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
              </div>
              
              <div className="px-6 pb-4 shrink-0 flex items-center justify-between border-b border-slate-100">
                <h3 className="text-lg font-black text-slate-800">Filtres Avancés</h3>
                <button 
                  onClick={() => setShowAdvancedFilters(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-8">
                {/* Date Range */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black uppercase text-slate-400 tracking-widest">Période</span>
                    {(startDate || endDate) && (
                      <button onClick={clearDateRange} className="text-[10px] font-bold text-rose-500 uppercase">Effacer</button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input 
                      type="date" 
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-700"
                    />
                    <input 
                      type="date" 
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-700"
                    />
                  </div>
                </div>

                {/* Type */}
                <div className="space-y-3">
                  <span className="text-xs font-black uppercase text-slate-400 tracking-widest">Type</span>
                  <div className="grid grid-cols-3 gap-2">
                    {['ALL', 'EXPENSE', 'INCOME'].map((f) => (
                      <button 
                        key={f}
                        onClick={() => { setFilter(f as FilterType); if(f === 'INCOME') setSelectedCategory(t.tous); }}
                        className={\`py-2.5 rounded-xl text-xs font-bold border-2 transition-all \${filter === f ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-100 bg-white text-slate-500'}\`}
                      >
                        {f === 'ALL' ? t.tous : (f === 'EXPENSE' ? t.achats : t.retraits)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-3">
                  <span className="text-xs font-black uppercase text-slate-400 tracking-widest">Catégories</span>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => setSelectedCategory(t.tous)}
                      className={\`px-4 py-2 rounded-full text-xs font-bold border-2 transition-all \${selectedCategory === t.tous ? 'border-slate-800 bg-slate-800 text-white' : 'border-slate-100 bg-white text-slate-600'}\`}
                    >
                      {t.tous}
                    </button>
                    {CATEGORY_MAP.map(cat => (
                      <button 
                        key={cat.label}
                        onClick={() => setSelectedCategory(cat.label)}
                        className={\`px-4 py-2 rounded-full text-xs font-bold border-2 transition-all flex items-center gap-2 \${selectedCategory === cat.label ? \`border-\${cat.color}-600 bg-\${cat.color}-600 text-white\` : 'border-slate-100 bg-white text-slate-600'}\`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Tags */}
                {allAvailableTags.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black uppercase text-slate-400 tracking-widest">Tags</span>
                      {selectedTags.length > 0 && (
                        <button onClick={() => setSelectedTags([])} className="text-[10px] font-bold text-rose-500 uppercase">Effacer tout</button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {allAvailableTags.map(tag => (
                        <button
                          key={tag}
                          onClick={() => {
                            if (selectedTags.includes(tag)) setSelectedTags(selectedTags.filter(t => t !== tag));
                            else setSelectedTags([...selectedTags, tag]);
                          }}
                          className={\`px-4 py-2 rounded-full text-xs font-bold border-2 transition-all \${selectedTags.includes(tag) ? 'border-purple-600 bg-purple-600 text-white' : 'border-slate-100 bg-white text-slate-600'}\`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </React.Fragment>
        )}
      </AnimatePresence>`;

content = content.replace(regexFilters, newFilters);

fs.writeFileSync('src/components/History.tsx', content);
