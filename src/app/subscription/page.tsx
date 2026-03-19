import { mockTiers } from '@/mocks/tiers'
import { SubscriptionPageClient } from '@/components/features/subscription/SubscriptionPageClient'

export default function SubscriptionPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-[var(--text-primary)] mb-3">
          Choose your plan
        </h1>
        <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
          Unlock simulation tools, advanced courses, and downloadable software with a paid subscription.
        </p>
      </div>
      <SubscriptionPageClient tiers={mockTiers} />
    </main>
  )
}
