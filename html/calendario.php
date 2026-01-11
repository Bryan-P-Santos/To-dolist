<?php
// futuramente: session_start();
// futuramente: verificação de login
?>
<!DOCTYPE html>
<html lang="pt-br">
  <head>
    <base href="/to-dolist/" />
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <link rel="stylesheet" href="css/base.css" />
    <link rel="stylesheet" href="css/nav.css" />
    <link rel="stylesheet" href="css/calendario.css" />
    <link rel="stylesheet" href="css/style.css" />
    <link rel="stylesheet" href="css/darklight.css" />

    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
    />

    <title>Calendário | To-dolist</title>
  </head>
  <body>
    <?php include "html/nav.php"; ?>
    <?php include "html/user-panel.php"; ?>

    <main class="calendar-page">
      <div class="calendar-header">
        <button id="prevMonth">&larr;</button>
        <h2 id="monthYear"></h2>
        <button id="nextMonth">&rarr;</button>
      </div>

      <div class="weekdays">
        <div>Dom</div>
        <div>Seg</div>
        <div>Ter</div>
        <div>Qua</div>
        <div>Qui</div>
        <div>Sex</div>
        <div>Sáb</div>
      </div>

      <div class="calendar-grid" id="calendar"></div>

      <!-- modal -->
      <div id="modal" class="modal">
        <div class="modal-content">
          <h3 id="selected-date"></h3>

          <label>Tarefa salva:</label>
          <select id="task-title">
            <option value="">(Nenhum)</option>
          </select>

          <label>Criar tarefa</label>
          <input
            type="text"
            id="task-name"
            placeholder="Digite o nome da Tarefa"
          />

          <label>Horário:</label>
          <input type="time" id="task-time" />

          <button id="saveTask">Adicionar ao dia</button>
          <button id="closeModal" class="secondary">Cancelar</button>

          <h4>Tarefas nesse dia:</h4>
          <div class="task-list" id="task-list"></div>
        </div>
      </div>

      <div id="tooltip" class="tooltip"></div>

      <h2 class="task-title">
        Minhas Tarefas
        <button id="toggle-task-list" class="toggle-btn">−</button>
      </h2>

      <div class="add-task-box">
        <input type="text" id="novaTarefa" placeholder="Digite uma tarefa..." />
        <button onclick="addTask()">Salvar</button>
      </div>

      <ul id="lista-tarefas"></ul>

      <div id="popup-editar" class="popup hidden">
        <h3>Editar tarefa</h3>
        <input id="edit-nome" />
        <input id="edit-hora" type="time" />
        <button id="btn-salvar-edit">Salvar</button>
        <button id="btn-excluir-edit" class="btn-excluir-edit">Excluir</button>
      </div>

      <div id="popup-dias" class="modal hidden">
        <div class="modal-content">
          <h3>Escolha os dias</h3>
          <input type="date" id="data-inicial" />
          <input type="date" id="data-final" />

          <button id="confirmar-dias">Confirmar</button>
          <button onclick="fecharDias()">Cancelar</button>
        </div>
      </div>
    </main>

    <script src="java/mobile-navbar.js"></script>
    <script src="java/calendario.js"></script>
    <script src="java/darklight.js"></script>
  </body>
</html>
