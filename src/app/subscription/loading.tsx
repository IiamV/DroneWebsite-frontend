export default function SubscriptionLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
      {/* Page title */}
      <div className="h-8 w-48 bg-[var(--border)] rounded mb-8" />
      {/* Current plan card */}
      <div className="h-40 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] mb-8" />
      {/* Tier cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-64 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)]" />
        ))}
      </div>
    </div>
  )
}
