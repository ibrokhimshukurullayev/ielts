"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminFetch } from "@/src/shared/lib/adminClient";
import { Button, Card } from "@/src/shared/ui";
import { contentFromRows, emptyRow, rowsFromContent } from "../model/contentBuilder";
import { QuestionRow } from "./QuestionRow";

const SKILLS = [
  { value: "READING", label: "Reading" },
  { value: "LISTENING", label: "Listening" },
];

function initialState(test) {
  if (!test?.id) {
    return {
      skill: test?.skill ?? "READING",
      slug: "",
      title: "",
      text: "",
      audioUrl: "",
      rows: [emptyRow()],
    };
  }
  return {
    skill: test.skill,
    slug: test.slug,
    title: test.title,
    text: test.content?.text ?? "",
    audioUrl: test.content?.audioUrl ?? "",
    rows: rowsFromContent(test.content),
  };
}

export function TestForm({ test }) {
  const router = useRouter();
  const [form, setForm] = useState(() => initialState(test));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }));
  const updateRow = (index, row) =>
    setForm((prev) => ({ ...prev, rows: prev.rows.map((r, i) => (i === index ? row : r)) }));
  const addRow = () => setForm((prev) => ({ ...prev, rows: [...prev.rows, emptyRow()] }));
  const removeRow = (index) =>
    setForm((prev) => ({ ...prev, rows: prev.rows.filter((_, i) => i !== index) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const content = contentFromRows({ text: form.text, audioUrl: form.audioUrl, rows: form.rows });
      const body = { skill: form.skill, slug: form.slug, title: form.title, content };
      if (test?.id) {
        await adminFetch(`/api/admin/tests/${test.id}`, { method: "PATCH", body });
      } else {
        await adminFetch("/api/admin/tests", { method: "POST", body });
      }
      router.push("/admin/tests");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Card className="grid grid-cols-2 gap-3">
        <label className="text-xs font-semibold text-slate-600">
          Skill
          <select
            value={form.skill}
            onChange={(e) => update({ skill: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
          >
            {SKILLS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </label>
        <label className="text-xs font-semibold text-slate-600">
          Slug
          <input
            value={form.slug}
            onChange={(e) => update({ slug: e.target.value })}
            required
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
          />
        </label>
        <label className="col-span-2 text-xs font-semibold text-slate-600">
          Title
          <input
            value={form.title}
            onChange={(e) => update({ title: e.target.value })}
            required
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
          />
        </label>
        {form.skill === "LISTENING" && (
          <label className="col-span-2 text-xs font-semibold text-slate-600">
            Audio URL
            <input
              value={form.audioUrl}
              onChange={(e) => update({ audioUrl: e.target.value })}
              placeholder="https://..."
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
            />
          </label>
        )}
        <label className="col-span-2 text-xs font-semibold text-slate-600">
          {form.skill === "LISTENING" ? "Transcript" : "Passage text"}
          <textarea
            rows={10}
            value={form.text}
            onChange={(e) => update({ text: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
          />
        </label>
      </Card>

      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-navy">Questions</h2>
        <Button type="button" variant="outline" onClick={addRow}>+ Add question</Button>
      </div>

      <div className="flex flex-col gap-3">
        {form.rows.map((row, index) => (
          <QuestionRow
            key={index}
            index={index}
            row={row}
            onChange={(next) => updateRow(index, next)}
            onRemove={() => removeRow(index)}
          />
        ))}
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>{saving ? "Saving..." : test?.id ? "Save changes" : "Create test"}</Button>
      </div>
    </form>
  );
}
