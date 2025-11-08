import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const TOKEN_COOKIE_KEY = "aiLyricsToken";
const PROTECTED_PREFIXES = ["/app/me", "/app/generate", "/app/songs"];
const AUTH_PAGES = ["/app/login", "/app/signup"];

function normalizeRedirect(target: string) {
  if (!target) return "/app/me";
  if (target.startsWith("http://") || target.startsWith("https://")) {
    return target;
  }
  return target.startsWith("/") ? target : `/${target}`;
}

export default function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const token = req.cookies.get(TOKEN_COOKIE_KEY)?.value;

  const requiresAuth = PROTECTED_PREFIXES.some(
    (prefix) =>
      pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (requiresAuth && !token) {
    const loginUrl = new URL("/app/login", req.url);
    loginUrl.searchParams.set("redirect", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (token && AUTH_PAGES.includes(pathname)) {
    const redirectParam = req.nextUrl.searchParams.get("redirect") ?? "/app/me";
    const redirectUrl = new URL(normalizeRedirect(redirectParam), req.url);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/app/login",
    "/app/signup",
    "/app/me/:path*",
    "/app/generate",
    "/app/generate/:path*",
    "/app/songs/:path*",
  ],
};

