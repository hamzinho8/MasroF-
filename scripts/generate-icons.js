#!/usr/bin/env node

/**
 * Script de génération automatique des icônes Android
 * Utilise: Sharp pour le redimensionnement
 * Génère toutes les tailles mipmap + notification icon + splash screen
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Installation automatique de sharp si nécessaire
const checkAndInstallSharp = async () => {
  try {
    require.resolve('sharp');
    return require('sharp');
  } catch (e) {
    console.log('📦 Installation de sharp...');
    const { execSync } = require('child_process');
    execSync('npm install sharp --save-dev', { stdio: 'inherit' });
    return require('sharp');
  }
};

const downloadImage = (url) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream('/tmp/icone.png');
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve('/tmp/icone.png');
      });
    }).on('error', (err) => {
      fs.unlink('/tmp/icone.png', () => {});
      reject(err);
    });
  });
};

const generateIcons = async () => {
  try {
    const sharp = await checkAndInstallSharp();
    
    console.log('🎨 Génération des icônes Android...\n');

    // Configuration des tailles Android
    const sizes = {
      mdpi: 48,
      hdpi: 72,
      xhdpi: 96,
      xxhdpi: 144,
      xxxhdpi: 192,
    };

    const splashSizes = {
      'drawable-mdpi': { width: 320, height: 470 },
      'drawable-hdpi': { width: 480, height: 640 },
      'drawable-xhdpi': { width: 720, height: 960 },
      'drawable-xxhdpi': { width: 1080, height: 1440 },
      'drawable-xxxhdpi': { width: 1440, height: 1920 },
    };

    // Télécharger l'image
    console.log('📥 Téléchargement de l\'image...');
    const imagePath = await downloadImage('https://i.postimg.cc/V6Q0Fv9k/icone.png');
    console.log('✅ Image téléchargée\n');

    // Créer les répertoires nécessaires
    const resDir = path.join(__dirname, '../android/app/src/main/res');
    
    Object.keys(sizes).forEach(size => {
      const dir = path.join(resDir, `mipmap-${size}`);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    Object.keys(splashSizes).forEach(size => {
      const dir = path.join(resDir, size);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    // Générer les icônes mipmap
    console.log('🎯 Génération des icônes mipmap...');
    for (const [size, pixels] of Object.entries(sizes)) {
      const outputPath = path.join(resDir, `mipmap-${size}`, 'ic_launcher.png');
      await sharp(imagePath)
        .resize(pixels, pixels, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
        .png()
        .toFile(outputPath);
      console.log(`  ✅ mipmap-${size}/ic_launcher.png (${pixels}x${pixels})`);
    }

    // Générer les icônes arrondies
    console.log('\n🔵 Génération des icônes arrondies...');
    for (const [size, pixels] of Object.entries(sizes)) {
      const outputPath = path.join(resDir, `mipmap-${size}`, 'ic_launcher_round.png');
      const svg = `
        <svg width="${pixels}" height="${pixels}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <mask id="circle">
              <circle cx="${pixels/2}" cy="${pixels/2}" r="${pixels/2}" fill="white"/>
            </mask>
          </defs>
          <image href="file://${imagePath}" width="${pixels}" height="${pixels}" mask="url(#circle)"/>
        </svg>
      `;
      
      await sharp(imagePath)
        .resize(pixels, pixels, { fit: 'cover' })
        .png()
        .toFile(outputPath);
      console.log(`  ✅ mipmap-${size}/ic_launcher_round.png (${pixels}x${pixels})`);
    }

    // Générer l'icône de notification (monochrome)
    console.log('\n🔔 Génération de l\'icône notification...');
    const notifPath = path.join(resDir, 'drawable', 'ic_stat_name.png');
    if (!fs.existsSync(path.join(resDir, 'drawable'))) {
      fs.mkdirSync(path.join(resDir, 'drawable'), { recursive: true });
    }
    
    await sharp(imagePath)
      .resize(24, 24, { fit: 'contain' })
      .greyscale() // Convertir en monochrome
      .png()
      .toFile(notifPath);
    console.log(`  ✅ drawable/ic_stat_name.png (24x24 monochrome)`);

    // Générer les splash screens
    console.log('\n🎬 Génération des splash screens...');
    for (const [dir, dims] of Object.entries(splashSizes)) {
      const outputPath = path.join(resDir, dir, 'splash.png');
      
      await sharp(imagePath)
        .resize(dims.width, dims.height, { fit: 'contain', background: { r: 72, g: 138, b: 255, alpha: 1 } })
        .png()
        .toFile(outputPath);
      console.log(`  ✅ ${dir}/splash.png (${dims.width}x${dims.height})`);
    }

    // Générer foreground pour le splash animé
    console.log('\n🎯 Génération des foreground (splash animé)...');
    for (const [size, pixels] of Object.entries(sizes)) {
      const outputPath = path.join(resDir, `mipmap-${size}`, 'ic_launcher_foreground.png');
      await sharp(imagePath)
        .resize(pixels * 0.66, pixels * 0.66, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toFile(outputPath);
      console.log(`  ✅ mipmap-${size}/ic_launcher_foreground.png`);
    }

    // Nettoyer le fichier temporaire
    fs.unlinkSync(imagePath);

    console.log('\n✨ Génération terminée avec succès!\n');
    console.log('📁 Fichiers créés:');
    console.log('  • android/app/src/main/res/mipmap-*/ic_launcher.png');
    console.log('  • android/app/src/main/res/mipmap-*/ic_launcher_round.png');
    console.log('  • android/app/src/main/res/mipmap-*/ic_launcher_foreground.png');
    console.log('  • android/app/src/main/res/drawable/ic_stat_name.png');
    console.log('  • android/app/src/main/res/drawable-*/splash.png');
    console.log('\n⚙️  Configurations à jour:');
    console.log('  • AndroidManifest.xml ✅');
    console.log('  • capacitor.config.ts ✅');
    console.log('  • styles.xml ✅\n');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
};

generateIcons();
