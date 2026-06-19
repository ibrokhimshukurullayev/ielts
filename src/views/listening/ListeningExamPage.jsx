"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LISTENING_SECTIONS, scoreListeningAnswers, saveResult } from "@/src/features";
import { rawScoreToBand } from "@/src/entities";
import { Button, Container, TimerBadge, useCountdown } from "@/src/shared";

const FAKE_DURATION = 180;
const TRANSCRIPT_REVEAL_AT = 30;

export function ListeningExamPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const intervalRef = useRef(null);

  const { formatted, secondsLeft, reset } = useCountdown("ielts_listening_timer", 30 * 60, {
    onExpire: () => handleSubmit(),
  });

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((t) => {
          if (t >= FAKE_DURATION) {
            setIsPlaying(false);
            return FAKE_DURATION;
          }
          return t + 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying((p) => !p);

  const switchSection = (index) => {
    setActiveSection(index);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const setAnswer = (id, value) => setAnswers((prev) => ({ ...prev, [id]: value }));

  const handleSubmit = useCallback(() => {
    const { correctCount, total, results } = scoreListeningAnswers(answers);
    const band = rawScoreToBand(correctCount);
    saveResult("listening", { band, correctCount, total, results });
    window.sessionStorage.setItem(
      "ielts_last_attempt",
      JSON.stringify({ section: "listening", band, correctCount, total, results })
    );
    reset();
    router.push("/results");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, reset, router]);

  const section = LISTENING_SECTIONS[activeSection];
  const transcriptRevealed = currentTime >= TRANSCRIPT_REVEAL_AT;
  const totalAnswered = Object.values(answers).filter(Boolean).length;
  const totalQuestions = LISTENING_SECTIONS.reduce((sum, s) => sum + s.questions.length, 0);

  return (
    <main className="fade-page">
      <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 py-3 backdrop-blur">
        <Container className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/listening")}
              className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back
            </button>
            <h1 className="text-lg font-bold text-navy">Listening Test</h1>
          </div>
          <TimerBadge formatted={formatted} secondsLeft={secondsLeft} />
        </Container>
      </div>

      <Container className="py-8">
        <div className="flex gap-2 overflow-x-auto">
          {LISTENING_SECTIONS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => switchSection(i)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                activeSection === i ? "bg-navy text-white" : "bg-slate-100 text-slate-500"
              }`}
            >
              Section {s.id}
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-navy">{section.title}</h2>
          <p className="mt-1 text-sm text-slate-500">{section.description}</p>

          <div className="mt-4 flex items-center gap-4 rounded-xl bg-slate-50 p-4">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white"
            >
              {isPlaying ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            <input
              type="range"
              min={0}
              max={FAKE_DURATION}
              value={currentTime}
              onChange={(e) => setCurrentTime(Number(e.target.value))}
              className="flex-1 accent-accent"
              aria-label="Seek"
            />
            <span className="w-16 text-right text-xs font-mono text-slate-500">
              {Math.floor(currentTime / 60)}:{String(currentTime % 60).padStart(2, "0")}
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
              <path d="M11 5L6 9H2v6h4l5 4V5Z" />
            </svg>
            <input
              type="range"
              min={0}
              max={100}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-20 accent-accent"
              aria-label="Volume"
            />
          </div>

          {transcriptRevealed ? (
            <div className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-slate-700">
              <p className="mb-2 font-semibold text-amber-700">Transcript</p>
              <pre className="whitespace-pre-wrap font-sans">{section.transcript}</pre>
            </div>
          ) : (
            <p className="mt-4 text-xs text-slate-400">
              Transcript will appear after 30 seconds of playback (for practice purposes).
            </p>
          )}
        </div>

        <div className="mt-6 space-y-4">
          {section.questions.map((q) => (
            <div key={q.id} id={`q-${q.id}`} className="rounded-xl bg-white p-4 shadow-sm">
              <p className="text-sm font-medium text-slate-700">
                {q.id}. {q.prompt}
              </p>
              {q.blankLabel && <p className="mt-1 text-xs text-slate-400">{q.blankLabel}</p>}
              {q.type === "mcq" || q.type === "map" ? (
                <div className="mt-2 space-y-1.5">
                  {q.options.map((opt) => {
                    const value = q.type === "mcq" ? opt[0] : opt;
                    return (
                      <label key={opt} className="flex items-center gap-1.5 text-sm">
                        <input
                          type="radio"
                          name={`q-${q.id}`}
                          value={value}
                          checked={answers[q.id] === value}
                          onChange={() => setAnswer(q.id, value)}
                        />
                        {opt}
                      </label>
                    );
                  })}
                </div>
              ) : (
                <input
                  type="text"
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
                  value={answers[q.id] ?? ""}
                  onChange={(e) => setAnswer(q.id, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      </Container>

      <div className="sticky bottom-0 border-t border-slate-200 bg-white py-4">
        <Container className="flex items-center justify-between gap-4">
          <span className="text-sm text-slate-500">
            {totalAnswered}/{totalQuestions} answered
          </span>
          <Button variant="primary" onClick={handleSubmit}>
            Submit Test
          </Button>
        </Container>
      </div>
    </main>
  );
}
