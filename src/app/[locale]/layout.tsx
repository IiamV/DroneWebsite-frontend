import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { AuthProvider } from '@/components/layout/AuthProvider'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ToastProvider } from '@/components/ui/Toast'
import { LocaleHtmlUpdater } from '@/components/layout/LocaleHtmlUpdater'
import { NavigationLoading } from '@/components/layout/NavigationLoading'
import type { SubscriptionTier } from '@/types'

const navTiers: SubscriptionTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    priceVnd: 0,
    billingCycle: 'monthly',
    features: ['Trial access'],
    featuresVi: ['Dung thu'],
    downloadAccess: false,
    courseAccess: 'basic',
    simulatorAccess: false,
    badgeColor: '#6b7280',
    badgeLabel: 'Free',
    tierRank: 0,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9,
    priceVnd: 225000,
    billingCycle: 'monthly',
    features: ['Full access'],
    featuresVi: ['Toan quyen'],
    downloadAccess: true,
    courseAccess: 'full',
    simulatorAccess: true,
    badgeColor: '#10b981',
    badgeLabel: 'Pro',
    tierRank: 2,
  },
]

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'en' | 'vi')) {
    notFound()
  }

  setRequestLocale(locale)

  const messages = (await import(`../../../messages/${locale}.json`)).default

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LocaleHtmlUpdater locale={locale} />
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <div className="flex min-h-screen flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
              <Navbar tiers={navTiers} />
              <NavigationLoading />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  )
}
