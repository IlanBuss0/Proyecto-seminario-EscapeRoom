// Escape Room: El viaje del mensaje
// Logica principal del juego. Las salas se renderizan desde este array para que
// los textos, validaciones y transiciones sean faciles de revisar en clase.

const TIEMPO_TOTAL = 10 * 60;
const CLAVE_PODIO = "escapeRoomOsiPodio";
const CLAVE_PARTIDAS = "escapeRoomOsiPartidasGanadas";
const API_BASE = location.protocol === "file:" ? "" : location.origin;
const MAX_ERRORES_SALA = 3;
const TIEMPO_TIMEOUT = 10;

const salas = [
  {
    id: "aplicacion",
    nombreCapa: "Aplicacion",
    numeroCapa: 7,
    tituloSala: "La puerta del usuario",
    contexto: "El dato nace porque una persona hizo algo en una aplicacion. Antes de bajar por la red, hay que reconocer que acciones usan servicios de red cercanos al usuario.",
    tipoDesafio: "Panel de servicios",
    consigna: "El mensaje acaba de nacer. Para saber si puede salir de la computadora, identifica que acciones pertenecen al mundo de las aplicaciones que usan servicios de red.",
    datosDelDesafio: {
      opciones: [
        "Navegar una pagina web",
        "Enviar un correo",
        "Transferir un archivo",
        "Convertir bits en senales",
        "Elegir una ruta entre routers",
        "Usar una direccion MAC"
      ],
      correctas: ["Navegar una pagina web", "Enviar un correo", "Transferir un archivo"]
    },
    respuestasValidas: ["Navegar una pagina web", "Enviar un correo", "Transferir un archivo"],
    pista: "Mira las acciones que haria una persona desde un programa. Todavia no pienses en cables, rutas ni direcciones de red local.",
    codigo: "APP-01",
    explicacionCorrecta: "La capa de Aplicacion ofrece servicios de red a los programas que usa el usuario, como navegar, enviar correo o transferir archivos.",
    mensajeIncorrecto: "Todavia hay acciones mezcladas de otras capas. Pensa en lo que hace una persona desde un programa, antes de que el mensaje empiece a bajar por la red.",
    transicionSiguiente: "El dato salio de la aplicacion. Ahora necesita adoptar una forma que el receptor pueda entender."
  },
  {
    id: "presentacion",
    nombreCapa: "Presentacion",
    numeroCapa: 6,
    tituloSala: "El traductor del mensaje",
    contexto: "El dato ya existe, pero debe prepararse para que otro equipo pueda interpretarlo. Esta sala trabaja con la forma en que se representan los datos.",
    tipoDesafio: "Maquina de transformacion",
    consigna: "El mensaje existe, pero todavia no esta listo para ser entendido por otro equipo. Activa las transformaciones que ayudan a que los datos viajen en un formato interpretable.",
    datosDelDesafio: {
      opciones: [
        "Cambiar formato",
        "Codificar o decodificar",
        "Comprimir o descomprimir",
        "Cifrar o descifrar",
        "Elegir ruta IP",
        "Controlar senal electrica",
        "Usar direccion MAC"
      ],
      correctas: [
        "Cambiar formato",
        "Codificar o decodificar",
        "Comprimir o descomprimir",
        "Cifrar o descifrar"
      ]
    },
    respuestasValidas: ["Cambiar formato", "Codificar o decodificar", "Comprimir o descomprimir", "Cifrar o descifrar"],
    pista: "Esta capa no elige caminos ni transmite por cables. Se ocupa de que los datos tengan una forma entendible o protegida.",
    codigo: "PRE-02",
    explicacionCorrecta: "La capa de Presentacion prepara la representacion de los datos: formato, traduccion, codificacion, compresion o cifrado.",
    mensajeIncorrecto: "Esa accion no transforma la forma en que se representan los datos. Algunas opciones pertenecen al camino, a la red local o al medio fisico.",
    transicionSiguiente: "El dato ya fue preparado. Ahora debe abrirse una comunicacion ordenada entre origen y destino."
  },
  {
    id: "sesion",
    nombreCapa: "Sesion",
    numeroCapa: 5,
    tituloSala: "La sala de conexion",
    contexto: "Antes de intercambiar datos, dos equipos necesitan iniciar una comunicacion, sostenerla mientras hablan y cerrarla cuando termina.",
    tipoDesafio: "Secuencia de dialogo",
    consigna: "Dos equipos quieren hablar. Ordena los pasos logicos de esa conversacion: primero debe abrirse, despues sostenerse y finalmente cerrarse.",
    datosDelDesafio: {
      ordenInicial: ["Mantener la comunicacion activa", "Establecer la sesion", "Finalizar la sesion"],
      ordenCorrecto: ["Establecer la sesion", "Mantener la comunicacion activa", "Finalizar la sesion"]
    },
    respuestasValidas: ["Establecer la sesion", "Mantener la comunicacion activa", "Finalizar la sesion"],
    pista: "Imagina una llamada: primero se inicia, luego se mantiene y al final se corta.",
    codigo: "SES-03",
    explicacionCorrecta: "La capa de Sesion administra el dialogo entre equipos: establecer, mantener y finalizar la comunicacion.",
    mensajeIncorrecto: "La conversacion todavia esta desordenada. Pensa en una llamada: no se puede cortar antes de haber empezado.",
    transicionSiguiente: "La conversacion esta activa. El mensaje puede avanzar, pero debe viajar dividido, controlado y en orden."
  },
  {
    id: "transporte",
    nombreCapa: "Transporte",
    numeroCapa: 4,
    tituloSala: "El control de entrega",
    contexto: "El mensaje puede dividirse para viajar. La capa de Transporte ayuda a que esas partes puedan ordenarse y llegar completas.",
    tipoDesafio: "Reconstruccion de segmentos",
    consigna: "El mensaje se dividio para poder viajar. Ahora tenes que reconstruirlo en el orden correcto y explicar que se logro con eso.",
    datosDelDesafio: {
      ordenInicial: ["LLEGA", "EL", "COMPLETO", "MENSAJE"],
      ordenCorrecto: ["EL", "MENSAJE", "LLEGA", "COMPLETO"],
      pregunta: "Acabas de ordenar las partes del mensaje para que vuelva a tener sentido. Que logro hacer esta capa con el mensaje?"
    },
    respuestasValidas: [
      "ordeno el mensaje",
      "ordeno el mensaje",
      "ordenar el mensaje",
      "ordenar segmentos",
      "ordenar partes",
      "reconstruir mensaje",
      "reconstruyo el mensaje",
      "controlar entrega",
      "que llegue completo",
      "transporte"
    ],
    pista: "Observa que el receptor solo entiende el mensaje si las partes vuelven completas y en el orden correcto.",
    codigo: "TRA-04",
    explicacionCorrecta: "La capa de Transporte puede dividir datos y colaborar para que el mensaje llegue completo y ordenado.",
    mensajeIncorrecto: "El dato todavia no esta listo. Si las partes llegan desordenadas, el receptor no puede entender el mensaje completo.",
    transicionSiguiente: "Las partes del mensaje ya estan controladas. Ahora hay que elegir el camino que cruzara la red."
  },
  {
    id: "red",
    nombreCapa: "Red",
    numeroCapa: 3,
    tituloSala: "El mapa de rutas",
    contexto: "El mensaje debe cruzar redes distintas. La capa de Red usa rutas, routers y direcciones logicas para elegir un camino posible.",
    tipoDesafio: "Laberinto de routers",
    consigna: "El mensaje llego al mapa de la red. Elegi una ruta valida para llevarlo desde el origen hasta el destino. Solo algunos routers estan conectados correctamente.",
    datosDelDesafio: {
      nodos: ["ORIGEN", "R1", "R2", "R3", "R4", "R5", "BLOQUEO", "DESTINO"],
      posiciones: {
        ORIGEN: "pos-origen",
        R1: "pos-r1",
        R2: "pos-r2",
        R3: "pos-r3",
        R4: "pos-r4",
        R5: "pos-r5",
        BLOQUEO: "pos-bloqueo",
        DESTINO: "pos-destino"
      },
      conexiones: {
        ORIGEN: ["R1", "R2"],
        R1: ["R3", "R4"],
        R2: ["BLOQUEO"],
        R3: ["R5"],
        R4: [],
        R5: ["DESTINO"],
        BLOQUEO: [],
        DESTINO: []
      },
      rutaCorrecta: ["ORIGEN", "R1", "R3", "R5", "DESTINO"]
    },
    respuestasValidas: ["ORIGEN", "R1", "R3", "R5", "DESTINO"],
    pista: "Segui solo conexiones que avanzan hacia destino. Un router sin salida o bloqueado no sirve para completar la ruta.",
    codigo: "RED-05",
    explicacionCorrecta: "La capa de Red permite elegir caminos entre redes usando direccionamiento logico, rutas y routers.",
    mensajeIncorrecto: "Esa ruta no llega correctamente al destino. La capa de Red debe encontrar un camino valido entre redes.",
    transicionSiguiente: "La ruta fue encontrada. El dato llego a la red local y necesita prepararse como trama."
  },
  {
    id: "enlace",
    nombreCapa: "Enlace de Datos",
    numeroCapa: 2,
    tituloSala: "El guardian de la red local",
    contexto: "El mensaje ya encontro la red correcta. Ahora debe prepararse para moverse dentro de una red local como una trama.",
    tipoDesafio: "Armar la trama",
    consigna: "El mensaje ya encontro la red correcta. Ahora necesita prepararse para moverse dentro de la red local. Elegi las piezas que forman parte de una trama.",
    datosDelDesafio: {
      piezas: ["Datos", "Direccion IP publica", "MAC destino", "Ruta entre redes", "Control de errores", "MAC origen", "Cifrado de formato"],
      ordenCorrecto: ["MAC destino", "MAC origen", "Datos", "Control de errores"]
    },
    respuestasValidas: ["MAC destino", "MAC origen", "Datos", "Control de errores"],
    pista: "En la red local importan las direcciones MAC y la trama que contiene los datos.",
    codigo: "ENL-06",
    explicacionCorrecta: "La capa de Enlace de Datos organiza la informacion en tramas para la red local y usa direcciones MAC.",
    mensajeIncorrecto: "Hay piezas que pertenecen a otras capas. En la red local importan las direcciones MAC y la organizacion en tramas.",
    transicionSiguiente: "La trama esta lista. Ahora solo queda convertir la informacion en senales reales."
  },
  {
    id: "fisica",
    nombreCapa: "Fisica",
    numeroCapa: 1,
    tituloSala: "El tunel de senales",
    contexto: "En la ultima capa, el dato se convierte en senales para viajar por un medio fisico: cable, fibra optica o aire.",
    tipoDesafio: "Decodificar la senal",
    consigna: "El dato llego al ultimo tunel. Aca ya no se piensa en aplicaciones, rutas ni sesiones: la informacion se transforma en senales para viajar por un medio.",
    datosDelDesafio: {
      clave: "▲ = 1 y ● = 0",
      secuencia: "▲ ● ▲ ▲ ● ● ▲",
      bitsCorrectos: "1011001",
      pregunta: "Que paso con el dato en esta capa?"
    },
    respuestasValidas: [
      "bits en senales",
      "senales fisicas",
      "senales fisicas",
      "transmitir bits",
      "transmision fisica",
      "transmision fisica",
      "convertir bits en senales",
      "capa fisica",
      "capa fisica"
    ],
    pista: "Usa la clave simbolo por simbolo. Esta capa solo convierte bits en senales que viajan por un medio.",
    codigo: "FIS-07",
    explicacionCorrecta: "La capa Fisica transmite bits como senales electricas, opticas o inalambricas.",
    mensajeIncorrecto: "La senal todavia no fue interpretada. Usa la clave: cada simbolo representa un bit.",
    transicionSiguiente: "El dato atraveso el medio fisico. El viaje termino."
  }
];

const estado = {
  pantalla: "inicio",
  equipo: "",
  salaActual: 0,
  salaTransicion: 0,
  tiempoRestante: TIEMPO_TOTAL,
  temporizador: null,
  timeoutTimer: null,
  puntajeBase: 1000,
  errores: 0,
  pistas: 0,
  pistasUsadas: [],
  completadas: [],
  codigos: [],
  bloqueado: false,
  timeoutActivo: false,
  timeoutRestante: 0,
  erroresConsecutivosSala: {},
  mensaje: "",
  tipoMensaje: "info",
  seleccion: [],
  orden: [],
  textoUno: "",
  textoDos: "",
  resultadoFinal: null,
  podio: leerPodioLocal(),
  servidorCompartido: false
};

const pantalla = document.querySelector(".screen");

function normalizarTexto(texto) {
  return String(texto)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, " ");
}

function iniciarJuego() {
  estado.pantalla = "nombre";
  estado.mensaje = "";
  renderizar();
}

function comenzarViaje() {
  const input = document.querySelector(".team-input");
  const nombre = input ? input.value.trim() : "";
  if (!nombre) {
    mostrarMensaje("Escribi el nombre del equipo para comenzar la mision.", "bad");
    return;
  }
  estado.equipo = nombre;
  estado.pantalla = "intro";
  estado.mensaje = "";
  renderizar();
}

function entrarALaRed() {
  estado.pantalla = "juego";
  estado.tiempoRestante = TIEMPO_TOTAL;
  estado.salaActual = 0;
  estado.salaTransicion = 0;
  estado.errores = 0;
  estado.pistas = 0;
  estado.pistasUsadas = [];
  estado.completadas = [];
  estado.codigos = [];
  estado.bloqueado = false;
  estado.timeoutActivo = false;
  estado.timeoutRestante = 0;
  estado.erroresConsecutivosSala = {};
  estado.resultadoFinal = null;
  prepararEstadoSala();
  renderizar();
  iniciarTemporizador();
}

function prepararEstadoSala() {
  const sala = salas[estado.salaActual];
  estado.seleccion = sala.id === "red" ? ["ORIGEN"] : [];
  estado.textoUno = "";
  estado.textoDos = "";
  estado.mensaje = "";
  estado.tipoMensaje = "info";
  if (sala.id === "sesion" || sala.id === "transporte") {
    estado.orden = sala.datosDelDesafio.ordenInicial.slice();
  } else {
    estado.orden = [];
  }
}

function renderizar() {
  if (estado.pantalla === "inicio") renderizarInicio();
  if (estado.pantalla === "nombre") renderizarNombre();
  if (estado.pantalla === "intro") renderizarIntro();
  if (estado.pantalla === "juego") renderizarSala();
  if (estado.pantalla === "transicion") renderizarTransicion();
  if (estado.pantalla === "victoria") renderizarVictoria();
  if (estado.pantalla === "derrota") renderizarDerrota();
}

function renderizarInicio() {
  pantalla.innerHTML = `
    <article class="hero">
      <p class="room-kicker">CENTRO DE CONTROL OSI</p>
      <h1 class="hero-title">Escape Room: El viaje del mensaje</h1>
      <p class="hero-subtitle">Un mensaje quedo atrapado en la red. Para llegar a destino debera atravesar las 7 capas del modelo OSI.</p>
      <div class="terminal-line">estado_mision &gt; dato detenido entre capas &gt; acceso requerido</div>
      <p class="text-soft">${estado.servidorCompartido ? "Podio compartido activo en el servidor." : "Podio local activo. Para varias computadoras, iniciar con server.js."}</p>
      <button class="primary-button start-button" type="button">Iniciar mision</button>
    </article>
  `;
  document.querySelector(".start-button").addEventListener("click", iniciarJuego);
}

function renderizarNombre() {
  pantalla.innerHTML = `
    <article class="hero">
      <p class="room-kicker">IDENTIFICACION DE EQUIPO</p>
      <h1 class="hero-title">Registro de escapistas</h1>
      <p class="hero-subtitle">El sistema necesita reconocer al equipo antes de abrir la compuerta de Aplicacion.</p>
      <div class="form-row">
        <label class="label" for="teamName">Nombre del equipo</label>
        <input class="text-input team-input" id="teamName" type="text" autocomplete="off">
      </div>
      ${renderMensaje()}
      <button class="primary-button begin-button" type="button">Comenzar viaje</button>
    </article>
  `;
  document.querySelector(".begin-button").addEventListener("click", comenzarViaje);
  document.querySelector(".team-input").addEventListener("keydown", function(evento) {
    if (evento.key === "Enter") comenzarViaje();
  });
}

function renderizarIntro() {
  pantalla.innerHTML = `
    <article class="hero">
      <p class="room-kicker">TRANSMISION INTERRUMPIDA</p>
      <h1 class="hero-title">Descenso por el modelo OSI</h1>
      <p class="hero-subtitle">El equipo ${estado.equipo} sera el dato viajando por la red. Cada sala transforma o guia su recorrido hasta llegar al medio fisico.</p>
      <div class="terminal-line">ruta &gt; Aplicacion -> Presentacion -> Sesion -> Transporte -> Red -> Enlace de Datos -> Fisica</div>
      <button class="primary-button enter-button" type="button">Entrar a la red</button>
    </article>
  `;
  document.querySelector(".enter-button").addEventListener("click", entrarALaRed);
}

function renderizarSala() {
  const sala = salas[estado.salaActual];
  const resuelta = estaCompletada(estado.salaActual);
  const bloquea = estado.timeoutActivo && !resuelta;
  pantalla.innerHTML = `
    ${renderizarHud()}
    ${actualizarProgreso()}
    <section class="layout">
      <article class="room-card">
        <p class="room-kicker">Capa ${sala.numeroCapa}: ${sala.nombreCapa}</p>
        <h1 class="room-title">${sala.tituloSala}</h1>
        <p class="room-context">${sala.contexto}</p>
        <p class="challenge-text"><strong>${sala.tipoDesafio}.</strong> ${sala.consigna}</p>
        <div class="challenge-area">
          ${renderizarDesafio(sala)}
          ${bloquea ? renderizarTimeoutOverlay() : ""}
        </div>
        ${renderMensaje()}
        ${renderizarSalaCompletada(sala)}
        <div class="button-row">
          <button class="primary-button validate-button" type="button" ${resuelta || bloquea ? "disabled" : ""}>Validar</button>
          <button class="secondary-button hint-button" type="button" ${resuelta || bloquea ? "disabled" : ""}>Usar pista</button>
          <button class="primary-button next-button" type="button" ${resuelta && !bloquea ? "" : "disabled"}>${estado.salaActual === salas.length - 1 ? "Completar viaje" : "Continuar viaje"}</button>
        </div>
      </article>
      <aside class="side-panel">
        <h2>Bitacora</h2>
        <p class="text-soft">Cada capa desbloquea una parte del recorrido del dato. Si hay demasiadas fallas, el sistema recalibra la sala.</p>
        <div class="code-box">Codigos: ${estado.codigos.length ? estado.codigos.join(" ") : "sin codigos"}</div>
        <p class="text-soft">${estado.pistasUsadas.includes(sala.id) ? "Pista usada en esta sala." : "Pista disponible sin repetir penalizacion."}</p>
      </aside>
    </section>
  `;
  enlazarEventosSala();
}

function renderizarHud() {
  return `
    <section class="hud" aria-label="Estado de la partida">
      <div class="hud-item"><span class="hud-label">Equipo</span><span class="hud-value">${estado.equipo}</span></div>
      <div class="hud-item"><span class="hud-label">Tiempo</span><span class="hud-value time-value">${formatearTiempo(estado.tiempoRestante)}</span></div>
      <div class="hud-item"><span class="hud-label">Puntaje</span><span class="hud-value score-value">${actualizarPuntaje()}</span></div>
      <div class="hud-item"><span class="hud-label">Capa actual</span><span class="hud-value">${salas[estado.salaActual].nombreCapa}</span></div>
      <div class="hud-item"><span class="hud-label">Errores / pistas</span><span class="hud-value">${estado.errores} / ${estado.pistas}</span></div>
    </section>
  `;
}

function actualizarProgreso() {
  const porcentaje = (estado.completadas.length / salas.length) * 100;
  const pasos = salas.map(function(sala, indice) {
    let clase = "step-locked";
    let estadoTexto = "bloqueada";
    if (estaCompletada(indice)) {
      clase = "step-done";
      estadoTexto = "completada";
    }
    if (indice === estado.salaActual && !estaCompletada(indice)) {
      clase = "step-current";
      estadoTexto = "actual";
    }
    return `<button class="progress-step ${clase}" type="button" data-go="${indice}" ${indice > estado.salaActual || estado.timeoutActivo ? "disabled" : ""}>${sala.nombreCapa}<br>${estadoTexto}</button>`;
  }).join("");

  return `
    <section class="progress-panel" aria-label="Progreso de capas">
      <div class="progress-bar"><div class="progress-fill" style="width: ${porcentaje}%"></div></div>
      <div class="progress-steps">${pasos}</div>
    </section>
  `;
}

function renderizarDesafio(sala) {
  if (sala.id === "aplicacion") return renderSeleccion(sala, "choice-card");
  if (sala.id === "presentacion") return renderSeleccion(sala, "machine-button");
  if (sala.id === "sesion") return renderOrden();
  if (sala.id === "transporte") return renderTransporte(sala);
  if (sala.id === "red") return renderRed(sala);
  if (sala.id === "enlace") return renderEnlace(sala);
  return renderFisica(sala);
}

function renderSeleccion(sala, clase) {
  const opciones = sala.datosDelDesafio.opciones.map(function(opcion) {
    const seleccionada = estado.seleccion.includes(opcion) ? "selected" : "";
    return `<button class="${clase} ${seleccionada}" type="button" data-select="${opcion}" ${estado.timeoutActivo ? "disabled" : ""}>${opcion}</button>`;
  }).join("");
  const grilla = sala.id === "presentacion" ? "machine-grid" : "cards-grid";
  return `<div class="${grilla}">${opciones}</div>`;
}

function renderOrden() {
  const items = estado.orden.map(function(item, indice) {
    return `
      <li class="order-item">
        <span class="order-name">${item}</span>
        <button class="small-button" type="button" data-up="${indice}" ${estado.timeoutActivo ? "disabled" : ""}>Subir</button>
        <button class="small-button" type="button" data-down="${indice}" ${estado.timeoutActivo ? "disabled" : ""}>Bajar</button>
      </li>
    `;
  }).join("");
  return `<ol class="order-list">${items}</ol>`;
}

function renderTransporte(sala) {
  return `
    ${renderOrden()}
    <div class="segment-line">Mensaje reconstruido: ${estado.orden.join(" ")}</div>
    <div class="answer-zone">
      <label class="label" for="transportAnswer">${sala.datosDelDesafio.pregunta}</label>
      <input class="text-input answer-one" id="transportAnswer" type="text" value="${estado.textoUno}" autocomplete="off" ${estado.timeoutActivo ? "disabled" : ""}>
    </div>
  `;
}

function renderRed(sala) {
  const conexiones = sala.datosDelDesafio.conexiones;
  const nodos = sala.datosDelDesafio.nodos.map(function(nodo) {
    const seleccionada = estado.seleccion.includes(nodo) ? "selected" : "";
    const bloqueado = nodo === "BLOQUEO" ? "node-disabled" : "";
    const posicion = sala.datosDelDesafio.posiciones[nodo];
    return `<button class="node-button ${posicion} ${seleccionada} ${bloqueado}" type="button" data-node="${nodo}" ${estado.timeoutActivo ? "disabled" : ""}>${nodo}</button>`;
  }).join("");
  const lineas = Object.keys(conexiones).map(function(origen) {
    return conexiones[origen].map(function(destino) {
      const falsa = destino === "BLOQUEO" || origen === "R1" && destino === "R4" ? "route-false" : "route-ok";
      return `<span class="map-link link-${origen.toLowerCase()}-${destino.toLowerCase()} ${falsa}"></span>`;
    }).join("");
  }).join("");
  return `
    <div class="router-map">
      ${lineas}
      ${nodos}
    </div>
    <div class="route-line">Ruta elegida: ${estado.seleccion.length ? estado.seleccion.join(" -> ") : "sin nodos seleccionados"}</div>
    <p class="text-soft">Desde tu posicion actual solo podes avanzar a routers conectados por una linea visible.</p>
  `;
}

function renderEnlace(sala) {
  const piezas = sala.datosDelDesafio.piezas.map(function(pieza) {
    const seleccionada = estado.seleccion.includes(pieza) ? "selected" : "";
    return `<button class="piece-button ${seleccionada}" type="button" data-piece="${pieza}" ${estado.timeoutActivo ? "disabled" : ""}>${pieza}</button>`;
  }).join("");
  const slots = estado.seleccion.map(function(pieza) {
    return `<div class="slot-card">${pieza}</div>`;
  }).join("");
  return `
    <div class="pieces-grid">${piezas}</div>
    <div class="frame-slot">${slots}</div>
    <div class="frame-line">Orden de trama: ${estado.seleccion.length ? estado.seleccion.join(" | ") : "sin piezas"}</div>
  `;
}

function renderFisica(sala) {
  return `
    <p class="challenge-text">Clave de la sala: ${sala.datosDelDesafio.clave}</p>
    <div class="signal-line">${sala.datosDelDesafio.secuencia}</div>
    <div class="answer-zone">
      <label class="label" for="bitsAnswer">Bits equivalentes</label>
      <input class="text-input answer-one" id="bitsAnswer" type="text" value="${estado.textoUno}" autocomplete="off" ${estado.timeoutActivo ? "disabled" : ""}>
    </div>
    <div class="answer-zone">
      <label class="label" for="conceptAnswer">${sala.datosDelDesafio.pregunta}</label>
      <input class="text-input answer-two" id="conceptAnswer" type="text" value="${estado.textoDos}" autocomplete="off" ${estado.timeoutActivo ? "disabled" : ""}>
    </div>
  `;
}

function renderMensaje() {
  if (!estado.mensaje) return `<div class="message hidden"></div>`;
  return `<div class="message message-${estado.tipoMensaje}">${estado.mensaje}</div>`;
}

function renderizarSalaCompletada(sala) {
  if (!estaCompletada(estado.salaActual)) return "";
  return `
    <div class="code-box">Codigo desbloqueado: ${sala.codigo}</div>
    <div class="message message-ok">${sala.explicacionCorrecta}</div>
  `;
}

function renderizarTimeoutOverlay() {
  return `
    <div class="timeout-overlay">
      <div class="timeout-panel">
        <div class="timeout-pulse"></div>
        <h2>Sistema bloqueado</h2>
        <p>Demasiados intentos fallidos. El dato entro en zona de interferencia.</p>
        <p>Recalibrando la senal...</p>
        <strong class="timeout-count">${estado.timeoutRestante}</strong>
        <p>Podras volver a intentar en ${estado.timeoutRestante} segundos.</p>
      </div>
    </div>
  `;
}

function enlazarEventosSala() {
  document.querySelectorAll("[data-select]").forEach(function(boton) {
    boton.addEventListener("click", function() {
      alternarSeleccion(boton.getAttribute("data-select"));
    });
  });
  document.querySelectorAll("[data-node]").forEach(function(boton) {
    boton.addEventListener("click", function() {
      agregarNodo(boton.getAttribute("data-node"));
    });
  });
  document.querySelectorAll("[data-piece]").forEach(function(boton) {
    boton.addEventListener("click", function() {
      alternarPieza(boton.getAttribute("data-piece"));
    });
  });
  document.querySelectorAll("[data-up]").forEach(function(boton) {
    boton.addEventListener("click", function() {
      moverOrden(Number(boton.getAttribute("data-up")), -1);
    });
  });
  document.querySelectorAll("[data-down]").forEach(function(boton) {
    boton.addEventListener("click", function() {
      moverOrden(Number(boton.getAttribute("data-down")), 1);
    });
  });
  document.querySelectorAll("[data-go]").forEach(function(boton) {
    boton.addEventListener("click", function() {
      volverACapa(Number(boton.getAttribute("data-go")));
    });
  });
  const validar = document.querySelector(".validate-button");
  const pista = document.querySelector(".hint-button");
  const siguiente = document.querySelector(".next-button");
  if (validar) validar.addEventListener("click", validarRespuesta);
  if (pista) pista.addEventListener("click", usarPista);
  if (siguiente) siguiente.addEventListener("click", mostrarTransicionActual);
  document.querySelectorAll(".text-input").forEach(function(input) {
    input.addEventListener("input", guardarTextos);
    input.addEventListener("keydown", function(evento) {
      if (evento.key === "Enter") validarRespuesta();
    });
  });
}

function alternarSeleccion(valor) {
  if (bloquearInteraccionesSala()) return;
  if (estado.seleccion.includes(valor)) {
    estado.seleccion = estado.seleccion.filter(function(item) { return item !== valor; });
  } else {
    estado.seleccion.push(valor);
  }
  renderizarSala();
}

function agregarNodo(valor) {
  if (bloquearInteraccionesSala()) return;
  const sala = salas[estado.salaActual];
  const ruta = estado.seleccion;
  const actual = ruta[ruta.length - 1];
  const conectados = sala.datosDelDesafio.conexiones[actual] || [];

  if (valor === actual) return;
  if (ruta.includes(valor)) {
    estado.seleccion = ruta.slice(0, ruta.indexOf(valor) + 1);
    renderizarSala();
    return;
  }
  if (!conectados.includes(valor)) {
    registrarErrorSala("Ese router no esta conectado con tu posicion actual.");
    return;
  }
  if (valor === "BLOQUEO") {
    estado.seleccion.push(valor);
    registrarErrorSala("Ese camino esta bloqueado. Volve a revisar las conexiones antes de avanzar.");
    return;
  }
  estado.seleccion.push(valor);
  renderizarSala();
}

function alternarPieza(valor) {
  alternarSeleccion(valor);
}

function moverOrden(indice, direccion) {
  if (bloquearInteraccionesSala()) return;
  const destino = indice + direccion;
  if (destino < 0 || destino >= estado.orden.length) return;
  const copia = estado.orden.slice();
  const temporal = copia[indice];
  copia[indice] = copia[destino];
  copia[destino] = temporal;
  estado.orden = copia;
  guardarTextos();
  renderizarSala();
}

function guardarTextos() {
  const uno = document.querySelector(".answer-one");
  const dos = document.querySelector(".answer-two");
  estado.textoUno = uno ? uno.value : estado.textoUno;
  estado.textoDos = dos ? dos.value : estado.textoDos;
}

function validarRespuesta() {
  if (bloquearInteraccionesSala()) return;
  guardarTextos();
  const sala = salas[estado.salaActual];
  let correcto = false;

  if (sala.id === "aplicacion" || sala.id === "presentacion") {
    correcto = validarSeleccionExacta(estado.seleccion, sala.datosDelDesafio.correctas);
  }
  if (sala.id === "sesion") {
    correcto = validarOrden(estado.orden, sala.datosDelDesafio.ordenCorrecto);
  }
  if (sala.id === "transporte") {
    correcto = validarOrden(estado.orden, sala.datosDelDesafio.ordenCorrecto) && validarTexto(estado.textoUno, sala.respuestasValidas);
  }
  if (sala.id === "red") {
    correcto = validarOrden(estado.seleccion, sala.datosDelDesafio.rutaCorrecta);
  }
  if (sala.id === "enlace") {
    correcto = validarOrden(estado.seleccion, sala.datosDelDesafio.ordenCorrecto);
  }
  if (sala.id === "fisica") {
    correcto = estado.textoUno.trim() === sala.datosDelDesafio.bitsCorrectos && validarTexto(estado.textoDos, sala.respuestasValidas);
  }

  if (correcto) {
    completarSala();
  } else {
    registrarErrorSala(sala.mensajeIncorrecto);
  }
}

function registrarErrorSala(texto) {
  const sala = salas[estado.salaActual];
  estado.errores += 1;
  estado.erroresConsecutivosSala[sala.id] = (estado.erroresConsecutivosSala[sala.id] || 0) + 1;
  estado.mensaje = texto;
  estado.tipoMensaje = "bad";
  if (estado.erroresConsecutivosSala[sala.id] >= MAX_ERRORES_SALA) {
    activarTimeoutSala();
    return;
  }
  renderizarSala();
}

function activarTimeoutSala() {
  estado.timeoutActivo = true;
  estado.timeoutRestante = TIEMPO_TIMEOUT;
  estado.mensaje = "Demasiados intentos fallidos. El dato entro en zona de interferencia. Recalibrando la senal...";
  estado.tipoMensaje = "bad";
  bloquearInteraccionesSala();
  renderizarSala();
  actualizarCuentaRegresivaTimeout();
}

function actualizarCuentaRegresivaTimeout() {
  clearInterval(estado.timeoutTimer);
  estado.timeoutTimer = setInterval(function() {
    if (estado.bloqueado || !estado.timeoutActivo) {
      clearInterval(estado.timeoutTimer);
      return;
    }
    estado.timeoutRestante -= 1;
    const contador = document.querySelector(".timeout-count");
    if (contador) contador.textContent = estado.timeoutRestante;
    if (estado.timeoutRestante <= 0) finalizarTimeoutSala();
  }, 1000);
}

function finalizarTimeoutSala() {
  const sala = salas[estado.salaActual];
  clearInterval(estado.timeoutTimer);
  estado.timeoutActivo = false;
  estado.timeoutRestante = 0;
  estado.erroresConsecutivosSala[sala.id] = 0;
  desbloquearInteraccionesSala();
  mostrarMensaje("La senal fue recalibrada. Podes volver a intentar con calma.", "info");
}

function bloquearInteraccionesSala() {
  return estado.bloqueado || estado.timeoutActivo || estaCompletada(estado.salaActual);
}

function desbloquearInteraccionesSala() {
  return true;
}

function completarSala() {
  const sala = salas[estado.salaActual];
  estado.erroresConsecutivosSala[sala.id] = 0;
  if (!estado.completadas.includes(sala.id)) estado.completadas.push(sala.id);
  if (!estado.codigos.includes(sala.codigo)) estado.codigos.push(sala.codigo);
  estado.mensaje = "Acceso concedido. Codigo desbloqueado: " + sala.codigo;
  estado.tipoMensaje = "ok";
  renderizarSala();
}

function mostrarTransicionActual() {
  if (!estaCompletada(estado.salaActual) || estado.timeoutActivo) return;
  estado.salaTransicion = estado.salaActual;
  estado.pantalla = "transicion";
  renderizarTransicion();
}

function renderizarTransicion() {
  const sala = salas[estado.salaTransicion];
  const siguiente = salas[estado.salaTransicion + 1];
  pantalla.innerHTML = `
    <section class="transition-screen">
      <article class="transition-panel">
        <p class="room-kicker">Capa completada: ${sala.nombreCapa}</p>
        <h1 class="room-title">${sala.codigo} desbloqueado</h1>
        <div class="data-tunnel">
          <span class="data-pulse pulse-one"></span>
          <span class="data-pulse pulse-two"></span>
          <span class="data-pulse pulse-three"></span>
        </div>
        <p class="hero-subtitle">${sala.transicionSiguiente}</p>
        <div class="terminal-line">siguiente_capa &gt; ${siguiente ? siguiente.nombreCapa : "Destino alcanzado"}</div>
        <button class="primary-button continue-transition-button" type="button">${siguiente ? "Continuar viaje" : "Ver resultado final"}</button>
      </article>
    </section>
  `;
  document.querySelector(".continue-transition-button").addEventListener("click", avanzarSala);
}

function avanzarSala() {
  if (!estaCompletada(estado.salaActual) || estado.timeoutActivo) return;
  if (estado.salaActual === salas.length - 1) {
    finalizarConVictoria();
    return;
  }
  estado.salaActual += 1;
  estado.pantalla = "juego";
  prepararEstadoSala();
  renderizarSala();
}

function volverACapa(indice) {
  if (estado.timeoutActivo) return;
  if (indice > estado.salaActual) return;
  if (indice < estado.salaActual && !estaCompletada(indice)) return;
  estado.salaActual = indice;
  estado.pantalla = "juego";
  if (!estaCompletada(indice)) prepararEstadoSala();
  estado.mensaje = "";
  renderizarSala();
}

function mostrarMensaje(texto, tipo) {
  estado.mensaje = texto;
  estado.tipoMensaje = tipo;
  renderizar();
}

function usarPista() {
  if (bloquearInteraccionesSala()) return;
  const sala = salas[estado.salaActual];
  if (!estado.pistasUsadas.includes(sala.id)) {
    estado.pistas += 1;
    estado.pistasUsadas.push(sala.id);
  }
  mostrarMensaje("Pista: " + sala.pista, "info");
}

function actualizarPuntaje() {
  const segundosUsados = TIEMPO_TOTAL - estado.tiempoRestante;
  const descuentoTiempo = Math.floor(segundosUsados / 5);
  return Math.max(0, estado.puntajeBase - estado.errores * 10 - estado.pistas * 20 - descuentoTiempo);
}

function puntajeFinal() {
  let puntaje = actualizarPuntaje();
  if (estado.pistas === 0) puntaje += 100;
  if (estado.tiempoRestante > 180) puntaje += 50;
  return puntaje;
}

function iniciarTemporizador() {
  clearInterval(estado.temporizador);
  estado.temporizador = setInterval(function() {
    if (estado.bloqueado) return;
    estado.tiempoRestante -= 1;
    if (estado.tiempoRestante <= 0) {
      estado.tiempoRestante = 0;
      finalizarPorTiempo();
      return;
    }
    if (estado.pantalla === "juego") {
      const tiempo = document.querySelector(".time-value");
      const puntaje = document.querySelector(".score-value");
      if (tiempo) tiempo.textContent = formatearTiempo(estado.tiempoRestante);
      if (puntaje) puntaje.textContent = actualizarPuntaje();
    }
  }, 1000);
}

function finalizarPorTiempo() {
  clearInterval(estado.temporizador);
  clearInterval(estado.timeoutTimer);
  estado.bloqueado = true;
  estado.timeoutActivo = false;
  estado.pantalla = "derrota";
  renderizar();
}

function finalizarConVictoria() {
  clearInterval(estado.temporizador);
  clearInterval(estado.timeoutTimer);
  estado.bloqueado = true;
  estado.timeoutActivo = false;
  const segundosUsados = TIEMPO_TOTAL - estado.tiempoRestante;
  estado.resultadoFinal = {
    equipo: estado.equipo,
    puntaje: puntajeFinal(),
    tiempoUsado: formatearTiempo(segundosUsados),
    segundosUsados: segundosUsados,
    errores: estado.errores,
    pistas: estado.pistas,
    fecha: new Date().toLocaleString("es-AR")
  };
  guardarResultado(estado.resultadoFinal);
  estado.pantalla = "victoria";
  renderizar();
}

function guardarResultado(resultado) {
  guardarResultadoLocal(resultado);
  if (!API_BASE) return;
  fetch(API_BASE + "/api/resultados", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(resultado)
  })
    .then(function(respuesta) {
      if (!respuesta.ok) throw new Error("No se pudo guardar en el servidor");
      return respuesta.json();
    })
    .then(function(datos) {
      estado.servidorCompartido = true;
      actualizarPodioCompartido(datos.podio || []);
    })
    .catch(function() {
      estado.servidorCompartido = false;
    });
}

function renderizarPodio() {
  const podio = ordenarPodio(estado.podio).slice(0, 5);
  if (!podio.length) return `<p class="text-soft">Todavia no hay escapistas registrados.</p>`;
  const top = podio.slice(0, 3).map(function(item, indice) {
    const clases = ["first-place", "second-place", "third-place"];
    return `
      <article class="podium-card ${clases[indice]}">
        <h3>Puesto ${indice + 1}</h3>
        <strong>${item.equipo}</strong>
        <p>${item.puntaje} puntos</p>
        <p>${item.tiempoUsado} - errores ${item.errores} - pistas ${item.pistas}</p>
      </article>
    `;
  }).join("");
  const resto = podio.slice(3, 5).map(function(item, indice) {
    return `
      <article class="record-card">
        <strong>Puesto ${indice + 4}: ${item.equipo}</strong>
        <p>${item.puntaje} puntos - ${item.tiempoUsado}</p>
      </article>
    `;
  }).join("");
  return `<div class="podium-grid">${top}</div><div class="records-grid">${resto}</div>`;
}

function renderizarVictoria() {
  const r = estado.resultadoFinal;
  pantalla.innerHTML = `
    <section class="end-panel">
      <p class="room-kicker">Acceso concedido</p>
      <h1 class="room-title">Mensaje entregado</h1>
      <p class="text-soft">El mensaje logro atravesar las 7 capas del modelo OSI y llego correctamente a destino.</p>
      <div class="stats-grid">
        <div class="stat-card"><span class="hud-label">Equipo</span><strong>${r.equipo}</strong></div>
        <div class="stat-card"><span class="hud-label">Tiempo usado</span><strong>${r.tiempoUsado}</strong></div>
        <div class="stat-card"><span class="hud-label">Puntaje final</span><strong>${r.puntaje}</strong></div>
        <div class="stat-card"><span class="hud-label">Errores / pistas</span><strong>${r.errores} / ${r.pistas}</strong></div>
      </div>
      <div class="code-box">${estado.codigos.join(" ")} - Codigo final: OSI-7321</div>
      <p class="message message-ok">Acceso concedido. El mensaje completo su viaje desde la Aplicacion hasta la Fisica.</p>
      <h2>Podio de mejores escapistas</h2>
      <div class="podium-live">${renderizarPodio()}</div>
      <div class="button-row button-row-two">
        <button class="primary-button restart-button" type="button">Reiniciar juego</button>
        <button class="secondary-button home-button" type="button">Inicio</button>
      </div>
    </section>
  `;
  enlazarEventosFinal();
}

function renderizarDerrota() {
  pantalla.innerHTML = `
    <section class="end-panel">
      <p class="room-kicker">Mision interrumpida</p>
      <h1 class="room-title">Tiempo agotado</h1>
      <p class="text-soft">El mensaje quedo atrapado en la red antes de llegar a destino.</p>
      <div class="stats-grid">
        <div class="stat-card"><span class="hud-label">Capa alcanzada</span><strong>${salas[estado.salaActual].nombreCapa}</strong></div>
        <div class="stat-card"><span class="hud-label">Puntaje parcial</span><strong>${actualizarPuntaje()}</strong></div>
        <div class="stat-card"><span class="hud-label">Errores</span><strong>${estado.errores}</strong></div>
        <div class="stat-card"><span class="hud-label">Pistas usadas</span><strong>${estado.pistas}</strong></div>
      </div>
      <button class="primary-button restart-button" type="button">Intentar nuevamente</button>
    </section>
  `;
  document.querySelector(".restart-button").addEventListener("click", reiniciarJuego);
}

function enlazarEventosFinal() {
  document.querySelector(".restart-button").addEventListener("click", reiniciarJuego);
  document.querySelector(".home-button").addEventListener("click", function() {
    estado.pantalla = "inicio";
    renderizar();
  });
}

function reiniciarJuego() {
  clearInterval(estado.temporizador);
  clearInterval(estado.timeoutTimer);
  estado.pantalla = "nombre";
  estado.equipo = "";
  estado.salaActual = 0;
  estado.salaTransicion = 0;
  estado.tiempoRestante = TIEMPO_TOTAL;
  estado.errores = 0;
  estado.pistas = 0;
  estado.pistasUsadas = [];
  estado.completadas = [];
  estado.codigos = [];
  estado.bloqueado = false;
  estado.timeoutActivo = false;
  estado.timeoutRestante = 0;
  estado.erroresConsecutivosSala = {};
  estado.resultadoFinal = null;
  prepararEstadoSala();
  renderizar();
}

function validarSeleccionExacta(seleccion, correctas) {
  if (seleccion.length !== correctas.length) return false;
  return correctas.every(function(item) {
    return seleccion.map(normalizarTexto).includes(normalizarTexto(item));
  });
}

function validarOrden(actual, correcto) {
  if (actual.length !== correcto.length) return false;
  return actual.every(function(item, indice) {
    return normalizarTexto(item) === normalizarTexto(correcto[indice]);
  });
}

function validarTexto(texto, respuestas) {
  const valor = normalizarTexto(texto);
  return respuestas.map(normalizarTexto).includes(valor);
}

function leerPodioLocal() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_PODIO)) || [];
  } catch (error) {
    return [];
  }
}

function ordenarPodio(lista) {
  return lista.slice().sort(function(a, b) {
    if (b.puntaje !== a.puntaje) return b.puntaje - a.puntaje;
    return a.segundosUsados - b.segundosUsados;
  });
}

function estaCompletada(indice) {
  return estado.completadas.includes(salas[indice].id);
}

function guardarResultadoLocal(resultado) {
  const podio = leerPodioLocal();
  podio.push(resultado);
  const ordenado = ordenarPodio(podio);
  estado.podio = ordenado;
  localStorage.setItem(CLAVE_PODIO, JSON.stringify(ordenado));
  localStorage.setItem(CLAVE_PARTIDAS, JSON.stringify(ordenado));
}

function actualizarPodioCompartido(podio) {
  estado.podio = ordenarPodio(podio);
  localStorage.setItem(CLAVE_PODIO, JSON.stringify(estado.podio));
  localStorage.setItem(CLAVE_PARTIDAS, JSON.stringify(estado.podio));
  const contenedor = document.querySelector(".podium-live");
  if (contenedor) contenedor.innerHTML = renderizarPodio();
}

function cargarPodioServidor() {
  if (!API_BASE) return;
  fetch(API_BASE + "/api/podio")
    .then(function(respuesta) {
      if (!respuesta.ok) throw new Error("Sin podio compartido");
      return respuesta.json();
    })
    .then(function(datos) {
      estado.servidorCompartido = true;
      actualizarPodioCompartido(datos.podio || []);
      if (estado.pantalla === "inicio") renderizarInicio();
    })
    .catch(function() {
      estado.servidorCompartido = false;
    });
}

function conectarPodioEnVivo() {
  if (!API_BASE || typeof EventSource === "undefined") return;
  const eventos = new EventSource(API_BASE + "/api/podio/eventos");
  eventos.addEventListener("podio", function(evento) {
    estado.servidorCompartido = true;
    const datos = JSON.parse(evento.data);
    actualizarPodioCompartido(datos.podio || []);
  });
  eventos.addEventListener("error", function() {
    estado.servidorCompartido = false;
  });
}

function formatearTiempo(total) {
  const minutos = String(Math.floor(total / 60)).padStart(2, "0");
  const segundos = String(total % 60).padStart(2, "0");
  return minutos + ":" + segundos;
}

cargarPodioServidor();
conectarPodioEnVivo();
renderizar();
