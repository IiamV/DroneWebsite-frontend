import { Badge } from '@/components/ui/badge'
import type { SubscriptionTier } from '@/types'

interface TierBadgeProps {
  tier: SubscriptionTier
}

export function TierBadge({ tier }: TierBadgeProps) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
      <span className="text-sm font-medium text-[var(--text-secondary)]">Current plan</span>
      <Badge variant="outline" style={{ borderColor: tier.badgeColor, color: tier.badgeColor }}>
        {tier.badgeLabel}
      </Badge>
    </div>
  )
}
