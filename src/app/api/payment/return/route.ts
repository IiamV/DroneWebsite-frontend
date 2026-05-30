import { NextRequest, NextResponse } from 'next/server'
import { verifyParams } from '@/lib/vnpay'
import { createClient } from '@/lib/supabase/server'
import { mockTiers } from '@/mocks/tiers'
import { getTiers } from '@/lib/db/tiers'

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
  const orderRef = query.vnp_TxnRef ?? ''

  // Extract tierId — longest match first to avoid prefix collision
  const tierIds = ['campus', 'team', 'pro', 'free']
  const tierId = tierIds.find((id) => orderRef.startsWith(id)) ?? ''

  // Determine locale from URL (default en)
  const locale = 'en'

  // Verify HMAC signature
  const result = verifyParams(query)
  if (!result.isSuccess) {
    console.error('[ReturnUrl] Signature invalid:', result.message)
    return NextResponse.redirect(
      `${baseUrl}/${locale}/subscription/checkout/${tierId}?payment=failed&code=${result.responseCode}`
    )
  }

  // Payment succeeded — activate subscription for the current user
  // This is the fallback for when IPN can't reach the server (e.g. localhost dev)
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user && tierId) {
      // Check if already activated (IPN may have already done it)
      const { data: existing } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle()

      if (!existing) {
        // Look up tier to validate
        let tiers = mockTiers
        try {
          if (process.env.NEXT_PUBLIC_SUPABASE_URL) tiers = await getTiers()
        } catch { /* use mock */ }

        const tier = tiers.find((t) => t.id === tierId)
        if (tier && tier.price > 0) {
          const now = new Date()
          const end = new Date(now)
          end.setMonth(end.getMonth() + 1)

          await (supabase.from('subscriptions') as any).insert({
            user_id: user.id,
            tier_id: tierId,
            status: 'active',
            start_date: now.toISOString().split('T')[0],
            end_date: end.toISOString().split('T')[0],
            vnpay_transaction_id: result.transactionNo,
          })
          console.log('[ReturnUrl] Subscription activated for user:', user.id, 'tier:', tierId)
        }
      }
    }
  } catch (err) {
    // Non-fatal — user still sees success page
    console.error('[ReturnUrl] Subscription activation error:', err)
  }

  return NextResponse.redirect(`${baseUrl}/${locale}/profile?payment=success`)
}
