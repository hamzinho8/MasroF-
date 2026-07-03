import fs from 'fs';
let content = fs.readFileSync('src/components/AddTransactionModal.tsx', 'utf-8');

// Replace showImageSourceModal with currentMode
content = content.replace(
  'const [showImageSourceModal, setShowImageSourceModal] = useState(false);',
  'const [currentMode, setCurrentMode] = useState<"manual" | "scanner" | "vocal">(initialMode || "manual");\n  const [showImageSourceModal, setShowImageSourceModal] = useState(false);'
);

// Update useEffect to sync currentMode
const effectStr = `  React.useEffect(() => {
    if (isOpen) {
      setType(initialType);
      setLabel(initialLabel || "");
      setAmount(initialAmount ? initialAmount.toString() : "");
      setSelectedCategory(initialCategory || "Autres");
      setShowFrequent(true);
      setPaidByBank(false);
      setAddToInventory(false);
      setInventoryQty("1");
      setScannedItems(null);
      setReceiptTotal(null);
      setDetectedPaymentGroup(null);
      setIsListening(false);
      setSelectedMultiItems([]);
      setTags([]);
      setTagInput("");
      
      if (initialMode === 'scanner') {
        setTimeout(() => setShowImageSourceModal(true), 100);
      } else if (initialMode === 'vocal') {
        setTimeout(() => startListening(), 300);
      }
    }
  }, [isOpen, initialType, initialMode]);`;

const newEffectStr = `  React.useEffect(() => {
    if (isOpen) {
      setType(initialType);
      setLabel(initialLabel || "");
      setAmount(initialAmount ? initialAmount.toString() : "");
      setSelectedCategory(initialCategory || "Autres");
      setShowFrequent(true);
      setPaidByBank(false);
      setAddToInventory(false);
      setInventoryQty("1");
      setScannedItems(null);
      setReceiptTotal(null);
      setDetectedPaymentGroup(null);
      setIsListening(false);
      setSelectedMultiItems([]);
      setTags([]);
      setTagInput("");
      setCurrentMode(initialMode || "manual");
      
      if (initialMode === 'vocal') {
        setTimeout(() => startListening(), 300);
      }
    }
  }, [isOpen, initialType, initialMode]);`;

content = content.replace(effectStr, newEffectStr);

// In handleScanReceipt, we need to switch mode to manual when done
// Wait, the process continues asynchronously. When done, we want it to show the form!
// The form should be visible if currentMode === 'manual'.
// When does currentMode become manual after scanning?
// If they cancel scan, we want to close the whole modal or go back to manual?
// They probably want to close the whole modal if they started from 'scanner'. If they started from 'manual', go back to 'manual'.
// For now, let's just make it go back to 'manual'.

fs.writeFileSync('src/components/AddTransactionModal.tsx', content);
