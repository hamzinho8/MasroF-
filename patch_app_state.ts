import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const stateToReplace = '  const [modalInitialCategory, setModalInitialCategory] = useState("");';
const newState = '  const [modalInitialCategory, setModalInitialCategory] = useState("");\n  const [modalInitialMode, setModalInitialMode] = useState<"manual" | "scanner" | "vocal">("manual");';

content = content.replace(stateToReplace, newState);
fs.writeFileSync('src/App.tsx', content);
