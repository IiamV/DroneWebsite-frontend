export default function CatalogLoading() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-10 space-y-2">
        <div className="h-9 w-48 rounded-lg bg-[var(--bg-secondary)] animate-pulse" />
        <div className="h-4 w-96 rounded bg-[var(--bg-secondary)] animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] overflow-hidden animate-pulse">
            <div className="h-44 bg-[var(--bg-primary)]" />
            <div className="p-4 space-y-3">
              <div className="h-5 w-3/4 rounded bg-[var(--bg-primary)]" />
              <div className="h-3 w-full rounded bg-[var(--bg-primary)]" />
              <div className="h-3 w-2/3 rounded bg-[var(--bg-primary)]" />
              <div className="flex gap-3 pt-1">
                <div className="h-3 w-16 rounded bg-[var(--bg-primary)]" />
                <div className="h-3 w-16 rounded bg-[var(--bg-primary)]" />
                <div className="h-3 w-16 rounded bg-[var(--bg-primary)]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
