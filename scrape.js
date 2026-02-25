const { chromium } = require('playwright');

const SEEDS = [84, 85, 86, 87, 88, 89, 90, 91, 92, 93];
const BASE_URL = 'https://sanand0.github.io/tdsdata/datadash/';

async function scrapeAll() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Just inspect seed 84 first to see the HTML structure
  const url = `${BASE_URL}?seed=84`;
  console.log(`Inspecting: ${url}`);

  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(5000);

  // Print full page HTML so we can see what elements exist
  const html = await page.content();
  console.log('=== PAGE HTML ===');
  console.log(html.substring(0, 5000)); // first 5000 chars

  // Also print all text on the page
  const bodyText = await page.innerText('body');
  console.log('=== BODY TEXT ===');
  console.log(bodyText.substring(0, 2000));

  await browser.close();
}

scrapeAll().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
