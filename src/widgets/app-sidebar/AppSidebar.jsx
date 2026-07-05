"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/src/features";
import { CHAT_NAV_LINK, ICON_PATHS, NAV_LINKS, TEACHER_NAV_LINKS, WRITING_REVIEW_NAV_LINK } from "@/src/shared";

function NavIcon({ name }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d={ICON_PATHS[name]} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function NavList({ onNavigate, links }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-1 px-3">
      {links.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 active:scale-[0.97] ${
              active
                ? "bg-indigo-50 text-accent shadow-sm"
                : "text-slate-500 hover:bg-slate-50 hover:text-navy hover:translate-x-0.5"
            }`}
          >
            <NavIcon name={link.icon} />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

const HIDDEN_ROUTE_PATTERNS = [/^\/reading\/.+/, /^\/login$/, /^\/register$/];

export function AppSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    getCurrentUser().then(setUser);
  }, [pathname]);

  if (HIDDEN_ROUTE_PATTERNS.some((pattern) => pattern.test(pathname))) return null;

  const links =
    user?.role === "TEACHER"
      ? TEACHER_NAV_LINKS
      : user?.teacherId
        ? [...NAV_LINKS, CHAT_NAV_LINK, WRITING_REVIEW_NAV_LINK]
        : NAV_LINKS;

  return (
    <>
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <Link href="/" className="text-lg font-extrabold text-navy">
          Prep<span className="text-accent">Zone</span>
        </Link>
        <button
          type="button"
          className="flex items-center justify-center rounded-md p-2 text-navy"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setOpen(false)}>
          <div
            className="flex h-full w-64 flex-col bg-white py-4"
            onClick={(e) => e.stopPropagation()}
          >
            <NavList links={links} onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex">
        <Link href="/" className="px-6 py-6 text-xl font-extrabold text-navy">
          Prep<span className="text-accent">Zone</span>
          <p className="mt-0.5 text-[11px] font-semibold tracking-wide text-slate-400">FULL IELTS PREP</p>
        </Link>

        <NavList links={links} />

        <div className="mt-auto flex flex-col gap-1 border-t border-slate-200 p-4">
          <Link
            href="/profile"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-navy"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 20a8 8 0 0 1 16 0" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {user?.name ?? "Profile"}
          </Link>
        </div>
      </aside>
    </>
  );
}
