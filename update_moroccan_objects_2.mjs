import fs from 'fs';
import path from 'path';

let content = fs.readFileSync('src/iconmatcher/database/generate.js', 'utf-8');

const moroccanObjects2 = `
const moroccanObjects2 = [
  // Bread & Breakfast
  { id: "khobz_ma", name_fr: "Pain (Khobz)", name_ar: "خبز", name_en: "Bread", keywords: ["khobz", "pain", "خبز"], category: "Essentiel", icon: "Croissant" },
  { id: "harcha_ma", name_fr: "Harcha", name_ar: "حرشة", name_en: "Harcha", keywords: ["harcha", "7archa", "حرشة"], category: "Essentiel", icon: "Cookie" },
  { id: "batbout_ma", name_fr: "Batbout", name_ar: "بطبوط", name_en: "Batbout", keywords: ["batbout", "mkhamer", "بطبوط", "مخمار"], category: "Essentiel", icon: "Croissant" },
  { id: "msemen_ma", name_fr: "Msemen", name_ar: "مسمن", name_en: "Msemen", keywords: ["msemen", "rghayef", "مسمن", "رغايف"], category: "Essentiel", icon: "Square" },
  { id: "baghrir_ma", name_fr: "Baghrir", name_ar: "بغرير", name_en: "Baghrir", keywords: ["baghrir", "بغرير"], category: "Essentiel", icon: "Circle" },
  { id: "atay_ma", name_fr: "Thé (Atay)", name_ar: "أتاي", name_en: "Tea", keywords: ["atay", "ataye", "the", "thé", "أتاي", "شاي"], category: "Essentiel", icon: "Coffee" },
  
  // Drinks & Snacks
  { id: "sidi_ali_ma", name_fr: "Eau Sidi Ali", name_ar: "سيدي علي", name_en: "Water", keywords: ["sidi ali", "ain atlas", "sidi harazem", "ماء", "سيدي علي", "سيدي حرازم", "عين اطلس"], category: "Essentiel", icon: "GlassWater" },
  { id: "oulmes_ma", name_fr: "Oulmes", name_ar: "والماس", name_en: "Sparkling water", keywords: ["oulmes", "oulmass", "والماس"], category: "Nourriture", icon: "CupSoda" },
  { id: "hawai_ma", name_fr: "Hawai", name_ar: "هاواي", name_en: "Hawai soda", keywords: ["hawai", "haway", "هاواي"], category: "Gourmandises", icon: "CupSoda" },
  { id: "poms_ma", name_fr: "Poms", name_ar: "بومس", name_en: "Poms soda", keywords: ["poms", "pom's", "بومس"], category: "Gourmandises", icon: "CupSoda" },
  { id: "bimo_ma", name_fr: "Bimo", name_ar: "بيمو", name_en: "Biscuit", keywords: ["bimo", "biscuit", "بيمو", "بسكويت"], category: "Gourmandises", icon: "Cookie" },
  { id: "tango_ma", name_fr: "Tango", name_ar: "تانكو", name_en: "Tango", keywords: ["tango", "تانغو", "تانكو"], category: "Gourmandises", icon: "Cookie" },
  { id: "merendina_ma", name_fr: "Merendina", name_ar: "ميريندينا", name_en: "Merendina", keywords: ["merendina", "ميريندينا", "ميرندينا"], category: "Gourmandises", icon: "Cake" },
  
  // Extra Moroccan
  { id: "couscous_ma", name_fr: "Couscous / Ksksou", name_ar: "كسكس", name_en: "Couscous", keywords: ["couscous", "ksksou", "seksou", "كسكس", "كسكسو"], category: "Essentiel", icon: "Utensils" },
  { id: "hrira_ma", name_fr: "Harira", name_ar: "حريرة", name_en: "Harira soup", keywords: ["hrira", "harira", "حريرة"], category: "Nourriture", icon: "Soup" },
  { id: "zite_zitoune_ma", name_fr: "Huile d'olive (Zit)", name_ar: "زيت العود", name_en: "Olive oil", keywords: ["zit", "zite", "zit zitoun", "huile d'olive", "زيت", "زيت العود", "زيت الزيتون"], category: "Essentiel", icon: "Droplet" }
];
`;

content = content.replace(
  'fs.writeFileSync(path.join(process.cwd() + \'/src/iconmatcher/database\', \'objects.json\'), JSON.stringify([...objects, ...additionalObjects, ...moroccanObjects], null, 2));', 
  moroccanObjects2 + '\nfs.writeFileSync(path.join(process.cwd() + \'/src/iconmatcher/database\', \'objects.json\'), JSON.stringify([...objects, ...additionalObjects, ...moroccanObjects, ...moroccanObjects2], null, 2));'
);

fs.writeFileSync('src/iconmatcher/database/generate.js', content);
