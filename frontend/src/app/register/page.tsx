"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { api } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    try {
      await api("/auth/register", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(form.entries()))
      });
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="mx-auto grid max-w-md gap-4 rounded-lg border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
      <h1 className="text-2xl font-black">Create account</h1>
      {error && <p className="rounded-md bg-red-100 p-3 text-sm text-red-700">{error}</p>}
      <input name="full_name" placeholder="Full name" className="rounded-md border border-black/10 bg-transparent px-3 py-2 dark:border-white/10" />
      <input required name="username" placeholder="Username" className="rounded-md border border-black/10 bg-transparent px-3 py-2 dark:border-white/10" />
      <input required name="email" type="email" placeholder="Email" className="rounded-md border border-black/10 bg-transparent px-3 py-2 dark:border-white/10" />
      <input required name="password" type="password" minLength={8} placeholder="Password" className="rounded-md border border-black/10 bg-transparent px-3 py-2 dark:border-white/10" />
      <button disabled={loading} className="rounded-full bg-brand px-5 py-3 text-sm font-bold text-white">{loading ? "Creating..." : "Register"}</button>
    </form>
  );
}
