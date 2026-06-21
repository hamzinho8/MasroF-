import objectsData from '../database/objects.json';

export interface ObjectItem {
  id: string;
  name_fr: string;
  name_ar: string;
  name_en: string;
  keywords: string[];
  category: string;
  icon: string;
}

export const objects: ObjectItem[] = objectsData;

export function getObjectById(id: string): ObjectItem | null {
  return objects.find(obj => obj.id === id) || null;
}

export function findObjectByKeyword(normalizedInput: string): ObjectItem | null {
  for (const obj of objects) {
    if (obj.keywords.some(keyword => normalizedInput.includes(keyword))) {
      return obj;
    }
  }
  return null;
}
