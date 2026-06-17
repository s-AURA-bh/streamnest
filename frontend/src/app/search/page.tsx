"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import EmptyState from "@/components/EmptyState";
import Loading from "@/components/Loading";
import VideoCard from "@/components/VideoCard";
import { api } from "@/lib/api";
import type { VideoList } from "@/types";

function SearchContent() {
  const params = useSearchParams();
  const q = params.get("q") || "";
  const [page, setPage] = useState(1);
  const [data, setData] = useState<VideoList | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api<VideoList>(`/videos/search?q=${encodeURIComponent(q)}&page=${page}`)
      .then(setData)
      .finally(() => setLoading(false));
  }, [q, page]);

  if (loading || !data) return <Loading />;
  const totalPages = Math.max(1, Math.ceil(data.total / data.page_size));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black">Search results for “{q}”</h1>
      {data.items.length === 0 ? <EmptyState title="No matches" body="Try a different title, description, or keyword." /> : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{data.items.map((video) => <VideoCard key={video.id} video={video} />)}</div>
      )}
      <div className="flex items-center justify-center gap-3">
        <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-full border border-black/10 px-4 py-2 disabled:opacity-50 dark:border-white/10">Previous</button>
        <span className="text-sm">Page {page} of {totalPages}</span>
        <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="rounded-full border border-black/10 px-4 py-2 disabled:opacity-50 dark:border-white/10">Next</button>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SearchContent />
    </Suspense>
  );
}
