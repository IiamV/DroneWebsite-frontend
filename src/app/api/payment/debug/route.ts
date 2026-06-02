/**
 * Debug endpoint — returns the VNPay URL as JSON without redirecting.
 * Remove before production.
 */
import { NextResponse } from 'next/server'
import { buildPaymentUrl, verifyParams } from '@/lib/vnpay'

export async function GET() {
  const tmnCode = process.env.VNP_TMN_CODE!.trim()

  const orderRef  = `debugtest${Date.now()}`
  const returnUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/api/payment/return`

  const url = buildPaymentUrl({
    amountVnd: 10000,
    orderRef,
    orderInfo: 'Thanh toan don hang',
    returnUrl,
    ipAddr: '127.0.0.1',
    locale: 'vn',
  })

  const query = Object.fromEntries(new URL(url).searchParams) as Record<string, string>
  const preVerify = verifyParams(query)

  return NextResponse.json({
    tmnCode,
    hashSecretLength: process.env.VNP_HASH_SECRET?.trim().length ?? 0,
    orderRef,
    /** Self-check: URL we built must pass verifyParams (PHP-style sign). */
    hashMatch:
      preVerify.message !== 'Invalid signature' &&
      preVerify.message !== 'Missing secure hash',
    verifyMessage: preVerify.message,
    fullUrl: url,
    params: { ...query },
  }, { status: 200 })
}
