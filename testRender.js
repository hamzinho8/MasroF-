import { renderToString } from 'react-dom/server';
import App from './src/App.tsx';
import React from 'react';

try {
  renderToString(React.createElement(App));
} catch(e) {
  console.error("CAUGHT:", e);
}
