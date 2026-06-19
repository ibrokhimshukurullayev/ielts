import { LISTENING_ANSWERS } from "../data/answers";

function normalize(value) {
  return String(value ?? "").trim().toLowerCase();
}

export function scoreListeningAnswers(userAnswers) {
  const results = {};
  let correctCount = 0;
  const total = Object.keys(LISTENING_ANSWERS).length;

  for (const [id, correctAnswer] of Object.entries(LISTENING_ANSWERS)) {
    const userAnswer = userAnswers[id] ?? "";
    const isCorrect = normalize(userAnswer) === normalize(correctAnswer);
    if (isCorrect) correctCount += 1;
    results[id] = { userAnswer, correctAnswer, isCorrect };
  }

  return { correctCount, total, results };
}
