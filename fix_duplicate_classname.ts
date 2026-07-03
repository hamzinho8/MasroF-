import fs from 'fs';
let content = fs.readFileSync('src/components/History.tsx', 'utf-8');

content = content.replace(/<motion\.div className="flex-1"\s+initial/g, '<motion.div initial');
content = content.replace(/className=\{\`group flex items-center gap-4/g, 'className={`flex-1 group flex items-center gap-4');
content = content.replace(/className=\{\`flex items-center gap-4 p-4/g, 'className={`flex-1 flex items-center gap-4 p-4');

fs.writeFileSync('src/components/History.tsx', content);
