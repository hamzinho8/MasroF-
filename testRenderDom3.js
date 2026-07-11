import { JSDOM } from 'jsdom';
const dom = new JSDOM('<!DOCTYPE html><html><body><div id="root"></div></body></html>', { url: "http://localhost:3000" });
global.window = dom.window;
global.document = dom.window.document;
Object.defineProperty(global, 'navigator', { value: dom.window.navigator, configurable: true, writable: true });
global.localStorage = { getItem: () => null, setItem: () => {} };
Object.defineProperty(global.window, 'localStorage', { value: global.localStorage, configurable: true, writable: true });
Object.defineProperty(global.window, 'matchMedia', { value: () => ({ matches: false, addListener: () => {}, removeListener: () => {} }), configurable: true, writable: true });

import { renderToString } from 'react-dom/server';
import App from './src/App.tsx';
import React from 'react';

// Force lazy components to load immediately for SSR
const originalLazy = React.lazy;
React.lazy = (fn) => {
  let result = null;
  fn().then(r => { result = r.default; }).catch(e => { console.error("Lazy load failed:", e); });
  return (props) => {
    if (!result) throw new Error("Component not loaded synchronously");
    return React.createElement(result, props);
  };
};

try {
  // It won't work perfectly because fn() is async. 
  // Let's just import Home and render it.
} catch(e) {}
