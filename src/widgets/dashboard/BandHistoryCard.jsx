import { Card } from "@/src/shared";

export function BandHistoryCard({ overallBand, targetBand, hasResults }) {
  const bandsToClose = Math.max(0, Math.round((targetBand - overallBand) * 2) / 2);

  return (
    <Card>
      <p className="text-xs font-bold uppercase tracking-wide text-accent">Band History</p>
      <p className="mt-2 text-4xl font-extrabold text-navy">{hasResults ? overallBand.toFixed(1) : "0.0"}</p>
      <p className="mt-1 text-sm text-slate-500">
        Goal Band {targetBand.toFixed(1)} · {bandsToClose} bands to close
      </p>

      {!hasResults && (
        <p className="mt-5 rounded-lg bg-indigo-50 px-4 py-3 text-sm text-accent">
          Complete a full mock to see your band history.
        </p>
      )}

      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-slate-50 px-3 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Latest</p>
          <p className="mt-1 text-sm font-bold text-navy">{hasResults ? overallBand.toFixed(1) : "—"}</p>
        </div>
        <div className="rounded-lg bg-slate-50 px-3 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Best</p>
          <p className="mt-1 text-sm font-bold text-navy">{hasResults ? overallBand.toFixed(1) : "—"}</p>
        </div>
        <div className="rounded-lg bg-slate-50 px-3 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Target</p>
          <p className="mt-1 text-sm font-bold text-navy">{targetBand.toFixed(1)}</p>
        </div>
      </div>
    </Card>
  );
}
