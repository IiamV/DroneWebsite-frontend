'use client'

import { Check } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { SubscriptionTier } from '@/types'

interface TierComparisonTableProps {
  tiers: SubscriptionTier[]
  currentTierId?: string
  onSelectTier?: (tier: SubscriptionTier) => void
  locale?: string
}

export function TierComparisonTable({ tiers, currentTierId, onSelectTier, locale }: TierComparisonTableProps) {
  const t = useTranslations('pricing')
  const isVi = locale === 'vi'

  function formatPrice(tier: SubscriptionTier) {
    if (tier.price === 0) return t('free')
    if (isVi) {
      return new Intl.NumberFormat('vi-VN').format(tier.priceVnd) + '₫'
    }
    return `$${tier.price.toFixed(2)}`
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
      {tiers.map((tier) => {
        const isCurrent = tier.id === currentTierId
        const isPro = tier.id === 'pro'

        return (
          <div key={tier.id} className={isPro ? 'relative p-[2px] rounded-xl rainbow-border' : ''}>
            {isPro && (
              <style>{`
                @keyframes rainbow-spin {
                  0%   { background-position: 0% 50%; }
                  50%  { background-position: 100% 50%; }
                  100% { background-position: 0% 50%; }
                }
                .rainbow-border {
                  background: linear-gradient(270deg, #ff0080, #ff8c00, #ffe600, #00ff80, #00cfff, #a855f7, #ff0080);
                  background-size: 400% 400%;
                  animation: rainbow-spin 4s ease infinite;
                }
              `}</style>
            )}

            <div
              className={[
                'flex flex-col rounded-xl border p-6 h-full',
                isPro
                  ? 'bg-[var(--bg-primary)] border-transparent'
                  : isCurrent
                  ? 'border-[var(--accent)]'
                  : 'border-[var(--border)]',
              ].join(' ')}
            >
              {isPro && (
                <div className="text-center mb-3">
                  <span className="text-xs font-semibold uppercase tracking-widest bg-gradient-to-r from-pink-500 via-yellow-400 to-purple-500 bg-clip-text text-transparent">
                    {t('mostPopular')}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-[var(--text-primary)]">{tier.name}</h3>
                <Badge variant="outline" style={{ borderColor: tier.badgeColor, color: tier.badgeColor }}>
                  {tier.badgeLabel}
                </Badge>
              </div>

              <div className="mb-4">
                <span className="text-3xl font-extrabold text-[var(--text-primary)]">
                  {formatPrice(tier)}
                </span>
                {tier.price > 0 && (
                  <span className="text-sm text-[var(--text-secondary)] ml-1">
                    {t('perMonth')}
                  </span>
                )}
              </div>

              <ul className="flex-1 space-y-2 mb-6">
                {(isVi ? tier.featuresVi : tier.features).map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
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
                  {isCurrent ? t('currentPlan') : tier.price === 0 ? t('getStarted') : t('subscribe')}
                </Button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
