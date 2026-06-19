"use client";

import { useEffect, useState } from "react";
import { getAllResults } from "@/src/features";
import { averageBand } from "@/src/entities";
import { BandHistoryCard } from "./BandHistoryCard";
import { SkillRadarCard } from "./SkillRadarCard";
import { TodayRoute } from "./TodayRoute";
import { RightRail } from "./RightRail";

const TARGET_BAND = 7;

export function Dashboard() {
  const [results, setResults] = useState({});

  useEffect(() => {
    setResults(getAllResults());
  }, []);

  const hasResults = Object.keys(results).length > 0;
  const overallBand = averageBand(Object.values(results).map((r) => r.band));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-wide text-accent">Today Route</p>
      <h1 className="mt-1 text-2xl font-extrabold text-navy sm:text-3xl">ibrokhim, here is today&apos;s route.</h1>
      <p className="mt-1 text-sm text-slate-500">
        Target Band {TARGET_BAND.toFixed(1)} · IELTS date Not set
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <BandHistoryCard overallBand={overallBand} targetBand={TARGET_BAND} hasResults={hasResults} />
            <SkillRadarCard results={results} />
          </div>
          <TodayRoute />
        </div>

        <RightRail />
      </div>
    </div>
  );
}
