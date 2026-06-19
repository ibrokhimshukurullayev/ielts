import { READING_ANSWERS } from "../data/parts";

function normalize(value) {
  return String(value ?? "").trim().toLowerCase();
}

export function scoreReadingAnswers(userAnswers) {
  const results = {};
  let correctCount = 0;
  const total = Object.keys(READING_ANSWERS).length;

  for (const [id, correctAnswer] of Object.entries(READING_ANSWERS)) {
    const userAnswer = userAnswers[id] ?? "";
    const isCorrect = normalize(userAnswer) === normalize(correctAnswer);
    if (isCorrect) correctCount += 1;
    results[id] = { userAnswer, correctAnswer, isCorrect };
  }

  return { correctCount, total, results };
}
