import fs from 'fs';
const content = fs.readFileSync('src/components/Home.tsx', 'utf-8');

const regexGrid = /<div className="grid grid-cols-2 gap-3">\s*<button/;
const newCodeGrid = `<div className="grid grid-cols-1 gap-3">
          <button`;

let newContent = content.replace(regexGrid, newCodeGrid);

const regexRemove = /<button\s*onClick=\{\(\) => setShowCalendarModal\(true\)\}\s*className="text-left p-4 rounded-2xl border-2 border-bank-blue\/20 bg-bank-blue\/5 relative overflow-hidden group hover:border-bank-blue\/40 transition-all cursor-pointer"\s*>[\s\S]*?<Plus\s*className="absolute -right-2 -bottom-2 text-bank-blue\/10 rotate-12 group-hover:scale-110 transition-transform"\s*size=\{48\}\s*\/>\s*<\/button>/;

newContent = newContent.replace(regexRemove, '');

fs.writeFileSync('src/components/Home.tsx', newContent);
