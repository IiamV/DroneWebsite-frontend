'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { DownloadList } from './DownloadList'
import { PlatformFilter } from './PlatformFilter'
import type { Download } from '@/types'

type Platform = Download['platform'] | 'all'

export function DownloadsPageClient({ downloads }: { downloads: Download[] }) {
  const t = useTranslations('downloads')
  const [platform, setPlatform] = useState<Platform>('all')

  const filtered =
    platform === 'all'
      ? downloads
      : downloads.filter((d) => d.platform === platform || d.platform === 'all')

  return (
    <>
      <div className="mb-6">
        <PlatformFilter selected={platform} onChange={setPlatform} />
      </div>
      <DownloadList downloads={filtered} />
    </>
  )
}
