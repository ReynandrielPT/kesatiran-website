// Detect a successful HTML response backed by an obsolete or missing stylesheet.
const base = process.argv[2] || "http://127.0.0.1:3000";
const page = await fetch(base);
if (!page.ok) throw new Error(`Page returned ${page.status}`);
const html = await page.text();
const styles = [...html.matchAll(/href="([^"]+\.css(?:\?[^"]*)?)"/g)].map(
  (m) => m[1],
);
if (!styles.length) throw new Error("Page contains no stylesheet links");
let css = "";
for (const path of styles) {
  const response = await fetch(new URL(path.replaceAll("&amp;", "&"), base));
  if (
    !response.ok ||
    !response.headers.get("content-type")?.includes("text/css")
  ) {
    throw new Error(`Stylesheet unavailable: ${path} (${response.status})`);
  }
  css += await response.text();
}
for (const selector of [".cinema-hero", ".editorial-nav", ".chapter-menu"]) {
  if (!css.includes(selector))
    throw new Error(`Served CSS is missing ${selector}`);
}
console.log(`Editorial stylesheet smoke check passed at ${base}`);
