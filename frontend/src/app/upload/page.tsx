"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Loading from "@/components/Loading";
import ProtectedRoute from "@/components/ProtectedRoute";
import VideoForm from "@/components/VideoForm";
import { api } from "@/lib/api";
import type { WatchResponse, Video } from "@/types";

function UploadContent() {
  const params = useSearchParams();
  const editId = params.get("edit");
  const [existing, setExisting] = useState<Video | undefined>();
  const [loading, setLoading] = useState(Boolean(editId));

  useEffect(() => {
    if (!editId) return;
    api<WatchResponse>(`/videos/${editId}`).then((response) => setExisting(response.video)).finally(() => setLoading(false));
  }, [editId]);

  return (
    <ProtectedRoute>
      <div className="mb-6">
        <h1 className="text-2xl font-black">{editId ? "Edit video" : "Upload video"}</h1>
        <p className="mt-1 text-sm text-black/60 dark:text-white/60">Add an MP4 video, thumbnail, metadata, and tags.</p>
      </div>
      {loading ? <Loading /> : <VideoForm existing={existing} />}
    </ProtectedRoute>
  );
}

export default function UploadPage() {
  return (
    <Suspense fallback={<Loading />}>
      <UploadContent />
    </Suspense>
  );
}
