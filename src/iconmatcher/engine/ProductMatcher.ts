import productsData from '../database/products.json';
import { normalizeInput } from './Normalizer';

export interface Product {
  id: string;
  name: string;
  brand_id: string;
  object_id: string;
}

const products: Product[] = productsData;

export function findProductObject(normalizedInput: string): string | null {
  for (const product of products) {
    if (normalizeInput(product.name) === normalizedInput) {
      return product.object_id;
    }
  }
  return null;
}
