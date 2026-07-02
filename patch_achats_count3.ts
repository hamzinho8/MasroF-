import fs from 'fs';
const content = fs.readFileSync('src/components/Home.tsx', 'utf-8');

const regex = /\{boughtThisMonth > 1 && \(/;
const newCode = `{boughtThisMonth > 0 && (`;

const finalContent = content.replace(regex, newCode);
fs.writeFileSync('src/components/Home.tsx', finalContent);
