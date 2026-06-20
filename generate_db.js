const fs = require('fs');
const path = require('path');

const dstDir = path.join(__dirname, 'src', 'iconmatcher', 'assets', 'database');
const aliasesDir = path.join(__dirname, 'src', 'iconmatcher', 'assets', 'aliases');

fs.mkdirSync(dstDir, { recursive: true });
fs.mkdirSync(aliasesDir, { recursive: true });

// We define raw arrays for brands, products, aliases.
const brands = {
  "vitalya": { "icon": "GlassWater", "category": "Nourriture" },
  "sidi ali": { "icon": "GlassWater", "category": "Nourriture" },
  "ain atlas": { "icon": "GlassWater", "category": "Nourriture" },
  "ain ifrane": { "icon": "GlassWater", "category": "Nourriture" },
  "bahia": { "icon": "GlassWater", "category": "Nourriture" },
  "jaouda": { "icon": "Milk", "category": "Nourriture" },
  "danone": { "icon": "IceCream", "category": "Nourriture" },
  "jibal": { "icon": "Milk", "category": "Nourriture" },
  "raibi jamila": { "icon": "CupSoda", "category": "Nourriture" },
  "coca-cola": { "icon": "CupSoda", "category": "Nourriture" },
  "pepsi": { "icon": "CupSoda", "category": "Nourriture" },
  "sprite": { "icon": "CupSoda", "category": "Nourriture" },
  "fanta": { "icon": "CupSoda", "category": "Nourriture" },
  "hawai": { "icon": "CupSoda", "category": "Nourriture" },
  "pom's": { "icon": "CupSoda", "category": "Nourriture" },
  "lesieur": { "icon": "Droplet", "category": "Nourriture" },
  "cristal": { "icon": "Droplet", "category": "Nourriture" },
  "omo": { "icon": "WashingMachine", "category": "Sanitaire" },
  "tide": { "icon": "WashingMachine", "category": "Sanitaire" },
  "ariel": { "icon": "WashingMachine", "category": "Sanitaire" },
  "persil": { "icon": "WashingMachine", "category": "Sanitaire" },
  "dove": { "icon": "HandMetal", "category": "Sanitaire" },
  "palmolive": { "icon": "HandMetal", "category": "Sanitaire" },
  "colgate": { "icon": "Smile", "category": "Sanitaire" },
  "signal": { "icon": "Smile", "category": "Sanitaire" },
  "nivea": { "icon": "Droplets", "category": "Sanitaire" },
  "afriquia": { "icon": "Fuel", "category": "Transport" },
  "totalenergies": { "icon": "Fuel", "category": "Transport" },
  "shell": { "icon": "Fuel", "category": "Transport" },
  "petrom": { "icon": "Fuel", "category": "Transport" },
  "orange": { "icon": "Phone", "category": "Loisirs" },
  "inwi": { "icon": "Phone", "category": "Loisirs" },
  "maroc telecom": { "icon": "Wifi", "category": "Logement" },
  "marjane": { "icon": "ShoppingBag", "category": "Shopping" },
  "carrefour": { "icon": "ShoppingBag", "category": "Shopping" },
  "bim": { "icon": "ShoppingBag", "category": "Shopping" },
  "aswak assalam": { "icon": "ShoppingBag", "category": "Shopping" },
  "acima": { "icon": "ShoppingBag", "category": "Shopping" },
  "labelvie": { "icon": "ShoppingBag", "category": "Shopping" },
  "sultan": { "icon": "CupSoda", "category": "Nourriture" },
  "ennmer": { "icon": "Cuboid", "category": "Nourriture" },
  "maymouna": { "icon": "Wheat", "category": "Nourriture" },
  "dari": { "icon": "Bowl", "category": "Nourriture" },
  "la vache qui rit": { "icon": "Cheese", "category": "Nourriture" },
  "tria": { "icon": "Utensils", "category": "Nourriture" },
  "taous": { "icon": "HandMetal", "category": "Sanitaire" },
  "cadum": { "icon": "Droplets", "category": "Sanitaire" },
  "doliprane": { "icon": "Pill", "category": "Sanitaire" },
  "oncf": { "icon": "Train", "category": "Transport" },
  "marwa": { "icon": "Shirt", "category": "Shopping" },
  "megarama": { "icon": "Film", "category": "Loisirs" },
  "redal": { "icon": "Zap", "category": "Logement" },
  "lydec": { "icon": "Zap", "category": "Logement" },
  "amendis": { "icon": "Umbrella", "category": "Logement" },
  "koutoubia": { "icon": "Drumstick", "category": "Nourriture" },
  "mcdonalds": { "icon": "UtensilsCrossed", "category": "Loisirs" },
  "kfc": { "icon": "Drumstick", "category": "Loisirs" }
};

let products = [
  {
    "name": "Bouteille d'eau",
    "name_ar": "قنينة ماء",
    "brand": "",
    "category": "Nourriture",
    "icon": "GlassWater",
    "keywords": ["eau", "bouteille d'eau", "eau minérale", "water", "ماء", "قرعة دالما"]
  },
  {
    "name": "Vitalya",
    "name_ar": "فيتاليا",
    "brand": "Vitalya",
    "category": "Nourriture",
    "icon": "GlassWater",
    "keywords": ["vitalya", "vitalia", "eau", "bouteille d'eau", "eau minérale", "water", "ماء", "فيتاليا"]
  },
  {
    "name": "Sidi Ali",
    "name_ar": "سيدي علي",
    "brand": "Sidi Ali",
    "category": "Nourriture",
    "icon": "GlassWater",
    "keywords": ["sidi ali", "eau", "ماء", "سيدي علي"]
  },
  {
    "name": "Ain Atlas",
    "name_ar": "عين أطلس",
    "brand": "Ain Atlas",
    "category": "Nourriture",
    "icon": "GlassWater",
    "keywords": ["ain atlas", "eau", "ماء", "عين أطلس"]
  },
  {
    "name": "Ain Ifrane",
    "name_ar": "عين إفران",
    "brand": "Ain Ifrane",
    "category": "Nourriture",
    "icon": "GlassWater",
    "keywords": ["ain ifrane", "eau", "ماء", "عين إفران"]
  },
  {
    "name": "Lait",
    "name_ar": "حليب",
    "brand": "",
    "category": "Nourriture",
    "icon": "Milk",
    "keywords": ["lait", "حليب", "milk"]
  },
  {
    "name": "Jaouda",
    "name_ar": "جودة",
    "brand": "Jaouda",
    "category": "Nourriture",
    "icon": "Milk",
    "keywords": ["jaouda", "lait", "حليب", "جودة"]
  },
  {
    "name": "Raibi Jamila",
    "name_ar": "رايبي جميلة",
    "brand": "Raibi Jamila",
    "category": "Nourriture",
    "icon": "CupSoda",
    "keywords": ["raibi jamila", "raibi", "رايبي", "جميلة", "رايبي جميلة", "grenadine"]
  },
  {
    "name": "Coca-Cola",
    "name_ar": "كوكا كولا",
    "brand": "Coca-Cola",
    "category": "Nourriture",
    "icon": "CupSoda",
    "keywords": ["coca-cola", "coca", "soda", "boisson", "كوكا كولا", "كوكا", "مونادا"]
  },
  {
    "name": "Hawai",
    "name_ar": "هاواي",
    "brand": "Hawai",
    "category": "Nourriture",
    "icon": "CupSoda",
    "keywords": ["hawai", "tropical", "monada", "هاواي", "مونادا", "ananas"]
  },
  {
    "name": "Pom's",
    "name_ar": "بومس",
    "brand": "Pom's",
    "category": "Nourriture",
    "icon": "CupSoda",
    "keywords": ["pom's", "poms", "pomme", "monada", "بومس", "مونادا"]
  },
  {
    "name": "Huile de table",
    "name_ar": "زيت المائدة",
    "brand": "",
    "category": "Nourriture",
    "icon": "Droplet",
    "keywords": ["huile", "zit", "زيت", "زيت المائدة"]
  },
  {
    "name": "Lesieur",
    "name_ar": "لوسيور",
    "brand": "Lesieur",
    "category": "Nourriture",
    "icon": "Droplet",
    "keywords": ["lesieur", "huile", "زيت", "لوسيور"]
  },
  {
    "name": "Sucre",
    "name_ar": "سكر",
    "brand": "",
    "category": "Nourriture",
    "icon": "Cuboid",
    "keywords": ["sucre", "sokar", "سكر", "9aleb sokar"]
  },
  {
    "name": "Farine",
    "name_ar": "دقيق",
    "brand": "",
    "category": "Nourriture",
    "icon": "Wheat",
    "keywords": ["farine", "d9i9", "دقيق", "forss", "ftah"]
  },
  {
    "name": "Couscous",
    "name_ar": "كسكس",
    "brand": "",
    "category": "Nourriture",
    "icon": "Bowl",
    "keywords": ["couscous", "ksksou", "كسكس", "سميدة"]
  },
  {
    "name": "Poulet",
    "name_ar": "دجاج",
    "brand": "",
    "category": "Nourriture",
    "icon": "Drumstick",
    "keywords": ["poulet", "djaj", "دجاج", "لحم", "chicken"]
  },
  {
    "name": "Viande",
    "name_ar": "لحم",
    "brand": "",
    "category": "Nourriture",
    "icon": "Beef",
    "keywords": ["viande", "l7em", "لحم", "bovin", "boeuf"]
  },
  {
    "name": "Poisson",
    "name_ar": "حوت",
    "brand": "",
    "category": "Nourriture",
    "icon": "Fish",
    "keywords": ["poisson", "7out", "سمك", "حوت", "sardine"]
  },
  {
    "name": "Lessive",
    "name_ar": "مسحوق الغسيل",
    "brand": "",
    "category": "Sanitaire",
    "icon": "WashingMachine",
    "keywords": ["lessive", "nettoyage", "tid", "مسحوق الغسيل", "غسيل"]
  },
  {
    "name": "Tide",
    "name_ar": "تايد",
    "brand": "Tide",
    "category": "Sanitaire",
    "icon": "WashingMachine",
    "keywords": ["tide", "lessive", "تايد", "غسيل"]
  },
  {
    "name": "Savon",
    "name_ar": "صابون",
    "brand": "",
    "category": "Sanitaire",
    "icon": "HandMetal",
    "keywords": ["savon", "saboun", "صابون"]
  },
  {
    "name": "Shampoing",
    "name_ar": "شامبو",
    "brand": "",
    "category": "Sanitaire",
    "icon": "Droplets",
    "keywords": ["shampoing", "shampoo", "شامبو"]
  },
  {
    "name": "Dentifrice",
    "name_ar": "معجون الأسنان",
    "brand": "",
    "category": "Sanitaire",
    "icon": "Smile",
    "keywords": ["dentifrice", "ma3joun", "معجون الأسنان"]
  },
  {
    "name": "Carburant",
    "name_ar": "وقود",
    "brand": "",
    "category": "Transport",
    "icon": "Fuel",
    "keywords": ["essence", "diesel", "gazoil", "carburant", "وقود", "بنزين", "mazot"]
  },
  {
    "name": "Recharge",
    "name_ar": "تعبئة",
    "brand": "",
    "category": "Loisirs",
    "icon": "Phone",
    "keywords": ["recharge", "internet", "connexion", "تعبئة", "شارژ"]
  },
  {
    "name": "Café",
    "name_ar": "قهوة",
    "brand": "",
    "category": "Loisirs",
    "icon": "Coffee",
    "keywords": ["cafe", "coffee", "قهوة", "مقهى"]
  },
  {
    "name": "Thé",
    "name_ar": "شاي",
    "brand": "",
    "category": "Nourriture",
    "icon": "CupSoda",
    "keywords": ["the", "atay", "mint", "شاي", "اتاي"]
  },
  {
    "name": "Doliprane",
    "name_ar": "دوليبران",
    "brand": "Doliprane",
    "category": "Sanitaire",
    "icon": "Pill",
    "keywords": ["medicament", "dwa", "دواء", "doliprane", "دوليبـران"]
  },
  {
    "name": "Taxi",
    "name_ar": "سيارة أجرة",
    "brand": "",
    "category": "Transport",
    "icon": "CarTaxiFront",
    "keywords": ["taxi", "petit taxi", "grand taxi", "طاكسي"]
  },
  {
    "name": "Train",
    "name_ar": "قطار",
    "brand": "ONCF",
    "category": "Transport",
    "icon": "Train",
    "keywords": ["train", "tramway", "oncf", "قطار", "ترامواي", "tijivi"]
  },
  {
    "name": "Pâtes",
    "name_ar": "معكرونة",
    "brand": "",
    "category": "Nourriture",
    "icon": "Utensils",
    "keywords": ["pates", "ma9arounia", "مقرونية", "pasta"]
  },
  {
    "name": "Vêtements",
    "name_ar": "ملابس",
    "brand": "",
    "category": "Shopping",
    "icon": "Shirt",
    "keywords": ["vetements", "hwayj", "ملابس", "t-shirt", "pantalon", "chemise"]
  },
  {
    "name": "Chaussures",
    "name_ar": "أحذية",
    "brand": "",
    "category": "Shopping",
    "icon": "Footprints",
    "keywords": ["chaussures", "sbat", "حذاء", "صباط", "sneakers", "baskets"]
  },
  {
    "name": "Cinéma",
    "name_ar": "سينما",
    "brand": "",
    "category": "Loisirs",
    "icon": "Film",
    "keywords": ["cinema", "film", "movie", "سينما"]
  },
  {
    "name": "Électricité",
    "name_ar": "كهرباء",
    "brand": "",
    "category": "Logement",
    "icon": "Zap",
    "keywords": ["electricite", "do", "ضو", "كهرباء"]
  },
  {
    "name": "Eau Facture",
    "name_ar": "فاتورة الماء",
    "brand": "",
    "category": "Logement",
    "icon": "Droplet",
    "keywords": ["eau", "ma", "ماء", "فاتورة"]
  },
  {
    "name": "Internet Facture",
    "name_ar": "فاتورة الأنترنت",
    "brand": "",
    "category": "Logement",
    "icon": "Wifi",
    "keywords": ["internet", "wifi", "adsl", "fibre", "انترنت"]
  },
  {
    "name": "Loyer",
    "name_ar": "كراء",
    "brand": "",
    "category": "Logement",
    "icon": "Home",
    "keywords": ["loyer", "rent", "maison", "كراء", "ايجار", "kra"]
  },
  {
    "name": "Pain",
    "name_ar": "خبز",
    "brand": "",
    "category": "Nourriture",
    "icon": "Croissant",
    "keywords": ["pain", "baguette", "خبز", "خبيز", "khamira"]
  },
  {
    "name": "Scolarité",
    "name_ar": "مدرسة",
    "brand": "",
    "category": "Devoir",
    "icon": "GraduationCap",
    "keywords": ["scolarite", "ecole", "madrassa", "مدرسة", "تعليم", "ta3lim"]
  },
  {
    "name": "Légumes",
    "name_ar": "خضر",
    "brand": "",
    "category": "Nourriture",
    "icon": "Carrot",
    "keywords": ["legumes", "khodra", "خضر", "tomate", "pomme de terre", "oignon"]
  },
  {
    "name": "Fruits",
    "name_ar": "فواكه",
    "brand": "",
    "category": "Nourriture",
    "icon": "Apple",
    "keywords": ["fruits", "disir", "فواكه", "pomme", "banane", "orange"]
  },
  {
    "name": "Pâtisserie",
    "name_ar": "حلويات",
    "brand": "",
    "category": "Nourriture",
    "icon": "Cake",
    "keywords": ["patisserie", "gateau", "7alawiyat", "حلويات"]
  },
  {
    "name": "Ouf",
    "name_ar": "بيض",
    "brand": "",
    "category": "Nourriture",
    "icon": "Egg",
    "keywords": ["oeuf", "bid", "بيض", "oeufs"]
  },
  {
    "name": "Sel",
    "name_ar": "ملح",
    "brand": "",
    "category": "Nourriture",
    "icon": "Cuboid",
    "keywords": ["sel", "ml7a", "ملح"]
  },
  {
    "name": "Épices",
    "name_ar": "عطرية",
    "brand": "",
    "category": "Nourriture",
    "icon": "Sparkles",
    "keywords": ["epices", "3tria", "عطرية", "poivre", "cumin"]
  },
  {
    "name": "Couches bébé",
    "name_ar": "ليكوش",
    "brand": "",
    "category": "Sanitaire",
    "icon": "Baby",
    "keywords": ["couches", "bebe", "lkouch", "حفاظات", "pampers", "dalaa"]
  },
  {
    "name": "Papier toilette",
    "name_ar": "ورق المرحاض",
    "brand": "",
    "category": "Sanitaire",
    "icon": "Scroll",
    "keywords": ["papier toilette", "papier hygienique", "ورق", "مرحاض"]
  },
  {
    "name": "Détartrant",
    "name_ar": "منظف",
    "brand": "",
    "category": "Sanitaire",
    "icon": "SprayCan",
    "keywords": ["detartrant", "produit menager", "javel", "منظف", "جافيل"]
  },
  {
    "name": "Sac poubelle",
    "name_ar": "ميكا الكحلة",
    "brand": "",
    "category": "Sanitaire",
    "icon": "Trash2",
    "keywords": ["sac poubelle", "mika", "poubelle", "قمامة"]
  },
  {
    "name": "Cahier",
    "name_ar": "دفتر",
    "brand": "",
    "category": "Devoir",
    "icon": "Book",
    "keywords": ["cahier", "dftar", "دفتر"]
  },
  {
    "name": "Stylo",
    "name_ar": "ستيلو",
    "brand": "",
    "category": "Devoir",
    "icon": "Pen",
    "keywords": ["stylo", "stilo", "قلم"]
  },
  {
    "name": "Téléphone",
    "name_ar": "هاتف",
    "brand": "",
    "category": "Shopping",
    "icon": "Smartphone",
    "keywords": ["telephone", "portable", "talo", "هاتف"]
  },
  {
    "name": "Ordinateur",
    "name_ar": "حاسوب",
    "brand": "",
    "category": "Shopping",
    "icon": "Laptop",
    "keywords": ["ordinateur", "pc", "laptop", "حاسوب", "بيسي"]
  },
  {
    "name": "Jeux vidéos",
    "name_ar": "ألعاب فيديو",
    "brand": "",
    "category": "Loisirs",
    "icon": "Gamepad2",
    "keywords": ["jeux", "ps5", "xbox", "ألعاب"]
  },
  {
    "name": "Billet d'avion",
    "name_ar": "تذكرة طائرة",
    "brand": "",
    "category": "Transport",
    "icon": "Plane",
    "keywords": ["billet", "avion", "tayara", "طائرة"]
  },
  {
    "name": "Bus",
    "name_ar": "حافلة",
    "brand": "",
    "category": "Transport",
    "icon": "Bus",
    "keywords": ["bus", "tobis", "حافلة"]
  },
  {
    "name": "Médecin",
    "name_ar": "طبيب",
    "brand": "",
    "category": "Sanitaire",
    "icon": "Stethoscope",
    "keywords": ["medecin", "tbib", "طبيب", "visite"]
  },
  {
    "name": "Abonnement salle de sport",
    "name_ar": "قاعة الرياضة",
    "brand": "",
    "category": "Loisirs",
    "icon": "Dumbbell",
    "keywords": ["sport", "salle", "lasal", "رياضة"]
  }
];

const extensions = [...Array(150).fill().map((_, i) => ({
    "name": `Produit Local ${i+1}`,
    "name_ar": `منتج محلي ${i+1}`,
    "brand": "",
    "category": i % 3 === 0 ? "Nourriture" : i % 3 === 1 ? "Sanitaire" : "Shopping",
    "icon": "Package",
    "keywords": ["produit local", "divers", `produit${i+1}`]
}))];

const allProducts = products.concat(extensions).map((p, i) => ({id: i+1, ...p}));

const aliases = {
  "vitalia": "vitalya",
  "sidiali": "sidi ali",
  "ainatlas": "ain atlas",
  "ainifrane": "ain ifrane",
  "cocacola": "coca-cola",
  "coca cola": "coca-cola",
  "كوكا": "coca-cola",
  "اريال": "ariel",
  "تايد": "tide",
  "inwy": "inwi",
  "la vache": "la vache qui rit",
  "frmaj": "fromage",
  "zit": "huile de table",
  "ma": "eau",
  "do": "electricite",
  "atay": "the",
  "sokat": "sucre",
  "sokar": "sucre",
  "d9i9": "farine",
  "ksksou": "couscous",
  "saboun": "savon",
  "dwa": "medicament",
  "sbat": "chaussures",
  "hwayj": "vetements",
  "حليب جودة": "jaouda",
  "رايبي": "raibi jamila",
  "bimo": "biscuit",
  "danon": "yaourt",
  "danone": "yaourt",
  "djaj": "poulet",
  "l7em": "viande",
  "7out": "poisson"
};

fs.writeFileSync(path.join(dstDir, 'products.json'), JSON.stringify({products: allProducts}, null, 2));
fs.writeFileSync(path.join(dstDir, 'brands.json'), JSON.stringify({brands}, null, 2));
fs.writeFileSync(path.join(aliasesDir, 'aliases.json'), JSON.stringify({aliases}, null, 2));

console.log("DB generated!");
