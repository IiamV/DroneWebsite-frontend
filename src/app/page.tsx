'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Static export has no middleware, so redirect root → /en client-side.
// Next.js automatically prepends basePath to router.replace calls.
export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/en')
  }, [router])

  return null
}
