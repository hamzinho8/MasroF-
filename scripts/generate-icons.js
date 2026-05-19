import https from 'https';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Téléchargez l'image depuis une URL
const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(filepath);
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
};

const generateIcons = async () => {
  try {
    console.log('📥 Téléchargement de l\'image...');
    const imagePath = path.join(__dirname, 'icon-source.png');
    await downloadImage(process.env.IMAGE_URL || 'https://i.postimg.cc/V6Q0Fv9k/icone.png', imagePath);
    console.log('✅ Image téléchargée avec succès');

    const resDir = path.join(__dirname, '../android/app/src/main/res');
    const mipmapSizes = {
      'mdpi': 48,
      'hdpi': 72,
      'xhdpi': 96,
      'xxhdpi': 144,
      'xxxhdpi': 192
    };
    const splashSizes = {
      'drawable-mdpi': { width: 320, height: 470 },
      'drawable-hdpi': { width: 480, height: 800 },
      'drawable-xhdpi': { width: 720, height: 1280 },
      'drawable-xxhdpi': { width: 1080, height: 1920 },
      'drawable-xxxhdpi': { width: 1440, height: 2560 }
    };

    for (const [mipmap, size] of Object.entries(mipmapSizes)) {
      const outputDir = path.join(resDir, `mipmap-${mipmap}`);
      fs.mkdirSync(outputDir, { recursive: true });
      await sharp(imagePath)
        .resize(size, size)
        .png()
        .toFile(path.join(outputDir, 'ic_launcher.png'));
      console.log(`✅ Généré : mipmap-${mipmap}/ic_launcher.png`);
    }

    for (const [drawable, { width, height }] of Object.entries(splashSizes)) {
      const outputDir = path.join(resDir, drawable);
      fs.mkdirSync(outputDir, { recursive: true });
      await sharp(imagePath)
        .resize(width, height)
        .png()
        .toFile(path.join(outputDir, 'splash.png'));
      console.log(`✅ Généré : ${drawable}/splash.png`);
    }

    console.log('🎉 Toutes les icônes et les splash screens ont été générés avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de la génération :', error);
    process.exit(1);
  }
};

generateIcons();