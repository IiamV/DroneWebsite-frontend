'use client'

import { motion } from 'framer-motion'
import { Monitor, Apple, Terminal, Download as DownloadIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
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

import React from 'react'

interface DownloadListProps {
  downloads: Download[]
}

export function DownloadList({ downloads }: DownloadListProps) {
  const { toast } = useToast()

  if (downloads.length === 0) {
    return (
      <p className="text-[var(--text-secondary)] py-8 text-center">
        No downloads available for the selected platform.
      </p>
    )
  }

  return (
    <ul className="space-y-4" aria-label="Available downloads">
      {downloads.map((dl, i) => (
        <motion.li
          key={dl.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: i * 0.05 }}
          className="flex items-center gap-4 p-5 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] hover:border-[var(--accent)] transition-colors"
        >
          <div
            className="h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-secondary)]"
            aria-hidden="true"
          >
            {PLATFORM_ICONS[dl.platform]}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[var(--text-primary)] truncate">
              {dl.title}
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mt-0.5 line-clamp-1">
              {dl.description}
            </p>
            <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-[var(--text-secondary)]">
              <span>v{dl.version}</span>
              <span aria-label={`Platform: ${PLATFORM_LABELS[dl.platform]}`}>
                {PLATFORM_LABELS[dl.platform]}
              </span>
              <span aria-label={`File size: ${dl.fileSize}`}>{dl.fileSize}</span>
            </div>
          </div>

          <Button
            variant="primary"
            className="flex-shrink-0 text-sm"
            aria-label={`Download ${dl.title} v${dl.version} for ${PLATFORM_LABELS[dl.platform]}`}
            onClick={() => toast('Download will be available after backend setup', 'info')}
          >
            Download
          </Button>
        </motion.li>
      ))}
    </ul>
  )
}
