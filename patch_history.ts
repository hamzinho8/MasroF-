import fs from 'fs';
const content = fs.readFileSync('src/components/History.tsx', 'utf-8');

const regex1 = /const filteredTotals = React\.useMemo\(\(\) => \{[\s\S]*?return \{ totalExpense, totalIncome \};\s*\}, \[transactions, timeframe\]\);/;

const newCode1 = `const filteredTotals = React.useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    let totalExpense = 0;
    let prevTotalExpense = 0;
    let totalIncome = 0;
    const expenseBuckets = [0, 0, 0, 0, 0, 0, 0];

    const hoursInDay = 1000 * 60 * 60 * 24;

    transactions.forEach(tx => {
      const dateStr = tx.date.split(' ')[0];
      const [dayPart, monthPart] = dateStr.split('/');
      
      if (!dayPart || !monthPart) return;
      
      const day = parseInt(dayPart);
      const month = parseInt(monthPart) - 1;
      
      const txDate = new Date(currentYear, month, day);
      if (txDate > now) {
        txDate.setFullYear(currentYear - 1);
      }
      
      let include = false;
      let includePrev = false;
      let bucketIndex = -1;
      
      if (timeframe === 'day') {
        include = day === now.getDate() && month === now.getMonth();
        
        const prevDay = new Date(now);
        prevDay.setDate(now.getDate() - 1);
        includePrev = day === prevDay.getDate() && month === prevDay.getMonth();
        
        if (include) {
          const hourMatch = tx.date.match(/ (\d{2}):/);
          const hour = hourMatch ? parseInt(hourMatch[1]) : 12;
          bucketIndex = Math.min(6, Math.floor(hour / (24 / 7)));
        }
      } else if (timeframe === 'week') {
        const diffDays = (now.getTime() - txDate.getTime()) / hoursInDay;
        include = diffDays >= 0 && diffDays < 7;
        includePrev = diffDays >= 7 && diffDays < 14;
        
        if (include) {
          bucketIndex = Math.min(6, Math.max(0, 6 - Math.floor(diffDays)));
        }
      } else if (timeframe === 'month') {
        include = month === now.getMonth();
        
        const prevMonthDate = new Date(now);
        prevMonthDate.setMonth(now.getMonth() - 1);
        includePrev = month === prevMonthDate.getMonth();
        
        if (include) {
          bucketIndex = Math.min(6, Math.floor(day / (31 / 7)));
        }
      }
      
      if (include || includePrev) {
        const isBankAddedBalance = tx.type === "INCOME" && tx.paidByBank && ["Salaire", "Dépôt", "Autre", "Banque", "Virement"].includes(tx.category || "");
        const isRetrait = tx.type === "INCOME" && !tx.paidByBank && tx.label === "Retrait Banque";
        const isVirementExpense = tx.type === "EXPENSE" && !tx.paidByBank && tx.category === "Virement";

        if (!isBankAddedBalance && !isRetrait && !isVirementExpense) {
          const isCredit = (tx.category && ["on me doit","je dois","مستحقات لي","ديون علي","owed to me","i owe","loans","debts","crédit +","crédit --"].includes(tx.category.toLowerCase()));
          if (!isCredit) {
            if (tx.type === 'EXPENSE') {
              if (include) {
                totalExpense += tx.amount;
                if (bucketIndex >= 0 && bucketIndex <= 6) {
                  expenseBuckets[bucketIndex] += tx.amount;
                }
              }
              if (includePrev) prevTotalExpense += tx.amount;
            } else if (tx.type === 'INCOME' && !tx.paidByBank) {
              if (include) totalIncome += tx.amount;
            }
          }
        }
      }
    });

    let trendPercentage = 0;
    if (prevTotalExpense > 0) {
      trendPercentage = ((totalExpense - prevTotalExpense) / prevTotalExpense) * 100;
    }

    return { totalExpense, totalIncome, trendPercentage, prevTotalExpense, expenseBuckets };
  }, [transactions, timeframe]);

  const generateSparklinePath = (data: number[], width = 100, height = 30) => {
    if (!data || data.length < 2) return \`M 0,\${height} L \${width},\${height}\`;
    const max = Math.max(...data, 1); 
    const stepX = width / (data.length - 1);
    
    const points = data.map((d, i) => {
      const x = i * stepX;
      const y = (height - 4) - (d / max) * (height - 4) + 2; 
      return { x, y };
    });
    
    let path = \`M \${points[0].x},\${points[0].y}\`;
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const cx = (p1.x + p2.x) / 2;
      path += \` C \${cx},\${p1.y} \${cx},\${p2.y} \${p2.x},\${p2.y}\`;
    }
    return path;
  };`;

const newContent = content.replace(regex1, newCode1);
fs.writeFileSync('src/components/History.tsx', newContent);
