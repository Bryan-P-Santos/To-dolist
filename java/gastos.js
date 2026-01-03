// === variáveis  ===
const salarioInput = document.getElementById("salario");
const gastosInputs = document.querySelectorAll(".gasto");
const totalGastosSpan = document.getElementById("total-gastos");
const sobraSpan = document.getElementById("sobra");
const btnFecharMes = document.getElementById("fechar-mes");

const totalFixoSpan = document.getElementById("total-fixo");
const totalVariavelSpan = document.getElementById("total-variavel");
const totalReceitasSpan = document.getElementById("total-receitas");

const tabelaAno = document.getElementById("tabela-ano");
const anoSelect = document.getElementById("ano-select");

const hoje = new Date();
const mesAtual = hoje.getMonth();
let anoAtual = anoSelect?.value || new Date().getFullYear().toString();

const meses = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

let grafico = null;

// === função utilitária: encontra seção por título h2 ===
function getSectionByTitle(titleText) {
  const sections = document.querySelectorAll(".bloco");
  for (const s of sections) {
    const h2 = s.querySelector("h2");
    if (h2 && h2.innerText.trim().toLowerCase() === titleText.toLowerCase()) {
      return s;
    }
  }
  return null;
}

// === soma inputs .gasto dentro de um elemento (section) ===
function sumGastosInSection(sectionEl) {
  if (!sectionEl) return 0;
  const inputs = sectionEl.querySelectorAll("input.gasto");
  let total = 0;
  inputs.forEach((i) => {
    total += Number(i.value) || 0;
  });
  return total;
}

// === calcula ===
function calcular() {
  const salario = Number(salarioInput.value) || 0;

  // soma despesas por bloco (usando os títulos existentes)
  const totalReceitas = somarReceitas();
  const blocoFixo = getSectionByTitle("Despesas Fixas");
  const blocoVariavel = getSectionByTitle("Despesas Variáveis");
  const blocoLazer = getSectionByTitle("Lazer / Opcional"); // se não achar, será 0

  const totalFixo = sumGastosInSection(blocoFixo);
  const totalVariavel = sumGastosInSection(blocoVariavel);
  const totalLazer = sumGastosInSection(blocoLazer);

  const totalGastos = totalFixo + totalVariavel + totalLazer;
  const sobra = salario - totalGastos;

  // atualiza spans visíveis
  totalReceitasSpan.innerText = totalReceitas.toFixed(2);
  totalFixoSpan.innerText = totalFixo.toFixed(2);
  totalVariavelSpan.innerText = totalVariavel.toFixed(2);
  totalGastosSpan.innerText = totalGastos.toFixed(2);
  sobraSpan.innerText = sobra.toFixed(2);
  sobraSpan.style.color = sobra >= 0 ? "green" : "red";

  // salva parcial (para manter valores ao recarregar)
  salvarParcial(salario);
}

// === salva parcial do mês (inputs e totais) ===
function salvarParcial(salario) {
  const gastosValores = Array.from(
    document.querySelectorAll("input.gasto")
  ).map((i) => Number(i.value) || 0);

  const totalReceitas = somarReceitas(); // ✅ FALTAVA ISSO

  const blocoFixo = getSectionByTitle("Despesas Fixas");
  const blocoVariavel = getSectionByTitle("Despesas Variáveis");
  const blocoLazer = getSectionByTitle("Lazer / Opcional");

  const totalFixo = sumGastosInSection(blocoFixo);
  const totalVariavel = sumGastosInSection(blocoVariavel);
  const totalLazer = sumGastosInSection(blocoLazer);

  const totalGastos = totalFixo + totalVariavel + totalLazer;
  const sobra = totalReceitas - totalGastos;

  const dados = {
    salario,
    totalReceitas,
    gastosValores,
    totalFixo,
    totalVariavel,
    totalLazer,
    totalGastos,
    sobra,
    atualizadoEm: new Date().toISOString(),
  };

  localStorage.setItem("mesAtual", JSON.stringify(dados));
}

// === carregar mês atual (preenche inputs e spans) ===
function carregarMesAtual() {
  const dados = JSON.parse(localStorage.getItem("mesAtual"));
  if (!dados) return;

  salarioInput.value = dados.salario || "";

  const allGastos = document.querySelectorAll("input.gasto");
  allGastos.forEach((input, idx) => {
    input.value =
      dados.gastosValores && dados.gastosValores[idx] !== undefined
        ? dados.gastosValores[idx]
        : "";
  });

  // restaurar totais
  totalReceitasSpan.innerText = (dados.totalReceitas || 0).toFixed(2);

  totalFixoSpan.innerText = (dados.totalFixo || 0).toFixed(2);
  totalVariavelSpan.innerText = (dados.totalVariavel || 0).toFixed(2);
  totalGastosSpan.innerText = (dados.totalGastos || 0).toFixed(2);
  sobraSpan.innerText = (dados.sobra || 0).toFixed(2);
  sobraSpan.style.color = dados.sobra >= 0 ? "green" : "red";
}

// === criar tabela anual baseado na chave do ano atual ===
function criarTabelaAno(dadosAno) {
  if (!tabelaAno) return;
  tabelaAno.innerHTML = "";

  for (let i = 0; i < 12; i++) {
    const d =
      dadosAno && dadosAno[i]
        ? dadosAno[i]
        : { receita: 0, gastos: 0, sobra: 0 };
    const tr = document.createElement("tr");
    if (i === mesAtual) tr.classList.add("mes-atual");
    tr.innerHTML = `
      <td>${meses[i]}</td>
      <td>R$ ${Number(d.receita || 0).toFixed(2)}</td>
      <td>R$ ${Number(d.gastos || 0).toFixed(2)}</td>
      <td style="color:${(d.sobra || 0) >= 0 ? "green" : "red"}">R$ ${Number(
      d.sobra || 0
    ).toFixed(2)}</td>
    `;
    tabelaAno.appendChild(tr);
  }
  // opcional: atualizar gráfico aqui se tiver função
  if (typeof atualizarGrafico === "function") {
    atualizarGrafico(dadosAno);
  }
}

// === salvar mês quando clicar em FECHAR MÊS ===
function fecharMes() {
  const totalReceitas = somarReceitas();

  // recalc para garantir os totais
  const blocoFixo = getSectionByTitle("Despesas Fixas");
  const blocoVariavel = getSectionByTitle("Despesas Variáveis");
  const blocoLazer = getSectionByTitle("Lazer / Opcional");

  const totalFixo = sumGastosInSection(blocoFixo);
  const totalVariavel = sumGastosInSection(blocoVariavel);
  const totalLazer = sumGastosInSection(blocoLazer);
  const totalGastos = totalFixo + totalVariavel + totalLazer;
  const sobra = totalReceitas - totalGastos;

  // salva no ano correto
  const chaveAno = "dadosAno_" + anoAtual;
  const dadosAno = JSON.parse(localStorage.getItem(chaveAno)) || [];
  dadosAno[mesAtual] = {
    receita: totalReceitas,
    gastos: totalGastos,
    sobra,
    detalhe: { totalFixo, totalVariavel, totalLazer },
  };

  localStorage.setItem(chaveAno, JSON.stringify(dadosAno));

  // salva para o dashboard (home)
  localStorage.setItem(
    "dashboard",
    JSON.stringify({
      salario: totalReceitas, // salário total
      receitas: totalReceitas,
      gastos: totalGastos,
      sobra: sobra,
      atualizadoEm: new Date().toISOString(),
    })
  );

  // atualizar ui
  criarTabelaAno(dadosAno);
  alert("Mês fechado e salvo!");
}

// === eventos ===
salarioInput.addEventListener("input", calcular);
document
  .querySelectorAll("input.gasto")
  .forEach((i) => i.addEventListener("input", calcular));
if (btnFecharMes) btnFecharMes.addEventListener("click", fecharMes);
if (anoSelect) {
  anoSelect.addEventListener("change", () => {
    anoAtual = anoSelect.value;
    const dadosDoAno =
      JSON.parse(localStorage.getItem("dadosAno_" + anoAtual)) || [];
    criarTabelaAno(dadosDoAno);
  });
}

// === inicialização ===
gerarAnos();

const dadosAnoInicial =
  JSON.parse(localStorage.getItem("dadosAno_" + anoAtual)) || [];

criarTabelaAno(dadosAnoInicial);

carregarMesAtual();
calcular();

function gerarAnos() {
  if (!anoSelect) return;

  const anoAtualSistema = new Date().getFullYear();
  anoSelect.innerHTML = "";

  for (let ano = anoAtualSistema - 5; ano <= anoAtualSistema + 5; ano++) {
    const option = document.createElement("option");
    option.value = ano;
    option.textContent = ano;

    if (ano === anoAtualSistema) option.selected = true;

    anoSelect.appendChild(option);
  }

  anoAtual = anoAtualSistema.toString();
}

// =====================
// GRÁFICO ANUAL
// =====================
function atualizarGrafico(dadosAno) {
  const canvas = document.getElementById("graficoAno");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  const receitas = [];
  const gastos = [];
  const sobras = [];

  for (let i = 0; i < 12; i++) {
    receitas.push(dadosAno[i]?.receita || 0);
    gastos.push(dadosAno[i]?.gastos || 0);
    sobras.push(dadosAno[i]?.sobra || 0);
  }

  if (grafico) grafico.destroy();

  grafico = new Chart(ctx, {
    type: "bar",
    data: {
      labels: meses,
      datasets: [
        {
          label: "Receitas",
          data: receitas,
          backgroundColor: "#6f52d9",
          borderRadius: 6,
        },
        {
          label: "Gastos",
          data: gastos,
          backgroundColor: "#f55",
          borderRadius: 6,
        },
        {
          label: "Sobra",
          data: sobras,
          backgroundColor: "#2ecc71",
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: "#fff",
          },
        },
      },
      scales: {
        x: {
          ticks: { color: "#fff" },
          grid: { color: "#333" },
        },
        y: {
          ticks: { color: "#fff" },
          grid: { color: "#333" },
        },
      },
    },
  });
}
function somarReceitas() {
  let total = Number(salarioInput.value) || 0;

  document.querySelectorAll("input.receita").forEach((input) => {
    total += Number(input.value) || 0;
  });

  return total;
}
