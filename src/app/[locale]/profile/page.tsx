import { redirect } from 'next/navigation'
import { getTiers } from '@/lib/db/tiers'
import { getUserSubscription } from '@/lib/db/subscriptions'
import { getCompletedCourses } from '@/lib/db/course-progress'
import { createClient } from '@/lib/supabase/server'
import { ProfileCard } from '@/components/features/profile/ProfileCard'
import { TierBadge } from '@/components/features/profile/TierBadge'
import { SubscriptionStatus } from '@/components/features/profile/SubscriptionStatus'
import { CancelSubscriptionButton } from '@/components/features/profile/CancelSubscriptionButton'
import { EmailConfirmationStatus } from '@/components/features/profile/EmailConfirmationStatus'
import { AccountSettings } from '@/components/features/profile/AccountSettings'
import { CompletedCourses } from '@/components/features/profile/CompletedCourses'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { localePath, ROUTES } from '@/constants/routes'
import type { CompletedCourse, User } from '@/types'

export default async function ProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ payment?: string }>
}) {
  const { locale } = await params
  const { payment } = await searchParams
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'profile' })

  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser) {
    redirect(localePath(locale, ROUTES.AUTH_LOGIN))
  }

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

  const tiers = await getTiers()
  let completedCourses: CompletedCourse[] = []
  try {
    completedCourses = await getCompletedCourses(locale)
  } catch { /* completed courses are optional profile metadata */ }

  let subscription = null
  try {
    subscription = await getUserSubscription()
  } catch { /* no subscription */ }

  const freeTier = tiers.find((t) => t.tierRank === 0) ?? tiers[0]
  const tier = subscription
    ? (tiers.find((t) => t.id === subscription.tierId) ?? freeTier)
    : freeTier

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {payment === 'success' && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-green-500/20 bg-green-500/10 p-4">
          <span className="text-green-500 text-lg" aria-hidden="true">✓</span>
          <div>
            <p className="text-sm font-semibold text-green-600 dark:text-green-400">{t('paymentSuccess')}</p>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">{t('subscriptionActivated')}</p>
          </div>
        </div>
      )}

      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">{t('workspace')}</p>
        <h1 className="mt-1 text-3xl font-extrabold text-[var(--text-primary)]">{t('title')}</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--text-secondary)]">{t('subtitle')}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="space-y-6">
          <ProfileCard user={user} locale={locale} />
          <CompletedCourses courses={completedCourses} locale={locale} />
          <AccountSettings />
        </section>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <EmailConfirmationStatus
            email={authUser.email ?? ''}
            confirmed={!!authUser.email_confirmed_at}
          />
          <TierBadge tier={tier} locale={locale} />
          {subscription ? (
            <>
              <SubscriptionStatus subscription={subscription} tier={tier} />
              <CancelSubscriptionButton locale={locale} />
            </>
          ) : (
            <div className="space-y-3 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-6 text-center">
              <p className="text-sm text-[var(--text-secondary)]">{t('freePlan')}</p>
              <a
                href={localePath(locale, ROUTES.SUBSCRIPTION)}
                className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-[var(--bg-primary)] transition-opacity hover:opacity-90"
              >
                {t('upgradePlan')}
              </a>
            </div>
          )}
        </aside>
      </div>
    </main>
  )
}
