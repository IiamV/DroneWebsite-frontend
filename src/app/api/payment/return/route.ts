import { NextRequest, NextResponse } from 'next/server'
import { verifyParams } from '@/lib/vnpay'
import { verifyMomoIpn } from '@/lib/momo'
import { activateSubscriptionForPaidOrder, markPaymentOrderCancelled } from '@/lib/db/payment-orders'

/**
 * ReturnUrl — VNPay redirects the user's browser here after payment.
 *
 * Per VNPay docs, the ReturnUrl should only verify checksum and display result.
 * However, since IPN cannot reach localhost in development, we also activate
 * the subscription here as a fallback (idempotent — safe to call twice).
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = Object.fromEntries(searchParams.entries()) as Record<string, string>

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const provider = searchParams.get('provider')
  const orderRef = provider === 'payos'
    ? searchParams.get('orderCode') ?? ''
    : provider === 'momo'
      ? query.orderId ?? ''
      : query.vnp_TxnRef ?? ''

  // Extract tierId — longest match first to avoid prefix collision
  const tierIds = ['campus', 'team', 'pro', 'free']
  const tierId = tierIds.find((id) => orderRef.startsWith(id)) ?? ''

  // Determine locale from URL (default en)
  const locale = 'en'

  if (provider === 'payos') {
    if (query.code === '00' && query.status === 'PAID' && orderRef) {
      try {
        await activateSubscriptionForPaidOrder({
          provider: 'payos',
          orderRef,
          providerTransactionId: query.id ?? orderRef,
        })
        return NextResponse.redirect(`${baseUrl}/${locale}/profile?payment=success`)
      } catch (err) {
        console.error('[PayOS ReturnUrl] Subscription activation error:', err)
        return NextResponse.redirect(`${baseUrl}/${locale}/subscription?payment=failed`)
      }
    }

    if (orderRef) {
      try {
        await markPaymentOrderCancelled('payos', orderRef)
      } catch (err) {
        console.error('[PayOS ReturnUrl] Cancel marker error:', err)
      }
    }
    return NextResponse.redirect(`${baseUrl}/${locale}/subscription/checkout/${query.tierId ?? tierId}?payment=cancelled`)
  }

  if (provider === 'momo') {
    const momoTierId = query.tierId ?? tierId
    const result = verifyMomoIpn(query)

    if (!result.isValid) {
      console.error('[MoMo ReturnUrl] Signature invalid')
      return NextResponse.redirect(`${baseUrl}/${locale}/subscription/checkout/${momoTierId}?payment=failed`)
    }

    if (result.resultCode !== 0) {
      if (orderRef) {
        try {
          await markPaymentOrderCancelled('momo', orderRef)
        } catch (err) {
          console.error('[MoMo ReturnUrl] Cancel marker error:', err)
        }
      }
      return NextResponse.redirect(`${baseUrl}/${locale}/subscription/checkout/${momoTierId}?payment=cancelled`)
    }

    try {
      await activateSubscriptionForPaidOrder({
        provider: 'momo',
        orderRef,
        providerTransactionId: query.transId ?? orderRef,
        amountVnd: Number(query.amount),
      })
      return NextResponse.redirect(`${baseUrl}/${locale}/profile?payment=success`)
    } catch (err) {
      console.error('[MoMo ReturnUrl] Subscription activation error:', err)
      return NextResponse.redirect(`${baseUrl}/${locale}/subscription/checkout/${momoTierId}?payment=failed`)
    }
  }

  // Verify HMAC signature
  const result = verifyParams(query)
  if (!result.isSuccess) {
    console.error('[ReturnUrl] Signature invalid:', result.message)
    return NextResponse.redirect(
      `${baseUrl}/${locale}/subscription/checkout/${tierId}?payment=failed&code=${result.responseCode}`
    )
  }

  // Payment succeeded — activate the stored pending order.
  // This is the fallback for when IPN can't reach the server (e.g. localhost dev)
  try {
    await activateSubscriptionForPaidOrder({
      provider: 'vnpay',
      orderRef,
      providerTransactionId: result.transactionNo ?? orderRef,
      amountVnd: result.amountVnd,
    })
  } catch (err) {
    // Non-fatal — user still sees success page
    console.error('[ReturnUrl] Subscription activation error:', err)
  }

  return NextResponse.redirect(`${baseUrl}/${locale}/profile?payment=success`)
}
