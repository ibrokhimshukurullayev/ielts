import { QUESTION_TYPES, TFNG_OPTIONS, normalizeQuestion } from "../model/question-types";

const BLANK_PATTERN = /_{3,}/;

function normalize(v) {
  return String(v ?? "").trim().toLowerCase();
}

function NumberBadge({ id }) {
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-slate-300 text-sm font-bold text-navy">
      {id}
    </span>
  );
}

export function QuestionField({ id, raw, value, onChange, correctAnswer }) {
  const question = normalizeQuestion(raw);
  const isCorrect = correctAnswer !== undefined && normalize(value) === normalize(correctAnswer) && value !== "";

  if (question.type === QUESTION_TYPES.TFNG) {
    const tfngOptions = question.options?.length ? question.options : TFNG_OPTIONS;
    return (
      <div>
        <div className="flex items-start gap-3">
          <NumberBadge id={id} />
          <p className="whitespace-pre-line text-sm font-medium text-slate-700">{question.text}</p>
        </div>
        <div className="mt-3 ml-10 flex flex-col gap-2">
          {tfngOptions.map((option) => {
            const selected = value === option;
            const correct = selected && normalize(option) === normalize(correctAnswer);
            return (
              <label key={option}
                className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                  correct ? "bg-emerald-50 text-success font-semibold" : selected ? "bg-indigo-50 text-accent font-semibold" : "text-slate-700 hover:bg-slate-50"
                }`}>
                <input type="radio" name={`q-${id}`} value={option} checked={selected}
                  onChange={() => onChange(option)} className="h-4 w-4 accent-accent" />
                {option}
              </label>
            );
          })}
        </div>
      </div>
    );
  }

  if (question.type === QUESTION_TYPES.MCQ || question.type === QUESTION_TYPES.MATCHING_HEADINGS) {
    return (
      <div>
        <div className="flex items-start gap-3">
          <NumberBadge id={id} />
          <p className="whitespace-pre-line text-sm font-medium text-slate-700">{question.text}</p>
        </div>
        <div className="mt-3 ml-10 flex flex-col gap-2">
          {question.options.map((option) => {
            const selected = value === option;
            const correct = selected && normalize(option) === normalize(correctAnswer);
            return (
              <label key={option}
                className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                  correct ? "bg-emerald-50 text-success font-semibold" : selected ? "bg-indigo-50 text-accent font-semibold" : "text-slate-700 hover:bg-slate-50"
                }`}>
                <input type="radio" name={`q-${id}`} value={option} checked={selected}
                  onChange={() => onChange(option)} className="h-4 w-4 accent-accent" />
                {option}
              </label>
            );
          })}
        </div>
      </div>
    );
  }

  const blankMatch = question.text.match(BLANK_PATTERN);
  if (blankMatch) {
    const blankIndex = blankMatch.index;
    const before = question.text.slice(0, blankIndex);
    const after = question.text.slice(blankIndex + blankMatch[0].length);
    return (
      <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">
        <span className="mr-1">•</span>
        {before}
        <input
          type="text"
          placeholder={id}
          className={`mx-1 inline-block w-28 rounded-sm border px-2 py-0.5 text-center text-sm font-semibold placeholder:font-normal placeholder:text-slate-400 focus:outline-none ${
            isCorrect
              ? "border-success bg-emerald-50 text-success focus:border-success"
              : "border-slate-400 bg-white text-navy focus:border-accent"
          }`}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
        {after}
      </p>
    );
  }

  return (
    <div className="flex items-start gap-3">
      <NumberBadge id={id} />
      <div className="flex-1">
        <p className="whitespace-pre-line text-sm font-medium text-slate-700">{question.text}</p>
        <input
          type="text"
          className={`mt-2 w-full rounded-md border px-3 py-1.5 text-sm focus:outline-none ${
            isCorrect
              ? "border-success bg-emerald-50 text-success focus:border-success"
              : "border-slate-300 focus:border-accent"
          }`}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}
