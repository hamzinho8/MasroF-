import fs from 'fs';
const content = fs.readFileSync('src/components/Home.tsx', 'utf-8');

const regex1 = /\{\/\* Credits Buttons \- Matching summary card style exactly \*\/\}\s*\{isVisible\("credits"\) && \(\s*<div className="mb-8"/;

const newCode1 = `{/* Credits Buttons - Matching summary card style exactly */}
      {isVisible("credits") && (totalOweMe > 0 || totalIOwe > 0) && (
      <div className="mb-8"`;

const finalContent = content.replace(regex1, newCode1);
fs.writeFileSync('src/components/Home.tsx', finalContent);
