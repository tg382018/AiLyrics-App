"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { API_BASE_URL } from "@/lib/api";

type AuthUser = {
  _id?: string;
  email: string;
  username?: string;
  role?: string;
  profileImage?: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = {
  username: string;
  email: string;
  password: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  initializing: boolean;
  authLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<string>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  completeOAuthLogin: (token: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_STORAGE_KEY = "aiLyrics.accessToken";
const TOKEN_COOKIE_KEY = "aiLyricsToken";

async function parseResponse(res: Response) {
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return res.json();
  }
  const text = await res.text();
  return text ? { message: text } : { message: res.statusText };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    const existingToken =
      typeof window === "undefined"
        ? null
        : window.localStorage.getItem(TOKEN_STORAGE_KEY);

    if (existingToken) {
      setToken(existingToken);
      fetchProfile(existingToken)
        .catch((error) => {
          console.error("Failed to restore session:", error);
          clearSession();
        })
        .finally(() => setInitializing(false));
    } else {
      setInitializing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persistToken = useCallback((value: string | null) => {
    if (typeof window === "undefined") return;
    if (value) {
      window.localStorage.setItem(TOKEN_STORAGE_KEY, value);
      document.cookie = `${TOKEN_COOKIE_KEY}=${value}; path=/; max-age=604800; SameSite=Lax`;
    } else {
      window.localStorage.removeItem(TOKEN_STORAGE_KEY);
      document.cookie = `${TOKEN_COOKIE_KEY}=; path=/; max-age=0; SameSite=Lax`;
    }
  }, []);

  const clearSession = useCallback(() => {
    setUser(null);
    setToken(null);
    persistToken(null);
  }, [persistToken]);

  const fetchProfile = useCallback(async (activeToken: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${activeToken}`,
      },
    });

    if (!res.ok) {
      throw new Error("Unable to fetch profile.");
    }

    const profile = await res.json();
    setUser(profile);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!token) return;
    try {
      await fetchProfile(token);
    } catch (error) {
      console.error(error);
    }
  }, [fetchProfile, token]);

  const login = useCallback(
    async ({ email, password }: LoginPayload) => {
      setAuthLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
          const errorData = await parseResponse(res);
          throw new Error(
            errorData.message ?? "Login failed. Please check your credentials.",
          );
        }

        const data = await res.json();
        const accessToken = data.access_token as string | undefined;

        if (!accessToken) {
          throw new Error("Login response missing access token.");
        }

        persistToken(accessToken);
        setToken(accessToken);
        setUser(data.user);
      } finally {
        setAuthLoading(false);
      }
    },
    [persistToken],
  );

  const register = useCallback(
    async ({
      username,
      email,
      password,
    }: RegisterPayload): Promise<string> => {
      setAuthLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password }),
        });

        const response = await parseResponse(res);

        if (!res.ok) {
          throw new Error(
            response.message ??
              "Registration failed. Please review your information.",
          );
        }

        return (
          response.message ??
          "Registration successful. Please check your email to verify your account."
        );
      } finally {
        setAuthLoading(false);
      }
    },
    [],
  );

  const completeOAuthLogin = useCallback(
    async (incomingToken: string) => {
      if (!incomingToken) {
        throw new Error("Invalid token received from provider.");
      }
      setAuthLoading(true);
      try {
        persistToken(incomingToken);
        setToken(incomingToken);
        await fetchProfile(incomingToken);
      } finally {
        setAuthLoading(false);
      }
    },
    [fetchProfile, persistToken],
  );

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      initializing,
      authLoading,
      login,
      register,
      logout,
      refreshProfile,
      completeOAuthLogin,
    }),
    [
      user,
      token,
      initializing,
      authLoading,
      login,
      register,
      logout,
      refreshProfile,
      completeOAuthLogin,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

