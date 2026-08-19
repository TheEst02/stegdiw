import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import fs from "fs";

const URL =
  "https://filmdistributorsassociation.com/release-schedule/this-weeks-releases/";

async function scrapeFDA() {
  const html = await fetch(URL).then(r => r.text());
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  // NOTE: you’ll likely need to tweak these selectors
  const blocks = [...doc.querySelectorAll(".release-item, .release")];

  const items = blocks.map(el => {
    const title =
      el.querySelector("h3, .film-title")?.textContent.trim() ?? null;
    const distributor =
      el.querySelector(".distributor")?.textContent.trim() ?? null;
    const date =
      el.querySelector(".release-date")?.textContent.trim() ?? null;
    const link = el.querySelector("a")?.href ?? URL;

    return { title, distributor, date, link };
  }).filter(i => i.title);

  fs.writeFileSync("data/releases.json", JSON.stringify(items, null, 2));
  console.log(`Saved ${items.length} items to data/releases.json`);
}

scrapeFDA().catch(err => {
  console.error(err);
  process.exit(1);
});
