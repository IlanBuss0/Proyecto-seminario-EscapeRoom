// Escape Room: El viaje del mensaje
// Lógica principal: niveles, validación, temporizador, progreso y pantallas de fin.

const GAME_TIME_SECONDS = 10 * 60;

const levels = [
  {
    layer: "Aplicación",
    context: "El mensaje nace cuando el usuario usa una aplicación: navegador, mail, chat o cualquier programa que necesita comunicarse por red.",
    question: "Soy la capa más cercana al usuario. No soy la app en sí, pero le doy servicios de red para que pueda comunicarse. ¿Qué capa soy?",
    answers: ["aplicacion", "aplicación", "capa de aplicacion", "capa de aplicación"],
    hint: "Pensá en la capa que interactúa con servicios como HTTP, correo electrónico o transferencia de archivos.",
    code: "APP-01"
  },
  {
    layer: "Presentación",
    context: "El mensaje ya salió de la aplicación, pero antes de viajar debe tener un formato entendible. Esta capa se ocupa de transformar, comprimir o cifrar los datos.",
    question: "Soy la capa que traduce el idioma del mensaje. Puedo cifrarlo, comprimirlo o cambiar su formato para que el receptor lo entienda. ¿Qué capa soy?",
    answers: ["presentacion", "presentación", "capa de presentacion", "capa de presentación"],
    hint: "No decide a dónde va el mensaje. Se encarga de cómo se representan los datos.",
    code: "PRE-02"
  },
  {
    layer: "Sesión",
    context: "Para que dos dispositivos se comuniquen, primero deben establecer, mantener y cerrar una conexión lógica.",
    question: "No transporto el mensaje directamente. Mi trabajo es abrir, mantener y cerrar el diálogo entre dos equipos. ¿Qué capa soy?",
    answers: ["sesion", "sesión", "capa de sesion", "capa de sesión"],
    hint: "Pensá en una videollamada o inicio de sesión: alguien tiene que mantener activa la comunicación.",
    code: "SES-03"
  },
  {
    layer: "Transporte",
    context: "El mensaje debe llegar completo y ordenado. Esta capa puede dividirlo en partes y controlar que llegue correctamente.",
    question: "Si el mensaje es muy grande, lo divido en partes. También puedo asegurarme de que llegue completo, ordenado y sin errores. ¿Qué capa soy?",
    answers: ["transporte", "capa de transporte"],
    hint: "Pensá en TCP y UDP. Esta capa se preocupa por la entrega entre origen y destino.",
    code: "TRA-04"
  },
  {
    layer: "Red",
    context: "Ahora el mensaje necesita saber por dónde viajar. Esta capa define el camino entre redes usando direcciones lógicas.",
    question: "Soy quien decide la ruta. Uso direcciones IP para llevar el mensaje desde una red hasta otra. ¿Qué capa soy?",
    answers: ["red", "capa de red"],
    hint: "Pensá en routers, rutas y direcciones IP.",
    code: "RED-05"
  },
  {
    layer: "Enlace de Datos",
    context: "Antes de llegar al medio físico, el mensaje debe prepararse para moverse dentro de la red local. Esta capa trabaja con tramas y direcciones MAC.",
    question: "Me ocupo de la comunicación dentro de la red local. Organizo los datos en tramas y uso direcciones MAC. ¿Qué capa soy?",
    answers: ["enlace de datos", "enlace", "capa de enlace", "capa de enlace de datos"],
    hint: "No uso IP como dirección principal. Trabajo más cerca de la placa de red.",
    code: "ENL-06"
  },
  {
    layer: "Física",
    context: "El mensaje llega al nivel más bajo. Ahora deja de ser información abstracta y se convierte en señales eléctricas, ópticas o inalámbricas.",
    question: "Soy la capa más baja. Transformo los bits en señales que viajan por cables, fibra óptica o aire. ¿Qué capa soy?",
    answers: ["fisica", "física", "capa fisica", "capa física"],
    hint: "Pensá en cables, conectores, ondas, voltajes y bits viajando por el medio.",
    code: "FIS-07"
  }
];

const state = { currentLevel: 0, solvedCurrent: false, timeLeft: GAME_TIME_SECONDS, timerId: null, finished: false, unlockedCodes: [] };

const $ = (id) => document.getElementById(id);
const timerEl = $("timer");
const layerStepsEl = $("layerSteps");
const progressBarEl = $("progressBar");
const layerTitleEl = $("layerTitle");
const layerContextEl = $("layerContext");
const layerQuestionEl = $("layerQuestion");
const answerInputEl = $("answerInput");
const validateBtnEl = $("validateBtn");
const nextBtnEl = $("nextBtn");
const restartBtnEl = $("restartBtn");
const feedbackEl = $("feedback");
const hintEl = $("hint");
const codeEl = $("unlockedCode");
const gameCardEl = $("gameCard");
const victoryScreenEl = $("victoryScreen");
const defeatScreenEl = $("defeatScreen");

function normalizeText(text) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim();
}

function formatTime(totalSeconds) {
  const min = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const sec = String(totalSeconds % 60).padStart(2, "0");
  return `${min}:${sec}`;
}

function renderSteps() {
  layerStepsEl.innerHTML = "";
  levels.forEach((level, index) => {
    const li = document.createElement("li");
    li.textContent = level.layer;
    if (index < state.currentLevel) li.className = "done";
    else if (index === state.currentLevel && !state.finished) li.className = "current";
    else li.className = "locked";
    layerStepsEl.appendChild(li);
  });
}

function renderLevel() {
  const level = levels[state.currentLevel];
  layerTitleEl.textContent = `Nivel ${state.currentLevel + 1} - Capa de ${level.layer}`;
  layerContextEl.textContent = `Contexto: “${level.context}”`;
  layerQuestionEl.textContent = `Acertijo: “${level.question}”`;
  answerInputEl.value = "";
  answerInputEl.disabled = false;
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";
  hintEl.textContent = "";
  codeEl.textContent = "";
  nextBtnEl.disabled = true;

  const progress = (state.currentLevel / levels.length) * 100;
  progressBarEl.style.setProperty("--progress", `${progress}%`);
  renderSteps();
}

function validateAnswer() {
  if (state.finished) return;

  const level = levels[state.currentLevel];
  const normalizedInput = normalizeText(answerInputEl.value);
  const validAnswers = level.answers.map(normalizeText);

  if (validAnswers.includes(normalizedInput)) {
    state.solvedCurrent = true;
    if (!state.unlockedCodes.includes(level.code)) state.unlockedCodes.push(level.code);
    feedbackEl.textContent = "✅ ¡Correcto!";
    feedbackEl.className = "feedback ok";
    hintEl.textContent = "";
    codeEl.textContent = `Código desbloqueado: ${level.code}`;
    nextBtnEl.disabled = false;
  } else {
    state.solvedCurrent = false;
    feedbackEl.textContent = "❌ Respuesta incorrecta. Intentá de nuevo.";
    feedbackEl.className = "feedback bad";
    hintEl.textContent = `Pista: ${level.hint}`;
    codeEl.textContent = "";
    nextBtnEl.disabled = true;
  }
}

function goNextLevel() {
  if (!state.solvedCurrent || state.finished) return;

  if (state.currentLevel === levels.length - 1) {
    endGame(true);
    return;
  }

  state.currentLevel += 1;
  state.solvedCurrent = false;
  renderLevel();
}

function endGame(victory) {
  state.finished = true;
  clearInterval(state.timerId);
  validateBtnEl.disabled = true;
  nextBtnEl.disabled = true;
  answerInputEl.disabled = true;
  gameCardEl.classList.add("hidden");

  if (victory) {
    progressBarEl.style.setProperty("--progress", "100%");
    renderSteps();
    victoryScreenEl.classList.remove("hidden");
  } else {
    defeatScreenEl.classList.remove("hidden");
  }
}

function tick() {
  if (state.finished) return;

  state.timeLeft -= 1;
  timerEl.textContent = formatTime(Math.max(state.timeLeft, 0));

  if (state.timeLeft <= 0) endGame(false);
}

function startTimer() {
  clearInterval(state.timerId);
  timerEl.textContent = formatTime(state.timeLeft);
  state.timerId = setInterval(tick, 1000);
}

function restartGame() {
  state.currentLevel = 0;
  state.solvedCurrent = false;
  state.timeLeft = GAME_TIME_SECONDS;
  state.finished = false;
  state.unlockedCodes = [];

  validateBtnEl.disabled = false;
  gameCardEl.classList.remove("hidden");
  victoryScreenEl.classList.add("hidden");
  defeatScreenEl.classList.add("hidden");

  renderLevel();
  startTimer();
}

validateBtnEl.addEventListener("click", validateAnswer);
nextBtnEl.addEventListener("click", goNextLevel);
restartBtnEl.addEventListener("click", restartGame);
answerInputEl.addEventListener("keydown", (event) => {
  if (event.key === "Enter") validateAnswer();
});

document.querySelectorAll('[data-restart="true"]').forEach((button) => {
  button.addEventListener("click", restartGame);
});

restartGame();
