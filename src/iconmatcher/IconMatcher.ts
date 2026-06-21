import productsData from './assets/database/products.json';
import brandsData from './assets/database/brands.json';
import categoriesData from './assets/database/categories.json';
import aliasesData from './assets/aliases/aliases.json';

export interface IconMatchResult {
  icon: string;
  color: string;
  category: string;
  score: number;
}

export interface ProductEntry {
  id: number;
  name: string;
  brand: string;
  category: string;
  icon: string;
  keywords: string[];
}

export interface CategoryEntry {
  name: string;
  color: string;
  defaultIcon: string;
}

const PRODUCTS: ProductEntry[] = productsData.products;
const BRANDS: Record<string, { icon: string, category: string }> = brandsData.brands;
const ALIASES: Record<string, string> = aliasesData.aliases;

const CATEGORY_COLORS: Record<string, string> = {};
const CATEGORY_DEFAULT_ICONS: Record<string, string> = {};

categoriesData.categories.forEach((cat: CategoryEntry) => {
  CATEGORY_COLORS[cat.name] = cat.color;
  CATEGORY_DEFAULT_ICONS[cat.name] = cat.defaultIcon;
});

class IconMatcherEngine {
  private cache = new Map<string, IconMatchResult[]>();

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
    // Supprimer la ponctuation et éléments non-alphanumériques (sauf arabe)
    normalized = normalized.replace(/[^\w\s\u0600-\u06FF]/gi, ''); 
    normalized = normalized.replace(/\s+/g, ' ').trim();
    return this.correctAlias(normalized);
  }

  public correctAlias(text: string): string {
    const words = text.split(' ');
    const corrected = words.map(w => ALIASES[w] || w);
    return corrected.join(' ');
  }

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
    
    // Ajoute un résultat dans le Map. Si la même icône existe, garde le meilleur score.
    const addResult = (icon: string, category: string, score: number) => {
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

    let foundExact = false;

    // 1. Recherche exacte dans products.json
    for (const p of PRODUCTS) {
      if (this.normalize(p.name) === term) {
        addResult(p.icon, p.category, 100);
        foundExact = true;
      }
    }

    // 2 & 3. Recherche dans brands.json et keywords
    if (!foundExact) {
      for (const [brand, info] of Object.entries(BRANDS)) {
        if (term.includes(brand)) {
          addResult(info.icon, info.category, 90);
        }
      }
    }

    for (const p of PRODUCTS) {
      for (const keyword of p.keywords) {
        const normedKW = this.normalize(keyword);
        if (term.includes(normedKW) || normedKW.includes(term)) {
          if (term === normedKW) addResult(p.icon, p.category, 85);
          else addResult(p.icon, p.category, 70);
        }
      }
    }

    // 4. Recherche approximative (Levenshtein) sur les objets/keywords
    for (const p of PRODUCTS) {
      const dist = this.levenshtein(term, this.normalize(p.name));
      const allowedDist = term.length > 6 ? 2 : 1;
      if (dist <= allowedDist && term.length > 3) {
        addResult(p.icon, p.category, 60 - dist * 10);
      }
      for (const keyword of p.keywords) {
        const normedKW = this.normalize(keyword);
        const kDist = this.levenshtein(term, normedKW);
        const kwAllowedDist = term.length > 6 ? 2 : 1;
        if (kDist <= kwAllowedDist && term.length > 3) {
          addResult(p.icon, p.category, 50 - kDist * 10);
        }
      }
    }

    // 5. Convertir en tableau et trier par score
    let finalResults = Array.from(results.values()).sort((a, b) => b.score - a.score);

    // 6. Si aucun résultat, utiliser des fallback (shopping par défaut + autres catégories)
    if (finalResults.length === 0) {
      addResult(CATEGORY_DEFAULT_ICONS["Shopping"], "Shopping", 10);
      addResult(CATEGORY_DEFAULT_ICONS["Nourriture"], "Nourriture", 5);
      addResult(CATEGORY_DEFAULT_ICONS["Transport"], "Transport", 5);
      addResult(CATEGORY_DEFAULT_ICONS["Autres"], "Autres", 1);
      finalResults = Array.from(results.values()).sort((a, b) => b.score - a.score);
    }

    // 7. Renvoyer les 4 premières icônes
    const top4 = finalResults.slice(0, 4);
    this.cache.set(originalQuery, top4);
    return top4;
  }

  public async findMatchesWithAIFallback(
    query: string, 
    options?: { apiKey?: string; openRouterKey?: string; aiProvider?: string }
  ): Promise<IconMatchResult[]> {
    const localMatches = this.findMatches(query);

    // If we have a very confident result from local Matcher -> just return it
    if (localMatches.length > 0 && localMatches[0].score >= 50) {
      return localMatches;
    }

    try {
      const response = await fetch('/api/suggest-icon-matcher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          apiKey: options?.apiKey,
          openRouterApiKey: options?.openRouterKey,
          aiProvider: options?.aiProvider
        })
      });

      if (response.ok) {
        const aiMatch = await response.json();
        if (aiMatch && aiMatch.icon) {
          // Verify format
          const newMatch: IconMatchResult = {
            icon: aiMatch.icon,
            category: aiMatch.category || "Autres",
            color: aiMatch.color || CATEGORY_COLORS["Autres"],
            score: 95 // Give high score to AI fallback so it sits at the top
          };

          // Remove any duplicate
          const filteredLocal = localMatches.filter(m => m.icon !== newMatch.icon);
          
          const combined = [newMatch, ...filteredLocal].slice(0, 4);
          
          // Optionally cache this new combined result
          this.cache.set(query, combined);
          
          return combined;
        }
      }
    } catch (e) {
      console.error("AI Fallback matcher failed:", e);
    }

    return localMatches;
  }
}

export const IconMatcher = new IconMatcherEngine();
