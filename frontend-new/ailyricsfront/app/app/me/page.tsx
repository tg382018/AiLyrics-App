import Link from "next/link";

import { AppShell } from "../_components/app-shell";
import { promptHistory, topSongs, userSongs } from "../_data/mock-data";

export default function MePage() {
  const songCount = userSongs.length;
  const totalLikes = userSongs.reduce((acc, song) => acc + song.likes, 0);

  return (
    <AppShell>
      <section className="flex flex-col gap-6 text-white">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="text-xs uppercase tracking-[0.35em] text-white/50">
              Dashboard
            </span>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Welcome back, NovaMuse
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-center">
              <p className="text-xs uppercase tracking-[0.18em] text-white/50">
                Songs
              </p>
              <p className="text-xl font-semibold">{songCount}</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-center">
              <p className="text-xs uppercase tracking-[0.18em] text-white/50">
                Likes
              </p>
              <p className="text-xl font-semibold">
                {totalLikes.toLocaleString()}
              </p>
            </div>
            <Link
              href="/app/generate"
              className="rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(168,85,247,0.35)] transition hover:shadow-[0_18px_45px_rgba(168,85,247,0.45)]"
            >
              Generate New Lyrics
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Your Songs</h2>
              <Link
                href="/app"
                className="text-sm text-purple-200 transition hover:text-purple-100"
              >
                See community picks →
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {userSongs.map((song) => (
                <Link
                  key={song.id}
                  href={`/app/songs/${song.id}`}
                  className="group flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_12px_35px_rgba(15,23,42,0.5)] transition hover:border-white/25 hover:shadow-sky-500/15"
                >
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-white/50">
                    <span>{song.genre}</span>
                    <span>{song.mood}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {song.title}
                  </h3>
                  <p className="text-sm text-white/65">{song.snippet}</p>
                  <div className="mt-auto flex items-center justify-between text-sm text-white/60">
                    <span className="inline-flex items-center gap-2">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-fuchsia-500/20 text-fuchsia-300">
                        ♥
                      </span>
                      {song.likes.toLocaleString()}
                    </span>
                    <span className="text-xs uppercase tracking-[0.2em]">
                      View lyrics →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_12px_35px_rgba(15,23,42,0.5)]">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Prompt History</h2>
              <span className="text-xs uppercase tracking-[0.2em] text-white/40">
                Last 7 days
              </span>
            </div>
            <ul className="space-y-5">
              {promptHistory.map((prompt) => (
                <li
                  key={prompt.id}
                  className="rounded-2xl border border-white/10 bg-[#1B0830] px-4 py-4 transition hover:border-white/25"
                >
                  <div className="flex items-center justify-between text-xs text-white/50">
                    <span>{prompt.createdAt}</span>
                    <span
                      className={
                        "rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] " +
                        (prompt.status === "generated"
                          ? "bg-emerald-500/20 text-emerald-200"
                          : "bg-white/10 text-white/60")
                      }
                    >
                      {prompt.status}
                    </span>
                  </div>
                  <h3 className="mt-2 text-sm font-semibold text-white">
                    {prompt.title}
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-purple-200/80">
                    {prompt.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-purple-500/10 px-3 py-1"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">Songs you&apos;re watching</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {topSongs.slice(0, 4).map((song) => (
              <Link
                key={song.id}
                href={`/app/songs/${song.id}`}
                className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white/70 transition hover:border-white/25"
              >
                <div className="flex flex-col">
                  <span className="text-white">{song.title}</span>
                  <span className="text-xs text-white/50">{song.genre}</span>
                </div>
                <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/50">
                  Detail
                  <span aria-hidden>→</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      </section>
    </AppShell>
  );
}

