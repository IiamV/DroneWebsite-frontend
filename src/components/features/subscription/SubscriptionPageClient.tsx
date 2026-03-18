'use client'

import { useRouter } from 'next/navigation'
import { TierComparisonTable } from './TierComparisonTable'
import type { SubscriptionTier } from '@/types'
import { ROUTES } from '@/constants/routes'

interface SubscriptionPageClientProps {
  tiers: SubscriptionTier[]
}

export function SubscriptionPageClient({ tiers }: SubscriptionPageClientProps) {
  const router = useRouter()

  function handleSelectTier(tier: SubscriptionTier) {
    if (tier.price === 0) return
    router.push(`${ROUTES.SUBSCRIPTION_CHECKOUT}?tierId=${tier.id}`)
  }

  return <TierComparisonTable tiers={tiers} onSelectTier={handleSelectTier} />
}
