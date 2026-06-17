"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { Category, Video } from "@/types";

export default function VideoForm({ existing }: { existing?: Video }) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState(existing?.title || "");
  const [description, setDescription] = useState(existing?.description || "");
  const [categoryId, setCategoryId] = useState(existing?.category.id?.toString() || "");
  const [tags, setTags] = useState(existing?.tags.join(", ") || "");
  const [video, setVideo] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api<Category[]>("/categories").then(setCategories).catch(() => setError("Could not load categories."));
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      if (existing) {
        await api<Video>(`/videos/${existing.id}`, {
          method: "PUT",
          body: JSON.stringify({
            title,
            description,
            category_id: Number(categoryId),
            tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean)
          })
        });
        router.push("/dashboard");
        return;
      }
      if (!video || !thumbnail) {
        setError("Video and thumbnail files are required.");
        return;
      }
      const form = new FormData();
      form.set("title", title);
      form.set("description", description);
      form.set("category_id", categoryId);
      form.set("tags", tags);
      form.set("video", video);
      form.set("thumbnail", thumbnail);
      const created = await api<Video>("/videos", { method: "POST", body: form });
      router.push(`/watch/${created.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="mx-auto grid max-w-3xl gap-5 rounded-lg border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
      {error && <div className="rounded-md bg-red-100 px-4 py-3 text-sm text-red-700">{error}</div>}
      <label className="grid gap-2 text-sm font-semibold">
        Title
        <input required value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-md border border-black/10 bg-transparent px-3 py-2 font-normal dark:border-white/10" />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Description
        <textarea required rows={6} value={description} onChange={(e) => setDescription(e.target.value)} className="rounded-md border border-black/10 bg-transparent px-3 py-2 font-normal dark:border-white/10" />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Category
        <select required value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="rounded-md border border-black/10 bg-transparent px-3 py-2 font-normal dark:border-white/10">
          <option value="">Select category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Keywords / tags
        <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="nextjs, fastapi, tutorial" className="rounded-md border border-black/10 bg-transparent px-3 py-2 font-normal dark:border-white/10" />
      </label>
      {!existing && (
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold">
            MP4 video
            <input required accept="video/mp4" type="file" onChange={(e) => setVideo(e.target.files?.[0] || null)} className="text-sm" />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Thumbnail
            <input required accept="image/png,image/jpeg,image/webp" type="file" onChange={(e) => setThumbnail(e.target.files?.[0] || null)} className="text-sm" />
          </label>
        </div>
      )}
      <button disabled={saving} className="rounded-full bg-brand px-5 py-3 text-sm font-bold text-white disabled:opacity-60">
        {saving ? "Saving..." : existing ? "Save changes" : "Upload video"}
      </button>
    </form>
  );
}
