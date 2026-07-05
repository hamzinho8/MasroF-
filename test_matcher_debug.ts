import { IconMatcher } from './src/iconmatcher/IconMatcher';

const queries = [
  "atay",
  "kass atay",
  "couscous",
  "batbout",
  "chebakia",
  "balgha",
  "jellaba",
  "hanout",
  "msemen",
  "harcha"
];

for (const q of queries) {
  const result = IconMatcher.findMatches(q);
  console.log('Query:', q, '-> Icon:', result[0]?.icon, 'Category:', result[0]?.category, 'Score:', result[0]?.score);
}
