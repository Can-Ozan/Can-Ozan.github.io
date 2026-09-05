import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";

const root = resolve("out");
const port = Number(process.env.PORT || 3000);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".txt": "text/plain",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

await stat(resolve(root, "index.html")).catch(() => {
  throw new Error(
    "Build the portfolio with npm run build before starting the production preview.",
  );
});

createServer(async (request, response) => {
  try {
    if (request.method !== "GET" && request.method !== "HEAD") {
      response.writeHead(405, { Allow: "GET, HEAD" }).end();
      return;
    }
    const pathname = decodeURIComponent(
      new URL(request.url, "http://localhost").pathname,
    );
    let file = resolve(root, `.${pathname}`);
    if (file !== root && !file.startsWith(root + sep)) {
      response.writeHead(403).end();
      return;
    }
    let info = await stat(file).catch(() => null);
    if (info?.isDirectory()) {
      file = resolve(file, "index.html");
      info = await stat(file).catch(() => null);
    }
    if (!info?.isFile()) {
      response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      createReadStream(resolve(root, "404.html")).pipe(response);
      return;
    }
    response.writeHead(200, {
      "Content-Type": types[extname(file)] || "application/octet-stream",
      "Content-Length": info.size,
      "X-Content-Type-Options": "nosniff",
    });
    if (request.method === "HEAD") response.end();
    else createReadStream(file).pipe(response);
  } catch {
    response.writeHead(400).end("Bad request");
  }
}).listen(port, "127.0.0.1", () =>
  process.stdout.write(`Portfolio: http://127.0.0.1:${port}\n`),
);
