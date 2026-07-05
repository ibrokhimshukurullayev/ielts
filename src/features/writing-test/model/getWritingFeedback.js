export async function getWritingFeedback({ taskTitle, prompt, essay, wordCount, taskNumber }) {
  const response = await fetch("/api/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ taskTitle, prompt, essay, wordCount, taskNumber }),
  });

  if (!response.ok) {
    throw new Error("Failed to get feedback");
  }

  return response.json();
}
