const fs = require('fs');
let code = fs.readFileSync('src/components/Statistics.tsx', 'utf8');

const replacement = `
  const periodExpensesForTopArticles = useMemo(() => {
    const now = new Date();
    const startOfPeriod = new Date(now);
    if (period === "day") startOfPeriod.setHours(0, 0, 0, 0);
    else if (period === "week") {
      const d = now.getDay();
      const diff = now.getDate() - d + (d === 0 ? -6 : 1);
      startOfPeriod.setDate(diff);
      startOfPeriod.setHours(0, 0, 0, 0);
    } else if (period === "month") {
      startOfPeriod.setDate(1);
      startOfPeriod.setHours(0, 0, 0, 0);
    }
    return transactions.filter((t) => {
      const isCredit =
        t.category &&
        [
          "on me doit",
          "je dois",
          "مستحقات لي",
          "ديون علي",
          "owed to me",
          "i owe",
          "loans",
          "debts",
          "crédit +",
          "crédit --",
        ].includes(t.category.toLowerCase());
      const isExpense =
        (t.type === "EXPENSE" || (t.type as any) === "expense") &&
        !isCredit && t.category !== "Virement";
      return isExpense && t.timestamp >= startOfPeriod.getTime();
    });
  }, [transactions, period]);
`;

code = code.replace('  // Map data to chart format', replacement + '\n  // Map data to chart format');

// Now replace the calculation in render
const renderCalc = `const now = new Date();
            const startOfPeriod = new Date(now);
            if (period === "day") startOfPeriod.setHours(0, 0, 0, 0);
            else if (period === "week") {
              const d = now.getDay();
              const diff = now.getDate() - d + (d === 0 ? -6 : 1);
              startOfPeriod.setDate(diff);
              startOfPeriod.setHours(0, 0, 0, 0);
            } else if (period === "month") {
              startOfPeriod.setDate(1);
              startOfPeriod.setHours(0, 0, 0, 0);
            }

            const periodExpenses = transactions.filter((t) => {
              const isCredit =
                t.category &&
                [
                  "on me doit",
                  "je dois",
                  "مستحقات لي",
                  "ديون علي",
                  "owed to me",
                  "i owe",
                  "loans",
                  "debts",
                  "crédit +",
                  "crédit --",
                ].includes(t.category.toLowerCase());
              const isExpense =
                (t.type === "EXPENSE" || (t.type as any) === "expense") &&
                !isCredit && t.category !== "Virement";
              return isExpense && t.timestamp >= startOfPeriod.getTime();
            });`;

code = code.replace(renderCalc, 'const periodExpenses = periodExpensesForTopArticles;');
fs.writeFileSync('src/components/Statistics.tsx', code);
