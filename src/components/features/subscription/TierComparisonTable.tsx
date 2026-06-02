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

type ComparisonValue = boolean | string

export function TierComparisonTable({ tiers, currentTierId, onSelectTier, locale }: TierComparisonTableProps) {
  const t = useTranslations('pricing')
  const isVi = locale === 'vi'
  const sortedTiers = [...tiers].sort((a, b) => a.tierRank - b.tierRank)
  const currentTier = currentTierId ? sortedTiers.find((tier) => tier.id === currentTierId) : null

  function formatPrice(tier: SubscriptionTier) {
    if (tier.price === 0) return t('free')
    if (isVi) {
      return new Intl.NumberFormat('vi-VN').format(tier.priceVnd) + '₫'
    }
    return `$${tier.price.toFixed(2)}`
  }

  const comparisonRows = [
    {
      key: 'downloadAccess',
      label: t('downloadAccess'),
      value: (tier: SubscriptionTier) => tier.downloadAccess,
    },
    {
      key: 'courseAccess',
      label: t('courseAccess'),
      value: (tier: SubscriptionTier) => tier.courseAccess === 'full'
        ? t('fullAccess')
        : tier.courseAccess === 'basic'
          ? t('basicAccess')
          : t('noAccess'),
    },
    {
      key: 'simulatorAccess',
      label: t('simulatorAccess'),
      value: (tier: SubscriptionTier) => tier.simulatorAccess,
    },
    {
      key: 'seats',
      label: t('seats'),
      value: (tier: SubscriptionTier) => {
        if (tier.id === 'campus') return '50'
        if (tier.id === 'team') return '5'
        return '1'
      },
    },
    {
      key: 'support',
      label: t('support'),
      value: (tier: SubscriptionTier) => {
        if (tier.id === 'campus') return t('slaSupport')
        if (tier.id === 'team') return t('dedicatedSupport')
        if (tier.id === 'pro') return t('prioritySupport')
        return t('communitySupport')
      },
    },
  ]

  function renderComparisonValue(value: ComparisonValue) {
    if (typeof value === 'string') return <span>{value}</span>
    return value ? (
      <span className="inline-flex items-center gap-1 font-medium text-green-600">
        <Check size={16} aria-hidden="true" />
        {t('included')}
      </span>
    ) : (
      <span className="text-[var(--text-secondary)]">-</span>
    )
  }

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
      {sortedTiers.map((tier) => {
        const isCurrent = tier.id === currentTierId
        const isIncludedInCurrentPlan = Boolean(currentTier && tier.tierRank < currentTier.tierRank)
        const isFreePlan = tier.price === 0
        const isUnavailable = isCurrent || isIncludedInCurrentPlan || isFreePlan
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
                  variant={isUnavailable ? 'secondary' : 'default'}
                  disabled={isUnavailable}
                  onClick={() => onSelectTier(tier)}
                  className="w-full"
                >
                  {isCurrent
                    ? t('currentPlan')
                    : isIncludedInCurrentPlan
                      ? t('includedInCurrentPlan')
                      : isFreePlan
                        ? t('getStarted')
                        : t('subscribe')}
                </Button>
              )}
            </div>
          </div>
        )
      })}
      </div>

      <section aria-labelledby="plan-comparison-heading">
        <div className="mb-4">
          <h2 id="plan-comparison-heading" className="text-2xl font-bold text-[var(--text-primary)]">
            {t('compareTitle')}
          </h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">{t('compareSubtitle')}</p>
        </div>

        <div className="overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)]">
          <table className="min-w-[760px] w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg-primary)]">
                <th scope="col" className="w-[260px] px-4 py-4 text-left font-semibold text-[var(--text-primary)]">
                  {t('feature')}
                </th>
                {sortedTiers.map((tier) => (
                  <th key={tier.id} scope="col" className="px-4 py-4 text-left font-semibold text-[var(--text-primary)]">
                    <span className="block">{tier.name}</span>
                    <span className="mt-1 block text-xs font-normal text-[var(--text-secondary)]">
                      {formatPrice(tier)}{tier.price > 0 ? ` ${t('perMonth')}` : ''}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.key} className="border-b border-[var(--border)] last:border-b-0">
                  <th scope="row" className="px-4 py-3 text-left font-medium text-[var(--text-primary)]">
                    {row.label}
                  </th>
                  {sortedTiers.map((tier) => (
                    <td key={tier.id} className="px-4 py-3 text-[var(--text-secondary)]">
                      {renderComparisonValue(row.value(tier))}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
