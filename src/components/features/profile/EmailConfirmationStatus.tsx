'use client'

import { useState } from 'react'
import { CheckCircle2, MailWarning, RefreshCw } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface EmailConfirmationStatusProps {
  email: string
  confirmed: boolean
}

export function EmailConfirmationStatus({ email, confirmed }: EmailConfirmationStatusProps) {
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const resend = async () => {
    setSending(true)
    setError(null)
    const supabase = createClient()
    const { error: err } = await supabase.auth.resend({ type: 'signup', email })
    setSending(false)
    if (err) { setError(err.message); return }
    setSent(true)
  }

  if (confirmed) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
        <CheckCircle2 size={18} className="text-green-500 shrink-0" aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold text-green-600 dark:text-green-400">Email confirmed</p>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">{email}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 space-y-3">
      <div className="flex items-center gap-3">
        <MailWarning size={18} className="text-yellow-500 shrink-0" aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">Email not confirmed</p>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Check your inbox at <strong>{email}</strong> for a confirmation link.
          </p>
        </div>
      </div>

      {sent ? (
        <p className="text-xs text-green-500 font-medium">Confirmation email sent — check your inbox.</p>
      ) : (
        <button
          onClick={resend}
          disabled={sending}
          className="flex items-center gap-1.5 text-xs font-semibold text-yellow-600 dark:text-yellow-400 hover:underline disabled:opacity-50 transition-opacity"
        >
          <RefreshCw size={12} className={sending ? 'animate-spin' : ''} aria-hidden="true" />
          {sending ? 'Sending…' : 'Resend confirmation email'}
        </button>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
