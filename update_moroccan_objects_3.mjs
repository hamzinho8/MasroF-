import fs from 'fs';
import path from 'path';

let content = fs.readFileSync('src/iconmatcher/database/generate.js', 'utf-8');

const moroccanObjects3 = `
const moroccanObjects3 = [
  { id: "l7am_ma", name_fr: "Viande (L7am)", name_ar: "لحم", name_en: "Meat", keywords: ["l7am", "lham", "viande", "لحم", "gzar", "gazar"], category: "Protéines", icon: "Beef" },
  { id: "djaj_ma", name_fr: "Poulet (Djaj)", name_ar: "دجاج", name_en: "Chicken", keywords: ["djaj", "poulet", "دجاج"], category: "Protéines", icon: "Drumstick" },
  { id: "kfta_ma", name_fr: "Viande hachée (Kfta)", name_ar: "كفتة", name_en: "Minced meat", keywords: ["kfta", "kefta", "viande hachée", "كفتة"], category: "Protéines", icon: "Beef" },
  { id: "bid_ma", name_fr: "Oeufs (Bid)", name_ar: "بيض", name_en: "Eggs", keywords: ["bid", "oeufs", "oeuf", "بيض"], category: "Protéines", icon: "Egg" },
  { id: "smida_ma", name_fr: "Semoule (Smida)", name_ar: "سميدة", name_en: "Semolina", keywords: ["smida", "semoule", "سميدة"], category: "Essentiel", icon: "Wheat" },
  { id: "bssla_ma", name_fr: "Oignon (Bssla)", name_ar: "بصلة", name_en: "Onion", keywords: ["bssla", "bsla", "oignon", "بصل", "بصلة"], category: "Plantes", icon: "Carrot" },
  { id: "btata_ma", name_fr: "Pomme de terre (Btata)", name_ar: "بطاطا", name_en: "Potato", keywords: ["btata", "batata", "pomme de terre", "بطاطا"], category: "Plantes", icon: "Carrot" },
  { id: "maticha_ma", name_fr: "Tomate (Maticha)", name_ar: "مطيشة", name_en: "Tomato", keywords: ["maticha", "tomate", "tomat", "مطيشة", "طماطم"], category: "Plantes", icon: "Apple" },
  { id: "bzar_ma", name_fr: "Poivre (Bzar)", name_ar: "ابزار", name_en: "Black pepper", keywords: ["bzar", "ibzar", "poivre", "ابزار", "إبزار", "فلفل أسود"], category: "Essentiel", icon: "Salt" },
  { id: "kamoun_ma", name_fr: "Cumin (Kamoun)", name_ar: "كامون", name_en: "Cumin", keywords: ["kamoun", "cumin", "كامون", "كمون"], category: "Essentiel", icon: "Salt" },
  { id: "skenjbir_ma", name_fr: "Gingembre (Skenjbir)", name_ar: "سكنجبير", name_en: "Ginger", keywords: ["skenjbir", "gingembre", "سكنجبير", "زنجبيل"], category: "Essentiel", icon: "Salt" },
  { id: "zaafaran_ma", name_fr: "Safran (Za3faran)", name_ar: "زعفران", name_en: "Saffron", keywords: ["zaafaran", "za3faran", "safran", "زعفران"], category: "Essentiel", icon: "Salt" },
  { id: "kasbour_ma", name_fr: "Coriandre (Kasbour)", name_ar: "قزبر", name_en: "Coriander", keywords: ["kasbour", "9asbour", "qasbour", "coriandre", "قزبر"], category: "Plantes", icon: "Leaf" },
  { id: "m3adnous_ma", name_fr: "Persil (M3adnous)", name_ar: "معدنوس", name_en: "Parsley", keywords: ["m3adnous", "m3ednous", "persil", "معدنوس"], category: "Plantes", icon: "Leaf" }
];
`;

content = content.replace(
  'fs.writeFileSync(path.join(process.cwd() + \'/src/iconmatcher/database\', \'objects.json\'), JSON.stringify([...objects, ...additionalObjects, ...moroccanObjects, ...moroccanObjects2], null, 2));', 
  moroccanObjects3 + '\nfs.writeFileSync(path.join(process.cwd() + \'/src/iconmatcher/database\', \'objects.json\'), JSON.stringify([...objects, ...additionalObjects, ...moroccanObjects, ...moroccanObjects2, ...moroccanObjects3], null, 2));'
);

fs.writeFileSync('src/iconmatcher/database/generate.js', content);
