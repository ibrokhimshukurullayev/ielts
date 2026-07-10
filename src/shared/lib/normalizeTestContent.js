function mapType(type) {
  const t = String(type ?? "").toLowerCase();
  if (t === "true-false-not-given" || t === "yes-no-not-given") return "tfng";
  if (t === "summary-completion" || t === "note-completion" || t === "sentence-completion") return "gap";
  if (t === "matching-headings" || t === "matching-information") return "matching";
  return "mcq"; // multiple-choice, matching-features
}

// Some question types (e.g. "writer's views/claims" TFNG variants) use YES/NO/NOT GIVEN
// instead of TRUE/FALSE/NOT GIVEN. If the source didn't supply explicit options, infer them.
function defaultOptionsForType(type) {
  if (String(type ?? "").toLowerCase() === "yes-no-not-given") return ["YES", "NO", "NOT GIVEN"];
  return undefined;
}

function resolveAnswer(type, answer, options) {
  const t = String(type ?? "").toLowerCase();
  if (["true-false-not-given", "yes-no-not-given", "summary-completion", "note-completion", "sentence-completion"].includes(t)) {
    return String(answer ?? "");
  }
  if (!options || options.length === 0) return String(answer ?? "");
  const prefix = String(answer ?? "").toLowerCase().trim();
  return (
    options.find((opt) => {
      const l = opt.toLowerCase().trim();
      return l === prefix || l.startsWith(prefix + " ") || l.startsWith(prefix + ".");
    }) ?? answer
  );
}

function buildQuestionEntry(q) {
  const opts = q.options ?? defaultOptionsForType(q.type) ?? [];
  let type = mapType(q.type);
  // A "matching" question with no candidate options to pick from can't render as a
  // choice list — fall back to a free-text answer instead of showing an empty control.
  if (type === "matching" && opts.length === 0) type = "gap";
  return {
    question: { type, text: q.question ?? q.text ?? "", options: opts },
    answer: resolveAnswer(q.type, q.answer ?? "", opts),
  };
}

/**
 * Converts user-supplied multi-passage JSON into the internal format used by
 * the exam pages. If content is already in internal format it is returned as-is.
 *
 * User format (questions nested per passage):
 *   { passages: [{ id, title, content, questions: [{ id, type, question, options, answer }] }], questionGroups?: [...] }
 *
 * User format (flat questions array, each tagged with its passage):
 *   { passages?: [{ id, title, content }], questions: [{ id, passageId, type, question, options, answer }], questionGroups?: [...] }
 *
 * Internal format:
 *   { passages: [{ number, title, text, from, to }], questions: { "1": {...} }, answers: { "1": "..." }, questionGroups?: [...] }
 */
export function normalizeTestContent(raw) {
  if (!raw) return raw;

  // Already in internal format: top-level questions is an id-keyed object, not an array.
  if (raw.questions && !Array.isArray(raw.questions)) return raw;

  // Single-passage internal format: has top-level text (and no flat questions array to convert).
  if (raw.text !== undefined && !Array.isArray(raw.questions)) return raw;

  if (Array.isArray(raw.questions)) return normalizeFlatQuestions(raw);

  if (Array.isArray(raw.passages)) return normalizeNestedPassages(raw);

  return raw;
}

function normalizeNestedPassages(raw) {
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
      const { question, answer } = buildQuestionEntry(q);
      questions[id] = question;
      answers[id] = answer;
    }
  }

  return { passages, questions, answers, ...(raw.questionGroups ? { questionGroups: raw.questionGroups } : {}) };
}

// Handles a flat top-level `questions` array where each question carries its own
// `passageId` instead of being nested inside its passage's own `questions` list.
function normalizeFlatQuestions(raw) {
  const passages = [];
  const questions = {};
  const answers = {};

  const byPassageId = new Map();
  for (const q of raw.questions) {
    const pid = q.passageId ?? 1;
    if (!byPassageId.has(pid)) byPassageId.set(pid, []);
    byPassageId.get(pid).push(q);
  }

  const sourcePassages = Array.isArray(raw.passages) ? raw.passages : [];
  const passageIds = [...new Set([...sourcePassages.map((p) => p.id), ...byPassageId.keys()])].sort(
    (a, b) => Number(a) - Number(b)
  );

  for (const pid of passageIds) {
    const source = sourcePassages.find((p) => p.id === pid);
    const qs = (byPassageId.get(pid) ?? []).slice().sort((a, b) => Number(a.id) - Number(b.id));
    const ids = qs.map((q) => Number(q.id)).filter(Number.isFinite);

    passages.push({
      number: typeof pid === "number" ? pid : passages.length + 1,
      title: source?.title ?? `Passage ${pid}`,
      text: source?.content ?? source?.text ?? "",
      from: ids.length ? Math.min(...ids) : 1,
      to: ids.length ? Math.max(...ids) : 1,
    });

    for (const q of qs) {
      const id = String(q.id);
      const { question, answer } = buildQuestionEntry(q);
      questions[id] = question;
      answers[id] = answer;
    }
  }

  return { passages, questions, answers, ...(raw.questionGroups ? { questionGroups: raw.questionGroups } : {}) };
}
