import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { buildPaymentUrl, normalizeVnpayClientIp } from '@/lib/vnpay'
import { mockTiers } from '@/mocks/tiers'
import { getTiers } from '@/lib/db/tiers'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json() as { tierId: string; locale?: string }
    const { tierId, locale = 'vn' } = body
    if (!tierId) return NextResponse.json({ error: 'tierId is required' }, { status: 400 })

    let tiers = mockTiers
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL) tiers = await getTiers()
    } catch { /* use mock */ }

    const tier = tiers.find((t) => t.id === tierId)
    if (!tier || tier.price === 0) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })
    }

    // Unique order ref — tierId + short userId + timestamp, alphanumeric only
    const orderRef = `${tierId}${user.id.replace(/-/g, '').slice(0, 8)}${Date.now()}`

    const forwarded = request.headers.get('x-forwarded-for')
    const realIp    = request.headers.get('x-real-ip')
    const ipAddr    = normalizeVnpayClientIp(forwarded ?? realIp ?? undefined)

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

    // ReturnUrl — browser redirect, display only
    // IPN URL — server-to-server, activates subscription
    const returnUrl = `${baseUrl}/api/payment/return`

    // ASCII only — no Vietnamese diacritics or special characters (VNPay requirement)
    const orderInfo = `Flyntic Studio ${tier.name} subscription`

    const paymentUrl = buildPaymentUrl({
      amountVnd: tier.priceVnd,
      orderRef,
      orderInfo,
      returnUrl,
      ipAddr,
      locale: locale as 'vn' | 'en',
    })

    // Log to server terminal for debugging
    console.log('[VNPay] Generated URL:')
    console.log(paymentUrl)
    console.log('[VNPay] Params:')
    new URL(paymentUrl).searchParams.forEach((v, k) => console.log(` ${k} = ${v}`))

    return NextResponse.json({ paymentUrl, orderRef })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
