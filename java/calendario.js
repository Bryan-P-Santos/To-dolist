/* ==================== LOCAL STORAGE ==================== */
const LS_TAREFAS = "tarefasSalvas";
const LS_EVENTOS = "eventosCalendario";
const btnExcluirEdit = document.getElementById("btn-excluir-edit");

const getTarefas = () => JSON.parse(localStorage.getItem(LS_TAREFAS)) || [];
const saveTarefas = (data) =>
  localStorage.setItem(LS_TAREFAS, JSON.stringify(data));

const getEventos = () => JSON.parse(localStorage.getItem(LS_EVENTOS)) || [];
const saveEventos = (data) =>
  localStorage.setItem(LS_EVENTOS, JSON.stringify(data));

/* ==================== CALENDÁRIO ==================== */
let currentDate = new Date();
const calendar = document.getElementById("calendar");
const monthYear = document.getElementById("monthYear");
/* ==================== CALENDÁRIO ==================== */
function renderCalendar() {
  const eventos = getEventos();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  monthYear.textContent = currentDate.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  calendar.innerHTML = "";

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  // Divs vazias antes do primeiro dia
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    empty.classList.add("empty");
    calendar.appendChild(empty);
  }

  // Obter feriados e comemorativos do ano atual
  const feriados = getFeriados(year);
  const comemorativos = getComemorativos(year);

  // Criar dias do mês
  for (let day = 1; day <= totalDays; day++) {
    const fullDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

    const div = document.createElement("div");
    div.classList.add("day");
    div.innerHTML = `<span>${day}</span>`;

    // Finais de semana
    const dayOfWeek = new Date(year, month, day).getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) div.classList.add("weekend");

    // Feriados
    const feriado = feriados.find((f) => f.date === fullDate);
    if (feriado) {
      div.classList.add("feriado");

      const tooltip = document.createElement("span");
      tooltip.className = "tooltip";
      tooltip.textContent = feriado.name;
      div.appendChild(tooltip);

      div.onclick = () => {
        if (window.innerWidth <= 768) alert(feriado.name);
        openModal(fullDate);
      };
    }

    // Comemorativos
    const comemorativo = comemorativos.find((c) => c.date === fullDate);
    if (comemorativo) {
      div.classList.add("comemorativo");

      const tooltip = document.createElement("span");
      tooltip.className = "tooltip";
      tooltip.textContent = comemorativo.name;
      div.appendChild(tooltip);

      div.onclick = () => {
        if (window.innerWidth <= 768) alert(comemorativo.name);
        openModal(fullDate);
      };
    }

    // Eventos salvos
    if (eventos.some((e) => e.date === fullDate))
      div.classList.add("has-event");

    // Clique padrão se não for feriado nem comemorativo
    if (!feriado && !comemorativo) div.onclick = () => openModal(fullDate);

    calendar.appendChild(div);
  }
}

/* ==================== CSS ==================== */
const style = document.createElement("style");
style.innerHTML = `
  .day { position: relative; }
  .tooltip {
    visibility: hidden;
    background-color: #333;
    color: #fff;
    font-size: 0.8rem;
    text-align: center;
    border-radius: 4px;
    padding: 2px 5px;
    position: absolute;
    z-index: 10;
    top: -25px;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
  }
  .day:hover .tooltip {
    visibility: visible;
  }
  .tooltip-mobile {
    position: absolute;
    top: -25px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #333;
    color: #fff;
    font-size: 0.8rem;
    border-radius: 4px;
    padding: 2px 5px;
    z-index: 20;
  }
`;
document.head.appendChild(style);

/* ==================== MODAL ==================== */
const modal = document.getElementById("modal");
const closeModalBtn = document.getElementById("closeModal");
const saveTaskBtn = document.getElementById("saveTask");
const taskList = document.getElementById("task-list");
const taskSelect = document.getElementById("task-title");

let selectedDate = null;
let eventoEditandoIndex = null;
let tarefaEditandoIndex = null;

/* popup editar */
const popupEditar = document.getElementById("popup-editar");
const editNome = document.getElementById("edit-nome");
const editHora = document.getElementById("edit-hora");
const btnSalvarEdit = document.getElementById("btn-salvar-edit");

function openModal(date) {
  selectedDate = date;
  modal.style.display = "flex";

  // Esconder tarefas salvas
  document.getElementById("lista-tarefas").classList.add("hidden");
  document.getElementById("selected-date").textContent = date
    .split("-")
    .reverse()
    .join("/");

  loadSelectTasks();
  loadTasksForDate(date);
}

closeModalBtn.onclick = () => {
  modal.style.display = "none";
  document.getElementById("lista-tarefas").classList.remove("hidden");
};

function loadSelectTasks() {
  const tarefas = getTarefas();
  taskSelect.innerHTML = `<option value="">(Nenhum)</option>`;

  tarefas.forEach((t, index) => {
    const opt = document.createElement("option");
    opt.value = index;
    opt.textContent = t.nome;
    taskSelect.appendChild(opt);
  });
}

function loadTasksForDate(date) {
  const eventos = getEventos();
  taskList.innerHTML = "";

  eventos.forEach((evento, index) => {
    if (evento.date !== date) return;

    const div = document.createElement("div");
    div.className = "task";

    // ✔ Concluir tarefa
    const btnCompletar = document.createElement("button");
    btnCompletar.className = "btn-completar";
    btnCompletar.textContent = evento.done ? "✔" : "◯";
    if (evento.done) btnCompletar.classList.add("active");

    btnCompletar.onclick = () => {
      evento.done = !evento.done;
      saveEventos(eventos);
      loadTasksForDate(date);
      renderCalendar();
    };

    // 📝 Texto da tarefa
    const label = document.createElement("span");
    label.className = "task-name";
    label.textContent = `${evento.time} — ${evento.task}`;

    // ✏️ Editar
    const btnEditar = document.createElement("button");
    btnEditar.className = "btn-editar";
    btnEditar.innerHTML = '<i class="fa-solid fa-pen"></i>';

    btnEditar.onclick = () => {
      eventoEditandoIndex = index; // evento selecionado
      tarefaEditandoIndex = null; // limpa tarefa salva

      editNome.value = evento.task;
      editHora.value = evento.time;
      popupEditar.classList.remove("hidden");
    };

    div.append(btnCompletar, label, btnEditar);
    taskList.appendChild(div);
  });
}

btnSalvarEdit.onclick = () => {
  if (eventoEditandoIndex === null) return;

  const eventos = getEventos();
  eventos[eventoEditandoIndex].task = editNome.value;
  eventos[eventoEditandoIndex].time = editHora.value;

  saveEventos(eventos);
  popupEditar.classList.add("hidden");
  eventoEditandoIndex = null;

  loadTasksForDate(selectedDate);
  renderCalendar();
};

saveTaskBtn.onclick = () => {
  const time = document.getElementById("task-time").value;
  const tarefaSalvaIndex = taskSelect.value;
  const tarefaCriada = document.getElementById("task-name").value.trim();

  if (!time) {
    alert("Defina um horário");
    return;
  }

  if (!tarefaCriada && tarefaSalvaIndex === "") {
    alert("Escolha ou crie uma tarefa");
    return;
  }

  const eventos = getEventos();
  const tarefas = getTarefas();

  // 🟢 1. Salvar tarefa criada
  if (tarefaCriada) {
    eventos.push({
      date: selectedDate,
      task: tarefaCriada,
      time,
      done: false,
    });
  }

  // 🟢 2. Salvar tarefa salva
  if (tarefaSalvaIndex !== "") {
    eventos.push({
      date: selectedDate,
      task: tarefas[tarefaSalvaIndex].nome,
      time,
      done: false,
    });
  }

  saveEventos(eventos);

  // limpar campos
  document.getElementById("task-name").value = "";
  document.getElementById("task-time").value = "";
  taskSelect.value = "";

  modal.style.display = "none";
  renderCalendar();
};

/* ==================== LISTA DE TAREFAS ==================== */
let tarefas = getTarefas();

function renderTarefas() {
  const lista = document.getElementById("lista-tarefas");
  lista.innerHTML = "";

  tarefas.forEach((t) => {
    const li = document.createElement("li");
    li.className = "task";

    const nome = document.createElement("span");
    nome.className = "task-name";
    nome.textContent = t.nome;

    const hora = document.createElement("span");
    hora.className = "task-time";
    hora.textContent = t.horario;

    const btnEditar = document.createElement("button");
    btnEditar.className = "btn-editar";
    btnEditar.innerHTML = '<i class="fa-solid fa-pen"></i>';

    btnEditar.onclick = () => {
      tarefaEditandoIndex = tarefas.indexOf(t);
      eventoEditandoIndex = null;
      editNome.value = t.nome;
      editHora.value = t.horario;
      popupEditar.classList.remove("hidden");

      btnSalvarEdit.onclick = () => {
        t.nome = editNome.value;
        t.horario = editHora.value;
        saveTarefas(tarefas);
        popupEditar.classList.add("hidden");
        renderTarefas();
      };
    };

    li.append(nome, hora, btnEditar);
    lista.appendChild(li);
  });
}

function addTask() {
  const input = document.getElementById("novaTarefa");
  const nome = input.value.trim();
  if (!nome) return;

  const horario = prompt("Horário da tarefa (HH:MM)", "12:00");
  if (!horario) return;

  tarefas.push({ nome, horario, completa: false });
  saveTarefas(tarefas);
  input.value = "";
  renderTarefas();
}

/* ==================== MINIMIZAR LISTA ==================== */
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggle-task-list");
  const lista = document.getElementById("lista-tarefas");

  if (!toggleBtn || !lista) return;

  toggleBtn.onclick = () => {
    lista.classList.toggle("hidden");
    toggleBtn.textContent = lista.classList.contains("hidden") ? "+" : "−";
  };
});

/* ==================== NAV MÊS ==================== */
const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");

prevMonthBtn.onclick = () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
};

nextMonthBtn.onclick = () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
};

/* ==================== FERIADOS ==================== */
function calcularPascoa(ano) {
  const f = Math.floor,
    G = ano % 19,
    C = f(ano / 100),
    H = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30,
    I = H - f(H / 28) * (1 - f(29 / (H + 1)) * f((21 - G) / 11)),
    J = (ano + f(ano / 4) + I + 2 - C + f(C / 4)) % 7,
    L = I - J,
    mes = 3 + f((L + 40) / 44),
    dia = L + 28 - 31 * f(mes / 4);
  return `${ano}-${String(mes).padStart(2, "0")}-${String(dia).padStart(
    2,
    "0"
  )}`;
}

function getFeriados(ano) {
  const pascoa = new Date(calcularPascoa(ano));
  const dd = (d) =>
    `${ano}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;

  let feriados = [
    { date: `${ano}-01-01`, name: "Ano Novo" },
    { date: `${ano}-04-21`, name: "Tiradentes" },
    { date: `${ano}-05-01`, name: "Dia do Trabalho" },
    { date: `${ano}-09-07`, name: "Independência do Brasil" },
    { date: `${ano}-10-12`, name: "Nossa Senhora Aparecida" },
    { date: `${ano}-11-02`, name: "Finados" },
    { date: `${ano}-11-15`, name: "Proclamação da República" },
    { date: `${ano}-12-25`, name: "Natal" },
  ];

  const carnaval = new Date(pascoa);
  carnaval.setDate(pascoa.getDate() - 47);
  const sextaSanta = new Date(pascoa);
  sextaSanta.setDate(pascoa.getDate() - 2);
  const corpusChristi = new Date(pascoa);
  corpusChristi.setDate(pascoa.getDate() + 60);

  feriados.push(
    { date: dd(carnaval), name: "Carnaval" },
    { date: dd(sextaSanta), name: "Sexta-feira Santa" },
    { date: dd(pascoa), name: "Páscoa" },
    { date: dd(corpusChristi), name: "Corpus Christi" }
  );

  return feriados;
}

/* ==================== INIT ==================== */
renderCalendar();
renderTarefas();
function getComemorativos(ano) {
  const format = (d) =>
    `${ano}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;

  const comemorativos = [
    // 📌 Datas fixas
    { date: `${ano}-01-01`, name: "Confraternização Universal" },
    { date: `${ano}-02-14`, name: "Dia de São Valentim" },
    { date: `${ano}-04-01`, name: "Dia da Mentira" },
    { date: `${ano}-06-12`, name: "Dia dos Namorados" },
    { date: `${ano}-10-12`, name: "Dia das Crianças" },
    { date: `${ano}-10-31`, name: "Halloween" },
    { date: `${ano}-12-24`, name: "Véspera de Natal" },
    { date: `${ano}-12-31`, name: "Ano Novo (Véspera)" },
  ];

  // 📆 Datas móveis (por semana)
  const diaDasMaes = getNthWeekdayOfMonth(ano, 4, 0, 2); // Maio
  const diaDosPais = getNthWeekdayOfMonth(ano, 7, 0, 2); // Agosto
  const acaoDeGracas = getNthWeekdayOfMonth(ano, 10, 4, 4); // Novembro

  if (diaDasMaes)
    comemorativos.push({
      date: format(diaDasMaes),
      name: "Dia das Mães",
    });

  if (diaDosPais)
    comemorativos.push({
      date: format(diaDosPais),
      name: "Dia dos Pais",
    });

  if (acaoDeGracas)
    comemorativos.push({
      date: format(acaoDeGracas),
      name: "Ação de Graças",
    });

  return comemorativos;
}

function getNthWeekdayOfMonth(ano, mes, diaSemana, ocorrencia) {
  let date = new Date(ano, mes, 1);
  let count = 0;

  while (date.getMonth() === mes) {
    if (date.getDay() === diaSemana) {
      count++;
      if (count === ocorrencia) {
        return date;
      }
    }
    date.setDate(date.getDate() + 1);
  }
  return null;
}
btnExcluirEdit.onclick = () => {
  if (!confirm("Deseja excluir?")) return;

  let excluiu = false;

  // 🗑️ Excluir tarefa salva
  if (tarefaEditandoIndex !== null && tarefaEditandoIndex > -1) {
    tarefas.splice(tarefaEditandoIndex, 1);
    saveTarefas(tarefas);
    renderTarefas();
    excluiu = true;
  }

  // 🗑️ Excluir evento do calendário
  if (eventoEditandoIndex !== null && eventoEditandoIndex > -1) {
    const eventos = getEventos();
    eventos.splice(eventoEditandoIndex, 1);
    saveEventos(eventos);
    loadTasksForDate(selectedDate);
    renderCalendar();
    excluiu = true;
  }

  if (!excluiu) {
    alert("Nada selecionado para excluir.");
    return;
  }

  popupEditar.classList.add("hidden");
  tarefaEditandoIndex = null;
  eventoEditandoIndex = null;
};

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
console.log("tarefaEditandoIndex:", tarefaEditandoIndex);
console.log("eventoEditandoIndex:", eventoEditandoIndex);
