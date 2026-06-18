"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Category, Video } from "@/types";
import VideoCard from "@/components/VideoCard";
import Loading from "@/components/Loading";
import EmptyState from "@/components/EmptyState";

export default function HomePage() {
  const [latest, setLatest] = useState<Video[]>([]);
  const [trending, setTrending] = useState<Video[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api<Video[]>("/videos/latest"), api<Video[]>("/videos/trending"), api<Category[]>("/categories")])
      .then(([latestData, trendingData, categoryData]) => {
        setLatest(latestData);
        setTrending(trendingData);
        setCategories(categoryData);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selected) return;
    setLoading(true);
    api<{ items: Video[] }>(`/videos?category_id=${selected}`).then((data) => setLatest(data.items)).finally(() => setLoading(false));
  }, [selected]);

  if (loading) return <Loading />;

  return (
    <div className="space-y-10">
      <section className="grid gap-6 border-b border-black/10 pb-8 dark:border-white/10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-brand">Latest uploads</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">Watch, learn, play, and share.</h1>
        </div>
        <div className="flex flex-wrap content-start gap-2">
          <button onClick={() => setSelected(null)} className="rounded-full border border-black/10 px-4 py-2 text-sm dark:border-white/10">All</button>
          {categories.map((category) => (
            <button key={category.id} onClick={() => setSelected(category.id)} className="rounded-full border border-black/10 px-4 py-2 text-sm dark:border-white/10">
              {category.name}
            </button>
          ))}
        </div>
      </section>
      {latest.length === 0 ? (
        <EmptyState title="No videos yet" body="Upload the first video from your dashboard." />
      ) : (
        <section>
          <h2 className="mb-4 text-xl font-black">Latest videos</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{latest.map((video) => <VideoCard key={video.id} video={video} />)}</div>
        </section>
      )}
      <section>
        <h2 className="mb-4 text-xl font-black">Trending videos</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{trending.map((video) => <VideoCard key={video.id} video={video} />)}</div>
      </section>
    </div>
  );
}
