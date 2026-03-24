import { mockTiers } from '@/mocks/tiers'
import { SubscriptionPageClient } from '@/components/features/subscription/SubscriptionPageClient'
import { setRequestLocale } from 'next-intl/server'

export default async function SubscriptionPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  return <SubscriptionPageClient tiers={mockTiers} locale={locale} />
}
