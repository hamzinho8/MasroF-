import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Revert line 1414 (Home)
content = content.replace(
  '            onAddClick={(type, mode) => openModal(type, undefined, mode)}',
  '            onAddClick={openModal}'
);

// We need to fix HistoryView explicitly
// Let's find HistoryView
const historyViewStr = `<HistoryView
            transactions={transactions}
            predefinedItems={predefinedItems}
            language={language}
            currency={currency}
            onDelete={deleteTransaction}
            onUpdate={updateTransaction}
            onAddClick={openModal}
          />`;
const historyViewNewStr = `<HistoryView
            transactions={transactions}
            predefinedItems={predefinedItems}
            language={language}
            currency={currency}
            onDelete={deleteTransaction}
            onUpdate={updateTransaction}
            onAddClick={(type, mode) => openModal(type, undefined, mode as any)}
          />`;

content = content.replace(historyViewStr, historyViewNewStr);

fs.writeFileSync('src/App.tsx', content);
