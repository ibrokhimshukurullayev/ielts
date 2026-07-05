function normalize(value) {
  return String(value ?? "").trim().toLowerCase();
}

export function scoreReadingAnswers(userAnswers, correctAnswers) {
  const results = {};
  let correctCount = 0;
  const total = Object.keys(correctAnswers).length;

  for (const [id, correctAnswer] of Object.entries(correctAnswers)) {
    const userAnswer = userAnswers[id] ?? "";
    const isCorrect = normalize(userAnswer) === normalize(correctAnswer);
    if (isCorrect) correctCount += 1;
    results[id] = { userAnswer, correctAnswer, isCorrect };
  }

  return { correctCount, total, results };
}
