export function normalizeArabic(text: string): string {
  if (!text) return "";
  let normalized = text;
  normalized = normalized.replace(/[\u064B-\u065F]/g, '');
  normalized = normalized.replace(/[أإآ]/g, 'ا');
  normalized = normalized.replace(/ة/g, 'ه');
  normalized = normalized.replace(/ى/g, 'ي');
  return normalized.trim();
}
