export function WritingChart({ title, unit, data }) {
  const width = 480;
  const height = 260;
  const barWidth = 56;
  const gap = 18;
  const chartHeight = 180;
  const maxValue = 100;

  return (
    <figure className="overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} role="img" aria-label={title}>
        <text x={width / 2} y={18} textAnchor="middle" fontSize="14" fontWeight="700" fill="#1e1b4b">
          {title}
        </text>
        <line x1="40" y1={chartHeight + 40} x2={width - 10} y2={chartHeight + 40} stroke="#cbd5e1" />
        {data.map((d, i) => {
          const barHeight = (d.value / maxValue) * chartHeight;
          const x = 50 + i * (barWidth + gap);
          const y = chartHeight + 40 - barHeight;
          return (
            <g key={d.label}>
              <rect x={x} y={y} width={barWidth} height={barHeight} fill={d.color} rx="3" />
              <text x={x + barWidth / 2} y={y - 6} textAnchor="middle" fontSize="12" fontWeight="700" fill="#1e1b4b">
                {d.value}%
              </text>
              <text x={x + barWidth / 2} y={chartHeight + 58} textAnchor="middle" fontSize="12" fill="#475569">
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-1 text-center text-xs text-slate-400">{unit}</figcaption>
    </figure>
  );
}
