import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import fs from "fs";

const URL =
  "https://filmdistributorsassociation.com/release-schedule/this-weeks-releases/";

async function scrapeFDA() {
  const html = await fetch(URL).then(r => r.text());
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  // FDA uses a table for releases
  const rows = [...doc.querySelectorAll("table tr")];

  const items = rows
    .map(row => {
      const title = row.querySelector("td:nth-child(1)")?.textContent?.trim();
      const distributor = row
        .querySelector("td:nth-child(2)")
        ?.textContent?.trim();
      const date = row.querySelector("td:nth-child(3)")?.textContent?.trim();

      // FDA does not provide per-film links, so fallback to main page
      const link = URL;

      return { title, distributor, date, link };
    })
    .filter(item => item.title && item.title.length > 0);

  // Ensure data folder exists
  if (!fs.existsSync("data")) {
    fs.mkdirSync("data");
  }

  fs.writeFileSync("data/releases.json", JSON.stringify(items, null, 2));
  console.log(`Saved ${items.length} items to data/releases.json`);
}

scrapeFDA().catch(err => {
  console.error("Scrape failed:", err);
});
