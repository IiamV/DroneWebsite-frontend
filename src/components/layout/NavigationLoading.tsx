'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

function isInternalNavigation(anchor: HTMLAnchorElement) {
  const url = new URL(anchor.href)
  const current = new URL(window.location.href)

  if (url.origin !== current.origin) return false
  if (anchor.target && anchor.target !== '_self') return false
  if (anchor.hasAttribute('download')) return false
  if (url.pathname === current.pathname && url.search === current.search) return false

  return true
}

export function NavigationLoading() {
  const pathname = usePathname()
  const [pending, setPending] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setPending(false)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }, [pathname])

  useEffect(() => {
    function startLoading() {
      setPending(true)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => setPending(false), 8000)
    }

    function onClick(event: MouseEvent) {
      if (event.defaultPrevented) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const target = event.target as HTMLElement | null
      const anchor = target?.closest('a[href]') as HTMLAnchorElement | null
      if (!anchor || !isInternalNavigation(anchor)) return

      startLoading()
    }

    window.addEventListener('app:navigation-start', startLoading)
    document.addEventListener('click', onClick, true)

    return () => {
      window.removeEventListener('app:navigation-start', startLoading)
      document.removeEventListener('click', onClick, true)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  if (!pending) return null

  return (
    <div className="fixed inset-x-0 bottom-0 top-16 z-[45] bg-[var(--bg-primary)]">
      <div className="mx-auto max-w-7xl px-4 py-10 animate-pulse">
        <div className="mb-10 space-y-3">
          <div className="h-9 w-56 rounded-lg bg-[var(--bg-secondary)]" />
          <div className="h-4 w-full max-w-xl rounded bg-[var(--bg-secondary)]" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-52 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
