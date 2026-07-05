import fs from 'fs';
let content = fs.readFileSync('src/components/Home.tsx', 'utf-8');
const searchStr = `Solde Bancaire`;
const idx = content.indexOf(searchStr);
console.log(content.substring(idx - 500, idx + 1000));
