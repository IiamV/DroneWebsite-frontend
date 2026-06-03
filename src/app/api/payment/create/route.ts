import { NextRequest, NextResponse } from 'next/server'
import { createSubscriptionCheckout } from '@/lib/payments/checkout'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { tierId: string; locale?: string }
    const checkout = await createSubscriptionCheckout({
      provider: 'vnpay',
      tierId: body.tierId,
      locale: body.locale,
      request,
    })
    return NextResponse.json(checkout)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
