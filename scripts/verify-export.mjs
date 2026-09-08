import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import { extname, join, relative, resolve, sep } from "node:path";

const root = resolve("out");
const origin = "https://can-ozan.github.io";
const files = [];
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name);
    if (entry.isDirectory()) await walk(file);
    else files.push(file);
  }
}
await walk(root);
for (const required of [
  "index.html",
  "404.html",
  "robots.txt",
  "sitemap.xml",
  "og-image.png",
  ".nojekyll",
])
  assert((await stat(join(root, required))).isFile(), `Missing ${required}`);

const html = await readFile(join(root, "index.html"), "utf8");
assert(
  html.includes(`rel="canonical" href="${origin}/"`),
  "Canonical URL must target the user site",
);
assert(
  html.includes(`${origin}/og-image.png`),
  "Missing static OpenGraph image metadata",
);
assert(!html.includes("/_next/image?"), "Image optimization requires a server");
assert(
  (await readFile(join(root, "robots.txt"), "utf8")).includes(
    `${origin}/sitemap.xml`,
  ),
);
assert(
  (await readFile(join(root, "sitemap.xml"), "utf8")).includes(
    `<loc>${origin}</loc>`,
  ),
);

const references = new Set();
for (const file of files) {
  const extension = extname(file);
  if (![".html", ".css", ".js"].includes(extension)) continue;
  const content = await readFile(file, "utf8");
  if (extension === ".js") {
    assert(
      !/GITHUB_TOKEN|api\.github\.com/.test(content),
      `Server-only GitHub code leaked into ${file}`,
    );
    continue;
  }
  const expression =
    extension === ".html"
      ? /(?:src|href)=["'](\/[^"']*)["']/g
      : /url\(["']?([^\s)'"?]+)["']?\)/g;
  for (const match of content.matchAll(expression)) {
    const base = `${origin}/${relative(root, file).split(sep).join("/")}`;
    const url = new URL(match[1], base);
    if (url.origin === origin) references.add(url.pathname);
  }
}
for (const reference of references) {
  const pathname = decodeURIComponent(new URL(reference, origin).pathname);
  let file = resolve(root, `.${pathname}`);
  assert(
    file === root || file.startsWith(root + sep),
    `Unsafe asset path: ${reference}`,
  );
  let info = await stat(file).catch(() => null);
  if (info?.isDirectory()) {
    file = join(file, "index.html");
    info = await stat(file).catch(() => null);
  }
  assert(info?.isFile(), `Broken exported asset/link: ${reference}`);
}
for (const extension of [".js", ".css", ".woff2"])
  assert(
    files.some((file) => extname(file) === extension),
    `No exported ${extension} assets`,
  );

const manifest = JSON.parse(
  await readFile(".next/prerender-manifest.json", "utf8"),
);
assert.equal(
  Object.keys(manifest.dynamicRoutes).length,
  0,
  "Unexpected dynamic routes",
);
for (const [route, data] of Object.entries(manifest.routes)) {
  assert.equal(data.compute, "static", `Runtime route: ${route}`);
  assert(!data.initialRevalidateSeconds, `Runtime refresh required: ${route}`);
}

console.log(
  `Static export verified: ${files.length} files, ${references.size} local links/assets, metadata, fonts, and no client GitHub token/API code.`,
);
await import("./security-check.mjs");
