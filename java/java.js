const progressoTexto = document.getElementById("progresso");
const barra = document.querySelector(".barra-progresso-preenchida");

const valor = progressoTexto.innerText.replace("%", "");
barra.style.width = valor + "%";
const dash = JSON.parse(localStorage.getItem("dashboard"));

if (dash) {
  document.getElementById("strong-sal").innerText = dash.salario.toFixed(2);
  document.getElementById("strong-gast").innerText = dash.gastos.toFixed(2);

  const sobraEl = document.getElementById("strong-sobra");
  sobraEl.innerText = dash.sobra.toFixed(2);

  if (dash.sobra >= 0) {
    sobraEl.style.color = "green";
  } else {
    sobraEl.style.color = "red";
  }
}

/* ==================== LIMPEZA AUTOMÁTICA ==================== */

function limparTarefasAntigas() {
  const hoje = new Date().toISOString().split("T")[0];
  const eventos = getEventos();

  const eventosFiltrados = eventos.filter((e) => e.date >= hoje);

  if (eventosFiltrados.length !== eventos.length) {
    localStorage.setItem("eventosCalendario", JSON.stringify(eventosFiltrados));
  }
}

/* ==================== HOME - RESUMO DO DIA ==================== */

function getEventos() {
  return JSON.parse(localStorage.getItem("eventosCalendario")) || [];
}

function formatarDataHoje() {
  const hoje = new Date();

  const dias = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ];

  const diaSemana = dias[hoje.getDay()];
  const dia = hoje.getDate();
  const mes = hoje.toLocaleDateString("pt-BR", { month: "long" });

  return `${diaSemana}: ${dia} de ${mes}`;
}

function atualizarResumoDoDia() {
  const hoje = new Date();
  const dataISO = hoje.toISOString().split("T")[0];

  const eventos = getEventos();
  const tarefasHoje = eventos.filter((e) => e.date === dataISO);

  const pendentes = tarefasHoje.filter((e) => !e.done);
  const concluidas = tarefasHoje.filter((e) => e.done);

  /* Data */
  const dataEl = document.getElementById("data");
  if (dataEl) dataEl.textContent = formatarDataHoje();

  const resumoCard = document.querySelector(".resumo-dia");
  if (!resumoCard) return;

  resumoCard.querySelectorAll("p")[1].innerHTML =
    pendentes.length > 0
      ? `❌ <strong>${pendentes.length}</strong> Tarefas pendentes`
      : `🎉 <strong>0</strong> Tarefas pendentes`;

  const diaConcluido =
    tarefasHoje.length > 0 && concluidas.length === tarefasHoje.length;

  resumoCard.querySelectorAll("p")[2].innerHTML = diaConcluido
    ? "✅ Dia concluído!"
    : "⏳ Dia em andamento";

  /* 💾 Salva dia concluído + confete */
  if (diaConcluido && !resumoCard.classList.contains("confete-ativo")) {
    resumoCard.classList.add("confete-ativo");
    salvarDiaConcluido(dataISO);
    soltarConfete();
  }

  if (!diaConcluido) {
    resumoCard.classList.remove("confete-ativo");
  }

  /* 📊 Dias concluídos */
  const diasConcluidos = getDiasConcluidos().length;

  let infoDias = resumoCard.querySelector(".dias-concluidos");
  if (!infoDias) {
    infoDias = document.createElement("p");
    infoDias.classList.add("dias-concluidos");
    resumoCard.appendChild(infoDias);
  }
  infoDias.innerHTML = `🏆 <strong>${diasConcluidos}</strong> Dias concluídos`;

  /* 💬 Frase motivacional */
  let frase = resumoCard.querySelector(".frase-dia");
  if (!frase) {
    frase = document.createElement("small");
    frase.classList.add("frase-dia");
    resumoCard.appendChild(frase);
  }
  frase.textContent = fraseAleatoria();

  /* Card Tarefas */
  const cardTarefas = document.querySelector(".card.tarefas p:last-child");
  if (cardTarefas)
    cardTarefas.textContent = `Hoje: ${tarefasHoje.length} tarefas`;
  renderStreak(".resumo-dia");
}

/* Executa ao carregar a HOME */
document.addEventListener("DOMContentLoaded", () => {
  limparTarefasAntigas();
  atualizarResumoDoDia();
});

/* ==================== CONFETE HOME ==================== */

function soltarConfete() {
  const card = document.querySelector(".resumo-dia");
  if (!card) return;

  const cores = [
    "#7c3aed",
    "#9333ea",
    "#a855f7",
    "#22c55e",
    "#facc15",
    "#ef4444",
  ];

  for (let i = 0; i < 35; i++) {
    const confete = document.createElement("div");
    confete.classList.add("confetti");

    const tamanho = Math.random() * 6 + 6;
    confete.style.width = `${tamanho}px`;
    confete.style.height = `${tamanho * 1.6}px`;

    confete.style.left = Math.random() * 100 + "%";
    confete.style.backgroundColor =
      cores[Math.floor(Math.random() * cores.length)];

    confete.style.animationDuration = Math.random() * 1 + 1.8 + "s";
    confete.style.transform = `rotate(${Math.random() * 360}deg)`;

    card.appendChild(confete);
    setTimeout(() => confete.remove(), 2500);
  }
}
function getDiasConcluidos() {
  return JSON.parse(localStorage.getItem("diasConcluidos")) || [];
}

function salvarDiaConcluido(dataISO) {
  const dias = getDiasConcluidos();

  if (!dias.includes(dataISO)) {
    dias.push(dataISO);
    localStorage.setItem("diasConcluidos", JSON.stringify(dias));
  }
}
const frasesMotivacionais = [
  "Pequenos passos todos os dias 💪",
  "Disciplina vence motivação 🔥",
  "Você está mais perto do que imagina 🚀",
  "Constância cria resultados 📈",
  "Um dia produtivo de cada vez 🧠",
  "O progresso importa mais que a perfeição ✨",
  "Seu futuro agradece o esforço de hoje 🌱",
  "Foco no processo, não só no resultado 🎯",
  "Cada tarefa concluída conta 🏆",
  "Organização é liberdade 🗂️",
];

function fraseAleatoria() {
  return frasesMotivacionais[
    Math.floor(Math.random() * frasesMotivacionais.length)
  ];
}
/* ==================== STREAK SYSTEM ==================== */

/* LOCALSTORAGE KEYS */
const STREAK_KEY = "diasConcluidos";
const RECORDE_KEY = "recordeStreak";

/* ====== GET / SET ====== */
function getDiasConcluidos() {
  return JSON.parse(localStorage.getItem(STREAK_KEY)) || [];
}

function salvarDiaConcluido(dataISO) {
  const dias = getDiasConcluidos();
  if (!dias.includes(dataISO)) {
    dias.push(dataISO);
    localStorage.setItem(STREAK_KEY, JSON.stringify(dias));
    salvarRecorde();
  }
}

/* ====== STREAK ====== */
function calcularStreak() {
  const dias = getDiasConcluidos().sort();
  if (dias.length === 0) return 0;

  let streak = 1;

  for (let i = dias.length - 1; i > 0; i--) {
    const atual = new Date(dias[i]);
    const anterior = new Date(dias[i - 1]);
    const diff = (atual - anterior) / (1000 * 60 * 60 * 24);

    if (diff === 1) streak++;
    else break;
  }

  return streak;
}

/* ====== RECORDE ====== */
function salvarRecorde() {
  const streakAtual = calcularStreak();
  const recorde = Number(localStorage.getItem(RECORDE_KEY)) || 0;

  if (streakAtual > recorde) {
    localStorage.setItem(RECORDE_KEY, streakAtual);
  }
}

function getRecorde() {
  return Number(localStorage.getItem(RECORDE_KEY)) || 0;
}

/* ====== FOGO ====== */
function gerarFogo(streak) {
  if (streak >= 300) return "🔥🔥🔥";
  if (streak >= 200) return "🔥🔥";
  if (streak >= 100) return "🔥";
  if (streak >= 50) return "🔥";
  if (streak >= 30) return "🔥";
  if (streak >= 15) return "🔥";
  if (streak >= 10) return "🔥";
  return "🔥";
}

function corFogo(streak) {
  if (streak >= 300) return "linear-gradient(45deg,#7c3aed,#3b82f6)";
  if (streak >= 200) return "linear-gradient(45deg,#7c3aed,#3b82f6)";
  if (streak >= 100) return "linear-gradient(45deg,#3b82f6,#7c3aed)";
  if (streak >= 50) return "#7c3aed";
  if (streak >= 30) return "#3b82f6";
  if (streak >= 15) return "#facc15";
  if (streak >= 10) return "#ef4444";
  return "#999";
}

/* ====== RENDER (HOME OU CALENDÁRIO) ====== */
function renderStreak(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const streak = calcularStreak();
  const recorde = getRecorde();

  let el = container.querySelector(".streak-box");
  if (!el) {
    el = document.createElement("div");
    el.className = "streak-box";
    container.appendChild(el);
  }

  el.innerHTML = `
    <span class="streak-fire">${gerarFogo(streak)}</span>
    <strong>${streak}</strong> dias seguidos
    <small>🏆 Recorde: ${recorde}</small>
  `;

  const fire = el.querySelector(".streak-fire");
  fire.style.background = corFogo(streak);
  fire.style.webkitBackgroundClip = "text";
  fire.style.color = "transparent";
  fire.style.animation = "pulseFire 1.2s infinite";
}

/* ====== CALENDÁRIO (MARCAR DIAS) ====== */
function diaTemStreak(dataISO) {
  return getDiasConcluidos().includes(dataISO);
}

/* ====== MODO TESTE (REMOVÍVEL) ====== */
function setStreakTeste(qtd) {
  const hoje = new Date();
  const dias = [];

  for (let i = 0; i < qtd; i++) {
    const d = new Date(hoje);
    d.setDate(d.getDate() - i);
    dias.push(d.toISOString().split("T")[0]);
  }

  localStorage.setItem(STREAK_KEY, JSON.stringify(dias));
  salvarRecorde();
}

// ====================== login ===================

const container = document.querySelector(".container");
const registerBtn = document.querySelector(".register-btn");
const loginBtn = document.querySelector(".login-btn");

registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});
