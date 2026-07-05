import fs from 'fs';

let content = fs.readFileSync('src/constants.tsx', 'utf-8');

const importStatement = "import { PredefinedItem } from './types';\nimport * as MoroccanIcons from './components/icons/MoroccanIcons';\n";

content = content.replace("import { PredefinedItem } from './types';", importStatement);

const iconMapStart = "export const ICON_MAP: Record<string, React.ElementType> = {\n  ...MoroccanIcons,\n";
content = content.replace("export const ICON_MAP: Record<string, React.ElementType> = {", iconMapStart);

fs.writeFileSync('src/constants.tsx', content);
