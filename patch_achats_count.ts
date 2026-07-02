import fs from 'fs';
const content = fs.readFileSync('src/components/Home.tsx', 'utf-8');

const regex = /\{latestPurchasesList\.map\(\(item, index\) => \{[\s\S]*?return \(/;

const newCode = `{latestPurchasesList.map((item, index) => {
                    const info = getArticleInfo(item.label, item.category, predefinedItems);
                    const categoryMatch = CATEGORY_MAP.find(c => c.label.toLowerCase() === (item.category || "Autres").toLowerCase()) || CATEGORY_MAP[0];
                    const color = info.colorHex || categoryMatch.colorHex || '#334155';
                    
                    const time = new Date(item.timestamp).toLocaleTimeString(language === 'Français' ? 'fr-FR' : language === 'العربية' ? 'ar-MA' : 'en-US', { hour: '2-digit', minute: '2-digit' });

                    const now = new Date();
                    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
                    const boughtThisMonth = transactions.filter(tx => 
                      tx.type === "EXPENSE" && 
                      tx.timestamp >= startOfCurrentMonth && 
                      tx.label.toLowerCase() === item.label.toLowerCase()
                    ).length;

                    return (`;

const replacedContent = content.replace(regex, newCode);

const regex2 = /<span className="text-sm font-bold tracking-tight truncate flex-1">\s*\{item\.label\}\s*<\/span>/;
const newCode2 = `<div className="flex items-center gap-1.5 flex-1 truncate">
                          <span className="text-sm font-bold tracking-tight truncate">
                            {item.label}
                          </span>
                          {boughtThisMonth > 1 && (
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full border border-current opacity-70">
                              x{boughtThisMonth}
                            </span>
                          )}
                        </div>`;

const finalContent = replacedContent.replace(regex2, newCode2);
fs.writeFileSync('src/components/Home.tsx', finalContent);
