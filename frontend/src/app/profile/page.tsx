"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/lib/auth";

export default function ProfilePage() {
  const { user } = useAuth();
  return (
    <ProtectedRoute>
      {user && (
        <div className="mx-auto max-w-2xl rounded-lg border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
          <h1 className="text-2xl font-black">Profile</h1>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <div><dt className="text-sm text-black/60 dark:text-white/60">Username</dt><dd className="font-bold">{user.username}</dd></div>
            <div><dt className="text-sm text-black/60 dark:text-white/60">Email</dt><dd className="font-bold">{user.email}</dd></div>
            <div><dt className="text-sm text-black/60 dark:text-white/60">Videos</dt><dd className="font-bold">{user.total_videos ?? 0}</dd></div>
            <div><dt className="text-sm text-black/60 dark:text-white/60">Total views</dt><dd className="font-bold">{user.total_views ?? 0}</dd></div>
          </dl>
        </div>
      )}
    </ProtectedRoute>
  );
}
