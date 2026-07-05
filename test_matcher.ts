import { IconMatcher } from './src/iconmatcher/IconMatcher';

const queries = [
  "1 krwassa",
  "kass dial atay",
  "batbout m3amar",
  "bocadillos d djaj",
  "chwarma",
  "redal facture",
  "chiba w na3na3",
  "bimo",
  "l7am dial l3id",
  "hwayj w sbat"
];

for (const q of queries) {
  const result = IconMatcher.findMatches(q);
  console.log('Query:', q, '-> Icon:', result[0]?.icon, 'Category:', result[0]?.category, 'Score:', result[0]?.score);
}
