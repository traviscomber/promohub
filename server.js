#!/usr/bin/env node
/**
 * PromoHub — servidor de desarrollo local (cero dependencias).
 * Uso: node server.js [--host 127.0.0.1] [--port 7100]
 * Replica el comportamiento de Vercel cleanUrls:
 *   /promociones  ->  promociones/index.html
 */
"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
function argValue(name, fallback) {
  const i = args.indexOf("--" + name);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
}
const HOST = argValue("host", "127.0.0.1");
const PORT = parseInt(argValue("port", "7100"), 10);
const ROOT = __dirname;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function resolveFile(urlPath) {
  let p = decodeURIComponent(urlPath.split("?")[0]).replace(/\/+$/, "");
  if (p === "") p = "/";
  const candidates = [];
  if (p === "/") candidates.push("index.html");
  else {
    candidates.push(path.join(p.slice(1)));
    candidates.push(path.join(p.slice(1), "index.html"));
  }
  for (const c of candidates) {
    const full = path.join(ROOT, c);
    if (full.startsWith(ROOT) && fs.existsSync(full) && fs.statSync(full).isFile()) {
      return full;
    }
  }
  // Página 404 personalizada
  const notFound = path.join(ROOT, "404.html");
  return fs.existsSync(notFound) ? notFound : null;
}

const server = http.createServer((req, res) => {
  const file = resolveFile(req.url || "/");
  if (!file) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("404");
    return;
  }
  const isNotFound = file.endsWith("404.html") && !req.url.startsWith("/404");
  const ext = path.extname(file).toLowerCase();
  const headers = { "Content-Type": MIME[ext] || "application/octet-stream" };
  if (file.includes(`${path.sep}assets${path.sep}`)) {
    headers["Cache-Control"] = "public, max-age=31536000, immutable";
  }
  res.writeHead(isNotFound ? 404 : 200, headers);
  fs.createReadStream(file).pipe(res);
});

server.listen(PORT, HOST, () => {
  console.log(`PromoHub listo en http://${HOST}:${PORT}/`);
});
