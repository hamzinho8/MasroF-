import brandsData from '../database/brands.json';

export interface Brand {
  id: string;
  name: string;
  aliases: string[];
  default_object: string;
}

const brands: Brand[] = brandsData;

export function findBrandObject(normalizedInput: string): string | null {
  for (const brand of brands) {
    if (brand.aliases.some(alias => {
      const regex = new RegExp(`(?:^|\\s)${alias}(?:\\s|$)`, 'i');
      return regex.test(normalizedInput);
    })) {
      return brand.default_object;
    }
  }
  return null;
}
