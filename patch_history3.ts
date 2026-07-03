import fs from 'fs';
let content = fs.readFileSync('src/components/History.tsx', 'utf-8');

const fallbackOld = `              glow: isCreditPlus ? 'bg-indigo-400' : (isCreditMinus ? 'bg-amber-400' : (isExpense ? 'bg-slate-400' : 'bg-emerald-400'))
            };`;

const fallbackNew = `              glow: isCreditPlus ? 'bg-indigo-400' : (isCreditMinus ? 'bg-amber-400' : (isExpense ? 'bg-slate-400' : 'bg-emerald-400')),
              colorHex: undefined
            } as any;`;

content = content.replace(fallbackOld, fallbackNew);

fs.writeFileSync('src/components/History.tsx', content);
