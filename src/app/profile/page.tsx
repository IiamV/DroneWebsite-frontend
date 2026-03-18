import { mockUser, mockSubscription } from '@/mocks/user'
import { mockTiers } from '@/mocks/tiers'
import { ProfileCard } from '@/components/features/profile/ProfileCard'
import { TierBadge } from '@/components/features/profile/TierBadge'
import { SubscriptionStatus } from '@/components/features/profile/SubscriptionStatus'

export default function ProfilePage() {
  const tier = mockTiers.find((t) => t.id === mockSubscription.tierId) ?? mockTiers[0]

  return (
    <main className="max-w-2xl mx-auto px-4 py-12 space-y-6">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">My Profile</h1>
      <ProfileCard user={mockUser} />
      <TierBadge tier={tier} />
      <SubscriptionStatus subscription={mockSubscription} tier={tier} />
    </main>
  )
}
