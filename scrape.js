const { chromium } = require('playwright');

const SEEDS = [84, 85, 86, 87, 88, 89, 90, 91, 92, 93];
const BASE_URL = 'https://sanand0.github.io/tdsdata/js_table/';

async function scrapeAll() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  let grandTotal = 0;

  for (const seed of SEEDS) {
    const url = `${BASE_URL}?seed=${seed}`;
    console.log(`\nScraping seed ${seed}: ${url}`);

    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    } catch (e) {
      console.log(`  Seed ${seed}: page load timeout, trying anyway...`);
    }

    // Wait for table to appear in DOM
    try {
      await page.waitForSelector('table td', { timeout: 15000 });
    } catch (e) {
      console.log(`  Seed ${seed}: no table found after waiting, skipping`);
      continue;
    }

    // Extra wait to ensure all rows are rendered
    await page.waitForTimeout(3000);

    // Extract all numeric values from all table cells
    const numbers = await page.$$eval('table td', (cells) => {
      const results = [];
      for (const cell of cells) {
        const text = cell.innerText.trim().replace(/,/g, '');
        const num = parseFloat(text);
        if (!isNaN(num) && text !== '') {
          results.push(num);
        }
      }
      return results;
    });

    const seedTotal = numbers.reduce((sum, n) => sum + n, 0);
    console.log(`  Seed ${seed}: found ${numbers.length} numbers, subtotal = ${seedTotal}`);
    grandTotal += seedTotal;
  }

  await browser.close();

  console.log('\n=============================');
  console.log(`GRAND TOTAL: ${grandTotal}`);
  console.log('=============================');
}

scrapeAll().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
