"use client";

import { QUESTION_TYPES, QUESTION_TYPE_LABELS } from "@/src/entities/question";

const HAS_OPTIONS = (type) => type === QUESTION_TYPES.MCQ || type === QUESTION_TYPES.MATCHING_HEADINGS;

export function QuestionRow({ index, row, onChange, onRemove }) {
  const update = (patch) => onChange({ ...row, ...patch });

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-indigo-100 text-sm font-bold text-accent">
          {index + 1}
        </span>
        <select
          value={row.type}
          onChange={(e) => update({ type: e.target.value })}
          className="flex-1 rounded-md border border-slate-300 px-3 py-1.5 text-sm"
        >
          {Object.entries(QUESTION_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={onRemove}
          className="rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-semibold text-danger hover:bg-red-50"
        >
          Remove
        </button>
      </div>

      <div className="mt-3 flex flex-col gap-2">
        <label className="text-xs font-semibold text-slate-600">
          Question text
          <textarea
            rows={2}
            value={row.text}
            onChange={(e) => update({ text: e.target.value })}
            placeholder={row.type === QUESTION_TYPES.GAP ? "Use ___ to mark the blank" : "Question text"}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
          />
        </label>

        {HAS_OPTIONS(row.type) && (
          <label className="text-xs font-semibold text-slate-600">
            Options (comma separated)
            <input
              value={row.options}
              onChange={(e) => update({ options: e.target.value })}
              placeholder="A. China, B. India, C. Japan"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
            />
          </label>
        )}

        <div className="grid grid-cols-2 gap-2">
          <label className="text-xs font-semibold text-slate-600">
            Correct answer
            <input
              value={row.answer}
              onChange={(e) => update({ answer: e.target.value })}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
            />
          </label>
          <label className="text-xs font-semibold text-slate-600">
            Explanation (optional)
            <input
              value={row.explanation}
              onChange={(e) => update({ explanation: e.target.value })}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
