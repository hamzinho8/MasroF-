import fs from 'fs';

const iconsCode = `import React from 'react';

// Common styles for animations
const IconStyles = () => (
  <style>{\`
    .icon-hover-group:hover .steam-1 { animation: steam-rise 1.5s infinite; }
    .icon-hover-group:hover .steam-2 { animation: steam-rise 1.5s infinite 0.4s; }
    .icon-hover-group:hover .steam-3 { animation: steam-rise 1.5s infinite 0.8s; }
    .icon-hover-group:hover .spin-slow { animation: spin-anim 3s linear infinite; }
    .icon-hover-group:hover .pulse-soft { animation: pulse-soft 2s infinite; }
    .icon-hover-group:hover .bounce-soft { animation: bounce-soft 1s infinite; }
    @keyframes steam-rise {
      0% { transform: translateY(0) scale(1); opacity: 0.5; }
      50% { opacity: 1; }
      100% { transform: translateY(-4px) scale(1.2); opacity: 0; }
    }
    @keyframes pulse-soft {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
    @keyframes bounce-soft {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-3px); }
    }
    @keyframes spin-anim {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .brand-badge {
      fill: #10b981;
      stroke: #fff;
      stroke-width: 1.5px;
    }
  \`}</style>
);

// === GASTRONOMIE MAROCAINE ===

export const TajineIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-hover-group transition-transform hover:scale-105" {...props}>
    <IconStyles />
    {/* Steam paths (Subtle animation) */}
    <path className="steam-1 opacity-0" d="M12 2v-2" strokeWidth="1.5" />
    <path className="steam-2 opacity-0" d="M9 3v-2" strokeWidth="1.5" />
    <path className="steam-3 opacity-0" d="M15 3v-2" strokeWidth="1.5" />
    
    <path d="M2 17h20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z" />
    <path d="M4 17L11.1 5a1 1 0 0 1 1.8 0L20 17" />
    <circle cx="12" cy="3" r="1.5" />
    <path d="M7 17v-1" />
    <path d="M17 17v-1" />
  </svg>
);

export const BerradIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-hover-group transition-transform hover:-rotate-6" {...props}>
    <IconStyles />
    <path className="steam-1 opacity-0" d="M12 2v-2" strokeWidth="1.5" />
    <path d="M7 10h10a2 2 0 0 1 2 2v4a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4v-4a2 2 0 0 1 2-2z" />
    <path d="M8 10V8l2-2h4l2 2v2" />
    <circle cx="12" cy="5" r="1" />
    <path d="M19 12c2.5-1 3.5-3 3-5" />
    <path d="M5 12c-2.5 0-4 1.5-3 4s2.5 2 3 2" />
    <circle className="pulse-soft" cx="12" cy="14" r="1.5" fill="currentColor" />
  </svg>
);

export const MsemenIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-hover-group transition-transform hover:scale-105" {...props}>
    <IconStyles />
    <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
    <path className="pulse-soft" d="M8 4v16" />
    <path className="pulse-soft" d="M16 4v16" />
    <path className="pulse-soft" d="M4 8h16" />
    <path className="pulse-soft" d="M4 16h16" />
  </svg>
);

export const ChebakiaIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-hover-group transition-transform hover:rotate-3" {...props}>
    <IconStyles />
    <g className="spin-slow" style={{ transformOrigin: "center" }}>
      <path d="M12 3a4 4 0 0 0-4 4v10a4 4 0 0 0 8 0V7a4 4 0 0 0-4-4z" />
      <path d="M3 12a4 4 0 0 0 4 4h10a4 4 0 0 0 0-8H7a4 4 0 0 0-4 4z" />
      <path d="M9 9l6 6" />
      <path d="M15 9l-6 6" />
    </g>
  </svg>
);

export const GhoribaIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-hover-group transition-transform hover:scale-105" {...props}>
    <IconStyles />
    <circle cx="12" cy="12" r="9" />
    <g className="pulse-soft" style={{ transformOrigin: "center" }}>
      <path d="M9 7l1 2-2 1" />
      <path d="M15 8l-1 2 2 2" />
      <path d="M10 15l2-2 1 2" />
      <path d="M14 16l1-1-1-2" />
      <path d="M8 12l2 1" />
    </g>
  </svg>
);

export const SfenjIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-hover-group transition-transform hover:scale-105" {...props}>
    <IconStyles />
    <circle className="pulse-soft" cx="12" cy="12" r="9" style={{ transformOrigin: "center" }} />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 3c1.5 0 2 .5 2 1" />
    <path d="M21 12c0 1.5-.5 2-1 2" />
    <path d="M6 18c1-1 2-1 3 0" />
  </svg>
);

// === NOUVELLES MATIERES PREMIERES (Raw Materials) ===

export const KhobzIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-hover-group transition-transform hover:scale-105" {...props}>
    <IconStyles />
    <circle cx="12" cy="12" r="9" />
    <g className="pulse-soft" style={{ transformOrigin: "center" }}>
      <path d="M12 7v1" />
      <path d="M8.5 8.5l.7.7" />
      <path d="M15.5 8.5l-.7.7" />
      <path d="M7 12h1" />
      <path d="M16 12h1" />
    </g>
  </svg>
);

export const ZlafaIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-hover-group transition-transform hover:scale-105" {...props}>
    <IconStyles />
    <path className="steam-1 opacity-0" d="M12 4v-2" strokeWidth="1.5" />
    <path className="steam-2 opacity-0" d="M8 5v-2" strokeWidth="1.5" />
    <path className="steam-3 opacity-0" d="M16 5v-2" strokeWidth="1.5" />
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
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-hover-group transition-transform hover:rotate-3" {...props}>
    <IconStyles />
    <path d="M12 2C7 2 3 7 3 13c0 4 3 8 9 9 6-1 9-5 9-9 0-6-4-11-9-11z" />
    <path d="M8 8c1-1.5 2.5-2 4-2" />
    {/* Composed with small leaf for nature/argan tree context */}
    <path className="bounce-soft" d="M18 5c1.5-1.5 3.5-1.5 3.5-1.5s0 2-1.5 3.5c-1 1-2.5 1-2.5 1s0-1.5.5-3z" strokeWidth="1.5" />
    <path d="M17.5 8L16 9" strokeWidth="1.5" />
  </svg>
);

export const OliveOilIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-hover-group transition-transform hover:scale-105" {...props}>
    <IconStyles />
    <path d="M15 3h-6l-1 5a4 4 0 0 0-1 2.5V20a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9.5A4 4 0 0 0 16 8l-1-5z" />
    <path d="M9 3v1" />
    <path d="M15 3v1" />
    <path d="M12 11v1" />
    {/* Contextual badge: oil drop */}
    <path className="pulse-soft" d="M12 13c-.8 0-1.5.7-1.5 1.5 0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5c0-.5-.5-1-1.5-1.5z" fill="currentColor" stroke="none" style={{ transformOrigin: "center" }} />
  </svg>
);


// === EXPANSION ULTRA LOCAL ===

export const RaibiIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-hover-group transition-transform hover:scale-105" {...props}>
    <IconStyles />
    <path d="M6 8l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" />
    <path d="M5 8h14" />
    <path d="M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
    {/* Concentric circles of Raibi Jamila */}
    <circle className="pulse-soft" cx="12" cy="14" r="3" style={{ transformOrigin: "center" }} />
    <circle cx="12" cy="14" r="1" fill="currentColor" />
  </svg>
);

export const MerendinaIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-hover-group transition-transform hover:scale-105" {...props}>
    <IconStyles />
    <rect x="2" y="6" width="20" height="12" rx="3" ry="3" />
    {/* Merendina wavy chocolate lines */}
    <path className="pulse-soft" d="M5 12c1-1 3-1 4 0s3 1 4 0 3-1 4 0" />
    <path className="pulse-soft" d="M5 16c1-1 3-1 4 0s3 1 4 0 3-1 4 0" style={{ animationDelay: '0.2s' }} />
  </svg>
);

export const Khli3Icon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-hover-group transition-transform hover:scale-105" {...props}>
    <IconStyles />
    {/* Clay jar for khli3 */}
    <path d="M6 8c-2 2-3 5-3 8a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3c0-3-1-6-3-8" />
    <path d="M8 4h8" />
    <path d="M7 4v4" />
    <path d="M17 4v4" />
    <path d="M6 8h12" />
    <path className="bounce-soft" d="M12 14v4" />
    <path className="bounce-soft" d="M10 16h4" />
  </svg>
);

export const BoutaIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-hover-group transition-transform hover:scale-105" {...props}>
    <IconStyles />
    <path d="M14 2H10" />
    <path d="M12 2v3" />
    <path d="M8 5h8a2 2 0 0 1 2 2v2H6V7a2 2 0 0 1 2-2z" />
    <path d="M5 9c-1.5 2-2 5-2 8a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3c0-3-.5-6-2-8" />
    <path className="pulse-soft" d="M9 14h6" />
    <path className="pulse-soft" d="M9 18h6" />
  </svg>
);

export const Zeri3aIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-hover-group transition-transform hover:rotate-6" {...props}>
    <IconStyles />
    <path d="M12 3c-4 0-6 4-6 9s2 9 6 9 6-4 6-9-2-9-6-9z" />
    <path d="M12 3v18" strokeDasharray="2 2" />
    <path className="pulse-soft" d="M9 10c0 1 1 2 3 2s3-1 3-2" />
  </svg>
);

// === CULTURE & SHOPPING ===

export const BalghaIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-hover-group transition-transform hover:translate-x-1" {...props}>
    <IconStyles />
    <path d="M3 18h18" />
    <path d="M3 18v-2c0-2 2-3 4-3h6c5 0 8 3 8 5" />
    <path className="bounce-soft" d="M12 13c-2-3-5-4-8-4" />
  </svg>
);

export const JellabaIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-hover-group transition-transform hover:scale-105" {...props}>
    <IconStyles />
    <path d="M12 3L8 9H4l-2 5h3v7h14v-7h3l-2-5h-4l-4-6z" />
    <path d="M12 3v18" />
    <path className="pulse-soft" d="M9 13v8" />
    <path className="pulse-soft" d="M15 13v8" />
  </svg>
);

export const HanoutIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-hover-group transition-transform hover:scale-105" {...props}>
    <IconStyles />
    <path d="M3 7l1.5-4h15L21 7" />
    <path d="M3 7v14h18V7" />
    <path d="M3 7c1 1.5 2.5 1.5 3.5 0 1 1.5 2.5 1.5 3.5 0 1 1.5 2.5 1.5 3.5 0 1 1.5 2.5 1.5 3.5 0" />
    <path d="M9 21V12h6v9" />
    {/* Hanout sign/context indicator */}
    <rect className="pulse-soft" x="9" y="14" width="6" height="3" rx="1" style={{ transformOrigin: "center" }} />
  </svg>
);

// === MARQUES LOCALES (Brands) - AVEC BADGE ===

// Composant Helper pour le Badge Marque (Contextual Indicator)
const BrandBadge = () => (
  <g className="brand-badge" transform="translate(16, 16)">
    <circle cx="4" cy="4" r="4" />
    <path d="M2.5 4L3.5 5L5.5 2.5" fill="none" />
  </g>
);

export const BrandDanoneIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-hover-group transition-transform hover:-translate-y-1" {...props}>
    <IconStyles />
    <path d="M5 6h14l-1.5 14h-11L5 6z" />
    <path d="M4 6h16" />
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <path className="pulse-soft" d="M8 12c1.5 1 3 1.5 4 1.5s2.5-.5 4-1.5" />
    <BrandBadge />
  </svg>
);

export const BrandCentraleIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-hover-group transition-transform hover:scale-105" {...props}>
    <IconStyles />
    <path d="M6 7l6-4 6 4" />
    <path d="M6 7v14h12V7" />
    <path d="M12 3v4" />
    <path d="M8 12h8" />
    <path d="M8 16h8" />
    <circle className="pulse-soft" cx="12" cy="14" r="1.5" style={{ transformOrigin: "center" }} />
    <BrandBadge />
  </svg>
);

export const BrandSidiAliIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-hover-group transition-transform hover:-translate-y-1" {...props}>
    <IconStyles />
    <path d="M9 5h6" />
    <path d="M10 5V3h4v2" />
    <path d="M9 5l-1 4v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V9l-1-4" />
    <path d="M8 13h8" />
    <path d="M8 17h8" />
    <path className="pulse-soft" d="M11 9c.5.5 1.5.5 2 0" />
    <BrandBadge />
  </svg>
);

export const BrandLesieurIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-hover-group transition-transform hover:scale-105" {...props}>
    <IconStyles />
    <path d="M12 2C8 6 5 11 5 16a7 7 0 0 0 14 0c0-5-3-10-7-14z" />
    <circle className="pulse-soft" cx="12" cy="16" r="3" style={{ transformOrigin: "center" }} />
    <BrandBadge />
  </svg>
);

export const BrandBimoIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-hover-group transition-transform hover:rotate-2" {...props}>
    <IconStyles />
    <rect x="3" y="6" width="18" height="12" rx="2" ry="2" />
    <g className="pulse-soft" style={{ transformOrigin: "center" }}>
      <circle cx="7" cy="10" r="1" />
      <circle cx="12" cy="10" r="1" />
      <circle cx="17" cy="10" r="1" />
      <circle cx="7" cy="14" r="1" />
      <circle cx="12" cy="14" r="1" />
      <circle cx="17" cy="14" r="1" />
    </g>
    <path d="M3 10h1" />
    <path d="M3 14h1" />
    <path d="M20 10h1" />
    <path d="M20 14h1" />
    <BrandBadge />
  </svg>
);
\`;
fs.writeFileSync('src/components/icons/MoroccanIcons.tsx', iconsCode);

// Add the new ultra local icons to objects.json
let objects = JSON.parse(fs.readFileSync('src/iconmatcher/database/objects.json', 'utf-8'));

objects.push({
  id: "raibi",
  name_fr: "Raibi Jamila",
  name_ar: "رايبي جميلة",
  name_en: "Raibi Jamila",
  keywords: ["raibi", "jamila", "raybi", "رايبي"],
  category: "Gourmandises",
  icon: "RaibiIcon"
});

objects.push({
  id: "merendina",
  name_fr: "Merendina",
  name_ar: "ميريندينا",
  name_en: "Merendina",
  keywords: ["merendina", "mirendina", "bimo", "ميريندينا"],
  category: "Gourmandises",
  icon: "MerendinaIcon"
});

objects.push({
  id: "khli3",
  name_fr: "Khlii",
  name_ar: "خليع",
  name_en: "Khlii",
  keywords: ["khlii", "khli3", "خليع"],
  category: "Protéines",
  icon: "Khli3Icon"
});

objects.push({
  id: "bouta",
  name_fr: "Bouteille de gaz",
  name_ar: "بوطة",
  name_en: "Gas cylinder",
  keywords: ["bouta", "gaz", "bota", "بوطة", "بوطا", "gaz"],
  category: "Logement",
  icon: "BoutaIcon"
});

objects.push({
  id: "zeri3a",
  name_fr: "Graines (Zeri3a)",
  name_ar: "زريعة",
  name_en: "Sunflower seeds",
  keywords: ["zeri3a", "pipas", "graines", "زريعة"],
  category: "Gourmandises",
  icon: "Zeri3aIcon"
});

fs.writeFileSync('src/iconmatcher/database/objects.json', JSON.stringify(objects, null, 2));

