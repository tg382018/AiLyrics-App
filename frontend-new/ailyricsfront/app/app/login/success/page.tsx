"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { REDIRECT_STORAGE_KEY } from "@/lib/api";
import { AuthShell } from "../../_components/auth-shell";
import { useAuth } from "../../_contexts/auth-context";

const DEFAULT_REDIRECT = "/app/me";

export default function LoginSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { completeOAuthLogin, authLoading } = useAuth();

  const [status, setStatus] = useState<
    "processing" | "error" | "completed"
  >("processing");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [redirectTarget, setRedirectTarget] =
    useState<string>(DEFAULT_REDIRECT);

  const token = useMemo(() => searchParams.get("token"), [searchParams]);
  const redirectParam = useMemo(
    () => searchParams.get("redirect"),
    [searchParams],
  );

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage(
        "The authentication callback did not include a token. Please try signing in again.",
      );
      return;
    }

    let isMounted = true;

    const storedRedirect =
      typeof window !== "undefined"
        ? window.localStorage.getItem(REDIRECT_STORAGE_KEY)
        : null;
    const destination = redirectParam ?? storedRedirect ?? DEFAULT_REDIRECT;
    setRedirectTarget(destination);

    completeOAuthLogin(token)
      .then(() => {
        if (isMounted) {
          setStatus("completed");
          if (typeof window !== "undefined") {
            window.localStorage.removeItem(REDIRECT_STORAGE_KEY);
          }
          router.replace(destination);
        }
      })
      .catch((error) => {
        console.error("OAuth login failed:", error);
        if (isMounted) {
          setStatus("error");
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "An unexpected error occurred while signing you in.",
          );
        }
      });

    return () => {
      isMounted = false;
    };
  }, [completeOAuthLogin, router, token]);

  const isLoading = authLoading || status === "processing";

  return (
    <AuthShell>
      <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-6 rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-white shadow-[0_30px_70px_rgba(17,12,34,0.6)] backdrop-blur">
        {isLoading ? (
          <>
            <div className="h-14 w-14 animate-spin rounded-full border-4 border-purple-400/40 border-t-purple-200" />
            <h1 className="text-2xl font-semibold">Signing you in…</h1>
            <p className="text-sm text-white/60">
              Completing your Google login. This will only take a moment.
            </p>
          </>
        ) : status === "error" ? (
          <>
            <div className="h-14 w-14 rounded-full border border-red-400/40 bg-red-500/20 text-3xl leading-[3.5rem] text-red-200">
              !
            </div>
            <h1 className="text-2xl font-semibold text-red-100">
              We couldn&apos;t finish signing you in.
            </h1>
            <p className="text-sm text-red-200/80">{errorMessage}</p>
            <div className="flex gap-3 pt-4">
              <Link
                href="/app/login"
                className="rounded-full border border-white/20 px-5 py-2 text-sm text-white/80 transition hover:border-white/40 hover:text-white"
              >
                Back to login
              </Link>
              <button
                type="button"
                onClick={() => {
                  if (token) {
                    setStatus("processing");
                    setErrorMessage(null);
                    completeOAuthLogin(token)
                      .then(() => {
                        if (typeof window !== "undefined") {
                          window.localStorage.removeItem(REDIRECT_STORAGE_KEY);
                        }
                        router.replace(redirectTarget);
                      })
                      .catch((error) => {
                        console.error("Retry OAuth login failed:", error);
                        setStatus("error");
                        setErrorMessage(
                          error instanceof Error
                            ? error.message
                            : "An unexpected error occurred while signing you in.",
                        );
                      });
                  } else {
                    router.push("/app/login");
                  }
                }}
                className="rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-500 px-5 py-2 text-sm font-semibold text-white shadow-[0_12px_25px_rgba(168,85,247,0.35)] transition hover:shadow-[0_18px_35px_rgba(168,85,247,0.45)]"
              >
                Try again
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="h-14 w-14 rounded-full border border-emerald-400/40 bg-emerald-500/20 text-3xl leading-[3.5rem] text-emerald-200">
              ✓
            </div>
            <h1 className="text-2xl font-semibold text-emerald-100">
              You&apos;re all set!
            </h1>
            <p className="text-sm text-emerald-200/80">
              Redirecting you to your dashboard…
            </p>
            <Link
              href={redirectTarget}
              className="rounded-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 px-5 py-2 text-sm font-semibold text-white shadow-[0_12px_25px_rgba(16,185,129,0.35)] transition hover:shadow-[0_18px_35px_rgba(16,185,129,0.45)]"
            >
              Continue
            </Link>
          </>
        )}
      </div>
    </AuthShell>
  );
}

