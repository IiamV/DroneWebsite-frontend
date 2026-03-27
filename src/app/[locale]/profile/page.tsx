import { mockUser, mockSubscription } from '@/mocks/user'
import { mockTiers } from '@/mocks/tiers'
import { ProfileCard } from '@/components/features/profile/ProfileCard'
import { TierBadge } from '@/components/features/profile/TierBadge'
import { SubscriptionStatus } from '@/components/features/profile/SubscriptionStatus'
import { setRequestLocale, getTranslations } from 'next-intl/server'

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'profile' })
  const tier = mockTiers.find((t) => t.id === mockSubscription.tierId) ?? mockTiers[0]

  return (
    <main className="max-w-2xl mx-auto px-4 py-12 space-y-6">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">{t('title')}</h1>
      <ProfileCard user={mockUser} locale={locale} />
      <TierBadge tier={tier} locale={locale} />
      <SubscriptionStatus subscription={mockSubscription} tier={tier} />
    </main>
  )
}
