const fs = require('fs');
let code = fs.readFileSync('src/components/Home.tsx', 'utf8');

const useMemoInsert = `
  const monthlyPurchaseCounts = useMemo(() => {
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const counts: Record<string, number> = {};
    transactions.forEach(tx => {
      if (tx.type === "EXPENSE" && tx.timestamp >= startOfCurrentMonth) {
        const label = tx.label.toLowerCase();
        counts[label] = (counts[label] || 0) + 1;
      }
    });
    return counts;
  }, [transactions]);
`;

// Inject right before latestPurchasesList
code = code.replace('const latestPurchasesList = useMemo(() => {', useMemoInsert + '\n  const latestPurchasesList = useMemo(() => {');

// Replace the calculation in the map
code = code.replace(/const now = new Date\(\);\s*const startOfCurrentMonth = new Date\(now\.getFullYear\(\), now\.getMonth\(\), 1\)\.getTime\(\);\s*const boughtThisMonth = transactions\.filter\(tx =>\s*tx\.type === "EXPENSE" &&\s*tx\.timestamp >= startOfCurrentMonth &&\s*tx\.label\.toLowerCase\(\) === item\.label\.toLowerCase\(\)\s*\)\.length;/g, 'const boughtThisMonth = monthlyPurchaseCounts[item.label.toLowerCase()] || 0;');

fs.writeFileSync('src/components/Home.tsx', code);
