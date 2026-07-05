import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

const target = `      // Check estimations
      const dailyStr = localStorage.getItem("inshallah_daily");
      const remainingStr = localStorage.getItem("inshallah_remaining");
      
      if (dailyStr && dailyStr !== "null") {
        const dVal = parseFloat(dailyStr);
        if (!isNaN(dVal) && dVal > balance) {
          newsItems.push(\`<b><font color="#E11D48">⚠️ Il faut retirer de l'argent.</font></b>\`);
        }
      }
      
      if (remainingStr && remainingStr !== "null") {
        const rVal = parseFloat(remainingStr);
        if (!isNaN(rVal) && rVal > bankBalance) {
          newsItems.push(\`<b><font color="#E11D48">🚨 Alert, il faut économiser tes dépenses.</font></b>\`);
        }
      }`;

content = content.replace(target, "");
fs.writeFileSync('src/App.tsx', content);
