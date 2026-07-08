"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { clearExamResults, getExamLabel, getExamResults } from "@/src/features";
import { averageBand, rawScoreToBand } from "@/src/entities";
import { Button, Card, ScoreCircle } from "@/src/shared";

const SKILL_LABELS = { reading: "Reading", listening: "Listening", writing: "Writing" };

function combineSkillBand(entries, skill) {
  if (entries.length === 0) return null;
  if (skill === "writing") {
    const bands = entries.map((e) => e.band).filter((b) => typeof b === "number" && !Number.isNaN(b));
    return bands.length > 0 ? averageBand(bands) : null;
  }
  const sumCorrect = entries.reduce((sum, e) => sum + (e.correctCount ?? 0), 0);
  const sumTotal = entries.reduce((sum, e) => sum + (e.total ?? 0), 0);
  const scaledScore = sumTotal > 0 ? Math.round((sumCorrect / sumTotal) * 40) : 0;
  return rawScoreToBand(scaledScore);
}

export function ExamResultsPage() {
  const { examId } = useParams();
  const router = useRouter();
  const [results, setResults] = useState(null);

  useEffect(() => {
    setResults(getExamResults(examId));
  }, [examId]);

  if (!results) return null;

  if (results.length === 0) {
    return (
      <main className="fade-page mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-navy">No exam results found</h1>
        <p className="mt-2 text-slate-500">Start the exam from the Tests page to see your results here.</p>
        <Button className="mt-6" onClick={() => router.push("/tests")}>
          Go to Tests
        </Button>
      </main>
    );
  }

  const bySkill = { reading: [], listening: [], writing: [] };
  for (const entry of results) {
    bySkill[entry.skill]?.push(entry);
  }

  const skillBands = Object.fromEntries(
    Object.entries(bySkill).map(([skill, entries]) => [skill, combineSkillBand(entries, skill)])
  );
  const overallBand = averageBand(Object.values(skillBands).filter((b) => b != null));

  const finish = () => {
    clearExamResults(examId);
    router.push("/");
  };

  return (
    <main className="fade-page mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-center text-2xl font-bold text-navy">{getExamLabel(examId)}</h1>
      <p className="mt-1 text-center text-sm text-slate-500">Full exam complete — here's your combined result.</p>

      <div className="mt-8 flex flex-col items-center">
        <ScoreCircle band={overallBand} />
        <p className="mt-3 text-sm font-medium text-slate-500">Overall band score</p>
      </div>

      <Card className="mt-10">
        <h2 className="text-lg font-bold text-navy">Section breakdown</h2>
        <div className="mt-5 divide-y divide-slate-100">
          {Object.entries(SKILL_LABELS).map(([skill, label]) => {
            const entries = bySkill[skill];
            const sumCorrect = entries.reduce((s, e) => s + (e.correctCount ?? 0), 0);
            const sumTotal = entries.reduce((s, e) => s + (e.total ?? 0), 0);
            return (
              <div key={skill} className="flex items-center justify-between py-3">
                <span className="font-medium text-slate-700">{label}</span>
                <span className="text-sm font-semibold text-slate-500">
                  {sumTotal > 0
                    ? `${sumCorrect} / ${sumTotal} correct`
                    : skill === "writing" && entries.length > 0
                      ? "Submitted — pending teacher review"
                      : "—"}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="mt-8 flex justify-center">
        <Button variant="primary" onClick={finish}>
          Finish
        </Button>
      </div>
    </main>
  );
}
