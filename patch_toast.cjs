const fs = require('fs');
let content = fs.readFileSync('src/components/Settings.tsx', 'utf8');

const toastTarget = `  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative min-h-screen bg-slate-50 text-slate-800 font-sans pb-24"
    >`;

const toastNew = `  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative min-h-screen bg-slate-50 text-slate-800 font-sans pb-24"
    >
      <AnimatePresence>
        {showSaveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-teal-500 text-white px-6 py-3 rounded-full shadow-xl z-50 flex items-center gap-2"
          >
            <Save size={18} />
            <span className="text-sm font-medium">Sauvegarde réussie !</span>
          </motion.div>
        )}
      </AnimatePresence>`;

content = content.replace(toastTarget, toastNew);

fs.writeFileSync('src/components/Settings.tsx', content);
console.log('Successfully patched toast in Settings.tsx');
