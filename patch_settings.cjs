const fs = require('fs');
let content = fs.readFileSync('src/components/Settings.tsx', 'utf8');

// 1. Add quickLocalBackup to imports
content = content.replace(
    'import { importDataFromFile, exportDataToFile } from "../utils/backup";',
    'import { importDataFromFile, exportDataToFile, quickLocalBackup } from "../utils/backup";'
);

// 2. Add Save to lucide-react imports if not there
if (!content.includes('Save,')) {
    content = content.replace(
        'Upload,',
        'Upload,\n  Save,'
    );
}

// 3. Add state for success indicator
const stateHookTarget = `  const [backupReminder, setBackupReminder] = useState(
    () => localStorage.getItem("backupReminderEnabled") === "true"
  );`;
const stateHookNew = `  const [backupReminder, setBackupReminder] = useState(
    () => localStorage.getItem("backupReminderEnabled") === "true"
  );
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const handleQuickBackup = async () => {
    const success = await quickLocalBackup();
    if (success) {
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 3000);
    } else {
      alert("Aucun emplacement précédent trouvé ou permission refusée. Veuillez utiliser 'Sauvegarder sous...'.");
    }
  };`;
content = content.replace(stateHookTarget, stateHookNew);

// 4. Update the UI buttons
const uiTarget = `            <SettingsItem
              icon={<Download />}
              title="Sauvegarder"
              subtitle="Créer un fichier de sauvegarde"
              onClick={async () => await exportDataToFile()}
            />`;
const uiNew = `            <SettingsItem
              icon={<Save />}
              title="Sauvegarde locale rapide"
              subtitle="Sauvegarder sur le même emplacement"
              onClick={handleQuickBackup}
            />
            <SettingsItem
              icon={<Download />}
              title="Sauvegarder sous..."
              subtitle="Créer ou partager une sauvegarde"
              onClick={async () => await exportDataToFile()}
            />`;
content = content.replace(uiTarget, uiNew);

// 5. Add the Toast
const toastTarget = `      {showClearConfirm && (`;
const toastNew = `      <AnimatePresence>
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
      </AnimatePresence>

      {showClearConfirm && (`;
content = content.replace(toastTarget, toastNew);

fs.writeFileSync('src/components/Settings.tsx', content);
console.log('Successfully patched Settings.tsx');
