import { CheckCircle2 } from 'lucide-react'
import { setRequestLocale } from 'next-intl/server'
import Link from 'next/link'
import { localePath, ROUTES } from '@/constants/routes'

export const metadata = {
  title: 'Email Confirmed — Drone Simulation Platform',
}

export default async function ConfirmPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
            <CheckCircle2 size={32} className="text-green-500" aria-hidden="true" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Email confirmed!</h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Your email address has been verified. You can close this page or sign in to your account.
          </p>
        </div>
        <Link
          href={localePath(locale, ROUTES.AUTH_LOGIN)}
          className="inline-flex items-center justify-center min-h-[44px] px-6 py-2 rounded-lg bg-[var(--accent)] text-[var(--bg-primary)] text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Sign in
        </Link>
      </div>
    </div>
  )
}
