"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, FormEvent } from "react";

import { API_BASE_URL } from "@/lib/api";

import { AppShell } from "../../_components/app-shell";
import { useAuth } from "../../_contexts/auth-context";
import type { ApiComment, ApiSong, PopularSong } from "../../_types";

function formatDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function splitLyrics(lyrics?: string): string[] {
  if (!lyrics) return [];
  return lyrics.split(/\n\n+/).map((block) => block.trim());
}

function renderAuthorName(song?: ApiSong) {
  if (!song?.createdBy) return "AI Lyrics creator";
  if (typeof song.createdBy === "string") return "AI Lyrics creator";
  return song.createdBy.username ?? song.createdBy.email ?? "AI Lyrics creator";
}

export default function SongDetailClient() {
  const params = useParams<{ songId: string }>();
  const songId = params?.songId;
  const { token } = useAuth();

  const [song, setSong] = useState<ApiSong | null>(null);
  const [comments, setComments] = useState<ApiComment[]>([]);
  const [popularSongs, setPopularSongs] = useState<PopularSong[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [likeStatus, setLikeStatus] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [likeError, setLikeError] = useState<string | null>(null);

  const loadComments = useCallback(async () => {
    if (!songId) return;
    if (!token) {
      setComments([]);
      setCommentsLoading(false);
      return;
    }
    setCommentsLoading(true);
    setCommentError(null);
    try {
      const res = await fetch(
        `${API_BASE_URL}/songs/${songId}/comments?limit=50`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (!res.ok) {
        throw new Error("Unable to load comments.");
      }
      const data = (await res.json()) as { data: ApiComment[] };
      setComments(data.data);
    } catch (err) {
      setCommentError(err instanceof Error ? err.message : "Failed to load comments.");
    } finally {
      setCommentsLoading(false);
    }
  }, [songId, token]);

  const loadLikeState = useCallback(async () => {
    if (!songId || !token) {
      setLikeStatus(false);
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/songs/${songId}/like`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) return;
      const data = (await res.json()) as { liked?: boolean };
      setLikeStatus(Boolean(data.liked));
    } catch (_) {
      // ignore like status errors silently
    }
  }, [songId, token]);

  useEffect(() => {
    if (!songId) return;
    let active = true;
    setLoading(true);
    setError(null);

    const baseHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const loadSong = async () => {
      try {
        const [songRes, popularRes] = await Promise.all([
          fetch(`${API_BASE_URL}/songs/${songId}`, {
            headers: baseHeaders,
          }),
          fetch(`${API_BASE_URL}/songs/popular`, {
            headers: baseHeaders,
          }),
        ]);

        if (!songRes.ok) {
          throw new Error("Unable to load song details.");
        }
        const songData = (await songRes.json()) as ApiSong;

        if (!popularRes.ok) {
          throw new Error("Unable to load related songs.");
        }
        const popularData = (await popularRes.json()) as PopularSong[];

        if (!active) return;
        setSong(songData);
        setPopularSongs(popularData);
      } catch (err) {
        if (!active) return;
        setError(
          err instanceof Error
            ? err.message
            : "We couldn’t load this song right now.",
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadSong();

    return () => {
      active = false;
    };
  }, [songId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  useEffect(() => {
    loadLikeState();
  }, [loadLikeState]);

  const handleToggleLike = async () => {
    if (!token || !songId) {
      setLikeError("You need to sign in to like this lyric.");
      return;
    }
    setLikeLoading(true);
    setLikeError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/songs/${songId}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error("Unable to update like status.");
      }
      const data = (await res.json()) as { liked: boolean };
      setLikeStatus(data.liked);
      setSong((prev) => {
        if (!prev) return prev;
        const delta = data.liked ? 1 : -1;
        const nextCount = Math.max(0, (prev.likeCount ?? 0) + delta);
        return { ...prev, likeCount: nextCount };
      });
    } catch (err) {
      setLikeError(err instanceof Error ? err.message : "Failed to update like status.");
    } finally {
      setLikeLoading(false);
    }
  };

  const handleSubmitComment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token || !songId) {
      setCommentError("You need to sign in to comment on this lyric.");
      return;
    }
    if (!commentText.trim()) {
      setCommentError("Please enter a comment before posting.");
      return;
    }
    setCommentSubmitting(true);
    setCommentError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/songs/${songId}/comments`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: commentText.trim() }),
      });
      if (!res.ok) {
        throw new Error("Unable to post your comment right now.");
      }
      setCommentText("");
      await loadComments();
    } catch (err) {
      setCommentError(err instanceof Error ? err.message : "Failed to post comment.");
    } finally {
      setCommentSubmitting(false);
    }
  };

  const related = useMemo(
    () => popularSongs.filter((item) => item.id !== songId).slice(0, 4),
    [popularSongs, songId],
  );

  const lyricSections = useMemo(() => splitLyrics(song?.lyrics), [song?.lyrics]);

  return (
    <AppShell>
      <section className="flex flex-col gap-8 text-white">
        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-sm text-white/60">
            Loading song details…
          </div>
        ) : error || !song ? (
          <div className="rounded-3xl border border-red-500/40 bg-red-500/10 p-8 text-center text-sm text-red-200">
            {error ??
              "We couldn’t load this song right now. Please try again later."}
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_25px_55px_rgba(12,10,30,0.55)] md:p-10">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                    {song.genre ?? "Song"} · {song.mood ?? "Mood"}
                  </p>
                  <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
                    {song.title}
                  </h1>
                  <p className="mt-2 text-sm text-white/60">
                    {formatDate(song.createdAt)} · Generated by {renderAuthorName(song)}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <button
                    type="button"
                    onClick={handleToggleLike}
                    disabled={likeLoading}
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/35 hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span aria-hidden>{likeStatus ? "❤️" : "🤍"}</span>
                    {likeStatus ? "Unlike" : "Like"}
                  </button>
                  <p className="text-xs text-white/40">
                    {song.likeCount?.toLocaleString() ?? 0} total likes
                  </p>
                  {likeError ? (
                    <p className="text-xs text-red-300">{likeError}</p>
                  ) : null}
                </div>
              </div>

              <div className="space-y-6 rounded-3xl border border-white/10 bg-[#18072D]/70 p-6">
                {lyricSections.length > 0 ? (
                  lyricSections.map((block, index) => (
                    <p key={index} className="whitespace-pre-wrap text-sm leading-7 text-white/80">
                      {block}
                    </p>
                  ))
                ) : (
                  <p className="text-sm text-white/70">
                    This lyric doesn’t have content yet. Generate or edit from your library.
                  </p>
                )}
              </div>

              <div className="grid gap-4 rounded-2xl border border-white/10 bg-[#1B0830] p-6 text-sm text-white/70 md:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <span className="text-xs uppercase tracking-[0.2em] text-white/40">
                    Likes
                  </span>
                  <span className="text-xl font-semibold text-white">
                    {(song.likeCount ?? 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs uppercase tracking-[0.2em] text-white/40">
                    Language
                  </span>
                  <span className="text-xl font-semibold text-white">
                    {song.language ?? "—"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs uppercase tracking-[0.2em] text-white/40">
                    Era
                  </span>
                  <span className="text-xl font-semibold text-white">
                    {song.era ?? "—"}
                  </span>
                </div>
              </div>
            </div>

            <section className="space-y-6">
              <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_18px_45px_rgba(14,12,30,0.55)]">
                <h2 className="text-2xl font-semibold">Leave a comment</h2>
                {commentError ? (
                  <p className="text-sm text-red-300">{commentError}</p>
                ) : null}
                {token ? (
                  <form className="space-y-4" onSubmit={handleSubmitComment}>
                    <textarea
                      value={commentText}
                      onChange={(event) => setCommentText(event.target.value)}
                      rows={3}
                      placeholder="Share your feedback, ideas, or melodies…"
                      className="w-full rounded-2xl border border-white/10 bg-[#1B0830]/70 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-purple-400"
                    />
                    <button
                      type="submit"
                      disabled={commentSubmitting || commentText.trim().length === 0}
                      className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(168,85,247,0.35)] transition hover:shadow-[0_20px_55px_rgba(168,85,247,0.45)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {commentSubmitting ? "Posting…" : "Post comment"}
                    </button>
                  </form>
                ) : (
                  <p className="text-sm text-white/60">
                    Sign in to join the conversation and leave a comment.
                  </p>
                )}
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">Comments</h2>
                  <p className="text-sm text-white/50">
                    {comments.length > 0
                      ? `${comments.length} comment${comments.length > 1 ? "s" : ""}`
                      : "No comments yet"}
                  </p>
                </div>
                {commentsLoading ? (
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-sm text-white/60">
                    Loading comments…
                  </div>
                ) : comments.length === 0 ? (
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-white/60">
                    Be the first to respond. Share your thoughts, suggestions or melodies for this lyric.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div
                        key={comment._id}
                        className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70"
                      >
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/20 text-white">
                          {comment.user?.username?.slice(0, 2).toUpperCase() ??
                            comment.user?.email?.slice(0, 2).toUpperCase() ??
                            "AI"}
                        </span>
                        <div className="flex flex-1 flex-col gap-1">
                          <div className="flex items-center justify-between text-xs text-white/50">
                            <span className="font-semibold text-white">
                              {comment.user?.username ?? comment.user?.email ?? "Anonymous"}
                            </span>
                            <span>{formatDate(comment.createdAt)}</span>
                          </div>
                          <p>{comment.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </section>
    </AppShell>
  );
}

