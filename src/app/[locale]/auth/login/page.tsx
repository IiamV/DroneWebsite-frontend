import { LoginForm } from '@/components/features/auth/LoginForm'
import { setRequestLocale, getTranslations } from 'next-intl/server'

export const metadata = {
  title: 'Sign In — Drone Simulation Platform',
}

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'auth' })

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">{t('loginTitle')}</h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">{t('loginSubtitle')}</p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-8 shadow-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
