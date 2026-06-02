import { createClient } from '@/lib/supabase/server'
import { toAppError } from '@/lib/fetch-utils'
import type { Tables, TablesUpdate } from '@/types/database.types'
import type { Subscription, SubscriptionTier } from '@/types'

type SubscriptionRow = Tables<'subscriptions'>
type SubscriptionUpdate = TablesUpdate<'subscriptions'>

function rowToSubscription(row: SubscriptionRow): Subscription {
  return {
    id: row.id,
    userId: row.user_id,
    tierId: row.tier_id,
    status: row.status as Subscription['status'],
    startDate: new Date(row.start_date),
    endDate: new Date(row.end_date),
    vnpayTransactionId: row.vnpay_transaction_id,
    createdAt: new Date(row.created_at),
  }
}

/** Get the active subscription for the currently authenticated user. Returns null if none. */
export async function getUserSubscription(): Promise<Subscription | null> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase.rpc('refresh_user_subscription_status', {
      p_user_id: user.id,
    })

    if (error) throw new Error(error.message)
    return data ? rowToSubscription(data) : null
  } catch (err) {
    throw toAppError(err)
  }
}

/** Get the tier for the currently authenticated user. Returns the free tier if no active subscription. */
export async function getUserTier(allTiers: SubscriptionTier[]): Promise<SubscriptionTier> {
  const freeTier = allTiers.find((t) => t.tierRank === 0) ?? allTiers[0]
  try {
    const sub = await getUserSubscription()
    if (!sub) return freeTier
    return allTiers.find((t) => t.id === sub.tierId) ?? freeTier
  } catch {
    return freeTier
  }
}

/** Cancel the active subscription for the authenticated user. */
export async function cancelSubscription(): Promise<void> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const payload: SubscriptionUpdate = { status: 'cancelled' }
    const { error } = await supabase
      .from('subscriptions')
      .update(payload)
      .eq('user_id', user.id)
      .eq('status', 'active')

    if (error) throw new Error(error.message)
  } catch (err) {
    throw toAppError(err)
  }
}
