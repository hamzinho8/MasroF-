import fs from 'fs';

let content = fs.readFileSync('src/components/Home.tsx', 'utf-8');

// Find the bad injection:
const badCode = `
  const selectedForWithdrawal = shoppingList.filter(item => item.isSelectedForWithdrawal);
  const totalWithdrawal = selectedForWithdrawal.reduce((sum, item) => sum + (item.expectedPrice || 0), 0);
`;

content = content.replace(badCode, '\n');

// Find the right place inside Home
const homeReturnTarget = `
  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 relative overflow-hidden">`;

const correctCode = `
  const selectedForWithdrawal = shoppingList.filter(item => item.isSelectedForWithdrawal);
  const totalWithdrawal = selectedForWithdrawal.reduce((sum, item) => sum + (item.expectedPrice || 0), 0);
`;

content = content.replace(homeReturnTarget, correctCode + homeReturnTarget);

fs.writeFileSync('src/components/Home.tsx', content);

