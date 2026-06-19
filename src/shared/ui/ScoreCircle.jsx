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
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        className="rotate-90"
        style={{ transform: `rotate(90deg)`, transformOrigin: "center" }}
        fontSize={size * 0.26}
        fontWeight="800"
        fill="#1e1b4b"
      >
        {band.toFixed(1)}
      </text>
    </svg>
  );
}
