'use client'

export default function CatalogError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="max-w-7xl mx-auto px-4 py-12 text-center">
      <p className="text-[var(--text-secondary)] mb-4">Failed to load the product catalog.</p>
      <button
        onClick={reset}
        className="inline-flex items-center justify-center rounded-md px-4 font-medium min-h-[44px] bg-[var(--accent)] text-[var(--bg-primary)] hover:opacity-90 transition-opacity"
        style={{ touchAction: 'manipulation' }}
      >
        Try again
      </button>
    </main>
  )
}
