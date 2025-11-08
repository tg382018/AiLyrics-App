"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function AuthShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname.includes("/login");

  return (
    <div className="min-h-screen bg-[#12031F] text-white">
      <header className="flex items-center justify-between px-8 py-6">
        <Link
          href="/app"
          className="flex items-center"
          aria-label="Ai Lyrics home"
        >
          <Image
            src="/ailyricslogo.png"
            alt="Ai Lyrics logo"
            width={60}
            height={60}
            className="h-10 w-auto rounded-full bg-white/5 p-1.5 shadow-[0_0_26px_rgba(147,51,234,0.55)]"
            priority
          />
        </Link>
        <Link
          href={isLogin ? "/app/signup" : "/app/login"}
          className="text-sm text-white/70 transition hover:text-white"
        >
          {isLogin ? "Create account" : "Already have an account? Log in"}
        </Link>
      </header>
      <main className="flex min-h-[calc(100vh-96px)] items-center justify-center px-4 pb-16">
        {children}
      </main>
    </div>
  );
}

