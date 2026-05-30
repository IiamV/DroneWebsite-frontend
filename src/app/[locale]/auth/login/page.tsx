import { LoginForm } from '@/components/features/auth/LoginForm'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Mail } from 'lucide-react'

export const metadata = {
  title: 'Sign In — Drone Simulation Platform',
}

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ registered?: string }>
}) {
  const { locale } = await params
  const { registered } = await searchParams
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'auth' })

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">{t('loginTitle')}</h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">{t('loginSubtitle')}</p>
        </div>

        {/* Registration success — check email notice */}
        {registered === '1' && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-blue-500/30 bg-blue-500/10 p-4">
            <Mail size={18} className="text-blue-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-blue-400">Check your email</p>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                We sent a confirmation link to your email address. Click it to activate your account, then sign in here.
              </p>
            </div>
          </div>
        )}

        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-8 shadow-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
