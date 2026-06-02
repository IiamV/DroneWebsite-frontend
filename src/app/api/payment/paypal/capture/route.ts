import { NextRequest, NextResponse } from 'next/server'
import { capturePaypalOrder } from '@/lib/paypal'
import { activateSubscriptionForPaidOrder } from '@/lib/db/payment-orders'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')
  const tierId = searchParams.get('tierId')
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  if (!token || !tierId) {
    return NextResponse.redirect(`${baseUrl}/en/subscription?payment=failed`)
  }

  try {
    const { status, transactionId, amountUsd } = await capturePaypalOrder(token)

    if (status !== 'COMPLETED') {
      return NextResponse.redirect(`${baseUrl}/en/subscription/checkout/${tierId}?payment=failed`)
    }

    await activateSubscriptionForPaidOrder({
      provider: 'paypal',
      orderRef: token,
      providerTransactionId: transactionId,
      amountUsd,
    })

    return NextResponse.redirect(`${baseUrl}/en/profile?payment=success`)
  } catch {
    return NextResponse.redirect(`${baseUrl}/en/subscription/checkout/${tierId}?payment=failed`)
  }
}
