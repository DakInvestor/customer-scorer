// lib/scoring.ts

// Minimal shape we need from a note/event for scoring.
export type NoteForScoring = {
  severity: number | null;        // can be negative (bonus) or positive (penalty)
  created_at?: string | null;     // kept for future time-decay logic
};

// Label buckets for the UI
export function getScoreLabel(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Good";
  if (score >= 60) return "Fair";
  if (score >= 40) return "Risky";
  return "High risk";
}

/**
 * Calculate a reliability score from 0–100.
 *
 * Rules:
 *  - Start from 100.
 *  - Positive severity = penalties (bad behavior) -> subtract points.
 *  - Negative severity = bonuses (good behavior) -> add points.
 *  - Penalties hit harder than bonuses help.
 */
export function calculateCustomerScore(notes: NoteForScoring[]): number {
  if (!notes || notes.length === 0) {
    return 100; // brand new customer, no history yet
  }

  // Tuning knobs:
  // each +1 severity = -8 points
  // each -1 severity = +3 points
  const PENALTY_WEIGHT = 8;
  const BONUS_WEIGHT = 3;

  let score = 100;

  for (const note of notes) {
    if (typeof note.severity !== "number" || Number.isNaN(note.severity)) {
      continue;
    }

    if (note.severity > 0) {
      // bad event: knock points off
      score -= note.severity * PENALTY_WEIGHT;
    } else if (note.severity < 0) {
      // good event: add some points back
      const bonusMagnitude = -note.severity; // convert -2 -> 2, etc.
      score += bonusMagnitude * BONUS_WEIGHT;
    }
  }

  // Clamp to [0, 100] and round
  if (score < 0) score = 0;
  if (score > 100) score = 100;

  return Math.round(score);
}
