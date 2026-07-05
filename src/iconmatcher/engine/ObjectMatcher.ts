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
  const inputWords = normalizedInput.split(/\s+/);
  
  for (const obj of objects) {
    if (obj.keywords.some(keyword => {
      // Si le mot-clé contient des espaces, vérifier s'il est inclus exactement comme phrase (avec des limites de mots)
      if (keyword.includes(' ')) {
        const regex = new RegExp(`(?:^|\\s)${keyword}(?:\\s|$)`, 'i');
        return regex.test(normalizedInput);
      }
      // Sinon, vérifier si l'un des mots de l'input correspond exactement au mot-clé
      return inputWords.includes(keyword);
    })) {
      return obj;
    }
  }
  return null;
}
