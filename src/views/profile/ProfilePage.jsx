"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, logout, updateProfile, uploadTeacherPhoto } from "@/src/features";
import { applyTheme, Button, Card, getStoredTheme } from "@/src/shared";

const BAND_OPTIONS = Array.from({ length: 11 }, (_, i) => (4 + i * 0.5).toFixed(1));
const FOCUS_SKILLS = ["Reading", "Listening", "Writing", "Speaking"];

function splitName(fullName) {
  const [firstName, ...rest] = (fullName ?? "").trim().split(/\s+/);
  return { firstName: firstName ?? "", lastName: rest.join(" ") };
}

function toDateInputValue(date) {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

function toBandValue(band) {
  return band != null ? Number(band).toFixed(1) : "";
}

function initials(name) {
  return (name ?? "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState("light");
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoError, setPhotoError] = useState(null);

  useEffect(() => {
    setTheme(getStoredTheme());
  }, []);

  const handleThemeChange = (next) => {
    setTheme(next);
    applyTheme(next);
  };

  useEffect(() => {
    getCurrentUser().then((u) => {
      setUser(u);
      if (u) {
        setForm({
          ...splitName(u.name),
          targetBand: toBandValue(u.targetBand),
          examDate: toDateInputValue(u.examDate),
          currentBand: toBandValue(u.currentBand),
          weeklyHours: u.weeklyHours ?? "",
          focusSkill: u.focusSkill ?? "",
        });
      }
    });
  }, []);

  if (!user || !form) return null;

  const update = (key, value) => {
    setSaved(false);
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  const isTeacher = user.role === "TEACHER";

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setPhotoUploading(true);
    setPhotoError(null);
    try {
      const updated = await uploadTeacherPhoto(file);
      setUser(updated);
    } catch (err) {
      setPhotoError(err.message);
    } finally {
      setPhotoUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const name = [form.firstName, form.lastName].filter(Boolean).join(" ");
      const payload = { name };
      if (!isTeacher) {
        payload.targetBand  = form.targetBand;
        payload.examDate    = form.examDate;
        payload.currentBand = form.currentBand;
        payload.weeklyHours = form.weeklyHours;
        payload.focusSkill  = form.focusSkill;
      }
      const updated = await updateProfile(payload);
      setUser(updated);
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-accent focus:outline-none";

  return (
    <main className="fade-page max-w-3xl px-4 py-10 sm:px-6 lg:px-10">
      <div className="slide-up">
        <h1 className="text-2xl font-bold text-navy">Profile</h1>
        <p className="mt-1 text-sm text-slate-500">
          {isTeacher ? "Manage your account details." : "Keep your goal and details up to date."}
        </p>
      </div>

      <Card className="mt-6 slide-up-1">
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">First name</label>
              <input type="text" required value={form.firstName}
                onChange={(e) => update("firstName", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Last name</label>
              <input type="text" value={form.lastName}
                onChange={(e) => update("lastName", e.target.value)} className={inputCls} />
            </div>
          </div>

          {/* Role badge + photo — teacher only */}
          {isTeacher && (
            <>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Role</label>
                <div className="mt-1 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
                  <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  <span className="text-sm font-semibold text-slate-700">Teacher</span>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Photo</label>
                <div className="mt-1 flex items-center gap-4">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="h-16 w-16 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-accent">
                      {initials(user.name)}
                    </div>
                  )}
                  <label className="cursor-pointer rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                    {photoUploading ? "Uploading..." : user.avatarUrl ? "Change photo" : "Upload photo"}
                    <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden"
                      onChange={handlePhotoChange} disabled={photoUploading} />
                  </label>
                </div>
                {photoError && <p className="mt-1.5 text-sm text-danger">{photoError}</p>}
              </div>
            </>
          )}

          {/* Student-only fields */}
          {!isTeacher && (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Target band</label>
                  <select value={form.targetBand} onChange={(e) => update("targetBand", e.target.value)} className={inputCls}>
                    <option value="">Not set</option>
                    {BAND_OPTIONS.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Current estimated band</label>
                  <select value={form.currentBand} onChange={(e) => update("currentBand", e.target.value)} className={inputCls}>
                    <option value="">Not sure</option>
                    {BAND_OPTIONS.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">IELTS exam date</label>
                  <input type="date" value={form.examDate}
                    onChange={(e) => update("examDate", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Study hours / week</label>
                  <input type="number" min={1} max={60} value={form.weeklyHours}
                    onChange={(e) => update("weeklyHours", e.target.value)} className={inputCls} />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Skill to focus on most</label>
                <select value={form.focusSkill} onChange={(e) => update("focusSkill", e.target.value)} className={inputCls}>
                  <option value="">Not set</option>
                  {FOCUS_SKILLS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </>
          )}

          {error && <p className="text-sm text-danger">{error}</p>}

          <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-5">
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </Button>
            {saved && <span className="text-sm font-medium text-success">Saved.</span>}
            <Button type="button" variant="outline" className="ml-auto" onClick={handleLogout}>
              Log out
            </Button>
          </div>
        </form>
      </Card>

      <Card className="mt-6 slide-up-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Appearance</p>
        <p className="mt-1 text-sm text-slate-500">Choose how PrepZone looks on this device.</p>
        <div className="mt-3 flex gap-2">
          <button type="button" onClick={() => handleThemeChange("light")}
            className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-all active:scale-[0.97] ${
              theme === "light" ? "border-accent bg-indigo-50 text-accent" : "border-slate-200 text-slate-600"
            }`}>
            ☀️ Light
          </button>
          <button type="button" onClick={() => handleThemeChange("dark")}
            className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-all active:scale-[0.97] ${
              theme === "dark" ? "border-accent bg-indigo-50 text-accent" : "border-slate-200 text-slate-600"
            }`}>
            🌙 Dark
          </button>
        </div>
      </Card>
    </main>
  );
}
