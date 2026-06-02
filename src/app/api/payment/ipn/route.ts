import { NextRequest, NextResponse } from 'next/server'
import { verifyParams } from '@/lib/vnpay'
import { getTiers } from '@/lib/db/tiers'
import { activateSubscriptionForPaidOrder } from '@/lib/db/payment-orders'

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
  try {
    const tiers = await getTiers()
    const tier = tiers.find((t) => orderRef.startsWith(t.id))
    if (!tier) {
      return NextResponse.json({ RspCode: '01', Message: 'Order not found' }, { status: 200 })
    }

    // 2. Verify amount matches tier price
    if (result.amountVnd !== null && result.amountVnd !== tier.priceVnd) {
      console.error('[IPN] Amount mismatch:', result.amountVnd, 'expected:', tier.priceVnd)
      return NextResponse.json({ RspCode: '04', Message: 'Invalid amount' }, { status: 200 })
    }
  } catch (err) {
    console.error('[IPN] Tier lookup failed:', err)
    return NextResponse.json({ RspCode: '99', Message: 'Unknown error' }, { status: 200 })
  }

  try {
    await activateSubscriptionForPaidOrder({
      provider: 'vnpay',
      orderRef,
      providerTransactionId: result.transactionNo ?? orderRef,
      amountVnd: result.amountVnd,
    })

    return NextResponse.json({ RspCode: '00', Message: 'Confirm Success' }, { status: 200 })
  } catch (err) {
    console.error('[IPN] Error:', err)
    return NextResponse.json({ RspCode: '99', Message: 'Unknown error' }, { status: 200 })
  }
}
