"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { appendExamResult, getExamLabel, getExamLength, getExamStepUrl, saveResult, scoreReadingAnswers } from "@/src/features";
import { rawScoreToBand, QuestionField } from "@/src/entities";
import { Button, ExamModeBadge, useCountdown, normalizeTestContent, useElapsedTimer } from "@/src/shared";

const DURATION_SECONDS = 20 * 60;

function getTextOffset(root, node, offset) {
  let total = 0;
  let found = false;
  function walk(n) {
    if (found) return;
    if (n === node) { total += offset; found = true; return; }
    if (n.nodeType === Node.TEXT_NODE) { total += n.textContent.length; }
    else { for (const child of n.childNodes) walk(child); }
  }
  walk(root);
  return total;
}

function mergeHighlight(ranges, start, end, note) {
  const next = [...ranges, { start, end, note }].sort((a, b) => a.start - b.start);
  const merged = [];
  for (const r of next) {
    const last = merged[merged.length - 1];
    if (last && r.start <= last.end) { last.end = Math.max(last.end, r.end); last.note = r.note ?? last.note; }
    else { merged.push({ ...r }); }
  }
  return merged;
}

function buildSegments(text, ranges) {
  if (ranges.length === 0) return [{ text, highlighted: false }];
  const sorted = [...ranges].sort((a, b) => a.start - b.start);
  const segments = [];
  let cursor = 0;
  for (const r of sorted) {
    if (r.start > cursor) segments.push({ text: text.slice(cursor, r.start), highlighted: false });
    segments.push({ text: text.slice(r.start, r.end), highlighted: true, start: r.start, end: r.end, note: r.note });
    cursor = r.end;
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor), highlighted: false });
  return segments;
}

function SelectionPopup({ top, left, onHighlight, onNote }) {
  return (
    <div className="absolute z-20 -translate-x-1/2 -translate-y-full" style={{ top, left }}>
      <div className="flex items-center overflow-hidden rounded-lg bg-slate-900 text-white shadow-lg">
        <button type="button" onClick={onNote} className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold hover:bg-slate-700">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Note
        </button>
        <span className="h-5 w-px bg-slate-600" />
        <button type="button" onClick={onHighlight} className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold hover:bg-slate-700">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9.5 18.5 4 13l7-7 5.5 5.5z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 21h7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Highlight
        </button>
      </div>
      <div className="mx-auto h-2 w-2 -translate-y-1 rotate-45 bg-slate-900" />
    </div>
  );
}

function NoteEditor({ top, left, onSave, onCancel }) {
  const [text, setText] = useState("");
  return (
    <div className="absolute z-20 w-56 -translate-x-1/2 -translate-y-full" style={{ top, left }}>
      <div className="rounded-lg bg-slate-900 p-2 shadow-lg">
        <textarea autoFocus rows={2} value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a note..."
          className="w-full resize-none rounded-md border border-slate-600 bg-slate-800 p-1.5 text-xs text-white placeholder:text-slate-400" />
        <div className="mt-1.5 flex justify-end gap-1.5">
          <button type="button" onClick={onCancel} className="rounded-md px-2 py-1 text-xs text-slate-300 hover:bg-slate-700">Cancel</button>
          <button type="button" onClick={() => onSave(text)} className="rounded-md bg-amber-400 px-2 py-1 text-xs font-semibold text-slate-900 hover:bg-amber-300">Save</button>
        </div>
      </div>
      <div className="mx-auto h-2 w-2 -translate-y-1 rotate-45 bg-slate-900" />
    </div>
  );
}

function HighlightableParagraph({ text }) {
  const [ranges, setRanges] = useState([]);
  const [pendingSelection, setPendingSelection] = useState(null);
  const [draftNote, setDraftNote] = useState(null);
  const [activeNote, setActiveNote] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    function onDocMouseDown(e) {
      if (containerRef.current?.contains(e.target)) return;
      setPendingSelection(null);
      setActiveNote(null);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  const getSelectionRect = (container) => {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const rangeRect = range.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    return { top: rangeRect.top - containerRect.top - 10, left: rangeRect.left - containerRect.left + rangeRect.width / 2 };
  };

  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || selection.rangeCount === 0) return;
    const container = containerRef.current;
    if (!container) return;
    const range = selection.getRangeAt(0);
    if (!container.contains(range.commonAncestorContainer)) return;
    const start = getTextOffset(container, range.startContainer, range.startOffset);
    const end = getTextOffset(container, range.endContainer, range.endOffset);
    if (start === end) return;
    const { top, left } = getSelectionRect(container);
    setActiveNote(null);
    setDraftNote(null);
    setPendingSelection({ start: Math.min(start, end), end: Math.max(start, end), top, left });
  };

  const applyHighlight = () => {
    if (!pendingSelection) return;
    setRanges((prev) => mergeHighlight(prev, pendingSelection.start, pendingSelection.end, undefined));
    window.getSelection()?.removeAllRanges();
    setPendingSelection(null);
  };

  const openNoteEditor = () => { if (!pendingSelection) return; setDraftNote(pendingSelection); setPendingSelection(null); };
  const saveNote = (noteText) => {
    if (!draftNote) return;
    setRanges((prev) => mergeHighlight(prev, draftNote.start, draftNote.end, noteText.trim() || undefined));
    window.getSelection()?.removeAllRanges();
    setDraftNote(null);
  };
  const removeRange = (start, end) => { setRanges((prev) => prev.filter((r) => !(r.start === start && r.end === end))); setActiveNote(null); };
  const segments = buildSegments(text, ranges);

  return (
    <p ref={containerRef} onMouseUp={handleMouseUp} className="relative mt-4 cursor-text text-sm leading-relaxed text-slate-600">
      {segments.map((seg, i) =>
        seg.highlighted ? (
          <mark key={i}
            className={`cursor-pointer rounded-sm bg-amber-200 ${seg.note ? "border-b-2 border-dashed border-amber-600" : ""}`}
            title={seg.note ? "Click to view note" : "Click to remove highlight"}
            onClick={(e) => {
              if (!seg.note) { removeRange(seg.start, seg.end); return; }
              setActiveNote((cur) => {
                if (cur?.start === seg.start) return null;
                const markRect = e.currentTarget.getBoundingClientRect();
                const containerRect = containerRef.current.getBoundingClientRect();
                return { start: seg.start, end: seg.end, note: seg.note, top: markRect.top - containerRect.top - 8, left: markRect.left - containerRect.left + markRect.width / 2 };
              });
            }}
          >{seg.text}</mark>
        ) : (
          <span key={i}>{seg.text}</span>
        )
      )}
      {pendingSelection && <SelectionPopup top={pendingSelection.top} left={pendingSelection.left} onHighlight={applyHighlight} onNote={openNoteEditor} />}
      {draftNote && <NoteEditor top={draftNote.top} left={draftNote.left} onSave={saveNote} onCancel={() => setDraftNote(null)} />}
      {activeNote && (
        <div className="absolute z-20 w-56 -translate-x-1/2 -translate-y-full rounded-lg bg-slate-900 p-2.5 text-xs text-white shadow-lg" style={{ top: activeNote.top, left: activeNote.left }}>
          <p className="whitespace-pre-line">{activeNote.note}</p>
          <button type="button" onClick={() => removeRange(activeNote.start, activeNote.end)} className="mt-1.5 rounded-md px-2 py-1 text-xs font-semibold text-amber-300 hover:bg-slate-700">Remove highlight</button>
        </div>
      )}
    </p>
  );
}

function parseTemplate(tpl) {
  const parts = [];
  let lastIndex = 0;
  const re = /\[(\d+)\]/g;
  let m;
  while ((m = re.exec(tpl)) !== null) {
    if (m.index > lastIndex) parts.push({ type: "text", content: tpl.slice(lastIndex, m.index) });
    parts.push({ type: "gap", id: m[1] });
    lastIndex = m.index + m[0].length;
  }
  if (lastIndex < tpl.length) parts.push({ type: "text", content: tpl.slice(lastIndex) });
  return parts;
}

function TemplateGapFill({ group, answers, setAnswer }) {
  const parts = parseTemplate(group.template);
  return (
    <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
      {group.groupTitle && (
        <p className="mb-3 text-center text-sm font-bold text-slate-700">{group.groupTitle}</p>
      )}
      <p className="text-sm leading-loose text-slate-700">
        {parts.map((part, i) =>
          part.type === "text" ? (
            <span key={i}>{part.content}</span>
          ) : (
            <input
              key={i}
              id={`q-${part.id}`}
              type="text"
              placeholder={part.id}
              value={answers[part.id] ?? ""}
              onChange={(e) => setAnswer(part.id, e.target.value)}
              className="mx-1 inline-block w-28 rounded-sm border border-slate-400 bg-white px-2 py-0.5 text-center text-sm font-semibold text-navy placeholder:font-normal placeholder:text-slate-400 focus:border-accent focus:outline-none"
            />
          )
        )}
      </p>
    </div>
  );
}

function QuestionGroup({ group, questionEntries, answers, setAnswer, correctAnswers = {} }) {
  const groupQs = questionEntries.filter(([id]) => {
    const n = Number(id);
    return n >= (group.from ?? 1) && n <= (group.to ?? Infinity);
  });

  return (
    <div className="mt-6 first:mt-0">
      {group.instruction && (
        <div className="mb-3 rounded-lg border border-indigo-100 bg-indigo-50 p-3">
          <p className="text-xs font-medium leading-relaxed text-indigo-800">
            <span className="font-bold">Questions {group.from}–{group.to}. </span>
            {group.instruction}
          </p>
        </div>
      )}

      {group.options && (
        <div className="mb-4 rounded-lg border border-slate-200 bg-white p-3">
          <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-slate-400">List of options</p>
          <div className="flex flex-col gap-1">
            {group.options.map((opt) => (
              <span key={opt} className="text-xs text-slate-600">{opt}</span>
            ))}
          </div>
        </div>
      )}

      {group.template ? (
        <TemplateGapFill group={group} answers={answers} setAnswer={setAnswer} />
      ) : group.options ? (
        <div className="space-y-3">
          {groupQs.map(([id, raw]) => (
            <div key={id} id={`q-${id}`}
              className={`rounded-xl border-l-4 bg-white p-4 transition-colors ${answers[id] ? "border-l-success" : "border-l-accent"}`}>
              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-slate-300 text-sm font-bold text-navy">{id}</span>
                <div className="flex flex-1 flex-col gap-2">
                  <p className="text-sm font-medium text-slate-700">{typeof raw === "string" ? raw : raw?.text ?? `Question ${id}`}</p>
                  <select
                    value={answers[id] ?? ""}
                    onChange={(e) => setAnswer(id, e.target.value)}
                    className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-700 focus:border-accent focus:outline-none"
                  >
                    <option value="">Select answer…</option>
                    {group.options.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {groupQs.map(([id, raw]) => (
            <div key={id} id={`q-${id}`}
              className={`rounded-xl border-l-4 bg-white p-4 transition-colors ${answers[id] ? "border-l-success" : "border-l-accent"}`}>
              <QuestionField id={id} raw={raw} value={answers[id] ?? ""} onChange={(value) => setAnswer(id, value)} correctAnswer={correctAnswers[id]} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ReadingExamPage() {
  const router = useRouter();
  const { testId } = useParams();
  const searchParams = useSearchParams();
  const examId = searchParams.get("exam");
  const stepIndex = Number(searchParams.get("step") ?? 0);
  const [content, setContent] = useState(null);
  const [answers, setAnswers] = useState({});
  const [leftWidthPct, setLeftWidthPct] = useState(50);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activePassageIdx, setActivePassageIdx] = useState(0);
  const splitRef = useRef(null);
  const draggingRef = useRef(false);

  useEffect(() => {
    fetch(`/api/tests/${testId}`)
      .then((res) => res.json())
      .then((data) => {
        const test = data.test;
        if (!test) return setContent(null);
        setContent({ title: test.title, dbId: test.id, ...normalizeTestContent(test.content) });
      });
  }, [testId]);

  const elapsed = useElapsedTimer(examId);
  const { formatted, reset, running, start } = useCountdown(`ielts_reading_timer_${testId}`, DURATION_SECONDS, {
    onExpire: () => handleSubmit(),
    autoStart: false,
  });

  const setAnswer = (id, value) => setAnswers((prev) => ({ ...prev, [id]: value }));

  const handleSubmit = useCallback(async () => {
    const { correctCount, total, results } = scoreReadingAnswers(answers, content?.answers ?? {});
    const scaledScore = total > 0 ? Math.round((correctCount / total) * 40) : 0;
    const band = rawScoreToBand(scaledScore);
    const passages = Array.isArray(content?.passages) && content.passages.length > 1
      ? content.passages.map((p, i) => ({ number: p.number ?? i + 1, title: p.title, from: p.from ?? 1, to: p.to ?? Infinity }))
      : null;
    try {
      await saveResult("reading", { band, correctCount, total, results, testId: content?.dbId });
    } catch (err) {
      console.error("Failed to save reading result:", err.message);
    }
    reset();
    if (examId) {
      appendExamResult(examId, { skill: "reading", slug: testId, band, correctCount, total });
      const nextUrl = getExamStepUrl(examId, stepIndex + 1);
      router.push(nextUrl ?? `/exam/${examId}/results`);
      return;
    }
    window.sessionStorage.setItem("ielts_last_attempt", JSON.stringify({ section: "reading", band, correctCount, total, results, passages }));
    router.push("/results");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, content, reset, router, examId, stepIndex, testId]);

  useEffect(() => {
    function onMove(e) {
      if (!draggingRef.current || !splitRef.current) return;
      const rect = splitRef.current.getBoundingClientRect();
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      setLeftWidthPct(Math.min(75, Math.max(25, pct)));
    }
    function onUp() { draggingRef.current = false; }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) { document.documentElement.requestFullscreen?.(); setIsFullscreen(true); }
    else { document.exitFullscreen?.(); setIsFullscreen(false); }
  };

  if (!content) {
    return (
      <main className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <p className="text-sm text-slate-500">Loading test...</p>
      </main>
    );
  }

  const isMultiPassage = Array.isArray(content.passages);
  const passages = isMultiPassage
    ? content.passages
    : [{ number: 1, title: content.title ?? "Reading Passage", text: content.text, from: 1, to: Infinity }];
  const questionGroups = content.questionGroups ?? null;
  const activePassage = passages[activePassageIdx];

  const questionEntries = Object.entries(content.questions ?? {}).sort((a, b) => Number(a[0]) - Number(b[0]));
  const totalQuestions = questionEntries.length;
  const answeredCount = Object.values(answers).filter(Boolean).length;
  const activePassageParagraphs = (activePassage?.text ?? "").split(/\n{2,}/);

  const activeQuestionEntries = isMultiPassage
    ? questionEntries.filter(([id]) => {
        const n = Number(id);
        return n >= (activePassage?.from ?? 1) && n <= (activePassage?.to ?? Infinity);
      })
    : questionEntries;

  const jumpToQuestion = (id) => {
    const n = Number(id);
    const idx = passages.findIndex((p) => n >= (p.from ?? 1) && n <= (p.to ?? Infinity));
    if (idx >= 0) setActivePassageIdx(idx);
    setTimeout(() => document.getElementById(`q-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
  };

  return (
    <main className="fixed inset-0 z-50 flex flex-col bg-white">
      <header className="flex items-center justify-between border-b border-slate-200 px-4 py-2.5">
        <div className="flex items-center gap-3">
          {examId ? (
            <ExamModeBadge label={getExamLabel(examId)} stepIndex={stepIndex} total={getExamLength(examId)} />
          ) : (
            <button type="button" onClick={() => router.push("/reading")}
              className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back
            </button>
          )}
          <span className="rounded-md bg-accent px-3 py-1.5 text-sm font-extrabold text-white">IELTS</span>
        </div>
        <div className="flex items-center gap-3">
          {elapsed && (
            <span className="rounded-md bg-slate-100 px-2.5 py-1 font-mono text-xs text-slate-500" title="Umumiy vaqt">
              ⏱ {elapsed}
            </span>
          )}
          <span className="font-mono text-base font-bold text-navy">{formatted}</span>
          {!running && <Button variant="primary" className="px-4 py-1.5 text-sm" onClick={start}>Start</Button>}
        </div>
        <button type="button" onClick={toggleFullscreen} aria-label="Toggle fullscreen" className="rounded-md p-2 text-slate-400 hover:bg-slate-100">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {isFullscreen
              ? <path d="M9 4v4a1 1 0 0 1-1 1H4M20 9h-4a1 1 0 0 1-1-1V4M15 20v-4a1 1 0 0 1 1-1h4M4 15h4a1 1 0 0 1 1 1v4" strokeLinecap="round" strokeLinejoin="round" />
              : <path d="M4 9V5a1 1 0 0 1 1-1h4M20 9V5a1 1 0 0 0-1-1h-4M4 15v4a1 1 0 0 0 1 1h4M20 15v4a1 1 0 0 1-1 1h-4" strokeLinecap="round" strokeLinejoin="round" />}
          </svg>
        </button>
      </header>

      <div ref={splitRef} className="flex min-h-0 flex-1 overflow-hidden">
        <div className="flex flex-col overflow-hidden" style={{ width: `${leftWidthPct}%` }}>
          {isMultiPassage && (
            <div className="flex shrink-0 gap-1 border-b border-slate-200 bg-slate-50 px-3 py-2">
              {passages.map((p, i) => (
                <button key={i} type="button" onClick={() => setActivePassageIdx(i)}
                  className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${i === activePassageIdx ? "bg-navy text-white" : "text-slate-500 hover:bg-slate-200"}`}>
                  Passage {p.number ?? i + 1}
                </button>
              ))}
            </div>
          )}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <h2 className="text-lg font-bold text-navy">{activePassage?.title ?? "Reading Passage"}</h2>
            {activePassage?.subtitle && (
              <p className="mt-1 text-sm italic text-slate-500">{activePassage.subtitle}</p>
            )}
            <p className="mt-1 text-xs text-slate-400">Select text to highlight or add a note.</p>
            {activePassageParagraphs.map((text, i) => (
              <HighlightableParagraph key={`${activePassageIdx}-${i}`} text={text} />
            ))}
          </div>
        </div>

        <button type="button" aria-label="Resize panes" onMouseDown={() => { draggingRef.current = true; }}
          className="flex w-2 shrink-0 cursor-col-resize items-center justify-center border-x border-slate-200 bg-slate-50 hover:bg-indigo-50">
          <span className="text-slate-400">⋮</span>
        </button>

        <div className="flex flex-1 flex-col overflow-hidden">
          {isMultiPassage && (
            <div className="flex shrink-0 gap-1 border-b border-slate-200 bg-slate-50 px-3 py-2">
              {passages.map((p, i) => (
                <button key={i} type="button" onClick={() => setActivePassageIdx(i)}
                  className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${i === activePassageIdx ? "bg-navy text-white" : "text-slate-500 hover:bg-slate-200"}`}>
                  Passage {p.number ?? i + 1}
                </button>
              ))}
            </div>
          )}
        <div className="flex-1 overflow-y-auto bg-slate-50 px-6 py-6">
          {questionGroups ? (
            questionGroups
              .filter((group) => !isMultiPassage || (
                group.from <= (activePassage?.to ?? Infinity) && group.to >= (activePassage?.from ?? 1)
              ))
              .map((group) => (
                <QuestionGroup key={group.from} group={group} questionEntries={questionEntries} answers={answers} setAnswer={setAnswer} correctAnswers={content.answers ?? {}} />
              ))
          ) : (
            <>
              {activeQuestionEntries.length > 0 && (
                <p className="text-sm text-slate-500">
                  Answer questions {activeQuestionEntries[0]?.[0]}–{activeQuestionEntries[activeQuestionEntries.length - 1]?.[0]}.
                </p>
              )}
              <div className="mt-4 space-y-3">
                {activeQuestionEntries.map(([id, raw]) => (
                  <div key={id} id={`q-${id}`}
                    className={`rounded-xl border-l-4 bg-white p-4 transition-colors ${answers[id] ? "border-l-success" : "border-l-accent"}`}>
                    <QuestionField id={id} raw={raw} value={answers[id] ?? ""} onChange={(value) => setAnswer(id, value)} correctAnswer={(content.answers ?? {})[id]} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        </div>
      </div>

      <div className="border-t border-slate-200 bg-white px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-1.5">
            {questionEntries.map(([id]) => (
              <button key={id} type="button" onClick={() => jumpToQuestion(id)}
                className={`flex h-7 w-7 items-center justify-center rounded-md text-xs font-semibold transition-colors ${answers[id] ? "bg-success text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
                {id}
              </button>
            ))}
          </div>
          <Button variant="primary" onClick={handleSubmit}>Submit Test ({answeredCount}/{totalQuestions})</Button>
        </div>
      </div>
    </main>
  );
}
