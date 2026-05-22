import fs from 'fs';
import path from 'path';

// Valid tiny 1x1 transparent PNG
const validPngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
const buffer = Buffer.from(validPngBase64, 'base64');

const files = [
  'assets/icon.png', 'assets/logo.png', 'assets/splash.png',
  'public/icon.png', 'public/logo.png'
];

for (const file of files) {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
     fs.writeFileSync(filePath, buffer);
  } else {
     fs.writeFileSync(filePath, buffer);
  }
}

console.log("Reset images to a valid transparent PNG to avoid breaking build.");
