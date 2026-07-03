import fs from 'fs';
let content = fs.readFileSync('src/components/History.tsx', 'utf-8');

content = content.replace(/'Search,\s*CheckSquare,\s*Square,\s*AlertCircle,\s*CheckCircle2,\s*Trash a transaction\.\.\.'/g, "'Search a transaction...'");

fs.writeFileSync('src/components/History.tsx', content);
