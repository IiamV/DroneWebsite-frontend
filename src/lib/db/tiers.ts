import { createClient } from '@/lib/supabase/server'
import { toAppError } from '@/lib/fetch-utils'
import type { SubscriptionTier } from '@/types'

function rowToTier(row: Record<string, unknown>): SubscriptionTier {
  return {
    id: row.id as string,
    name: row.name as string,
    price: row.price as number,
    priceVnd: (row.price_vnd as number) ?? 0,
    billingCycle: (row.billing_cycle as SubscriptionTier['billingCycle']) ?? 'monthly',
    features: (row.features as string[]) ?? [],
    featuresVi: (row.features_vi as string[]) ?? [],
    downloadAccess: row.download_access as boolean,
    courseAccess: row.course_access as SubscriptionTier['courseAccess'],
    simulatorAccess: row.simulator_access as boolean,
    badgeColor: row.badge_color as string,
    badgeLabel: row.badge_label as string,
    tierRank: row.tier_rank as number,
  }
}

export async function getTiers(): Promise<SubscriptionTier[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('subscription_tiers')
      .select('*')
      .order('tier_rank', { ascending: true })

    if (error) throw new Error(error.message)
    return (data ?? []).map(rowToTier)
  } catch (err) {
    throw toAppError(err)
  }
}
