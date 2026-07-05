import { QUESTION_TYPES, TFNG_OPTIONS } from "@/src/entities/question";

export function emptyRow() {
  return { type: QUESTION_TYPES.GAP, text: "", options: "", answer: "", explanation: "" };
}

export function rowsFromContent(content) {
  const questions = content?.questions ?? {};
  const answers = content?.answers ?? {};
  const explanations = content?.explanations ?? {};
  const ids = Object.keys(questions).sort((a, b) => Number(a) - Number(b));
  if (ids.length === 0) return [emptyRow()];
  return ids.map((id) => {
    const q = questions[id];
    if (typeof q === "string") {
      return { type: QUESTION_TYPES.GAP, text: q, options: "", answer: answers[id] ?? "", explanation: explanations[id] ?? "" };
    }
    return {
      type: q.type ?? QUESTION_TYPES.GAP,
      text: q.text ?? "",
      options: (q.options ?? []).join(", "),
      answer: answers[id] ?? "",
      explanation: explanations[id] ?? "",
    };
  });
}

export function contentFromRows({ text, audioUrl, rows }) {
  const questions = {};
  const answers = {};
  const explanations = {};

  rows.forEach((row, index) => {
    const id = String(index + 1);
    const isOptionType = row.type === QUESTION_TYPES.MCQ || row.type === QUESTION_TYPES.MATCHING_HEADINGS;

    questions[id] = {
      type: row.type,
      text: row.text,
      options: row.type === QUESTION_TYPES.TFNG
        ? TFNG_OPTIONS
        : isOptionType
          ? row.options.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
    };
    answers[id] = row.answer;
    if (row.explanation) explanations[id] = row.explanation;
  });

  const content = { text, questions, answers };
  if (audioUrl) content.audioUrl = audioUrl;
  if (Object.keys(explanations).length > 0) content.explanations = explanations;
  return content;
}
