'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon, Menu, X } from 'lucide-react'
import { useTheme } from '@/components/layout/ThemeProvider'
import { Badge } from '@/components/ui/Badge'
import { createFocusTrap } from '@/lib/focus-trap'
import { ROUTES } from '@/constants/routes'

// Mock auth state — replaced in Task 16 with real Supabase auth
const MOCK_USER = {
  name: 'Alex Nguyen',
  tierBadge: { color: '#f59e0b', label: 'Pro' },
}
const MOCK_AUTHENTICATED = true

const NAV_LINKS = [
  { href: ROUTES.COURSES, label: 'Courses' },
  { href: ROUTES.CATALOG, label: 'Catalog' },
  { href: ROUTES.DOWNLOADS, label: 'Downloads' },
  { href: ROUTES.DOCS, label: 'Docs' },
  { href: ROUTES.PRICING, label: 'Pricing' },
]

export function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)
  const trapRef = useRef<ReturnType<typeof createFocusTrap> | null>(null)

  useEffect(() => {
    if (drawerOpen && drawerRef.current) {
      trapRef.current = createFocusTrap(drawerRef.current, () => setDrawerOpen(false))
      trapRef.current.activate()
    } else {
      trapRef.current?.deactivate()
      trapRef.current = null
    }
    return () => { trapRef.current?.deactivate() }
  }, [drawerOpen])

  useEffect(() => { setDrawerOpen(false) }, [pathname])

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  const tapStyle = { touchAction: 'manipulation' as const }

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--bg-primary)]/90 backdrop-blur-sm">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
          <Link
            href={ROUTES.HOME}
            className="flex min-h-[44px] min-w-[44px] items-center gap-2 font-bold text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            style={tapStyle}
          >
            <span className="text-lg tracking-tight">DroneSimPlatform</span>
          </Link>

          <ul className="hidden md:flex md:items-center md:gap-1" role="list">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={`${href}-${label}`}>
                <Link
                  href={href}
                  className={[
                    'inline-flex min-h-[44px] min-w-[44px] items-center rounded-md px-3 text-sm font-medium transition-colors',
                    'hover:bg-[var(--bg-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]',
                    pathname.startsWith(href)
                      ? 'text-[var(--text-primary)]'
                      : 'text-[var(--text-secondary)]',
                  ].join(' ')}
                  style={tapStyle}
                  aria-current={pathname.startsWith(href) ? 'page' : undefined}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex md:items-center md:gap-2">
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              style={tapStyle}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {MOCK_AUTHENTICATED ? (
              <>
                <Badge color={MOCK_USER.tierBadge.color} label={MOCK_USER.tierBadge.label} />
                <Link
                  href={ROUTES.PROFILE}
                  className="inline-flex min-h-[44px] min-w-[44px] items-center rounded-md px-3 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  style={tapStyle}
                >
                  {MOCK_USER.name}
                </Link>
                <button
                  className="inline-flex min-h-[44px] min-w-[44px] items-center rounded-md px-3 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  style={tapStyle}
                  onClick={() => {/* replaced in Task 16 */}}
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href={ROUTES.AUTH_LOGIN}
                  className="inline-flex min-h-[44px] min-w-[44px] items-center rounded-md px-3 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  style={tapStyle}
                >
                  Sign in
                </Link>
                <Link
                  href={ROUTES.AUTH_REGISTER}
                  className="inline-flex min-h-[44px] min-w-[44px] items-center rounded-md bg-[var(--accent)] px-3 text-sm font-medium text-[var(--bg-primary)] transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  style={tapStyle}
                >
                  Get started
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              style={tapStyle}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={drawerOpen}
              aria-controls="mobile-drawer"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              style={tapStyle}
            >
              <Menu size={24} />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={() => setDrawerOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              key="drawer"
              id="mobile-drawer"
              ref={drawerRef}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed inset-y-0 right-0 z-50 flex w-72 flex-col bg-[var(--bg-primary)] shadow-xl md:hidden"
            >
              <div className="flex h-16 items-center justify-between border-b border-[var(--border)] px-4">
                <span className="font-bold text-[var(--text-primary)]">Menu</span>
                <button
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close navigation menu"
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  style={tapStyle}
                >
                  <X size={24} />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-4 py-4" aria-label="Mobile navigation">
                <ul className="flex flex-col gap-1" role="list">
                  {NAV_LINKS.map(({ href, label }) => (
                    <li key={`mobile-${href}-${label}`}>
                      <Link
                        href={href}
                        className={[
                          'flex min-h-[44px] items-center rounded-md px-3 text-sm font-medium transition-colors',
                          'hover:bg-[var(--bg-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]',
                          pathname.startsWith(href)
                            ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)]'
                            : 'text-[var(--text-secondary)]',
                        ].join(' ')}
                        style={tapStyle}
                        aria-current={pathname.startsWith(href) ? 'page' : undefined}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="border-t border-[var(--border)] px-4 py-4">
                {MOCK_AUTHENTICATED ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 px-3 py-2">
                      <Badge color={MOCK_USER.tierBadge.color} label={MOCK_USER.tierBadge.label} />
                      <span className="text-sm font-medium text-[var(--text-primary)]">{MOCK_USER.name}</span>
                    </div>
                    <Link
                      href={ROUTES.PROFILE}
                      className="flex min-h-[44px] items-center rounded-md px-3 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                      style={tapStyle}
                    >
                      Profile
                    </Link>
                    <button
                      className="flex min-h-[44px] w-full items-center rounded-md px-3 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                      style={tapStyle}
                      onClick={() => {/* replaced in Task 16 */}}
                    >
                      Sign out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link
                      href={ROUTES.AUTH_LOGIN}
                      className="flex min-h-[44px] items-center rounded-md px-3 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                      style={tapStyle}
                    >
                      Sign in
                    </Link>
                    <Link
                      href={ROUTES.AUTH_REGISTER}
                      className="flex min-h-[44px] items-center rounded-md bg-[var(--accent)] px-3 text-sm font-medium text-[var(--bg-primary)] transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                      style={tapStyle}
                    >
                      Get started
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
