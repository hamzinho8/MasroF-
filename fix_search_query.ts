import fs from 'fs';
let content = fs.readFileSync('src/components/History.tsx', 'utf-8');

content = content.replace(/setSearch,\s*CheckSquare,\s*Square,\s*AlertCircle,\s*CheckCircle2,\s*TrashQuery/g, 'setSearchQuery');
content = content.replace(/<Search,\s*CheckSquare,\s*Square,\s*AlertCircle,\s*CheckCircle2,\s*Trash/g, '<Search');

fs.writeFileSync('src/components/History.tsx', content);
