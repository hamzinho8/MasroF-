export function normalizeArabic(text: string): string {
  if (!text) return "";
  let normalized = text;
  // Remove diacritics
  normalized = normalized.replace(/[\u064B-\u065F]/g, '');
  // Normalize alef
  normalized = normalized.replace(/[أإآ]/g, 'ا');
  // Normalize teh marbuta
  normalized = normalized.replace(/ة/g, 'ه');
  // Normalize yeh
  normalized = normalized.replace(/ى/g, 'ي');
  return normalized.trim();
}
