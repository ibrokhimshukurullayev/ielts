import { Card } from "@/src/shared";

const AXES = [
  { key: "reading", label: "Reading" },
  { key: "listening", label: "Listening" },
  { key: "writing", label: "Writing" },
  { key: "speaking", label: "Speaking" },
];

const SIZE = 220;
const CENTER = SIZE / 2;
const MAX_RADIUS = SIZE / 2 - 36;
const MAX_BAND = 9;

function pointAt(index, total, radius) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  return [CENTER + radius * Math.cos(angle), CENTER + radius * Math.sin(angle)];
}

export function SkillRadarCard({ results }) {
  const ringLevels = [0.25, 0.5, 0.75, 1];
  const points = AXES.map((axis, i) => {
    const band = results[axis.key]?.band ?? 0;
    const radius = (band / MAX_BAND) * MAX_RADIUS;
    return pointAt(i, AXES.length, radius);
  });
  const polygon = points.map((p) => p.join(",")).join(" ");

  return (
    <Card>
      <p className="text-xs font-bold uppercase tracking-wide text-accent">Progress Radar</p>
      <p className="mt-2 text-lg font-bold text-navy">Skill shape</p>

      <div className="mt-4 flex items-center justify-center">
        <svg width={SIZE} height={SIZE}>
          {ringLevels.map((level) => {
            const ringPoints = AXES.map((_, i) => pointAt(i, AXES.length, MAX_RADIUS * level).join(","));
            return (
              <polygon key={level} points={ringPoints.join(" ")} fill="none" stroke="#e2e8f0" strokeWidth="1" />
            );
          })}

          {AXES.map((axis, i) => {
            const [x, y] = pointAt(i, AXES.length, MAX_RADIUS);
            const [lx, ly] = pointAt(i, AXES.length, MAX_RADIUS + 16);
            return (
              <g key={axis.key}>
                <line x1={CENTER} y1={CENTER} x2={x} y2={y} stroke="#e2e8f0" strokeWidth="1" />
                <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fontSize="11" fill="#64748b">
                  {axis.label}
                </text>
              </g>
            );
          })}

          <polygon points={polygon} fill="#4f46e5" fillOpacity="0.18" stroke="#4f46e5" strokeWidth="2" />
          {points.map(([x, y], i) => (
            <circle key={AXES[i].key} cx={x} cy={y} r="3" fill="#4f46e5" />
          ))}

          <circle cx={CENTER} cy={CENTER} r="3" fill="#ef4444" />
        </svg>
      </div>
    </Card>
  );
}
