'use client'

import { useState } from 'react'
import { mockDownloads } from '@/mocks/downloads'
import { DownloadList } from '@/components/features/downloads/DownloadList'
import { PlatformFilter } from '@/components/features/downloads/PlatformFilter'
import type { Download } from '@/types'

type Platform = Download['platform'] | 'all'

export default function DownloadsPage() {
  const [platform, setPlatform] = useState<Platform>('all')

  const filtered =
    platform === 'all'
      ? mockDownloads
      : mockDownloads.filter((d) => d.platform === platform || d.platform === 'all')

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Downloads</h1>
      <p className="text-[var(--text-secondary)] mb-8">
        Download the simulator and tools for your platform.
      </p>

      <div className="mb-6">
        <PlatformFilter selected={platform} onChange={setPlatform} />
      </div>

      <DownloadList downloads={filtered} />
    </main>
  )
}
