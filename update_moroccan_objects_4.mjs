import fs from 'fs';
import path from 'path';

let content = fs.readFileSync('src/iconmatcher/database/generate.js', 'utf-8');

const moroccanObjects4 = `
const moroccanObjects4 = [
  // Street food & Traditional
  { id: "sfenj_ma", name_fr: "Sfenj", name_ar: "سفنج", name_en: "Sfenj", keywords: ["sfenj", "sfinj", "سفنج"], category: "Gourmandises", icon: "Circle" },
  { id: "taktouka_ma", name_fr: "Taktouka", name_ar: "تكتوكة", name_en: "Taktouka", keywords: ["taktouka", "تكتوكة"], category: "Nourriture", icon: "Salad" },
  { id: "zaalouk_ma", name_fr: "Zaalouk", name_ar: "زعلوك", name_en: "Zaalouk", keywords: ["zaalouk", "za3louk", "زعلوك"], category: "Nourriture", icon: "Salad" },
  { id: "fakia_ma", name_fr: "Fakia / Fruits secs", name_ar: "فاكية", name_en: "Dried fruits", keywords: ["fakia", "fruits secs", "fawakih", "فاكية"], category: "Gourmandises", icon: "Nut" },
  { id: "qrachel_ma", name_fr: "Krachel", name_ar: "قراشل", name_en: "Krachel", keywords: ["qrachel", "krachel", "grachel", "قراشل"], category: "Gourmandises", icon: "Croissant" },

  // Supermarkets & Shops
  { id: "marjane_ma", name_fr: "Marjane", name_ar: "مرجان", name_en: "Marjane", keywords: ["marjane", "marjan", "مرجان"], category: "Shopping", icon: "ShoppingCart" },
  { id: "bim_ma", name_fr: "BIM", name_ar: "بيم", name_en: "BIM", keywords: ["bim", "بيم"], category: "Shopping", icon: "ShoppingCart" },
  { id: "aswak_ma", name_fr: "Aswak Assalam", name_ar: "أسواق السلام", name_en: "Aswak", keywords: ["aswak", "aswaq", "أسواق"], category: "Shopping", icon: "ShoppingCart" },
  { id: "hanout_ma", name_fr: "Hanout / Epicerie", name_ar: "حانوت", name_en: "Grocery", keywords: ["hanout", "hanot", "moul lhanout", "حانوت", "بقالة"], category: "Essentiel", icon: "Store" },
  { id: "souq_ma", name_fr: "Souq / Marché", name_ar: "سوق", name_en: "Market", keywords: ["souq", "souk", "marche", "سوق"], category: "Shopping", icon: "Store" },
  { id: "gzar_ma", name_fr: "Boucherie (Gzar)", name_ar: "گزار", name_en: "Butcher",现实: ["gzar", "boucherie", "gazar", "گزار", "جزار"], category: "Protéines", icon: "Store" },

  // Misc
  { id: "qahwa_ma", name_fr: "Café (Qahwa)", name_ar: "قهوة", name_en: "Coffee", keywords: ["qahwa", "9ahwa", "qhiwa", "قهوة"], category: "Nourriture", icon: "Coffee" },
  { id: "tbib_ma", name_fr: "Médecin (Tbib)", name_ar: "طبيب", name_en: "Doctor", keywords: ["tbib", "medecin", "طبيب", "فرماسيان", "pharmacie"], category: "Sanitaire", icon: "Cross" }
];
`;

content = content.replace(
  'fs.writeFileSync(path.join(process.cwd() + \'/src/iconmatcher/database\', \'objects.json\'), JSON.stringify([...objects, ...additionalObjects, ...moroccanObjects, ...moroccanObjects2, ...moroccanObjects3], null, 2));', 
  moroccanObjects4 + '\nfs.writeFileSync(path.join(process.cwd() + \'/src/iconmatcher/database\', \'objects.json\'), JSON.stringify([...objects, ...additionalObjects, ...moroccanObjects, ...moroccanObjects2, ...moroccanObjects3, ...moroccanObjects4], null, 2));'
);

// fix syntax typo before writing
content = content.replace('现实:', 'keywords:');

fs.writeFileSync('src/iconmatcher/database/generate.js', content);
