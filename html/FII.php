<!DOCTYPE html>
<html lang="pt-br">
  <head>
    <base href="/to-dolist/" />
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="css/nav.css" />
    <link rel="stylesheet" href="css/tstfii.css" />
    <title>fundos de Investimenstos | to-dolist</title>
  </head>
  <body>
    <header>
      <nav>
        <div class="navbar-name">
          <a href="#" class="logo-txt">To-dolist</a>
        </div>
        <ul class="nav-list">
          <li><a href="html/home.html">Home</a></li>
          <li><a href="html/calendario.html">Calendário</a></li>
          <li><a href="html/gastos.html">Seus Gastos</a></li>
          <li><a href="html/metas.html">Suas Metas</a></li>
        </ul>

        <!-- user -->
        <button id="user-btn" class="user-btn">
          <i class="fa-solid fa-user"></i>
        </button>

        <div class="mobile-menu">
          <div class="line1"></div>
          <div class="line2"></div>
          <div class="line3"></div>
        </div>
      </nav>
    </header>
    <!-- user -->
    <aside class="user-panel" id="userPanel">
      <h2>Conta</h2>

      <div class="user-info">
        <div class="avatar"></div>
        <p>Não logado</p>
      </div>

      <button id="login">Entrar</button>
      <button id="cadastro">Criar conta</button>

      <hr />

      <button id="Configurações">⚙️ Configurações</button>

      <div class="btn">
        <div class="btn_indicator">
          <div class="btn_icon-container">
            <i class="btn_icon fa-solid fa-sun"></i>
          </div>
        </div>
      </div>

      <button id="sair">Sair</button>
    </aside>
    <main class="fiis-container">
      <h1>Fundos Imobiliários (FIIs)</h1>

      <div class="fii-controls">
        <select id="fiiSelect">
          <option value="KNCR11">KNCR11</option>
          <option value="HGLG11">HGLG11</option>
          <option value="MXRF11">MXRF11</option>
          <option value="VISC11">VISC11</option>
        </select>

        <button id="verFii">Ver informações</button>
      </div>

      <div id="fiiResultado" class="fii-card">
        <p>Selecione um FII para ver os dados.</p>
      </div>
    </main>

    <script src="java/fii.js"></script>
    <script src="java/mobile-navbar.js"></script>
  </body>
</html>
