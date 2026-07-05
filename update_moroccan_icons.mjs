import fs from 'fs';

const iconsCode = `import React from 'react';

// === GASTRONOMIE MAROCAINE ===

export const TajineIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M2 17h20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z" />
    <path d="M4 17L11.1 5a1 1 0 0 1 1.8 0L20 17" />
    <circle cx="12" cy="3" r="1.5" />
    <path d="M7 17v-1" />
    <path d="M17 17v-1" />
  </svg>
);

export const BerradIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M7 10h10a2 2 0 0 1 2 2v4a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4v-4a2 2 0 0 1 2-2z" />
    <path d="M8 10V8l2-2h4l2 2v2" />
    <circle cx="12" cy="5" r="1" />
    <path d="M19 12c2.5-1 3.5-3 3-5" />
    <path d="M5 12c-2.5 0-4 1.5-3 4s2.5 2 3 2" />
  </svg>
);

export const MsemenIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
    <path d="M8 4v16" />
    <path d="M16 4v16" />
    <path d="M4 8h16" />
    <path d="M4 16h16" />
  </svg>
);

export const ChebakiaIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 3a4 4 0 0 0-4 4v10a4 4 0 0 0 8 0V7a4 4 0 0 0-4-4z" />
    <path d="M3 12a4 4 0 0 0 4 4h10a4 4 0 0 0 0-8H7a4 4 0 0 0-4 4z" />
    <path d="M9 9l6 6" />
    <path d="M15 9l-6 6" />
  </svg>
);

export const GhoribaIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9 7l1 2-2 1" />
    <path d="M15 8l-1 2 2 2" />
    <path d="M10 15l2-2 1 2" />
    <path d="M14 16l1-1-1-2" />
    <path d="M8 12l2 1" />
  </svg>
);

export const SfenjIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 3c1.5 0 2 .5 2 1" />
    <path d="M21 12c0 1.5-.5 2-1 2" />
    <path d="M6 18c1-1 2-1 3 0" />
  </svg>
);

// === NOUVELLES MATIERES PREMIERES (Raw Materials) ===

export const KhobzIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v1" />
    <path d="M8.5 8.5l.7.7" />
    <path d="M15.5 8.5l-.7.7" />
    <path d="M7 12h1" />
    <path d="M16 12h1" />
  </svg>
);

export const ZlafaIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 10a9 9 0 0 0 18 0Z" />
    <path d="M8 19h8" />
    <path d="M3 10h18" />
    <path d="M10 19v3" />
    <path d="M14 19v3" />
    <path d="M10 22h4" />
    <path d="M7 6c1-1 2-1 3 0" />
    <path d="M13 6c1-1 2-1 3 0" />
  </svg>
);

export const ArganIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 2C7 2 3 7 3 13c0 4 3 8 9 9 6-1 9-5 9-9 0-6-4-11-9-11z" />
    <path d="M8 8c1-1.5 2.5-2 4-2" />
  </svg>
);

export const OliveOilIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 3h-6l-1 5a4 4 0 0 0-1 2.5V20a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9.5A4 4 0 0 0 16 8l-1-5z" />
    <path d="M9 3v1" />
    <path d="M15 3v1" />
    <circle cx="12" cy="14" r="3" />
    <path d="M12 11v1" />
  </svg>
);

// === CULTURE & SHOPPING ===

export const BalghaIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 18h18" />
    <path d="M3 18v-2c0-2 2-3 4-3h6c5 0 8 3 8 5" />
    <path d="M12 13c-2-3-5-4-8-4" />
  </svg>
);

export const JellabaIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 3L8 9H4l-2 5h3v7h14v-7h3l-2-5h-4l-4-6z" />
    <path d="M12 3v18" />
    <path d="M9 13v8" />
    <path d="M15 13v8" />
  </svg>
);

export const HanoutIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 7l1.5-4h15L21 7" />
    <path d="M3 7v14h18V7" />
    <path d="M3 7c1 1.5 2.5 1.5 3.5 0 1 1.5 2.5 1.5 3.5 0 1 1.5 2.5 1.5 3.5 0 1 1.5 2.5 1.5 3.5 0" />
    <path d="M9 21V12h6v9" />
  </svg>
);

// === MARQUES LOCALES (Brands) ===

export const BrandDanoneIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M5 6h14l-1.5 14h-11L5 6z" />
    <path d="M4 6h16" />
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <path d="M8 12c1.5 1 3 1.5 4 1.5s2.5-.5 4-1.5" />
  </svg>
);

export const BrandCentraleIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M6 7l6-4 6 4" />
    <path d="M6 7v14h12V7" />
    <path d="M12 3v4" />
    <path d="M8 12h8" />
    <path d="M8 16h8" />
    <circle cx="12" cy="14" r="1.5" />
  </svg>
);

export const BrandSidiAliIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 5h6" />
    <path d="M10 5V3h4v2" />
    <path d="M9 5l-1 4v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V9l-1-4" />
    <path d="M8 13h8" />
    <path d="M8 17h8" />
    <path d="M11 9c.5.5 1.5.5 2 0" />
  </svg>
);

export const BrandLesieurIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 2C8 6 5 11 5 16a7 7 0 0 0 14 0c0-5-3-10-7-14z" />
    <circle cx="12" cy="16" r="3" />
  </svg>
);

export const BrandBimoIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="6" width="18" height="12" rx="2" ry="2" />
    <circle cx="7" cy="10" r="1" />
    <circle cx="12" cy="10" r="1" />
    <circle cx="17" cy="10" r="1" />
    <circle cx="7" cy="14" r="1" />
    <circle cx="12" cy="14" r="1" />
    <circle cx="17" cy="14" r="1" />
    <path d="M3 10h1" />
    <path d="M3 14h1" />
    <path d="M20 10h1" />
    <path d="M20 14h1" />
  </svg>
);
`;

fs.writeFileSync('src/components/icons/MoroccanIcons.tsx', iconsCode);

// Update objects in objects.json
let objects = JSON.parse(fs.readFileSync('src/iconmatcher/database/objects.json', 'utf-8'));

objects = objects.map(obj => {
  // Mapping logic
  if (obj.keywords.includes('harira') || obj.keywords.includes('zlafa') || obj.keywords.includes('soupe')) {
    obj.icon = 'ZlafaIcon';
  }
  if (obj.keywords.includes('khobz') || obj.keywords.includes('pain') || obj.keywords.includes('خبز')) {
    obj.icon = 'KhobzIcon';
  }
  if (obj.keywords.includes('argan') || obj.keywords.includes('zitoune') || obj.keywords.includes('olive') || obj.keywords.includes('زيتون')) {
    obj.icon = 'ArganIcon';
  }
  if (obj.keywords.includes('lhuile') || obj.name_fr === 'Huile') {
    obj.icon = 'OliveOilIcon';
  }
  
  if (obj.name_fr?.toLowerCase().includes('danone') || obj.keywords.includes('danone')) {
    obj.icon = 'BrandDanoneIcon';
  }
  if (obj.name_fr?.toLowerCase().includes('centrale') || obj.keywords.includes('lait') || obj.keywords.includes('حليب')) {
    obj.icon = 'BrandCentraleIcon';
  }
  if (obj.keywords.includes('eau') || obj.name_en === 'Water') {
    obj.icon = 'BrandSidiAliIcon';
  }
  if (obj.name_fr?.toLowerCase().includes('lesieur')) {
    obj.icon = 'BrandLesieurIcon';
  }
  if (obj.keywords.includes('bimo') || obj.keywords.includes('biscuit') || obj.keywords.includes('بيمو')) {
    obj.icon = 'BrandBimoIcon';
  }
  return obj;
});

fs.writeFileSync('src/iconmatcher/database/objects.json', JSON.stringify(objects, null, 2));

// Update brands.json
let brands = JSON.parse(fs.readFileSync('src/iconmatcher/database/brands.json', 'utf-8'));
brands = brands.map(b => {
  if (b.id === 'danone') b.default_object = 'BrandDanoneIcon';
  if (b.id === 'centrale') b.default_object = 'BrandCentraleIcon';
  if (b.id === 'jaouda') b.default_object = 'BrandCentraleIcon';
  if (b.id === 'sidi_ali') b.default_object = 'BrandSidiAliIcon';
  if (b.id === 'ain_saiss') b.default_object = 'BrandSidiAliIcon';
  if (b.id === 'lesieur') b.default_object = 'BrandLesieurIcon';
  if (b.id === 'bimo' || b.id === 'excelo') b.default_object = 'BrandBimoIcon';
  return b;
});
fs.writeFileSync('src/iconmatcher/database/brands.json', JSON.stringify(brands, null, 2));
