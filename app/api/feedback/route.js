import { TASK1_BAND_DESCRIPTORS, TASK2_BAND_DESCRIPTORS } from "@/src/features/writing-test/model/bandDescriptors";

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";

function heuristicFeedback(wordCount) {
  const band = wordCount >= 250 ? 6.5 : wordCount >= 150 ? 6 : 5;
  return {
    band,
    errors: [],
    summary: "Connect a GEMINI_API_KEY to get AI-checked grammar feedback with specific errors and corrections.",
  };
}

function buildSystemPrompt(isTask2, descriptors) {
  return `You are an IELTS Writing grammar checker grading ${isTask2 ? "Task 2" : "Task 1"}.

Use ONLY the "Grammatical Range & Accuracy" rows in the following official IELTS Writing Band Descriptors (Updated May 2023) to estimate a grammar band (0-9) for the response. Ignore Task Achievement/Response, Coherence & Cohesion, and Lexical Resource entirely — score grammar only. Responses of 20 words or fewer must be rated Band 1.

${descriptors}

Find the candidate's most significant grammar errors directly in their response — verb tense, subject-verb agreement, articles, prepositions, word form, sentence structure, punctuation, and other grammatical mistakes. Do NOT include vocabulary, spelling, coherence, or task-achievement issues — grammar only. For each error, quote the exact phrase from the response, explain the grammatical issue, and give a corrected version. List up to 8 of the most impactful grammar errors (fewer if the response has fewer real errors — do not invent errors that aren't there).

Return ONLY valid JSON matching this shape, with no markdown fences and no extra commentary:
{
  "band": number (grammar band only, 0-9, in 0.5 steps),
  "errors": [
    { "quote": string, "issue": string, "suggestion": string }
  ],
  "summary": string (2-3 sentences on the candidate's grammatical accuracy only, referencing specific examples from the response)
}

Each "quote" must be copied verbatim from the candidate's response so it can be located in the text.`;
}

export async function POST(request) {
  const { taskTitle, prompt, essay, wordCount, taskNumber } = await request.json();
  const apiKey = process.env.GEMINI_API_KEY;
  const isTask2 = Number(taskNumber) === 2;

  if (!apiKey) {
    return Response.json(heuristicFeedback(wordCount));
  }

  const descriptors = isTask2 ? TASK2_BAND_DESCRIPTORS : TASK1_BAND_DESCRIPTORS;
  const systemPrompt = buildSystemPrompt(isTask2, descriptors);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [
            {
              role: "user",
              parts: [{ text: `Task: ${taskTitle}\n\nPrompt:\n${prompt}\n\nCandidate response (${wordCount} words):\n${essay}` }],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!response.ok) {
      console.error("Gemini feedback request failed:", response.status, await response.text());
      return Response.json(heuristicFeedback(wordCount));
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
    const parsed = JSON.parse(text);

    return Response.json(parsed);
  } catch (err) {
    console.error("Failed to get Gemini feedback:", err.message);
    return Response.json(heuristicFeedback(wordCount));
  }
}
