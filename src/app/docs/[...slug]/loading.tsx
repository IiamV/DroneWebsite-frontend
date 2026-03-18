export default function DocsLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 flex gap-8 animate-pulse">
      {/* Sidebar */}
      <aside className="hidden md:block w-56 flex-shrink-0 space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-5 bg-[var(--border)] rounded" style={{ width: `${60 + (i % 3) * 15}%` }} />
        ))}
      </aside>
      {/* Main content */}
      <main className="flex-1 space-y-4">
        <div className="h-8 w-2/3 bg-[var(--border)] rounded mb-6" />
        <div className="h-4 w-full bg-[var(--border)] rounded" />
        <div className="h-4 w-full bg-[var(--border)] rounded" />
        <div className="h-4 w-5/6 bg-[var(--border)] rounded" />
        <div className="h-4 w-full bg-[var(--border)] rounded mt-4" />
        <div className="h-4 w-3/4 bg-[var(--border)] rounded" />
        {/* Code block placeholder */}
        <div className="h-32 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border)] mt-6" />
        <div className="h-4 w-full bg-[var(--border)] rounded mt-4" />
        <div className="h-4 w-2/3 bg-[var(--border)] rounded" />
      </main>
    </div>
  )
}
