import aliasesData from '../aliases/aliases.json';

const aliases: Record<string, string> = aliasesData;

export function findAliasObject(normalizedInput: string): string | null {
  if (aliases[normalizedInput]) {
    return aliases[normalizedInput];
  }
  
  // Try partial matching
  for (const [alias, objectId] of Object.entries(aliases)) {
    if (normalizedInput.includes(alias)) {
      return objectId;
    }
  }

  return null;
}
