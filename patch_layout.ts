import fs from 'fs';
const content = fs.readFileSync('src/components/Home.tsx', 'utf-8');

const regex = /return \(\s*<div\s*key=\{item\.id\}\s*className="flex items-center gap-2 py-2 px-1 border-b border-indigo-100\/30 last:border-0"\s*style=\{\{ color \}\}\s*>[\s\S]*?<\/div>\s*\);\s*\}\)/;

const newCode = `return (
                      <div 
                        key={item.id}
                        className="flex items-center gap-3 py-2.5 px-1 border-b border-indigo-100/30 last:border-0"
                        style={{ color }}
                      >
                        <span className="text-[11px] font-bold opacity-50 w-9 shrink-0 text-left">
                          {time}
                        </span>
                        
                        <span className="text-sm font-bold tracking-tight truncate flex-1 opacity-90">
                          {item.label}
                        </span>
                        
                        <div className="flex items-center gap-2.5 shrink-0 opacity-75">
                          {info.icon && (
                            <div className="flex items-center justify-center">
                              {React.isValidElement(info.icon) ? React.cloneElement(info.icon as React.ReactElement, { size: 14, strokeWidth: 2.5 } as any) : info.icon}
                            </div>
                          )}
                          
                          <div className="flex items-center gap-1">
                            {boughtThisMonth > 0 && (
                              <span className="text-[10px] font-bold opacity-60 whitespace-nowrap">
                                x{boughtThisMonth}
                              </span>
                            )}
                            <div className="flex items-center justify-center">
                              {React.isValidElement(categoryMatch.icon) ? React.cloneElement(categoryMatch.icon as React.ReactElement, { size: 14, strokeWidth: 2.5 } as any) : categoryMatch.icon}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-center">
                            {item.paidByBank ? <Landmark size={14} strokeWidth={2.5} /> : <Wallet size={14} strokeWidth={2.5} />}
                          </div>
                        </div>
                        
                        <div className="flex items-baseline justify-end shrink-0 min-w-[4rem] ml-1">
                          <span className="text-base font-black tracking-tighter opacity-100">
                            {item.amount.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}
                          </span>
                          <span className="text-[10px] font-bold uppercase opacity-60 ml-0.5">
                            {currency}
                          </span>
                        </div>
                      </div>
                    );
                  })`;

const finalContent = content.replace(regex, newCode);
fs.writeFileSync('src/components/Home.tsx', finalContent);
