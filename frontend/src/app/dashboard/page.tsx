"use client";

import Image from "next/image";
import Link from "next/link";
import { Edit, Trash2, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import EmptyState from "@/components/EmptyState";
import Loading from "@/components/Loading";
import ProtectedRoute from "@/components/ProtectedRoute";
import { api } from "@/lib/api";
import type { Video } from "@/types";

type Dashboard = { videos: Video[]; total_views: number; total_videos: number };

export default function DashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setData(await api<Dashboard>("/videos/me/dashboard"));
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function remove(id: number) {
    if (!confirm("Delete this video?")) return;
    await api(`/videos/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <ProtectedRoute>
      {loading || !data ? <Loading /> : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black">Dashboard</h1>
              <p className="text-sm text-black/60 dark:text-white/60">{data.total_videos} videos · {data.total_views.toLocaleString()} total views</p>
            </div>
            <Link href="/upload" className="inline-flex rounded-full bg-brand px-5 py-3 text-sm font-bold text-white"><Upload className="mr-2 h-4 w-4" /> Upload</Link>
          </div>
          {data.videos.length === 0 ? <EmptyState title="No uploads" body="Upload your first video to start building your channel." /> : (
            <div className="overflow-hidden rounded-lg border border-black/10 bg-white dark:border-white/10 dark:bg-white/5">
              {data.videos.map((video) => (
                <div key={video.id} className="grid gap-4 border-b border-black/10 p-4 last:border-b-0 dark:border-white/10 sm:grid-cols-[180px_1fr_auto]">
                  <div className="relative aspect-video overflow-hidden rounded-md bg-black"><Image src={video.thumbnail_url} alt={video.title} fill className="object-cover" /></div>
                  <div>
                    <Link href={`/watch/${video.id}`} className="font-bold hover:text-brand">{video.title}</Link>
                    <p className="mt-1 line-clamp-2 text-sm text-black/60 dark:text-white/60">{video.description}</p>
                    <p className="mt-2 text-xs text-black/50 dark:text-white/50">{video.view_count.toLocaleString()} views · {video.category.name}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Link href={`/upload?edit=${video.id}`} className="rounded-full border border-black/10 p-2 dark:border-white/10" aria-label="Edit"><Edit className="h-4 w-4" /></Link>
                    <button onClick={() => remove(video.id)} className="rounded-full border border-black/10 p-2 text-brand dark:border-white/10" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </ProtectedRoute>
  );
}
