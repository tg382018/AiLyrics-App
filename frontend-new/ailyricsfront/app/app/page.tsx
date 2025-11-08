import Link from "next/link";

import { AppShell } from "./_components/app-shell";
import { latestSongs, topSongs } from "./_data/mock-data";

export default function AppHomePage() {
  return (
    <AppShell>
      <section className="flex flex-col items-center gap-6 text-center md:gap-8">
        <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70 shadow-[0_0_25px_rgba(147,51,234,0.35)]">
          Unlock Your Inner Songwriter
        </div>
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
          Unlock Your Inner Songwriter with AI
        </h1>
        <p className="max-w-2xl text-base text-white/70 md:text-lg">
          Instantly generate original, creative lyrics for any genre. Your next
          hit starts here—choose a mood, share your story, and watch the verses
          come alive.
        </p>
        <div className="flex gap-4">
          <Link
            href="/app/generate"
            className="rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_40px_rgba(168,85,247,0.35)] transition hover:shadow-[0_24px_50px_rgba(168,85,247,0.45)]"
          >
            Generate Lyrics Now
          </Link>
          <Link
            href="/app/me"
            className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/75 transition hover:border-white/40 hover:text-white"
          >
            View My Library
          </Link>
        </div>
      </section>

      <section className="mt-16 flex flex-col gap-10 md:mt-20 lg:flex-row">
        <div className="flex-1 space-y-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-left text-2xl font-semibold md:text-3xl">
              Community Favorites
            </h2>
            <p className="text-left text-sm text-white/60">
              Top 10 lyrics that creators loved this week.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {topSongs.map((song, idx) => (
              <Link
                key={song.id}
                href={`/app/songs/${song.id}`}
                className="group flex h-full flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 text-left shadow-[0_12px_32px_rgba(17,12,34,0.45)] transition hover:border-white/30 hover:shadow-sky-500/20"
              >
                <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-white/45">
                  <span>#{idx + 1}</span>
                  <span className="text-white/60">{song.genre}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-base font-semibold text-white sm:text-lg">
                    {song.title}
                  </h3>
                  <p className="text-xs text-white/65 sm:text-sm">
                    {song.snippet}
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs text-white/55">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em]">
                    {song.mood}
                  </span>
                  <span className="flex items-center gap-2 text-sm">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-fuchsia-500/20 text-fuchsia-300">
                      ♥
                    </span>
                    {song.likes.toLocaleString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="w-full max-w-sm space-y-6 lg:max-w-xs">
          <div className="flex flex-col gap-2">
            <h2 className="text-left text-2xl font-semibold md:text-3xl">
              Recently generated
            </h2>
            <p className="text-left text-sm text-white/60">
              Fresh lyrics hot off the AI presses.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            {latestSongs.map((song) => (
              <Link
                key={song.id}
                href={`/app/songs/${song.id}`}
                className="group flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#1B0830]/80 p-5 text-left shadow-[0_14px_35px_rgba(16,23,42,0.5)] transition hover:border-white/25 hover:shadow-sky-500/25"
              >
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-white/50">
                  <span>{song.genre}</span>
                  <span>{song.createdAt}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-base font-semibold text-white">
                    {song.title}
                  </h3>
                  <p className="text-xs text-white/65 sm:text-sm">
                    {song.snippet}
                  </p>
                </div>
                <div className="mt-auto flex items-center justify-between text-xs text-white/60">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em]">
                    {song.mood}
                  </span>
                  <span className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-white/50">
                    {song.author}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}

