const CRITERIA_LABELS = {
  taskAchievement: "Task Achievement",
  coherence: "Coherence & Cohesion",
  lexicalResource: "Lexical Resource",
  grammar: "Grammatical Range & Accuracy",
};

function heuristicFeedback(wordCount) {
  const base = wordCount >= 250 ? 6.5 : wordCount >= 150 ? 6 : 5;
  const criteria = {};
  for (const key of Object.keys(CRITERIA_LABELS)) {
    criteria[key] = {
      label: CRITERIA_LABELS[key],
      score: base,
      comment: "Automated estimate — connect an ANTHROPIC_API_KEY for detailed AI feedback.",
    };
  }
  return {
    band: base,
    criteria,
    summary:
      "This is a fallback estimate based on word count only. Set the ANTHROPIC_API_KEY environment variable to receive full AI-generated feedback.",
  };
}

export async function POST(request) {
  const { taskTitle, prompt, essay, wordCount } = await request.json();
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return Response.json(heuristicFeedback(wordCount));
  }

  const systemPrompt = `You are an IELTS Writing examiner. Score the candidate's response and return ONLY valid JSON matching this shape, with no markdown fences:
{
  "band": number (overall band, 0-9, in 0.5 steps),
  "criteria": {
    "taskAchievement": { "score": number, "comment": string },
    "coherence": { "score": number, "comment": string },
    "lexicalResource": { "score": number, "comment": string },
    "grammar": { "score": number, "comment": string }
  },
  "summary": string
}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: `Task: ${taskTitle}\n\nPrompt:\n${prompt}\n\nCandidate response (${wordCount} words):\n${essay}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      return Response.json(heuristicFeedback(wordCount));
    }

    const data = await response.json();
    const text = data.content?.[0]?.text ?? "{}";
    const parsed = JSON.parse(text);

    for (const key of Object.keys(CRITERIA_LABELS)) {
      if (parsed.criteria?.[key]) {
        parsed.criteria[key].label = CRITERIA_LABELS[key];
      }
    }

    return Response.json(parsed);
  } catch {
    return Response.json(heuristicFeedback(wordCount));
  }
}
