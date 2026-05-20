import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getDownloads } from '@/lib/db/downloads'
import { mockDownloads } from '@/mocks/downloads'
import { DownloadsPageClient } from '@/components/features/downloads/DownloadsPageClient'

export default async function DownloadsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('downloads')

  let downloads = mockDownloads
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      downloads = await getDownloads()
    }
  } catch { /* use mock */ }

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">{t('title')}</h1>
      <p className="text-[var(--text-secondary)] mb-8">{t('subtitle')}</p>
      <DownloadsPageClient downloads={downloads} />
    </main>
  )
}
