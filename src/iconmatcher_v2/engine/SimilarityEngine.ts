import { similarityScore } from '../utils/Levenshtein';
import { objects, ObjectItem } from './ObjectMatcher';

export interface ScoredObject {
  object: ObjectItem;
  score: number;
}

export function findSimilarObject(normalizedInput: string): ScoredObject | null {
  let bestScore = 0;
  let bestObject: ObjectItem | null = null;

  for (const obj of objects) {
    // Check against names and keywords
    const targets = [
      obj.name_fr.toLowerCase(),
      obj.name_en.toLowerCase(),
      ...obj.keywords
    ];

    for (const target of targets) {
      const score = similarityScore(normalizedInput, target);
      if (score > bestScore) {
        bestScore = score;
        bestObject = obj;
      }
    }
  }

  // Threshold for similarity
  if (bestScore > 60 && bestObject) {
    return { object: bestObject, score: bestScore };
  }

  return null;
}
