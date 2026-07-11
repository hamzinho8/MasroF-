const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
const components = ['Home', 'Statistics', 'Credits', 'Bank', 'HistoryView', 'SettingsView', 'Inventory'];
const memoDefs = components.map(comp => `const Memo${comp} = React.memo(${comp});`).join('\n');
if (!code.includes('const MemoHome')) {
    code = code.replace('export default function App() {', `${memoDefs}\n\nexport default function App() {`);
    fs.writeFileSync('src/App.tsx', code);
}
