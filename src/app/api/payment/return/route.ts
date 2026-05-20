import { NextRequest, NextResponse } from 'next/server'
import { verifyParams } from '@/lib/vnpay'

/**
 * ReturnUrl — VNPay redirects the user's browser here after payment.
 * Per VNPay docs: only verify checksum and display result.
 * Do NOT activate subscription here — that's the IPN's job.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = Object.fromEntries(searchParams.entries()) as Record<string, string>

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const orderRef = query.vnp_TxnRef ?? ''

  // Extract tierId from orderRef prefix
  const tierIds = ['campus', 'team', 'pro', 'free'] // longest first to avoid prefix collision
  const tierId = tierIds.find((id) => orderRef.startsWith(id)) ?? ''

  const result = verifyParams(query)

  if (!result.isSuccess) {
    return NextResponse.redirect(
      `${baseUrl}/en/subscription/checkout/${tierId}?payment=failed&code=${result.responseCode}`
    )
  }

  // Success — redirect to profile. The IPN will have already activated the subscription.
  return NextResponse.redirect(`${baseUrl}/en/profile?payment=success`)
}
