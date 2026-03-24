export default function ProfileLoading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-6 animate-pulse">
      <div className="h-8 w-32 rounded bg-[var(--border)]" />
      <div className="h-28 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)]" />
      <div className="h-12 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]" />
      <div className="h-64 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)]" />
    </div>
  )
}
