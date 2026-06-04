const fs = require('fs');

const CREDIT_CATEGORIES = [
  'on me doit', 'je dois', 
  'مستحقات لي', 'ديون علي', 
  'owed to me', 'i owe',
  'loans', 'debts',
  'crédit +', 'crédit --'
];

function updateFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/const isCredit = [^;]+;/g, `const isCredit = (tx.category && ${JSON.stringify(CREDIT_CATEGORIES)}.includes(tx.category.toLowerCase()));`);
  content = content.replace(/\{transactions\.filter[^\{]*\.slice\(0,\ 3\)\.map\(\(tx\,\ index\)\ =>\ \{/, 
  `{transactions.filter(tx => !(tx.category && ${JSON.stringify(CREDIT_CATEGORIES)}.includes(tx.category.toLowerCase()))).slice(0, 3).map((tx, index) => {`);
  fs.writeFileSync(file, content);
}

updateFile('src/components/Home.tsx');
updateFile('src/components/History.tsx');
console.log('done');
