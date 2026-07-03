import fs from 'fs';
let content = fs.readFileSync('src/components/History.tsx', 'utf-8');

content = content.replace(/const matchesSearch,\n  CheckSquare,\n  Square,\n  AlertCircle,\n  CheckCircle2,\n  Trash/g, 'const matchesSearch');
content = content.replace(/return matchesFilter && matchesSearch,\n  CheckSquare,\n  Square,\n  AlertCircle,\n  CheckCircle2,\n  Trash/g, 'return matchesFilter && matchesSearch');

fs.writeFileSync('src/components/History.tsx', content);
