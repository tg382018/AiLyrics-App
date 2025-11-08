import Link from "next/link";

import { AppShell } from "../_components/app-shell";

const genres = [
  "Pop",
  "Rock",
  "Hip-Hop",
  "Synthwave",
  "Lo-fi",
  "Ballad",
];

const moods = ["Happy", "Sad", "Energetic", "Melancholic", "Romantic"];

const structures = [
  "Verse-Chorus-Verse-Chorus",
  "Verse-Chorus-Bridge",
  "ABABCB",
  "Freeform",
];

export default function GenerateLyricsPage() {
  return (
    <AppShell>
      <section className="flex flex-col gap-4 text-center">
        <div className="mx-auto flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-white/70">
          Create
        </div>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
          Create Your Lyrics
        </h1>
        <p className="mx-auto max-w-3xl text-sm text-white/70 md:text-base">
          Tell us about your song, and we&apos;ll handle the words. Adjust the
          genre, mood and structure to fit your creative vision, then generate a
          complete draft in seconds.
        </p>
      </section>

      <section className="mt-12">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_25px_60px_rgba(17,12,34,0.55)] backdrop-blur">
          <form className="grid gap-6 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm text-white/70">
              Genre
              <select className="w-full rounded-2xl border border-white/10 bg-[#1D0A32] px-4 py-3 text-white outline-none transition focus:border-purple-400">
                <option value="">Select genre...</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre} className="bg-[#140220]">
                    {genre}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm text-white/70">
              Language
              <input
                type="text"
                placeholder="English, Spanish, Japanese..."
                className="w-full rounded-2xl border border-white/10 bg-[#1D0A32] px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-purple-400"
              />
            </label>

            <label className="md:col-span-2 flex flex-col gap-2 text-sm text-white/70">
              Title
              <input
                type="text"
                placeholder="e.g., Midnight Drive"
                className="w-full rounded-2xl border border-white/10 bg-[#1D0A32] px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-purple-400"
              />
            </label>

            <label className="md:col-span-2 flex flex-col gap-2 text-sm text-white/70">
              Topic
              <textarea
                rows={3}
                placeholder="e.g., A long road trip with a friend"
                className="w-full rounded-2xl border border-white/10 bg-[#1D0A32] px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-purple-400"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-white/70">
              Mood
              <select className="w-full rounded-2xl border border-white/10 bg-[#1D0A32] px-4 py-3 text-white outline-none transition focus:border-purple-400">
                <option value="">Choose mood...</option>
                {moods.map((mood) => (
                  <option key={mood} value={mood} className="bg-[#140220]">
                    {mood}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm text-white/70">
              Era
              <input
                type="text"
                placeholder="80s, 90s, Modern..."
                className="w-full rounded-2xl border border-white/10 bg-[#1D0A32] px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-purple-400"
              />
            </label>

            <label className="md:col-span-2 flex flex-col gap-2 text-sm text-white/70">
              Structure
              <select className="w-full rounded-2xl border border-white/10 bg-[#1D0A32] px-4 py-3 text-white outline-none transition focus:border-purple-400">
                <option value="">Select structure...</option>
                {structures.map((structure) => (
                  <option key={structure} value={structure} className="bg-[#140220]">
                    {structure}
                  </option>
                ))}
              </select>
            </label>

            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center justify-between text-sm text-white/70">
                <span>Creativity Level</span>
                <span className="rounded-full border border-white/15 px-3 py-1 text-xs uppercase tracking-[0.2em]">
                  5
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                defaultValue={5}
                className="h-1 w-full cursor-pointer appearance-none rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-500 accent-purple-400"
              />
              <div className="flex justify-between text-xs uppercase tracking-[0.2em] text-white/40">
                <span>Literal</span>
                <span>Abstract</span>
              </div>
            </div>

            <div className="md:col-span-2 flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#1D0A32]/70 p-4 text-left text-xs text-white/60">
              <p>
                Tip: include references to artists, cinematic scenes or detailed
                emotions to guide the AI toward your desired vibe.
              </p>
              <Link
                href="/app/me"
                className="text-sm font-semibold text-purple-300 transition hover:text-purple-100"
              >
                View my previous prompts →
              </Link>
            </div>

            <div className="md:col-span-2 flex justify-center pt-4">
              <button
                type="button"
                className="w-full rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(168,85,247,0.35)] transition hover:shadow-[0_24px_55px_rgba(168,85,247,0.45)] md:w-auto md:px-10"
              >
                Generate Lyrics
              </button>
            </div>
          </form>
        </div>
      </section>
    </AppShell>
  );
}

