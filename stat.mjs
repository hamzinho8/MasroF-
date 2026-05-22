import fs from 'fs';
const buf = fs.readFileSync('assets/icon.png');
console.log(buf.slice(0, 50).toString('hex'));
