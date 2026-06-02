import { createClient } from '@/lib/supabase/server'
import { getUserSubscription } from '@/lib/db/subscriptions'
import type { SubscriptionTier } from '@/types'

export interface SubscriptionGuardResult {
  userId: string | null
  currentTier: SubscriptionTier | null
  currentTierId: string | null
  currentTierRank: number
  canPurchase: boolean
  reason: 'not_authenticated' | 'allowed' | 'current_or_lower'
}

export async function getSubscriptionGuard(
  targetTier: SubscriptionTier,
  tiers: SubscriptionTier[]
): Promise<SubscriptionGuardResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return {
      userId: null,
      currentTier: null,
      currentTierId: null,
      currentTierRank: -1,
      canPurchase: false,
      reason: 'not_authenticated',
    }
  }

  const freeTier = tiers.find((tier) => tier.tierRank === 0) ?? null
  const subscription = await getUserSubscription()
  const currentTier = subscription
    ? tiers.find((tier) => tier.id === subscription.tierId) ?? freeTier
    : freeTier
  const currentTierRank = currentTier?.tierRank ?? 0
  const canPurchase = targetTier.tierRank > currentTierRank

  return {
    userId: user.id,
    currentTier,
    currentTierId: currentTier?.id ?? null,
    currentTierRank,
    canPurchase,
    reason: canPurchase ? 'allowed' : 'current_or_lower',
  }
}

export async function getCurrentTierForRequest(tiers: SubscriptionTier[]): Promise<SubscriptionTier | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const subscription = await getUserSubscription()
  if (subscription) return tiers.find((tier) => tier.id === subscription.tierId) ?? null
  return tiers.find((tier) => tier.tierRank === 0) ?? null
}
