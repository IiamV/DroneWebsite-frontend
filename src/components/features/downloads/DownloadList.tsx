'use client'

import React from 'react'
import { Monitor, Apple, Terminal, Download as DownloadIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/Toast'
import type { Download } from '@/types'

const PLATFORM_ICONS: Record<Download['platform'], React.ReactNode> = {
  windows: <Monitor size={22} />,
  mac: <Apple size={22} />,
  linux: <Terminal size={22} />,
  all: <DownloadIcon size={22} />,
}

const PLATFORM_LABELS: Record<Download['platform'], string> = {
  windows: 'Windows',
  mac: 'macOS',
  linux: 'Linux',
  all: 'All Platforms',
}

export function DownloadList({ downloads }: { downloads: Download[] }) {
  const { toast } = useToast()

  if (downloads.length === 0) {
    return <p className="text-muted-foreground py-8 text-center">No downloads available for the selected platform.</p>
  }

  return (
    <ul className="space-y-4" aria-label="Available downloads">
      {downloads.map((dl) => (
        <li
          key={dl.id}
          className="flex items-center gap-4 p-5 bg-card rounded-xl border hover:border-primary transition-colors"
        >
          <div className="h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-lg bg-muted border text-muted-foreground" aria-hidden="true">
            {PLATFORM_ICONS[dl.platform]}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{dl.title}</h3>
            <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{dl.description}</p>
            <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-muted-foreground">
              <span>v{dl.version}</span>
              <span>{PLATFORM_LABELS[dl.platform]}</span>
              <span>{dl.fileSize}</span>
            </div>
          </div>
          <Button
            className="flex-shrink-0"
            onClick={() => toast('Download will be available after backend setup', 'info')}
            aria-label={`Download ${dl.title} v${dl.version}`}
          >
            <DownloadIcon size={16} className="mr-2" />
            Download
          </Button>
        </li>
      ))}
    </ul>
  )
}
