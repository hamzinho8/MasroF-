const fs = require('fs');
let content = fs.readFileSync('src/components/Inventory.tsx', 'utf8');
content = content.replace(/<AnimatePresence[^>]*>/g, '');
content = content.replace(/<\/AnimatePresence>/g, '');
fs.writeFileSync('src/components/Inventory.tsx', content);
