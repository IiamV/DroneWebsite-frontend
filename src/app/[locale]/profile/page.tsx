import { redirect } from 'next/navigation'
import { mockTiers } from '@/mocks/tiers'
import { getTiers } from '@/lib/db/tiers'
import { getUserSubscription } from '@/lib/db/subscriptions'
import { createClient } from '@/lib/supabase/server'
import { ProfileCard } from '@/components/features/profile/ProfileCard'
import { TierBadge } from '@/components/features/profile/TierBadge'
import { SubscriptionStatus } from '@/components/features/profile/SubscriptionStatus'
import { CancelSubscriptionButton } from '@/components/features/profile/CancelSubscriptionButton'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { localePath, ROUTES } from '@/constants/routes'
import type { User } from '@/types'

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'profile' })

  // Require authentication
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser) {
    redirect(localePath(locale, ROUTES.AUTH_LOGIN))
  }

  // Build app user from auth user
  const user: User = {
    id: authUser.id,
    email: authUser.email ?? '',
    name: (authUser.user_metadata?.name as string) ?? authUser.email ?? 'User',
    avatarUrl: (authUser.user_metadata?.avatar_url as string) ?? null,
    passwordHash: '',
    subscriptionId: null,
    createdAt: new Date(authUser.created_at),
    updatedAt: new Date(authUser.updated_at ?? authUser.created_at),
  }

  // Load tiers and subscription
  let tiers = mockTiers
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) tiers = await getTiers()
  } catch { /* use mock */ }

  let subscription = null
  try {
    subscription = await getUserSubscription()
  } catch { /* no subscription */ }

  const freeTier = tiers.find((t) => t.tierRank === 0) ?? tiers[0]
  const tier = subscription
    ? (tiers.find((t) => t.id === subscription.tierId) ?? freeTier)
    : freeTier

  return (
    <main className="max-w-2xl mx-auto px-4 py-12 space-y-6">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">{t('title')}</h1>
      <ProfileCard user={user} locale={locale} />
      <TierBadge tier={tier} locale={locale} />
      {subscription ? (
        <>
          <SubscriptionStatus subscription={subscription} tier={tier} />
          <CancelSubscriptionButton locale={locale} />
        </>
      ) : (
        <div className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] text-center space-y-3">
          <p className="text-[var(--text-secondary)] text-sm">You&apos;re on the Free plan.</p>
          <a
            href={localePath(locale, ROUTES.SUBSCRIPTION)}
            className="inline-flex items-center justify-center min-h-[44px] px-5 py-2 rounded-lg bg-[var(--accent)] text-[var(--bg-primary)] text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Upgrade your plan
          </a>
        </div>
      )}
    </main>
  )
}
