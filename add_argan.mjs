import fs from 'fs';
let objects = JSON.parse(fs.readFileSync('src/iconmatcher/database/objects.json', 'utf-8'));

objects.push({
  id: "argan_oil",
  name_fr: "Huile d'argan",
  name_ar: "زيت اركان",
  name_en: "Argan oil",
  keywords: ["argan", "argane", "huile d'argan", "اركان", "أركان"],
  category: "Nourriture",
  icon: "ArganIcon"
});

objects.push({
  id: "amlou",
  name_fr: "Amlou",
  name_ar: "أملو",
  name_en: "Amlou",
  keywords: ["amlou", "amlo", "أملو", "املو"],
  category: "Gourmandises",
  icon: "ArganIcon"
});

objects.push({
  id: "lben",
  name_fr: "Lben",
  name_ar: "لبن",
  name_en: "Lben",
  keywords: ["lben", "lban", "لبن"],
  category: "Nourriture",
  icon: "BrandCentraleIcon"
});


fs.writeFileSync('src/iconmatcher/database/objects.json', JSON.stringify(objects, null, 2));
