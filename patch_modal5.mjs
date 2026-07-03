import fs from 'fs';
let content = fs.readFileSync('src/components/AddTransactionModal.tsx', 'utf-8');

const endBlock = `              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>`;

const newEndBlock = `              )}
            </motion.div>
            )}

            {currentMode === 'vocal' && (
              <motion.div
                key="vocal-modal"
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 z-[140] bg-white rounded-t-[40px] p-8 max-w-md mx-auto shadow-2xl flex flex-col items-center justify-center gap-6"
              >
                <div className="w-24 h-24 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center animate-pulse">
                  <Mic size={48} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Écoute en cours...</h3>
                <p className="text-slate-500 text-center text-sm mb-4">Veuillez dicter votre transaction.</p>
                <button
                  onClick={() => {
                    stopListening();
                    setCurrentMode('manual');
                  }}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl py-4 transition-colors"
                >
                  Arrêter
                </button>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>`;

if (content.includes(endBlock)) {
  content = content.replace(endBlock, newEndBlock);
  fs.writeFileSync('src/components/AddTransactionModal.tsx', content);
  console.log("Replaced successfully!");
} else {
  console.log("End block not found!");
}
