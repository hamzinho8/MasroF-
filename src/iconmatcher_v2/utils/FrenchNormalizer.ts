export function normalizeFrench(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9\s]/g, " ") // replace non-alphanumeric with space
    .replace(/\s+/g, " ") // collapse spaces
    .trim();
}
