"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button, ICON_PATHS, NAV_LINKS } from "@/src/shared";

function NavIcon({ name }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d={ICON_PATHS[name]} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function NavList({ onNavigate }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-1 px-3">
      {NAV_LINKS.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              active ? "bg-indigo-50 text-accent" : "text-slate-500 hover:bg-slate-50 hover:text-navy"
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

const FULLSCREEN_EXAM_PATTERN = /^\/reading\/.+/;

export function AppSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (FULLSCREEN_EXAM_PATTERN.test(pathname)) return null;

  return (
    <>
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <Link href="/" className="text-lg font-extrabold text-navy">
          IELT<span className="text-accent">Station</span>
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
            <NavList onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:sticky lg:top-0 lg:flex lg:h-screen">
        <Link href="/" className="px-6 py-6 text-xl font-extrabold text-navy">
          IELT<span className="text-accent">Station</span>
          <p className="mt-0.5 text-[11px] font-semibold tracking-wide text-slate-400">FULL IELTS PREP</p>
        </Link>

        <NavList />

        <div className="mt-auto flex flex-col gap-3 border-t border-slate-200 p-4">
          <Link
            href="/profile"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-navy"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 20a8 8 0 0 1 16 0" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Profile
          </Link>
          <Button variant="primary" className="w-full">
            Get Premium
          </Button>
        </div>
      </aside>
    </>
  );
}
