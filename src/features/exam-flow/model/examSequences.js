// ── Static sequences (kept for backward compat) ──────────────────────────────
export const EXAM_SEQUENCES = {};

// ── Dynamic exam (created at runtime from random tests) ───────────────────────
const DYN_PREFIX = "ielts_dyn_exam_";
const TIMER_PREFIX = "ielts_exam_start_";

export function createDynamicExam(reading, listening, writing) {
  if (typeof window === "undefined") return null;
  const id = `dyn_${Date.now()}`;
  const sequence = {
    label: "Mock Exam",
    steps: [
      { skill: "reading", slug: reading.slug },
      { skill: "listening", slug: listening.slug },
      { skill: "writing", slug: writing.slug },
    ],
  };
  sessionStorage.setItem(DYN_PREFIX + id, JSON.stringify(sequence));
  sessionStorage.setItem(TIMER_PREFIX + id, String(Date.now()));
  return id;
}

function getDynamicExam(id) {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(DYN_PREFIX + id);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function resolveExam(examId) {
  return EXAM_SEQUENCES[examId] ?? getDynamicExam(examId) ?? null;
}

// ── Public helpers ────────────────────────────────────────────────────────────
export function getExamStep(examId, stepIndex) {
  return resolveExam(examId)?.steps[stepIndex] ?? null;
}

export function getExamStepUrl(examId, stepIndex) {
  const step = getExamStep(examId, stepIndex);
  if (!step) return null;
  return `/${step.skill}/${step.slug}?exam=${examId}&step=${stepIndex}`;
}

export function getExamLabel(examId) {
  return resolveExam(examId)?.label ?? "Mock Exam";
}

export function getExamLength(examId) {
  return resolveExam(examId)?.steps.length ?? 0;
}

// ── Elapsed timer ─────────────────────────────────────────────────────────────
export function getExamStartTime(examId) {
  if (typeof window === "undefined") return null;
  const v = sessionStorage.getItem(TIMER_PREFIX + examId);
  return v ? Number(v) : null;
}
