import fs from 'fs';

let objects = JSON.parse(fs.readFileSync('src/iconmatcher/database/objects.json', 'utf-8'));

objects = objects.map(obj => {
  if (obj.keywords.includes('sfenj')) {
    obj.icon = 'SfenjIcon';
  }
  return obj;
});

fs.writeFileSync('src/iconmatcher/database/objects.json', JSON.stringify(objects, null, 2));

// Also patch generate.js
let gen = fs.readFileSync('src/iconmatcher/database/generate.js', 'utf-8');
gen = gen.replace(/icon: "Circle" \}, \/\/ for Sfenj/, 'icon: "SfenjIcon" },');
fs.writeFileSync('src/iconmatcher/database/generate.js', gen);
