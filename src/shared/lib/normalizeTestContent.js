function mapType(type) {
  if (type === "true-false-not-given") return "tfng";
  if (type === "summary-completion") return "gap";
  if (type === "matching-headings") return "matching";
  return "mcq"; // multiple-choice, matching-features
}

function resolveAnswer(type, answer, options) {
  if (type === "true-false-not-given" || type === "summary-completion") return String(answer ?? "");
  if (!options || options.length === 0) return String(answer ?? "");
  const prefix = String(answer ?? "").toLowerCase().trim();
  return (
    options.find((opt) => {
      const l = opt.toLowerCase().trim();
      return l === prefix || l.startsWith(prefix + " ") || l.startsWith(prefix + ".");
    }) ?? answer
  );
}

/**
 * Converts user-supplied multi-passage JSON into the internal format used by
 * the exam pages. If content is already in internal format it is returned as-is.
 *
 * User format:
 *   { passages: [{ id, title, content, questions: [{ id, type, question, options, answer }] }] }
 *
 * Internal format:
 *   { passages: [{ number, title, text, from, to }], questions: { "1": {...} }, answers: { "1": "..." } }
 */
export function normalizeTestContent(raw) {
  if (!raw) return raw;

  // Already in internal format: has top-level questions object
  if (raw.questions) return raw;

  // Single-passage internal format: has top-level text
  if (raw.text !== undefined) return raw;

  // User's multi-passage format
  if (!Array.isArray(raw.passages)) return raw;

  const passages = [];
  const questions = {};
  const answers = {};

  for (const passage of raw.passages) {
    const pqs = passage.questions ?? [];
    const ids = pqs.map((q) => Number(q.id)).filter(Number.isFinite);
    passages.push({
      number: typeof passage.id === "number" ? passage.id : passages.length + 1,
      title: passage.title ?? "",
      text: passage.content ?? passage.text ?? "",
      from: ids.length ? Math.min(...ids) : 1,
      to: ids.length ? Math.max(...ids) : 1,
    });
    for (const q of pqs) {
      const id = String(q.id);
      const opts = q.options ?? [];
      questions[id] = { type: mapType(q.type), text: q.question ?? q.text ?? "", options: opts };
      answers[id] = resolveAnswer(q.type, q.answer ?? "", opts);
    }
  }

  return { passages, questions, answers };
}
