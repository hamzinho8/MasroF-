import fs from 'fs';
const content = fs.readFileSync('src/components/Home.tsx', 'utf-8');

const regex = /(const categoryMatch =\n\s+CATEGORY_MAP\.find\([\s\S]*?\|\| CATEGORY_MAP\[0\];)/;

const newCode = `$1

                const prevSpent = previousMonthExpenses.get(category.toLowerCase()) || 0;
                const TrendIcon = spent > prevSpent ? TrendingUp : spent < prevSpent ? TrendingDown : Minus;
                const trendColor = spent > prevSpent ? "text-rose-500" : spent < prevSpent ? "text-emerald-500" : "text-slate-400";
`;

let newContent = content.replace(regex, newCode);

const regex2 = /(<div\n\s+className=\{\`z-10 relative flex items-center justify-center mb-1 mt-1)/;

const newCode2 = `<div className={\`absolute top-2 right-2 flex items-center justify-center \$\{trendColor\}\`}>
                      <TrendIcon size={12} strokeWidth={3} />
                    </div>
                    $1`;

newContent = newContent.replace(regex2, newCode2);

fs.writeFileSync('src/components/Home.tsx', newContent);
