const fs = require('fs');
const https = require('https');
const Jimp = require('jimp');

const url = 'https://i.postimg.cc/V6Q0Fv9k/icone.png';
const download = (url, path) => new Promise((resolve, reject) => {
    https.get(url, (res) => {
        let actualUrl = url;
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            actualUrl = res.headers.location;
            if (actualUrl.startsWith('/')) {
                const parsed = new URL(url);
                actualUrl = parsed.protocol + '//' + parsed.host + actualUrl;
            }
            console.log('Redirecting to:', actualUrl);
            return download(actualUrl, path).then(resolve).catch(reject);
        }
        const stream = fs.createWriteStream(path);
        res.pipe(stream);
        stream.on('finish', () => { stream.close(); resolve(); });
    }).on('error', reject);
});

(async () => {
    try {
        console.log('Downloading image...');
        await download(url, 'assets/temp_icon.png');
        console.log('Reading image...');
        const image = await Jimp.read('assets/temp_icon.png');
        
        console.log('Cropping image...');
        const size = Math.min(image.bitmap.width, image.bitmap.height);
        image.crop(
            (image.bitmap.width - size) / 2,
            (image.bitmap.height - size) / 2,
            size,
            size
        );

        console.log('Writing icon...');
        await image.writeAsync('assets/icon.png');
        
        console.log('Writing splash...');
        const splash = new Jimp(2732, 2732, '#ffffff');
        const resizedIcon = image.clone().resize(1024, 1024);
        splash.composite(resizedIcon, (2732-1024)/2, (2732-1024)/2);
        await splash.writeAsync('assets/splash.png');

        console.log('Creating notification icons...');
        const notif = image.clone().resize(96, 96);
        notif.scan(0, 0, notif.bitmap.width, notif.bitmap.height, function(x, y, idx) {
            const a = this.bitmap.data[idx+3];
            if (a > 64) {
                this.bitmap.data[idx] = 255;
                this.bitmap.data[idx+1] = 255;
                this.bitmap.data[idx+2] = 255;
                this.bitmap.data[idx+3] = 255;
            } else {
                this.bitmap.data[idx] = 0;
                this.bitmap.data[idx+1] = 0;
                this.bitmap.data[idx+2] = 0;
                this.bitmap.data[idx+3] = 0;
            }
        });

        const sizes = {
            'mdpi': 24,
            'hdpi': 36,
            'xhdpi': 48,
            'xxhdpi': 72,
            'xxxhdpi': 96
        };
        for (const [dpi, s] of Object.entries(sizes)) {
            const notifResized = notif.clone().resize(s, s);
            const folder = `android/app/src/main/res/drawable-${dpi}`;
            if (!fs.existsSync(folder)) {
                fs.mkdirSync(folder, { recursive: true });
            }
            await notifResized.writeAsync(`${folder}/ic_stat_name.png`);
        }

        console.log('DONE');
    } catch(err) {
        console.error('Error:', err);
    }
})();
