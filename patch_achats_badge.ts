import fs from 'fs';
const content = fs.readFileSync('src/components/Home.tsx', 'utf-8');

const regex1 = /<div className="flex items-center gap-1\.5 flex-1 truncate">\s*<span className="text-sm font-bold tracking-tight truncate">\s*\{item\.label\}\s*<\/span>\s*\{boughtThisMonth > 0 && \(\s*<span className="text-\[9px\] font-black uppercase px-1\.5 py-0\.5 rounded-full border border-current opacity-70 whitespace-nowrap">\s*x\{boughtThisMonth\}\s*<\/span>\s*\)\}\s*<\/div>/;

const newCode1 = `<span className="text-sm font-bold tracking-tight truncate flex-1">
                          {item.label}
                        </span>`;

let newContent = content.replace(regex1, newCode1);

const regex2 = /<div className="flex items-center justify-center">\s*\{React\.isValidElement\(categoryMatch\.icon\)\s*\?\s*React\.cloneElement\(categoryMatch\.icon as React\.ReactElement,\s*\{\s*size:\s*14\s*\}\s*as\s*any\)\s*:\s*categoryMatch\.icon\}\s*<\/div>/;

const newCode2 = `{boughtThisMonth > 0 && (
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full border border-current opacity-70 whitespace-nowrap">
                              x{boughtThisMonth}
                            </span>
                          )}
                          <div className="flex items-center justify-center">
                            {React.isValidElement(categoryMatch.icon) ? React.cloneElement(categoryMatch.icon as React.ReactElement, { size: 14 } as any) : categoryMatch.icon}
                          </div>`;

newContent = newContent.replace(regex2, newCode2);

fs.writeFileSync('src/components/Home.tsx', newContent);
