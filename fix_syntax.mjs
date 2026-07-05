import fs from 'fs';
let content = fs.readFileSync('src/components/ShoppingListModal.tsx', 'utf-8');

const brokenStr = `<div 
                        
                      <div className="shrink-0 flex items-center justify-center w-8 mr-2">`;

const fixedStr = `                      <div className="shrink-0 flex items-center justify-center w-8 mr-2">`;

content = content.replace(brokenStr, fixedStr);
fs.writeFileSync('src/components/ShoppingListModal.tsx', content);

