import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const replacement1 = `      if (
        inventoryAlertThreshold !== null &&
        item.quantity === inventoryAlertThreshold &&
        item.unitType !== 'grams' &&
        item.unitType !== 'liters' &&
        item.quantity > 0
      ) {
        addNotification(
          "Inventaire",
          \`Alarme Stock: La quantité de l'article "\${item.name}" est \${inventoryAlertThreshold}.\`
        );
      } else if (
        inventoryAlertThreshold !== null &&
        item.quantity !== inventoryAlertThreshold &&
        item.unitType !== 'grams' &&
        item.unitType !== 'liters'
      ) {
        removeNotification(\`Alarme Stock: La quantité de l'article "\${item.name}" est \${inventoryAlertThreshold}.\`);
      }`;

// Wait, I should just find the exact text in App.tsx to replace.
