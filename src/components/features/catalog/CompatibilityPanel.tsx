'use client'

import Link from 'next/link'
import { Package } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'
import type { Product } from '@/types'
import { ROUTES, localePath } from '@/constants/routes'
import { CATEGORY_COLORS, CATEGORY_LABELS } from '@/constants/catalog'

interface CompatibilityPanelProps {
  compatibleProducts: Product[]
}

export function CompatibilityPanel({ compatibleProducts }: CompatibilityPanelProps) {
  const locale = useLocale()
  const t = useTranslations('catalog')
  if (compatibleProducts.length === 0) {
    return (
      <section aria-label="Compatible products">
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">{t('compatibleProducts')}</h2>
        <p className="text-[var(--text-secondary)] text-sm">{t('noCompatible')}</p>
      </section>
    )
  }

  return (
    <section aria-label="Compatible products">
      <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">
        {t('compatibleProducts')}
        <span className="ml-2 text-sm font-normal text-[var(--text-secondary)]">
          ({compatibleProducts.length})
        </span>
      </h2>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="list">
        {compatibleProducts.map((p) => (
          <li key={p.id}>
            <Link
              href={localePath(locale, `${ROUTES.CATALOG}/${p.slug}`)}
              className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-3 hover:border-[var(--accent)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] min-h-[44px]"
              style={{ touchAction: 'manipulation' }}
            >
              <div className="w-10 h-10 rounded bg-[var(--bg-primary)] flex items-center justify-center shrink-0 text-[var(--text-secondary)]">
                <Package size={18} aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-[var(--text-primary)] truncate">{p.name}</p>
                <Badge variant="outline" style={{ borderColor: CATEGORY_COLORS[p.category], color: CATEGORY_COLORS[p.category] }} className="mt-0.5">
                  {CATEGORY_LABELS[p.category]}
                </Badge>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
