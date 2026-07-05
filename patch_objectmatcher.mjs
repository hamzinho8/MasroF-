import fs from 'fs';

let content = fs.readFileSync('src/iconmatcher/engine/ObjectMatcher.ts', 'utf-8');

const oldFunc = `export function findObjectByKeyword(normalizedInput: string): ObjectItem | null {
  for (const obj of objects) {
    if (obj.keywords.some(keyword => normalizedInput.includes(keyword))) {
      return obj;
    }
  }
  return null;
}`;

const newFunc = `export function findObjectByKeyword(normalizedInput: string): ObjectItem | null {
  const inputWords = normalizedInput.split(/\\s+/);
  
  for (const obj of objects) {
    if (obj.keywords.some(keyword => {
      // Si le mot-clé contient des espaces, vérifier s'il est inclus exactement comme phrase (avec des limites de mots)
      if (keyword.includes(' ')) {
        const regex = new RegExp(\`(?:^|\\\\s)\${keyword}(?:\\\\s|$)\`, 'i');
        return regex.test(normalizedInput);
      }
      // Sinon, vérifier si l'un des mots de l'input correspond exactement au mot-clé
      return inputWords.includes(keyword);
    })) {
      return obj;
    }
  }
  return null;
}`;

content = content.replace(oldFunc, newFunc);
fs.writeFileSync('src/iconmatcher/engine/ObjectMatcher.ts', content);
