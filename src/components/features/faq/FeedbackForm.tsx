'use client'

import { FormEvent, useCallback, useEffect, useRef, useState } from 'react'
import Script from 'next/script'
import { Loader2, MessageSquare, Send } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useToast } from '@/components/ui/Toast'

declare global {
  interface Window {
    hcaptcha?: {
      render: (container: HTMLElement, options: { sitekey: string }) => string
      reset: (widgetId?: string) => void
    }
  }
}

interface FormState {
  name: string
  email: string
  message: string
  botcheck: string
}

const initialForm: FormState = {
  name: '',
  email: '',
  message: '',
  botcheck: '',
}

const WEB3FORMS_HCAPTCHA_SITE_KEY = '50b2fe65-b00b-4b9e-ad62-3ba471098be2'

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function FeedbackForm() {
  const t = useTranslations('faq')
  const { toast } = useToast()
  const [form, setForm] = useState<FormState>(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ?? ''
  const captchaRef = useRef<HTMLDivElement>(null)
  const captchaWidgetIdRef = useRef<string | null>(null)

  const renderCaptcha = useCallback(() => {
    if (!captchaRef.current || !window.hcaptcha || captchaWidgetIdRef.current) return
    captchaWidgetIdRef.current = window.hcaptcha.render(captchaRef.current, {
      sitekey: WEB3FORMS_HCAPTCHA_SITE_KEY,
    })
  }, [])

  useEffect(() => {
    renderCaptcha()
  }, [renderCaptcha])

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSuccess(false)

    const email = form.email.trim()
    const message = form.message.trim()
    const name = form.name.trim()
    const captchaToken = document
      .querySelector<HTMLTextAreaElement>('[name="h-captcha-response"]')
      ?.value
      ?.trim()

    if (!accessKey) {
      const messageText = t('feedbackConfigError')
      setError(messageText)
      toast(messageText, 'error')
      return
    }

    if (!email || !isValidEmail(email)) {
      setError(t('feedbackEmailError'))
      return
    }

    if (message.length < 10) {
      setError(t('feedbackMessageError'))
      return
    }

    if (!captchaToken) {
      setError(t('feedbackCaptchaError'))
      return
    }

    setSubmitting(true)

    const payload = new FormData()
    payload.append('access_key', accessKey)
    payload.append('subject', t('feedbackSubject'))
    payload.append('from_name', name || t('feedbackAnonymous'))
    payload.append('name', name)
    payload.append('email', email)
    payload.append('message', message)
    payload.append('botcheck', form.botcheck)
    payload.append('h-captcha-response', captchaToken)

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: payload,
      })
      const json = await res.json().catch(() => null) as { success?: boolean; message?: string } | null

      if (!res.ok || !json?.success) {
        throw new Error(json?.message ?? t('feedbackSubmitError'))
      }

      setForm(initialForm)
      setSuccess(true)
      toast(t('feedbackSuccess'), 'success')
      window.hcaptcha?.reset(captchaWidgetIdRef.current ?? undefined)
    } catch (err) {
      const messageText = err instanceof Error ? err.message : t('feedbackSubmitError')
      setError(messageText)
      toast(messageText, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section
      aria-labelledby="feedback-title"
      className="mt-10 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-5 md:p-7"
    >
      <div className="mb-6 flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--accent)]">
          <MessageSquare size={18} aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
            {t('feedbackEyebrow')}
          </p>
          <h2 id="feedback-title" className="mt-1 text-xl font-bold text-[var(--text-primary)]">
            {t('feedbackTitle')}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)]">
            {t('feedbackSubtitle')}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Script
          src="https://js.hcaptcha.com/1/api.js?render=explicit"
          strategy="afterInteractive"
          onLoad={renderCaptcha}
        />
        <input
          type="checkbox"
          name="botcheck"
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
          checked={form.botcheck === 'true'}
          onChange={(event) => updateField('botcheck', event.target.checked ? 'true' : '')}
          aria-hidden="true"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="feedback-name" className="text-sm font-medium text-[var(--text-primary)]">
              {t('feedbackName')}
            </label>
            <input
              id="feedback-name"
              name="name"
              type="text"
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
              placeholder={t('feedbackNamePlaceholder')}
              className="min-h-[44px] w-full rounded-md border border-[var(--border)] bg-[var(--bg-primary)] px-3 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-secondary)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="feedback-email" className="text-sm font-medium text-[var(--text-primary)]">
              {t('feedbackEmail')}
            </label>
            <input
              id="feedback-email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
              placeholder={t('feedbackEmailPlaceholder')}
              className="min-h-[44px] w-full rounded-md border border-[var(--border)] bg-[var(--bg-primary)] px-3 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-secondary)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="feedback-message" className="text-sm font-medium text-[var(--text-primary)]">
            {t('feedbackMessage')}
          </label>
          <textarea
            id="feedback-message"
            name="message"
            required
            rows={5}
            value={form.message}
            onChange={(event) => updateField('message', event.target.value)}
            placeholder={t('feedbackMessagePlaceholder')}
            className="w-full resize-y rounded-md border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-3 text-sm leading-relaxed text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-secondary)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
          />
        </div>

        <div ref={captchaRef} className="min-h-[78px]" />

        {error && (
          <p role="alert" className="text-sm text-red-500">
            {error}
          </p>
        )}
        {success && (
          <p role="status" className="text-sm text-green-600 dark:text-green-400">
            {t('feedbackSuccess')}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-md bg-[var(--accent)] px-5 text-sm font-semibold text-[var(--bg-primary)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
              {t('feedbackSubmitting')}
            </>
          ) : (
            <>
              <Send size={16} aria-hidden="true" />
              {t('feedbackSubmit')}
            </>
          )}
        </button>
      </form>
    </section>
  )
}
