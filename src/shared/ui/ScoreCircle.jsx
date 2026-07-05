"use client";

import { useEffect, useState } from "react";

export function ScoreCircle({ band, size = 180 }) {
  const [animatedBand, setAnimatedBand] = useState(0);
  const radius = size / 2 - 12;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(1, animatedBand / 9);
  const offset = circumference * (1 - pct);

  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimatedBand(band));
    return () => cancelAnimationFrame(id);
  }, [band]);

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#e2e8f0"
        strokeWidth="12"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#10b981"
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 1s ease-out" }}
      />
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        transform={`rotate(90, ${size / 2}, ${size / 2})`}
        fontSize={size * 0.26}
        fontWeight="800"
        fill="#1e1b4b"
      >
        {band.toFixed(1)}
      </text>
    </svg>
  );
}
