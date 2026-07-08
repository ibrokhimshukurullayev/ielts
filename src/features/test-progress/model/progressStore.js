export async function getAllResults() {
  const response = await fetch("/api/attempts/me", { credentials: "include" });
  if (!response.ok) return {};
  return response.json();
}

export async function saveResult(section, result) {
  const response = await fetch("/api/attempts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      skill: section.toUpperCase(),
      band: result.band,
      correctCount: result.correctCount,
      total: result.total,
      details: result.results,
      testId: result.testId ?? null,
    }),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error ?? "Could not save your result.");
  }
}

export async function getCompletedTestIds() {
  const response = await fetch("/api/attempts/me/completed", { credentials: "include" });
  if (!response.ok) return [];
  const { testIds } = await response.json();
  return testIds ?? [];
}

export async function getResult(section) {
  const all = await getAllResults();
  return all[section] ?? null;
}

export async function getAttemptHistory() {
  const response = await fetch("/api/attempts/me/history", { credentials: "include" });
  if (!response.ok) return {};
  const { history } = await response.json();
  return history ?? {};
}
