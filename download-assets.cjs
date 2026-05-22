const fs = require('fs');
const https = require('https');
const path = require('path');

const url = "https://i.postimg.cc/8k2Y4Hfr/icon.png";
const destDir = path.join(__dirname, 'assets');

if (!fs.existsSync(destDir)){
    fs.mkdirSync(destDir);
}

const filePaths = ['icon.png', 'splash.png', 'logo.png'].map(f => path.join(destDir, f));

https.get(url, (res) => {
    if (res.statusCode !== 200) {
        console.error('Failed to download image. Status code:', res.statusCode);
        process.exit(1);
    }
    
    let data = [];
    res.on('data', chunk => {
        data.push(chunk);
    });
    
    res.on('end', () => {
        const buffer = Buffer.concat(data);
        for(const p of filePaths) {
            fs.writeFileSync(p, buffer);
            console.log('Saved', p);
        }
        
        // Also save to public folder for PWA
        const publicIcon = path.join(__dirname, 'public', 'icon.png');
        const publicLogo = path.join(__dirname, 'public', 'logo.png');
        fs.writeFileSync(publicIcon, buffer);
        fs.writeFileSync(publicLogo, buffer);
        console.log('Saved', publicIcon);
    });
}).on('error', (err) => {
    console.error('Download error:', err.message);
    process.exit(1);
});
