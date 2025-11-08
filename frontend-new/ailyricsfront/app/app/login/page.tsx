"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";

import { GOOGLE_AUTH_URL, REDIRECT_STORAGE_KEY } from "@/lib/api";
import { AuthShell } from "../_components/auth-shell";
import { useAuth } from "../_contexts/auth-context";

const DEFAULT_REDIRECT = "/app/me";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = useMemo(
    () => searchParams.get("redirect") ?? DEFAULT_REDIRECT,
    [searchParams],
  );

  const { login, authLoading, user, initializing } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initializing && user) {
      router.replace(redirectTarget);
    }
  }, [initializing, redirectTarget, router, user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      setError("Please fill in both your email and password.");
      return;
    }

    try {
      await login({ email, password });
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(REDIRECT_STORAGE_KEY);
      }
      router.push(redirectTarget);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };

  const handleGoogleLogin = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(REDIRECT_STORAGE_KEY, redirectTarget);
      window.location.href = GOOGLE_AUTH_URL;
    }
  };

  return (
    <AuthShell>
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-white shadow-[0_30px_70px_rgba(17,12,34,0.6)] backdrop-blur">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">Welcome Back</h1>
          <p className="text-sm text-white/60">
            Log in to continue crafting lyrics with AI.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="flex flex-col gap-2 text-sm text-white/70">
            Email
            <input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              className="w-full rounded-2xl border border-white/10 bg-[#1D0A32] px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-purple-400"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-white/70">
            Password
            <div className="flex items-center rounded-2xl border border-white/10 bg-[#1D0A32] pr-2 focus-within:border-purple-400">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
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

          {error ? (
            <p className="rounded-2xl bg-red-500/10 px-4 py-2 text-sm text-red-200">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={authLoading}
            className="w-full rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(168,85,247,0.35)] transition hover:shadow-[0_24px_55px_rgba(168,85,247,0.45)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {authLoading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-4 text-xs text-white/40">
          <span className="h-px flex-1 bg-white/15" />
          OR
          <span className="h-px flex-1 bg-white/15" />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex w-full items-center justify-center gap-3 rounded-full border border-white/15 bg-white px-6 py-3 text-sm font-semibold text-[#12031F] transition hover:bg-white/90"
        >
          <span className="text-lg">🟩</span>
          Sign in with Google
        </button>

        <div className="mt-6 flex flex-col gap-3 text-xs text-white/50">
          <button className="text-left text-white/70 transition hover:text-white">
            Forgot Password?
          </button>
          <span>
            Don&apos;t have an account?{" "}
            <Link
              href={`/app/signup?redirect=${encodeURIComponent(redirectTarget)}`}
              className="font-semibold text-purple-200 transition hover:text-purple-100"
            >
              Sign Up
            </Link>
          </span>
        </div>
      </div>
    </AuthShell>
  );
}

