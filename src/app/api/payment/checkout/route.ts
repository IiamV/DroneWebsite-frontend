import { NextRequest, NextResponse } from 'next/server'
import { createSubscriptionCheckout, type CheckoutProvider } from '@/lib/payments/checkout'

const providers: CheckoutProvider[] = ['vnpay', 'payos']

function statusForError(message: string): number {
  if (message === 'Not authenticated') return 401
  if (message === 'Your current plan already includes this subscription.') return 409
  if (message === 'tierId is required' || message === 'Invalid tier' || message === 'Invalid payment provider') return 400
  return 500
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      provider?: CheckoutProvider
      tierId?: string
      locale?: string
    }

    if (!body.provider || !providers.includes(body.provider)) {
      return NextResponse.json({ error: 'Invalid payment provider' }, { status: 400 })
    }

    const checkout = await createSubscriptionCheckout({
      provider: body.provider,
      tierId: body.tierId ?? '',
      locale: body.locale,
      request,
    })

    return NextResponse.json(checkout)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: statusForError(message) })
  }
}
