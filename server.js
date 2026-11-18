/*
  server.js: servidor local para ver la web con las mismas cabeceras que Cloudflare Pages.
  server.js: local server to view the site with the same headers as Cloudflare Pages.

  Uso / Usage:  node server.js [puerto/port]   (por defecto/default 8080)
  Solo módulos nativos de Node / Node built-in modules only.
*/
'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = __dirname;
const PORT = Number(process.argv[2]) || 8080;

// Tipos de contenido por extensión / Content types by extension
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
};

// Lee las cabeceras del bloque «/*» de _headers / Reads the headers of the "/*" block in _headers
function readHeaders() {
  const out = {};
  let inBlock = false;
  for (const line of fs.readFileSync(path.join(ROOT, '_headers'), 'utf8').split(/\r?\n/)) {
    if (line.startsWith('#') || !line.trim()) continue;
    if (!line.startsWith(' ')) { inBlock = line.trim() === '/*'; continue; }
    if (!inBlock) continue;
    const i = line.indexOf(':');
    const name = line.slice(0, i).trim();
    // HSTS y upgrade-insecure-requests no tienen sentido en http://localhost
    // HSTS and upgrade-insecure-requests make no sense on http://localhost
    if (name === 'Strict-Transport-Security') continue;
    out[name] = line.slice(i + 1).trim().replace('; upgrade-insecure-requests', '');
  }
  return out;
}
const HEADERS = readHeaders();

// Sirve un fichero o la 404 de la web / Serves a file or the site's 404
http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (p.endsWith('/')) p += 'index.html';
  let file = path.normalize(path.join(ROOT, p));
  if (!file.startsWith(ROOT) || p.includes('/.')) { res.writeHead(403); res.end(); return; }
  let status = 200;
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) { file = path.join(ROOT, '404.html'); status = 404; }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(500); res.end(); return; }
    res.writeHead(status, { ...HEADERS, 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(PORT, () => console.log(`Bodega Bota Chica en http://localhost:${PORT}`));
