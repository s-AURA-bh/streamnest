"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, getToken, login as requestLogin } from "@/lib/api";
import type { User } from "@/types";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser() {
    const stored = getToken();
    setToken(stored);
    if (!stored) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      setUser(await api<User>("/users/me"));
    } catch {
      localStorage.removeItem("access_token");
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refreshUser();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      token,
      login: async (email, password) => {
        const nextToken = await requestLogin(email, password);
        setToken(nextToken);
        await refreshUser();
      },
      logout: () => {
        localStorage.removeItem("access_token");
        setUser(null);
        setToken(null);
      },
      refreshUser
    }),
    [user, loading, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");
  return context;
}
