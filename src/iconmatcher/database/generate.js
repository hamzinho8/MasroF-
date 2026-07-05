import fs from 'fs';
import path from 'path';

const objects = [
  // 1-50: Dairy & Essentials
  {
    "id": "milk_carton",
    "name_fr": "Brique de lait",
    "name_ar": "علبة حليب",
    "name_en": "Milk carton",
    "keywords": ["lait", "milk", "brique", "centrale", "jaouda", "safia", "حليب"],
    "category": "Nourriture",
    "icon": "Milk"
  },
  {
    "id": "yogurt_cup",
    "name_fr": "Pot de yaourt",
    "name_ar": "كوب زبادي",
    "name_en": "Yogurt cup",
    "keywords": ["yaourt", "yogurt", "danone", "chergui", "yawmi", "assil", "يغورت", "ياغورت", "زبادي", "دانون"],
    "category": "Nourriture",
    "icon": "Milk"
  },
  {
    "id": "yogurt_drinkable",
    "name_fr": "Yaourt à boire",
    "name_ar": "ياغورت للشرب",
    "name_en": "Drinkable yogurt",
    "keywords": ["raibi", "jamila", "raibi jamila", "yoplait", "raybi", "رايبي", "جميلة"],
    "category": "Nourriture",
    "icon": "CupSoda"
  },
  {
    "id": "cheese_triangle",
    "name_fr": "Fromage triangle",
    "name_ar": "جبن مثلث",
    "name_en": "Triangle cheese",
    "keywords": ["fromage", "cheese", "vache qui rit", "kiri", "coeur de lait", "فرماج", "جبن", "لافاش كيري"],
    "category": "Nourriture",
    "icon": "Pizza"
  },
  {
    "id": "cheese_slice",
    "name_fr": "Fromage en tranche",
    "name_ar": "شرائح الجبن",
    "name_en": "Cheese slice",
    "keywords": ["fromage sandwich", "slice", "tranche", "croque monsieur", "فرماج ساندويتش"],
    "category": "Nourriture",
    "icon": "Square"
  },
  {
    "id": "butter",
    "name_fr": "Beurre",
    "name_ar": "زبدة",
    "name_en": "Butter",
    "keywords": ["beurre", "butter", "margerine", "familia", "jibal", "زبدة", "مارغارين"],
    "category": "Nourriture",
    "icon": "Box"
  },
  {
    "id": "egg",
    "name_fr": "Oeuf",
    "name_ar": "بيضة",
    "name_en": "Egg",
    "keywords": ["oeuf", "egg", "plateau oeuf", "بيض", "بيضة"],
    "category": "Nourriture",
    "icon": "Egg"
  },
  {
    "id": "water_bottle",
    "name_fr": "Bouteille d'eau",
    "name_ar": "قارورة ماء",
    "name_en": "Water bottle",
    "keywords": ["eau", "water", "bouteille", "sidi ali", "ain atlas", "ain saiss", "bahia", "ciel", "ماء", "قنينة"],
    "category": "Nourriture",
    "icon": "GlassWater"
  },
  {
    "id": "water_large",
    "name_fr": "Bidon d'eau",
    "name_ar": "بيدون ماء",
    "name_en": "Large water bottle",
    "keywords": ["bidon eau", "5L", "ain ifrane", "ماء 5 لتر", "بيدون"],
    "category": "Nourriture",
    "icon": "Droplets"
  },
  {
    "id": "juice_carton",
    "name_fr": "Jus en brique",
    "name_ar": "عصير علبة",
    "name_en": "Juice carton",
    "keywords": ["jus", "juice", "orange", "pomme", "al bstane", "miami", "valencia", "عصير", "بستان"],
    "category": "Nourriture",
    "icon": "CupSoda"
  },
  {
    "id": "soda_can",
    "name_fr": "Canette de soda",
    "name_ar": "علبة مشروب غازي",
    "name_en": "Soda can",
    "keywords": ["soda", "canette", "hawaii", "pomms", "coca cola", "pepsi", "sprite", "fanta", "مشروب", "كانيط", "هواي", "بومس"],
    "category": "Nourriture",
    "icon": "Beer"
  },
  {
    "id": "coffee_pack",
    "name_fr": "Paquet de café",
    "name_ar": "علبة قهوة",
    "name_en": "Coffee pack",
    "keywords": ["café", "coffee", "dubois", "samar", "astor", "lavazza", "قهوة", "سمر"],
    "category": "Nourriture",
    "icon": "Coffee"
  },
  {
    "id": "nescafe",
    "name_fr": "Café soluble",
    "name_ar": "قهوة سريعة الذوبان",
    "name_en": "Instant coffee",
    "keywords": ["nescafe", "soluble", "instant", "نيسكافي"],
    "category": "Nourriture",
    "icon": "Coffee"
  },
  {
    "id": "tea_box",
    "name_fr": "Boîte de thé",
    "name_ar": "علبة شاي",
    "name_en": "Tea box",
    "keywords": ["thé", "tea", "atay", "sultan", "belaarbi", "lion", "شاي", "اتاي", "سلطان", "السبع"],
    "category": "Nourriture",
    "icon": "Leaf"
  },
  {
    "id": "bread",
    "name_fr": "Pain",
    "name_ar": "خبز",
    "name_en": "Bread",
    "keywords": ["pain", "bread", "khobz", "batbout", "خبز", "بطبوط"],
    "category": "Nourriture",
    "icon": "Wheat"
  },
  {
    "id": "baguette",
    "name_fr": "Baguette",
    "name_ar": "باغيت",
    "name_en": "Baguette",
    "keywords": ["baguette", "pain", "parisien", "خبز", "كومير"],
    "category": "Nourriture",
    "icon": "Wheat"
  },
  {
    "id": "croissant",
    "name_fr": "Croissant",
    "name_ar": "كرواسون",
    "name_en": "Croissant",
    "keywords": ["croissant", "petit pain", "viennoiserie", "كرواصة", "بتي بان"],
    "category": "Nourriture",
    "icon": "Croissant"
  },
  {
    "id": "cake",
    "name_fr": "Gâteau",
    "name_ar": "كيك",
    "name_en": "Cake",
    "keywords": ["gâteau", "cake", "tart", "millefeuille", "كيك", "ميلفاي", "حلوى"],
    "category": "Nourriture",
    "icon": "Cake"
  },
  {
    "id": "cookie_pack",
    "name_fr": "Paquet de biscuits",
    "name_ar": "بسكويت",
    "name_en": "Cookie pack",
    "keywords": ["biscuit", "cookie", "bimo", "tonik", "eyo", "merendina", "sabli", "بسكويت", "صابلي", "بيمو", "ميريندينا"],
    "category": "Nourriture",
    "icon": "Cookie"
  },
  {
    "id": "chocolate_bar",
    "name_fr": "Tablette de chocolat",
    "name_ar": "شوكولاتة",
    "name_en": "Chocolate bar",
    "keywords": ["chocolat", "chocolate", "maruja", "milka", "kinder", "شوكولا", "ماروخا"],
    "category": "Nourriture",
    "icon": "Candy"
  },
  {
    "id": "chips_bag",
    "name_fr": "Sachet de chips",
    "name_ar": "شيبس",
    "name_en": "Chips bag",
    "keywords": ["chips", "snack", "lays", "pringles", "bugles", "شيبس", "بطاطس"],
    "category": "Nourriture",
    "icon": "Fries"
  },
  {
    "id": "rice_bag",
    "name_fr": "Sac de riz",
    "name_ar": "كيس أرز",
    "name_en": "Rice bag",
    "keywords": ["riz", "rice", "arroz", "cigogne", "أرز", "روز", "الروز"],
    "category": "Nourriture",
    "icon": "Wheat"
  },
  {
    "id": "pasta_pack",
    "name_fr": "Paquet de pâtes",
    "name_ar": "معكرونة",
    "name_en": "Pasta pack",
    "keywords": ["pâtes", "pasta", "spaghetti", "macaroni", "tria", "dari", "معكرونة", "ليباط", "سباكيتي", "تريا"],
    "category": "Nourriture",
    "icon": "Wheat"
  },
  {
    "id": "couscous_pack",
    "name_fr": "Paquet de couscous",
    "name_ar": "كسكس",
    "name_en": "Couscous pack",
    "keywords": ["couscous", "dari", "tria", "كسكس", "كسكسو", "داري"],
    "category": "Nourriture",
    "icon": "CookingPot"
  },
  {
    "id": "flour_bag",
    "name_fr": "Sac de farine",
    "name_ar": "كيس دقيق",
    "name_en": "Flour bag",
    "keywords": ["farine", "flour", "fino", "smida", "دقيق", "طحين", "فينو", "سميدة"],
    "category": "Nourriture",
    "icon": "Wheat"
  },
  {
    "id": "oil_bottle",
    "name_fr": "Bouteille d'huile",
    "name_ar": "قارورة زيت",
    "name_en": "Oil bottle",
    "keywords": ["huile", "oil", "lesieur", "olio", "زيت", "لوسيور"],
    "category": "Nourriture",
    "icon": "Droplets"
  },
  {
    "id": "olive_oil",
    "name_fr": "Huile d'olive",
    "name_ar": "زيت زيتون",
    "name_en": "Olive oil",
    "keywords": ["huile d'olive", "olive oil", "oued souss", "زيت العود", "زيت زيتون"],
    "category": "Nourriture",
    "icon": "Droplet"
  },
  {
    "id": "sugar_box",
    "name_fr": "Boîte de sucre",
    "name_ar": "سكر",
    "name_en": "Sugar box",
    "keywords": ["sucre", "sugar", "cosumar", "glace", "morceaux", "سكر", "سنيدة", "كوزومار"],
    "category": "Nourriture",
    "icon": "Cuboid"
  },
  {
    "id": "sugar_loaf",
    "name_fr": "Pain de sucre",
    "name_ar": "قالب سكر",
    "name_en": "Sugar loaf",
    "keywords": ["pain de sucre", "qaleb", "سكر قالب", "قالب"],
    "category": "Nourriture",
    "icon": "Cone"
  },
  {
    "id": "salt",
    "name_fr": "Sel",
    "name_ar": "ملح",
    "name_en": "Salt",
    "keywords": ["sel", "salt", "ملح", "ملحة"],
    "category": "Nourriture",
    "icon": "GlassWater"
  },
  {
    "id": "spice_jar",
    "name_fr": "Pot d'épices",
    "name_ar": "توابل",
    "name_en": "Spice jar",
    "keywords": ["épices", "spice", "poivre", "cumin", "curcuma", "توابل", "عطرية", "ابزار", "كمون"],
    "category": "Nourriture",
    "icon": "Flame"
  },
  {
    "id": "tomato_paste",
    "name_fr": "Concentré de tomate",
    "name_ar": "طماطم مصبرة",
    "name_en": "Tomato paste",
    "keywords": ["tomate", "concentré", "aicha", "طماطم", "مطيشة الحك", "عائشة"],
    "category": "Nourriture",
    "icon": "Circle"
  },
  {
    "id": "jam_jar",
    "name_fr": "Pot de confiture",
    "name_ar": "مربى",
    "name_en": "Jam jar",
    "keywords": ["confiture", "jam", "aicha", "مربى", "كونفيتير", "عائشة"],
    "category": "Nourriture",
    "icon": "Cherry"
  },
  {
    "id": "honey_jar",
    "name_fr": "Pot de miel",
    "name_ar": "عسل",
    "name_en": "Honey jar",
    "keywords": ["miel", "honey", "عسل", "عسيلة"],
    "category": "Nourriture",
    "icon": "Hexagon"
  },
  {
    "id": "ketchup",
    "name_fr": "Ketchup",
    "name_ar": "كاتشب",
    "name_en": "Ketchup",
    "keywords": ["ketchup", "heinz", "star", "كاتشب"],
    "category": "Nourriture",
    "icon": "Bottle"
  },
  {
    "id": "mayonnaise",
    "name_fr": "Mayonnaise",
    "name_ar": "مايونيز",
    "name_en": "Mayonnaise",
    "keywords": ["mayonnaise", "lesieur", "مايونيز"],
    "category": "Nourriture",
    "icon": "Egg"
  },
  {
    "id": "mustard",
    "name_fr": "Moutarde",
    "name_ar": "خردل",
    "name_en": "Mustard",
    "keywords": ["moutarde", "mustard", "موطارد", "خردل"],
    "category": "Nourriture",
    "icon": "Flame"
  },
  {
    "id": "vinegar",
    "name_fr": "Vinaigre",
    "name_ar": "خل",
    "name_en": "Vinegar",
    "keywords": ["vinaigre", "vinegar", "خل"],
    "category": "Nourriture",
    "icon": "TestTube"
  },
  {
    "id": "canned_tuna",
    "name_fr": "Boîte de thon",
    "name_ar": "تونة",
    "name_en": "Canned tuna",
    "keywords": ["thon", "tuna", "mario", "joly", "isabel", "طون", "تونة"],
    "category": "Nourriture",
    "icon": "Fish"
  },
  {
    "id": "canned_sardines",
    "name_fr": "Boîte de sardines",
    "name_ar": "سردين",
    "name_en": "Canned sardines",
    "keywords": ["sardine", "mido", "سردين", "معلب"],
    "category": "Nourriture",
    "icon": "Fish"
  },
  {
    "id": "meat",
    "name_fr": "Viande",
    "name_ar": "لحم",
    "name_en": "Meat",
    "keywords": ["viande", "meat", "beef", "لحم", "بكري", "غنمي"],
    "category": "Nourriture",
    "icon": "Beef"
  },
  {
    "id": "chicken",
    "name_fr": "Poulet",
    "name_ar": "دجاج",
    "name_en": "Chicken",
    "keywords": ["poulet", "chicken", "djaj", "دجاج", "دجاجة"],
    "category": "Nourriture",
    "icon": "Drumstick"
  },
  {
    "id": "minced_meat",
    "name_fr": "Viande hachée",
    "name_ar": "كفتة",
    "name_en": "Minced meat",
    "keywords": ["viande hachée", "kefta", "كفتة"],
    "category": "Nourriture",
    "icon": "Beef"
  },
  {
    "id": "sausage",
    "name_fr": "Saucisse",
    "name_ar": "نقانق",
    "name_en": "Sausage",
    "keywords": ["saucisse", "saucisson", "merguez", "kashir", "صوليص", "كاشير", "نقانق"],
    "category": "Nourriture",
    "icon": "HotDog"
  },
  {
    "id": "fish_fresh",
    "name_fr": "Poisson frais",
    "name_ar": "سمك طازج",
    "name_en": "Fresh fish",
    "keywords": ["poisson", "fish", "merlan", "sole", "سمك", "حوت", "ميرلان"],
    "category": "Nourriture",
    "icon": "Fish"
  },
  {
    "id": "vegetables",
    "name_fr": "Légumes",
    "name_ar": "خضار",
    "name_en": "Vegetables",
    "keywords": ["légumes", "vegetables", "khodra", "خضرة", "خضار"],
    "category": "Nourriture",
    "icon": "Carrot"
  },
  {
    "id": "fruits",
    "name_fr": "Fruits",
    "name_ar": "فواكه",
    "name_en": "Fruits",
    "keywords": ["fruits", "disser", "فاكهة", "ديسير", "فواكه"],
    "category": "Nourriture",
    "icon": "Apple"
  },
  {
    "id": "onion",
    "name_fr": "Oignon",
    "name_ar": "بصل",
    "name_en": "Onion",
    "keywords": ["oignon", "basla", "بصل", "بصلة"],
    "category": "Nourriture",
    "icon": "Circle"
  },
  {
    "id": "potato",
    "name_fr": "Pomme de terre",
    "name_ar": "بطاطس",
    "name_en": "Potato",
    "keywords": ["pomme de terre", "batata", "بطاطس", "بطاطا"],
    "category": "Nourriture",
    "icon": "Circle"
  },
  {
    "id": "tomato",
    "name_fr": "Tomate",
    "name_ar": "طماطم",
    "name_en": "Tomato",
    "keywords": ["tomate", "maticha", "طماطم", "مطيشة"],
    "category": "Nourriture",
    "icon": "Apple"
  },
  {
    "id": "garlic",
    "name_fr": "Ail",
    "name_ar": "ثوم",
    "name_en": "Garlic",
    "keywords": ["ail", "touma", "ثوم", "تومة"],
    "category": "Nourriture",
    "icon": "Droplet"
  },
  {
    "id": "mint",
    "name_fr": "Menthe",
    "name_ar": "نعناع",
    "name_en": "Mint",
    "keywords": ["menthe", "na3na3", "نعناع"],
    "category": "Nourriture",
    "icon": "Leaf"
  },
  {
    "id": "olive",
    "name_fr": "Olives",
    "name_ar": "زيتون",
    "name_en": "Olives",
    "keywords": ["olives", "zaitoun", "zitoon", "زيتون"],
    "category": "Nourriture",
    "icon": "Circle"
  },
  {
    "id": "dates",
    "name_fr": "Dattes",
    "name_ar": "تمر",
    "name_en": "Dates",
    "keywords": ["dattes", "tmar", "medjool", "تمر"],
    "category": "Nourriture",
    "icon": "Nut"
  },
  {
    "id": "almonds",
    "name_fr": "Amandes",
    "name_ar": "لوز",
    "name_en": "Almonds",
    "keywords": ["amandes", "louz", "لوز"],
    "category": "Nourriture",
    "icon": "Nut"
  },
  {
    "id": "walnuts",
    "name_fr": "Noix",
    "name_ar": "جوز",
    "name_en": "Walnuts",
    "keywords": ["noix", "garga3", "جوز", "كركاع"],
    "category": "Nourriture",
    "icon": "Nut"
  },
  
  // Sanitaire & Hygiene
  {
    "id": "shampoo",
    "name_fr": "Shampooing",
    "name_ar": "شامبو",
    "name_en": "Shampoo",
    "keywords": ["shampooing", "shampoo", "champo", "cadum", "head and shoulders", "clear", "شامبو", "شامبوان"],
    "category": "Sanitaire",
    "icon": "Wind"
  },
  {
    "id": "shower_gel",
    "name_fr": "Gel douche",
    "name_ar": "جل استحمام",
    "name_en": "Shower gel",
    "keywords": ["gel douche", "ushuaia", "tahiti", "جل استحمام"],
    "category": "Sanitaire",
    "icon": "Droplet"
  },
  {
    "id": "soap_bar",
    "name_fr": "Savon",
    "name_ar": "صابون",
    "name_en": "Soap bar",
    "keywords": ["savon", "soap", "dove", "taous", "صابون", "طاووس", "دوف"],
    "category": "Sanitaire",
    "icon": "Box"
  },
  {
    "id": "black_soap",
    "name_fr": "Savon noir",
    "name_ar": "صابون بلدي",
    "name_en": "Black soap",
    "keywords": ["savon noir", "saboun beldi", "صابون بلدي"],
    "category": "Sanitaire",
    "icon": "Circle"
  },
  {
    "id": "toothpaste",
    "name_fr": "Dentifrice",
    "name_ar": "معجون أسنان",
    "name_en": "Toothpaste",
    "keywords": ["dentifrice", "signal", "colgate", "معجون أسنان", "سينيال"],
    "category": "Sanitaire",
    "icon": "Smile"
  },
  {
    "id": "toothbrush",
    "name_fr": "Brosse à dents",
    "name_ar": "فرشاة أسنان",
    "name_en": "Toothbrush",
    "keywords": ["brosse à dents", "toothbrush", "فرشاة أسنان", "شيتة سنان"],
    "category": "Sanitaire",
    "icon": "Brush"
  },
  {
    "id": "deodorant",
    "name_fr": "Déodorant",
    "name_ar": "مزيل عرق",
    "name_en": "Deodorant",
    "keywords": ["déodorant", "rexona", "axe", "nivea", "ديودوران", "مزيل عرق"],
    "category": "Sanitaire",
    "icon": "Wind"
  },
  {
    "id": "perfume",
    "name_fr": "Parfum",
    "name_ar": "عطر",
    "name_en": "Perfume",
    "keywords": ["parfum", "eau de toilette", "perfume", "riha", "عطر", "ريحة"],
    "category": "Sanitaire",
    "icon": "Sparkles"
  },
  {
    "id": "razor",
    "name_fr": "Rasoir",
    "name_ar": "شفرة حلاقة",
    "name_en": "Razor",
    "keywords": ["rasoir", "gillette", "bic", "شفرة", "ماكينة حلاقة"],
    "category": "Sanitaire",
    "icon": "Scissors"
  },
  {
    "id": "shaving_foam",
    "name_fr": "Mousse à raser",
    "name_ar": "رغوة حلاقة",
    "name_en": "Shaving foam",
    "keywords": ["mousse à raser", "mousse gillette", "رغوة", "موس حلاقة"],
    "category": "Sanitaire",
    "icon": "Cloud"
  },
  {
    "id": "sanitary_pads",
    "name_fr": "Serviettes hygiéniques",
    "name_ar": "فوط صحية",
    "name_en": "Sanitary pads",
    "keywords": ["serviette", "always", "nana", "mia", "فوط صحية", "اولويز"],
    "category": "Sanitaire",
    "icon": "Shield"
  },
  {
    "id": "baby_diapers",
    "name_fr": "Couches bébé",
    "name_ar": "حفاضات أطفال",
    "name_en": "Baby diapers",
    "keywords": ["couches", "pampers", "dodo", "huggies", "bampers", "حفاضات", "ليكوش", "بامبرز"],
    "category": "Sanitaire",
    "icon": "Baby"
  },
  {
    "id": "baby_wipes",
    "name_fr": "Lingettes bébé",
    "name_ar": "مناديل مبللة",
    "name_en": "Baby wipes",
    "keywords": ["lingettes", "wipes", "مناديل", "لينجيت"],
    "category": "Sanitaire",
    "icon": "Square"
  },
  {
    "id": "toilet_paper",
    "name_fr": "Papier toilette",
    "name_ar": "ورق تواليت",
    "name_en": "Toilet paper",
    "keywords": ["papier toilette", "papier hygiénique", "ورق تواليت", "بابي جينيك"],
    "category": "Sanitaire",
    "icon": "Scroll"
  },
  {
    "id": "tissues",
    "name_fr": "Mouchoirs",
    "name_ar": "مناديل ورقية",
    "name_en": "Tissues",
    "keywords": ["mouchoirs", "kleenex", "tempo", "مناديل", "كلينيكس"],
    "category": "Sanitaire",
    "icon": "Square"
  },
  {
    "id": "cotton_swab",
    "name_fr": "Coton tige",
    "name_ar": "قطن أذن",
    "name_en": "Cotton swab",
    "keywords": ["coton tige", "q-tips", "قطن", "كوطون تيج"],
    "category": "Sanitaire",
    "icon": "MoreHorizontal"
  },
  {
    "id": "detergent_powder",
    "name_fr": "Lessive en poudre",
    "name_ar": "مسحوق غسيل",
    "name_en": "Detergent powder",
    "keywords": ["lessive", "détergent", "omo", "tide", "ariel", "مسحوق", "تيد", "ارييل"],
    "category": "Sanitaire",
    "icon": "Shirt"
  },
  {
    "id": "detergent_liquid",
    "name_fr": "Lessive liquide",
    "name_ar": "سائل غسيل",
    "name_en": "Liquid detergent",
    "keywords": ["lessive liquide", "ariel liquide", "سائل غسيل"],
    "category": "Sanitaire",
    "icon": "Droplets"
  },
  {
    "id": "fabric_softener",
    "name_fr": "Adoucissant",
    "name_ar": "معطر ملابس",
    "name_en": "Fabric softener",
    "keywords": ["adoucissant", "soupline", "معطر", "سوبلين"],
    "category": "Sanitaire",
    "icon": "Feather"
  },
  {
    "id": "dish_soap",
    "name_fr": "Liquide vaisselle",
    "name_ar": "سائل غسيل الأواني",
    "name_en": "Dish soap",
    "keywords": ["liquide vaisselle", "fairy", "prill", "magix", "onyx", "غسيل", "صابون اواني", "فيري"],
    "category": "Sanitaire",
    "icon": "Sparkles"
  },
  {
    "id": "bleach",
    "name_fr": "Eau de Javel",
    "name_ar": "ماء جافيل",
    "name_en": "Bleach",
    "keywords": ["javel", "eau de javel", "la croix", "جافيل"],
    "category": "Sanitaire",
    "icon": "Droplet"
  },
  {
    "id": "floor_cleaner",
    "name_fr": "Nettoyant sol",
    "name_ar": "منظف أرضيات",
    "name_en": "Floor cleaner",
    "keywords": ["sanicrio", "sanicroix", "nettoyant sol", "سانيكروا", "منظف"],
    "category": "Sanitaire",
    "icon": "Sparkles"
  },
  {
    "id": "glass_cleaner",
    "name_fr": "Nettoyant vitres",
    "name_ar": "منظف زجاج",
    "name_en": "Glass cleaner",
    "keywords": ["lave vitre", "glassex", "منظف زجاج"],
    "category": "Sanitaire",
    "icon": "SprayCan"
  },
  {
    "id": "sponge",
    "name_fr": "Éponge",
    "name_ar": "إسفنجة",
    "name_en": "Sponge",
    "keywords": ["éponge", "jikes", "بونجة", "جيكس"],
    "category": "Sanitaire",
    "icon": "Square"
  },
  {
    "id": "trash_bags",
    "name_fr": "Sacs poubelle",
    "name_ar": "أكياس قمامة",
    "name_en": "Trash bags",
    "keywords": ["sacs poubelle", "mika", "أكياس", "ميكا", "زبل"],
    "category": "Sanitaire",
    "icon": "Trash2"
  },
  {
    "id": "insecticide",
    "name_fr": "Insecticide",
    "name_ar": "مبيد حشرات",
    "name_en": "Insecticide",
    "keywords": ["insecticide", "baygon", "pif paf", "مبيد", "بايغون"],
    "category": "Sanitaire",
    "icon": "Bug"
  },
  {
    "id": "medicine",
    "name_fr": "Médicament",
    "name_ar": "دواء",
    "name_en": "Medicine",
    "keywords": ["médicament", "doliprane", "aspégic", "dwa", "دواء", "فارماسيان"],
    "category": "Sanitaire",
    "icon": "Pill"
  },
  {
    "id": "pharmacy",
    "name_fr": "Pharmacie",
    "name_ar": "صيدلية",
    "name_en": "Pharmacy",
    "keywords": ["pharmacie", "ordonnance", "صيدلية", "فرماسيان"],
    "category": "Sanitaire",
    "icon": "Crosshair"
  },
  
  // Transports
  {
    "id": "gasoline",
    "name_fr": "Essence / Gasoil",
    "name_ar": "بنزين",
    "name_en": "Fuel",
    "keywords": ["gasoil", "essence", "mazout", "afriquia", "total", "shell", "بنزين", "مازوط", "ليصانص"],
    "category": "Transport",
    "icon": "Fuel"
  },
  {
    "id": "taxi_petit",
    "name_fr": "Petit Taxi",
    "name_ar": "طاكسي صغير",
    "name_en": "Small Taxi",
    "keywords": ["petit taxi", "taxi rouge", "taxi sghir", "طاكسي", "تاكسي صغير"],
    "category": "Transport",
    "icon": "CarTaxiFront"
  },
  {
    "id": "taxi_grand",
    "name_fr": "Grand Taxi",
    "name_ar": "طاكسي كبير",
    "name_en": "Grand Taxi",
    "keywords": ["grand taxi", "taxi blanc", "taxi kbir", "طاكسي كبير"],
    "category": "Transport",
    "icon": "Car"
  },
  {
    "id": "bus",
    "name_fr": "Bus",
    "name_ar": "حافلة",
    "name_en": "Bus",
    "keywords": ["bus", "alsa", "tobis", "طوبيس", "حافلة"],
    "category": "Transport",
    "icon": "Bus"
  },
  {
    "id": "tramway",
    "name_fr": "Tramway",
    "name_ar": "ترامواي",
    "name_en": "Tram",
    "keywords": ["tramway", "tram", "ترام", "طرامواي"],
    "category": "Transport",
    "icon": "TrainFront"
  },
  {
    "id": "train",
    "name_fr": "Train (ONCF)",
    "name_ar": "قطار",
    "name_en": "Train",
    "keywords": ["train", "oncf", "tgv", "alboraq", "قطار", "تران"],
    "category": "Transport",
    "icon": "Train"
  },
  {
    "id": "car_wash",
    "name_fr": "Lavage Auto",
    "name_ar": "غسيل سيارات",
    "name_en": "Car wash",
    "keywords": ["lavage", "lavage auto", "غسيل سيارات", "لافاج"],
    "category": "Transport",
    "icon": "Waves"
  },
  {
    "id": "parking",
    "name_fr": "Parking",
    "name_ar": "موقف سيارات",
    "name_en": "Parking",
    "keywords": ["parking", "barcking", "guardien", "موقف سيارات", "باركينك"],
    "category": "Transport",
    "icon": "ParkingSquare"
  },
  {
    "id": "toll_booth",
    "name_fr": "Péage",
    "name_ar": "محطة أداء",
    "name_en": "Toll booth",
    "keywords": ["péage", "autoroute", "jawaz", "محطة أداء", "لوطوروت"],
    "category": "Transport",
    "icon": "Ticket"
  },
  
  // Logement & Factures
  {
    "id": "gas_bottle",
    "name_fr": "Bouteille de gaz",
    "name_ar": "قنينة غاز",
    "name_en": "Gas cylinder",
    "keywords": ["gaz", "butagaz", "afriquia gaz", "بوطة", "غاز", "بوطاغاز", "بوطة كبيرة"],
    "category": "Logement",
    "icon": "Cylinder"
  },
  {
    "id": "electricity_bill",
    "name_fr": "Facture d'électricité",
    "name_ar": "فاتورة الكهرباء",
    "name_en": "Electricity bill",
    "keywords": ["électricité", "facture électricité", "amendis", "redal", "onee", "lydec", "ضو", "كهرباء"],
    "category": "Logement",
    "icon": "Zap"
  },
  {
    "id": "water_bill",
    "name_fr": "Facture d'eau",
    "name_ar": "فاتورة الماء",
    "name_en": "Water bill",
    "keywords": ["eau", "facture eau", "amendis", "redal", "onee", "lydec", "ماء", "فاتورة الماء"],
    "category": "Logement",
    "icon": "Droplet"
  },
  {
    "id": "internet_bill",
    "name_fr": "Facture Internet",
    "name_ar": "أنترنت",
    "name_en": "Internet bill",
    "keywords": ["internet", "wifi", "adsl", "fibre", "iam", "maroc telecom", "orange", "inwi", "أنترنت", "ويفي"],
    "category": "Logement",
    "icon": "Wifi"
  },
  {
    "id": "phone_recharge",
    "name_fr": "Recharge téléphonique",
    "name_ar": "تعبئة هاتف",
    "name_en": "Phone recharge",
    "keywords": ["recharge", "solde", "iam", "orange", "inwi", "تعبئة", "روشارج"],
    "category": "Logement",
    "icon": "Smartphone"
  },
  {
    "id": "rent",
    "name_fr": "Loyer",
    "name_ar": "كراء",
    "name_en": "Rent",
    "keywords": ["loyer", "kraya", "كراء", "كرا"],
    "category": "Logement",
    "icon": "Home"
  },
  {
    "id": "syndic",
    "name_fr": "Syndic",
    "name_ar": "سانديك",
    "name_en": "Syndic",
    "keywords": ["syndic", "سانديك"],
    "category": "Logement",
    "icon": "Building"
  },
  
  // Shopping & Bim/Marjane specifiques
  {
    "id": "clothing",
    "name_fr": "Vêtements",
    "name_ar": "ملابس",
    "name_en": "Clothing",
    "keywords": ["vêtement", "t-shirt", "pantalon", "lc waikiki", "defacto", "marwa", "ملابس", "حوايج"],
    "category": "Shopping",
    "icon": "Shirt"
  },
  {
    "id": "shoes",
    "name_fr": "Chaussures",
    "name_ar": "أحذية",
    "name_en": "Shoes",
    "keywords": ["chaussure", "basket", "espadrille", "sebbat", "أحذية", "صباط"],
    "category": "Shopping",
    "icon": "Footprints"
  },
  {
    "id": "electronics",
    "name_fr": "Électronique",
    "name_ar": "إلكترونيات",
    "name_en": "Electronics",
    "keywords": ["électronique", "téléphone", "tv", "electroplanet", "إلكترونيات", "تلفاز", "هاتف"],
    "category": "Shopping",
    "icon": "Tv"
  },
  {
    "id": "bim_products",
    "name_fr": "Produits Bim",
    "name_ar": "بيم",
    "name_en": "Bim products",
    "keywords": ["bim", "b.i.m", "بيم"],
    "category": "Shopping",
    "icon": "ShoppingCart"
  },
  {
    "id": "supermarket",
    "name_fr": "Supermarché",
    "name_ar": "سوبر ماركت",
    "name_en": "Supermarket",
    "keywords": ["marjane", "asswak assalam", "carrefour", "acima", "سوپر مارشي", "مرجان", "كارفور"],
    "category": "Shopping",
    "icon": "ShoppingBag"
  },
  {
    "id": "bakery",
    "name_fr": "Boulangerie",
    "name_ar": "مخبزة",
    "name_en": "Bakery",
    "keywords": ["boulangerie", "pâtisserie", "مخبزة", "باتيسري"],
    "category": "Nourriture",
    "icon": "Cake"
  },
  {
    "id": "butcher",
    "name_fr": "Boucherie",
    "name_ar": "جزار",
    "name_en": "Butcher",
    "keywords": ["boucherie", "gzar", "gazzar", "جزار", "كزار"],
    "category": "Nourriture",
    "icon": "Beef"
  },
  
  // Loisirs & Autres
  {
    "id": "cafe_terrasse",
    "name_fr": "Café (Sortie)",
    "name_ar": "مقهى",
    "name_en": "Cafe output",
    "keywords": ["café terrasse", "qahwa", "sortie café", "مقهى", "قهوة"],
    "category": "Loisirs",
    "icon": "Coffee"
  },
  {
    "id": "restaurant",
    "name_fr": "Restaurant",
    "name_ar": "مطعم",
    "name_en": "Restaurant",
    "keywords": ["restaurant", "mcdo", "kfc", "snack", "tacos", "pizza", "مطعم", "سناك", "طاكو"],
    "category": "Loisirs",
    "icon": "Utensils"
  },
  {
    "id": "cinema",
    "name_fr": "Cinéma",
    "name_ar": "سينما",
    "name_en": "Cinema",
    "keywords": ["cinéma", "megarama", "film", "سينما", "فيلم"],
    "category": "Loisirs",
    "icon": "Film"
  },
  {
    "id": "gym",
    "name_fr": "Salle de sport",
    "name_ar": "قاعة رياضة",
    "name_en": "Gym",
    "keywords": ["salle de sport", "club", "gym", "city club", "قاعة رياضة", "صال"],
    "category": "Loisirs",
    "icon": "Dumbbell"
  },
  {
    "id": "barber",
    "name_fr": "Coiffeur / Barbier",
    "name_ar": "حلاق",
    "name_en": "Barber",
    "keywords": ["coiffeur", "barbier", "hallaq", "حلاق"],
    "category": "Sanitaire",
    "icon": "Scissors"
  },
  {
    "id": "hammam",
    "name_fr": "Hammam",
    "name_ar": "حمام",
    "name_en": "Hammam",
    "keywords": ["hammam", "bain maure", "حمام"],
    "category": "Sanitaire",
    "icon": "Waves"
  },
  {
    "id": "cigarette",
    "name_fr": "Cigarette",
    "name_ar": "سجائر",
    "name_en": "Cigarette",
    "keywords": ["cigarette", "marlboro", "marquise", "winston", "camel", "سجائر", "كارو", "ماركيز"],
    "category": "Loisirs",
    "icon": "Cigarette"
  },
  {
    "id": "charity",
    "name_fr": "Aumône / Sadaqa",
    "name_ar": "صدقة",
    "name_en": "Charity",
    "keywords": ["sadaqa", "zakat", "aumône", "صدقة", "زكاة"],
    "category": "Autres",
    "icon": "Heart"
  },
  {
    "id": "tips",
    "name_fr": "Pourboire",
    "name_ar": "بقشيش",
    "name_en": "Tips",
    "keywords": ["pourboire", "kahwa", "gardien", "بقشيش", "قهوة"],
    "category": "Autres",
    "icon": "Coins"
  }
];

// Extend up to 100+ for the purpose, using more Bim/Marjane products:
const additionalObjects = [
  {
    "id": "bleach_colored", "name_fr": "Javel parfumé", "name_ar": "جافيل معطر", "name_en": "Scented bleach",
    "keywords": ["javel ace", "javel parfumé", "جافيل معطر"], "category": "Sanitaire", "icon": "Droplet"
  },
  {
    "id": "cleaning_sponge", "name_fr": "Gratte-éponge", "name_ar": "جيكس", "name_en": "Scrub sponge",
    "keywords": ["spontex", "éponge gratte", "جيكس"], "category": "Sanitaire", "icon": "Square"
  },
  {
    "id": "plastic_wrap", "name_fr": "Film alimentaire", "name_ar": "سلوفان", "name_en": "Plastic wrap",
    "keywords": ["film", "cellophane", "slofane", "سلوفان"], "category": "Sanitaire", "icon": "Package"
  },
  {
    "id": "alum_foil", "name_fr": "Papier aluminium", "name_ar": "ألمنيوم", "name_en": "Aluminum foil",
    "keywords": ["aluminium", "papier alu", "المنيوم"], "category": "Sanitaire", "icon": "Package"
  },
  {
    "id": "trash_bin", "name_fr": "Poubelle", "name_ar": "سلة مهملات", "name_en": "Trash bin",
    "keywords": ["poubelle", "سلة مهملات", "طرو زبل"], "category": "Logement", "icon": "Trash2"
  },
  {
    "id": "lightbulb", "name_fr": "Ampoule", "name_ar": "مصباح", "name_en": "Lightbulb",
    "keywords": ["ampoule", "lamp", "bola", "مصباح", "بولة"], "category": "Logement", "icon": "Lightbulb"
  },
  {
    "id": "battery", "name_fr": "Piles", "name_ar": "بطاريات", "name_en": "Batteries",
    "keywords": ["piles", "battery", "hjar", "بطاريات", "حجر"], "category": "Logement", "icon": "Battery"
  },
  {
    "id": "matches", "name_fr": "Allumettes", "name_ar": "كبريت", "name_en": "Matches",
    "keywords": ["allumettes", "waqid", "كبريت", "وقيد"], "category": "Logement", "icon": "Flame"
  },
  {
    "id": "lighters", "name_fr": "Briquet", "name_ar": "ولاعة", "name_en": "Lighter",
    "keywords": ["briquet", "brika", "ولاعة", "بريكة"], "category": "Loisirs", "icon": "Flame"
  },
  {
    "id": "dates_paste", "name_fr": "Pâte de dattes", "name_ar": "عجينة التمر", "name_en": "Dates paste",
    "keywords": ["pâte de datte", "عجينة التمر"], "category": "Nourriture", "icon": "Box"
  },
  {
    "id": "margarine", "name_fr": "Margarine", "name_ar": "مارغرين", "name_en": "Margarine",
    "keywords": ["magarine", "lilia", "مارغرين", "ليليا"], "category": "Nourriture", "icon": "Box"
  },
  {
    "id": "cereal", "name_fr": "Céréales", "name_ar": "حبوب", "name_en": "Cereal",
    "keywords": ["céréales", "kelloggs", "chocapic", "حبوب", "سيريال"], "category": "Nourriture", "icon": "Wheat"
  },
  {
    "id": "chocolat_powder", "name_fr": "Chocolat en poudre", "name_ar": "كاكاو", "name_en": "Chocolate powder",
    "keywords": ["chocolat poudre", "caobel", "nesquik", "كاكاو", "كاوبيل"], "category": "Nourriture", "icon": "Coffee"
  },
  {
    "id": "syrup", "name_fr": "Sirop", "name_ar": "سيرو", "name_en": "Syrup",
    "keywords": ["sirop", "grenadine", "menthe", "سيرو"], "category": "Nourriture", "icon": "Bottle"
  },
  {
    "id": "water_sparkling", "name_fr": "Eau gazeuse", "name_ar": "ماء غازي", "name_en": "Sparkling water",
    "keywords": ["eau gazeuse", "oulmes", "ain atlas", "ماء غازي", "والماس"], "category": "Nourriture", "icon": "GlassWater"
  },
  {
    "id": "harissa", "name_fr": "Harissa", "name_ar": "هريسة", "name_en": "Harissa",
    "keywords": ["harissa", "piment", "هريسة"], "category": "Nourriture", "icon": "Flame"
  },
  {
    "id": "cumin", "name_fr": "Cumin", "name_ar": "كمون", "name_en": "Cumin",
    "keywords": ["cumin", "kamoun", "كمون"], "category": "Nourriture", "icon": "Circle"
  },
  {
    "id": "pepper", "name_fr": "Poivre", "name_ar": "فلفل أسود", "name_en": "Pepper",
    "keywords": ["poivre", "ibzar", "فلفل أسود", "ابزار"], "category": "Nourriture", "icon": "Circle"
  },
  {
    "id": "ginger", "name_fr": "Gingembre", "name_ar": "زنجبيل", "name_en": "Ginger",
    "keywords": ["gingembre", "skinjbir", "زنجبيل", "سكينجبير"], "category": "Nourriture", "icon": "Circle"
  },
  {
    "id": "curcuma", "name_fr": "Curcuma", "name_ar": "كركم", "name_en": "Curcuma",
    "keywords": ["curcuma", "kharkoum", "كركم", "خرقوم"], "category": "Nourriture", "icon": "Circle"
  },
  {
    "id": "canned_corn", "name_fr": "Maïs en conserve", "name_ar": "ذرة معلبة", "name_en": "Canned corn",
    "keywords": ["maïs", "corn", "ذرة", "ماييس"], "category": "Nourriture", "icon": "Circle"
  },
  {
    "id": "canned_peas", "name_fr": "Petits pois en conserve", "name_ar": "بازلاء", "name_en": "Canned peas",
    "keywords": ["petits pois", "jelbana", "بازلاء", "جلبانة"], "category": "Nourriture", "icon": "Circle"
  },
  {
    "id": "lentils", "name_fr": "Lentilles", "name_ar": "عدس", "name_en": "Lentils",
    "keywords": ["lentilles", "3dess", "عدس"], "category": "Nourriture", "icon": "Circle"
  },
  {
    "id": "chickpeas", "name_fr": "Pois chiches", "name_ar": "حمص", "name_en": "Chickpeas",
    "keywords": ["pois chiches", "hommos", "حمص"], "category": "Nourriture", "icon": "Circle"
  },
  {
    "id": "beans", "name_fr": "Haricots", "name_ar": "فاصوليا", "name_en": "Beans",
    "keywords": ["haricots", "loubia", "فاصوليا", "لوبيا"], "category": "Nourriture", "icon": "Circle"
  },
  {
    "id": "beef_meat", "name_fr": "Viande de bœuf", "name_ar": "لحم بقر", "name_en": "Beef meat",
    "keywords": ["bœuf", "bagri", "لحم بقر", "بكري"], "category": "Nourriture", "icon": "Beef"
  },
  {
    "id": "lamb_meat", "name_fr": "Viande d'agneau", "name_ar": "لحم غنم", "name_en": "Lamb meat",
    "keywords": ["agneau", "rhanmi", "لحم غنم", "غنمي"], "category": "Nourriture", "icon": "Beef"
  },
  {
    "id": "turkey_meat", "name_fr": "Dinde", "name_ar": "ديك رومي", "name_en": "Turkey meat",
    "keywords": ["dinde", "ladand", "بيبى", "لاداند"], "category": "Nourriture", "icon": "Drumstick"
  },
  {
    "id": "mortadella", "name_fr": "Mortadelle", "name_ar": "كاشير", "name_en": "Mortadella",
    "keywords": ["mortadelle", "kashir", "كاشير", "مورتاديلا"], "category": "Nourriture", "icon": "Circle"
  },
  {
    "id": "icecream", "name_fr": "Glace", "name_ar": "مثلجات", "name_en": "Ice cream",
    "keywords": ["glace", "ice cream", "magnum", "polo", "مثلجات", "كلاص"], "category": "Nourriture", "icon": "Popsicle"
  },
  {
    "id": "candies", "name_fr": "Bonbons", "name_ar": "حلوى", "name_en": "Candies",
    "keywords": ["bonbons", "halwa", "fanid", "حلوى", "فنيد"], "category": "Nourriture", "icon": "Candy"
  },
  {
    "id": "chewing_gum", "name_fr": "Chewing-gum", "name_ar": "علكة", "name_en": "Chewing gum",
    "keywords": ["chewing-gum", "meska", "hollywood", "علكة", "مسكة"], "category": "Nourriture", "icon": "Smile"
  },
  {
    "id": "chips_pringles", "name_fr": "Pringles", "name_ar": "برينجلز", "name_en": "Pringles",
    "keywords": ["pringles", "برينجلز"], "category": "Nourriture", "icon": "Cylinder"
  },
  {
    "id": "energy_drink", "name_fr": "Boisson énergisante", "name_ar": "مشروب طاقة", "name_en": "Energy drink",
    "keywords": ["redbull", "boisson énergie", "red bull", "ريد بول", "مشروب طاقة"], "category": "Nourriture", "icon": "Zap"
  },
  {
    "id": "hair_gel", "name_fr": "Gel coiffant", "name_ar": "جل شعر", "name_en": "Hair gel",
    "keywords": ["gel", "hair", "جل شعر", "جيل"], "category": "Sanitaire", "icon": "Wind"
  },
  {
    "id": "body_lotion", "name_fr": "Crème corps", "name_ar": "كريم جسم", "name_en": "Body lotion",
    "keywords": ["lotion", "crème", "nivea", "كريم", "بومادا"], "category": "Sanitaire", "icon": "Droplet"
  },
  {
    "id": "diapers", "name_fr": "Couches", "name_ar": "حفاظات", "name_en": "Diapers",
    "keywords": ["couches", "ليكوش"], "category": "Sanitaire", "icon": "Baby"
  },
  {
    "id": "notebook", "name_fr": "Cahier", "name_ar": "دفتر", "name_en": "Notebook",
    "keywords": ["cahier", "daftar", "دفتر"], "category": "Devoir", "icon": "Book"
  },
  {
    "id": "pens", "name_fr": "Stylos", "name_ar": "أقلام", "name_en": "Pens",
    "keywords": ["stylo", "bic", "pen", "ستيلو", "أقلام"], "category": "Devoir", "icon": "Pen"
  },
  {
    "id": "school_bag", "name_fr": "Cartable", "name_ar": "محفظة", "name_en": "School bag",
    "keywords": ["cartable", "shkara", "محفظة", "شكارة"], "category": "Devoir", "icon": "Briefcase"
  },
  {
    "id": "books", "name_fr": "Livres", "name_ar": "كتب", "name_en": "Books",
    "keywords": ["livre", "ktab", "كتب", "كتاب"], "category": "Devoir", "icon": "BookOpen"
  },
  {
    "id": "school_supplies", "name_fr": "Fournitures scolaires", "name_ar": "أدوات مدرسية", "name_en": "School supplies",
    "keywords": ["fournitures", "scolaires", "أدوات", "مدرسية"], "category": "Devoir", "icon": "Ruler"
  },
  {
    "id": "toys", "name_fr": "Jouets", "name_ar": "ألعاب", "name_en": "Toys",
    "keywords": ["jouet", "lo3ba", "ألعاب", "لعبة"], "category": "Loisirs", "icon": "Puzzle"
  },
  {
    "id": "games", "name_fr": "Jeux vidéos", "name_ar": "ألعاب فيديو", "name_en": "Video games",
    "keywords": ["jeux", "playstation", "ألعاب", "بلايستيشن"], "category": "Loisirs", "icon": "Gamepad"
  },
  {
    "id": "sport_equipment", "name_fr": "Equipement sport", "name_ar": "معدات رياضية", "name_en": "Sport equipment",
    "keywords": ["sport", "ballon", "koora", "كرة", "رياضة"], "category": "Loisirs", "icon": "Dumbbell"
  },
  {
    "id": "plants", "name_fr": "Plantes", "name_ar": "نباتات", "name_en": "Plants",
    "keywords": ["plante", "fleur", "wrad", "نبات", "ورد", "محبق"], "category": "Logement", "icon": "Flower"
  },
  {
    "id": "home_decor", "name_fr": "Décoration", "name_ar": "ديكور", "name_en": "Home decor",
    "keywords": ["décor", "tableau", "dikor", "ديكور"], "category": "Logement", "icon": "Image"
  },
  {
    "id": "furniture", "name_fr": "Meubles", "name_ar": "أثاث", "name_en": "Furniture",
    "keywords": ["meuble", "canape", "salon", "أثاث", "صالون"], "category": "Logement", "icon": "Armchair"
  },
  {
    "id": "hardware", "name_fr": "Bricolage", "name_ar": "أدوات بناء", "name_en": "Hardware",
    "keywords": ["bricolage", "droguerie", "مسامير", "بريكولاج", "دروكري"], "category": "Logement", "icon": "Wrench"
  },
  {
    "id": "car_maintenance", "name_fr": "Entretien voiture", "name_ar": "صيانة سيارة", "name_en": "Car maintenance",
    "keywords": ["vidange", "pneu", "pieces auto", "صيانة", "طوموبيل"], "category": "Transport", "icon": "Wrench"
  },
  {
    "id": "doctor", "name_fr": "Médecin", "name_ar": "طبيب", "name_en": "Doctor",
    "keywords": ["médecin", "docteur", "visite", "طبيب", "دكتور"], "category": "Sanitaire", "icon": "Stethoscope"
  },
  {
    "id": "hospital", "name_fr": "Hôpital / Clinique", "name_ar": "مستشفى", "name_en": "Hospital",
    "keywords": ["hôpital", "clinique", "sbitar", "مستشفى", "سبيطار"], "category": "Sanitaire", "icon": "Hospital"
  },
  {
    "id": "gift", "name_fr": "Cadeau", "name_ar": "هدية", "name_en": "Gift",
    "keywords": ["cadeau", "kado", "هدية", "كادو"], "category": "Autres", "icon": "Gift"
  },
  {
    "id": "donation", "name_fr": "Donation", "name_ar": "تبرع", "name_en": "Donation",
    "keywords": ["don", "mousa3ada", "تبرع", "مساعدة"], "category": "Autres", "icon": "HeartHandshake"
  },
  {
    "id": "pet_food", "name_fr": "Nourriture animaux", "name_ar": "أكل حيوانات", "name_en": "Pet food",
    "keywords": ["croquettes", "chat", "chien", "mackla", "أكل قطط", "كلب"], "category": "Autres", "icon": "Dog"
  },
  {
    "id": "taxes", "name_fr": "Taxes", "name_ar": "ضرائب", "name_en": "Taxes",
    "keywords": ["taxe", "dariba", "impôt", "ضريبة"], "category": "Logement", "icon": "Briefcase"
  },
  {
    "id": "insurance", "name_fr": "Assurance", "name_ar": "تأمين", "name_en": "Insurance",
    "keywords": ["assurance", "lassurance", "تأمين", "لاسيرانس"], "category": "Logement", "icon": "ShieldCheck"
  }
];


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
  { id: "chbakia_ma", name_fr: "Chebakia", name_ar: "شباكية", name_en: "Chebakia", keywords: ["chbakia", "chebakia", "mkhar9a", "شباكية"], category: "Gourmandises", icon: "ChebakiaIcon" },

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
  { id: "jellaba_ma", name_fr: "Jellaba", name_ar: "جلابة", name_en: "Djellaba", keywords: ["jellaba", "djellaba", "جلابة"], category: "Shopping", icon: "JellabaIcon" },
  { id: "balgha_ma", name_fr: "Balgha", name_ar: "بلغة", name_en: "Slippers", keywords: ["balgha", "belgha", "بلغة"], category: "Shopping", icon: "BalghaIcon" },
  { id: "hwayj_ma", name_fr: "Vêtements (Hwayj)", name_ar: "حوايج", name_en: "Clothes", keywords: ["hwayj", "hwayej", "vetements", "حوايج", "ملابس"], category: "Shopping", icon: "Shirt" },
  { id: "sbat_ma", name_fr: "Chaussures (Sbat)", name_ar: "صباط", name_en: "Shoes", keywords: ["sbat", "sebbat", "chaussures", "صباط", "حذاء"], category: "Shopping", icon: "Footprints" },
  { id: "serwal_ma", name_fr: "Pantalon (Serwal)", name_ar: "سروال", name_en: "Pants", keywords: ["serwal", "pantalon", "سروال"], category: "Shopping", icon: "Shirt" },

  // Transportation
  { id: "tobis_ma", name_fr: "Bus (Tobis)", name_ar: "طوبيس", name_en: "Bus", keywords: ["tobis", "bus", "طوبيس", "حافلة"], category: "Transport", icon: "Bus" },
  { id: "taxi_ma", name_fr: "Taxi", name_ar: "طاكسي", name_en: "Taxi", keywords: ["taxi", "petit taxi", "grand taxi", "طاكسي"], category: "Transport", icon: "Car" }
];


const moroccanObjects2 = [
  // Bread & Breakfast
  { id: "khobz_ma", name_fr: "Pain (Khobz)", name_ar: "خبز", name_en: "Bread", keywords: ["khobz", "pain", "خبز"], category: "Essentiel", icon: "Croissant" },
  { id: "harcha_ma", name_fr: "Harcha", name_ar: "حرشة", name_en: "Harcha", keywords: ["harcha", "7archa", "حرشة"], category: "Essentiel", icon: "GhoribaIcon" },
  { id: "batbout_ma", name_fr: "Batbout", name_ar: "بطبوط", name_en: "Batbout", keywords: ["batbout", "mkhamer", "بطبوط", "مخمار"], category: "Essentiel", icon: "MsemenIcon" },
  { id: "msemen_ma", name_fr: "Msemen", name_ar: "مسمن", name_en: "Msemen", keywords: ["msemen", "rghayef", "مسمن", "رغايف"], category: "Essentiel", icon: "MsemenIcon" },
  { id: "baghrir_ma", name_fr: "Baghrir", name_ar: "بغرير", name_en: "Baghrir", keywords: ["baghrir", "بغرير"], category: "Essentiel", icon: "Circle" },
  { id: "atay_ma", name_fr: "Thé (Atay)", name_ar: "أتاي", name_en: "Tea", keywords: ["atay", "ataye", "the", "thé", "أتاي", "شاي"], category: "Essentiel", icon: "BerradIcon" },
  
  // Drinks & Snacks
  { id: "sidi_ali_ma", name_fr: "Eau Sidi Ali", name_ar: "سيدي علي", name_en: "Water", keywords: ["sidi ali", "ain atlas", "sidi harazem", "ماء", "سيدي علي", "سيدي حرازم", "عين اطلس"], category: "Essentiel", icon: "GlassWater" },
  { id: "oulmes_ma", name_fr: "Oulmes", name_ar: "والماس", name_en: "Sparkling water", keywords: ["oulmes", "oulmass", "والماس"], category: "Nourriture", icon: "CupSoda" },
  { id: "hawai_ma", name_fr: "Hawai", name_ar: "هاواي", name_en: "Hawai soda", keywords: ["hawai", "haway", "هاواي"], category: "Gourmandises", icon: "CupSoda" },
  { id: "poms_ma", name_fr: "Poms", name_ar: "بومس", name_en: "Poms soda", keywords: ["poms", "pom's", "بومس"], category: "Gourmandises", icon: "CupSoda" },
  { id: "bimo_ma", name_fr: "Bimo", name_ar: "بيمو", name_en: "Biscuit", keywords: ["bimo", "biscuit", "بيمو", "بسكويت"], category: "Gourmandises", icon: "Cookie" },
  { id: "tango_ma", name_fr: "Tango", name_ar: "تانكو", name_en: "Tango", keywords: ["tango", "تانغو", "تانكو"], category: "Gourmandises", icon: "Cookie" },
  { id: "merendina_ma", name_fr: "Merendina", name_ar: "ميريندينا", name_en: "Merendina", keywords: ["merendina", "ميريندينا", "ميرندينا"], category: "Gourmandises", icon: "Cake" },
  
  // Extra Moroccan
  { id: "couscous_ma", name_fr: "Couscous / Ksksou", name_ar: "كسكس", name_en: "Couscous", keywords: ["couscous", "ksksou", "seksou", "كسكس", "كسكسو"], category: "Essentiel", icon: "TajineIcon" },
  { id: "hrira_ma", name_fr: "Harira", name_ar: "حريرة", name_en: "Harira soup", keywords: ["hrira", "harira", "حريرة"], category: "Nourriture", icon: "Soup" },
  { id: "zite_zitoune_ma", name_fr: "Huile d'olive (Zit)", name_ar: "زيت العود", name_en: "Olive oil", keywords: ["zit", "zite", "zit zitoun", "huile d'olive", "زيت", "زيت العود", "زيت الزيتون"], category: "Essentiel", icon: "Droplet" }
];


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
  { id: "hanout_ma", name_fr: "Hanout / Epicerie", name_ar: "حانوت", name_en: "Grocery", keywords: ["hanout", "hanot", "moul lhanout", "حانوت", "بقالة"], category: "Essentiel", icon: "HanoutIcon" },
  { id: "souq_ma", name_fr: "Souq / Marché", name_ar: "سوق", name_en: "Market", keywords: ["souq", "souk", "marche", "سوق"], category: "Shopping", icon: "Store" },
  { id: "gzar_ma", name_fr: "Boucherie (Gzar)", name_ar: "گزار", name_en: "Butcher",keywords: ["gzar", "boucherie", "gazar", "گزار", "جزار"], category: "Protéines", icon: "Store" },

  // Misc
  { id: "qahwa_ma", name_fr: "Café (Qahwa)", name_ar: "قهوة", name_en: "Coffee", keywords: ["qahwa", "9ahwa", "qhiwa", "قهوة"], category: "Nourriture", icon: "Coffee" },
  { id: "tbib_ma", name_fr: "Médecin (Tbib)", name_ar: "طبيب", name_en: "Doctor", keywords: ["tbib", "medecin", "طبيب", "فرماسيان", "pharmacie"], category: "Sanitaire", icon: "Cross" }
];

fs.writeFileSync(path.join(process.cwd() + '/src/iconmatcher/database', 'objects.json'), JSON.stringify([...objects, ...additionalObjects, ...moroccanObjects, ...moroccanObjects2, ...moroccanObjects3, ...moroccanObjects4], null, 2));
