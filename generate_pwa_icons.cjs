const fs = require('fs');
const sharp = require('sharp');

(async () => {
    try {
        console.log('Generating PWA icons...');
        const sizes = [48, 72, 96, 128, 192, 256, 512];
        
        if (!fs.existsSync('icons')) {
            fs.mkdirSync('icons');
        }

        const metadata = await sharp('assets/temp_icon.png').metadata();
        const sqSize = Math.min(metadata.width, metadata.height);

        const iconBuffer = await sharp('assets/temp_icon.png')
            .extract({
                left: Math.floor((metadata.width - sqSize) / 2),
                top: Math.floor((metadata.height - sqSize) / 2),
                width: sqSize,
                height: sqSize
            })
            .toBuffer();

        for (const size of sizes) {
            await sharp(iconBuffer)
                .resize(size, size)
                .png()
                .toFile(`icons/icon-${size}.png`);
        }
        
        console.log('Writing to public/logo.png');
        await sharp(iconBuffer).resize(512, 512).png().toFile('public/logo.png');
        
        console.log('DONE');
    } catch(e) {
        console.error(e);
    }
})();
