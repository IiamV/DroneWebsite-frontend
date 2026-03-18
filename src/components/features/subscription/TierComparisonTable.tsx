'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { SubscriptionTier } from '@/types'

interface TierComparisonTableProps {
  tiers: SubscriptionTier[]
  currentTierId?: string
  onSelectTier?: (tier: SubscriptionTier) => void
}

export function TierComparisonTable({
  tiers,
  currentTierId,
  onSelectTier,
}: TierComparisonTableProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {tiers.map((tier, i) => {
        const isCurrent = tier.id === currentTierId
        return (
          <motion.div
            key={tier.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={[
              'flex flex-col rounded-xl border p-6',
              isCurrent
                ? 'border-[var(--accent)] bg-[var(--bg-secondary)]'
                : 'border-[var(--border)] bg-[var(--bg-primary)]',
            ].join(' ')}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-[var(--text-primary)]">{tier.name}</h3>
              <Badge color={tier.badgeColor} label={tier.badgeLabel} />
            </div>

            {/* Price */}
            <div className="mb-4">
              {tier.price === 0 ? (
                <span className="text-3xl font-extrabold text-[var(--text-primary)]">Free</span>
              ) : (
                <>
                  <span className="text-3xl font-extrabold text-[var(--text-primary)]">
                    ${tier.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-[var(--text-secondary)] ml-1">
                    /{tier.billingCycle === 'monthly' ? 'mo' : 'yr'}
                  </span>
                </>
              )}
            </div>

            {/* Features */}
            <ul className="flex-1 space-y-2 mb-6">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                  <span className="mt-0.5 text-green-500 shrink-0">✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            {/* CTA */}
            {onSelectTier && (
              <Button
                variant={isCurrent ? 'secondary' : 'primary'}
                disabled={isCurrent}
                onClick={() => onSelectTier(tier)}
                className="w-full"
              >
                {isCurrent ? 'Current plan' : tier.price === 0 ? 'Get started' : 'Subscribe'}
              </Button>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}
