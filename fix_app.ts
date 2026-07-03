import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Fix the console.warn alert logic for inventory
const inventoryAlertLogic1 = `    inventoryItems.forEach((item: any) => {
      if (
        inventoryAlertThreshold !== null &&
        item.quantity === inventoryAlertThreshold &&
        !alertedInventoryRef.current[item.id]
      ) {`;
const newInventoryAlertLogic1 = `    inventoryItems.forEach((item: any) => {
      const isVrac = item.unitType === 'grams' || item.unitType === 'liters';
      if (
        inventoryAlertThreshold !== null &&
        item.quantity === inventoryAlertThreshold &&
        !alertedInventoryRef.current[item.id] &&
        !isVrac
      ) {`;
content = content.replace(inventoryAlertLogic1, newInventoryAlertLogic1);

// 2. Fix the widget HTML logic for inventory
const inventoryAlertLogic2 = `      if (inventoryAlertThreshold !== null) {
        inventoryItems.forEach((item) => {
          if (item.quantity > 0 && item.quantity <= inventoryAlertThreshold) {`;
const newInventoryAlertLogic2 = `      if (inventoryAlertThreshold !== null) {
        inventoryItems.forEach((item) => {
          const isVrac = item.unitType === 'grams' || item.unitType === 'liters';
          if (item.quantity > 0 && item.quantity <= inventoryAlertThreshold && !isVrac) {`;
content = content.replace(inventoryAlertLogic2, newInventoryAlertLogic2);

fs.writeFileSync('src/App.tsx', content);
