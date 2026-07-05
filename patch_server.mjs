import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf-8');

const promptAddition = `
- The icon MUST be a valid PascalCase Lucide React icon name (e.g., 'Coffee', 'Car', 'Shirt', 'Package').
- You can ALSO use these special Moroccan icons if they fit better: 'TajineIcon' (for tajine, couscous, rfissa), 'BerradIcon' (for tea), 'MsemenIcon' (for square flatbread), 'GhoribaIcon' (for round cookies/bread like harcha), 'ChebakiaIcon' (for chebakia), 'SfenjIcon' (for doughnut/sfenj), 'BalghaIcon' (for traditional slippers), 'JellabaIcon' (for traditional clothes), 'HanoutIcon' (for small grocery stores).
`;

content = content.replace(
  "- The icon MUST be a valid PascalCase Lucide React icon name (e.g., 'Coffee', 'Car', 'Shirt', 'Package').",
  promptAddition.trim()
);

fs.writeFileSync('server.ts', content);
