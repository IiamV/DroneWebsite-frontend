export default function CatalogLoading() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8 space-y-2">
        <div className="h-8 w-48 rounded bg-[var(--bg-secondary)] animate-pulse" />
        <div className="h-4 w-80 rounded bg-[var(--bg-secondary)] animate-pulse" />
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-64 h-96 rounded-lg bg-[var(--bg-secondary)] animate-pulse shrink-0" />
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 rounded-lg bg-[var(--bg-secondary)] animate-pulse" />
          ))}
        </div>
      </div>
    </main>
  )
}
