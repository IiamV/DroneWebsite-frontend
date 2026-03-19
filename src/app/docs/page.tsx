'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DocsIndexPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/docs/getting-started')
  }, [router])

  return null
}
