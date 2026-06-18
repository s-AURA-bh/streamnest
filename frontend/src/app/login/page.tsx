"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="mx-auto grid max-w-md gap-4 rounded-lg border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
      <h1 className="text-2xl font-black">Login</h1>
      {error && <p className="rounded-md bg-red-100 p-3 text-sm text-red-700">{error}</p>}
      <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-md border border-black/10 bg-transparent px-3 py-2 dark:border-white/10" />
      <input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-md border border-black/10 bg-transparent px-3 py-2 dark:border-white/10" />
      <button disabled={loading} className="rounded-full bg-brand px-5 py-3 text-sm font-bold text-white">{loading ? "Logging in..." : "Login"}</button>
      <Link href="/register" className="text-sm font-semibold text-brand">Create an account</Link>
    </form>
  );
}
