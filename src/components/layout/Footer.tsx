'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ROUTES } from '@/constants/routes'

export function Footer() {
  const t = useTranslations('footer')

  const FOOTER_LINKS = [
    {
      heading: t('platform'),
      links: [
        { href: ROUTES.COURSES, label: t('courses') },
        { href: ROUTES.CATALOG, label: t('catalog') },
        { href: ROUTES.DOWNLOADS, label: t('downloads') },
        { href: ROUTES.DOCS, label: t('docs') },
      ],
    },
    {
      heading: t('account'),
      links: [
        { href: ROUTES.AUTH_LOGIN, label: t('signIn') },
        { href: ROUTES.AUTH_REGISTER, label: t('register') },
        { href: ROUTES.SUBSCRIPTION, label: t('subscription') },
        { href: ROUTES.PROFILE, label: t('profile') },
      ],
    },
  ]

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-primary)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <Link
              href={ROUTES.HOME}
              className="text-lg font-bold text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              DroneSimPlatform
            </Link>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">{t('tagline')}</p>
          </div>

          {FOOTER_LINKS.map(({ heading, links }) => (
            <div key={heading}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                {heading}
              </h3>
              <ul className="mt-3 flex flex-col gap-2" role="list">
                {links.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-[var(--border)] pt-6 text-center text-xs text-[var(--text-secondary)]">
          © {new Date().getFullYear()} DroneSimPlatform. {t('rights')}
        </div>
      </div>
    </footer>
  )
}
