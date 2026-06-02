import { getTiers } from '@/lib/db/tiers'
import { SubscriptionPageClient } from '@/components/features/subscription/SubscriptionPageClient'
import { setRequestLocale } from 'next-intl/server'
import { unstable_noStore as noStore } from 'next/cache'
import { getCurrentTierForRequest } from '@/lib/subscription-guard'

export const dynamic = 'force-dynamic'

export default async function SubscriptionPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  noStore()
  const { locale } = await params
  setRequestLocale(locale)

  const tiers = await getTiers()
  const currentTier = await getCurrentTierForRequest(tiers)

  return <SubscriptionPageClient tiers={tiers} locale={locale} currentTierId={currentTier?.id ?? null} />
}
