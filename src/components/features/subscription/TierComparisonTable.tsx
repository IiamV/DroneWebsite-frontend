'use client'

import { Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { SubscriptionTier } from '@/types'

interface TierComparisonTableProps {
  tiers: SubscriptionTier[]
  currentTierId?: string
  onSelectTier?: (tier: SubscriptionTier) => void
}

export function TierComparisonTable({ tiers, currentTierId, onSelectTier }: TierComparisonTableProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {tiers.map((tier) => {
        const isCurrent = tier.id === currentTierId
        return (
          <div
            key={tier.id}
            className={[
              'flex flex-col rounded-xl border p-6',
              isCurrent ? 'border-primary' : 'border-border',
            ].join(' ')}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold">{tier.name}</h3>
              <Badge variant="outline" style={{ borderColor: tier.badgeColor, color: tier.badgeColor }}>
                {tier.badgeLabel}
              </Badge>
            </div>

            <div className="mb-4">
              {tier.price === 0 ? (
                <span className="text-3xl font-extrabold">Free</span>
              ) : (
                <>
                  <span className="text-3xl font-extrabold">${tier.price.toFixed(2)}</span>
                  <span className="text-sm text-muted-foreground ml-1">/{tier.billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                </>
              )}
            </div>

            <ul className="flex-1 space-y-2 mb-6">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check size={14} className="mt-0.5 text-green-500 shrink-0" aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>

            {onSelectTier && (
              <Button
                variant={isCurrent ? 'secondary' : 'default'}
                disabled={isCurrent}
                onClick={() => onSelectTier(tier)}
                className="w-full"
              >
                {isCurrent ? 'Current plan' : tier.price === 0 ? 'Get started' : 'Subscribe'}
              </Button>
            )}
          </div>
        )
      })}
    </div>
  )
}
