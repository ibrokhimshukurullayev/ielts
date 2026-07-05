export const QUESTION_TYPES = {
  TFNG: "tfng",
  MCQ: "mcq",
  MATCHING_HEADINGS: "matching",
  GAP: "gap",
};

export const QUESTION_TYPE_LABELS = {
  [QUESTION_TYPES.MCQ]: "Multiple choice",
  [QUESTION_TYPES.TFNG]: "True / False / Not Given",
  [QUESTION_TYPES.MATCHING_HEADINGS]: "Matching headings",
  [QUESTION_TYPES.GAP]: "Fill in the blank",
};

export const TFNG_OPTIONS = ["TRUE", "FALSE", "NOT GIVEN"];

export function normalizeQuestion(raw) {
  if (typeof raw === "string") {
    return { type: QUESTION_TYPES.GAP, text: raw, options: [] };
  }
  return {
    type: raw?.type ?? QUESTION_TYPES.GAP,
    text: raw?.text ?? "",
    options: raw?.options ?? [],
  };
}
