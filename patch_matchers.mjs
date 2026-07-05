import fs from 'fs';

function patchMatcher(file) {
  let content = fs.readFileSync(file, 'utf-8');
  
  content = content.replace(
    /if \(normalizedInput\.includes\((\w+)\)\) \{/g,
    `
    const regex = new RegExp(\`(?:^|\\\\s)\${\\$1}(?:\\\\s|$)\`, 'i');
    if (regex.test(normalizedInput)) {`
  );
  
  fs.writeFileSync(file, content);
}

patchMatcher('src/iconmatcher/engine/AliasMatcher.ts');
patchMatcher('src/iconmatcher/engine/BrandMatcher.ts');
patchMatcher('src/iconmatcher/engine/ProductMatcher.ts');

