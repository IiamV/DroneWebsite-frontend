export default function DownloadsLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
      {/* Page title */}
      <div className="h-8 w-44 bg-[var(--border)] rounded mb-2" />
      <div className="h-5 w-72 bg-[var(--border)] rounded mb-8" />
      {/* Download items */}
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-5 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)]"
          >
            <div className="h-12 w-12 bg-[var(--border)] rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-5 w-1/2 bg-[var(--border)] rounded" />
              <div className="h-4 w-3/4 bg-[var(--border)] rounded" />
            </div>
            <div className="h-9 w-28 bg-[var(--border)] rounded-lg flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  )
}
