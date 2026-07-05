import fs from 'fs';

let content = fs.readFileSync('src/iconmatcher/database/generate.js', 'utf-8');

const replacements = [
  { regex: /icon: "Utensils" \}, \/\/ for Couscous.*/, replace: 'icon: "TajineIcon" },' },
  { regex: /icon: "Utensils" \}, \/\/ for Tajine.*/, replace: 'icon: "TajineIcon" },' },
  { regex: /id: "couscous_ma"([^}]*)icon: "Utensils"/g, replace: 'id: "couscous_ma"$1icon: "TajineIcon"' },
  { regex: /id: "couscous_pack"([^}]*)icon: "Package"/g, replace: 'id: "couscous_pack"$1icon: "TajineIcon"' },
  { regex: /id: "couscous"([^}]*)icon: "Package"/g, replace: 'id: "couscous"$1icon: "TajineIcon"' },
  
  { regex: /id: "atay_ma"([^}]*)icon: "Coffee"/g, replace: 'id: "atay_ma"$1icon: "BerradIcon"' },
  { regex: /id: "tea_box"([^}]*)icon: "Circle"/g, replace: 'id: "tea_box"$1icon: "BerradIcon"' },
  
  { regex: /id: "msemen_ma"([^}]*)icon: "Square"/g, replace: 'id: "msemen_ma"$1icon: "MsemenIcon"' },
  { regex: /id: "batbout_ma"([^}]*)icon: "Croissant"/g, replace: 'id: "batbout_ma"$1icon: "MsemenIcon"' },
  { regex: /id: "harcha_ma"([^}]*)icon: "Cookie"/g, replace: 'id: "harcha_ma"$1icon: "GhoribaIcon"' },
  
  { regex: /id: "chebakia_ma"([^}]*)icon: "Cookie"/g, replace: 'id: "chebakia_ma"$1icon: "ChebakiaIcon"' },
  { regex: /id: "chbakia_ma"([^}]*)icon: "Cookie"/g, replace: 'id: "chbakia_ma"$1icon: "ChebakiaIcon"' },
  
  { regex: /id: "balgha_ma"([^}]*)icon: "Footprints"/g, replace: 'id: "balgha_ma"$1icon: "BalghaIcon"' },
  { regex: /id: "jellaba_ma"([^}]*)icon: "Shirt"/g, replace: 'id: "jellaba_ma"$1icon: "JellabaIcon"' },
  
  { regex: /id: "hanout_ma"([^}]*)icon: "Store"/g, replace: 'id: "hanout_ma"$1icon: "HanoutIcon"' }
];

replacements.forEach(r => {
  content = content.replace(r.regex, r.replace);
});

fs.writeFileSync('src/iconmatcher/database/generate.js', content);
