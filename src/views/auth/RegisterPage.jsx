"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/src/features";

// ── constants ──────────────────────────────────────────────────────────────
const STEPS = ["account", "band", "date", "skills", "hours"];

const SKILL_CONFIG = [
  {
    key: "Reading",
    label: "Reading",
    desc: "Text analysis",
    color: "bg-indigo-100 text-indigo-600",
    ring: "ring-indigo-400",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M4 19.5A2.5 2.5 0 016.5 17H20M4 4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15Z" />
      </svg>
    ),
  },
  {
    key: "Listening",
    label: "Listening",
    desc: "Listening comprehension",
    color: "bg-emerald-100 text-emerald-600",
    ring: "ring-emerald-400",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M3 14v-2a9 9 0 0118 0v2M21 14a3 3 0 01-3 3h-1a2 2 0 01-2-2v-2a2 2 0 012-2h1a3 3 0 013 3ZM3 14a3 3 0 003 3h1a2 2 0 002-2v-2a2 2 0 00-2-2H6a3 3 0 00-3 3Z" />
      </svg>
    ),
  },
  {
    key: "Writing",
    label: "Writing",
    desc: "Writing skills",
    color: "bg-amber-100 text-amber-600",
    ring: "ring-amber-400",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5Z" />
      </svg>
    ),
  },
  {
    key: "Speaking",
    label: "Speaking",
    desc: "Speaking skills",
    color: "bg-pink-100 text-pink-600",
    ring: "ring-pink-400",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3ZM19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
      </svg>
    ),
  },
];

function bandLabel(b) {
  const n = Number(b);
  if (n >= 8.5) return "Expert";
  if (n >= 7.5) return "Very Good";
  if (n >= 6.5) return "Good";
  if (n >= 5.5) return "Competent";
  return "Modest";
}

function bandAccent(b) {
  const n = Number(b);
  if (n >= 7.5) return "bg-emerald-500";
  if (n >= 6.5) return "bg-accent";
  if (n >= 5.5) return "bg-amber-500";
  return "bg-rose-500";
}

// ── progress bar ──────────────────────────────────────────────────────────
function Progress({ step }) {
  const idx = STEPS.indexOf(step);
  const pct = ((idx + 1) / STEPS.length) * 100;
  return (
    <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100">
      <div
        className="h-full rounded-full bg-accent transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ── card shell ────────────────────────────────────────────────────────────
function Shell({ step, direction, onBack, children }) {
  const idx = STEPS.indexOf(step);
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="slide-up w-full max-w-sm">

        {/* Logo */}
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-white text-sm font-black shadow-sm">P</div>
          <span className="text-xl font-extrabold text-navy">Prep<span className="text-accent">Zone</span></span>
        </Link>

        {/* Card */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-[0_4px_24px_rgba(15,32,68,0.10)]">

          {/* Top bar */}
          <div className="px-6 pt-5 pb-4">
            <div className="mb-3 flex items-center justify-between">
              {onBack ? (
                <button type="button" onClick={onBack}
                  className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 active:scale-95">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
                  </svg>
                  Back
                </button>
              ) : <span />}
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                {idx + 1} / {STEPS.length}
              </span>
            </div>
            <Progress step={step} />
          </div>

          {/* Animated content */}
          <div key={step} className={direction === "back" ? "step-in-back" : "step-in"}>
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}

// ─── Field helper ─────────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-navy placeholder-slate-400 outline-none transition focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/15";

// ── Step 1 — Account ──────────────────────────────────────────────────────
function StepAccount({ form, update, onNext }) {
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState(null);

  const submit = (e) => {
    e.preventDefault();
    setError(null);
    if (!form.name.trim()) { setError("Name is required."); return; }
    if (!form.username.trim()) { setError("Username is required."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    onNext();
  };

  return (
    <form onSubmit={submit} className="px-6 pb-7">
      <div className="mb-5">
        <h2 className="text-xl font-extrabold text-navy">Create Account</h2>
        <p className="mt-0.5 text-sm text-slate-500">Get started in seconds</p>
      </div>

      <div className="space-y-3">
        <Field label="Full name">
          <input type="text" required autoFocus placeholder="Full name"
            value={form.name} onChange={(e) => update("name", e.target.value)}
            className={inputCls} />
        </Field>

        <Field label="Username">
          <input type="text" required placeholder="username"
            value={form.username}
            onChange={(e) => update("username", e.target.value.toLowerCase().replace(/\s/g, ""))}
            className={inputCls} />
        </Field>

        <Field label="Password">
          <div className="relative">
            <input type={showPw ? "text" : "password"} required minLength={6}
              placeholder="At least 6 characters"
              value={form.password} onChange={(e) => update("password", e.target.value)}
              className={`${inputCls} pr-11`} />
            <button type="button" onClick={() => setShowPw((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600">
              {showPw ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </Field>
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-600">
          <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </div>
      )}

      <button type="submit"
        className="mt-5 w-full rounded-xl bg-accent py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-500 active:scale-[0.98]">
        Continue →
      </button>

      <p className="mt-4 text-center text-xs text-slate-400">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-accent hover:underline">Log in</Link>
      </p>
    </form>
  );
}

// ── Step 2 — Target band ──────────────────────────────────────────────────
function StepBand({ form, update, onNext }) {
  const band = Number(form.targetBand);
  const pct = ((band - 4) / (9 - 4)) * 100;

  return (
    <div className="px-6 pb-7">
      <div className="mb-5">
        <h2 className="text-xl font-extrabold text-navy">Target Band</h2>
        <p className="mt-0.5 text-sm text-slate-500">What score are you aiming for in IELTS?</p>
      </div>

      {/* Band display */}
      <div className="mb-6 flex flex-col items-center">
        <div className={`flex h-24 w-24 items-center justify-center rounded-full ${bandAccent(band)} text-white shadow-lg`}>
          <div className="text-center">
            <p className="text-3xl font-black leading-none">{form.targetBand}</p>
          </div>
        </div>
        <p className="mt-2.5 text-sm font-bold text-slate-500">{bandLabel(band)}</p>
      </div>

      {/* Slider */}
      <div className="mb-1 relative">
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div className={`h-full rounded-full ${bandAccent(band)} transition-all duration-150`}
            style={{ width: `${pct}%` }} />
        </div>
        <input type="range" min={4} max={9} step={0.5}
          value={form.targetBand}
          onChange={(e) => update("targetBand", e.target.value)}
          className="absolute inset-0 w-full h-full cursor-pointer opacity-0" />
        <div className="pointer-events-none absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-white shadow-md ring-2 ring-accent/40 transition-all duration-150"
          style={{ left: `calc(${pct}% - 10px)` }} />
      </div>
      <div className="flex justify-between text-xs font-semibold text-slate-400">
        <span>4.0</span><span>6.5</span><span>9.0</span>
      </div>

      <button type="button" onClick={onNext}
        className="mt-6 w-full rounded-xl bg-accent py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-500 active:scale-[0.98]">
        Continue →
      </button>
    </div>
  );
}

// ── Step 3 — Exam date ────────────────────────────────────────────────────
function StepDate({ form, update, onNext }) {
  const today = new Date().toISOString().split("T")[0];
  let daysLeft = null;
  if (form.examDate) {
    const diff = new Date(form.examDate) - new Date();
    daysLeft = Math.ceil(diff / 86400000);
  }

  return (
    <div className="px-6 pb-7">
      <div className="mb-5">
        <h2 className="text-xl font-extrabold text-navy">Exam Date</h2>
        <p className="mt-0.5 text-sm text-slate-500">When are you planning to take the exam?</p>
      </div>

      <input type="date" min={today}
        value={form.examDate}
        onChange={(e) => update("examDate", e.target.value)}
        className={inputCls} />

      {daysLeft !== null && (
        <div className="mt-3 flex items-center gap-3 rounded-xl bg-indigo-50 px-4 py-3">
          <p className="text-2xl font-black text-accent">{daysLeft}</p>
          <p className="text-sm text-slate-500">days left until your exam</p>
        </div>
      )}

      <p className="mt-3 text-center text-xs text-slate-400">Skip if you don&apos;t know the date yet</p>

      <button type="button" onClick={onNext}
        className="mt-5 w-full rounded-xl bg-accent py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-500 active:scale-[0.98]">
        Continue →
      </button>
    </div>
  );
}

// ── Step 4 — Focus skills ─────────────────────────────────────────────────
function StepSkills({ form, update, onNext }) {
  const selected = form.focusSkills;

  const toggle = (key) => {
    const already = selected.includes(key);
    update("focusSkills", already ? selected.filter((k) => k !== key) : [...selected, key]);
  };

  return (
    <div className="px-6 pb-7">
      <div className="mb-5">
        <h2 className="text-xl font-extrabold text-navy">Focus Areas</h2>
        <p className="mt-0.5 text-sm text-slate-500">
          Which skills do you want to focus on? Select <span className="font-semibold text-navy">1–4</span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {SKILL_CONFIG.map((skill) => {
          const active = selected.includes(skill.key);
          return (
            <button key={skill.key} type="button" onClick={() => toggle(skill.key)}
              className={`relative flex flex-col items-start gap-2.5 rounded-xl border p-4 text-left transition-all duration-200 active:scale-[0.97] ${
                active
                  ? `border-accent/30 bg-indigo-50 ring-2 ring-accent/30`
                  : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white"
              }`}>
              {active && (
                <div className="check-bounce absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent">
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${skill.color}`}>
                {skill.icon}
              </div>
              <div>
                <p className="text-sm font-bold text-navy">{skill.label}</p>
                <p className="text-[10px] text-slate-400">{skill.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {selected.length > 0 && (
        <p className="mt-3 text-center text-xs text-accent font-semibold">
          {selected.length} selected · {selected.join(", ")}
        </p>
      )}

      <button type="button" onClick={onNext} disabled={selected.length === 0}
        className="mt-5 w-full rounded-xl bg-accent py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-500 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed">
        Continue →
      </button>
    </div>
  );
}

// ── Step 5 — Weekly hours ─────────────────────────────────────────────────
const HOUR_OPTIONS = [
  { value: "3",  label: "1–3 hrs",   desc: "Light",     emoji: "🌱" },
  { value: "7",  label: "5–7 hrs",   desc: "Steady",    emoji: "🔥" },
  { value: "14", label: "10–14 hrs", desc: "Intensive", emoji: "⚡" },
  { value: "21", label: "20+ hrs",   desc: "Maximum",   emoji: "🚀" },
];

function StepHours({ form, update, onSubmit, sending, error }) {
  return (
    <div className="px-6 pb-7">
      <div className="mb-5">
        <h2 className="text-xl font-extrabold text-navy">How many hours per week?</h2>
        <p className="mt-0.5 text-sm text-slate-500">Time you can dedicate to studying</p>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {HOUR_OPTIONS.map((opt) => {
          const active = form.weeklyHours === opt.value;
          return (
            <button key={opt.value} type="button" onClick={() => update("weeklyHours", opt.value)}
              className={`flex flex-col items-start rounded-xl border p-4 text-left transition-all duration-200 active:scale-[0.97] ${
                active
                  ? "border-accent/30 bg-indigo-50 ring-2 ring-accent/30"
                  : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white"
              }`}>
              <span className="mb-1.5 text-xl">{opt.emoji}</span>
              <p className="text-sm font-bold text-navy">{opt.label}</p>
              <p className="text-[10px] text-slate-400">{opt.desc}</p>
            </button>
          );
        })}
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-600">
          <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </div>
      )}

      <button type="button" onClick={onSubmit} disabled={sending}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-500 active:scale-[0.98] disabled:opacity-60">
        {sending ? (
          <>
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Creating account…
          </>
        ) : "🎉  Get Started"}
      </button>
    </div>
  );
}

// ── Root component ────────────────────────────────────────────────────────
export function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState("account");
  const [direction, setDirection] = useState("forward");
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);

  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
    targetBand: "7.0",
    examDate: "",
    focusSkills: [],
    weeklyHours: "",
  });

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const goTo = (s) => { setDirection("forward"); setStep(s); };
  const goBack = () => {
    setDirection("back");
    const idx = STEPS.indexOf(step);
    if (idx > 0) setStep(STEPS[idx - 1]);
  };

  const submitFinal = async () => {
    setError(null);
    setSending(true);
    try {
      await register({ ...form, focusSkill: form.focusSkills.join(",") });
      router.push("/");
    } catch (err) {
      setError(err.message);
      setSending(false);
    }
  };

  const hasBack = STEPS.indexOf(step) > 0;
  const stepProps = { form, update };

  return (
    <Shell step={step} direction={direction} onBack={hasBack ? goBack : null}>
      {step === "account" && <StepAccount {...stepProps} onNext={() => goTo("band")} />}
      {step === "band"    && <StepBand    {...stepProps} onNext={() => goTo("date")} />}
      {step === "date"    && <StepDate    {...stepProps} onNext={() => goTo("skills")} />}
      {step === "skills"  && <StepSkills  {...stepProps} onNext={() => goTo("hours")} />}
      {step === "hours"   && <StepHours   {...stepProps} onSubmit={submitFinal} sending={sending} error={error} />}
    </Shell>
  );
}
