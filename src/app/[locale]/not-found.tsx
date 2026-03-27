'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { localePath } from '@/constants/routes'

export default function NotFound() {
  const t = useTranslations('notFound')
  const locale = useLocale()

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
      <div className="text-center px-6 max-w-md">
        <div className="text-8xl font-bold text-[var(--accent)] mb-4">404</div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">{t('title')}</h1>
        <p className="text-[var(--text-secondary)] mb-6">{t('subtitle')}</p>
        <Link
          href={localePath(locale, '')}
          className="inline-block px-6 py-2 bg-[var(--accent)] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
        >
          {t('back')}
        </Link>
      </div>
    </div>
  )
}
