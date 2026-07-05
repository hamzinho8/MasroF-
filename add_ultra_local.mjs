import fs from 'fs';

// Add the new ultra local icons to objects.json
let objects = JSON.parse(fs.readFileSync('src/iconmatcher/database/objects.json', 'utf-8'));

const newIcons = [
  {
    id: "raibi",
    name_fr: "Raibi Jamila",
    name_ar: "رايبي جميلة",
    name_en: "Raibi Jamila",
    keywords: ["raibi", "jamila", "raybi", "رايبي"],
    category: "Gourmandises",
    icon: "RaibiIcon"
  },
  {
    id: "merendina",
    name_fr: "Merendina",
    name_ar: "ميريندينا",
    name_en: "Merendina",
    keywords: ["merendina", "mirendina", "ميريندينا"],
    category: "Gourmandises",
    icon: "MerendinaIcon"
  },
  {
    id: "khli3",
    name_fr: "Khlii",
    name_ar: "خليع",
    name_en: "Khlii",
    keywords: ["khlii", "khli3", "خليع"],
    category: "Protéines",
    icon: "Khli3Icon"
  },
  {
    id: "bouta",
    name_fr: "Bouteille de gaz",
    name_ar: "بوطة",
    name_en: "Gas cylinder",
    keywords: ["bouta", "gaz", "bota", "بوطة", "بوطا", "gaz"],
    category: "Logement",
    icon: "BoutaIcon"
  },
  {
    id: "zeri3a",
    name_fr: "Graines (Zeri3a)",
    name_ar: "زريعة",
    name_en: "Sunflower seeds",
    keywords: ["zeri3a", "pipas", "graines", "زريعة", "zari3a"],
    category: "Gourmandises",
    icon: "Zeri3aIcon"
  }
];

// Add only if not already there
newIcons.forEach(ni => {
  if (!objects.find(o => o.id === ni.id)) {
    objects.push(ni);
  }
});

fs.writeFileSync('src/iconmatcher/database/objects.json', JSON.stringify(objects, null, 2));

// Run tests
