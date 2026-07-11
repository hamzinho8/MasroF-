import { JSDOM } from 'jsdom';
const dom = new JSDOM('<!DOCTYPE html><html><body><div id="root"></div></body></html>', { url: "http://localhost:3000" });
global.window = dom.window;
global.document = dom.window.document;
global.localStorage = {
  getItem: () => null,
  setItem: () => {}
};
global.window.localStorage = global.localStorage;

import { renderToString } from 'react-dom/server';
import App from './src/App.tsx';
import React from 'react';

try {
  renderToString(React.createElement(App));
  console.log("SUCCESS RENDER 1");
} catch(e) {
  console.error("CAUGHT:", e);
}
