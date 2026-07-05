import { Card } from "@/src/shared";

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const diffMs = new Date(dateStr).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0);
  return Math.round(diffMs / 86400000);
}

export function RightRail({ user }) {
  const days = daysUntil(user?.examDate);

  return (
    <div className="space-y-6">
      <Card>
        <p className="text-xs font-bold uppercase tracking-wide text-accent">Exam Countdown</p>
        {days !== null ? (
          <>
            <p className="mt-2 text-lg font-bold text-navy">{days >= 0 ? `${days} days left` : "Exam date passed"}</p>
            <p className="mt-2 text-sm text-slate-500">{new Date(user.examDate).toLocaleDateString()}</p>
          </>
        ) : (
          <>
            <p className="mt-2 text-lg font-bold text-navy">No date set</p>
            <p className="mt-2 text-sm text-slate-500">
              Add your IELTS exam date in your profile to unlock the countdown.
            </p>
          </>
        )}
      </Card>

      <Card>
        <p className="text-xs font-bold uppercase tracking-wide text-accent">Your Plan</p>
        <div className="mt-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Target band</span>
            <span className="text-sm font-bold text-navy">
              {user?.targetBand != null ? Number(user.targetBand).toFixed(1) : "Not set"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Study hours / week</span>
            <span className="text-sm font-bold text-navy">{user?.weeklyHours ?? "Not set"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Focus skill</span>
            <span className="text-sm font-bold text-navy">{user?.focusSkill ?? "Not set"}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
