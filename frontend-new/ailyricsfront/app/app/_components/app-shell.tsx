"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { useAuth } from "../_contexts/auth-context";

const navLinks = [
  { href: "/app", label: "Home" },
  { href: "/app/generate", label: "Generate" },
  { href: "/app/me", label: "My Lyrics" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, initializing, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#12031F] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#17042B]/75 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-5">
          <Link
            href="/app"
            className="flex items-center"
            aria-label="Ai Lyrics home"
          >
            <Image
              src="/ailyricslogo.png"
              alt="Ai Lyrics logo"
              width={80}
              height={80}
              className="h-14 w-auto"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-white/65 md:flex">
            {navLinks.map(({ href, label }) => {
              const isActive =
                href === "/app"
                  ? pathname === href
                  : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={
                    "transition hover:text-white " +
                    (isActive ? "text-white" : "")
                  }
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {user ? (
            <div className="flex items-center gap-4 text-sm">
              <span className="hidden max-w-[200px] truncate text-white/70 md:inline">
                {user.email}
              </span>
              <button
                type="button"
                onClick={() => {
                  logout();
                  router.push("/app/login");
                }}
                className="rounded-full border border-white/20 px-4 py-2 text-white/80 transition hover:border-white/40 hover:text-white"
              >
                Log Out
              </button>
            </div>
          ) : initializing ? (
            <div className="h-9 w-32 animate-pulse rounded-full bg-white/10" />
          ) : (
            <div className="flex items-center gap-3 text-sm">
              <Link
                href="/app/login"
                className="rounded-full border border-white/20 px-4 py-2 text-white/80 transition hover:border-white/40 hover:text-white"
              >
                Log In
              </Link>
              <Link
                href="/app/signup"
                className="rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-500 px-5 py-2 font-semibold text-white shadow-[0_12px_25px_rgba(168,85,247,0.35)] transition hover:shadow-[0_18px_35px_rgba(168,85,247,0.45)]"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 pb-24 pt-14">
        {children}
      </main>
    </div>
  );
}

