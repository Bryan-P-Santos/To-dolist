function getDiasConcluidos() {
  return JSON.parse(localStorage.getItem("diasConcluidos")) || [];
}

function getStreakAtual() {
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

function getRecordeStreak() {
  return localStorage.getItem("recordeStreak") || 0;
}

function salvarRecorde(streak) {
  const recorde = getRecordeStreak();
  if (streak > recorde) {
    localStorage.setItem("recordeStreak", streak);
  }
}
