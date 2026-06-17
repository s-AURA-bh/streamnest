"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import Loading from "@/components/Loading";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  if (!user) {
    return (
      <div className="mx-auto max-w-md rounded-lg border border-black/10 p-8 text-center dark:border-white/10">
        <h1 className="text-2xl font-bold">Login required</h1>
        <p className="mt-2 text-sm text-black/60 dark:text-white/60">Please sign in to continue.</p>
        <Link href="/login" className="mt-5 inline-flex rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white">
          Go to login
        </Link>
      </div>
    );
  }
  return <>{children}</>;
}
