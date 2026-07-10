"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SPEAKING_PARTS, saveResult } from "@/src/features";
import { Button, Container } from "@/src/shared";

function formatSeconds(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export function SpeakingPage() {
  const router = useRouter();
  const [activePart, setActivePart] = useState(0);
  const [phase, setPhase] = useState("prep");
  const [secondsLeft, setSecondsLeft] = useState(
    SPEAKING_PARTS[0].prepSeconds || SPEAKING_PARTS[0].durationSeconds,
  );
  const [running, setRunning] = useState(false);
  const [selfBand, setSelfBand] = useState(7);
  const intervalRef = useRef(null);

  const part = SPEAKING_PARTS[activePart];

  useEffect(() => {
    const hasPrep = part.prepSeconds > 0;
    setPhase(hasPrep ? "prep" : "speak");
    setSecondsLeft(hasPrep ? part.prepSeconds : part.durationSeconds);
    setRunning(false);
  }, [activePart, part]);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((t) => {
        if (t <= 1) {
          clearInterval(intervalRef.current);
          if (phase === "prep") {
            setPhase("speak");
            return part.durationSeconds;
          }
          setRunning(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running, phase, part.durationSeconds]);

  const finish = async () => {
    await saveResult("speaking", { band: selfBand });
    window.sessionStorage.setItem(
      "ielts_last_attempt",
      JSON.stringify({ section: "speaking", band: selfBand }),
    );
    router.push("/results");
  };

  return (
    <main className="fade-page">
      <Container className="py-8">
        <h1 className="text-lg font-bold text-navy">Speaking Test</h1>

        <div className="mt-6 flex gap-2">
          {SPEAKING_PARTS.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setActivePart(i)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                activePart === i
                  ? "bg-navy text-white"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              Part {p.id}
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-navy">{part.title}</h2>

          {part.cueCard ? (
            <div className="mt-4 rounded-xl border-2 border-dashed border-slate-200 p-5">
              <p className="font-semibold text-navy">{part.cueCard.topic}</p>
              <p className="mt-2 text-sm text-slate-500">You should say:</p>
              <ul className="mt-1 list-disc pl-5 text-sm text-slate-600">
                {part.cueCard.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          ) : (
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              {part.questions.map((q) => (
                <li key={q} className="rounded-xl bg-slate-50 p-3">
                  {q}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6.4 flex items-center gap-4 rounded-xl bg-slate-50 p-4">
            <span className="text-sm font-semibold text-slate-500">
              {phase === "prep" ? "Preparation time" : "Speaking time"}
            </span>
            <span className="font-mono text-2xl font-bold text-navy">
              {formatSeconds(secondsLeft)}
            </span>
            <Button
              variant={running ? "outline" : "primary"}
              onClick={() => setRunning((r) => !r)}
            >
              {running ? "Pause" : "Start"}
            </Button>
          </div>
        </div>

        {activePart === SPEAKING_PARTS.length - 1 && (
          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-navy">
              Finish &amp; self-assess
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Rate how confident you felt about your fluency, vocabulary,
              grammar and pronunciation.
            </p>
            <input
              type="range"
              min={4}
              max={9}
              step={0.5}
              value={selfBand}
              onChange={(e) => setSelfBand(Number(e.target.value))}
              className="mt-4 w-full accent-accent"
            />
            <p className="mt-1 text-sm font-semibold text-navy">
              Estimated band: {selfBand}
            </p>
            <Button variant="success" className="mt-4" onClick={finish}>
              Finish Test
            </Button>
          </div>
        )}
      </Container>
    </main>
  );
}
