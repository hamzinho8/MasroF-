import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const importsToReplace = `import Home from "./components/Home";
import Statistics from "./components/Statistics";
import Credits from "./components/Credits";
import Bank from "./components/Bank";
import HistoryView from "./components/History";
import SettingsView from "./components/Settings";
import { scheduleBackupReminder } from "./utils/notifications";
import LockScreen from "./components/LockScreen";
import Inventory from "./components/Inventory";`;

const newImports = `import { lazy, Suspense } from "react";
const Home = lazy(() => import("./components/Home"));
const Statistics = lazy(() => import("./components/Statistics"));
const Credits = lazy(() => import("./components/Credits"));
const Bank = lazy(() => import("./components/Bank"));
const HistoryView = lazy(() => import("./components/History"));
const SettingsView = lazy(() => import("./components/Settings"));
const Inventory = lazy(() => import("./components/Inventory"));
import { scheduleBackupReminder } from "./utils/notifications";
import LockScreen from "./components/LockScreen";`;

content = content.replace(importsToReplace, newImports);

// Also we need to wrap the rendered content in Suspense. Let's find where they are rendered.
fs.writeFileSync('src/App.tsx', content);
