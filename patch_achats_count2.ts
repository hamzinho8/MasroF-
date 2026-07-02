import fs from 'fs';
const content = fs.readFileSync('src/components/Home.tsx', 'utf-8');

const regex = /<span className="text-\[9px\] font-black uppercase px-1\.5 py-0\.5 rounded-full border border-current opacity-70">\s*x\{boughtThisMonth\}\s*<\/span>/;
const newCode = `<span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full border border-current opacity-70 whitespace-nowrap">
                              x{boughtThisMonth}
                            </span>`;

const finalContent = content.replace(regex, newCode);
fs.writeFileSync('src/components/Home.tsx', finalContent);
