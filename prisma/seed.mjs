import "dotenv/config";
import { prisma } from "../src/shared/lib/prisma.js";
import { READING_PARTS } from "../src/features/reading-test/data/parts.js";
import { LISTENING_SECTIONS } from "../src/features/listening-test/data/sections.js";
import { LISTENING_ANSWERS } from "../src/features/listening-test/data/answers.js";
import { TASK1, TASK2 } from "../src/features/writing-test/data/tasks.js";

function letterToFullOption(letter, options) {
  const match = options.find((opt) => opt.trim().toUpperCase().startsWith(`${letter.toUpperCase()}.`));
  return match ?? letter;
}

function flattenReadingPart(part) {
  const questions = {};
  const answers = {};

  for (const group of part.questionGroups) {
    for (const item of group.items) {
      if (group.type === "tfng") {
        questions[item.id] = { type: "tfng", text: item.text, options: [] };
        answers[item.id] = item.answer;
      } else if (group.type === "matchingParagraph") {
        questions[item.id] = { type: "mcq", text: `${item.text} (Which paragraph?)`, options: ["1", "2", "3"] };
        answers[item.id] = item.answer;
      } else if (group.type === "multipleChoice") {
        questions[item.id] = { type: "mcq", text: item.text, options: item.options };
        answers[item.id] = letterToFullOption(item.answer, item.options);
      } else {
        questions[item.id] = { type: "gap", text: item.text, options: [] };
        answers[item.id] = item.answer;
      }
    }
  }

  return { text: part.paragraphs.join("\n\n"), questions, answers };
}

function flattenListeningSection(section) {
  const questions = {};
  const answers = {};

  for (const q of section.questions) {
    const correctAnswer = LISTENING_ANSWERS[q.id];
    if (q.type === "mcq") {
      questions[q.id] = { type: "mcq", text: q.prompt, options: q.options };
      answers[q.id] = letterToFullOption(correctAnswer, q.options);
    } else if (q.type === "map") {
      questions[q.id] = { type: "mcq", text: q.prompt, options: q.options };
      answers[q.id] = correctAnswer;
    } else {
      const text = q.blankLabel ? `${q.prompt} ${q.blankLabel}` : q.prompt;
      questions[q.id] = { type: "gap", text, options: [] };
      answers[q.id] = correctAnswer;
    }
  }

  return { text: section.transcript, questions, answers };
}

await prisma.test.deleteMany({});

const TESTS = [];

READING_PARTS.forEach((part, i) => {
  TESTS.push({
    slug: `reading-passage-${i + 1}`,
    skill: "READING",
    title: part.passageTitle,
    content: flattenReadingPart(part),
  });
});

LISTENING_SECTIONS.forEach((section, i) => {
  TESTS.push({
    slug: `listening-section-${i + 1}`,
    skill: "LISTENING",
    title: section.title,
    content: flattenListeningSection(section),
  });
});

TESTS.push({
  slug: "task-1",
  skill: "WRITING",
  title: TASK1.title,
  content: { prompt: TASK1.prompt, minWords: TASK1.minWords },
});
TESTS.push({
  slug: "task-2",
  skill: "WRITING",
  title: TASK2.title,
  content: { prompt: TASK2.prompt, minWords: TASK2.minWords },
});

for (const test of TESTS) {
  await prisma.test.create({ data: test });
  console.log(`Seeded test: ${test.slug}`);
}

await prisma.$disconnect();
