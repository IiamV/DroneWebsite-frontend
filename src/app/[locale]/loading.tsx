export default function RootLoading() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] animate-pulse">
      {/* Nav skeleton */}
      <div className="h-16 bg-[var(--bg-secondary)] border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center gap-4">
          <div className="h-8 w-32 bg-[var(--border)] rounded" />
          <div className="flex-1" />
          <div className="h-8 w-20 bg-[var(--border)] rounded" />
          <div className="h-8 w-20 bg-[var(--border)] rounded" />
        </div>
      </div>
      {/* Hero skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="h-10 w-2/3 bg-[var(--border)] rounded mb-4" />
        <div className="h-6 w-1/2 bg-[var(--border)] rounded mb-8" />
        <div className="flex gap-4">
          <div className="h-10 w-32 bg-[var(--border)] rounded" />
          <div className="h-10 w-32 bg-[var(--border)] rounded" />
        </div>
      </div>
      {/* Content grid skeleton */}
      <div className="max-w-7xl mx-auto px-4 pb-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-48 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)]" />
        ))}
      </div>
    </div>
  )
}
