const HIGH_SCORE_KEY = "claude-invaders:high-score";

type HighScoreRecord = { score: number; updatedAt: string };

export function loadHighScore(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = window.localStorage.getItem(HIGH_SCORE_KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw) as Partial<HighScoreRecord>;
    return typeof parsed.score === "number" ? parsed.score : 0;
  } catch {
    return 0;
  }
}

// Returns true if the score beat the persisted high score (and was saved).
export function saveHighScoreIfBeaten(score: number): boolean {
  if (typeof window === "undefined") return false;
  if (score <= loadHighScore()) return false;
  try {
    const record: HighScoreRecord = { score, updatedAt: new Date().toISOString() };
    window.localStorage.setItem(HIGH_SCORE_KEY, JSON.stringify(record));
    return true;
  } catch {
    return false;
  }
}
