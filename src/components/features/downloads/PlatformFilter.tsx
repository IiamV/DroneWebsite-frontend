'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import type { Download } from '@/types'

type Platform = Download['platform'] | 'all'

const PLATFORM_KEYS: Platform[] = ['all', 'windows', 'mac', 'linux']

interface PlatformFilterProps {
  selected: Platform
  onChange: (platform: Platform) => void
}

export function PlatformFilter({ selected, onChange }: PlatformFilterProps) {
  const t = useTranslations('downloads')

  return (
    <div role="group" aria-label="Filter by platform" className="flex flex-wrap gap-2">
      {PLATFORM_KEYS.map((value) => (
        <Button
          key={value}
          variant={selected === value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange(value)}
          aria-pressed={selected === value}
        >
          {t(value === 'all' ? 'allPlatforms' : value)}
        </Button>
      ))}
    </div>
  )
}
