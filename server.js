const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

function send(res, status, content, type) {
  res.writeHead(status, { "Content-Type": type || "text/plain; charset=utf-8" });
  res.end(content);
}

function safeFilePath(urlPath) {
  const requested = urlPath === "/" ? "/index.html" : urlPath;
  const clean = path.normalize(decodeURIComponent(requested)).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(PUBLIC_DIR, clean);
  return filePath.startsWith(PUBLIC_DIR) ? filePath : null;
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const filePath = safeFilePath(url.pathname);

  if (!filePath) {
    send(res, 403, "Acceso denegado");
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      send(res, 404, "Archivo no encontrado");
      return;
    }

    send(res, 200, content, types[path.extname(filePath)] || "application/octet-stream");
  });
});

server.listen(PORT, () => {
  console.log(`Escape Room ejecutandose en http://localhost:${PORT}`);
});
