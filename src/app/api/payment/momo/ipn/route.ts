import { NextRequest, NextResponse } from 'next/server'
import { verifyMomoIpn } from '@/lib/momo'
import { activateSubscriptionForPaidOrder } from '@/lib/db/payment-orders'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Record<string, string>
    const { isValid, resultCode } = verifyMomoIpn(body)

    if (!isValid) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 400 })
    }

    if (resultCode !== 0) {
      return new NextResponse(null, { status: 204 })
    }

    const orderId = body.orderId ?? ''
    if (!orderId) {
      return NextResponse.json({ message: 'Order not found' }, { status: 400 })
    }

    await activateSubscriptionForPaidOrder({
      provider: 'momo',
      orderRef: orderId,
      providerTransactionId: body.transId ?? orderId,
      amountVnd: Number(body.amount),
    })

    return new NextResponse(null, { status: 204 })
  } catch (err) {
    console.error('[MoMo IPN] Error:', err)
    return NextResponse.json({ message: 'Error' }, { status: 500 })
  }
}
