// lib/scoring.ts

export type NoteForScoring = {
  severity: number;
  created_at: string;
};

export type CustomerAnalytics = {
  score: number;
  scoreLabel: string;
  riskLevel: "Low" | "Medium" | "High";
  totalEvents: number;
  positiveEvents: number;
  negativeEvents: number;
  severeEvents: number;
  neutralEvents: number;
  mostRecentNegativeTimeframe: string | null;
  trend: "Improving" | "Declining" | "Stable" | "New";
  firstSeenLabel: string;
  behaviorCategories: string[];
};

export function calculateCustomerScore(notes: NoteForScoring[]): number {
  if (notes.length === 0) return 100;

  let penalty = 0;

  notes.forEach((n) => {
    if (n.severity >= 4) {
      penalty += n.severity * 6;
    } else if (n.severity >= 3) {
      penalty += n.severity * 4;
    } else {
      penalty += n.severity * 1;
    }
  });

  return Math.max(0, Math.min(100, 100 - penalty));
}

export function getScoreLabel(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Good";
  if (score >= 60) return "Fair";
  if (score >= 40) return "Poor";
  return "High Risk";
}

export function getRiskLevel(score: number): "Low" | "Medium" | "High" {
  if (score >= 75) return "Low";
  if (score >= 50) return "Medium";
  return "High";
}

export function getMostRecentNegativeTimeframe(notes: NoteForScoring[]): string | null {
  const negativeNotes = notes
    .filter((n) => n.severity >= 3)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  if (negativeNotes.length === 0) return null;

  const mostRecent = new Date(negativeNotes[0].created_at);
  const now = new Date();
  const daysDiff = Math.floor((now.getTime() - mostRecent.getTime()) / (1000 * 60 * 60 * 24));

  if (daysDiff <= 7) return "Within the last week";
  if (daysDiff <= 30) return "Within the last month";
  if (daysDiff <= 90) return "Within the last 3 months";
  if (daysDiff <= 180) return "Within the last 6 months";
  if (daysDiff <= 365) return "Within the last year";
  return "Over a year ago";
}

export function getTrend(notes: NoteForScoring[]): "Improving" | "Declining" | "Stable" | "New" {
  if (notes.length < 2) return "New";

  const sortedNotes = [...notes].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  const recentNotes = sortedNotes.filter((n) => new Date(n.created_at) >= thirtyDaysAgo);
  const olderNotes = sortedNotes.filter(
    (n) => new Date(n.created_at) >= sixtyDaysAgo && new Date(n.created_at) < thirtyDaysAgo
  );

  if (recentNotes.length === 0 && olderNotes.length === 0) return "Stable";

  const recentAvgSeverity =
    recentNotes.length > 0
      ? recentNotes.reduce((sum, n) => sum + n.severity, 0) / recentNotes.length
      : 0;

  const olderAvgSeverity =
    olderNotes.length > 0
      ? olderNotes.reduce((sum, n) => sum + n.severity, 0) / olderNotes.length
      : 0;

  if (recentNotes.length === 0 && olderNotes.length > 0) return "Improving";
  if (olderNotes.length === 0 && recentNotes.length > 0) {
    return recentAvgSeverity >= 3 ? "Declining" : "Stable";
  }

  const diff = recentAvgSeverity - olderAvgSeverity;
  if (diff > 0.5) return "Declining";
  if (diff < -0.5) return "Improving";
  return "Stable";
}

export function getFirstSeenLabel(createdAt: string): string {
  const created = new Date(createdAt);
  const now = new Date();
  const daysDiff = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));

  if (daysDiff <= 7) return "This week";
  if (daysDiff <= 30) return "This month";
  if (daysDiff <= 90) return "A few months ago";
  if (daysDiff <= 180) return "About 6 months ago";
  if (daysDiff <= 365) return "About a year ago";
  if (daysDiff <= 730) return "1-2 years ago";
  return "Over 2 years ago";
}

export function getBehaviorCategories(notes: NoteForScoring[], noteTypes: string[]): string[] {
  const categories: Set<string> = new Set();

  noteTypes.forEach((type) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes("no-show") || lowerType.includes("no show")) {
      categories.add("No-shows");
    }
    if (lowerType.includes("late cancel") || lowerType.includes("cancellation")) {
      categories.add("Late cancellations");
    }
    if (lowerType.includes("refused") || lowerType.includes("pay") || lowerType.includes("chargeback")) {
      categories.add("Payment issues");
    }
    if (lowerType.includes("great") || lowerType.includes("good") || lowerType.includes("excellent")) {
      categories.add("Positive history");
    }
    if (lowerType.includes("minor") || lowerType.includes("late but paid")) {
      categories.add("Minor issues");
    }
  });

  return Array.from(categories);
}

export function calculateFullAnalytics(
  notes: NoteForScoring[],
  noteTypes: string[],
  createdAt: string
): CustomerAnalytics {
  const score = calculateCustomerScore(notes);

  return {
    score,
    scoreLabel: getScoreLabel(score),
    riskLevel: getRiskLevel(score),
    totalEvents: notes.length,
    positiveEvents: notes.filter((n) => n.severity <= 2).length,
    negativeEvents: notes.filter((n) => n.severity >= 3).length,
    severeEvents: notes.filter((n) => n.severity >= 4).length,
    neutralEvents: notes.filter((n) => n.severity === 2).length,
    mostRecentNegativeTimeframe: getMostRecentNegativeTimeframe(notes),
    trend: getTrend(notes),
    firstSeenLabel: getFirstSeenLabel(createdAt),
    behaviorCategories: getBehaviorCategories(notes, noteTypes),
  };
}

export function calculatePercentile(customerScore: number, allScores: number[]): number {
  if (allScores.length === 0) return 100;
  const belowCount = allScores.filter((s) => s < customerScore).length;
  return Math.round((belowCount / allScores.length) * 100);
}