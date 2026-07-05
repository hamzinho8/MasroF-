import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const target = `    updateWidget();
  }, [`;
const replacement = `    updateWidget();
    }, 2000);
    return () => clearTimeout(timer);
  }, [`;

content = content.replace(target, replacement);
fs.writeFileSync('src/App.tsx', content);
