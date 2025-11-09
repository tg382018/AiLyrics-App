const FALLBACK_API_BASE = "http://localhost:4000/api";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.API_BASE_URL ??
  FALLBACK_API_BASE;

export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

export const GOOGLE_AUTH_URL = `${API_ORIGIN}/api/auth/google`;

export const REDIRECT_STORAGE_KEY = "aiLyrics.postLoginRedirect";

export const TOKEN_COOKIE_KEY = "aiLyricsToken";

