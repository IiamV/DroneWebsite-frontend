'use client'

import { useTranslations } from 'next-intl'
import { BookOpen, CheckCircle2, ClipboardCheck, FileQuestion } from 'lucide-react'
import type { CourseModule } from '@/types'

interface ModuleSidebarProps {
  modules: CourseModule[]
  activeModuleId: string
  onSelectModule: (moduleId: string) => void
  completedModuleIds?: Set<string>
}

export function ModuleSidebar({ modules, activeModuleId, onSelectModule, completedModuleIds }: ModuleSidebarProps) {
  const sorted = [...modules].sort((a, b) => a.order - b.order)
  const t = useTranslations('courses')

  return (
    <nav aria-label="Course modules">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)] mb-3 px-2">
        {t('modules')}
      </h2>
      <ol className="space-y-1">
        {sorted.map((module, index) => {
          const isActive = module.id === activeModuleId
          const isCompleted = completedModuleIds?.has(module.id)
          return (
            <li key={module.id}>
              <button
                onClick={() => onSelectModule(module.id)}
                aria-current={isActive ? 'true' : undefined}
                className={[
                  'w-full text-left px-3 py-2 rounded-md text-sm transition-colors',
                  'min-h-[44px] flex items-start gap-2',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]',
                  isActive
                    ? 'bg-[var(--accent)] text-[var(--bg-primary)] font-medium'
                    : 'text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]',
                ].join(' ')}
                style={{ touchAction: 'manipulation' }}
              >
                <span className="shrink-0 mt-0.5 text-xs opacity-60">{index + 1}.</span>
                <span className="mt-0.5 shrink-0 opacity-70">
                  {isCompleted
                    ? <CheckCircle2 size={14} aria-hidden="true" />
                    : module.lessonType === 'quiz'
                    ? <FileQuestion size={14} aria-hidden="true" />
                    : module.lessonType === 'project'
                      ? <ClipboardCheck size={14} aria-hidden="true" />
                      : <BookOpen size={14} aria-hidden="true" />
                  }
                </span>
                <span>{module.title}</span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
