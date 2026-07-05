"use client";

import { useEffect, useState } from "react";
import { getAllResults, getAttemptHistory, getCurrentUser } from "@/src/features";
import { averageBand } from "@/src/entities";
import { BandHistoryCard } from "./BandHistoryCard";
import { SkillRadarCard } from "./SkillRadarCard";
import { SkillStatsRow } from "./SkillStatsRow";
import { TodayRoute } from "./TodayRoute";
import { RightRail } from "./RightRail";

export function Dashboard() {
  const [results, setResults] = useState({});
  const [history, setHistory] = useState({});
  const [user, setUser] = useState(null);

  useEffect(() => {
    getAllResults().then(setResults);
    getAttemptHistory().then(setHistory);
    getCurrentUser().then(setUser);
  }, []);

  const hasResults = Object.keys(results).length > 0;
  const overallBand = averageBand(Object.values(results).map((r) => r.band));
  const targetBand = Number(user?.targetBand) || 7;
  const examDateLabel = user?.examDate ? new Date(user.examDate).toLocaleDateString() : "Not set";

  return (
    <div className="max-w-6xl px-4 py-8 sm:px-6 lg:px-10">
      <div className="slide-up">
        <p className="text-xs font-bold uppercase tracking-wide text-accent">Today Route</p>
        <h1 className="mt-1 text-2xl font-extrabold text-navy sm:text-3xl">
          {user?.name ?? "there"}, here is today&apos;s route.
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Target Band {targetBand.toFixed(1)} · IELTS date {examDateLabel}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="slide-up-1"><BandHistoryCard overallBand={overallBand} targetBand={targetBand} hasResults={hasResults} /></div>
            <div className="slide-up-2"><SkillRadarCard results={results} history={history} /></div>
          </div>
          <div className="slide-up-3"><SkillStatsRow results={results} /></div>
          <div className="slide-up-4"><TodayRoute /></div>
        </div>

        <div className="slide-up-5"><RightRail user={user} /></div>
      </div>
    </div>
  );
}
