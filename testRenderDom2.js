import { JSDOM } from 'jsdom';
const dom = new JSDOM('<!DOCTYPE html><html><body><div id="root"></div></body></html>', { url: "http://localhost:3000" });
global.window = dom.window;
global.document = dom.window.document;
Object.defineProperty(global, 'navigator', {
  value: dom.window.navigator,
  configurable: true,
  writable: true
});
global.localStorage = {
  getItem: () => null,
  setItem: () => {}
};
Object.defineProperty(global.window, 'localStorage', {
  value: global.localStorage,
  configurable: true,
  writable: true
});
Object.defineProperty(global.window, 'matchMedia', {
  value: () => ({ matches: false, addListener: () => {}, removeListener: () => {} }),
  configurable: true,
  writable: true
});

import { renderToString } from 'react-dom/server';
import App from './src/App.tsx';
import React from 'react';

try {
  renderToString(React.createElement(App));
  console.log("SUCCESS RENDER 1");
} catch(e) {
  console.error("CAUGHT:", e);
}
