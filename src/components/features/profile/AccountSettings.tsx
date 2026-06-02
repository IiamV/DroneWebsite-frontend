'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/Toast'
import { createClient } from '@/lib/supabase/client'

export function AccountSettings() {
  const t = useTranslations('profile')
  const { toast } = useToast()

  const [newEmail, setNewEmail] = useState('')
  const [emailLoading, setEmailLoading] = useState(false)

  const [newPassword, setNewPassword] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEmail) return
    setEmailLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ email: newEmail })

    setEmailLoading(false)
    if (error) {
      toast(error.message, 'error')
      return
    }
    toast(t('emailUpdated'), 'success')
    setNewEmail('')
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPassword || newPassword.length < 8) return
    setPasswordLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: newPassword })

    setPasswordLoading(false)
    if (error) {
      toast(error.message, 'error')
      return
    }
    toast(t('passwordUpdated'), 'success')
    setNewPassword('')
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 space-y-6">
      <h2 className="text-lg font-semibold text-[var(--text-primary)]">{t('accountSettings')}</h2>

      <form onSubmit={handleEmailUpdate} className="space-y-3">
        <Label htmlFor="new-email">{t('changeEmail')}</Label>
        <div className="flex gap-2">
          <Input
            id="new-email"
            type="email"
            placeholder={t('newEmail')}
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" variant="default" size="default" disabled={emailLoading || !newEmail}>
            {emailLoading ? t('updatingEmail') : t('updateEmail')}
          </Button>
        </div>
      </form>

      <div className="border-t border-[var(--border)]" />

      <form onSubmit={handlePasswordUpdate} className="space-y-3">
        <Label htmlFor="new-password">{t('changePassword')}</Label>
        <div className="flex gap-2">
          <Input
            id="new-password"
            type="password"
            placeholder={t('newPassword')}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            className="flex-1"
          />
          <Button type="submit" variant="default" size="default" disabled={passwordLoading || newPassword.length < 8}>
            {passwordLoading ? t('updatingPassword') : t('updatePassword')}
          </Button>
        </div>
        <p className="text-xs text-[var(--text-secondary)]">Min. 8 characters</p>
      </form>
    </div>
  )
}
