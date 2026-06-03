const TOTAL_TIME = 10 * 60;
const START_SCORE = 1000;
const ERROR_COST = 10;
const HINT_COST = 20;
const TIMEOUT_LIMIT = 3;
const TIMEOUT_SECONDS = 10;
const PODIUM_KEY = "escapeRoomViajeMensajePodio";
const FINAL_CODE = "OSI-7321";

const rooms = [
  {
    key: "app",
    layer: "Aplicacion",
    title: "El nacimiento del dato",
    type: "scene",
    code: "APP-01",
    hint: "La capa de Aplicacion esta cerca del usuario final y de las aplicaciones que usan servicios de red.",
    error: "Activaste una escena que pertenece a otra parte del proceso. Busca acciones cercanas al usuario.",
    transition: "El dato nacio en una aplicacion de usuario.",
    intro: "El dato acaba de aparecer en una zona cercana al usuario. Activa solo las pantallas donde una aplicacion de usuario crea el dato.",
    scenes: [
      { key: "browser", icon: "▣", title: "Navegador web", text: "Usuario usando una aplicacion de navegacion", ok: true },
      { key: "mail", icon: "✉", title: "Correo electronico", text: "Usuario enviando un mensaje", ok: true },
      { key: "file", icon: "▤", title: "Transferencia", text: "Usuario transfiriendo un archivo", ok: true },
      { key: "bits", icon: "◌", title: "Hardware", text: "Transmision de bits por un medio", ok: false },
      { key: "header", icon: "▧", title: "Encabezado", text: "Sistema agregando metadatos", ok: false },
      { key: "frame", icon: "▥", title: "Tramas", text: "Capa convirtiendo datos en tramas", ok: false }
    ]
  },
  {
    key: "pre",
    layer: "Presentacion",
    title: "La camara de representacion",
    type: "presentation",
    code: "PRE-02",
    hint: "Esta sala no decide el camino del dato. Se ocupa de como se representa para que pueda ser entendido.",
    error: "La herramienta no coincide con el problema de representacion.",
    transition: "El dato ya puede representarse correctamente.",
    intro: "El dato esta ilegible. Arrastra cada herramienta hacia el problema correcto de representacion.",
    tools: [
      { key: "translate", text: "Traducir" },
      { key: "decrypt", text: "Descifrar" },
      { key: "decompress", text: "Descomprimir" }
    ],
    problems: [
      { key: "format", title: "Formato desconocido", symbol: "<?>", needs: "translate" },
      { key: "cipher", title: "Dato cifrado", symbol: "###", needs: "decrypt" },
      { key: "compressed", title: "Dato comprimido", symbol: "[...]", needs: "decompress" }
    ]
  },
  {
    key: "ses1",
    layer: "Sesion",
    title: "El contrato de dialogo",
    type: "sequence",
    code: "SES-03",
    hint: "Una conversacion primero se abre, despues se coordina y finalmente se cierra.",
    error: "La conexion no puede finalizar antes de haber sido establecida y administrada.",
    transition: "El dialogo entre aplicaciones quedo coordinado.",
    intro: "Dos aplicaciones intentan dialogar. Primero conecta cada modulo con su funcion y despues activa el circuito en el orden correcto.",
    steps: [
      { key: "start", name: "Iniciar conexion", slot: "Abrir el dialogo" },
      { key: "manage", name: "Administrar dialogo", slot: "Coordinar la comunicacion" },
      { key: "end", name: "Finalizar conexion", slot: "Cerrar el intercambio" }
    ]
  },
  {
    key: "ses2",
    layer: "Sesion",
    title: "Sincronizacion de dialogo",
    type: "sync",
    code: "SES-04",
    hint: "La capa de Sesion ayuda a coordinar y sincronizar la comunicacion.",
    error: "El dialogo quedo desincronizado. Espera a que ambas senales coincidan.",
    transition: "El dialogo entre aplicaciones quedo coordinado.",
    intro: "Observa las dos ondas. Pulsa Sincronizar cuando ambas crucen juntas la zona marcada."
  },
  {
    key: "tra2",
    layer: "Transporte",
    title: "Camara teorica de transporte",
    type: "theory",
    code: "TRA-06",
    hint: "La capa de Transporte divide datos en segmentos y participa en una transmision confiable entre dispositivos finales.",
    error: "Esa respuesta no coincide con la funcion de la capa de Transporte en la presentacion.",
    transition: "La funcion de Transporte quedo reconocida.",
    intro: "La consola exige una confirmacion teorica antes de liberar el siguiente tramo del viaje.",
    question: "Segun la presentacion, que hace la capa de Transporte?",
    options: [
      { key: "presentation", text: "Traduce, cifra y comprime datos segun sea necesario.", ok: false },
      { key: "transport", text: "Divide datos en segmentos y los transmite confiablemente entre dispositivos finales.", ok: true },
      { key: "network", text: "Determina la mejor ruta y gestiona direccionamiento logico.", ok: false }
    ]
  },
  {
    key: "red",
    layer: "Red",
    title: "Mesa de enrutamiento",
    type: "route",
    code: "RED-07",
    hint: "No siempre la ruta mas corta es la mejor. La capa de Red debe elegir una ruta posible para llegar a destino.",
    error: "Esa ruta no permite transmitir los datos correctamente.",
    transition: "La mejor ruta disponible fue seleccionada.",
    intro: "Analiza el tablero y selecciona la mejor ruta disponible hacia destino.",
    routes: [
      { key: "A", title: "Ruta A", desc: "Corta, pero rota", line: "route-broken", ok: false },
      { key: "B", title: "Ruta B", desc: "Larga, estable y disponible", line: "", ok: true },
      { key: "C", title: "Ruta C", desc: "Directa, pero bloqueada", line: "route-blocked", ok: false }
    ]
  },
  {
    key: "enl1",
    layer: "Enlace",
    title: "Conversor de tramas",
    type: "machine",
    code: "ENL-08",
    hint: "La capa de Enlace prepara datos como tramas y se ocupa de errores y acceso al medio.",
    error: "Esa palanca pertenece a otra capa del modelo.",
    transition: "Los datos fueron preparados como tramas para avanzar entre nodos.",
    intro: "Acciona solo las palancas que convierten el dato en una trama lista para avanzar de nodo a nodo.",
    levers: [
      { key: "frame", text: "Convertir en trama", ok: true },
      { key: "errors", text: "Revisar errores", ok: true },
      { key: "access", text: "Controlar acceso al medio", ok: true },
      { key: "compress", text: "Comprimir datos", ok: false },
      { key: "dialog", text: "Administrar dialogo", ok: false },
      { key: "route", text: "Elegir mejor ruta", ok: false }
    ]
  },
  {
    key: "enl2",
    layer: "Enlace",
    title: "Acceso al medio",
    type: "access",
    code: "ENL-09",
    hint: "Si todos intentan usar el medio al mismo tiempo, la comunicacion falla.",
    error: "El medio fue usado por mas de un nodo a la vez.",
    transition: "Los datos fueron preparados como tramas para avanzar entre nodos.",
    intro: "Habilita el paso a un nodo por vez cuando el canal compartido este libre."
  },
  {
    key: "fis",
    layer: "Fisica",
    title: "El medio fisico",
    type: "physical",
    code: "FIS-10",
    hint: "La capa Fisica se ocupa de que los bits puedan viajar por un medio real.",
    error: "La transmision fisica no esta estable.",
    transition: "Los bits atravesaron el medio fisico.",
    intro: "Elige un medio y calibra energia, estabilidad y conexion hasta lograr transmision estable."
  }
];

const state = {
  team: "",
  screen: "start",
  roomIndex: 0,
  score: START_SCORE,
  secondsLeft: TOTAL_TIME,
  timerId: null,
  errors: 0,
  hints: 0,
  codes: [],
  solved: {},
  hintUsed: {},
  consecutive: {},
  locked: false,
  lockTimer: null,
  lockLeft: 0,
  selectedTool: "",
  activeIntervals: [],
  local: {}
};

const screen = document.querySelector(".screen");

function boot() {
  renderStart();
}

function clearActiveLoops() {
  state.activeIntervals.forEach(clearInterval);
  state.activeIntervals = [];
}

function setScreen(html) {
  clearActiveLoops();
  screen.innerHTML = html;
}

function startTimer() {
  clearInterval(state.timerId);
  state.timerId = setInterval(function () {
    state.secondsLeft -= 1;
    if (state.secondsLeft % 5 === 0) {
      adjustScore(-1);
    }
    updateHud();
    if (state.secondsLeft <= 0) {
      loseGame();
    }
  }, 1000);
}

function resetGame() {
  clearInterval(state.timerId);
  clearActiveLoops();
  state.screen = "start";
  state.roomIndex = 0;
  state.score = START_SCORE;
  state.secondsLeft = TOTAL_TIME;
  state.errors = 0;
  state.hints = 0;
  state.codes = [];
  state.solved = {};
  state.hintUsed = {};
  state.consecutive = {};
  state.locked = false;
  state.local = {};
  renderStart();
}

function formatTime(seconds) {
  const safe = Math.max(0, seconds);
  const minutes = Math.floor(safe / 60);
  const rest = safe % 60;
  return String(minutes).padStart(2, "0") + ":" + String(rest).padStart(2, "0");
}

function adjustScore(amount) {
  state.score = Math.max(0, state.score + amount);
}

function updateHud() {
  const time = document.querySelector(".hud-time");
  const score = document.querySelector(".hud-score");
  const errors = document.querySelector(".hud-errors");
  const hints = document.querySelector(".hud-hints");
  const progress = document.querySelector(".progress-fill");
  if (time) time.textContent = formatTime(state.secondsLeft);
  if (score) score.textContent = state.score;
  if (errors) errors.textContent = state.errors;
  if (hints) hints.textContent = state.hints;
  if (progress) progress.style.width = Math.round((state.codes.length / rooms.length) * 100) + "%";
}

function renderStart() {
  setScreen(`
    <section class="hero glass">
      <div class="hero-grid">
        <div>
          <p class="eyebrow">Centro de control OSI</p>
          <h1 class="hero-title">Escape Room: El viaje del mensaje</h1>
          <p class="hero-subtitle">Un dato debera bajar desde Aplicacion hasta Fisica, atravesar mecanismos de comunicacion y llegar a destino antes de que el tiempo se agote.</p>
          <div class="button-row">
            <button class="primary-btn start-name">Iniciar mision</button>
            <button class="secondary-btn show-podium">Ver podio</button>
          </div>
        </div>
        <div class="lab-visual" aria-hidden="true">
          <span class="layer-ring ring-one"></span>
          <span class="layer-ring ring-two"></span>
          <span class="layer-ring ring-three"></span>
          <span class="data-core"></span>
        </div>
      </div>
    </section>
  `);
  document.querySelector(".start-name").addEventListener("click", renderName);
  document.querySelector(".show-podium").addEventListener("click", renderPodiumOnly);
}

function renderName() {
  setScreen(`
    <section class="entry-panel glass">
      <p class="eyebrow">Identificacion de equipo</p>
      <h2 class="room-title">Registrar escapistas</h2>
      <label class="field-label" for="teamName">Nombre del equipo</label>
      <input class="team-input" id="teamName" maxlength="32" autocomplete="off" placeholder="Equipo Alfa">
      <button class="primary-btn continue-intro">Continuar</button>
    </section>
  `);
  const input = document.querySelector(".team-input");
  input.focus();
  document.querySelector(".continue-intro").addEventListener("click", function () {
    state.team = input.value.trim() || "Equipo sin nombre";
    renderIntro();
  });
}

function renderIntro() {
  setScreen(`
    <section class="entry-panel glass">
      <p class="eyebrow">Briefing de mision</p>
      <h2 class="room-title">El dato despierta</h2>
      <p class="intro-text">Un dato acaba de nacer en una aplicacion de usuario. Para llegar a destino debera atravesar el proceso de comunicacion del Modelo OSI. Cada sala representa una parte del camino: preparacion, transformacion, conexion, transmision, control, estructura y llegada.</p>
      <p class="intro-text">OSI significa Open Systems Interconnection. Es un marco de referencia conceptual desarrollado por ISO para describir como se comunican los dispositivos en una red de computadoras y para guiar la estandarizacion de comunicaciones de red.</p>
      <p class="intro-text">Al enviar datos, la informacion baja desde Aplicacion hasta Fisica. Al bajar, se agregan encabezados y metadatos. Cada capa se comunica con capas adyacentes y tiene responsabilidades especificas.</p>
      <button class="primary-btn begin-game">Entrar al tunel de datos</button>
    </section>
  `);
  document.querySelector(".begin-game").addEventListener("click", function () {
    startTimer();
    renderRoom();
  });
}

function renderHud() {
  return `
    <div class="hud">
      <div class="hud-item"><span class="hud-label">Tiempo</span><span class="hud-value hud-time">${formatTime(state.secondsLeft)}</span></div>
      <div class="hud-item"><span class="hud-label">Puntaje</span><span class="hud-value hud-score">${state.score}</span></div>
      <div class="hud-item"><span class="hud-label">Errores</span><span class="hud-value hud-errors">${state.errors}</span></div>
      <div class="hud-item"><span class="hud-label">Pistas</span><span class="hud-value hud-hints">${state.hints}</span></div>
      <div class="hud-item"><span class="hud-label">Progreso</span><span class="progress-track"><span class="progress-fill" style="width:${Math.round((state.codes.length / rooms.length) * 100)}%"></span></span></div>
    </div>
  `;
}

function renderRoom() {
  const room = rooms[state.roomIndex];
  state.screen = "room";
  state.selectedTool = "";
  if (!state.consecutive[room.key]) state.consecutive[room.key] = 0;
  setScreen(`
    ${renderHud()}
    <section class="room">
      <div class="room-head">
        <div>
          <p class="eyebrow">Sala ${state.roomIndex + 1} de ${rooms.length} · Capa ${room.layer}</p>
          <h2 class="room-title">${room.title}</h2>
          <p class="room-copy">${room.intro}</p>
        </div>
        <aside class="code-bank">
          <p class="code-title">Codigos obtenidos</p>
          ${state.codes.length ? state.codes.map(function (code) { return `<span class="code-chip">${code}</span>`; }).join("") : `<span class="code-chip">Bloqueado</span>`}
        </aside>
      </div>
      <div class="stage">${renderChallenge(room)}</div>
      <div class="stage-footer">
        <button class="secondary-btn hint-btn">Solicitar pista</button>
        <button class="primary-btn validate-btn">Validar sala</button>
        <div class="feedback"></div>
      </div>
      <p class="locked-note">Las salas siguientes permanecen bloqueadas hasta resolver esta camara.</p>
    </section>
  `);
  attachChallenge(room);
  document.querySelector(".hint-btn").addEventListener("click", showHint);
  document.querySelector(".validate-btn").addEventListener("click", validateCurrent);
  updateHud();
}

function renderChallenge(room) {
  if (room.type === "scene") return renderScene(room);
  if (room.type === "presentation") return renderPresentation(room);
  if (room.type === "sequence") return renderSequence(room);
  if (room.type === "sync") return renderSync();
  if (room.type === "segment") return renderSegment();
  if (room.type === "flow") return renderFlow();
  if (room.type === "theory") return renderTheory(room);
  if (room.type === "route") return renderRoute(room);
  if (room.type === "machine") return renderMachine(room);
  if (room.type === "access") return renderAccess();
  return renderPhysical();
}

function attachChallenge(room) {
  if (room.type === "scene") attachScene();
  if (room.type === "presentation") attachPresentation();
  if (room.type === "sequence") attachSequence(room);
  if (room.type === "sync") attachSync();
  if (room.type === "segment") attachSegment();
  if (room.type === "flow") attachFlow();
  if (room.type === "theory") attachTheory();
  if (room.type === "route") attachRoute();
  if (room.type === "machine") attachMachine();
  if (room.type === "access") attachAccess();
  if (room.type === "physical") attachPhysical();
}

function renderScene(room) {
  return `<div class="monitor-grid">${room.scenes.map(function (scene) {
    return `
      <button class="monitor" data-key="${scene.key}" data-ok="${scene.ok}">
        <span class="monitor-icon">${scene.icon}</span>
        <span class="monitor-title">${scene.title}</span>
        <span class="monitor-sub">${scene.text}</span>
      </button>
    `;
  }).join("")}</div>`;
}

function attachScene() {
  state.local.selected = new Set();
  document.querySelectorAll(".monitor").forEach(function (button) {
    button.addEventListener("click", function () {
      if (state.locked) return;
      button.classList.toggle("monitor-active");
      if (state.local.selected.has(button.dataset.key)) state.local.selected.delete(button.dataset.key);
      else state.local.selected.add(button.dataset.key);
    });
  });
}

function renderPresentation(room) {
  return `
    <div class="presentation-grid">
      <div class="tool-rack">${room.tools.map(function (tool) {
        return `<button class="tool" draggable="true" data-tool="${tool.key}">${tool.text}</button>`;
      }).join("")}</div>
      <div class="data-problems">${room.problems.map(function (problem) {
        return `<div class="problem-zone" data-needs="${problem.needs}"><span>${problem.title}</span><span class="problem-symbol">${problem.symbol}</span><span class="monitor-sub">Zona de dato alterado</span></div>`;
      }).join("")}</div>
    </div>
  `;
}

function attachPresentation() {
  state.local.placed = {};
  document.querySelectorAll(".tool").forEach(function (tool) {
    tool.addEventListener("dragstart", function (event) {
      event.dataTransfer.setData("text/plain", tool.dataset.tool);
      state.selectedTool = tool.dataset.tool;
    });
    tool.addEventListener("click", function () {
      if (state.locked || tool.disabled) return;
      state.selectedTool = tool.dataset.tool;
      setFeedback("Herramienta lista. Toca una zona del dato.", "");
    });
  });
  document.querySelectorAll(".problem-zone").forEach(function (zone) {
    zone.addEventListener("dragover", function (event) {
      event.preventDefault();
    });
    zone.addEventListener("drop", function (event) {
      event.preventDefault();
      placeTool(zone, event.dataTransfer.getData("text/plain"));
    });
    zone.addEventListener("click", function () {
      if (state.selectedTool) placeTool(zone, state.selectedTool);
    });
  });
}

function placeTool(zone, tool) {
  if (state.locked || zone.dataset.done === "true") return;
  if (tool === zone.dataset.needs) {
    zone.classList.add("tool-placed");
    zone.dataset.done = "true";
    zone.innerHTML += `<span class="monitor-sub solved">Herramienta aplicada</span>`;
    state.local.placed[tool] = true;
    const toolButton = document.querySelector(`.tool[data-tool="${tool}"]`);
    if (toolButton) toolButton.disabled = true;
    state.selectedTool = "";
    if (Object.keys(state.local.placed).length === 3) solveCurrent();
  } else {
    registerError(currentRoom().error);
  }
}

function renderSequence(room) {
  const shuffled = [room.steps[1], room.steps[2], room.steps[0]];
  return `
    <div class="session-console">
      <div class="module-rack">
        ${shuffled.map(function (step) {
          return `<button class="dialog-module" draggable="true" data-module="${step.key}">${step.name}</button>`;
        }).join("")}
      </div>
      <div class="dialog-slots">
        ${room.steps.map(function (step, index) {
          return `
            <div class="dialog-slot" data-needs="${step.key}" data-order="${index}">
              <span class="switch-number">0${index + 1}</span>
              <span>${step.slot}</span>
              <strong class="slot-result">Modulo pendiente</strong>
            </div>
          `;
        }).join("")}
      </div>
      <div class="switch-row sequence-locked">
        ${room.steps.map(function (step, index) {
          return `<button class="switch-btn" data-order="${index}" disabled><span class="switch-number">0${index + 1}</span>${step.name}</button>`;
        }).join("")}
      </div>
    </div>
  `;
}

function attachSequence() {
  state.local.next = 0;
  state.local.matched = 0;
  state.selectedTool = "";
  document.querySelectorAll(".dialog-module").forEach(function (module) {
    module.addEventListener("dragstart", function (event) {
      event.dataTransfer.setData("text/plain", module.dataset.module);
      state.selectedTool = module.dataset.module;
    });
    module.addEventListener("click", function () {
      if (state.locked || module.disabled) return;
      state.selectedTool = module.dataset.module;
      setFeedback("Modulo cargado. Toca su funcion dentro del contrato.", "");
    });
  });
  document.querySelectorAll(".dialog-slot").forEach(function (slot) {
    slot.addEventListener("dragover", function (event) {
      event.preventDefault();
    });
    slot.addEventListener("drop", function (event) {
      event.preventDefault();
      placeDialogModule(slot, event.dataTransfer.getData("text/plain"));
    });
    slot.addEventListener("click", function () {
      if (state.selectedTool) placeDialogModule(slot, state.selectedTool);
    });
  });
  document.querySelectorAll(".switch-btn").forEach(function (button) {
    button.addEventListener("click", function () {
      if (state.locked) return;
      const order = Number(button.dataset.order);
      if (order === state.local.next) {
        button.classList.add("switch-on");
        button.disabled = true;
        state.local.next += 1;
        if (state.local.next === 3) solveCurrent();
      } else {
        document.querySelectorAll(".switch-btn").forEach(function (item) {
          item.classList.remove("switch-on");
          item.disabled = false;
        });
        state.local.next = 0;
        registerError(currentRoom().error);
      }
    });
  });
}

function placeDialogModule(slot, moduleKey) {
  if (state.locked || slot.dataset.done === "true") return;
  if (moduleKey === slot.dataset.needs) {
    slot.dataset.done = "true";
    slot.classList.add("tool-placed");
    slot.querySelector(".slot-result").textContent = "Modulo conectado";
    const moduleButton = document.querySelector(`.dialog-module[data-module="${moduleKey}"]`);
    if (moduleButton) moduleButton.disabled = true;
    state.selectedTool = "";
    state.local.matched += 1;
    if (state.local.matched === 3) {
      document.querySelector(".sequence-locked").classList.remove("sequence-locked");
      document.querySelectorAll(".switch-btn").forEach(function (button) {
        button.disabled = false;
      });
      setFeedback("Contrato armado. Ahora activa el circuito de sesion en orden.", "solved");
    }
  } else {
    registerError(currentRoom().error);
  }
}

function renderSync() {
  return `
    <div class="wave-stage">
      <div class="sync-zone"></div>
      <span class="wave wave-a"></span>
      <span class="wave wave-b"></span>
    </div>
    <p class="sync-counter">Sincronizaciones correctas: <span class="sync-count">0</span>/3</p>
    <button class="primary-btn sync-action">Sincronizar</button>
  `;
}

function attachSync() {
  state.local.syncs = 0;
  document.querySelector(".sync-action").addEventListener("click", attemptSync);
}

function attemptSync() {
  if (state.locked || state.screen !== "room" || currentRoom().type !== "sync") return;
  const room = currentRoom();
  const zone = document.querySelector(".sync-zone").getBoundingClientRect();
  const waveA = document.querySelector(".wave-a").getBoundingClientRect();
  const waveB = document.querySelector(".wave-b").getBoundingClientRect();
  const centerA = waveA.left + waveA.width / 2;
  const centerB = waveB.left + waveB.width / 2;
  const margin = zone.width * 0.35;
  const expandedZone = {
    left: zone.left - margin,
    right: zone.right + margin,
    top: zone.top,
    bottom: zone.bottom
  };
  const waveAInZone = waveA.right >= expandedZone.left && waveA.left <= expandedZone.right;
  const waveBInZone = waveB.right >= expandedZone.left && waveB.left <= expandedZone.right;
  const wavesAligned = Math.abs(centerA - centerB) <= zone.width * 1.2;
  const valid = waveAInZone && waveBInZone && wavesAligned;
  if (valid) {
    state.local.syncs += 1;
    document.querySelector(".sync-count").textContent = state.local.syncs;
    setFeedback("Sincronizacion aceptada.", "solved");
    if (state.local.syncs >= 3) solveCurrent();
  } else {
    registerError(room.error);
  }
}

function renderSegment() {
  return `
    <div class="belt-stage">
      <div class="cut-zone"></div>
      <div class="data-block"></div>
    </div>
    <p class="segments">Segmentos creados: <span class="segment-count">0</span>/4</p>
  `;
}

function attachSegment() {
  state.local.cuts = 0;
  state.local.lastCut = 0;
}

function renderFlow() {
  return `
    <div class="flow-stage">
      <button class="gate" data-open="false">Compuerta cerrada</button>
      <div class="flow-channel">
        <span class="flow-segment"></span>
        <span class="flow-segment flow-segment-two"></span>
        <span class="flow-segment flow-segment-three"></span>
      </div>
      <div class="capacity">
        <div class="capacity-bar"><div class="capacity-fill"></div></div>
        <p class="capacity-label">Capacidad estable: <span class="stable-seconds">0</span>/8</p>
      </div>
    </div>
  `;
}

function attachFlow() {
  state.local.capacity = 44;
  state.local.stable = 0;
  state.local.open = false;
  const gate = document.querySelector(".gate");
  gate.addEventListener("click", function () {
    if (state.locked) return;
    state.local.open = !state.local.open;
    gate.dataset.open = String(state.local.open);
    gate.textContent = state.local.open ? "Compuerta abierta" : "Compuerta cerrada";
    gate.classList.toggle("gate-open");
  });
  const loop = setInterval(function () {
    if (state.screen !== "room" || currentRoom().type !== "flow" || state.locked) return;
    state.local.capacity += state.local.open ? 5 : -4;
    state.local.capacity = Math.max(0, Math.min(100, state.local.capacity));
    const fill = document.querySelector(".capacity-fill");
    const stable = document.querySelector(".stable-seconds");
    if (fill) {
      fill.style.height = state.local.capacity + "%";
      fill.style.marginTop = (100 - state.local.capacity) + "%";
    }
    if (state.local.capacity >= 35 && state.local.capacity <= 70) {
      state.local.stable += 0.5;
    } else if (state.local.capacity >= 90 || state.local.capacity <= 5) {
      state.local.stable = 0;
      registerError(currentRoom().error);
    } else {
      state.local.stable = Math.max(0, state.local.stable - 0.5);
    }
    if (stable) stable.textContent = Math.floor(state.local.stable);
    if (state.local.stable >= 8) solveCurrent();
  }, 500);
  state.activeIntervals.push(loop);
}

function renderTheory(room) {
  return `
    <div class="theory-panel">
      <p class="eyebrow">Pregunta teorica</p>
      <h3>${room.question}</h3>
      <div class="theory-grid">
        ${room.options.map(function (option) {
          return `<button class="theory-card" data-ok="${option.ok}">${option.text}</button>`;
        }).join("")}
      </div>
    </div>
  `;
}

function attachTheory() {
  state.local.theoryOk = false;
  document.querySelectorAll(".theory-card").forEach(function (button) {
    button.addEventListener("click", function () {
      if (state.locked) return;
      document.querySelectorAll(".theory-card").forEach(function (item) {
        item.classList.remove("route-selected");
      });
      button.classList.add("route-selected");
      state.local.theoryOk = button.dataset.ok === "true";
    });
  });
}

function renderRoute(room) {
  return `<div class="route-map">${room.routes.map(function (route) {
    return `
      <div class="route-card">
        <h3>${route.title}</h3>
        <div class="route-line ${route.line}"></div>
        <p class="room-copy">${route.desc}</p>
        <button class="route-btn" data-ok="${route.ok}">Seleccionar ruta</button>
      </div>
    `;
  }).join("")}</div>`;
}

function attachRoute() {
  document.querySelectorAll(".route-btn").forEach(function (button) {
    button.addEventListener("click", function () {
      if (state.locked) return;
      document.querySelectorAll(".route-btn").forEach(function (item) {
        item.classList.remove("route-selected");
      });
      button.classList.add("route-selected");
      state.local.routeOk = button.dataset.ok === "true";
    });
  });
}

function renderMachine(room) {
  return `
    <div class="machine-grid">
      <div class="machine-core">
        <p class="eyebrow">Dato entrante</p>
        <div class="frame-output">Trama lista: <span class="machine-count">0</span>/3 mecanismos</div>
      </div>
      <div class="lever-grid">${room.levers.map(function (lever) {
        return `<button class="lever" data-ok="${lever.ok}" data-key="${lever.key}">${lever.text}</button>`;
      }).join("")}</div>
    </div>
  `;
}

function attachMachine() {
  state.local.levers = new Set();
  document.querySelectorAll(".lever").forEach(function (button) {
    button.addEventListener("click", function () {
      if (state.locked || button.disabled) return;
      if (button.dataset.ok === "true") {
        button.classList.add("lever-on");
        button.disabled = true;
        state.local.levers.add(button.dataset.key);
        document.querySelector(".machine-count").textContent = state.local.levers.size;
        if (state.local.levers.size === 3) solveCurrent();
      } else {
        registerError(currentRoom().error);
      }
    });
  });
}

function renderAccess() {
  return `
    <div class="medium-stage">
      <div class="node-panel"><button class="node-btn" data-node="A">Nodo A</button><p class="room-copy">Solicitud: <span class="request-a">esperando</span></p></div>
      <div class="node-panel"><button class="node-btn" data-node="B">Nodo B</button><p class="room-copy">Solicitud: <span class="request-b">esperando</span></p></div>
      <div class="node-panel"><button class="node-btn" data-node="C">Nodo C</button><p class="room-copy">Solicitud: <span class="request-c">esperando</span></p></div>
    </div>
    <p class="channel-state"><span class="channel-text">Canal libre.</span> Transmisiones correctas: <span class="access-count">0</span>/5</p>
  `;
}

function attachAccess() {
  state.local.request = "A";
  state.local.busy = false;
  state.local.passed = 0;
  drawRequest();
  document.querySelectorAll(".node-btn").forEach(function (button) {
    button.addEventListener("click", function () {
      if (state.locked) return;
      if (state.local.busy || button.dataset.node !== state.local.request) {
        registerError(currentRoom().error);
        return;
      }
      state.local.busy = true;
      button.classList.add("node-active");
      setFeedback("Nodo autorizado. El canal queda reservado por un instante.", "");
      updateAccessStatus("Canal ocupado por un unico nodo.");
      setTimeout(function () {
        if (state.screen !== "room" || currentRoom().type !== "access") return;
        button.classList.remove("node-active");
        state.local.passed += 1;
        updateAccessStatus("Canal libre.");
        if (state.local.passed >= 5) {
          solveCurrent();
          return;
        }
        state.local.busy = false;
        nextRequest();
      }, 950);
    });
  });
}

function nextRequest() {
  const nodes = ["A", "B", "C"];
  const current = nodes.indexOf(state.local.request);
  state.local.request = nodes[(current + 1 + Math.floor(Math.random() * 2)) % nodes.length];
  drawRequest();
  updateAccessStatus("Canal libre.");
}

function drawRequest() {
  ["a", "b", "c"].forEach(function (letter) {
    const label = document.querySelector(".request-" + letter);
    if (label) label.textContent = letter.toUpperCase() === state.local.request ? "quiere transmitir" : "esperando";
  });
}

function updateAccessStatus(text) {
  const channelText = document.querySelector(".channel-text");
  const accessCount = document.querySelector(".access-count");
  if (channelText) channelText.textContent = text;
  if (accessCount) accessCount.textContent = state.local.passed;
}

function renderPhysical() {
  return `
    <div class="physical-grid">
      <div class="media-list">
        <button class="choice" data-medium="cable">Cable</button>
        <button class="choice" data-medium="fibra">Fibra</button>
        <button class="choice" data-medium="aire">Aire</button>
      </div>
      <div class="control-board">
        <div class="slider-row"><label>Energia</label><input class="energy" type="range" min="0" max="100" value="20"></div>
        <div class="slider-row"><label>Estabilidad</label><input class="stability" type="range" min="0" max="100" value="20"></div>
        <div class="slider-row"><label>Conexion</label><input class="connection" type="range" min="0" max="100" value="20"></div>
        <div class="stable-meter"><div class="stable-fill"></div></div>
      </div>
    </div>
  `;
}

function attachPhysical() {
  state.local.medium = "";
  document.querySelectorAll(".choice").forEach(function (button) {
    button.addEventListener("click", function () {
      if (state.locked) return;
      document.querySelectorAll(".choice").forEach(function (item) {
        item.classList.remove("route-selected");
      });
      button.classList.add("route-selected");
      state.local.medium = button.dataset.medium;
      updateStableMeter();
    });
  });
  document.querySelectorAll(".control-board input").forEach(function (input) {
    input.addEventListener("input", updateStableMeter);
  });
}

function updateStableMeter() {
  const energy = Number(document.querySelector(".energy").value);
  const stability = Number(document.querySelector(".stability").value);
  const connection = Number(document.querySelector(".connection").value);
  const score = scoreRange(energy, 65, 85) + scoreRange(stability, 45, 70) + scoreRange(connection, 70, 95);
  const fill = document.querySelector(".stable-fill");
  if (fill) fill.style.width = Math.round((score / 3) * 100) + "%";
}

function scoreRange(value, min, max) {
  if (value >= min && value <= max) return 1;
  const distance = value < min ? min - value : value - max;
  return Math.max(0, 1 - distance / 45);
}

function validateCurrent() {
  if (state.locked) return;
  const room = currentRoom();
  if (room.type === "scene") {
    const selected = Array.from(document.querySelectorAll(".monitor-active"));
    const valid = selected.length === 3 && selected.every(function (button) { return button.dataset.ok === "true"; });
    valid ? solveCurrent() : registerError(room.error);
    return;
  }
  if (room.type === "presentation" || room.type === "sequence" || room.type === "sync" || room.type === "segment" || room.type === "flow" || room.type === "machine" || room.type === "access") {
    setFeedback("Esta sala se desbloquea desde su mecanismo interactivo.", "");
    return;
  }
  if (room.type === "theory") {
    state.local.theoryOk ? solveCurrent() : registerError(room.error);
    return;
  }
  if (room.type === "route") {
    state.local.routeOk ? solveCurrent() : registerError(room.error);
    return;
  }
  if (room.type === "physical") {
    const energy = Number(document.querySelector(".energy").value);
    const stability = Number(document.querySelector(".stability").value);
    const connection = Number(document.querySelector(".connection").value);
    const valid = state.local.medium && energy >= 65 && energy <= 85 && stability >= 45 && stability <= 70 && connection >= 70 && connection <= 95;
    valid ? solveCurrent() : registerError(room.error);
  }
}

function attachSyncHandlers() {
  return;
}

document.addEventListener("click", function (event) {
  if (state.screen !== "room" || state.locked) return;
  const room = currentRoom();
  if (room.type === "sync" && event.target.classList.contains("validate-btn")) {
    event.preventDefault();
  }
});

function attachDirectButtons() {
  return;
}

function currentRoom() {
  return rooms[state.roomIndex];
}

function showHint() {
  const room = currentRoom();
  if (state.locked) return;
  if (!state.hintUsed[room.key]) {
    state.hintUsed[room.key] = true;
    state.hints += 1;
    adjustScore(-HINT_COST);
    updateHud();
  }
  setFeedback(room.hint, "");
}

function registerError(message) {
  if (state.locked) return;
  const room = currentRoom();
  state.errors += 1;
  state.consecutive[room.key] = (state.consecutive[room.key] || 0) + 1;
  adjustScore(-ERROR_COST);
  setFeedback(message, "wrong");
  updateHud();
  const roomElement = document.querySelector(".room");
  if (roomElement) {
    roomElement.classList.add("wrong");
    setTimeout(function () {
      roomElement.classList.remove("wrong");
    }, 350);
  }
  if (state.consecutive[room.key] >= TIMEOUT_LIMIT) {
    lockRoom();
  }
}

function lockRoom() {
  state.locked = true;
  state.lockLeft = TIMEOUT_SECONDS;
  setRoomDisabled(true);
  const roomElement = document.querySelector(".room");
  if (roomElement) {
    roomElement.insertAdjacentHTML("beforeend", `
      <div class="interference">
        <div class="interference-panel">
          <h3 class="interference-title">El dato entro en zona de interferencia.</h3>
          <p>Recalibrando comunicacion...</p>
          <p>Reinicio en <span class="lock-count">${state.lockLeft}</span>s</p>
        </div>
      </div>
    `);
  }
  clearInterval(state.lockTimer);
  state.lockTimer = setInterval(function () {
    state.lockLeft -= 1;
    const count = document.querySelector(".lock-count");
    if (count) count.textContent = state.lockLeft;
    if (state.lockLeft <= 0) {
      clearInterval(state.lockTimer);
      state.locked = false;
      state.consecutive[currentRoom().key] = 0;
      const overlay = document.querySelector(".interference");
      if (overlay) overlay.remove();
      setRoomDisabled(false);
      setFeedback("Comunicacion recalibrada. Podes continuar.", "");
    }
  }, 1000);
}

function setRoomDisabled(disabled) {
  document.querySelectorAll(".room button, .room input").forEach(function (element) {
    element.disabled = disabled;
  });
}

function setFeedback(text, style) {
  const feedback = document.querySelector(".feedback");
  if (!feedback) return;
  feedback.textContent = text;
  feedback.className = "feedback";
  if (style) feedback.classList.add(style);
}

function solveCurrent() {
  const room = currentRoom();
  if (state.solved[room.key]) return;
  state.solved[room.key] = true;
  state.consecutive[room.key] = 0;
  state.codes.push(room.code);
  setFeedback("Codigo obtenido: " + room.code, "solved");
  setRoomDisabled(true);
  setTimeout(renderTransition, 850);
}

function renderTransition() {
  const room = currentRoom();
  setScreen(`
    ${renderHud()}
    <section class="transition">
      <p class="eyebrow">Capa superada: ${room.layer}</p>
      <h2 class="room-title">Codigo obtenido ${room.code}</h2>
      <div class="travel-line"><span class="travel-dot"></span></div>
      <p class="intro-text">${room.transition}</p>
      <button class="primary-btn next-room">${state.roomIndex === rooms.length - 1 ? "Entregar mensaje" : "Avanzar a la siguiente sala"}</button>
    </section>
  `);
  document.querySelector(".next-room").addEventListener("click", function () {
    state.roomIndex += 1;
    if (state.roomIndex >= rooms.length) {
      winGame();
    } else {
      renderRoom();
    }
  });
  updateHud();
}

function winGame() {
  clearInterval(state.timerId);
  clearActiveLoops();
  if (state.hints === 0) adjustScore(100);
  if (state.secondsLeft > 180) adjustScore(50);
  const used = TOTAL_TIME - state.secondsLeft;
  const entry = {
    team: state.team,
    score: state.score,
    used: used,
    errors: state.errors,
    hints: state.hints,
    date: new Date().toLocaleString("es-AR")
  };
  savePodium(entry);
  renderVictory(entry);
}

function loseGame() {
  clearInterval(state.timerId);
  clearActiveLoops();
  setScreen(`
    <section class="end-panel">
      <p class="eyebrow">Mision interrumpida</p>
      <h1 class="hero-title">Tiempo agotado</h1>
      <p class="intro-text">El dato quedo atrapado antes de completar su viaje por el Modelo OSI.</p>
      <div class="summary-grid">
        <div class="summary-box">
          <p>Sala alcanzada: ${state.roomIndex + 1} de ${rooms.length}</p>
          <p>Puntaje parcial: ${state.score}</p>
          <p>Errores: ${state.errors}</p>
          <p>Pistas usadas: ${state.hints}</p>
        </div>
        <div class="podium-box">${podiumHtml()}</div>
      </div>
      <button class="primary-btn retry">Intentar nuevamente</button>
    </section>
  `);
  document.querySelector(".retry").addEventListener("click", resetGame);
}

function renderVictory(entry) {
  setScreen(`
    <section class="end-panel">
      <p class="eyebrow">Destino alcanzado</p>
      <h1 class="hero-title">Mensaje entregado</h1>
      <p class="intro-text">El dato atraveso el proceso de comunicacion del Modelo OSI y llego correctamente a destino.</p>
      <div class="summary-grid">
        <div class="summary-box">
          <p>Equipo: ${escapeHtml(entry.team)}</p>
          <p>Tiempo usado: ${formatTime(entry.used)}</p>
          <p>Puntaje final: ${entry.score}</p>
          <p>Errores: ${entry.errors}</p>
          <p>Pistas usadas: ${entry.hints}</p>
          <p>Codigos obtenidos: ${state.codes.join(" · ")}</p>
          <p>Codigo final: ${FINAL_CODE}</p>
        </div>
        <div class="podium-box">${podiumHtml()}</div>
      </div>
      <button class="primary-btn retry">Nueva mision</button>
    </section>
  `);
  document.querySelector(".retry").addEventListener("click", resetGame);
}

function renderPodiumOnly() {
  setScreen(`
    <section class="end-panel">
      <p class="eyebrow">Registro persistente</p>
      <h1 class="room-title">Podio de mejores escapistas</h1>
      <div class="podium-box">${podiumHtml()}</div>
      <button class="primary-btn back-start">Volver</button>
    </section>
  `);
  document.querySelector(".back-start").addEventListener("click", renderStart);
}

function getPodium() {
  try {
    const raw = localStorage.getItem(PODIUM_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    return [];
  }
}

function savePodium(entry) {
  const podium = getPodium();
  podium.push(entry);
  podium.sort(function (a, b) {
    if (b.score !== a.score) return b.score - a.score;
    return a.used - b.used;
  });
  localStorage.setItem(PODIUM_KEY, JSON.stringify(podium.slice(0, 5)));
}

function podiumHtml() {
  const podium = getPodium();
  if (!podium.length) return `<p class="room-copy">Todavia no hay equipos en el podio.</p>`;
  return `
    <h2>Podio de mejores escapistas</h2>
    <div class="podium-row"><strong>#</strong><strong>Equipo</strong><strong>Puntos</strong><strong>Tiempo</strong><strong>Errores</strong></div>
    ${podium.slice(0, 5).map(function (entry, index) {
      return `<div class="podium-row"><span>${index + 1}</span><span>${escapeHtml(entry.team)}</span><span>${entry.score}</span><span>${formatTime(entry.used)}</span><span>${entry.errors}</span></div>`;
    }).join("")}
  `;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

document.addEventListener("click", function (event) {
  if (state.screen !== "room" || state.locked) return;
  const room = currentRoom();
  if (room.type === "segment" && event.target.classList.contains("validate-btn")) {
    const now = Date.now();
    if (now - state.local.lastCut < 450) return;
    state.local.lastCut = now;
    const zone = document.querySelector(".cut-zone").getBoundingClientRect();
    const block = document.querySelector(".data-block").getBoundingClientRect();
    const marks = [0.2, 0.4, 0.6, 0.8].map(function (factor) {
      return block.left + block.width * factor;
    });
    const valid = marks.some(function (mark) {
      return mark >= zone.left && mark <= zone.right;
    });
    if (valid) {
      state.local.cuts += 1;
      document.querySelector(".segment-count").textContent = state.local.cuts;
      setFeedback("Segmento correcto.", "solved");
      if (state.local.cuts >= 4) solveCurrent();
    } else {
      registerError(room.error);
    }
  }
});

boot();
