import { createAdminClient } from '@/lib/supabase/admin'
import type { Json, Tables, TablesInsert, TablesUpdate } from '@/types/database.types'
import type { Subscription, SubscriptionTier } from '@/types'

export type PaymentProvider = 'vnpay' | 'payos' | 'momo' | 'paypal'
export type PaymentOrderStatus = 'pending' | 'paid' | 'cancelled' | 'failed' | 'expired'
type PaymentOrderRow = Tables<'payment_orders'>
type PaymentOrderInsert = TablesInsert<'payment_orders'>
type PaymentOrderUpdate = TablesUpdate<'payment_orders'>
type SubscriptionRow = Tables<'subscriptions'>

export interface PaymentOrder {
  id: string
  provider: PaymentProvider
  userId: string
  tierId: string
  amountVnd: number
  amountUsd: number
  currency: string
  status: PaymentOrderStatus
  orderRef: string
  providerTransactionId: string | null
  checkoutUrl: string | null
  metadata: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
}

interface CreatePaymentOrderInput {
  provider: PaymentProvider
  userId: string
  tier: SubscriptionTier
  orderRef: string
  currency: string
  checkoutUrl?: string | null
  metadata?: Json
}

function rowToPaymentOrder(row: PaymentOrderRow): PaymentOrder {
  return {
    id: row.id as string,
    provider: row.provider as PaymentProvider,
    userId: row.user_id as string,
    tierId: row.tier_id as string,
    amountVnd: Number(row.amount_vnd ?? 0),
    amountUsd: Number(row.amount_usd ?? 0),
    currency: row.currency as string,
    status: row.status as PaymentOrderStatus,
    orderRef: row.order_ref as string,
    providerTransactionId: (row.provider_transaction_id as string | null) ?? null,
    checkoutUrl: (row.checkout_url as string | null) ?? null,
    metadata: typeof row.metadata === 'object' && row.metadata !== null && !Array.isArray(row.metadata)
      ? row.metadata as Record<string, unknown>
      : {},
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  }
}

function rowToSubscription(row: SubscriptionRow): Subscription {
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

export async function createPaymentOrder(input: CreatePaymentOrderInput): Promise<PaymentOrder> {
  const admin = createAdminClient()

  const payload: PaymentOrderInsert = {
    provider: input.provider,
    user_id: input.userId,
    tier_id: input.tier.id,
    amount_vnd: input.tier.priceVnd,
    amount_usd: input.tier.price,
    currency: input.currency,
    status: 'pending',
    order_ref: input.orderRef,
    checkout_url: input.checkoutUrl ?? null,
    metadata: input.metadata ?? {},
  }

  const { data, error } = await admin
    .from('payment_orders')
    .insert(payload)
    .select()
    .single()

  if (error || !data) throw new Error(error?.message ?? 'Failed to create payment order')
  return rowToPaymentOrder(data)
}

export async function setPaymentOrderCheckoutUrl(orderRef: string, checkoutUrl: string): Promise<void> {
  const admin = createAdminClient()
  const payload: PaymentOrderUpdate = { checkout_url: checkoutUrl, updated_at: new Date().toISOString() }
  const { error } = await admin
    .from('payment_orders')
    .update(payload)
    .eq('order_ref', orderRef)
    .eq('status', 'pending')

  if (error) throw new Error(error.message)
}

export async function markPaymentOrderCancelled(provider: PaymentProvider, orderRef: string): Promise<void> {
  const admin = createAdminClient()
  const payload: PaymentOrderUpdate = { status: 'cancelled', updated_at: new Date().toISOString() }
  const { error } = await admin
    .from('payment_orders')
    .update(payload)
    .eq('provider', provider)
    .eq('order_ref', orderRef)
    .eq('status', 'pending')

  if (error) throw new Error(error.message)
}

export async function activateSubscriptionForPaidOrder({
  provider,
  orderRef,
  providerTransactionId,
  amountVnd,
  amountUsd,
}: {
  provider: PaymentProvider
  orderRef: string
  providerTransactionId: string
  amountVnd?: number | null
  amountUsd?: number | null
}): Promise<Subscription> {
  const admin = createAdminClient()

  const { data, error } = await admin.rpc('activate_subscription_for_paid_order', {
    p_provider: provider,
    p_order_ref: orderRef,
    p_provider_transaction_id: providerTransactionId,
    p_amount_vnd: amountVnd ?? null,
    p_amount_usd: amountUsd ?? null,
  })

  if (error || !data) {
    throw new Error(error?.message ?? 'Failed to activate subscription')
  }

  return rowToSubscription(data as SubscriptionRow)
}
