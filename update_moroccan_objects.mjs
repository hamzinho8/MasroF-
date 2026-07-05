import fs from 'fs';
import path from 'path';

let content = fs.readFileSync('src/iconmatcher/database/generate.js', 'utf-8');

const moroccanObjects = `
const moroccanObjects = [
  // Fast Food & Snacks
  { id: "tacos_ma", name_fr: "Tacos", name_ar: "طاكو", name_en: "Tacos", keywords: ["tacos", "takos", "طاكوس"], category: "Nourriture", icon: "Utensils" },
  { id: "chwarma_ma", name_fr: "Chawarma", name_ar: "شوارما", name_en: "Shawarma", keywords: ["chwarma", "chawarma", "chouarma", "شوارما", "شاورما"], category: "Nourriture", icon: "Utensils" },
  { id: "bocadillos_ma", name_fr: "Bocadillos", name_ar: "بوكاديوس", name_en: "Sandwich", keywords: ["bocadillos", "bocadio", "sandwich", "sandouich", "بوكاديوس"], category: "Nourriture", icon: "Sandwich" },
  { id: "za3za3_ma", name_fr: "Za3za3", name_ar: "زعزع", name_en: "Zaaza", keywords: ["za3za3", "zaaza", "زعزع"], category: "Gourmandises", icon: "CupSoda" },
  { id: "panache_ma", name_fr: "Jus Panaché", name_ar: "عصير باناشي", name_en: "Mixed juice", keywords: ["panache", "panachi", "jus", "3assir", "عصير", "باناشي"], category: "Nourriture", icon: "CupSoda" },
  { id: "rayb_ma", name_fr: "Rayb", name_ar: "رايب", name_en: "Yogurt", keywords: ["rayb", "raib", "mahlaba", "رايب"], category: "Nourriture", icon: "Milk" },
  
  // Bakery & Sweets
  { id: "millefeuille_ma", name_fr: "Millefeuille", name_ar: "ميلفاي", name_en: "Millefeuille", keywords: ["millefeuille", "milfay", "milfai", "ميلفاي"], category: "Gourmandises", icon: "Cake" },
  { id: "krwassa_ma", name_fr: "Croissant / Krwassa", name_ar: "كرواصة", name_en: "Croissant", keywords: ["krwassa", "croissant", "krouassa", "كرواصة"], category: "Gourmandises", icon: "Croissant" },
  { id: "shnek_ma", name_fr: "Shnek / Petit pain", name_ar: "شنيك", name_en: "Pain au chocolat", keywords: ["shnek", "chnek", "petit pain", "شنيك", "بتي بان"], category: "Gourmandises", icon: "Croissant" },
  { id: "pipas_ma", name_fr: "Pipas", name_ar: "بيبا", name_en: "Sunflower seeds", keywords: ["pipas", "zri3a", "zeri3a", "زريعة", "بيبا"], category: "Gourmandises", icon: "Nut" },
  { id: "chbakia_ma", name_fr: "Chebakia", name_ar: "شباكية", name_en: "Chebakia", keywords: ["chbakia", "chebakia", "mkhar9a", "شباكية"], category: "Gourmandises", icon: "Cookie" },

  // Vegetables & Fruits
  { id: "khizou_ma", name_fr: "Carottes (Khizou)", name_ar: "خيزو", name_en: "Carrots", keywords: ["khizou", "carotte", "carottes", "خيزو", "جزر"], category: "Plantes", icon: "Carrot" },
  { id: "lleft_ma", name_fr: "Navet (Lleft)", name_ar: "لفت", name_en: "Turnip", keywords: ["lleft", "left", "navet", "لفت"], category: "Plantes", icon: "Carrot" },
  { id: "gra3a_ma", name_fr: "Courgette (Gra3a)", name_ar: "گرعة", name_en: "Zucchini", keywords: ["gra3a", "gar3a", "courgette", "citrouille", "گرعة", "قرعة"], category: "Plantes", icon: "Carrot" },
  { id: "dnjale_ma", name_fr: "Aubergine (Dnjale)", name_ar: "دنجال", name_en: "Eggplant", keywords: ["dnjale", "danjal", "za3louk", "aubergine", "دنجال", "باذنجان"], category: "Plantes", icon: "Carrot" },
  { id: "felfla_ma", name_fr: "Poivron (Felfla)", name_ar: "فلفلة", name_en: "Pepper", keywords: ["felfla", "poivron", "فلفلة", "فلفل"], category: "Plantes", icon: "Carrot" },
  { id: "jalbana_ma", name_fr: "Petits pois (Jalbana)", name_ar: "جلبانة", name_en: "Peas", keywords: ["jalbana", "jelbana", "petits pois", "جلبانة"], category: "Plantes", icon: "Carrot" },
  { id: "barba_ma", name_fr: "Betterave (Barba)", name_ar: "باربا", name_en: "Beetroot", keywords: ["barba", "betterave", "باربا", "شمندر"], category: "Plantes", icon: "Carrot" },
  { id: "lymoun_ma", name_fr: "Orange (Lymoun)", name_ar: "ليمون", name_en: "Orange", keywords: ["lymoun", "limoun", "limon", "orange", "ليمون", "برتقال"], category: "Plantes", icon: "Apple" },
  { id: "tefah_ma", name_fr: "Pomme (Tefah)", name_ar: "تفاح", name_en: "Apple", keywords: ["tefah", "tfah", "pomme", "تفاح"], category: "Plantes", icon: "Apple" },
  { id: "banan_ma", name_fr: "Banane (Banan)", name_ar: "بنان", name_en: "Banana", keywords: ["banan", "banane", "بنان", "موز"], category: "Plantes", icon: "Banana" },
  { id: "dellah_ma", name_fr: "Pastèque (Dellah)", name_ar: "دلاح", name_en: "Watermelon", keywords: ["dellah", "dela7", "pastèque", "دلاح", "بطيخ"], category: "Plantes", icon: "Apple" },
  { id: "hendia_ma", name_fr: "Figue de barbarie", name_ar: "هندية", name_en: "Prickly pear", keywords: ["hendia", "karmous", "figue", "هندية", "كرموس"], category: "Plantes", icon: "Apple" },

  // Groceries, Spices, Staples
  { id: "sardin_ma", name_fr: "Sardines", name_ar: "سردين", name_en: "Sardines", keywords: ["sardin", "sardine", "hout", "حوت", "سردين"], category: "Protéines", icon: "Fish" },
  { id: "sanida_ma", name_fr: "Sucre (Sanida)", name_ar: "سنيدة", name_en: "Sugar", keywords: ["sanida", "sucre", "sokar", "سكر", "سنيدة"], category: "Essentiel", icon: "Salt" },
  { id: "loubia_ma", name_fr: "Haricots blancs", name_ar: "لوبيا", name_en: "White beans", keywords: ["loubia", "haricots", "لوبيا"], category: "Essentiel", icon: "Bean" },
  { id: "aads_ma", name_fr: "Lentilles (3dess)", name_ar: "عدس", name_en: "Lentils", keywords: ["aads", "3dess", "3des", "lentilles", "عدس"], category: "Essentiel", icon: "Bean" },
  { id: "homos_ma", name_fr: "Pois chiches (Homos)", name_ar: "حمص", name_en: "Chickpeas", keywords: ["homos", "7omos", "pois chiches", "حمص"], category: "Essentiel", icon: "Bean" },
  { id: "foul_ma", name_fr: "Fèves (Foul)", name_ar: "فول", name_en: "Fava beans", keywords: ["foul", "fèves", "فول"], category: "Essentiel", icon: "Bean" },
  { id: "tahmira_ma", name_fr: "Paprika (Tahmira)", name_ar: "تحميرة", name_en: "Paprika", keywords: ["tahmira", "ta7mira", "paprika", "تحميرة"], category: "Essentiel", icon: "Salt" },
  { id: "ras_lhanout_ma", name_fr: "Ras lhanout", name_ar: "راس الحانوت", name_en: "Ras el hanout", keywords: ["ras lhanout", "msakhen", "راس الحانوت"], category: "Essentiel", icon: "Salt" },
  { id: "9arfa_ma", name_fr: "Cannelle (9arfa)", name_ar: "قرفة", name_en: "Cinnamon", keywords: ["9arfa", "qarfa", "cannelle", "قرفة"], category: "Essentiel", icon: "Salt" },
  { id: "na3na3_ma", name_fr: "Menthe (Na3na3)", name_ar: "نعناع", name_en: "Mint", keywords: ["na3na3", "ne3ne3", "menthe", "نعناع"], category: "Plantes", icon: "Leaf" },
  { id: "chiba_ma", name_fr: "Absinthe (Chiba)", name_ar: "شيبة", name_en: "Wormwood", keywords: ["chiba", "absinthe", "شيبة"], category: "Plantes", icon: "Leaf" },
  { id: "louiza_ma", name_fr: "Verveine (Louiza)", name_ar: "لويزة", name_en: "Verbena", keywords: ["louiza", "verveine", "لويزة"], category: "Plantes", icon: "Leaf" },

  // Household & Cleaning
  { id: "javel_ma", name_fr: "Javel", name_ar: "جافيل", name_en: "Bleach", keywords: ["javel", "eau de javel", "جافيل"], category: "Sanitaire", icon: "SprayCan" },
  { id: "omo_ma", name_fr: "Lessive (Omo/Tide)", name_ar: "أومو/تيد", name_en: "Detergent", keywords: ["omo", "tide", "ariel", "lessive", "مسحوق", "تيد", "اومو"], category: "Sanitaire", icon: "WashingMachine" },
  { id: "saboun_beldi_ma", name_fr: "Savon Beldi", name_ar: "صابون بلدي", name_en: "Beldi soap", keywords: ["saboun beldi", "savon noir", "صابون بلدي"], category: "Sanitaire", icon: "Droplets" },
  { id: "taous_ma", name_fr: "Savon Taous", name_ar: "صابون الطاووس", name_en: "Taous soap", keywords: ["taous", "savon taous", "صابون الطاووس"], category: "Sanitaire", icon: "Droplets" },
  { id: "hammam_kis", name_fr: "Gant Hammam", name_ar: "كيس الحمام", name_en: "Hammam glove", keywords: ["kis", "kess", "hammam", "كيس", "حمام"], category: "Sanitaire", icon: "Bath" },
  
  // Utilities & Services
  { id: "ta3bia_ma", name_fr: "Recharge (Ta3bia)", name_ar: "تعبئة", name_en: "Recharge", keywords: ["ta3bia", "recharge", "carte", "تعبئة", "شارژ"], category: "Autres", icon: "Smartphone" },
  { id: "inwi_ma", name_fr: "Inwi", name_ar: "إنوي", name_en: "Inwi", keywords: ["inwi", "إنوي"], category: "Autres", icon: "Smartphone" },
  { id: "iam_ma", name_fr: "Maroc Telecom (IAM)", name_ar: "اتصالات المغرب", name_en: "Maroc Telecom", keywords: ["iam", "maroc telecom", "tisalat", "اتصالات"], category: "Autres", icon: "Smartphone" },
  { id: "orange_ma", name_fr: "Orange Maroc", name_ar: "أورنج", name_en: "Orange", keywords: ["orange", "meditel", "أورنج", "ميديتيل"], category: "Autres", icon: "Smartphone" },
  { id: "lydec_ma", name_fr: "Lydec / Eau & Elec", name_ar: "ليدك", name_en: "Water/Elec Bill", keywords: ["lydec", "redal", "amendis", "radeema", "ma ou do", "الما و الضو", "ليدك"], category: "Logement", icon: "Lightbulb" },
  { id: "coiffeur_ma", name_fr: "Coiffeur / Hella9", name_ar: "حلاق", name_en: "Barber", keywords: ["coiffeur", "hella9", "hila9a", "حلاق", "صالون"], category: "Autres", icon: "Scissors" },
  
  // Clothing
  { id: "jellaba_ma", name_fr: "Jellaba", name_ar: "جلابة", name_en: "Djellaba", keywords: ["jellaba", "djellaba", "جلابة"], category: "Shopping", icon: "Shirt" },
  { id: "balgha_ma", name_fr: "Balgha", name_ar: "بلغة", name_en: "Slippers", keywords: ["balgha", "belgha", "بلغة"], category: "Shopping", icon: "Footprints" },
  { id: "hwayj_ma", name_fr: "Vêtements (Hwayj)", name_ar: "حوايج", name_en: "Clothes", keywords: ["hwayj", "hwayej", "vetements", "حوايج", "ملابس"], category: "Shopping", icon: "Shirt" },
  { id: "sbat_ma", name_fr: "Chaussures (Sbat)", name_ar: "صباط", name_en: "Shoes", keywords: ["sbat", "sebbat", "chaussures", "صباط", "حذاء"], category: "Shopping", icon: "Footprints" },
  { id: "serwal_ma", name_fr: "Pantalon (Serwal)", name_ar: "سروال", name_en: "Pants", keywords: ["serwal", "pantalon", "سروال"], category: "Shopping", icon: "Shirt" },

  // Transportation
  { id: "tobis_ma", name_fr: "Bus (Tobis)", name_ar: "طوبيس", name_en: "Bus", keywords: ["tobis", "bus", "طوبيس", "حافلة"], category: "Transport", icon: "Bus" },
  { id: "taxi_ma", name_fr: "Taxi", name_ar: "طاكسي", name_en: "Taxi", keywords: ["taxi", "petit taxi", "grand taxi", "طاكسي"], category: "Transport", icon: "Car" }
];
`;

content = content.replace(
  'fs.writeFileSync(path.join(process.cwd() + \'/src/iconmatcher/database\', \'objects.json\'), JSON.stringify([...objects, ...additionalObjects], null, 2));', 
  moroccanObjects + '\nfs.writeFileSync(path.join(process.cwd() + \'/src/iconmatcher/database\', \'objects.json\'), JSON.stringify([...objects, ...additionalObjects, ...moroccanObjects], null, 2));'
);

fs.writeFileSync('src/iconmatcher/database/generate.js', content);
