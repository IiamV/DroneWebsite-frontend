import { getTranslations } from 'next-intl/server'
import { Badge } from '@/components/ui/badge'
import type { SubscriptionTier } from '@/types'

interface TierBadgeProps {
  tier: SubscriptionTier
  locale: string
}

export async function TierBadge({ tier, locale }: TierBadgeProps) {
  const t = await getTranslations({ locale, namespace: 'tierBadge' })

  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
      <span className="text-sm font-medium text-[var(--text-secondary)]">{t('currentPlan')}</span>
      <Badge variant="outline" style={{ borderColor: tier.badgeColor, color: tier.badgeColor }}>
        {tier.badgeLabel}
      </Badge>
    </div>
  )
}
