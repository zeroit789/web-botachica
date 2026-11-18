/*
  server.js: servidor local para ver la web con las mismas cabeceras que Cloudflare Pages.
  server.js: local server to view the site with the same headers as Cloudflare Pages.

  Uso / Usage:  node server.js [puerto/port]   (por defecto/default 8080)
  Solo escucha en 127.0.0.1 y solo usa módulos nativos de Node.
  Listens on 127.0.0.1 only and uses Node built-in modules only.
*/
'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = fs.realpathSync(__dirname);
const PORT = Number(process.argv[2]) || 8080;
const HOST = '127.0.0.1';

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
    // HSTS y upgrade-insecure-requests no tienen sentido en http://127.0.0.1
    // HSTS and upgrade-insecure-requests make no sense on http://127.0.0.1
    if (name === 'Strict-Transport-Security') continue;
    out[name] = line.slice(i + 1).trim().replace('; upgrade-insecure-requests', '');
  }
  return out;
}
const HEADERS = readHeaders();

// Respuesta corta de error / Short error response
function fail(res, status) {
  if (res.headersSent) { res.end(); return; }
  res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end(String(status));
}

// Convierte la URL en una ruta real dentro de ROOT, o null si no vale
// Turns the URL into a real path inside ROOT, or null if it is not allowed
function resolveFile(urlPath) {
  // Nada que empiece por punto (.git, .local…) ni barras invertidas
  // Nothing starting with a dot (.git, .local…) and no backslashes
  const parts = urlPath.split('/').filter(Boolean);
  if (urlPath.includes('\\') || urlPath.includes('\0') || parts.some((p) => p.startsWith('.'))) return null;
  let candidate = path.join(ROOT, ...parts);
  if (urlPath.endsWith('/') || parts.length === 0) candidate = path.join(candidate, 'index.html');
  let real;
  try { real = fs.realpathSync(candidate); } catch { return undefined; }
  const rel = path.relative(ROOT, real);
  if (rel.startsWith('..') || path.isAbsolute(rel)) return null;
  if (!fs.statSync(real).isFile()) return undefined;
  return real;
}

// Sirve un fichero, la 404 de la web o un error / Serves a file, the site's 404 or an error
const server = http.createServer((req, res) => {
  try {
    let urlPath;
    try { urlPath = decodeURIComponent(new URL(req.url, `http://${HOST}`).pathname); }
    catch { fail(res, 400); return; }
    let file = resolveFile(urlPath);
    if (file === null) { fail(res, 403); return; }
    let status = 200;
    if (file === undefined) { file = path.join(ROOT, '404.html'); status = 404; }
    fs.readFile(file, (err, data) => {
      if (err) { fail(res, 500); return; }
      res.writeHead(status, { ...HEADERS, 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
      res.end(data);
    });
  } catch {
    fail(res, 500);
  }
});
server.on('clientError', (err, socket) => { socket.end('HTTP/1.1 400 Bad Request\r\n\r\n'); });
server.listen(PORT, HOST, () => console.log(`Bodega Bota Chica en http://${HOST}:${PORT}`));
