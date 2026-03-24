export default function CoursesLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
      {/* Page title */}
      <div className="h-8 w-40 bg-[var(--border)] rounded mb-2" />
      <div className="h-5 w-64 bg-[var(--border)] rounded mb-8" />
      {/* Filter bar */}
      <div className="flex gap-3 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-9 w-24 bg-[var(--border)] rounded-full" />
        ))}
      </div>
      {/* Course grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] overflow-hidden">
            <div className="h-40 bg-[var(--border)]" />
            <div className="p-4 space-y-2">
              <div className="h-5 w-3/4 bg-[var(--border)] rounded" />
              <div className="h-4 w-full bg-[var(--border)] rounded" />
              <div className="h-4 w-1/2 bg-[var(--border)] rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
