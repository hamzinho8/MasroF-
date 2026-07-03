import fs from 'fs';
let content = fs.readFileSync('src/components/AddTransactionModal.tsx', 'utf-8');

// The main modal content:
const modalContentStart = `            <motion.div
              key="modal-content"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-[120] bg-white rounded-t-[40px] p-8 max-w-md mx-auto shadow-2xl max-h-[90vh] overflow-y-auto"
            >`;

const modalContentReplacement = `            {currentMode === 'manual' && (
            <motion.div
              key="modal-content"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-[120] bg-white rounded-t-[40px] p-8 max-w-md mx-auto shadow-2xl max-h-[90vh] overflow-y-auto"
            >`;

content = content.replace(modalContentStart, modalContentReplacement);

const showImageSourceModalStart = `      <AnimatePresence>
        {showImageSourceModal && (
          <div
            className="fixed inset-0 z-[140] flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm sm:p-4"
            onClick={() => setShowImageSourceModal(false)}
          >`;

// We will change showImageSourceModal to currentMode === 'scanner'
const showImageSourceModalReplacement = `      <AnimatePresence>
        {currentMode === 'scanner' && (
          <div
            className="fixed inset-0 z-[140] flex items-end sm:items-center justify-center bg-transparent sm:p-4"
            onClick={() => {
              if (initialMode === 'scanner') onClose();
              else setCurrentMode('manual');
            }}
          >`;

content = content.replace(showImageSourceModalStart, showImageSourceModalReplacement);

// We also need to close the main modal content block correctly.
// The main modal content ends with:
//               </div>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>

const mainModalEnd = `              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>`;

const mainModalEndReplacement = `              </div>
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
                <p className="text-slate-500 text-center text-sm">Veuillez dicter votre transaction (ex: "J'ai acheté un café à 2 euros")</p>
                <button
                  onClick={() => {
                    stopListening();
                    setCurrentMode('manual');
                  }}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl py-4 transition-colors mt-4"
                >
                  Arrêter
                </button>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>`;

content = content.replace(mainModalEnd, mainModalEndReplacement);

// Fix setShowImageSourceModal(false) in handleScanReceipt to setCurrentMode('manual')
content = content.replace('setShowImageSourceModal(false);', 'setCurrentMode("manual");');
content = content.replace('onClick={() => setShowImageSourceModal(false)}', 'onClick={() => { if (initialMode === "scanner") onClose(); else setCurrentMode("manual"); }}');

fs.writeFileSync('src/components/AddTransactionModal.tsx', content);
