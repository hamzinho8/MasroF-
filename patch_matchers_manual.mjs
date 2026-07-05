import fs from 'fs';

// BrandMatcher
let content = fs.readFileSync('src/iconmatcher/engine/BrandMatcher.ts', 'utf-8');
content = content.replace(
  /brand\.aliases\.some\(alias => normalizedInput\.includes\(alias\)\)/g,
  `brand.aliases.some(alias => {
      const regex = new RegExp(\`(?:^|\\\\s)\${alias}(?:\\\\s|$)\`, 'i');
      return regex.test(normalizedInput);
    })`
);
fs.writeFileSync('src/iconmatcher/engine/BrandMatcher.ts', content);

// ProductMatcher
content = fs.readFileSync('src/iconmatcher/engine/ProductMatcher.ts', 'utf-8');
content = content.replace(
  /product\.aliases\.some\(alias => normalizedInput\.includes\(alias\)\)/g,
  `product.aliases.some(alias => {
      const regex = new RegExp(\`(?:^|\\\\s)\${alias}(?:\\\\s|$)\`, 'i');
      return regex.test(normalizedInput);
    })`
);
fs.writeFileSync('src/iconmatcher/engine/ProductMatcher.ts', content);

// AliasMatcher
content = fs.readFileSync('src/iconmatcher/engine/AliasMatcher.ts', 'utf-8');
content = content.replace(
  /const regex = new RegExp.*/g,
  `if (new RegExp(\`(?:^|\\\\s)\${alias}(?:\\\\s|$)\`, 'i').test(normalizedInput)) {`
);
content = content.replace(/if \(regex\.test\(normalizedInput\)\) \{/g, "");
fs.writeFileSync('src/iconmatcher/engine/AliasMatcher.ts', content);

