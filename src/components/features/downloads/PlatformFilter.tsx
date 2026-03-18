'use client'

import { Button } from '@/components/ui/Button'
import type { Download } from '@/types'

type Platform = Download['platform'] | 'all'

const PLATFORMS: { value: Platform; label: string }[] = [
  { value: 'all', label: 'All Platforms' },
  { value: 'windows', label: 'Windows' },
  { value: 'mac', label: 'macOS' },
  { value: 'linux', label: 'Linux' },
]

interface PlatformFilterProps {
  selected: Platform
  onChange: (platform: Platform) => void
}

export function PlatformFilter({ selected, onChange }: PlatformFilterProps) {
  return (
    <div
      role="group"
      aria-label="Filter by platform"
      className="flex flex-wrap gap-2"
    >
      {PLATFORMS.map(({ value, label }) => (
        <Button
          key={value}
          variant={selected === value ? 'primary' : 'secondary'}
          onClick={() => onChange(value)}
          aria-pressed={selected === value}
          className="text-sm px-4 py-2 min-h-[44px] min-w-[44px]"
        >
          {label}
        </Button>
      ))}
    </div>
  )
}
