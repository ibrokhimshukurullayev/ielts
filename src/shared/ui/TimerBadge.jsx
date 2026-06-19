export function TimerBadge({ formatted, dangerThresholdSeconds = 300, secondsLeft }) {
  const danger = secondsLeft <= dangerThresholdSeconds;
  return (
    <div
      className={`flex items-center gap-2 rounded-full px-4 py-2 font-mono text-lg font-bold ${
        danger ? "bg-rose-100 text-danger animate-pulse" : "bg-slate-100 text-navy"
      }`}
      role="timer"
      aria-live="polite"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" />
      </svg>
      {formatted}
    </div>
  );
}
