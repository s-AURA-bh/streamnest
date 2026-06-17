"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Moon, Search, Sun, Upload, User } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";

export default function Header() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [query, setQuery] = useState("");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  function submit(event: FormEvent) {
    event.preventDefault();
    const q = query.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-panel/95 backdrop-blur dark:border-white/10 dark:bg-ink/95">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-black tracking-tight text-brand">
          StreamNest
        </Link>
        <form onSubmit={submit} className="flex min-w-0 flex-1 items-center rounded-full border border-black/10 bg-white px-3 py-2 dark:border-white/10 dark:bg-white/10">
          <Search className="h-4 w-4 shrink-0 opacity-70" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search videos"
            className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none"
          />
        </form>
        <button
          type="button"
          aria-label="Toggle dark mode"
          onClick={() => setDark((value) => !value)}
          className="rounded-full border border-black/10 p-2 dark:border-white/10"
        >
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        {user ? (
          <>
            <Link href="/upload" className="hidden rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white sm:inline-flex">
              <Upload className="mr-2 h-4 w-4" /> Upload
            </Link>
            <Link href="/dashboard" className="rounded-full border border-black/10 p-2 dark:border-white/10" aria-label="Dashboard">
              <User className="h-4 w-4" />
            </Link>
            <button onClick={logout} className="text-sm font-semibold text-black/70 dark:text-white/70">
              Logout
            </button>
          </>
        ) : (
          <Link href="/login" className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-ink">
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
