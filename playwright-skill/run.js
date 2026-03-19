const { chromium } = require("playwright");
const {
  takeScreenshot,
  navigateTo,
  clickElement,
  fillInput,
  waitForSelector,
  extractText,
  evaluateScript,
} = require("./lib/helpers");

async function main() {
  const args = process.argv.slice(2);
  const action = args[0];
  const target = args[1];
  const value = args[2];

  if (!action) {
    console.error(
      "Usage: node run.js <action> [target] [value]\n" +
        "Actions: screenshot, navigate, click, fill, wait, extract, evaluate"
    );
    process.exit(1);
  }

  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    userAgent:
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  });

  const page = await context.newPage();

  try {
    switch (action) {
      case "screenshot":
        await navigateTo(page, target || "about:blank");
        await takeScreenshot(page, value || "screenshot.png");
        break;

      case "navigate":
        if (!target) throw new Error("URL required for navigate");
        await navigateTo(page, target);
        console.log(`Navigated to: ${page.url()}`);
        break;

      case "click":
        if (!target) throw new Error("Selector required for click");
        await navigateTo(page, value || "about:blank");
        await clickElement(page, target);
        break;

      case "fill":
        if (!target || !value)
          throw new Error("Selector and value required for fill");
        await fillInput(page, target, value);
        break;

      case "wait":
        if (!target) throw new Error("Selector required for wait");
        await waitForSelector(page, target, value ? parseInt(value) : 30000);
        break;

      case "extract":
        if (!target) throw new Error("URL required for extract");
        await navigateTo(page, target);
        const text = await extractText(page, value);
        console.log(text);
        break;

      case "evaluate":
        if (!target) throw new Error("URL required for evaluate");
        await navigateTo(page, target);
        const result = await evaluateScript(page, value || "document.title");
        console.log(JSON.stringify(result, null, 2));
        break;

      default:
        console.error(`Unknown action: ${action}`);
        process.exit(1);
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

main();
