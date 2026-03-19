import { Check } from 'lucide-react'
import type { Subscription, SubscriptionTier } from '@/types'
import { ROUTES } from '@/constants/routes'

interface SubscriptionStatusProps {
  subscription: Subscription
  tier: SubscriptionTier
}

const STATUS_STYLES: Record<Subscription['status'], string> = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  expired: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  cancelled: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
}

export function SubscriptionStatus({ subscription, tier }: SubscriptionStatusProps) {
  const statusLabel = subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)

  return (
    <div className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] space-y-4">
      <h3 className="text-base font-semibold text-[var(--text-primary)]">Subscription</h3>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-[var(--text-secondary)]">Plan</p>
          <p className="font-medium text-[var(--text-primary)] mt-0.5">{tier.name}</p>
        </div>
        <div>
          <p className="text-[var(--text-secondary)]">Status</p>
          <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[subscription.status]}`}>
            {statusLabel}
          </span>
        </div>
        <div>
          <p className="text-[var(--text-secondary)]">Started</p>
          <p className="font-medium text-[var(--text-primary)] mt-0.5">
            {subscription.startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </p>
        </div>
        <div>
          <p className="text-[var(--text-secondary)]">Renews</p>
          <p className="font-medium text-[var(--text-primary)] mt-0.5">
            {subscription.endDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="pt-2 border-t border-[var(--border)]">
        <p className="text-xs text-[var(--text-secondary)] mb-3">Included features</p>
        <ul className="space-y-1">
          {tier.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm text-[var(--text-primary)]">
              <Check size={14} className="text-green-500 shrink-0" aria-hidden="true" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <a
        href={ROUTES.SUBSCRIPTION}
        className="inline-block mt-2 text-sm font-medium text-[var(--accent)] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
      >
        Manage subscription →
      </a>
    </div>
  )
}
