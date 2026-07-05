import aliasesData from '../aliases/aliases.json';

const aliases: Record<string, string> = aliasesData;

export function findAliasObject(normalizedInput: string): string | null {
  if (aliases[normalizedInput]) {
    return aliases[normalizedInput];
  }
  
  for (const [alias, objectId] of Object.entries(aliases)) {
    
    if (new RegExp(`(?:^|\\s)${alias}(?:\\s|$)`, 'i').test(normalizedInput)) {
    
      return objectId;
    }
  }

  return null;
}
