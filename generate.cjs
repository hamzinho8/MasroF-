const fs = require('fs');

const products = [
  // Laitiers & Fromages
  { name: "Lait", name_ar: "حليب", brand: "", category: "Nourriture", icon: "Milk", keywords: ["lait", "حليب", "milk", "7lib", "hlib"] },
  { name: "Jaouda", name_ar: "جودة", brand: "Jaouda", category: "Nourriture", icon: "Milk", keywords: ["jaouda", "lait", "حليب", "joda"] },
  { name: "Centrale", name_ar: "سنترال", brand: "Centrale", category: "Nourriture", icon: "Milk", keywords: ["centrale", "lait", "sntral"] },
  { name: "Chergui", name_ar: "شركي", brand: "Chergui", category: "Nourriture", icon: "Milk", keywords: ["chergui", "lait", "cherki", "chor9i"] },
  { name: "Lben", name_ar: "لبن", brand: "", category: "Nourriture", icon: "Milk", keywords: ["lben", "lban", "leben", "لبن"] },
  { name: "Jben", name_ar: "جبن", brand: "", category: "Nourriture", icon: "Cheese", keywords: ["jben", "jban", "fromage beldi", "جبن"] },
  { name: "Danone", name_ar: "دانون", brand: "Danone", category: "Nourriture", icon: "IceCream", keywords: ["danone", "yaourt", "danon", "ياغورت"] },
  { name: "Raibi", name_ar: "رايبي", brand: "", category: "Nourriture", icon: "CupSoda", keywords: ["raibi", "jamila", "رايبي", "raybi"] },
  { name: "Fromage", name_ar: "فرماج", brand: "", category: "Nourriture", icon: "Cheese", keywords: ["fromage", "frmaj", "فرماج", "جبن"] },
  { name: "La Vache Qui Rit", name_ar: "البقرة الضاحكة", brand: "La Vache qui rit", category: "Nourriture", icon: "Cheese", keywords: ["vache", "rit", "lavache", "lavaschiri"] },
  { name: "Kiri", name_ar: "كيري", brand: "Kiri", category: "Nourriture", icon: "Cheese", keywords: ["kiri"] },

  // Eaux & Boissons
  { name: "Eau", name_ar: "ماء", brand: "", category: "Nourriture", icon: "GlassWater", keywords: ["eau", "ma", "luma", "ماء", "bouteille"] },
  { name: "Sidi Ali", name_ar: "سيدي علي", brand: "Sidi Ali", category: "Nourriture", icon: "GlassWater", keywords: ["sidi ali", "sidiali"] },
  { name: "Ain Atlas", name_ar: "عين أطلس", brand: "Ain Atlas", category: "Nourriture", icon: "GlassWater", keywords: ["ain atlas"] },
  { name: "Ain Saiss", name_ar: "عين سايس", brand: "Ain Saiss", category: "Nourriture", icon: "GlassWater", keywords: ["saiss", "ain saiss"] },
  { name: "Ciel", name_ar: "سييل", brand: "Ciel", category: "Nourriture", icon: "GlassWater", keywords: ["ciel"] },
  { name: "Oulmes", name_ar: "والماس", brand: "Oulmes", category: "Nourriture", icon: "GlassWater", keywords: ["oulmes", "walmas", "eau gazeuse"] },
  { name: "Coca-Cola", name_ar: "كوكا", brand: "Coca-Cola", category: "Nourriture", icon: "CupSoda", keywords: ["coca", "cola", "monada"] },
  { name: "Hawaii", name_ar: "هاواي", brand: "Hawaii", category: "Nourriture", icon: "CupSoda", keywords: ["hawai", "hawaii", "tropical"] },
  { name: "Poms", name_ar: "بومس", brand: "Poms", category: "Nourriture", icon: "CupSoda", keywords: ["poms", "pom's"] },
  { name: "Schweppes", name_ar: "شويبس", brand: "Schweppes", category: "Nourriture", icon: "CupSoda", keywords: ["schweppes"] },
  { name: "Jus", name_ar: "عصير", brand: "", category: "Nourriture", icon: "CupSoda", keywords: ["jus", "3assir", "assir", "عصير"] },
  { name: "Al Bustane", name_ar: "البستان", brand: "Al Bustane", category: "Nourriture", icon: "CupSoda", keywords: ["boustane", "bustane"] },
  { name: "Miami", name_ar: "ميامي", brand: "Miami", category: "Nourriture", icon: "CupSoda", keywords: ["miami"] },
  { name: "Sultan", name_ar: "سلطان", brand: "Sultan", category: "Nourriture", icon: "CupSoda", keywords: ["sultan", "the"] },

  // Epicerie & Huiles
  { name: "Huile", name_ar: "زيت", brand: "", category: "Nourriture", icon: "Droplet", keywords: ["huile", "zit", "زيت"] },
  { name: "Lesieur", name_ar: "لوسيور", brand: "Lesieur", category: "Nourriture", icon: "Droplet", keywords: ["lesieur", "lousyour"] },
  { name: "Huile d'olive", name_ar: "زيت العود", brand: "", category: "Nourriture", icon: "Droplet", keywords: ["zit l3oud", "zit zaitoun", "olive oil"] },
  { name: "Oued Souss", name_ar: "واد سوس", brand: "Oued Souss", category: "Nourriture", icon: "Droplet", keywords: ["oued", "souss"] },
  { name: "Sucre", name_ar: "سكر", brand: "", category: "Nourriture", icon: "Cuboid", keywords: ["sucre", "sokar", "سكر", "sanida", "9aleb"] },
  { name: "Ennmer", name_ar: "النمر", brand: "Ennmer", category: "Nourriture", icon: "Cuboid", keywords: ["nmer", "ennmer", "sanida"] },
  { name: "Farine", name_ar: "دقيق", brand: "", category: "Nourriture", icon: "Wheat", keywords: ["farine", "d9i9", "forss", "ftah"] },
  { name: "Maymouna", name_ar: "ميمونة", brand: "Maymouna", category: "Nourriture", icon: "Wheat", keywords: ["maymouna", "maimouna"] },
  { name: "Couscous", name_ar: "كسكس", brand: "", category: "Nourriture", icon: "Soup", keywords: ["couscous", "ksksou", "smida", "كسكس"] },
  { name: "Dari", name_ar: "داري", brand: "Dari", category: "Nourriture", icon: "Soup", keywords: ["dari"] },
  { name: "Pâtes", name_ar: "معكرونة", brand: "", category: "Nourriture", icon: "Utensils", keywords: ["pates", "pasta", "ma9arounia", "سباكيتي", "spaghetti"] },
  { name: "Tria", name_ar: "تريا", brand: "Tria", category: "Nourriture", icon: "Utensils", keywords: ["tria"] },
  { name: "Lentilles", name_ar: "عدس", brand: "", category: "Nourriture", icon: "Leaf", keywords: ["lentilles", "3dess", "3das", "عدس"] },
  { name: "Pois chiches", name_ar: "حمص", brand: "", category: "Nourriture", icon: "Leaf", keywords: ["pois chiches", "homos", "7oms", "حمص"] },
  { name: "Haricots", name_ar: "لوبيا", brand: "", category: "Nourriture", icon: "Leaf", keywords: ["haricots", "loubia", "لوبيا"] },
  { name: "Confiture", name_ar: "كوفيتير", brand: "", category: "Nourriture", icon: "Apple", keywords: ["confiture", "konfitir", "kofitir"] },
  { name: "Aicha", name_ar: "عائشة", brand: "Aicha", category: "Nourriture", icon: "Apple", keywords: ["aicha", "confiture"] },
  { name: "Amlou", name_ar: "أملو", brand: "", category: "Nourriture", icon: "Droplet", keywords: ["amlou", "argan", "amandes"] },
  { name: "Miel", name_ar: "عسل", brand: "", category: "Nourriture", icon: "Droplet", keywords: ["miel", "3sel", "3sal", "عسل"] },
  { name: "Zitoun", name_ar: "زيتون", brand: "", category: "Nourriture", icon: "Grape", keywords: ["zitoun", "olives", "زيتون"] },

  // Viandes & Volailles
  { name: "Poulet", name_ar: "دجاج", brand: "", category: "Nourriture", icon: "Drumstick", keywords: ["poulet", "djaj", "دجاج"] },
  { name: "Viande", name_ar: "لحم", brand: "", category: "Nourriture", icon: "Beef", keywords: ["viande", "lham", "l7em", "لحم", "boeuf"] },
  { name: "Kefta", name_ar: "كفتة", brand: "", category: "Nourriture", icon: "Beef", keywords: ["kefta", "kfta", "كفتة"] },
  { name: "Koutoubia", name_ar: "الكتبية", brand: "Koutoubia", category: "Nourriture", icon: "Drumstick", keywords: ["koutoubia", "charcuterie", "cacher"] },
  { name: "Saucisse", name_ar: "نقانق", brand: "", category: "Nourriture", icon: "Drumstick", keywords: ["saucisse", "ssossis", "sosis"] },
  { name: "Poisson", name_ar: "حوت", brand: "", category: "Nourriture", icon: "Fish", keywords: ["poisson", "7out", "hout", "سمك"] },
  { name: "Sardine", name_ar: "سردين", brand: "", category: "Nourriture", icon: "Fish", keywords: ["sardine", "sardin"] },
  { name: "Thon", name_ar: "طون", brand: "", category: "Nourriture", icon: "Fish", keywords: ["thon", "ton", "marior"] },

  // Boulangerie & Snacks
  { name: "Pain", name_ar: "خبز", brand: "", category: "Nourriture", icon: "Croissant", keywords: ["pain", "khobz", "komir", "baguette"] },
  { name: "Msmen", name_ar: "مسمن", brand: "", category: "Nourriture", icon: "Croissant", keywords: ["msmen", "msemen", "مسمن"] },
  { name: "Baghrir", name_ar: "بغرير", brand: "", category: "Nourriture", icon: "Croissant", keywords: ["baghrir", "bghrir", "بغرير"] },
  { name: "Harcha", name_ar: "حرشة", brand: "", category: "Nourriture", icon: "Croissant", keywords: ["harcha", "7archa", "حرشة"] },
  { name: "Biscuit", name_ar: "بسكويت", brand: "", category: "Nourriture", icon: "Cookie", keywords: ["biscuit", "bimo", "biskwi", "بسكويت", "pisquet"] },
  { name: "Bimo", name_ar: "بيمو", brand: "Bimo", category: "Nourriture", icon: "Cookie", keywords: ["bimo", "biscuit", "merendina", "tonik"] },
  { name: "Merendina", name_ar: "مريندينا", brand: "Merendina", category: "Nourriture", icon: "Cookie", keywords: ["merendina", "cake"] },
  { name: "Chocolat", name_ar: "شكلاط", brand: "", category: "Nourriture", icon: "Candy", keywords: ["chocolat", "choclat", "chokolat", "شكلاطة", "marouxa"] },
  { name: "Maruja", name_ar: "ماروخا", brand: "Maruja", category: "Nourriture", icon: "Candy", keywords: ["marouxa", "maruja", "chocolat"] },
  { name: "Chips", name_ar: "شيبس", brand: "", category: "Nourriture", icon: "Cookie", keywords: ["chips", "chibss"] },

  // Nettoyage & Entretien
  { name: "Lessive", name_ar: "مسحوق الغسيل", brand: "", category: "Sanitaire", icon: "WashingMachine", keywords: ["lessive", "tid", "مسحوق"] },
  { name: "Tide", name_ar: "تايد", brand: "Tide", category: "Sanitaire", icon: "WashingMachine", keywords: ["tide", "taid"] },
  { name: "Omo", name_ar: "أومو", brand: "Omo", category: "Sanitaire", icon: "WashingMachine", keywords: ["omo"] },
  { name: "Ariel", name_ar: "اريال", brand: "Ariel", category: "Sanitaire", icon: "WashingMachine", keywords: ["ariel", "aryal"] },
  { name: "Savon", name_ar: "صابون", brand: "", category: "Sanitaire", icon: "HandMetal", keywords: ["savon", "saboun", "صابون"] },
  { name: "Taous", name_ar: "الطاووس", brand: "Taous", category: "Sanitaire", icon: "HandMetal", keywords: ["taous", "tawss", "tahaous"] },
  { name: "El Kef", name_ar: "الكف", brand: "El Kef", category: "Sanitaire", icon: "HandMetal", keywords: ["elkef", "kef", "lkef", "savon beldi"] },
  { name: "Liquide Vaisselle", name_ar: "سائل الأواني", brand: "", category: "Sanitaire", icon: "Droplets", keywords: ["liquide vaisselle", "vaisselle", "sabon lweni", "sabon m3an", "أواني"] },
  { name: "Fairy", name_ar: "فيري", brand: "Fairy", category: "Sanitaire", icon: "Droplets", keywords: ["fairy"] },
  { name: "Oni", name_ar: "أوني", brand: "Oni", category: "Sanitaire", icon: "Droplets", keywords: ["oni", "ony"] },
  { name: "Magix", name_ar: "ماجيكس", brand: "Magix", category: "Sanitaire", icon: "Droplets", keywords: ["magix", "majix"] },
  { name: "Javel", name_ar: "جافيل", brand: "", category: "Sanitaire", icon: "SprayCan", keywords: ["javel", "gavel"] },
  { name: "Papier toilette", name_ar: "ورق المرحاض", brand: "", category: "Sanitaire", icon: "Scroll", keywords: ["papier toilette", "papier hjienik", "papiy", "papi"] },

  // Hygiène 
  { name: "Shampoing", name_ar: "شامبو", brand: "", category: "Sanitaire", icon: "Droplets", keywords: ["shampoing", "shampooing", "chambwan", "cadum"] },
  { name: "Cadum", name_ar: "كاديم", brand: "Cadum", category: "Sanitaire", icon: "Droplets", keywords: ["cadum", "kadoum"] },
  { name: "Dentifrice", name_ar: "معجون الأسنان", brand: "", category: "Sanitaire", icon: "Smile", keywords: ["dentifrice", "ma3joun", "sinyal"] },
  { name: "Signal", name_ar: "سينيال", brand: "Signal", category: "Sanitaire", icon: "Smile", keywords: ["signal", "sinyal"] },
  { name: "Colgate", name_ar: "كولكيت", brand: "Colgate", category: "Sanitaire", icon: "Smile", keywords: ["colgate", "kolgat"] },
  { name: "Deodorant", name_ar: "ديودوران", brand: "", category: "Sanitaire", icon: "Wind", keywords: ["deodorant", "riha", "spray"] },
  { name: "Couches bébé", name_ar: "ليكوش", brand: "", category: "Sanitaire", icon: "Baby", keywords: ["couches", "kouch", "bebe", "lkouch"] },
  { name: "Dalaa", name_ar: "دلع", brand: "Dalaa", category: "Sanitaire", icon: "Baby", keywords: ["dalaa"] },

  // Transport & Carburant
  { name: "Essence / Gazoil", name_ar: "وقود", brand: "", category: "Transport", icon: "Fuel", keywords: ["essence", "gazoil", "mazot", "gasoil", "diesel"] },
  { name: "Afriquia", name_ar: "إفريقيا", brand: "Afriquia", category: "Transport", icon: "Fuel", keywords: ["afriquia", "afrikia"] },
  { name: "Total", name_ar: "طوطال", brand: "Total", category: "Transport", icon: "Fuel", keywords: ["total", "totalenergies"] },
  { name: "Petrom", name_ar: "بيتروم", brand: "Petrom", category: "Transport", icon: "Fuel", keywords: ["petrom"] },
  { name: "Taxi", name_ar: "طاكسي", brand: "", category: "Transport", icon: "CarTaxiFront", keywords: ["taxi", "petit taxi", "grand taxi", "taksi"] },
  { name: "Train", name_ar: "قطار", brand: "", category: "Transport", icon: "Train", keywords: ["train", "tijivi", "oncf", "tran"] },
  { name: "Bus", name_ar: "حافلة", brand: "", category: "Transport", icon: "Bus", keywords: ["bus", "tobis"] },

  // Logement & Factures
  { name: "Électricité", name_ar: "كهرباء", brand: "", category: "Logement", icon: "Zap", keywords: ["electricite", "facture do", "redal", "amendis"] },
  { name: "Eau", name_ar: "ماء", brand: "", category: "Logement", icon: "Droplet", keywords: ["facture lma", "lydec"] },
  { name: "Redal", name_ar: "ريظال", brand: "Redal", category: "Logement", icon: "Zap", keywords: ["redal", "ridal"] },
  { name: "Lydec", name_ar: "ليدك", brand: "Lydec", category: "Logement", icon: "Zap", keywords: ["lydec", "lidec"] },
  { name: "Amendis", name_ar: "أمانديس", brand: "Amendis", category: "Logement", icon: "Zap", keywords: ["amendis"] },
  { name: "Loyer", name_ar: "كراء", brand: "", category: "Logement", icon: "Home", keywords: ["loyer", "kra", "dar", "kراء"] },

  // Télécommunications
  { name: "Recharge Internet", name_ar: "شارژ", brand: "", category: "Loisirs", icon: "Wifi", keywords: ["recharge", "conxion", "internet", "charj"] },
  { name: "Maroc Telecom", name_ar: "اتصالات المغرب", brand: "Maroc Telecom", category: "Loisirs", icon: "Wifi", keywords: ["maroc telecom", "iam", "itissalat"] },
  { name: "Inwi", name_ar: "إنوي", brand: "Inwi", category: "Loisirs", icon: "Phone", keywords: ["inwi", "inwy"] },
  { name: "Orange", name_ar: "أورنج", brand: "Orange", category: "Loisirs", icon: "Phone", keywords: ["orange", "oranj", "meditel"] },

  // Pharmacies
  { name: "Médicament", name_ar: "دواء", brand: "", category: "Sanitaire", icon: "Pill", keywords: ["medicament", "dwa", "pharmacian"] },
  { name: "Doliprane", name_ar: "دوليبران", brand: "Doliprane", category: "Sanitaire", icon: "Pill", keywords: ["doliprane", "doli"] },
  { name: "Pharmacie", name_ar: "فرماسيان", brand: "", category: "Sanitaire", icon: "Cross", keywords: ["pharmacie", "farmacy"] },
  { name: "Médecin", name_ar: "طبيب", brand: "", category: "Sanitaire", icon: "Stethoscope", keywords: ["medecin", "tbib"] },

  // Devoir & Fournitures
  { name: "Cahier", name_ar: "دفتر", brand: "", category: "Devoir", icon: "Book", keywords: ["cahier", "dftar", "daftar"] },
  { name: "Stylo", name_ar: "ستيلو", brand: "", category: "Devoir", icon: "Pen", keywords: ["stylo", "stilo", "9alam"] },
  { name: "École", name_ar: "مدرسة", brand: "", category: "Devoir", icon: "GraduationCap", keywords: ["ecole", "madrassah", "mdrasa", "scolarite"] },

  // Shopping, Vêtements, Electro
  { name: "Vêtements", name_ar: "ملابس", brand: "", category: "Shopping", icon: "Shirt", keywords: ["vetements", "hwayj", "tshirt", "pantalon"] },
  { name: "Chaussures", name_ar: "أحذية", brand: "", category: "Shopping", icon: "Footprints", keywords: ["chaussures", "sbat", "baskets", "sbrdila"] },
  { name: "Téléphone", name_ar: "تلفون", brand: "", category: "Shopping", icon: "Smartphone", keywords: ["telephone", "portable", "talo"] },
  { name: "Marjane", name_ar: "مرجان", brand: "Marjane", category: "Shopping", icon: "ShoppingCart", keywords: ["marjane", "marjan"] },
  { name: "Carrefour", name_ar: "كارفور", brand: "Carrefour", category: "Shopping", icon: "ShoppingCart", keywords: ["carrefour", "karfour"] },
  { name: "Bim", name_ar: "بيم", brand: "Bim", category: "Shopping", icon: "ShoppingCart", keywords: ["bim", "baym"] },

  // Légumes & Fruits 
  { name: "Légumes", name_ar: "خضر", brand: "", category: "Nourriture", icon: "Carrot", keywords: ["legumes", "khodra"] },
  { name: "Tomate", name_ar: "مطيشة", brand: "", category: "Nourriture", icon: "Carrot", keywords: ["tomate", "maticha", "tomat"] },
  { name: "Pomme de terre", name_ar: "بطاطا", brand: "", category: "Nourriture", icon: "Carrot", keywords: ["pomme de terre", "batata", "pompier"] },
  { name: "Oignon", name_ar: "بصلة", brand: "", category: "Nourriture", icon: "Carrot", keywords: ["oignon", "bsla", "basal"] },
  { name: "Fruits", name_ar: "ديسير", brand: "", category: "Nourriture", icon: "Apple", keywords: ["fruits", "disir", "fawakih"] },
  { name: "Pomme", name_ar: "تفاح", brand: "", category: "Nourriture", icon: "Apple", keywords: ["pomme", "tfa7"] },
  { name: "Banane", name_ar: "بنان", brand: "", category: "Nourriture", icon: "Banana", keywords: ["banane", "bnan"] },
  { name: "Orange", name_ar: "ليمون", brand: "", category: "Nourriture", icon: "Citrus", keywords: ["orange", "limoun", "limon"] },
  // Fruits & Legumes extra
  { name: "Mandarine", name_ar: "ماندارين", brand: "", category: "Nourriture", icon: "Citrus", keywords: ["mandarine", "mndarina"] },
  { name: "Fraise", name_ar: "فريز", brand: "", category: "Nourriture", icon: "Cherry", keywords: ["fraise", "friz", "fraises"] },
  { name: "Melon", name_ar: "بطيخ", brand: "", category: "Nourriture", icon: "Apple", keywords: ["melon", "btikh", "سويهلة", "zri3a"] },
  { name: "Pêche", name_ar: "خوخ", brand: "", category: "Nourriture", icon: "Apple", keywords: ["peche", "khokh"] },
  { name: "Avocat", name_ar: "لافوكا", brand: "", category: "Nourriture", icon: "Leaf", keywords: ["avocat", "lavoka"] },
  { name: "Raisin", name_ar: "عنب", brand: "", category: "Nourriture", icon: "Grape", keywords: ["raisin", "3nab"] },
  { name: "Céleri", name_ar: "كرافس", brand: "", category: "Nourriture", icon: "Leaf", keywords: ["celeri", "krafess"] },
  { name: "Coriandre", name_ar: "قزبر", brand: "", category: "Nourriture", icon: "Leaf", keywords: ["coriandre", "9sbor"] },
  { name: "Persil", name_ar: "معدنوس", brand: "", category: "Nourriture", icon: "Leaf", keywords: ["persil", "m3dnos"] },
  { name: "Menthe", name_ar: "نعناع", brand: "", category: "Nourriture", icon: "Leaf", keywords: ["menthe", "n3na3"] },
  
  // Condiments & Conserves
  { name: "Concentré tomate", name_ar: "مطيشة الحك", brand: "", category: "Nourriture", icon: "Carrot", keywords: ["concentre tomate", "maticha l7k"] },
  { name: "Harissa", name_ar: "هريسة", brand: "", category: "Nourriture", icon: "Flame", keywords: ["harissa", "hrisa", "piment fort"] },
  { name: "Smen", name_ar: "سمن", brand: "", category: "Nourriture", icon: "Soup", keywords: ["smen", "smn"] },
  { name: "Ail", name_ar: "ثوم", brand: "", category: "Nourriture", icon: "Bean", keywords: ["ail", "toma", "thoum"] },
  { name: "Zitoun Rouge", name_ar: "زيتون أحمر", brand: "", category: "Nourriture", icon: "Grape", keywords: ["zitoun ahmar"] },
  
  // Boulangerie extra 
  { name: "Millefeuille", name_ar: "ميلفوي", brand: "", category: "Nourriture", icon: "Cake", keywords: ["millefeuille", "milfoy"] },
  { name: "Croissant", name_ar: "كرواسون", brand: "", category: "Nourriture", icon: "Croissant", keywords: ["croissant", "krwasa"] },
  { name: "Petit Pain", name_ar: "بتي بان", brand: "", category: "Nourriture", icon: "Croissant", keywords: ["petit pain", "pti pan"] },
  { name: "Sellou", name_ar: "سلو", brand: "", category: "Nourriture", icon: "Soup", keywords: ["sellou", "sfouf", "slou"] },
  { name: "Chebakia", name_ar: "شباكية", brand: "", category: "Nourriture", icon: "Cookie", keywords: ["chebakia", "mkharka"] },
  
  // Charcuterie extra
  { name: "Cacher", name_ar: "كاشير", brand: "", category: "Nourriture", icon: "Cylinder", keywords: ["cacher", "mortadella"] },
  { name: "Saucisson", name_ar: "صوصيصون", brand: "", category: "Nourriture", icon: "Cylinder", keywords: ["saucisson"] },
  
  // Café extra
  { name: "Nescafé", name_ar: "نيسكافي", brand: "Nescafé", category: "Nourriture", icon: "Coffee", keywords: ["nescafe", "niscafi"] },
  { name: "Dubois", name_ar: "دوبوا", brand: "Dubois", category: "Nourriture", icon: "Coffee", keywords: ["dubois"] },
  { name: "Carrion", name_ar: "كاريون", brand: "Carrion", category: "Nourriture", icon: "Coffee", keywords: ["carrion"] },
  { name: "Samar", name_ar: "سمر", brand: "Samar", category: "Nourriture", icon: "Coffee", keywords: ["samar"] },

  // Epicerie Snacking extra
  { name: "Pâtisserie", name_ar: "حلويات", brand: "", category: "Nourriture", icon: "Cake", keywords: ["patisserie", "gateau", "halawiyat"] },
  { name: "Binto", name_ar: "بينتو", brand: "Binto", category: "Nourriture", icon: "Cookie", keywords: ["binto"] },
  { name: "Golden", name_ar: "كولدن", brand: "Golden", category: "Nourriture", icon: "Cookie", keywords: ["golden"] },
  { name: "Tang", name_ar: "تانغ", brand: "Tang", category: "Nourriture", icon: "CupSoda", keywords: ["tang"] },
  
  // Autres 
  { name: "Cigarettes", name_ar: "سجائر", brand: "", category: "Loisirs", icon: "Cigarette", keywords: ["cigarette", "garo", "marquise", "marlboro"] },
  { name: "Papier", name_ar: "ورق", brand: "", category: "Devoir", icon: "FilePlus", keywords: ["papier", "warqa", "wr9a"] },
  { name: "Livre", name_ar: "كتاب", brand: "", category: "Devoir", icon: "Book", keywords: ["livre", "ktab"] },
  { name: "Magazine", name_ar: "مجلة", brand: "", category: "Loisirs", icon: "Book", keywords: ["magazine", "majalha"] },
  { name: "Restaurant", name_ar: "مطعم", brand: "", category: "Loisirs", icon: "Utensils", keywords: ["restaurant", "resto", "mt3m"] },
  { name: "Cinéma", name_ar: "سينما", brand: "", category: "Loisirs", icon: "Film", keywords: ["cinema", "sinima", "film"] },
  { name: "Café sortie", name_ar: "مقهى", brand: "", category: "Loisirs", icon: "Coffee", keywords: ["sortie cafe", "qahwa"] },
  { name: "Lavage Auto", name_ar: "غسيل سيارات", brand: "", category: "Transport", icon: "Car", keywords: ["lavage", "lavaj"] },
  { name: "Péage", name_ar: "أداء الطريق", brand: "", category: "Transport", icon: "Car", keywords: ["peage", "autoroute", "pij"] },
  { name: "Parking", name_ar: "مرآب", brand: "", category: "Transport", icon: "Car", keywords: ["parking", "parkin"] },
  { name: "Docteur", name_ar: "طبيب", brand: "", category: "Santé", icon: "Stethoscope", keywords: ["docteur", "tbib"] },
  { name: "Analyse", name_ar: "تحليلة", brand: "", category: "Santé", icon: "Activity", keywords: ["analyse", "tahlila"] },
  { name: "Vitamine", name_ar: "فيتامين", brand: "", category: "Santé", icon: "Pill", keywords: ["vitamine", "fitzamin"] },
  { name: "Pansement", name_ar: "فاصمة", brand: "", category: "Santé", icon: "Cross", keywords: ["pansement", "fasma"] },
  { name: "Coiffeur", name_ar: "حلاق", brand: "", category: "Soins", icon: "Scissors", keywords: ["coiffeur", "hllag", "hilaqa"] },
  { name: "Hammam", name_ar: "حمام", brand: "", category: "Soins", icon: "Bath", keywords: ["hammam", "hmem"] },
  { name: "Beauté", name_ar: "تجميل", brand: "", category: "Soins", icon: "Sparkles", keywords: ["beaute", "makeup", "maquillage"] },
  { name: "Cadeau", name_ar: "هدية", brand: "", category: "Famille", icon: "Gift", keywords: ["cadeau", "cado"] },
  { name: "Jeux", name_ar: "ألعاب", brand: "", category: "Loisirs", icon: "Gamepad2", keywords: ["jeux", "je", "l3b"] },
  { name: "Gym", name_ar: "لاتصال", brand: "", category: "Santé", icon: "Dumbbell", keywords: ["gym", "lasal", "salle sport"] },
  { name: "T-shirt", name_ar: "تيشيرت", brand: "", category: "Shopping", icon: "Shirt", keywords: ["t-shirt", "tshirt", "tichurt"] },
  { name: "Pantalon", name_ar: "سروال", brand: "", category: "Shopping", icon: "Shirt", keywords: ["pantalon", "srwal", "serwal"] },
  { name: "Veste", name_ar: "جاكيط", brand: "", category: "Shopping", icon: "Shirt", keywords: ["veste", "jakit"] },
  { name: "Manteau", name_ar: "مونطو", brand: "", category: "Shopping", icon: "Shirt", keywords: ["manteau", "monto"] },
  { name: "Montre", name_ar: "مكانة", brand: "", category: "Shopping", icon: "Watch", keywords: ["montre", "magana"] }
];

products.forEach((p, i) => p.id = i + 1);

const brands = {};
products.filter(p => p.brand).forEach(p => {
  brands[p.brand.toLowerCase()] = { icon: p.icon, category: p.category };
});

const aliases = {
  "pisquet": "biscuit",
  "piskwit": "biscuit",
  "biskwit": "biscuit",
  "biskouit": "biscuit",
  "vitalia": "vitalya",
  "vitaliya": "vitalya",
  "sidiali": "sidi ali",
  "ainatlas": "ain atlas",
  "cocacola": "coca-cola",
  "coca": "coca-cola",
  "كوكا": "coca-cola",
  "ariyal": "ariel",
  "tid": "tide",
  "inwy": "inwi",
  "lavachequirit": "la vache qui rit",
  "frmaj": "fromage",
  "zit": "huile",
  "ma": "eau",
  "do": "electricite",
  "atay": "the",
  "sokat": "sucre",
  "d9i9": "farine",
  "ksksou": "couscous",
  "saboun": "savon",
  "dwa": "medicament",
  "sbat": "chaussures",
  "hwayj": "vetements",
  "danon": "danone",
  "djaj": "poulet",
  "l7em": "viande",
  "7out": "poisson",
  "maticha": "tomate",
  "pompier": "pomme de terre",
  "stilo": "stylo",
  "talo": "telephone",
  "pc": "ordinateur",
  "sbon": "savon",
  "sabon": "savon",
  "oni": "liquide vaisselle",
  "fairy": "liquide vaisselle"
};

fs.writeFileSync('src/iconmatcher/assets/database/products.json', JSON.stringify({ products }, null, 2));
fs.writeFileSync('src/iconmatcher/assets/database/brands.json', JSON.stringify({ brands }, null, 2));
fs.writeFileSync('src/iconmatcher/assets/aliases/aliases.json', JSON.stringify({ aliases }, null, 2));
