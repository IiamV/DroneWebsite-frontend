import { NextRequest, NextResponse } from 'next/server'
import { verifyParams } from '@/lib/vnpay'
import { createAdminClient } from '@/lib/supabase/admin'
import { mockTiers } from '@/mocks/tiers'
import { getTiers } from '@/lib/db/tiers'

/**
 * IPN (Instant Payment Notification) — called server-to-server by VNPay.
 * This is where we actually activate the subscription.
 *
 * Must respond with JSON { RspCode, Message } per VNPay docs.
 * RspCode "00" = success, "02" = already processed, "97" = bad signature, etc.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = Object.fromEntries(searchParams.entries()) as Record<string, string>

  // 1. Verify HMAC signature
  const result = verifyParams(query)
  if (!result.isSuccess) {
    console.error('[IPN] Verification failed:', result.message)
    return NextResponse.json({ RspCode: '97', Message: 'Invalid signature' }, { status: 200 })
  }

  const orderRef = result.orderRef ?? ''
  // orderRef format: tierId + userId8chars + timestamp
  // Extract tierId — it's everything before the 8-char userId segment
  // We stored it as: pro + abc12345 + 1234567890123
  // Simple approach: look up all tier IDs and find which one is a prefix
  let tierId = ''
  try {
    let tiers = mockTiers
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL) tiers = await getTiers()
    } catch { /* use mock */ }

    const tier = tiers.find((t) => orderRef.startsWith(t.id))
    if (!tier) {
      return NextResponse.json({ RspCode: '01', Message: 'Order not found' }, { status: 200 })
    }
    tierId = tier.id

    // 2. Verify amount matches tier price
    if (result.amountVnd !== null && result.amountVnd !== tier.priceVnd) {
      console.error('[IPN] Amount mismatch:', result.amountVnd, 'expected:', tier.priceVnd)
      return NextResponse.json({ RspCode: '04', Message: 'Invalid amount' }, { status: 200 })
    }
  } catch (err) {
    console.error('[IPN] Tier lookup failed:', err)
    return NextResponse.json({ RspCode: '99', Message: 'Unknown error' }, { status: 200 })
  }

  // 3. Extract userId from orderRef (8 chars after tierId)
  const userIdFragment = orderRef.slice(tierId.length, tierId.length + 8)

  try {
    // Use admin client — IPN has no user session
    const admin = createAdminClient()

    // Find the user by matching the first 8 chars of their UUID (without dashes)
    const { data: users } = await admin.auth.admin.listUsers()
    const user = users?.users?.find((u) =>
      u.id.replace(/-/g, '').startsWith(userIdFragment)
    )

    if (!user) {
      console.error('[IPN] User not found for fragment:', userIdFragment)
      return NextResponse.json({ RspCode: '01', Message: 'Order not found' }, { status: 200 })
    }

    // 4. Check if already processed (idempotency)
    const { data: existing } = await admin
      .from('subscriptions')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle()

    if (existing) {
      // Already active — could be a retry from VNPay
      return NextResponse.json({ RspCode: '02', Message: 'Order already confirmed' }, { status: 200 })
    }

    // 5. Activate subscription
    const now = new Date()
    const end = new Date(now)
    end.setMonth(end.getMonth() + 1)

    const { error } = await admin.from('subscriptions').insert({
      user_id: user.id,
      tier_id: tierId,
      status: 'active',
      start_date: now.toISOString().split('T')[0],
      end_date: end.toISOString().split('T')[0],
      vnpay_transaction_id: result.transactionNo,
    })

    if (error) {
      console.error('[IPN] Subscription insert failed:', error)
      return NextResponse.json({ RspCode: '99', Message: 'Unknown error' }, { status: 200 })
    }

    console.log('[IPN] Subscription activated for user:', user.id, 'tier:', tierId)
    return NextResponse.json({ RspCode: '00', Message: 'Confirm Success' }, { status: 200 })
  } catch (err) {
    console.error('[IPN] Error:', err)
    return NextResponse.json({ RspCode: '99', Message: 'Unknown error' }, { status: 200 })
  }
}
