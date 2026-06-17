import Image from "next/image";
import Link from "next/link";
import type { Video } from "@/types";

export default function VideoCard({ video }: { video: Video }) {
  return (
    <Link href={`/watch/${video.id}`} className="group block">
      <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
        <Image src={video.thumbnail_url} alt={video.title} fill className="object-cover transition duration-200 group-hover:scale-105" />
      </div>
      <div className="mt-3">
        <h3 className="line-clamp-2 text-sm font-bold leading-5">{video.title}</h3>
        <p className="mt-1 text-sm text-black/60 dark:text-white/60">{video.owner.username}</p>
        <p className="text-xs text-black/50 dark:text-white/50">
          {video.view_count.toLocaleString()} views · {new Date(video.created_at).toLocaleDateString()}
        </p>
      </div>
    </Link>
  );
}
