"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import { AuthShell } from "../_components/auth-shell";
import { useAuth } from "../_contexts/auth-context";
import { GOOGLE_AUTH_URL } from "@/lib/api";

export default function SignupPage() {
  const handleGoogleSignup = () => {
    if (typeof window !== "undefined") {
      window.location.href = GOOGLE_AUTH_URL;
    }
  };

  const router = useRouter();
  const { register, authLoading, user, initializing } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState<
    { type: "success" | "error"; message: string } | null
  >(null);

  useEffect(() => {
    if (!initializing && user) {
      router.replace("/app/me");
    }
  }, [initializing, router, user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    const formData = new FormData(event.currentTarget);
    const username = String(formData.get("username") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!username || !email || !password) {
      setFeedback({
        type: "error",
        message: "Please complete all fields before continuing.",
      });
      return;
    }

    try {
      const message = await register({ username, email, password });
      setFeedback({
        type: "success",
        message:
          message ??
          "Registration successful! Check your email to verify your account.",
      });
    } catch (err) {
      setFeedback({
        type: "error",
        message:
          err instanceof Error
            ? err.message
            : "Registration failed. Please try again.",
      });
    }
  };

  return (
    <AuthShell>
      <div className="w-full max-w-lg space-y-8 rounded-3xl border border-white/10 bg-white/5 p-10 text-white shadow-[0_30px_70px_rgba(17,12,34,0.6)] backdrop-blur">
        <div className="space-y-3 text-left">
          <h1 className="text-3xl font-semibold tracking-tight">
            Start Writing with AI
          </h1>
          <p className="text-sm text-white/60">
            Create an account to start generating lyrics in seconds.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignup}
          className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/90 px-6 py-3 text-sm font-semibold text-[#12031F] transition hover:bg-white"
        >
          <span className="text-lg">🔵</span>
          Sign up with Google
        </button>

        <div className="flex items-center gap-4 text-xs text-white/40">
          <span className="h-px flex-1 bg-white/15" />
          OR
          <span className="h-px flex-1 bg-white/15" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-sm">
          <label className="flex flex-col gap-2 text-white/70">
            Username
            <input
              name="username"
              type="text"
              autoComplete="username"
              placeholder="Enter your username"
              className="w-full rounded-2xl border border-white/10 bg-[#1D0A32] px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-purple-400"
            />
          </label>
          <label className="flex flex-col gap-2 text-white/70">
            Email Address
            <input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              className="w-full rounded-2xl border border-white/10 bg-[#1D0A32] px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-purple-400"
            />
          </label>
          <label className="flex flex-col gap-2 text-white/70">
            Password
            <div className="flex items-center rounded-2xl border border-white/10 bg-[#1D0A32] pr-2 focus-within:border-purple-400">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="8+ characters"
                className="w-full rounded-2xl bg-transparent px-4 py-3 text-white placeholder:text-white/30 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-xs text-white/60 transition hover:text-white"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          {feedback ? (
            <p
              className={
                "rounded-2xl px-4 py-2 text-sm " +
                (feedback.type === "success"
                  ? "bg-emerald-500/15 text-emerald-200"
                  : "bg-red-500/10 text-red-200")
              }
            >
              {feedback.message}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={authLoading}
            className="w-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_45px_rgba(124,58,237,0.35)] transition hover:shadow-[0_26px_55px_rgba(124,58,237,0.45)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {authLoading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-xs text-white/45">
          By creating an account, you agree to our{" "}
          <button className="text-white/70 underline transition hover:text-white">
            Terms of Service
          </button>{" "}
          and{" "}
          <button className="text-white/70 underline transition hover:text-white">
            Privacy Policy
          </button>
          .
        </p>

        <p className="text-sm text-white/60">
          Already have an account?{" "}
          <Link
            href="/app/login"
            className="font-semibold text-purple-200 transition hover:text-purple-100"
          >
            Log In
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}

