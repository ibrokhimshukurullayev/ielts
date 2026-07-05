import { adminJson, adminPreflight, isAdminRequest, unauthorizedAdminResponse } from "@/src/shared/lib/adminAuth";

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";

function buildPrompt(skill, hasFile) {
  const sourceLabel = skill === "LISTENING" ? "audio transcript" : "reading passage";
  const source = hasFile ? "the attached file (a PDF or photo/scan of a page)" : "the pasted text below";
  return `You are extracting an IELTS ${sourceLabel} and its comprehension questions from ${source}.

Read the content and extract:
1. A suitable short title for the passage.
2. The full passage/transcript text, exactly as written (fix obvious OCR artefacts but do not paraphrase).
3. Every comprehension question, in the order they appear, with its correct answer.

For each question, classify its type as one of:
- "tfng" — True / False / Not Given questions. No "options" needed.
- "mcq" — Multiple choice. Include "options" as an array of the choice texts (without the A/B/C/D labels).
- "gap" — Short answer or sentence/gap-fill questions. No "options" needed. If it's a gap-fill sentence, keep the blank as "___" in "text".

If the document has no answer key, infer the most likely correct answer from the passage content; never leave an answer empty.

Return ONLY valid JSON with no markdown fences and no extra commentary, in this exact shape:
{
  "title": string,
  "text": string,
  "questions": {
    "1": { "type": "tfng" | "mcq" | "gap", "text": string, "options": string[] },
    "2": { ... }
  },
  "answers": {
    "1": string,
    "2": string
  }
}

Question ids must be sequential strings starting at "1". Omit "options" (or leave it an empty array) for "tfng" and "gap" types.`;
}

export async function OPTIONS(request) {
  return adminPreflight(request);
}

export async function POST(request) {
  if (!isAdminRequest(request)) return unauthorizedAdminResponse(request);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return adminJson({ error: "GEMINI_API_KEY is not configured on the server." }, { status: 400 }, request);
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const pastedText = formData.get("text");
  const skill = (formData.get("skill") ?? "READING").toString().toUpperCase();

  const hasFile = file && typeof file !== "string";
  const hasText = typeof pastedText === "string" && pastedText.trim().length > 0;

  if (!hasFile && !hasText) {
    return adminJson({ error: "A PDF/image file or pasted text is required." }, { status: 400 }, request);
  }

  let parts;
  if (hasFile) {
    const allowedTypes = ["application/pdf", "image/png", "image/jpeg", "image/webp", "application/json"];
    if (!allowedTypes.includes(file.type)) {
      return adminJson({ error: "Only PDF, PNG, JPEG, WEBP, or JSON files are supported." }, { status: 400 }, request);
    }

    // JSON file: return as-is, exam page normalizes at read time
    if (file.type === "application/json") {
      try {
        const text = await file.text();
        const parsed = JSON.parse(text);
        return adminJson({ extracted: parsed }, undefined, request);
      } catch {
        return adminJson({ error: "Invalid JSON file. Make sure the file contains valid JSON." }, { status: 400 }, request);
      }
    }

    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    parts = [{ text: buildPrompt(skill, true) }, { inline_data: { mime_type: file.type, data: base64 } }];
  } else {
    parts = [{ text: `${buildPrompt(skill, false)}\n\n---\n${pastedText}` }];
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts }],
          generationConfig: {
            responseMimeType: "application/json",
            maxOutputTokens: 8192,
          },
        }),
      }
    );

    if (!response.ok) {
      console.error("Gemini extraction request failed:", response.status, await response.text());
      return adminJson({ error: "The AI extraction service failed. Please try again or enter the test manually." }, { status: 502 }, request);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
    const parsed = JSON.parse(text);

    return adminJson({ extracted: parsed }, undefined, request);
  } catch (err) {
    console.error("Failed to extract test content:", err.message);
    return adminJson({ error: "Couldn't read that file. Please try again or enter the test manually." }, { status: 500 }, request);
  }
}
