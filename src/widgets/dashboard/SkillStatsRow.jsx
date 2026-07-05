import Link from "next/link";

const SKILLS = [
  {
    key: "reading",
    label: "Reading",
    href: "/reading",
    color: "bg-indigo-50 text-indigo-600",
    ring: "ring-indigo-200",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
  {
    key: "listening",
    label: "Listening",
    href: "/listening",
    color: "bg-emerald-50 text-emerald-600",
    ring: "ring-emerald-200",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    ),
  },
  {
    key: "writing",
    label: "Writing",
    href: "/writing",
    color: "bg-amber-50 text-amber-600",
    ring: "ring-amber-200",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
      </svg>
    ),
  },
  {
    key: "speaking",
    label: "Speaking",
    href: "/speaking",
    color: "bg-pink-50 text-pink-600",
    ring: "ring-pink-200",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
      </svg>
    ),
  },
];

function bandColor(band) {
  if (!band) return "text-slate-400";
  if (band >= 7) return "text-emerald-600";
  if (band >= 5.5) return "text-amber-600";
  return "text-rose-500";
}

export function SkillStatsRow({ results }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {SKILLS.map((skill) => {
        const r = results?.[skill.key];
        const band = r?.band ?? null;
        return (
          <Link
            key={skill.key}
            href={skill.href}
            className={`group flex items-center gap-3 rounded-xl bg-white px-4 py-3.5 shadow-sm ring-1 ${skill.ring} transition hover:shadow-md hover:-translate-y-0.5`}
          >
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${skill.color}`}>
              {skill.icon}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{skill.label}</p>
              <p className={`text-lg font-extrabold leading-tight ${bandColor(band)}`}>
                {band != null ? band.toFixed(1) : "—"}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
