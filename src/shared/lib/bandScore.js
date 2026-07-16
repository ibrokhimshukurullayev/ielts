// IELTS Writing band rounding: the average of the four criteria rounds up at
// the midpoints (.25 -> next half band, .75 -> next whole band), never down.
export function roundIeltsBand(avg) {
  const rem = avg % 1;
  if (Math.abs(rem - 0.25) < 1e-9) return Math.floor(avg) + 0.5;
  if (Math.abs(rem - 0.75) < 1e-9) return Math.ceil(avg);
  return Math.round(avg * 2) / 2;
}

export const CRITERIA_KEYS = ["taskScore", "coherenceScore", "lexicalScore", "grammarScore"];

export function computeOverallBand(scores) {
  const values = CRITERIA_KEYS.map((k) => scores[k]);
  if (values.some((v) => v == null || v === "")) return null;
  const avg = values.reduce((sum, v) => sum + Number(v), 0) / values.length;
  return roundIeltsBand(avg);
}
