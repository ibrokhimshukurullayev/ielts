import { Card } from "@/src/shared";

export function RightRail() {
  return (
    <div className="space-y-6">
      <Card className="flex items-center gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-2xl">🔥</span>
        <div>
          <p className="text-2xl font-extrabold text-navy">0</p>
          <p className="text-sm text-slate-500">Day streak</p>
        </div>
      </Card>

      <Card className="flex items-center gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-2xl">💠</span>
        <div>
          <p className="text-2xl font-extrabold text-navy">0</p>
          <p className="text-sm text-slate-500">Route XP</p>
        </div>
      </Card>

      <Card>
        <p className="text-xs font-bold uppercase tracking-wide text-accent">Exam Countdown</p>
        <p className="mt-2 text-lg font-bold text-navy">No date set</p>
        <p className="mt-2 text-sm text-slate-500">
          Add your IELTS exam date — the countdown unlocks once a date is set.
        </p>
      </Card>
    </div>
  );
}
