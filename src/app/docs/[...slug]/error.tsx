'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { FileText } from 'lucide-react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function DocsError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <div className="w-14 h-14 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] mb-4">
        <FileText size={24} />
      </div>
      <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
        Failed to load documentation
      </h2>
      <p className="text-[var(--text-secondary)] mb-6 max-w-sm">
        We couldn&apos;t load this documentation page. Please try again.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-5 py-2 bg-[var(--accent)] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
        >
          Try again
        </button>
        <Link
          href="/docs"
          className="px-5 py-2 border border-[var(--border)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors font-medium"
        >
          Back to docs
        </Link>
      </div>
    </div>
  )
}
