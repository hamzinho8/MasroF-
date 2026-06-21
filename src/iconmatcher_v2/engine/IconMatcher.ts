import { normalizeInput } from './Normalizer';
import { findAliasObject } from './AliasMatcher';
import { findBrandObject } from './BrandMatcher';
import { findProductObject } from './ProductMatcher';
import { findObjectByKeyword, getObjectById, objects } from './ObjectMatcher';
import { findSimilarObject } from './SimilarityEngine';
import { resolveIconColor } from './IconResolver';

export interface IconMatchResultV2 {
  icon: string;
  category: string;
  color: string;
  score: number;
  engine: string;
}

class IconMatcherV2Engine {
  public findMatches(query: string): IconMatchResultV2[] {
    if (!query) {
      return [{
        icon: "Package",
        category: "Autres",
        color: resolveIconColor("Autres"),
        score: 0,
        engine: "fallback"
      }];
    }

    const normalized = normalizeInput(query);
    const results: IconMatchResultV2[] = [];

    // 1. Produit exact
    const productId = findProductObject(normalized);
    if (productId) {
      const obj = getObjectById(productId);
      if (obj) {
        results.push({
          icon: obj.icon,
          category: obj.category,
          color: resolveIconColor(obj.category),
          score: 100,
          engine: "product_exact"
        });
      }
    }

    // 2. Alias
    const aliasObjId = findAliasObject(normalized);
    if (aliasObjId) {
      const obj = getObjectById(aliasObjId);
      if (obj) {
        results.push({
          icon: obj.icon,
          category: obj.category,
          color: resolveIconColor(obj.category),
          score: 95,
          engine: "alias"
        });
      }
    }

    // 3. Synonymes / Mots-clés
    const keywordObj = findObjectByKeyword(normalized);
    if (keywordObj) {
      results.push({
        icon: keywordObj.icon,
        category: keywordObj.category,
        color: resolveIconColor(keywordObj.category),
        score: 90,
        engine: "keyword"
      });
    }

    // 4. Marque
    const brandObjId = findBrandObject(normalized);
    if (brandObjId) {
      const obj = getObjectById(brandObjId);
      if (obj) {
        results.push({
          icon: obj.icon,
          category: obj.category,
          color: resolveIconColor(obj.category),
          score: 85,
          engine: "brand"
        });
      }
    }

    // 7. Similarité Levenshtein
    const similar = findSimilarObject(normalized);
    if (similar) {
      results.push({
        icon: similar.object.icon,
        category: similar.object.category,
        color: resolveIconColor(similar.object.category),
        score: similar.score * 0.8, // Penality for similarity
        engine: "similarity"
      });
    }

    if (results.length > 0) {
       // Trier par score décroissant et enlever les duplicatas d'icônes
       return results.sort((a, b) => b.score - a.score).filter((item, index, self) =>
        index === self.findIndex((t) => (
          t.icon === item.icon
        ))
      );
    }

    // 8. Default fallback
    return [{
      icon: "Package",
      category: "Autres",
      color: resolveIconColor("Autres"),
      score: 10,
      engine: "fallback"
    }];
  }

  public async findMatchesWithAIFallback(
    query: string, 
    options?: { apiKey?: string; openRouterKey?: string; aiProvider?: string }
  ): Promise<IconMatchResultV2[]> {
    const localMatches = this.findMatches(query);

    // If we have a very confident result from local Matcher -> just return it
    if (localMatches.length > 0 && localMatches[0].score >= 85) {
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
          const newMatch: IconMatchResultV2 = {
            icon: aiMatch.icon,
            category: aiMatch.category || "Autres",
            color: aiMatch.color || resolveIconColor(aiMatch.category || "Autres"),
            score: 95,
            engine: "ai_fallback"
          };

          const filteredLocal = localMatches.filter(m => m.icon !== newMatch.icon);
          const combined = [newMatch, ...filteredLocal].slice(0, 4);
          
          return combined;
        }
      }
    } catch (e) {
      console.error("AI Fallback matcher failed:", e);
    }

    return localMatches;
  }
}

export const IconMatcherV2 = new IconMatcherV2Engine();
