export default function CourseDetailLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
      {/* Breadcrumb */}
      <div className="h-4 w-48 bg-[var(--border)] rounded mb-6" />
      {/* Title */}
      <div className="h-9 w-3/4 bg-[var(--border)] rounded mb-3" />
      <div className="h-5 w-full bg-[var(--border)] rounded mb-2" />
      <div className="h-5 w-2/3 bg-[var(--border)] rounded mb-6" />
      {/* Meta badges */}
      <div className="flex gap-3 mb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-7 w-20 bg-[var(--border)] rounded-full" />
        ))}
      </div>
      {/* Video placeholder */}
      <div className="aspect-video bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] mb-8" />
      {/* Module list */}
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border)]" />
        ))}
      </div>
    </div>
  )
}
