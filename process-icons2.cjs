const fs = require('fs');
const https = require('https');
const sharp = require('sharp');

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
            return download(actualUrl, path).then(resolve).catch(reject);
        }
        const stream = fs.createWriteStream(path);
        res.pipe(stream);
        stream.on('finish', () => { stream.close(); resolve(); });
    }).on('error', reject);
});

(async () => {
    try {
        console.log('Downloading...');
        await download(url, 'assets/temp_icon.png');
        console.log('Processing...');
        const metadata = await sharp('assets/temp_icon.png').metadata();
        const size = Math.min(metadata.width, metadata.height);

        const iconBuffer = await sharp('assets/temp_icon.png')
            .extract({
                left: Math.floor((metadata.width - size) / 2),
                top: Math.floor((metadata.height - size) / 2),
                width: size,
                height: size
            })
            .toBuffer();

        await sharp(iconBuffer).toFile('assets/icon.png');
        await sharp(iconBuffer).toFile('assets/logo.png');

        const splashBg = await sharp({
            create: { width: 2732, height: 2732, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } }
        }).png().toBuffer();

        const splashIconBuf = await sharp(iconBuffer).resize(1024, 1024).toBuffer();

        await sharp(splashBg)
            .composite([{ input: splashIconBuf, gravity: 'center' }])
            .toFile('assets/splash.png');

        async function makeNotifIcon(size, dpi) {
            const resized = await sharp(iconBuffer).resize(size, size).toBuffer();
            const alpha = await sharp(resized).ensureAlpha().extractChannel('alpha').toBuffer();
            
            const whiteBg = await sharp({
                create: { width: size, height: size, channels: 3, background: { r: 255, g: 255, b: 255 } }
            }).raw().toBuffer();

            const finalIcon = await sharp(whiteBg, { raw: { width: size, height: size, channels: 3 } })
                .joinChannel(alpha)
                .png()
                .toBuffer();
                
            const folder = `android/app/src/main/res/drawable-${dpi}`;
            if (!fs.existsSync(folder)) {
                fs.mkdirSync(folder, { recursive: true });
            }
            await sharp(finalIcon).toFile(`${folder}/ic_stat_name.png`);
        }

        const sizes = { 'mdpi': 24, 'hdpi': 36, 'xhdpi': 48, 'xxhdpi': 72, 'xxxhdpi': 96 };
        for (const [dpi, s] of Object.entries(sizes)) {
            await makeNotifIcon(s, dpi);
        }

        console.log('DONE');
    } catch(err) {
        console.error(err);
    }
})();
