'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Loader2 } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/layout/AuthProvider'
import { localePath, ROUTES } from '@/constants/routes'
import type { SubscriptionTier } from '@/types'

export function VNPayCheckoutForm({ tier, locale: localeProp }: { tier: SubscriptionTier; locale?: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const t = useTranslations('checkout')
  const localeHook = useLocale()
  const locale = localeProp ?? localeHook
  const isVi = locale === 'vi'
  const { user } = useAuth()
  const router = useRouter()

  const priceDisplay = isVi
    ? `${new Intl.NumberFormat('vi-VN').format(tier.priceVnd)}₫`
    : `$${tier.price.toFixed(2)}`
  const billingLabel = tier.billingCycle === 'monthly' ? t('monthly') : t('yearly')

  // Check for payment result from VNPay return redirect
  const searchParams = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search)
    : null
  const paymentStatus = searchParams?.get('payment')
  const failReason = searchParams?.get('reason')

  async function handlePay() {
    if (!user) {
      router.push(localePath(locale, ROUTES.AUTH_LOGIN))
      return
    }

    setLoading(true)
    setError(null)

    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : ''
      const res = await fetch(`${origin}/api/payment/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tierId: tier.id, locale }),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Failed to create payment')

      // Store URL in sessionStorage before redirect so it survives navigation
      sessionStorage.setItem('vnpay_last_url', json.paymentUrl)
      console.log('[VNPay] Payment URL stored in sessionStorage')
      window.location.href = json.paymentUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* Not logged in warning */}
      {!user && (
        <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm text-yellow-700 dark:text-yellow-400">
          You need to be signed in to subscribe.{' '}
          <a href={localePath(locale, ROUTES.AUTH_LOGIN)} className="underline font-medium">Sign in</a>
        </div>
      )}

      {/* Payment failed notice */}
      {paymentStatus === 'failed' && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">
          Payment was not completed.
          {failReason && <span className="ml-1 opacity-70">({failReason.replace(/_/g, ' ')})</span>}
        </div>
      )}

      {/* Order summary */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-5 space-y-3">
        <div className="flex justify-between text-sm text-[var(--text-secondary)]">
          <span>{tier.name} {t('plan')}</span>
          <span>{priceDisplay}/{billingLabel}</span>
        </div>
        <div className="flex justify-between font-semibold border-t border-[var(--border)] pt-3 text-[var(--text-primary)]">
          <span>{t('total')}</span>
          <span>{priceDisplay}</span>
        </div>
      </div>

      {/* What's included */}
      <ul className="space-y-1.5 text-sm text-[var(--text-secondary)]">
        {tier.features.map((f) => (
          <li key={f} className="flex items-center gap-2">
            <span className="text-green-500">✓</span> {f}
          </li>
        ))}
      </ul>

      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}

      <Button
        onClick={handlePay}
        className="w-full"
        size="lg"
        disabled={loading || !user}
      >
        {loading
          ? <><Loader2 size={16} className="animate-spin mr-2" /> Redirecting to VNPay…</>
          : t('payButton')
        }
      </Button>

      <p className="text-xs text-center text-[var(--text-secondary)] flex items-center justify-center gap-1">
        <Lock size={11} /> {t('secureMessage')}
      </p>
    </div>
  )
}
