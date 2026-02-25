const { chromium } = require('playwright');

const SEEDS = [84, 85, 86, 87, 88, 89, 90, 91, 92, 93];
const BASE_URL = 'https://sanand0.github.io/tdsdata/datadash/';

async function scrapeAll() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  let grandTotal = 0;

  for (const seed of SEEDS) {
    const url = `${BASE_URL}?seed=${seed}`;
    console.log(`\nScraping seed ${seed}: ${url}`);

    await page.goto(url, { waitUntil: 'networkidle' });

    // Wait for tables to render
    await page.waitForTimeout(2000);

    // Extract all numbers from all table cells
    const numbers = await page.$$eval('table td, table th', (cells) =>
      cells
        .map(cell => cell.innerText.trim())
        .filter(text => text !== '' && !isNaN(text.replace(/,/g, '')))
        .map(text => parseFloat(text.replace(/,/g, '')))
    );

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
  console.error(err);
  process.exit(1);
});
