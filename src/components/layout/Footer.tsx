'use client'

import Link from 'next/link'
import { Facebook, Instagram } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { ROUTES, localePath } from '@/constants/routes'

function DiscordIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M19.27 5.33A16.9 16.9 0 0 0 15.07 4l-.2.4c-.1.2-.2.43-.3.64a15.8 15.8 0 0 0-5.14 0 8.3 8.3 0 0 0-.5-1.04 16.76 16.76 0 0 0-4.2 1.33C2.07 9.23 1.34 13.03 1.7 16.78a16.96 16.96 0 0 0 5.15 2.62c.41-.56.78-1.15 1.1-1.77-.6-.23-1.16-.5-1.7-.82l.42-.33c3.27 1.52 6.82 1.52 10.05 0 .14.12.28.23.43.33-.54.32-1.11.6-1.71.82.32.62.69 1.21 1.1 1.77a16.9 16.9 0 0 0 5.16-2.62c.43-4.35-.73-8.11-2.43-11.45ZM8.52 14.5c-.99 0-1.8-.91-1.8-2.03 0-1.12.8-2.03 1.8-2.03 1 0 1.82.92 1.8 2.03 0 1.12-.8 2.03-1.8 2.03Zm6.96 0c-.99 0-1.8-.91-1.8-2.03 0-1.12.8-2.03 1.8-2.03 1 0 1.82.92 1.8 2.03 0 1.12-.8 2.03-1.8 2.03Z" />
    </svg>
  )
}

export function Footer() {
  const t = useTranslations('footer')
  const locale = useLocale()

  const FOOTER_LINKS = [
    {
      heading: t('platform'),
      links: [
        { href: localePath(locale, ROUTES.COURSES), label: t('courses') },
        { href: localePath(locale, ROUTES.CATALOG), label: t('catalog') },
        { href: localePath(locale, ROUTES.DOWNLOADS), label: t('downloads') },
        { href: localePath(locale, ROUTES.DOCS), label: t('docs') },
        { href: localePath(locale, ROUTES.UPDATES), label: t('updates') },
        { href: localePath(locale, ROUTES.FAQ), label: t('faq') },
      ],
    },
    {
      heading: t('account'),
      links: [
        { href: localePath(locale, ROUTES.AUTH_LOGIN), label: t('signIn') },
        { href: localePath(locale, ROUTES.AUTH_REGISTER), label: t('register') },
        { href: localePath(locale, ROUTES.SUBSCRIPTION), label: t('subscription') },
        { href: localePath(locale, ROUTES.PROFILE), label: t('profile') },
      ],
    },
  ]

  const SOCIAL_LINKS = [
    { href: 'https://facebook.com/FlynticStudio', label: t('facebook'), icon: Facebook },
    { href: 'https://instagram.com/FlynticStudio', label: t('instagram'), icon: Instagram },
    { href: 'https://discord.gg/FlynticStudio', label: t('discord'), icon: DiscordIcon },
  ]

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-primary)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link
              href={localePath(locale, '')}
              className="text-lg font-bold text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              Flyntic Studio
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

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              {t('social')}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
              {t('follow')}
            </p>
            <ul className="mt-4 flex flex-wrap gap-2" role="list">
              {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[var(--border)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  >
                    <Icon size={18} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-[var(--border)] pt-6 text-center text-xs text-[var(--text-secondary)]">
          © {new Date().getFullYear()} DroneSimPlatform. {t('rights')}
        </div>
      </div>
    </footer>
  )
}
