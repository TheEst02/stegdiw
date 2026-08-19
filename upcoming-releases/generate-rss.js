import fs from "fs";
import RSS from "rss";

const data = JSON.parse(fs.readFileSync("data/releases.json", "utf8"));

const feed = new RSS({
  title: "FDA – This Week’s Releases",
  description: "Custom RSS feed generated from FDA release schedule",
feed_url:
  "https://raw.githubusercontent.com/TheEst02/stegdiw/main/upcoming-releases/rss.xml",
  site_url:
    "https://filmdistributorsassociation.com/release-schedule/this-weeks-releases/",
  language: "en"
});

data.forEach(item => {
  const descriptionParts = [];
  if (item.distributor) descriptionParts.push(item.distributor);
  if (item.date) descriptionParts.push(item.date);

  feed.item({
    title: item.title,
    description: descriptionParts.join(" — "),
    url: item.link,
    date: item.date || new Date().toISOString()
  });
});

fs.writeFileSync("rss.xml", feed.xml({ indent: true }));
console.log("Generated rss.xml");
