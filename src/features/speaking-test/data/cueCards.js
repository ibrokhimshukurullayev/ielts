export const SPEAKING_PARTS = [
  {
    id: 1,
    title: "Part 1 — Introduction and Interview",
    durationSeconds: 240,
    prepSeconds: 0,
    questions: [
      "Can you tell me a little about your hometown?",
      "Do you work or are you a student?",
      "What do you usually do in your free time?",
      "Do you prefer spending time indoors or outdoors? Why?",
    ],
  },
  {
    id: 2,
    title: "Part 2 — Cue Card",
    durationSeconds: 120,
    prepSeconds: 60,
    cueCard: {
      topic: "Describe a skill you would like to learn.",
      points: [
        "what the skill is",
        "why you would like to learn it",
        "how you would learn it",
        "and explain how this skill might be useful to you in the future",
      ],
    },
  },
  {
    id: 3,
    title: "Part 3 — Two-Way Discussion",
    durationSeconds: 240,
    prepSeconds: 0,
    questions: [
      "Why do you think some skills are harder to learn as an adult than as a child?",
      "How has technology changed the way people learn new skills?",
      "Do you think formal education values practical skills enough?",
      "What role should employers play in training their staff?",
    ],
  },
];
