import puppeteer from 'puppeteer';

(async () => {
  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
    
    await page.goto('http://localhost:4173', { waitUntil: 'networkidle0', timeout: 10000 });
    
    // Wait for a second to let React settle and throw if it wants to
    await new Promise(r => setTimeout(r, 1000));
    
    await browser.close();
  } catch (err) {
    console.error('PUPPETEER ERROR:', err);
    process.exit(1);
  }
})();
