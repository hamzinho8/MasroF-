import fs from 'fs';
const content = fs.readFileSync('src/components/Home.tsx', 'utf-8');

const importRegex = /import React, { useState, useEffect } from "react";/;
const newImport = `import React, { useState, useEffect } from "react";\nimport { TrendingUp, TrendingDown, Minus } from "lucide-react";`;
let newContent = content.replace(importRegex, newImport);

// Add previousMonthExpenses
const currentMonthRegex = /const currentMonthExpenses = React\.useMemo\(\(\) => \{[\s\S]*?\}, \[transactions\]\);/;
const currentMonthMatch = newContent.match(currentMonthRegex);
if (currentMonthMatch) {
  const previousMonthStr = `
  const previousMonthExpenses = React.useMemo(() => {
    const now = new Date();
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    const spends = new Map<string, number>();

    transactions.forEach((tx) => {
      if (tx.type === "EXPENSE" && tx.timestamp >= startOfPrevMonth && tx.timestamp < startOfCurrentMonth) {
        const cat = (tx.category || "Autres").toLowerCase();
        spends.set(cat, (spends.get(cat) || 0) + tx.amount);
      }
    });

    return spends;
  }, [transactions]);
`;
  newContent = newContent.replace(currentMonthRegex, currentMonthMatch[0] + "\n" + previousMonthStr);
}

// Add state
const stateRegex = /const \[showBudgetModal, setShowBudgetModal\] = useState\(false\);/;
newContent = newContent.replace(stateRegex, `const [showBudgetModal, setShowBudgetModal] = useState(false);\n  const [selectedBudgetCategory, setSelectedBudgetCategory] = useState<string | null>(null);`);

// Update the rendering of budget cards
const budgetCardRegex = /<div\s+key=\{\`\$\{category\}\-\$\{index\}\`\}[\s\S]*?className=\{\`w-full h-\[86px\] rounded-\[24px\] flex flex-col items-center justify-center relative overflow-hidden transition-all shadow-sm border hover:border-slate-200 active:scale-95[\s\S]*?\}\s*style=\{[\s\S]*?\}\s*>/;
newContent = newContent.replace(budgetCardRegex, (match) => {
  return match + "\n                    onClick={() => setSelectedBudgetCategory(category)}";
});

fs.writeFileSync('src/components/Home.tsx', newContent);
