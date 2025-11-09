"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

import { API_BASE_URL } from "@/lib/api";

import { AppShell } from "../_components/app-shell";
import { useAuth } from "../_contexts/auth-context";
import type { ApiSong } from "../_types";

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

const languages = [
  "English",
  "Turkish",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Japanese",
  "Korean",
  "Chinese",
  "Hindi",
  "Arabic",
  "Russian",
  "Polish",
  "Dutch",
  "Swedish",
];

const eras = [
  "Modern",
  "2020s",
  "2010s",
  "2000s",
  "1990s",
  "1980s",
  "1970s",
  "1960s",
  "Golden Era Hip-Hop",
  "Classical",
  "Romantic",
  "Baroque",
  "Early Blues",
  "Disco",
  "New Wave",
];

type FormState = {
  genre: string;
  language: string;
  title: string;
  topic: string;
  mood: string;
  era: string;
  verses: string;
  creativity: number;
};

const INITIAL_FORM: FormState = {
  genre: "",
  language: "",
  title: "",
  topic: "",
  mood: "",
  era: "",
  verses: "",
  creativity: 5,
};

export default function GenerateLyricsPage() {
  const { token } = useAuth();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ApiSong | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const disabled = useMemo(() => {
    return loading || !token;
  }, [loading, token]);

  const handleChange = (key: keyof FormState, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) {
      setError("You need to be signed in to generate lyrics.");
      return;
    }
    if (
      !form.genre ||
      !form.language ||
      !form.title ||
      !form.topic ||
      !form.mood ||
      !form.era ||
      !form.verses
    ) {
      setError("Please complete all fields before generating lyrics.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    setResult(null);

    try {
      const res = await fetch(`${API_BASE_URL}/songs/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          data.message ??
            "We couldn’t generate lyrics right now. Please try again later.",
        );
      }

      const song = (await res.json()) as ApiSong;
      setResult(song);
      setForm(INITIAL_FORM);
      setSuccess("Lyrics generated successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate lyrics.");
    } finally {
      setLoading(false);
    }
  };

  const lyricLines = useMemo(() => {
    if (!result?.lyrics) return [];
    return result.lyrics.split(/\n\n+/).map((block) => block.trim());
  }, [result]);

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

      <section className="mt-12 space-y-10">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_25px_60px_rgba(17,12,34,0.55)] backdrop-blur">
          <form className="grid gap-6 md:grid-cols-2" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-2 text-sm text-white/70">
              Genre
              <select
                value={form.genre}
                onChange={(event) => handleChange("genre", event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-[#1D0A32] px-4 py-3 text-white outline-none transition focus:border-purple-400"
                required
              >
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
              <select
                value={form.language}
                onChange={(event) => handleChange("language", event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-[#1D0A32] px-4 py-3 text-white outline-none transition focus:border-purple-400"
                required
              >
                <option value="">Select language...</option>
                {languages.map((language) => (
                  <option key={language} value={language} className="bg-[#140220]">
                    {language}
                  </option>
                ))}
              </select>
            </label>

            <label className="md:col-span-2 flex flex-col gap-2 text-sm text-white/70">
              Title
              <input
                value={form.title}
                onChange={(event) => handleChange("title", event.target.value)}
                type="text"
                placeholder="e.g., Midnight Drive"
                className="w-full rounded-2xl border border-white/10 bg-[#1D0A32] px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-purple-400"
                required
              />
            </label>

            <label className="md:col-span-2 flex flex-col gap-2 text-sm text-white/70">
              Topic
              <textarea
                value={form.topic}
                onChange={(event) => handleChange("topic", event.target.value)}
                rows={3}
                placeholder="e.g., A long road trip with a friend"
                className="w-full rounded-2xl border border-white/10 bg-[#1D0A32] px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-purple-400"
                required
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-white/70">
              Mood
              <select
                value={form.mood}
                onChange={(event) => handleChange("mood", event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-[#1D0A32] px-4 py-3 text-white outline-none transition focus:border-purple-400"
                required
              >
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
              <select
                value={form.era}
                onChange={(event) => handleChange("era", event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-[#1D0A32] px-4 py-3 text-white outline-none transition focus:border-purple-400"
                required
              >
                <option value="">Select era...</option>
                {eras.map((era) => (
                  <option key={era} value={era} className="bg-[#140220]">
                    {era}
                  </option>
                ))}
              </select>
            </label>

            <label className="md:col-span-2 flex flex-col gap-2 text-sm text-white/70">
              Structure
              <select
                value={form.verses}
                onChange={(event) => handleChange("verses", event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-[#1D0A32] px-4 py-3 text-white outline-none transition focus:border-purple-400"
                required
              >
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
                  {form.creativity}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={form.creativity}
                onChange={(event) =>
                  handleChange("creativity", Number(event.target.value))
                }
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

            {error ? (
              <div className="md:col-span-2 rounded-2xl bg-red-500/10 px-4 py-2 text-sm text-red-200">
                {error}
              </div>
            ) : null}
            {success ? (
              <div className="md:col-span-2 rounded-2xl bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">
                {success}
              </div>
            ) : null}

            <div className="md:col-span-2 flex justify-center pt-4">
              <button
                type="submit"
                disabled={disabled || loading}
                className="w-full rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(168,85,247,0.35)] transition hover:shadow-[0_24px_55px_rgba(168,85,247,0.45)] disabled:cursor-not-allowed disabled:opacity-60 md:w-auto md:px-10"
              >
                {loading ? "Generating…" : "Generate Lyrics"}
              </button>
            </div>
          </form>
        </div>

        {result ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-left text-white shadow-[0_25px_60px_rgba(17,12,34,0.55)] backdrop-blur">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                  {result.genre ?? "Song"} · {result.mood ?? "Mood"}
                </p>
                <h2 className="mt-2 text-2xl font-semibold">{result.title}</h2>
              </div>
              <Link
                href={`/app/songs/${result._id}`}
                className="self-start rounded-full border border-white/20 px-5 py-2 text-sm text-white/80 transition hover:border-white/35 hover:text-white"
              >
                View in library →
              </Link>
            </div>
            <div className="mt-6 space-y-6 rounded-3xl border border-white/10 bg-[#18072D]/70 p-6">
              {lyricLines.length > 0 ? (
                lyricLines.map((block, index) => (
                  <p key={index} className="whitespace-pre-wrap text-sm leading-7 text-white/80">
                    {block}
                  </p>
                ))
              ) : (
                <p className="text-sm text-white/70">
                  Lyrics generated successfully. Open the song to view details.
                </p>
              )}
            </div>
          </div>
        ) : null}
      </section>
    </AppShell>
  );
}

