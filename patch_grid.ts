import fs from 'fs';
const content = fs.readFileSync('src/components/Home.tsx', 'utf-8');

const regexGrid = /<div className="grid grid-cols-2 gap-3">\s*<div\s*onClick=\{onNavigateToCredits\}/;
const newCodeGrid = `<div className={\`grid \${totalOweMe > 0 && totalIOwe > 0 ? 'grid-cols-2' : 'grid-cols-1'} gap-3\`}>
          {totalOweMe > 0 && (
          <div
            onClick={onNavigateToCredits}`;

let newContent = content.replace(regexGrid, newCodeGrid);

const regexGrid2 = /size=\{48\}\s*\/>\s*<\/div>\s*<div\s*onClick=\{onNavigateToCredits\}/;
const newCodeGrid2 = `size={48}
            />
          </div>
          )}
          {totalIOwe > 0 && (
          <div
            onClick={onNavigateToCredits}`;
            
newContent = newContent.replace(regexGrid2, newCodeGrid2);

const regexGrid3 = /size=\{48\}\s*\/>\s*<\/div>\s*<\/div>\s*<\/div>\s*\)\}/;
const newCodeGrid3 = `size={48}
            />
          </div>
          )}
        </div>
      </div>
      )}`;

newContent = newContent.replace(regexGrid3, newCodeGrid3);
fs.writeFileSync('src/components/Home.tsx', newContent);
