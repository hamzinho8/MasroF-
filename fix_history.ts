import fs from 'fs';
let content = fs.readFileSync('src/components/History.tsx', 'utf-8');

// 1. Remove the "Ajouter Retrait" button and make the "Ajouter Achat" button full width
content = content.replace(
  '<div className="grid grid-cols-2 gap-4 px-1 mb-6">',
  '<div className="grid grid-cols-1 px-1 mb-6">'
);

const btn2Start = content.indexOf('<button \n          onClick={() => onAddClick(\'INCOME\')}');
if (btn2Start !== -1) {
  const btn2End = content.indexOf('</button>', btn2Start) + 9;
  content = content.substring(0, btn2Start) + content.substring(btn2End);
}

fs.writeFileSync('src/components/History.tsx', content);
