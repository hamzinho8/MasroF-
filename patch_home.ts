import fs from 'fs';
let content = fs.readFileSync('src/components/Home.tsx', 'utf-8');

// Move CATEGORY_MAP outside of Home function
const categoryMapStart = `  const CATEGORY_MAP = APP_CATEGORIES.map((cat) => ({`;
const categoryMapEnd = `  }));`;
const categoryMapFull = `const CATEGORY_MAP = APP_CATEGORIES.map((cat) => ({
    label: cat.label,
    icon: (() => {
      const IconComp = ICON_MAP[cat.iconName] || MoreHorizontal;
      return <IconComp size={24} />;
    })(),
    color: cat.colorString,
    bg: cat.bgColor,
    text: cat.color,
    glow: \`bg-\${cat.colorString}-400\`,
    colorHex: cat.colorHex,
  }));`;

content = content.replace(/  const CATEGORY_MAP = APP_CATEGORIES\.map\(\(cat\) => \(\{[\s\S]*?  \}\)\);\n/m, '');

// Insert after imports
content = content.replace('import VoiceTransactionModal from "./VoiceTransactionModal";', 'import VoiceTransactionModal from "./VoiceTransactionModal";\n\n' + categoryMapFull);

// Replace info.icon logic
const oldIconLogic = `                        <div className="flex items-center gap-2.5 shrink-0 opacity-75">
                          {info.icon && (
                            <div className="flex items-center justify-center">
                              {React.isValidElement(info.icon) ? React.cloneElement(info.icon as React.ReactElement, { size: 14, strokeWidth: 2.5 } as any) : info.icon}
                            </div>
                          )}`;

const newIconLogic = `                        <div className="flex items-center gap-2.5 shrink-0 opacity-75">
                            <div className="flex items-center justify-center">
                              {(() => {
                                if (info.iconSvg) return <div dangerouslySetInnerHTML={{__html: info.iconSvg}} className="w-3.5 h-3.5" />;
                                const IconComp = ICON_MAP[info.iconName] || ShoppingBag;
                                return <IconComp size={14} strokeWidth={2.5} />;
                              })()}
                            </div>`;

content = content.replace(oldIconLogic, newIconLogic);

fs.writeFileSync('src/components/Home.tsx', content);
