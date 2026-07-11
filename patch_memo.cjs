const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const components = ['Home', 'Statistics', 'Credits', 'Bank', 'HistoryView', 'SettingsView', 'Inventory'];

components.forEach(comp => {
    code = code.replace(new RegExp(`<${comp}\\b`, 'g'), `<Memo${comp}`);
});

const memoDefs = components.map(comp => `const Memo${comp} = React.memo(${comp});`).join('\n');

code = code.replace('const App = () => {', `${memoDefs}\n\nconst App = () => {`);

fs.writeFileSync('src/App.tsx', code);
