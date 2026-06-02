import { getTranslations } from 'next-intl/server'
import { unstable_noStore as noStore } from 'next/cache'
import { getDownloads } from '@/lib/db/downloads'
import { DownloadsPageClient } from '@/components/features/downloads/DownloadsPageClient'

export const dynamic = 'force-dynamic'

export default async function DownloadsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  noStore()
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'downloads' })

  const downloads = await getDownloads()

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">{t('title')}</h1>
      <p className="text-[var(--text-secondary)] mb-8">{t('subtitle')}</p>
      <DownloadsPageClient downloads={downloads} />
    </main>
  )
}
