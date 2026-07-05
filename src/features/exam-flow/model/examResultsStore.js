function storageKey(examId) {
  return `ielts_exam_results_${examId}`;
}

export function appendExamResult(examId, entry) {
  if (typeof window === "undefined") return;
  const existing = getExamResults(examId);
  const next = [...existing, entry];
  window.sessionStorage.setItem(storageKey(examId), JSON.stringify(next));
}

export function getExamResults(examId) {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.sessionStorage.getItem(storageKey(examId))) ?? [];
  } catch {
    return [];
  }
}

export function clearExamResults(examId) {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(storageKey(examId));
}
