'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { TierComparisonTable } from './TierComparisonTable'
import type { SubscriptionTier } from '@/types'
import { ROUTES } from '@/constants/routes'

interface SubscriptionPageClientProps {
  tiers: SubscriptionTier[]
  locale: string
}

export function SubscriptionPageClient({ tiers, locale }: SubscriptionPageClientProps) {
  const router = useRouter()
  const t = useTranslations('pricing')

  function handleSelectTier(tier: SubscriptionTier) {
    if (tier.price === 0) return
    router.push(`${ROUTES.SUBSCRIPTION_CHECKOUT}/${tier.id}`)
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-[var(--text-primary)] mb-3">
          {t('title')}
        </h1>
        <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
          {t('subtitle')}
        </p>
      </div>
      <TierComparisonTable tiers={tiers} onSelectTier={handleSelectTier} locale={locale} />
    </main>
  )
}
