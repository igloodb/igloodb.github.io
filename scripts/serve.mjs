import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
const root = path.resolve("out");
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".txt": "text/plain",
  ".md": "text/markdown; charset=utf-8",
  ".xml": "application/xml",
};
http
  .createServer(async (req, res) => {
    try {
      let file = path.resolve(
        root,
        "." + decodeURIComponent(new URL(req.url, "http://localhost").pathname),
      );
      if (!file.startsWith(root + path.sep) && file !== root) {
        res.writeHead(403);
        res.end();
        return;
      }
      if ((await stat(file)).isDirectory())
        file = path.join(file, "index.html");
      res.setHeader(
        "Content-Type",
        mime[path.extname(file)] || "application/octet-stream",
      );
      res.end(await readFile(file));
    } catch {
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end(await readFile(path.join(root, "404.html")));
    }
  })
  .listen(4173, "127.0.0.1", () =>
    console.log("Static export ready on http://127.0.0.1:4173"),
  );
