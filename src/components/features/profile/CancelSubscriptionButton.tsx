'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { localePath, ROUTES } from '@/constants/routes'

export function CancelSubscriptionButton({ locale }: { locale: string }) {
  const t = useTranslations('profile')
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleCancel() {
    setLoading(true)
    try {
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const res = await fetch(`${origin}/api/subscription/cancel`, { method: 'POST' })
      if (!res.ok) throw new Error('Failed to cancel')
      router.push(localePath(locale, ROUTES.PROFILE))
      router.refresh()
    } catch {
      setLoading(false)
      setConfirming(false)
    }
  }

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="text-sm text-[var(--text-secondary)] hover:text-red-500 transition-colors underline-offset-2 hover:underline"
      >
        {t('cancelSubscription')}
      </button>
    )
  }

  return (
    <div className="flex items-center gap-3 p-4 rounded-xl border border-red-500/30 bg-red-500/5">
      <p className="flex-1 text-sm text-[var(--text-secondary)]">
        {t('cancelConfirm')}
      </p>
      <button
        onClick={handleCancel}
        disabled={loading}
        className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
      >
        {loading ? t('cancelling') : t('yesCancel')}
      </button>
      <button
        onClick={() => setConfirming(false)}
        className="px-3 py-1.5 rounded-lg border border-[var(--border)] text-sm hover:bg-[var(--bg-secondary)] transition-colors"
      >
        {t('keepPlan')}
      </button>
    </div>
  )
}
