"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { API_BASE_URL } from "@/lib/api";

import { AppShell } from "../_components/app-shell";
import { useAuth } from "../_contexts/auth-context";
import type {
  ApiComment,
  ApiSong,
  PaginatedResponse,
  PopularSong,
  PromptHistoryItem,
} from "../_types";

type SongsResponse = PaginatedResponse<ApiSong>;
type CommentsResponse = PaginatedResponse<ApiComment>;

function formatDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export default function MePage() {
  const { user, token } = useAuth();
  const greetingName = useMemo(
    () => user?.username ?? user?.email ?? "Creator",
    [user],
  );

  const [songs, setSongs] = useState<ApiSong[]>([]);
  const [songsMeta, setSongsMeta] = useState<SongsResponse["pagination"]>({
    limit: 0,
    page: 1,
    total: 0,
    totalPages: 0,
  });
  const [prompts, setPrompts] = useState<PromptHistoryItem[]>([]);
  const [popular, setPopular] = useState<PopularSong[]>([]);
  const [userComments, setUserComments] = useState<ApiComment[]>([]);
  const [commentsMeta, setCommentsMeta] =
    useState<CommentsResponse["pagination"]>({
      limit: 0,
      page: 1,
      total: 0,
      totalPages: 0,
    });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] =
    useState<PromptHistoryItem | null>(null);

  useEffect(() => {
    if (!token) return;
    let isMounted = true;
    setLoading(true);
    setError(null);

    const authHeaders = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    Promise.all([
      fetch(`${API_BASE_URL}/songs/my?page=1&limit=8`, {
        headers: authHeaders,
      }).then(async (res) => {
        if (!res.ok) {
          throw new Error("Unable to load your songs.");
        }
        return (await res.json()) as SongsResponse;
      }),
      fetch(`${API_BASE_URL}/prompts/me`, {
        headers: authHeaders,
      }).then(async (res) => {
        if (!res.ok) {
          throw new Error("Unable to load your prompts.");
        }
        return (await res.json()) as PromptHistoryItem[];
      }),
      fetch(`${API_BASE_URL}/songs/popular`).then(async (res) => {
        if (!res.ok) {
          throw new Error("Unable to load popular songs.");
        }
        return (await res.json()) as PopularSong[];
      }),
      fetch(`${API_BASE_URL}/comments/me?page=1&limit=6`, {
        headers: authHeaders,
      }).then(async (res) => {
        if (!res.ok) {
          throw new Error("Unable to load your comments.");
        }
        return (await res.json()) as CommentsResponse;
      }),
    ])
      .then(([mySongs, myPrompts, popularSongs, myComments]) => {
        if (!isMounted) return;
        setSongs(mySongs.data);
        setSongsMeta(mySongs.pagination);
        setPrompts(myPrompts);
        setPopular(popularSongs);
        setUserComments(myComments.data);
        setCommentsMeta(myComments.pagination);
      })
      .catch((err: Error) => {
        if (!isMounted) return;
        setError(err.message);
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  const totalLikes = useMemo(
    () =>
      songs.reduce((acc, song) => acc + (song.likeCount ?? 0), 0).toLocaleString(),
    [songs],
  );

  return (
    <AppShell>
      <section className="flex flex-col gap-6 text-white">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="text-xs uppercase tracking-[0.35em] text-white/50">
              Dashboard
            </span>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Welcome back, {greetingName}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-center">
              <p className="text-xs uppercase tracking-[0.18em] text-white/50">
                Songs
              </p>
              <p className="text-xl font-semibold">
                {songsMeta.total.toLocaleString()}
              </p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-center">
              <p className="text-xs uppercase tracking-[0.18em] text-white/50">
                Likes
              </p>
              <p className="text-xl font-semibold">{totalLikes}</p>
            </div>
            <Link
              href="/app/generate"
              className="rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(168,85,247,0.35)] transition hover:shadow-[0_18px_45px_rgba(168,85,247,0.45)]"
            >
              Generate New Lyrics
            </Link>
          </div>
        </div>

        {error ? (
          <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
            {error}
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Your Songs</h2>
            </div>
            {loading ? (
              <div className="flex min-h-[160px] items-center justify-center text-sm text-white/60">
                Loading your songs…
              </div>
            ) : songs.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-[#1B0830]/80 p-6 text-sm text-white/70">
                You haven’t generated any songs yet. Start by creating one!
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {songs.map((song) => (
                  <Link
                    key={song._id}
                    href={`/app/songs/${song._id}`}
                    className="group flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_12px_35px_rgba(15,23,42,0.5)] transition hover:border-white/25 hover:shadow-sky-500/15"
                  >
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-white/50">
                      <span>{song.genre ?? "Unknown"}</span>
                      <span>{song.mood ?? "—"}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white">
                      {song.title}
                    </h3>
                    <p className="text-sm text-white/65">
                      {song.topic ?? "AI generated lyric"}
                    </p>
                    <div className="mt-auto flex items-center justify-between text-sm text-white/60">
                      <span className="inline-flex items-center gap-2">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-fuchsia-500/20 text-fuchsia-300">
                          ♥
                        </span>
                        {(song.likeCount ?? 0).toLocaleString()}
                      </span>
                      <span className="text-xs uppercase tracking-[0.2em]">
                        View lyrics →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          <section className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_12px_35px_rgba(15,23,42,0.5)]">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Prompt History</h2>
              <span className="text-xs uppercase tracking-[0.2em] text-white/40">
                Latest activity
              </span>
            </div>
            {loading ? (
              <div className="flex min-h-[120px] items-center justify-center text-sm text-white/60">
                Loading prompts…
              </div>
            ) : prompts.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-[#1B0830] px-4 py-4 text-sm text-white/70">
                Prompts you generate will appear here.
              </div>
            ) : (
              <ul className="space-y-5">
                {prompts.map((prompt) => (
                  <li
                    key={prompt._id}
                    onClick={() => setSelectedPrompt(prompt)}
                    className="cursor-pointer rounded-2xl border border-white/10 bg-[#1B0830] px-4 py-4 transition hover:border-white/25 hover:shadow-[0_0_30px_rgba(124,58,237,0.35)]"
                  >
                    <div className="flex items-center justify-between text-xs text-white/50">
                      <span>{formatDate(prompt.createdAt)}</span>
                      <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-emerald-200">
                        Saved
                      </span>
                    </div>
                    <h3 className="mt-2 text-sm font-semibold text-white">
                      {prompt.song?.title ?? "Untitled lyric"}
                    </h3>
                    <p className="mt-3 line-clamp-3 text-xs text-white/60">
                      {prompt.prompt}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">Your recent comments</h2>
          {loading ? (
            <div className="flex min-h-[120px] items-center justify-center text-sm text-white/60">
              Loading comments…
            </div>
          ) : userComments.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white/70">
              You haven’t joined any discussions yet. Leave your thoughts on a lyric!
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {userComments.map((comment) => (
                <Link
                  key={comment._id}
                  href={comment.song?._id ? `/app/songs/${comment.song._id}` : "#"}
                  className="flex flex-col gap-2 rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white/70 transition hover:border-white/25"
                >
                  <div className="flex items-center justify-between text-xs text-white/50">
                    <span>{comment.song?.title ?? "Unknown song"}</span>
                    <span>{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="line-clamp-3 text-white/80">{comment.text}</p>
                </Link>
              ))}
            </div>
          )}
          {userComments.length > 0 && commentsMeta.totalPages > 1 ? (
            <p className="text-xs text-white/40">
              Showing {userComments.length} of {commentsMeta.total} comments
            </p>
          ) : null}
        </section>
      </section>

      {selectedPrompt ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-10">
          <div className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-[#140222] p-8 text-white shadow-[0_40px_80px_rgba(15,23,42,0.65)]">
            <button
              type="button"
              onClick={() => setSelectedPrompt(null)}
              className="absolute right-4 top-4 text-sm text-white/60 transition hover:text-white"
            >
              Close
            </button>
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-[0.3em] text-white/50">
                  Prompt
                </span>
                <h3 className="text-2xl font-semibold">
                  {selectedPrompt.song?.title ?? "Untitled lyric"}
                </h3>
                <p className="text-xs text-white/40">
                  Saved {formatDate(selectedPrompt.createdAt)}
                </p>
              </div>
              <pre className="max-h-[320px] overflow-y-auto whitespace-pre-wrap rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-white/80">
                {selectedPrompt.prompt}
              </pre>
            </div>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}

