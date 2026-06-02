import { NextRequest, NextResponse } from 'next/server'
import { verifyPayosWebhook } from '@/lib/payos'
import { activateSubscriptionForPaidOrder, markPaymentOrderCancelled } from '@/lib/db/payment-orders'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!verifyPayosWebhook(body)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const data = body.data as Record<string, unknown>
    const orderCode = String(data.orderCode ?? '')

    if (data.code !== '00' || data.status === 'CANCELLED') {
      if (orderCode) await markPaymentOrderCancelled('payos', orderCode)
      return NextResponse.json({ success: false })
    }

    await activateSubscriptionForPaidOrder({
      provider: 'payos',
      orderRef: orderCode,
      providerTransactionId: String(data.paymentLinkId ?? data.reference ?? orderCode),
      amountVnd: typeof data.amount === 'number' ? data.amount : Number(data.amount),
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
