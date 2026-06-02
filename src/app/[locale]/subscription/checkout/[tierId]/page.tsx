import { getTiers } from '@/lib/db/tiers'
import { CheckoutForm } from '@/components/features/subscription/CheckoutForm'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getSubscriptionGuard } from '@/lib/subscription-guard'
import { localePath, ROUTES } from '@/constants/routes'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface CheckoutPageProps {
  params: Promise<{ locale: string; tierId: string }>
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { locale, tierId } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'checkout' })

  const tiers = await getTiers()
  const tier = tiers.find((t) => t.id === tierId)

  if (!tier || tier.price === 0) {
    return (
      <main className="max-w-md mx-auto px-4 py-12 text-center">
        <p className="text-[var(--text-secondary)]">{t('planNotFound')}</p>
      </main>
    )
  }

  const guard = await getSubscriptionGuard(tier, tiers)
  if (guard.userId && !guard.canPurchase) {
    return (
      <main className="max-w-md mx-auto px-4 py-12 text-center">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] p-6 shadow-sm">
          <p className="mb-5 text-[var(--text-secondary)]">
            {t('alreadyOnPlan', { plan: guard.currentTier?.name ?? t('currentPlan') })}
          </p>
          <Button asChild>
            <Link href={localePath(locale, ROUTES.PRICING)}>{t('backToPricing')}</Link>
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-md mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-extrabold text-[var(--text-primary)]">{t('title')}</h1>
          <Badge variant="outline" style={{ borderColor: tier.badgeColor, color: tier.badgeColor }}>
            {tier.badgeLabel}
          </Badge>
        </div>
        <p className="text-[var(--text-secondary)] text-sm">
          {t('subscribingTo', { plan: tier.name })}
        </p>
      </div>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] p-6 shadow-sm">
        <CheckoutForm tier={tier} locale={locale} />
      </div>
    </main>
  )
}
