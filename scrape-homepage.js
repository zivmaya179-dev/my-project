const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://mayaziv-law.co.il', { waitUntil: 'networkidle', timeout: 30000 });

  const title = await page.title();
  console.log('Page Title:', title);
  console.log('URL:', page.url());

  const text = await page.evaluate(() => document.body.innerText);
  console.log('\n--- Page Content ---\n');
  console.log(text);

  await page.screenshot({ path: 'homepage.png', fullPage: true });
  console.log('\nScreenshot saved to homepage.png');

  await browser.close();
})();
