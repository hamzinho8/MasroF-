import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace(
  '        isOpen={isModalOpen}\n        onClose={() => setIsModalOpen(false)}\n        onAdd={(',
  '        isOpen={isModalOpen}\n        onClose={() => setIsModalOpen(false)}\n        initialMode={modalInitialMode}\n        onAdd={('
);

fs.writeFileSync('src/App.tsx', content);
