// Official IELTS Academic Reading raw-score → band conversion
const RAW_TO_BAND_TABLE = [
  { min: 39, band: 9 },
  { min: 37, band: 8.5 },
  { min: 35, band: 8 },
  { min: 33, band: 7.5 },
  { min: 30, band: 7 },
  { min: 27, band: 6.5 },
  { min: 23, band: 6 },
  { min: 19, band: 5.5 },
  { min: 15, band: 5 },
  { min: 13, band: 4.5 },
  { min: 10, band: 4 },
  { min: 8,  band: 3.5 },
  { min: 6,  band: 3 },
  { min: 4,  band: 2.5 },
  { min: 3,  band: 2 },
  { min: 2,  band: 1.5 },
  { min: 1,  band: 1 },
  { min: 0,  band: 0 },
];

export function rawScoreToBand(correctCount) {
  const row = RAW_TO_BAND_TABLE.find((r) => correctCount >= r.min);
  return row ? row.band : 0;
}

export function averageBand(bands) {
  const valid = bands.filter((b) => typeof b === "number" && !Number.isNaN(b));
  if (valid.length === 0) return 0;
  const avg = valid.reduce((sum, b) => sum + b, 0) / valid.length;
  return Math.round(avg * 2) / 2;
}
