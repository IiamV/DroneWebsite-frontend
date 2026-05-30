import { createClient } from '@/lib/supabase/server'
import { toAppError } from '@/lib/fetch-utils'
import type { Subscription, SubscriptionTier } from '@/types'

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

/** Get the active subscription for the currently authenticated user. Returns null if none. */
export async function getUserSubscription(): Promise<Subscription | null> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) throw new Error(error.message)
    return data ? rowToSubscription(data as Record<string, unknown>) : null
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

/** Create a new subscription for the authenticated user. */
export async function createSubscription(
  tierId: string,
  vnpayTransactionId: string | null = null
): Promise<Subscription> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const now = new Date()
    const end = new Date(now)
    end.setMonth(end.getMonth() + 1) // 1 month billing cycle

    // Cancel any existing active subscriptions first
    await (supabase
      .from('subscriptions') as any)
      .update({ status: 'cancelled' })
      .eq('user_id', user.id)
      .eq('status', 'active')

    const { data, error } = await (supabase
      .from('subscriptions') as any)
      .insert({
        user_id: user.id,
        tier_id: tierId,
        status: 'active',
        start_date: now.toISOString().split('T')[0],
        end_date: end.toISOString().split('T')[0],
        vnpay_transaction_id: vnpayTransactionId,
      })
      .select()
      .single()

    if (error || !data) throw new Error(error?.message ?? 'Failed to create subscription')
    return rowToSubscription(data as Record<string, unknown>)
  } catch (err) {
    throw toAppError(err)
  }
}

/** Cancel the active subscription for the authenticated user. */
export async function cancelSubscription(): Promise<void> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { error } = await (supabase
      .from('subscriptions') as any)
      .update({ status: 'cancelled' })
      .eq('user_id', user.id)
      .eq('status', 'active')

    if (error) throw new Error(error.message)
  } catch (err) {
    throw toAppError(err)
  }
}
