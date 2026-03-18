import Link from 'next/link'

interface DocBreadcrumbProps {
  slug: string[]
}

export function DocBreadcrumb({ slug }: DocBreadcrumbProps) {
  const crumbs = slug.map((segment, i) => ({
    label: segment
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' '),
    href: '/docs/' + slug.slice(0, i + 1).join('/'),
    isLast: i === slug.length - 1,
  }))

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-[var(--text-secondary)]">
        <li>
          <Link
            href="/docs"
            className="hover:text-[var(--text-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
          >
            Docs
          </Link>
        </li>
        {crumbs.map((crumb) => (
          <li key={crumb.href} className="flex items-center gap-1">
            <span aria-hidden="true" className="opacity-40">
              /
            </span>
            {crumb.isLast ? (
              <span aria-current="page" className="text-[var(--text-primary)] font-medium">
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="hover:text-[var(--text-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
              >
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
