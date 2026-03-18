'use client'

import { useEffect } from 'react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function SubscriptionError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <div className="text-5xl mb-4">💳</div>
      <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
        Failed to load subscription
      </h2>
      <p className="text-[var(--text-secondary)] mb-6 max-w-sm">
        We couldn&apos;t load your subscription details. Please try again.
      </p>
      <button
        onClick={reset}
        className="px-5 py-2 bg-[var(--accent)] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
      >
        Try again
      </button>
    </div>
  )
}
