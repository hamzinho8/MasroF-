import fs from 'fs';
let content = fs.readFileSync('src/components/AddTransactionModal.tsx', 'utf-8');

content = content.replace(
  'setTimeout(() => toggleListening(), 300);',
  'setTimeout(() => startListening(), 300);'
);

fs.writeFileSync('src/components/AddTransactionModal.tsx', content);
