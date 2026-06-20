import * as LucideIcons from 'lucide-react';

export interface IconMatchResult {
  icon: string;
  color: string;
  category: string;
  score: number;
}

// ==================================================
// CATEGORIES & COLORS
// ==================================================
export const CATEGORY_COLORS: Record<string, string> = {
  "Nourriture": "#5FAE9F",
  "Logement": "#7C6EEB",
  "Transport": "#69BCEB",
  "Sanitaire": "#E85C8E",
  "Shopping": "#B86BEA",
  "Loisirs": "#E7B24A",
  "Devoir": "#E79A62",
  "Autres": "#9CA3AF"
};

export const CATEGORY_DEFAULT_ICONS: Record<string, string> = {
  "Nourriture": "Utensils",
  "Logement": "Home",
  "Transport": "Car",
  "Sanitaire": "Bath",
  "Shopping": "ShoppingBag",
  "Loisirs": "Gamepad2",
  "Devoir": "BookOpen",
  "Autres": "Package"
};

// ==================================================
// ALIASES
// ==================================================
export const ALIASES: Record<string, string> = {
  "vitalia": "vitalya",
  "sidiali": "sidi ali",
  "cocacola": "coca-cola",
  "كوكا": "coca-cola",
  "اريال": "ariel",
  "تايد": "tide"
};

// ==================================================
// BRANDS
// ==================================================
export const BRANDS: Record<string, { icon: string, category: string }> = {
  "vitalya": { icon: "GlassWater", category: "Nourriture" },
  "sidi ali": { icon: "GlassWater", category: "Nourriture" },
  "jaouda": { icon: "Milk", category: "Nourriture" },
  "danone": { icon: "CupSoda", category: "Nourriture" },
  "omo": { icon: "WashingMachine", category: "Sanitaire" },
  "ariel": { icon: "WashingMachine", category: "Sanitaire" },
  "tide": { icon: "WashingMachine", category: "Sanitaire" },
  "afriquia": { icon: "Fuel", category: "Transport" },
  "orange": { icon: "Phone", category: "Loisirs" }
};

// ==================================================
// PRODUCTS DATABASE
// ==================================================
export interface ProductEntry {
  id: number;
  name: string;
  brand: string;
  category: string;
  icon: string;
  keywords: string[];
}

export const PRODUCTS: ProductEntry[] = [
  {
    id: 1,
    name: "bouteille d'eau",
    brand: "Vitalya",
    category: "Nourriture",
    icon: "GlassWater",
    keywords: ["vitalya", "vitalia", "eau", "ماء", "فيتاليا", "water"]
  },
  {
    id: 2,
    name: "lait",
    brand: "Jaouda",
    category: "Nourriture",
    icon: "Milk",
    keywords: ["lait", "حليب", "milk", "jaouda"]
  },
  {
    id: 3,
    name: "carburant",
    brand: "Afriquia",
    category: "Transport",
    icon: "Fuel",
    keywords: ["essence", "diesel", "gazoil", "carburant", "وقود", "بنزين"]
  },
  {
    id: 4,
    name: "lessive",
    brand: "Ariel",
    category: "Sanitaire",
    icon: "WashingMachine",
    keywords: ["lessive", "nettoyage", "ariel", "omo", "tide", "غسيل"]
  },
  {
    id: 5,
    name: "recharge",
    brand: "Orange",
    category: "Loisirs",
    icon: "Phone",
    keywords: ["recharge", "internet", "connexion", "تعبئة", "انترنت"]
  },
  {
    id: 6,
    name: "pain",
    brand: "",
    category: "Nourriture",
    icon: "Croissant",
    keywords: ["pain", "baguette", "خبز", "خبيز"]
  },
  {
    id: 7,
    name: "loyer",
    brand: "",
    category: "Logement",
    icon: "Home",
    keywords: ["loyer", "rent", "maison", "كراء", "ايجار"]
  },
  {
    id: 8,
    name: "cafe",
    brand: "",
    category: "Loisirs",
    icon: "Coffee",
    keywords: ["cafe", "coffee", "قهوة", "مقهى"]
  }
];

// ==================================================
// ICON MATCHER ENGINE
// ==================================================
class IconMatcherEngine {
  private cache = new Map<string, IconMatchResult[]>();

  // Normalization
  public removeArabicDiacritics(text: string): string {
    return text.replace(/[\u064B-\u065F]/g, '');
  }

  public removeAccents(text: string): string {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  public normalize(text: string): string {
    let normalized = text.toLowerCase();
    normalized = this.removeArabicDiacritics(normalized);
    normalized = this.removeAccents(normalized);
    normalized = normalized.replace(/[^\w\s\u0600-\u06FF]/gi, ''); // remove punctuation but keep Arabic
    normalized = normalized.replace(/\s+/g, ' ').trim();
    return this.correctAlias(normalized);
  }

  public correctAlias(text: string): string {
    const words = text.split(' ');
    const corrected = words.map(w => ALIASES[w] || w);
    return corrected.join(' ');
  }

  // Levenshtein for fuzzy matching
  private levenshtein(a: string, b: string): number {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }

  public findMatches(query: string): IconMatchResult[] {
    const originalQuery = query;
    if (this.cache.has(originalQuery)) {
      return this.cache.get(originalQuery)!;
    }

    const term = this.normalize(query);
    const results: Map<string, IconMatchResult> = new Map();
    
    const addResult = (icon: string, category: string, score: number) => {
      // Use standard title case for components
      const iconName = icon.charAt(0).toUpperCase() + icon.slice(1);
      if (!results.has(iconName) || results.get(iconName)!.score < score) {
        results.set(iconName, {
          icon: iconName,
          category,
          color: CATEGORY_COLORS[category] || CATEGORY_COLORS["Autres"],
          score
        });
      }
    };

    // 1. Exact search in products
    let foundExact = false;
    for (const p of PRODUCTS) {
      if (this.normalize(p.name) === term) {
        addResult(p.icon, p.category, 100);
        foundExact = true;
      }
    }

    // 2. Search in brands
    if (!foundExact) {
      for (const [brand, info] of Object.entries(BRANDS)) {
        if (term.includes(brand)) {
          addResult(info.icon, info.category, 90);
        }
      }
    }

    // 3. Search in keywords
    for (const p of PRODUCTS) {
      for (const keyword of p.keywords) {
        if (term.includes(keyword) || keyword.includes(term)) {
          if (term === keyword) addResult(p.icon, p.category, 85);
          else addResult(p.icon, p.category, 70);
        }
      }
    }

    // 4. Fuzzy search (Levenshtein)
    for (const p of PRODUCTS) {
      const dist = this.levenshtein(term, this.normalize(p.name));
      if (dist <= 2 && term.length > 3) {
        addResult(p.icon, p.category, 60 - dist * 10);
      }
      for (const keyword of p.keywords) {
        const kDist = this.levenshtein(term, this.normalize(keyword));
        if (kDist <= 1 && term.length > 3) {
          addResult(p.icon, p.category, 50 - kDist * 10);
        }
      }
    }

    // Convert map to array and sort by score
    let finalResults = Array.from(results.values()).sort((a, b) => b.score - a.score);

    // If no good matches, fill with some defaults
    if (finalResults.length === 0) {
      addResult(CATEGORY_DEFAULT_ICONS["Shopping"], "Shopping", 10);
      addResult(CATEGORY_DEFAULT_ICONS["Nourriture"], "Nourriture", 5);
      addResult(CATEGORY_DEFAULT_ICONS["Transport"], "Transport", 5);
      addResult(CATEGORY_DEFAULT_ICONS["Autres"], "Autres", 1);
      finalResults = Array.from(results.values()).sort((a, b) => b.score - a.score);
    }

    // Return top 4 distinct icons
    const top4 = finalResults.slice(0, 4);
    this.cache.set(originalQuery, top4);
    return top4;
  }
}

export const IconMatcher = new IconMatcherEngine();
