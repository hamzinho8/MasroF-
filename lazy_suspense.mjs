import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const target = `{renderContent()}`;
const replacement = `<Suspense fallback={<div className="flex items-center justify-center h-64"><div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>}>
            {renderContent()}
          </Suspense>`;

content = content.replace(target, replacement);

fs.writeFileSync('src/App.tsx', content);
