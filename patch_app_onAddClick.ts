import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// In HistoryView render
const historyProps = `            onAddClick={openModal}`;
const newHistoryProps = `            onAddClick={(type, mode) => openModal(type, undefined, mode)}`;
content = content.replace(historyProps, newHistoryProps);

// Wait, Bank also passes mode?
const bankProps = `            onAddClick={(type) => openModal(type)}`;
// no mode passed here so it's fine.

fs.writeFileSync('src/App.tsx', content);
