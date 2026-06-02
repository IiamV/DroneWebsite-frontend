'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Subscription, SubscriptionTier } from '@/types'

interface UseSubscriptionResult {
  subscription: Subscription | null
  tier: SubscriptionTier | null
  tierRank: number
  loading: boolean
  hasAccess: (requiredTierId: string, allTiers: SubscriptionTier[]) => boolean
  refetch: () => void
}

function rowToSubscription(row: Record<string, unknown>): Subscription {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    tierId: row.tier_id as string,
    status: row.status as Subscription['status'],
    startDate: new Date(row.start_date as string),
    endDate: new Date(row.end_date as string),
    vnpayTransactionId: (row.vnpay_transaction_id as string | null) ?? null,
    createdAt: new Date(row.created_at as string),
  }
}

export function useSubscription(allTiers: SubscriptionTier[]): UseSubscriptionResult {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const supabase = createClient()
    let cancelled = false

    async function fetch() {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || cancelled) { setLoading(false); return }

      const { data } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (!cancelled) {
        setSubscription(data ? rowToSubscription(data as Record<string, unknown>) : null)
        setLoading(false)
      }
    }

    fetch()

    // Re-fetch when auth state changes
    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange(() => {
      if (!cancelled) fetch()
    })

    return () => {
      cancelled = true
      authSub.unsubscribe()
    }
  }, [tick]) // eslint-disable-line react-hooks/exhaustive-deps

  const tier = subscription
    ? allTiers.find((t) => t.id === subscription.tierId) ?? null
    : null

  const tierRank = tier?.tierRank ?? 0

  function hasAccess(requiredTierId: string, tiers: SubscriptionTier[]): boolean {
    if (requiredTierId === 'free') return true
    const required = tiers.find((t) => t.id === requiredTierId)
    if (!required) return false
    return tierRank >= required.tierRank
  }

  return {
    subscription,
    tier,
    tierRank,
    loading,
    hasAccess,
    refetch: () => setTick((n) => n + 1),
  }
}
