'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon, Menu, X, Globe } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { useTheme } from '@/components/layout/ThemeProvider'
import { useAuth } from '@/components/layout/AuthProvider'
import { Badge } from '@/components/ui/badge'
import { createFocusTrap } from '@/lib/focus-trap'
import { ROUTES, localePath } from '@/constants/routes'
import { routing } from '@/i18n/routing'
import { useSubscription } from '@/hooks/useSubscription'
import { mockTiers } from '@/mocks/tiers'

const TIER_COLOR = '#f59e0b'

export function Navbar() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const { tier } = useSubscription(mockTiers)
  const pathname = usePathname()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)
  const trapRef = useRef<ReturnType<typeof createFocusTrap> | null>(null)

  const NAV_LINKS = [
    { href: localePath(locale, ROUTES.COURSES), label: t('courses') },
    { href: localePath(locale, ROUTES.CATALOG), label: t('catalog') },
    { href: localePath(locale, ROUTES.DOWNLOADS), label: t('downloads') },
    { href: localePath(locale, ROUTES.DOCS), label: t('docs') },
    { href: localePath(locale, ROUTES.PRICING), label: t('pricing') },
  ]

  useEffect(() => { setMounted(true) }, [])

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

  function switchLocale() {
    const next = locale === 'en' ? 'vi' : 'en'
    // Replace the locale prefix in the current path
    const segments = pathname.split('/')
    segments[1] = next
    router.push(segments.join('/') || '/')
  }

  const tapStyle = { touchAction: 'manipulation' as const }
  const ThemeIcon = mounted ? (theme === 'dark' ? Sun : Moon) : Moon

  const AuthDesktop = user ? (
    <>
      {tier && tier.tierRank > 0 && (
        <Badge variant="outline" style={{ borderColor: tier.badgeColor, color: tier.badgeColor }}>
          {tier.badgeLabel}
        </Badge>
      )}
      <Link
        href={localePath(locale, ROUTES.PROFILE)}
        className="inline-flex min-h-[44px] min-w-[44px] items-center rounded-md px-3 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        style={tapStyle}
      >
        {user.name}
      </Link>
      <button
        className="inline-flex min-h-[44px] min-w-[44px] items-center rounded-md px-3 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        style={tapStyle}
        onClick={logout}
      >
        {t('signOut')}
      </button>
    </>
  ) : (
    <Link
      href={localePath(locale, ROUTES.AUTH_LOGIN)}
      className="inline-flex min-h-[44px] min-w-[44px] items-center rounded-md bg-[var(--accent)] px-3 text-sm font-medium text-[var(--bg-primary)] transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      style={tapStyle}
    >
      {t('getStarted')}
    </Link>
  )

  const AuthMobile = user ? (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 px-3 py-2">
        {tier && tier.tierRank > 0 && (
          <Badge variant="outline" style={{ borderColor: tier.badgeColor, color: tier.badgeColor }}>
            {tier.badgeLabel}
          </Badge>
        )}
        <span className="text-sm font-medium text-[var(--text-primary)]">{user.name}</span>
      </div>
      <Link
        href={localePath(locale, ROUTES.PROFILE)}
        className="flex min-h-[44px] items-center rounded-md px-3 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        style={tapStyle}
      >
        {t('profile')}
      </Link>
      <button
        className="flex min-h-[44px] w-full items-center rounded-md px-3 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        style={tapStyle}
        onClick={logout}
      >
        {t('signOut')}
      </button>
    </div>
  ) : (
    <div className="flex flex-col gap-2">
      <Link
        href={localePath(locale, ROUTES.AUTH_LOGIN)}
        className="flex min-h-[44px] items-center rounded-md bg-[var(--accent)] px-3 text-sm font-medium text-[var(--bg-primary)] transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        style={tapStyle}
      >
        {t('getStarted')}
      </Link>
    </div>
  )

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--bg-primary)]/90 backdrop-blur-sm">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
          <Link
            href={localePath(locale, ROUTES.HOME === '/' ? '' : ROUTES.HOME)}
            className="flex min-h-[44px] min-w-[44px] items-center gap-2 font-bold text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            style={tapStyle}
          >
            <span className="text-lg tracking-tight">Flyntic Studio</span>
          </Link>

          <ul className="hidden md:flex md:items-center md:gap-1" role="list">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={[
                    'inline-flex min-h-[44px] min-w-[44px] items-center rounded-md px-3 text-sm font-medium transition-colors',
                    'hover:bg-[var(--bg-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]',
                    pathname.includes(href) ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]',
                  ].join(' ')}
                  style={tapStyle}
                  aria-current={pathname.includes(href) ? 'page' : undefined}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex md:items-center md:gap-2">
            {/* Language switcher */}
            <button
              onClick={switchLocale}
              aria-label={`Switch to ${locale === 'en' ? 'Vietnamese' : 'English'}`}
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-md px-2 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              style={tapStyle}
            >
              <Globe size={16} />
              {routing.locales.map((l) => (
                <span key={l} className={l === locale ? 'text-[var(--text-primary)] font-semibold' : ''}>
                  {l.toUpperCase()}
                </span>
              )).reduce((acc, el, i) => i === 0 ? [el] : [...acc, <span key={`sep-${i}`} className="opacity-30">/</span>, el], [] as React.ReactNode[])}
            </button>
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              style={tapStyle}
            >
              <ThemeIcon size={20} />
            </button>
            {AuthDesktop}
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <button
              onClick={switchLocale}
              aria-label={`Switch to ${locale === 'en' ? 'Vietnamese' : 'English'}`}
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md text-xs font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              style={tapStyle}
            >
              <Globe size={16} />
            </button>
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              style={tapStyle}
            >
              <ThemeIcon size={20} />
            </button>
            <button
              onClick={() => setDrawerOpen(true)}
              aria-label={t('openMenu')}
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
              aria-label={t('menu')}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed inset-y-0 right-0 z-50 flex w-72 flex-col bg-[var(--bg-primary)] shadow-xl md:hidden"
            >
              <div className="flex h-16 items-center justify-between border-b border-[var(--border)] px-4">
                <span className="font-bold text-[var(--text-primary)]">{t('menu')}</span>
                <button
                  onClick={() => setDrawerOpen(false)}
                  aria-label={t('closeMenu')}
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  style={tapStyle}
                >
                  <X size={24} />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto px-4 py-4" aria-label="Mobile navigation">
                <ul className="flex flex-col gap-1" role="list">
                  {NAV_LINKS.map(({ href, label }) => (
                    <li key={`mobile-${href}`}>
                      <Link
                        href={href}
                        className={[
                          'flex min-h-[44px] items-center rounded-md px-3 text-sm font-medium transition-colors',
                          'hover:bg-[var(--bg-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]',
                          pathname.includes(href) ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)]' : 'text-[var(--text-secondary)]',
                        ].join(' ')}
                        style={tapStyle}
                        aria-current={pathname.includes(href) ? 'page' : undefined}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="border-t border-[var(--border)] px-4 py-4">
                {AuthMobile}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
