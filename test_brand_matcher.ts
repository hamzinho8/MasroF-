import { IconMatcher } from './src/iconmatcher/IconMatcher';

const queries = [
  "khobz",
  "zlafa harira",
  "zit zitoune",
  "argan",
  "danone",
  "sidi ali",
  "lait centrale",
  "lesieur",
  "bimo",
  "excelo"
];

for (const q of queries) {
  const result = IconMatcher.findMatches(q);
  console.log('Query:', q, '-> Icon:', result[0]?.icon, 'Category:', result[0]?.category, 'Score:', result[0]?.score);
}
