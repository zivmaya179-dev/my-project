/**
 * Navigate to a URL and wait for the page to be fully loaded.
 */
async function navigateTo(page, url) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
}

/**
 * Take a screenshot of the current page.
 */
async function takeScreenshot(page, outputPath) {
  await page.screenshot({ path: outputPath, fullPage: true });
  console.log(`Screenshot saved to: ${outputPath}`);
}

/**
 * Click an element matching the given selector.
 */
async function clickElement(page, selector) {
  await page.waitForSelector(selector, { timeout: 10000 });
  await page.click(selector);
  console.log(`Clicked: ${selector}`);
}

/**
 * Fill an input field matching the given selector with a value.
 */
async function fillInput(page, selector, value) {
  await page.waitForSelector(selector, { timeout: 10000 });
  await page.fill(selector, value);
  console.log(`Filled "${selector}" with value`);
}

/**
 * Wait for a selector to appear on the page.
 */
async function waitForSelector(page, selector, timeout = 30000) {
  await page.waitForSelector(selector, { timeout });
  console.log(`Found: ${selector}`);
}

/**
 * Extract text content from the page or a specific selector.
 */
async function extractText(page, selector) {
  if (selector) {
    const element = await page.waitForSelector(selector, { timeout: 10000 });
    return element.textContent();
  }
  return page.evaluate(() => document.body.innerText);
}

/**
 * Evaluate a JavaScript expression in the browser context.
 */
async function evaluateScript(page, script) {
  return page.evaluate(script);
}

module.exports = {
  navigateTo,
  takeScreenshot,
  clickElement,
  fillInput,
  waitForSelector,
  extractText,
  evaluateScript,
};
