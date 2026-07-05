import fs from 'fs';
let content = fs.readFileSync('src/components/ShoppingListModal.tsx', 'utf-8');

content = content.replace(
`<div 
                        
                      <div className="shrink-0 flex items-center justify-center w-8 mr-2">`, 
`                      <div className="shrink-0 flex items-center justify-center w-8 mr-2">`
);

fs.writeFileSync('src/components/ShoppingListModal.tsx', content);

