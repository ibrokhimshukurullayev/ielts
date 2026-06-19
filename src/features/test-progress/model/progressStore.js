const STORAGE_KEY = "ielts_results";

export function getAllResults() {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY)) ?? {};
  } catch {
    return {};
  }
}

export function saveResult(section, result) {
  if (typeof window === "undefined") return;
  const all = getAllResults();
  all[section] = { ...result, completedAt: new Date().toISOString() };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function getResult(section) {
  return getAllResults()[section] ?? null;
}
