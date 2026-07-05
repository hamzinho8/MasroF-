import fs from 'fs';

// 1. Update objects.json directly
let objects = JSON.parse(fs.readFileSync('src/iconmatcher/database/objects.json', 'utf-8'));

objects = objects.map(obj => {
  if (obj.keywords.includes('couscous') || obj.keywords.includes('tajine')) {
    obj.icon = 'TajineIcon';
  }
  if (obj.keywords.includes('atay') || obj.keywords.includes('tea') || obj.name_en === 'Tea') {
    obj.icon = 'BerradIcon';
  }
  if (obj.keywords.includes('batbout') || obj.keywords.includes('msemen') || obj.keywords.includes('rghayef')) {
    obj.icon = 'MsemenIcon';
  }
  return obj;
});

fs.writeFileSync('src/iconmatcher/database/objects.json', JSON.stringify(objects, null, 2));

// 2. Also update generate.js so future runs are correct
let gen = fs.readFileSync('src/iconmatcher/database/generate.js', 'utf-8');
gen = gen.replace(/icon: "CookingPot"/g, 'icon: "TajineIcon"');
gen = gen.replace(/icon: "Leaf"/g, 'icon: "Leaf"'); // keep leaf for mint, we'll just let the object replacement do its thing if needed
fs.writeFileSync('src/iconmatcher/database/generate.js', gen);
