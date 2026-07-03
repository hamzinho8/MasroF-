import fs from 'fs';
let content = fs.readFileSync('src/components/History.tsx', 'utf-8');

content = content.replace(
  "{ label: t.owedToMe, icon: <TrendingUp size={24} />, color: 'indigo', bg: 'bg-indigo-100', text: 'text-indigo-600', glow: 'bg-indigo-400', activeBg: 'bg-indigo-500', activeText: 'text-white' },",
  "{ label: t.owedToMe, icon: <TrendingUp size={24} />, color: 'indigo', bg: 'bg-indigo-100', text: 'text-indigo-600', glow: 'bg-indigo-400', activeBg: 'bg-indigo-500', activeText: 'text-white', colorHex: undefined },"
);

content = content.replace(
  "{ label: t.owedByMe, icon: <TrendingDown size={24} />, color: 'amber', bg: 'bg-amber-100', text: 'text-amber-600', glow: 'bg-amber-400', activeBg: 'bg-amber-500', activeText: 'text-white' }",
  "{ label: t.owedByMe, icon: <TrendingDown size={24} />, color: 'amber', bg: 'bg-amber-100', text: 'text-amber-600', glow: 'bg-amber-400', activeBg: 'bg-amber-500', activeText: 'text-white', colorHex: undefined }"
);

fs.writeFileSync('src/components/History.tsx', content);
