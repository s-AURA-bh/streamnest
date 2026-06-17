export default function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-dashed border-black/20 p-10 text-center dark:border-white/20">
      <h2 className="font-bold">{title}</h2>
      <p className="mt-2 text-sm text-black/60 dark:text-white/60">{body}</p>
    </div>
  );
}
