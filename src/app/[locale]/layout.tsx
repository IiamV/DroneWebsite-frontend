import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { AuthProvider } from '@/components/layout/AuthProvider'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ToastProvider } from '@/components/ui/Toast'
import { PageTransition } from '@/components/layout/PageTransition'
import { LocaleHtmlUpdater } from '@/components/layout/LocaleHtmlUpdater'

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
              <Navbar />
              <PageTransition>
                <main className="flex-1">{children}</main>
              </PageTransition>
              <Footer />
            </div>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  )
}
