import { Card } from "@/src/shared";

const SKILLS = [
  { key: "reading", label: "Reading", color: "#1d4ed8" },
  { key: "listening", label: "Listening", color: "#15803d" },
  { key: "writing", label: "Writing", color: "#b45309" },
  { key: "speaking", label: "Speaking", color: "#be185d" },
];

const WIDTH = 460;
const HEIGHT = 200;
const PAD_X = 12;
const PAD_Y = 16;
const MAX_BAND = 9;

function pointsFor(series) {
  if (series.length === 0) return [];
  const innerWidth = WIDTH - PAD_X * 2;
  const innerHeight = HEIGHT - PAD_Y * 2;
  return series.map((entry, i) => {
    const x = PAD_X + (series.length === 1 ? innerWidth / 2 : (i / (series.length - 1)) * innerWidth);
    const y = PAD_Y + innerHeight - (entry.band / MAX_BAND) * innerHeight;
    return [x, y];
  });
}

export function SkillRadarCard({ results, history }) {
  const hasAnyHistory = SKILLS.some((s) => (history?.[s.key]?.length ?? 0) > 0);

  return (
    <Card>
      <p className="text-xs font-bold uppercase tracking-wide text-accent">Progress over time</p>
      <p className="mt-2 text-lg font-bold text-navy">Skill shape</p>
      <p className="mt-1 text-xs text-slate-400">See how each skill&apos;s band is improving across your attempts.</p>

      {!hasAnyHistory ? (
        <p className="mt-6 rounded-lg bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
          Complete a few tests to see your progress chart here.
        </p>
      ) : (
        <div className="mt-4">
          <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} width="100%" height={HEIGHT}>
            {[0, 0.25, 0.5, 0.75, 1].map((level) => {
              const y = PAD_Y + (HEIGHT - PAD_Y * 2) * (1 - level);
              return <line key={level} x1={PAD_X} y1={y} x2={WIDTH - PAD_X} y2={y} stroke="#f1f5f9" strokeWidth="1" />;
            })}

            {SKILLS.map((skill) => {
              const series = history?.[skill.key] ?? [];
              if (series.length === 0) return null;
              const points = pointsFor(series);
              const path = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
              return (
                <g key={skill.key}>
                  <path d={path} fill="none" stroke={skill.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  {points.map(([x, y], i) => (
                    <circle key={i} cx={x} cy={y} r="3" fill={skill.color} />
                  ))}
                </g>
              );
            })}
          </svg>

          <div className="mt-4 flex flex-wrap gap-4">
            {SKILLS.map((skill) => {
              const band = results?.[skill.key]?.band;
              return (
                <div key={skill.key} className="flex items-center gap-1.5 text-xs text-slate-600">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: skill.color }} />
                  {skill.label}
                  {band != null && <span className="font-bold text-navy">{band}</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}
