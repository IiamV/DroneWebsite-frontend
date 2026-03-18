import Link from 'next/link'
import { ROUTES } from '@/constants/routes'

const FOOTER_LINKS = [
  {
    heading: 'Platform',
    links: [
      { href: ROUTES.COURSES, label: 'Courses' },
      { href: ROUTES.CATALOG, label: 'Product Catalog' },
      { href: ROUTES.DOWNLOADS, label: 'Downloads' },
      { href: ROUTES.DOCS, label: 'Documentation' },
    ],
  },
  {
    heading: 'Account',
    links: [
      { href: ROUTES.AUTH_LOGIN, label: 'Sign in' },
      { href: ROUTES.AUTH_REGISTER, label: 'Register' },
      { href: ROUTES.SUBSCRIPTION, label: 'Subscription' },
      { href: ROUTES.PROFILE, label: 'Profile' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-primary)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <Link
              href={ROUTES.HOME}
              className="text-lg font-bold text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              DroneSimPlatform
            </Link>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Learn, simulate, and build drone configurations.
            </p>
          </div>

          {/* Link columns */}
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
          © {new Date().getFullYear()} DroneSimPlatform. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
