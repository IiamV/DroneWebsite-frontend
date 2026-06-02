import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { buildPaymentUrl, normalizeVnpayClientIp } from '@/lib/vnpay'
import { createPayosDescription, createPayosPaymentUrl } from '@/lib/payos'
import { createMomoPaymentUrl } from '@/lib/momo'
import { createPaypalOrder } from '@/lib/paypal'
import { getTiers } from '@/lib/db/tiers'
import { createPaymentOrder, type PaymentProvider } from '@/lib/db/payment-orders'
import { getSubscriptionGuard } from '@/lib/subscription-guard'

export type CheckoutProvider = PaymentProvider

interface CreateCheckoutInput {
  provider: CheckoutProvider
  tierId: string
  locale?: string
  request?: NextRequest
}

interface CheckoutResult {
  paymentUrl: string
  orderRef: string
}

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
}

function createVnpayOrderRef(tierId: string): string {
  return `${tierId}${Date.now()}${crypto.randomUUID().replace(/-/g, '').slice(0, 8)}`
}

function getRequestIp(request?: NextRequest): string {
  const forwarded = request?.headers.get('x-forwarded-for')
  const realIp = request?.headers.get('x-real-ip')
  return normalizeVnpayClientIp(forwarded ?? realIp ?? undefined)
}

function normalizeVnpayLocale(locale?: string): 'vn' | 'en' {
  return locale === 'en' ? 'en' : 'vn'
}

async function assertAuthenticated() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  return user
}

export async function createSubscriptionCheckout({
  provider,
  tierId,
  locale,
  request,
}: CreateCheckoutInput): Promise<CheckoutResult> {
  const user = await assertAuthenticated()

  if (!tierId) throw new Error('tierId is required')

  const tiers = await getTiers()
  const tier = tiers.find((item) => item.id === tierId)
  if (!tier || tier.price === 0) throw new Error('Invalid tier')

  const guard = await getSubscriptionGuard(tier, tiers)
  if (!guard.canPurchase) {
    throw new Error('Your current plan already includes this subscription.')
  }

  const baseUrl = getBaseUrl()
  const checkoutLocale = locale ?? 'vi'

  if (provider === 'vnpay') {
    const orderRef = createVnpayOrderRef(tierId)
    const paymentUrl = buildPaymentUrl({
      amountVnd: tier.priceVnd,
      orderRef,
      orderInfo: `Flyntic Studio ${tier.name} subscription`,
      returnUrl: `${baseUrl}/api/payment/return`,
      ipAddr: getRequestIp(request),
      locale: normalizeVnpayLocale(locale),
    })

    await createPaymentOrder({
      provider,
      userId: user.id,
      tier,
      orderRef,
      currency: 'VND',
      checkoutUrl: paymentUrl,
      metadata: { locale: checkoutLocale },
    })

    return { paymentUrl, orderRef }
  }

  if (provider === 'payos') {
    const orderRef = String(Date.now())
    const description = createPayosDescription(Number(orderRef))
    const paymentUrl = await createPayosPaymentUrl({
      orderCode: Number(orderRef),
      amount: tier.priceVnd,
      description,
      returnUrl: `${baseUrl}/api/payment/return?provider=payos&tierId=${tierId}`,
      cancelUrl: `${baseUrl}/${checkoutLocale}/subscription/checkout/${tierId}?payment=cancelled`,
    })

    await createPaymentOrder({
      provider,
      userId: user.id,
      tier,
      orderRef,
      currency: 'VND',
      checkoutUrl: paymentUrl,
      metadata: { locale: checkoutLocale, description },
    })

    return { paymentUrl, orderRef }
  }

  if (provider === 'momo') {
    const orderRef = `momo_${tierId}_${Date.now()}_${crypto.randomUUID().replace(/-/g, '').slice(0, 8)}`
    const paymentUrl = await createMomoPaymentUrl({
      orderId: orderRef,
      amount: tier.priceVnd,
      orderInfo: `Flyntic ${tier.name} subscription`,
      returnUrl: `${baseUrl}/api/payment/return?provider=momo&tierId=${tierId}`,
      notifyUrl: `${baseUrl}/api/payment/momo/ipn`,
    })

    await createPaymentOrder({
      provider,
      userId: user.id,
      tier,
      orderRef,
      currency: 'VND',
      checkoutUrl: paymentUrl,
      metadata: { locale: checkoutLocale },
    })

    return { paymentUrl, orderRef }
  }

  const { id: orderRef, approvalUrl } = await createPaypalOrder({
    amount: tier.price.toFixed(2),
    currency: 'USD',
    description: `Flyntic ${tier.name} subscription`,
    returnUrl: `${baseUrl}/api/payment/paypal/capture?tierId=${tierId}`,
    cancelUrl: `${baseUrl}/${checkoutLocale}/subscription/checkout/${tierId}?payment=cancelled`,
  })

  await createPaymentOrder({
    provider,
    userId: user.id,
    tier,
    orderRef,
    currency: 'USD',
    checkoutUrl: approvalUrl,
    metadata: { locale: checkoutLocale },
  })

  return { paymentUrl: approvalUrl, orderRef }
}
