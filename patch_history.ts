import fs from 'fs';
let content = fs.readFileSync('src/components/History.tsx', 'utf-8');

content = content.replace(
  "onAddClick: (type: 'INCOME' | 'EXPENSE') => void;",
  "onAddClick: (type: 'INCOME' | 'EXPENSE', mode?: 'manual' | 'scanner' | 'vocal') => void;"
);

content = content.replace(
  "onClick={() => {}}",
  "onClick={() => onAddClick('EXPENSE', 'scanner')}"
);

content = content.replace(
  "onClick={() => {}}",
  "onClick={() => onAddClick('EXPENSE', 'vocal')}"
);

fs.writeFileSync('src/components/History.tsx', content);
