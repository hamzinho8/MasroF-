import fs from 'fs';
let objects = JSON.parse(fs.readFileSync('src/iconmatcher/database/objects.json', 'utf-8'));

objects = objects.map(obj => {
  const allText = [
    obj.id,
    obj.name_fr || '',
    obj.name_ar || '',
    obj.name_en || '',
    ...(obj.keywords || [])
  ].join(' ').toLowerCase();
  
  if (allText.includes('argan') || allText.includes('zitoune') || allText.includes('زيتون')) {
    obj.icon = 'ArganIcon';
  }
  if (allText.includes("huile d'olive") || allText.includes("olive oil") || allText.includes("زيت العود")) {
    obj.icon = 'OliveOilIcon';
  } else if (allText.includes('huile') || allText.includes('oil')) {
    // wait, I don't want to override lesieur if it's there
  }
  
  if (allText.includes('lesieur')) {
    obj.icon = 'BrandLesieurIcon';
  }
  return obj;
});

fs.writeFileSync('src/iconmatcher/database/objects.json', JSON.stringify(objects, null, 2));

// Also let's re-run generate.js so if it generates it keeps it correct.
// We'll just patch generate.js to make sure the base is correct.
let gen = fs.readFileSync('src/iconmatcher/database/generate.js', 'utf-8');
gen = gen.replace(/icon: "Nut" \}, \/\/ for Argan/, 'icon: "ArganIcon" },');
gen = gen.replace(/icon: "Droplet" \}, \/\/ for Olive oil/, 'icon: "OliveOilIcon" },');
gen = gen.replace(/icon: "Droplets" \}, \/\/ for Oil/, 'icon: "BrandLesieurIcon" },'); // default oil bottle can be lesieur or something similar

fs.writeFileSync('src/iconmatcher/database/generate.js', gen);
