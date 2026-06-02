'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { ROUTES, localePath } from '@/constants/routes'

export default function ResetPasswordPage() {
  const t = useTranslations('auth')
  const locale = useLocale()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError(t('passwordMismatch'))
      return
    }

    if (password.length < 8) {
      setError(t('minPassword'))
      return
    }

    setIsSubmitting(true)
    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })

    setIsSubmitting(false)
    if (updateError) {
      setError(updateError.message)
      return
    }
    setDone(true)
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">{t('resetPasswordTitle')}</h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">{t('resetPasswordSubtitle')}</p>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-8 shadow-sm">
          {done ? (
            <div className="text-center space-y-4">
              <p className="text-sm text-[var(--text-primary)]">{t('passwordUpdated')}</p>
              <Link
                href={localePath(locale, ROUTES.AUTH_LOGIN)}
                className="inline-block text-sm font-medium text-[var(--accent)] underline-offset-4 hover:underline"
              >
                {t('signIn')}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="new-password">{t('newPassword')}</Label>
                <Input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder={t('passwordPlaceholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <p className="text-xs text-[var(--text-secondary)]">{t('minPassword')}</p>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="confirm-password">{t('confirmPassword')}</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder={t('passwordPlaceholder')}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {error && <p className="text-xs text-destructive text-center">{error}</p>}

              <Button type="submit" variant="default" size="lg" disabled={isSubmitting} className="w-full">
                {isSubmitting ? t('updatingPassword') : t('updatePassword')}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
