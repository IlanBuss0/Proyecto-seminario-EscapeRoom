// Servidor compartido para Escape Room: El viaje del mensaje.
// No usa dependencias externas: HTTP nativo, archivos estaticos y eventos SSE.

const http = require("http");
const fs = require("fs");
const path = require("path");

const PUERTO = Number(process.env.PORT) || 3000;
const RAIZ = __dirname;
const DATA_DIR = path.join(RAIZ, "data");
const PODIO_PATH = path.join(DATA_DIR, "podio.json");
const clientes = new Set();

const tipos = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

function asegurarDatos() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
  if (!fs.existsSync(PODIO_PATH)) fs.writeFileSync(PODIO_PATH, "[]", "utf8");
}

function leerPodio() {
  asegurarDatos();
  try {
    const contenido = fs.readFileSync(PODIO_PATH, "utf8");
    return JSON.parse(contenido);
  } catch (error) {
    return [];
  }
}

function guardarPodio(podio) {
  asegurarDatos();
  fs.writeFileSync(PODIO_PATH, JSON.stringify(ordenarPodio(podio), null, 2), "utf8");
}

function ordenarPodio(podio) {
  return podio.slice().sort(function(a, b) {
    if (Number(b.puntaje) !== Number(a.puntaje)) return Number(b.puntaje) - Number(a.puntaje);
    return Number(a.segundosUsados) - Number(b.segundosUsados);
  });
}

function enviarJson(respuesta, estado, datos) {
  respuesta.writeHead(estado, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  respuesta.end(JSON.stringify(datos));
}

function leerCuerpo(pedido) {
  return new Promise(function(resolve, reject) {
    let cuerpo = "";
    pedido.on("data", function(parte) {
      cuerpo += parte;
      if (cuerpo.length > 1000000) {
        reject(new Error("Cuerpo demasiado grande"));
        pedido.destroy();
      }
    });
    pedido.on("end", function() {
      resolve(cuerpo);
    });
    pedido.on("error", reject);
  });
}

function validarResultado(resultado) {
  return {
    equipo: String(resultado.equipo || "Equipo sin nombre").slice(0, 80),
    puntaje: Number(resultado.puntaje) || 0,
    tiempoUsado: String(resultado.tiempoUsado || "00:00").slice(0, 16),
    segundosUsados: Number(resultado.segundosUsados) || 0,
    errores: Number(resultado.errores) || 0,
    pistas: Number(resultado.pistas) || 0,
    fecha: String(resultado.fecha || new Date().toLocaleString("es-AR")).slice(0, 40)
  };
}

function publicarPodio() {
  const datos = JSON.stringify({ podio: ordenarPodio(leerPodio()).slice(0, 50) });
  clientes.forEach(function(cliente) {
    cliente.write("event: podio\n");
    cliente.write("data: " + datos + "\n\n");
  });
}

function manejarApi(pedido, respuesta, ruta) {
  if (pedido.method === "OPTIONS") {
    enviarJson(respuesta, 200, { ok: true });
    return true;
  }

  if (ruta === "/api/podio" && pedido.method === "GET") {
    enviarJson(respuesta, 200, { podio: ordenarPodio(leerPodio()).slice(0, 50) });
    return true;
  }

  if (ruta === "/api/podio/eventos" && pedido.method === "GET") {
    respuesta.writeHead(200, {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*"
    });
    clientes.add(respuesta);
    respuesta.write("event: podio\n");
    respuesta.write("data: " + JSON.stringify({ podio: ordenarPodio(leerPodio()).slice(0, 50) }) + "\n\n");
    pedido.on("close", function() {
      clientes.delete(respuesta);
    });
    return true;
  }

  if (ruta === "/api/resultados" && pedido.method === "POST") {
    leerCuerpo(pedido)
      .then(function(cuerpo) {
        const resultado = validarResultado(JSON.parse(cuerpo || "{}"));
        const podio = leerPodio();
        podio.push(resultado);
        const ordenado = ordenarPodio(podio);
        guardarPodio(ordenado);
        publicarPodio();
        enviarJson(respuesta, 201, { ok: true, podio: ordenado.slice(0, 50) });
      })
      .catch(function() {
        enviarJson(respuesta, 400, { ok: false, error: "Resultado invalido" });
      });
    return true;
  }

  return false;
}

function servirArchivo(pedido, respuesta, ruta) {
  const rutaLimpia = ruta === "/" ? "/index.html" : decodeURIComponent(ruta);
  const archivo = path.normalize(path.join(RAIZ, rutaLimpia));

  if (!archivo.startsWith(RAIZ)) {
    respuesta.writeHead(403);
    respuesta.end("Acceso denegado");
    return;
  }

  fs.readFile(archivo, function(error, contenido) {
    if (error) {
      respuesta.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      respuesta.end("Archivo no encontrado");
      return;
    }
    const extension = path.extname(archivo);
    respuesta.writeHead(200, { "Content-Type": tipos[extension] || "application/octet-stream" });
    respuesta.end(contenido);
  });
}

const servidor = http.createServer(function(pedido, respuesta) {
  const url = new URL(pedido.url, "http://" + pedido.headers.host);
  if (manejarApi(pedido, respuesta, url.pathname)) return;
  servirArchivo(pedido, respuesta, url.pathname);
});

asegurarDatos();
servidor.listen(PUERTO, "0.0.0.0", function() {
  console.log("Escape Room disponible en http://localhost:" + PUERTO);
  console.log("En otras computadoras, usar http://IP-DE-ESTA-PC:" + PUERTO);
});
