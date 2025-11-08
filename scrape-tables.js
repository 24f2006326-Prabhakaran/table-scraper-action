const { chromium } = require('playwright');

const seeds = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const baseUrl = 'https://sanand0.github.io/tdsdata/js_table/?seed=';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  let grandTotal = 0;
  
  for (const seed of seeds) {
    const url = baseUrl + seed;
    console.log(`\n========================================`);
    console.log(`Scraping Seed ${seed}: ${url}`);
    console.log(`========================================`);
    
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      
      // Wait for tables to load
      await page.waitForSelector('table', { timeout: 10000 });
      
      // Extract all numbers from all tables
      const numbers = await page.evaluate(() => {
        const tables = document.querySelectorAll('table');
        const allNumbers = [];
        
        tables.forEach((table, tableIndex) => {
          const cells = table.querySelectorAll('td, th');
          cells.forEach(cell => {
            const text = cell.textContent.trim();
            // Extract all numbers from the cell text (including negative and decimals)
            const matches = text.match(/-?\d+\.?\d*/g);
            if (matches) {
              matches.forEach(match => {
                const num = parseFloat(match);
                if (!isNaN(num)) {
                  allNumbers.push(num);
                }
              });
            }
          });
        });
        
        return allNumbers;
      });
      
      const pageSum = numbers.reduce((a, b) => a + b, 0);
      console.log(`Numbers found: ${numbers.length}`);
      console.log(`Sum for Seed ${seed}: ${pageSum}`);
      grandTotal += pageSum;
      
    } catch (error) {
      console.error(`Error scraping Seed ${seed}:`, error.message);
    }
  }
  
  console.log(`\n========================================`);
  console.log(`========================================`);
  console.log(`   GRAND TOTAL: ${grandTotal}`);
  console.log(`========================================`);
  console.log(`========================================\n`);
  
  await browser.close();
})();
