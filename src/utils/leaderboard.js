const LEADERBOARD_KEY = 'trivia_battle_leaderboard';

export function getLeaderboard() {
  try {
    const data = localStorage.getItem(LEADERBOARD_KEY);
    if (!data) {
      return [];
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Hiba a ranglista betöltésekor:', err);
    return [];
  }
}

export function saveScore({ name, score, total, difficulty = 'any' }) {
  try {
    const list = getLeaderboard();
    const newEntry = {
      id: `score-${Date.now()}`,
      name: name.trim() || 'Névtelen Harcos',
      score,
      total,
      difficulty,
      percentage: Math.round((score / total) * 100),
      date: new Date().toISOString().split('T')[0]
    };

    const updated = [...list, newEntry]
      .sort((a, b) => {
        // Sort by score descending, then by percentage descending, then latest date
        if (b.score !== a.score) return b.score - a.score;
        const pctB = (b.score / b.total);
        const pctA = (a.score / a.total);
        if (pctB !== pctA) return pctB - pctA;
        return new Date(b.date) - new Date(a.date);
      })
      .slice(0, 10); // Keep top 10 in storage, show top 5 in UI

    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Hiba a pontszám mentésekor:', err);
    return [];
  }
}

export function clearLeaderboard() {
  try {
    localStorage.removeItem(LEADERBOARD_KEY);
  } catch (err) {
    console.error('Hiba a ranglista törlésekor:', err);
  }
}
