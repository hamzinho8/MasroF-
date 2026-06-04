const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  // Set viewport to 1024x1024
  await page.setViewport({ width: 1024, height: 1024 });

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        body, html { margin: 0; padding: 0; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; background: transparent; }
        img { width: 1024px; height: 1024px; object-fit: contain; }
      </style>
    </head>
    <body>
      <img src="https://i.postimg.cc/8k2Y4Hfr/icon.png" />
    </body>
    </html>
  `;
  await page.setContent(html);
  
  // Wait for the image to load
  await page.waitForSelector('img');
  await page.waitForFunction(() => {
     const img = document.querySelector('img');
     return img.complete && img.naturalHeight !== 0;
  }, { timeout: 15000 });
  
  const element = await page.$('img');
  await element.screenshot({ path: 'assets/icon.png', omitBackground: true });
  await element.screenshot({ path: 'assets/logo.png', omitBackground: true });
  
  // Splash screen 2732x2732
  await page.setViewport({ width: 2732, height: 2732 });
  const htmlSplash = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        body, html { margin: 0; padding: 0; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; background: #2D8B96; }
        img { width: 1024px; height: 1024px; object-fit: contain; }
      </style>
    </head>
    <body>
      <img src="https://i.postimg.cc/8k2Y4Hfr/icon.png" />
    </body>
    </html>
  `;
  await page.setContent(htmlSplash);
  await page.waitForSelector('img');
  await page.waitForFunction(() => {
     const img = document.querySelector('img');
     return img.complete && img.naturalHeight !== 0;
  });
  await page.screenshot({ path: 'assets/splash.png' });
  
  await browser.close();
  console.log('Images generated successfully using Puppeteer.');
})();
