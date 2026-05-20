import { mockTiers } from '@/mocks/tiers'
import { getTiers } from '@/lib/db/tiers'
import { SubscriptionPageClient } from '@/components/features/subscription/SubscriptionPageClient'
import { setRequestLocale } from 'next-intl/server'

export default async function SubscriptionPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  let tiers = mockTiers
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      tiers = await getTiers()
    }
  } catch { /* use mock */ }

  return <SubscriptionPageClient tiers={tiers} locale={locale} />
}
