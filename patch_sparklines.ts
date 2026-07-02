import fs from 'fs';
const content = fs.readFileSync('src/components/Home.tsx', 'utf-8');

const regex1 = /let totalExpense = 0;\s*let totalIncome = 0;/;
const newCode1 = `let totalExpense = 0;
    let totalIncome = 0;
    
    // For sparklines (7 buckets)
    const expenseBuckets = [0, 0, 0, 0, 0, 0, 0];
    const incomeBuckets = [0, 0, 0, 0, 0, 0, 0];
    const timeRange = now.getTime() - startOfPeriod.getTime();`;

let newContent = content.replace(regex1, newCode1);

const regex2 = /if \(!isCredit && !isVirementExpense\) \{\s*if \(tx\.type === "EXPENSE"\) totalExpense \+= tx\.amount;\s*else if \(tx\.type === "INCOME" && !tx\.paidByBank\)\s*totalIncome \+= tx\.amount;\s*\}/;
const newCode2 = `if (!isCredit && !isVirementExpense) {
          // Calculate bucket index (0-6)
          const bucketIndex = Math.min(6, Math.max(0, Math.floor(((tx.timestamp - startOfPeriod.getTime()) / timeRange) * 7)));
          if (tx.type === "EXPENSE") {
            totalExpense += tx.amount;
            expenseBuckets[bucketIndex] += tx.amount;
          } else if (tx.type === "INCOME" && !tx.paidByBank) {
            totalIncome += tx.amount;
            incomeBuckets[bucketIndex] += tx.amount;
          }
        }`;

newContent = newContent.replace(regex2, newCode2);

const regex3 = /return \{ totalExpense, totalIncome \};/;
const newCode3 = `return { totalExpense, totalIncome, expenseBuckets, incomeBuckets };`;

newContent = newContent.replace(regex3, newCode3);

// Now generate the SVG path generator
const regex4 = /const getSummaryTitle = \(\) => \{/;
const newCode4 = `const generateSparklinePath = (data: number[], width = 100, height = 30) => {
    if (!data || data.length < 2) return \`M 0,\${height} L \${width},\${height}\`;
    const max = Math.max(...data, 1); // Avoid div by 0
    const stepX = width / (data.length - 1);
    
    // Smooth bezier curve generator
    const points = data.map((d, i) => {
      const x = i * stepX;
      // y goes from 2 to height-2 for padding
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
  };

  const getSummaryTitle = () => {`;
  
newContent = newContent.replace(regex4, newCode4);

// Now render the sparklines
const regex5 = /<div className="relative z-10">\s*<p className="text-xs text-slate-500 mb-1 font-medium">\s*\{t\.achatTotal\}\s*<\/p>\s*<p className="text-xl font-black text-danger-red leading-none">\s*\{filteredTotals\.totalExpense\.toLocaleString\("fr-FR"\)\} \{currency\}\s*<\/p>\s*<\/div>/;

const newCode5 = `<div className="relative z-10">
              <p className="text-xs text-slate-500 mb-1 font-medium">
                {t.achatTotal}
              </p>
              <p className="text-xl font-black text-danger-red leading-none mb-3">
                {filteredTotals.totalExpense.toLocaleString("fr-FR")} {currency}
              </p>
              <div className="h-8 w-full opacity-60">
                <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                  <path 
                    d={generateSparklinePath(filteredTotals.expenseBuckets)} 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="text-danger-red" 
                  />
                  <path 
                    d={\`\${generateSparklinePath(filteredTotals.expenseBuckets)} L 100,30 L 0,30 Z\`} 
                    fill="url(#gradient-expense)" 
                    stroke="none"
                  />
                  <defs>
                    <linearGradient id="gradient-expense" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" className="text-danger-red" />
                      <stop offset="100%" stopColor="currentColor" stopOpacity="0" className="text-danger-red" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>`;

newContent = newContent.replace(regex5, newCode5);

const regex6 = /<div className="relative z-10">\s*<p className="text-xs text-slate-500 mb-1 font-medium">\s*\{t\.retraits\}\s*<\/p>\s*<p className="text-xl font-black text-bank-blue leading-none">\s*\{filteredTotals\.totalIncome\.toLocaleString\("fr-FR"\)\} \{currency\}\s*<\/p>\s*<\/div>/;

const newCode6 = `<div className="relative z-10">
              <p className="text-xs text-slate-500 mb-1 font-medium">
                {t.retraits}
              </p>
              <p className="text-xl font-black text-bank-blue leading-none mb-3">
                {filteredTotals.totalIncome.toLocaleString("fr-FR")} {currency}
              </p>
              <div className="h-8 w-full opacity-60">
                <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                  <path 
                    d={generateSparklinePath(filteredTotals.incomeBuckets)} 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="text-bank-blue" 
                  />
                  <path 
                    d={\`\${generateSparklinePath(filteredTotals.incomeBuckets)} L 100,30 L 0,30 Z\`} 
                    fill="url(#gradient-income)" 
                    stroke="none"
                  />
                  <defs>
                    <linearGradient id="gradient-income" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" className="text-bank-blue" />
                      <stop offset="100%" stopColor="currentColor" stopOpacity="0" className="text-bank-blue" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>`;

newContent = newContent.replace(regex6, newCode6);

fs.writeFileSync('src/components/Home.tsx', newContent);
