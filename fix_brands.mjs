import fs from 'fs';
let brands = JSON.parse(fs.readFileSync('src/iconmatcher/database/brands.json', 'utf-8'));
brands = brands.map(b => {
  if (b.id === 'danone') b.default_object = 'yogurt_cup';
  if (b.id === 'centrale') b.default_object = 'milk_carton';
  if (b.id === 'jaouda') b.default_object = 'milk_carton';
  if (b.id === 'sidi_ali') b.default_object = 'water_bottle';
  if (b.id === 'ain_saiss') b.default_object = 'water_bottle';
  if (b.id === 'lesieur') b.default_object = 'oil_bottle';
  if (b.id === 'bimo' || b.id === 'excelo') b.default_object = 'cookie_pack';
  return b;
});
fs.writeFileSync('src/iconmatcher/database/brands.json', JSON.stringify(brands, null, 2));
