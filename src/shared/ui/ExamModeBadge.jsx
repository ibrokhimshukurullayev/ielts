export function ExamModeBadge({ label, stepIndex, total }) {
  return (
    <span className="flex items-center gap-2 rounded-md bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-accent">
      {label} · Part {stepIndex + 1} of {total}
    </span>
  );
}
