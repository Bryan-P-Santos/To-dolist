document.getElementById("verFii").addEventListener("click", () => {
  const fii = document.getElementById("fiiSelect").value;
  const resultado = document.getElementById("fiiResultado");

  resultado.innerHTML = "Carregando...";

  fetch(`api/fiis.php?fii=${fii}`)
    .then((res) => res.json())
    .then((data) => {
      if (!data.results || data.results.length === 0) {
        resultado.innerHTML = "Erro ao buscar dados.";
        return;
      }

      const info = data.results[0];

      resultado.innerHTML = `
        <h2>${info.symbol}</h2>
        <p><strong>Nome:</strong> ${info.longName}</p>
        <p><strong>Preço atual:</strong> R$ ${info.regularMarketPrice}</p>
        <p><strong>Variação:</strong> ${info.regularMarketChangePercent}%</p>
        <p><strong>Última atualização:</strong> ${info.regularMarketTime}</p>
      `;
    })
    .catch(() => {
      resultado.innerHTML = "Erro de conexão.";
    });
});
