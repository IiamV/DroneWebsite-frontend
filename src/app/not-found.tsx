import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
      <div className="text-center px-6 max-w-md">
        <div className="text-8xl font-bold text-[var(--accent)] mb-4">404</div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
          Page not found
        </h1>
        <p className="text-[var(--text-secondary)] mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2 bg-[var(--accent)] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
        >
          Back to homepage
        </Link>
      </div>
    </div>
  )
}
