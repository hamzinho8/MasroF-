import categoriesData from '../database/categories.json';

const categoryColors: Record<string, string> = categoriesData;

export function resolveIconColor(category: string): string {
  return categoryColors[category] || categoryColors['Autres'];
}
