import { normalizeArabic } from '../utils/ArabicNormalizer';
import { normalizeFrench } from '../utils/FrenchNormalizer';

export function normalizeInput(input: string): string {
  const hasArabic = /[\u0600-\u06FF]/.test(input);
  if (hasArabic) {
    return normalizeArabic(input);
  }
  return normalizeFrench(input);
}
