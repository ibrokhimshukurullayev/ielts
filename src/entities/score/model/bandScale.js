const RAW_TO_BAND_TABLE = [
  { min: 39, band: 9 },
  { min: 37, band: 8.5 },
  { min: 35, band: 8 },
  { min: 32, band: 7.5 },
  { min: 30, band: 7 },
  { min: 26, band: 6.5 },
  { min: 23, band: 6 },
  { min: 18, band: 5.5 },
  { min: 16, band: 5 },
  { min: 13, band: 4.5 },
  { min: 10, band: 4 },
  { min: 0, band: 3 },
];

export function rawScoreToBand(correctCount) {
  const row = RAW_TO_BAND_TABLE.find((r) => correctCount >= r.min);
  return row ? row.band : 3;
}

export function averageBand(bands) {
  const valid = bands.filter((b) => typeof b === "number" && !Number.isNaN(b));
  if (valid.length === 0) return 0;
  const avg = valid.reduce((sum, b) => sum + b, 0) / valid.length;
  return Math.round(avg * 2) / 2;
}
