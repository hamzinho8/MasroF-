import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Add modalInitialMode state
const stateToReplace = `  const [modalInitialCategory, setModalInitialCategory] = useState<string>("");`;
const newState = `  const [modalInitialCategory, setModalInitialCategory] = useState<string>("");\n  const [modalInitialMode, setModalInitialMode] = useState<"manual" | "scanner" | "vocal">("manual");`;
content = content.replace(stateToReplace, newState);

// 2. Update openModal signature and logic
const openModalStr = `  const openModal = (
    type: "INCOME" | "EXPENSE",
    prefill?: { name: string; category: string; price: number }
  ) => {
    setModalType(type);
    setModalIsShoppingMode(false);
    setModalInitialLabel(prefill?.name || "");
    setModalInitialCategory(prefill?.category || "");
    setModalInitialAmount(prefill?.price);
    setShoppingItemSelectedId(null);
    setIsModalOpen(true);
  };`;

const newOpenModalStr = `  const openModal = (
    type: "INCOME" | "EXPENSE",
    prefill?: { name: string; category: string; price: number },
    mode?: "manual" | "scanner" | "vocal"
  ) => {
    setModalType(type);
    setModalIsShoppingMode(false);
    setModalInitialLabel(prefill?.name || "");
    setModalInitialCategory(prefill?.category || "");
    setModalInitialAmount(prefill?.price);
    setModalInitialMode(mode || "manual");
    setShoppingItemSelectedId(null);
    setIsModalOpen(true);
  };`;

content = content.replace(openModalStr, newOpenModalStr);

// 3. Update Home onAddClick in App.tsx (Wait, Home's onAddClick might not need the mode parameter unless used, but wait: Home component receives openModal directly, so it's fine).

// 4. Update AddTransactionModal rendering
const addTxModalProps = `        onAdd={(
          label,
          amount,
          type,
          category,
          paidByBank,
          isPureInflow,
          inventoryData,
          creditData,
          tags
        ) => {`;
const newAddTxModalProps = `        initialMode={modalInitialMode}\n        onAdd={(
          label,
          amount,
          type,
          category,
          paidByBank,
          isPureInflow,
          inventoryData,
          creditData,
          tags
        ) => {`;
content = content.replace(addTxModalProps, newAddTxModalProps);

fs.writeFileSync('src/App.tsx', content);
