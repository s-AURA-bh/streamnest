"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import VideoCard from "@/components/VideoCard";
import { api } from "@/lib/api";
import type { WatchResponse } from "@/types";

export default function WatchPage() {
  const params = useParams<{ id: string }>();
  const [data, setData] = useState<WatchResponse | null>(null);

  useEffect(() => {
    api<WatchResponse>(`/videos/${params.id}`).then((response) => {
      setData(response);
      void api(`/videos/${params.id}/view`, { method: "POST" });
    });
  }, [params.id]);

  if (!data) return <Loading />;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <section>
        <video src={data.video.video_url} controls className="aspect-video w-full rounded-lg bg-black" poster={data.video.thumbnail_url} />
        <h1 className="mt-5 text-2xl font-black">{data.video.title}</h1>
        <p className="mt-2 text-sm text-black/60 dark:text-white/60">
          {data.video.view_count.toLocaleString()} views · {new Date(data.video.created_at).toLocaleDateString()} · {data.video.category.name}
        </p>
        <div className="mt-5 rounded-lg bg-white p-4 text-sm leading-6 dark:bg-white/5">
          <p className="font-bold">{data.video.owner.username}</p>
          <p className="mt-3 whitespace-pre-wrap">{data.video.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">{data.video.tags.map((tag) => <span key={tag} className="rounded-full bg-black/5 px-3 py-1 text-xs dark:bg-white/10">#{tag}</span>)}</div>
        </div>
      </section>
      <aside>
        <h2 className="mb-4 text-lg font-black">Related videos</h2>
        <div className="grid gap-5">{data.related.map((video) => <VideoCard key={video.id} video={video} />)}</div>
      </aside>
    </div>
  );
}
