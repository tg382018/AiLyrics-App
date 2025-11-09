import Link from "next/link";

import { API_BASE_URL } from "@/lib/api";

import { AppShell } from "./_components/app-shell";
import { RecentlyGenerated } from "./_components/recently-generated";
import type { ApiSong, PaginatedResponse, PopularSong } from "./_types";

const FAQ_ITEMS = [
  {
    q: "Can I import my existing lyrics?",
    a: "Yes. Paste any draft directly into the generator to ask for rewrites, alternate choruses or translations in seconds.",
  },
  {
    q: "Does AiLyrics support multiple languages?",
    a: "Absolutely. Pick from a growing catalog of languages and eras; the generator respects rhyme and syllable patterns in each.",
  },
  {
    q: "How do collaborators leave feedback?",
    a: "Invite teammates to the app—every lyric has built-in commenting, liking and version history so decisions stay organized.",
  },
  {
    q: "What happens after the free trial?",
    a: "Choose a plan that fits your release schedule. You keep all drafts, prompts and shared comments, even if you switch tiers.",
  },
];

export const revalidate = 0;

async function fetchPopularSongs(): Promise<PopularSong[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/songs/popular`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`songs/popular responded ${res.status}`);
    }
    const data = (await res.json()) as PopularSong[];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to fetch popular songs:", error);
    return [];
  }
}

const EMPTY_PAGINATION = {
  total: 0,
  page: 1,
  limit: 5,
  totalPages: 1,
};

async function fetchLatestSongs(
  page = 1,
  limit = 5,
): Promise<PaginatedResponse<ApiSong>> {
  try {
    const res = await fetch(`${API_BASE_URL}/songs?page=${page}&limit=${limit}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`songs responded ${res.status}`);
    }
    const payload = (await res.json()) as PaginatedResponse<ApiSong>;
    if (!payload || !Array.isArray(payload.data)) {
      return { data: [], pagination: { ...EMPTY_PAGINATION, page, limit } };
    }
    return payload;
  } catch (error) {
    console.error("Failed to fetch latest songs:", error);
    return { data: [], pagination: { ...EMPTY_PAGINATION, page, limit } };
  }
}

export default async function AppHomePage() {
  const [popularSongs, latestSongs] = await Promise.all([
    fetchPopularSongs(),
    fetchLatestSongs(),
  ]);

  return (
    <AppShell>
      <section className="flex flex-col items-center gap-6 text-center md:gap-8">
        <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70 shadow-[0_0_25px_rgba(147,51,234,0.35)] [animation:fade-in-up_0.6s_ease-out_forwards]">
          Unlock Your Inner Songwriter
        </div>
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-white opacity-0 md:text-5xl lg:text-6xl [animation:fade-in-up_0.6s_ease-out_forwards] [animation-delay:0.08s]">
          Co-write lyrics with AI, refine them with your community
        </h1>
        <p className="max-w-2xl text-base text-white/70 opacity-0 md:text-lg [animation:fade-in-up_0.6s_ease-out_forwards] [animation-delay:0.16s]">
          Generate full songs tailored to your vibe, keep every prompt at your fingertips, and collect feedback with likes and comments—all in one glassy workspace.
        </p>
        <div className="flex gap-4 opacity-0 [animation:fade-in-up_0.6s_ease-out_forwards] [animation-delay:0.24s]">
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
              Ranked by likes and fueled by real feedback from the AiLyrics crew.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {popularSongs.map((song, idx) => (
              <Link
                key={song.id}
                href={`/app/songs/${song.id}`}
                className="group flex h-full flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 text-left shadow-[0_12px_32px_rgba(17,12,34,0.45)] transition hover:-translate-y-1 hover:border-white/30 hover:shadow-sky-500/20"
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
                    {song.createdBy?.username ??
                      song.createdBy?.email ??
                      "AI Lyrics creator"}
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
                    {song.likeCount.toLocaleString()}
                  </span>
                </div>
              </Link>
            ))}
            {popularSongs.length === 0 ? (
              <p className="text-sm text-white/50">
                No popular songs yet. Generate your first lyric to get started.
              </p>
            ) : null}
          </div>
        </div>

        <div className="w-full max-w-sm space-y-6 lg:max-w-xs">
          <div className="flex flex-col gap-2">
            <h2 className="text-left text-2xl font-semibold md:text-3xl">
              Recently generated
            </h2>
            <p className="text-left text-sm text-white/60">
              Fresh lyrics crafted in the last few minutes by creators like you.
            </p>
          </div>
          <RecentlyGenerated
            initialPage={1}
            initialData={latestSongs.data}
            initialTotalPages={latestSongs.pagination.totalPages || 1}
          />
        </div>
      </section>

      <section className="mt-16 flex flex-col gap-10 md:mt-20 lg:flex-row">
        <div className="flex-1 space-y-6">
          <div className="relative space-y-6">
            <h2 className="text-center text-3xl font-semibold md:text-4xl">
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {FAQ_ITEMS.map((item, index) => (
                <details
                  key={item.q}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition"
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-3 p-4 text-left text-white/80">
                    <h3 className="text-lg font-semibold">{item.q}</h3>
                    <span className="transition group-open:rotate-180">
                      ▼
                    </span>
                  </summary>
                  <div className="p-4 text-white/70">{item.a}</div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

