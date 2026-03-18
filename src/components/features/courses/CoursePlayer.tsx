'use client'

import type { CourseModule } from '@/types'

interface CoursePlayerProps {
  module: CourseModule
}

export function CoursePlayer({ module }: CoursePlayerProps) {
  // MDX content placeholder — will be replaced with next-mdx-remote in backend task
  const lines = module.content.split('\n')

  return (
    <article className="prose prose-sm max-w-none text-[var(--text-primary)]">
      {module.videoUrl && (
        <div className="mb-6 rounded-lg overflow-hidden bg-black aspect-video flex items-center justify-center">
          <p className="text-white text-sm opacity-60">Video player coming soon</p>
        </div>
      )}

      <div className="space-y-3">
        {lines.map((line, i) => {
          if (line.startsWith('# ')) {
            return (
              <h1 key={i} className="text-2xl font-bold text-[var(--text-primary)] mt-0">
                {line.slice(2)}
              </h1>
            )
          }
          if (line.startsWith('## ')) {
            return (
              <h2 key={i} className="text-xl font-semibold text-[var(--text-primary)]">
                {line.slice(3)}
              </h2>
            )
          }
          if (line.trim() === '') return null
          return (
            <p key={i} className="text-[var(--text-secondary)] leading-relaxed">
              {line}
            </p>
          )
        })}
      </div>
    </article>
  )
}
