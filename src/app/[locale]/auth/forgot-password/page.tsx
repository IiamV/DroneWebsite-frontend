'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { ROUTES, localePath } from '@/constants/routes'

export default function ForgotPasswordPage() {
  const t = useTranslations('auth')
  const locale = useLocale()
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    const supabase = createClient()
    const baseUrl = window.location.origin
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${baseUrl}/${locale}/auth/reset-password`,
    })

    setIsSubmitting(false)
    if (resetError) {
      setError(resetError.message)
      return
    }
    setSent(true)
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">{t('forgotPasswordTitle')}</h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">{t('forgotPasswordSubtitle')}</p>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-8 shadow-sm">
          {sent ? (
            <div className="text-center space-y-4">
              <p className="text-sm text-[var(--text-primary)]">{t('resetLinkSent')}</p>
              <Link
                href={localePath(locale, ROUTES.AUTH_LOGIN)}
                className="inline-block text-sm font-medium text-[var(--accent)] underline-offset-4 hover:underline"
              >
                {t('backToLogin')}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="reset-email">{t('email')}</Label>
                <Input
                  id="reset-email"
                  type="email"
                  autoComplete="email"
                  placeholder={t('emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {error && <p className="text-xs text-destructive text-center">{error}</p>}

              <Button type="submit" variant="default" size="lg" disabled={isSubmitting} className="w-full">
                {isSubmitting ? t('sendingResetLink') : t('sendResetLink')}
              </Button>

              <p className="text-center text-sm text-[var(--text-secondary)]">
                <Link
                  href={localePath(locale, ROUTES.AUTH_LOGIN)}
                  className="font-medium text-[var(--accent)] underline-offset-4 hover:underline"
                >
                  {t('backToLogin')}
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
