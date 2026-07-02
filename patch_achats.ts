import fs from 'fs';
const content = fs.readFileSync('src/components/Home.tsx', 'utf-8');

const regex = /\{latestPurchasesList\.map\(\(item, index\) => \{[\s\S]*?return \([\s\S]*?\}\)\}/;

const newCode = `{latestPurchasesList.map((item, index) => {
                    const info = getArticleInfo(item.label, item.category, predefinedItems);
                    const categoryMatch = CATEGORY_MAP.find(c => c.label.toLowerCase() === (item.category || "Autres").toLowerCase()) || CATEGORY_MAP[0];
                    const color = info.colorHex || categoryMatch.colorHex || '#334155';
                    
                    const time = new Date(item.timestamp).toLocaleTimeString(language === 'Français' ? 'fr-FR' : language === 'العربية' ? 'ar-MA' : 'en-US', { hour: '2-digit', minute: '2-digit' });

                    return (
                      <div 
                        key={item.id}
                        className="flex items-center gap-2 py-2 px-1 border-b border-indigo-100/30 last:border-0"
                        style={{ color }}
                      >
                        <span className="text-[10px] font-black opacity-60 w-9 shrink-0">
                          {time}
                        </span>
                        
                        <span className="text-sm font-bold tracking-tight truncate flex-1">
                          {item.label}
                        </span>
                        
                        <div className="flex items-center gap-1.5 shrink-0 opacity-80">
                          {info.icon && (
                            <div className="flex items-center justify-center">
                              {React.isValidElement(info.icon) ? React.cloneElement(info.icon as React.ReactElement, { size: 14 } as any) : info.icon}
                            </div>
                          )}
                          
                          <div className="flex items-center justify-center">
                            {React.isValidElement(categoryMatch.icon) ? React.cloneElement(categoryMatch.icon as React.ReactElement, { size: 14 } as any) : categoryMatch.icon}
                          </div>
                          
                          <div className="flex items-center justify-center">
                            {item.paidByBank ? <Landmark size={14} /> : <Wallet size={14} />}
                          </div>
                        </div>
                        
                        <div className="flex items-baseline justify-end shrink-0 min-w-[3.5rem] ml-1">
                          <span className="text-base font-black tracking-tighter">
                            {item.amount.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}
                          </span>
                          <span className="text-[9px] font-bold uppercase opacity-80 ml-0.5">
                            {currency}
                          </span>
                        </div>
                      </div>
                    );
                  })}`;

const newContent = content.replace(regex, newCode);
fs.writeFileSync('src/components/Home.tsx', newContent);
