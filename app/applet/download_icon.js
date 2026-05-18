const fs = require('fs');
const https = require('https');
const path = require('path');

if (!fs.existsSync('assets')) {
  fs.mkdirSync('assets');
}

const file = fs.createWriteStream("assets/icon.png");
https.get("https://i.postimg.cc/NgL8Br5m/icone.png", function(response) {
  response.pipe(file);
  file.on("finish", () => {
    file.close();
    fs.copyFileSync("assets/icon.png", "assets/splash.png");
    console.log("Download completed");
  });
});
