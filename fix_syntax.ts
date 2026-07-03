import fs from 'fs';
let content = fs.readFileSync('src/components/History.tsx', 'utf-8');

content = content.replace(/ {8}\/\>\n\n {8}\{\/\* Inline Edit Modal \*\/\}/g, '        />\n        )}\n\n        {/* Inline Edit Modal */}');

fs.writeFileSync('src/components/History.tsx', content);
