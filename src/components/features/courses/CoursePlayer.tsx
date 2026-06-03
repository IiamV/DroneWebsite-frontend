'use client'

import { useMemo, useState } from 'react'
import { CheckCircle2, ExternalLink, FileQuestion, PlayCircle, XCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { mediaUrl } from '@/lib/media-url'
import type { CourseModule } from '@/types'

interface CoursePlayerProps {
  module: CourseModule
}

function renderMarkdown(md: string): string {
  const lines = md.replace(/\r\n/g, '\n').split('\n')
  const blocks: string[] = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index]
    const trimmed = line.trim()

    if (!trimmed) {
      index += 1
      continue
    }

    if (trimmed.startsWith('```')) {
      const codeLines: string[] = []
      index += 1
      while (index < lines.length && !lines[index].trim().startsWith('```')) {
        codeLines.push(lines[index])
        index += 1
      }
      blocks.push(`<pre><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`)
      index += 1
      continue
    }

    if (isTableStart(lines, index)) {
      const tableLines = [lines[index], lines[index + 1]]
      index += 2
      while (index < lines.length && isTableRow(lines[index])) {
        tableLines.push(lines[index])
        index += 1
      }
      blocks.push(renderTable(tableLines))
      continue
    }

    const heading = trimmed.match(/^(#{1,3})\s+(.+)$/)
    if (heading) {
      const level = heading[1].length
      blocks.push(`<h${level}>${renderInlineMarkdown(heading[2])}</h${level}>`)
      index += 1
      continue
    }

    if (trimmed === '---') {
      blocks.push('<hr />')
      index += 1
      continue
    }

    if (trimmed.startsWith('> ')) {
      blocks.push(`<blockquote>${renderInlineMarkdown(trimmed.slice(2))}</blockquote>`)
      index += 1
      continue
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = []
      while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) {
        items.push(`<li>${renderInlineMarkdown(lines[index].trim().replace(/^\d+\.\s+/, ''))}</li>`)
        index += 1
      }
      blocks.push(`<ol>${items.join('')}</ol>`)
      continue
    }

    if (/^[-*]\s+/.test(trimmed)) {
      const items: string[] = []
      while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) {
        items.push(`<li>${renderInlineMarkdown(lines[index].trim().replace(/^[-*]\s+/, ''))}</li>`)
        index += 1
      }
      blocks.push(`<ul>${items.join('')}</ul>`)
      continue
    }

    const paragraphLines: string[] = []
    while (index < lines.length && lines[index].trim()) {
      if (isTableStart(lines, index)) break
      paragraphLines.push(lines[index].trim())
      index += 1
    }
    blocks.push(`<p>${renderInlineMarkdown(paragraphLines.join(' '))}</p>`)
  }

  return blocks.join('\n')
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function escapeAttribute(value: string): string {
  return escapeHtml(value).replace(/"/g, '&quot;')
}

function renderInlineMarkdown(value: string): string {
  return escapeHtml(value)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label: string, href: string) => {
      return `<a href="${escapeAttribute(safeHref(href))}" target="_blank" rel="noopener noreferrer">${label}</a>`
    })
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
}

function safeHref(href: string): string {
  const trimmed = href.trim()
  if (trimmed.startsWith('/') || trimmed.startsWith('#')) return trimmed
  try {
    const parsed = new URL(trimmed)
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:' || parsed.protocol === 'mailto:') {
      return trimmed
    }
  } catch {
    return '#'
  }
  return '#'
}

function isTableRow(line: string): boolean {
  const trimmed = line.trim()
  return trimmed.startsWith('|') && trimmed.endsWith('|')
}

function isTableSeparator(line: string): boolean {
  return /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(line.trim())
}

function isTableStart(lines: string[], index: number): boolean {
  return Boolean(lines[index + 1] && isTableRow(lines[index]) && isTableSeparator(lines[index + 1]))
}

function splitTableRow(line: string): string[] {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim())
}

function renderTable(lines: string[]): string {
  const headers = splitTableRow(lines[0])
  const rows = lines.slice(2).map(splitTableRow)

  return [
    '<div class="overflow-x-auto">',
    '<table>',
    `<thead><tr>${headers.map((header) => `<th>${renderInlineMarkdown(header)}</th>`).join('')}</tr></thead>`,
    `<tbody>${rows.map((row) => `<tr>${headers.map((_, cellIndex) => `<td>${renderInlineMarkdown(row[cellIndex] ?? '')}</td>`).join('')}</tr>`).join('')}</tbody>`,
    '</table>',
    '</div>',
  ].join('')
}

export function CoursePlayer({ module }: CoursePlayerProps) {
  const t = useTranslations('courseDetail')
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const html = renderMarkdown(module.content)
  const embedUrl = useMemo(() => getEmbedUrl(module.videoUrl), [module.videoUrl])
  const directVideoUrl = useMemo(() => getDirectVideoUrl(module.videoUrl), [module.videoUrl])
  const correctCount = module.quiz.reduce((total, question) => (
    answers[question.id] === question.answerIndex ? total + 1 : total
  ), 0)

  return (
    <article className="max-w-none space-y-6" aria-label={module.title}>
      {module.videoUrl && (
        <div className="rounded-lg overflow-hidden border border-[var(--border)] bg-black">
          <div className="flex items-center gap-2 border-b border-white/10 bg-black px-4 py-3 text-sm text-white">
            <PlayCircle size={18} aria-hidden="true" />
            <span>{t('videoLesson')}</span>
          </div>
          <div className="aspect-video">
            {embedUrl ? (
              <iframe
                key={embedUrl}
                src={embedUrl}
                title={`${t('videoLesson')}: ${module.title}`}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : directVideoUrl ? (
              <video
                key={module.videoUrl}
                controls
                className="h-full w-full"
                preload="metadata"
                aria-label={`${t('videoLesson')}: ${module.title}`}
              >
                <source src={directVideoUrl} type={getVideoMimeType(directVideoUrl)} />
              </video>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center text-white">
                <PlayCircle size={42} aria-hidden="true" />
                <a
                  href={module.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-black transition-opacity hover:opacity-90"
                >
                  {t('openVideo')}
                  <ExternalLink size={16} aria-hidden="true" />
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-1 text-xs font-medium uppercase tracking-wide text-[var(--text-secondary)]">
          {t(module.lessonType)}
        </span>
        {module.quiz.length > 0 && (
          <span className="rounded-full border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-1 text-xs text-[var(--text-secondary)]">
            {t('quizScore', { correct: correctCount, total: module.quiz.length })}
          </span>
        )}
      </div>

      <div
        className="prose-custom"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {module.quiz.length > 0 && (
        <section className="rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] p-4 sm:p-5" aria-labelledby="lesson-quiz">
          <div className="mb-4 flex items-center gap-2">
            <FileQuestion size={20} className="text-[var(--accent)]" aria-hidden="true" />
            <h2 id="lesson-quiz" className="text-lg font-semibold text-[var(--text-primary)]">
              {t('knowledgeCheck')}
            </h2>
          </div>
          <div className="space-y-5">
            {module.quiz.map((question, questionIndex) => {
              const selected = answers[question.id]
              const hasAnswered = typeof selected === 'number'
              const isCorrect = selected === question.answerIndex

              return (
                <fieldset key={question.id} className="space-y-3">
                  <legend className="text-sm font-semibold text-[var(--text-primary)]">
                    {questionIndex + 1}. {question.question}
                  </legend>
                  <div className="grid gap-2">
                    {question.options.map((option, optionIndex) => {
                      const selectedOption = selected === optionIndex
                      const correctOption = hasAnswered && question.answerIndex === optionIndex
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setAnswers((current) => ({ ...current, [question.id]: optionIndex }))}
                          className={[
                            'flex min-h-[44px] items-center justify-between gap-3 rounded-md border px-3 py-2 text-left text-sm transition-colors',
                            selectedOption
                              ? 'border-[var(--accent)] bg-[var(--bg-secondary)] text-[var(--text-primary)]'
                              : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]',
                            correctOption ? 'border-emerald-500' : '',
                          ].join(' ')}
                        >
                          <span>{option}</span>
                          {correctOption && <CheckCircle2 size={18} className="shrink-0 text-emerald-500" aria-hidden="true" />}
                          {selectedOption && hasAnswered && !isCorrect && <XCircle size={18} className="shrink-0 text-red-500" aria-hidden="true" />}
                        </button>
                      )
                    })}
                  </div>
                  {hasAnswered && (
                    <p className={isCorrect ? 'text-sm text-emerald-600' : 'text-sm text-red-500'}>
                      {isCorrect ? t('correct') : t('incorrect')} {question.explanation}
                    </p>
                  )}
                </fieldset>
              )
            })}
          </div>
        </section>
      )}
    </article>
  )
}

function getEmbedUrl(url: string | null): string | null {
  if (!url) return null
  try {
    const parsed = new URL(url)
    const hostname = parsed.hostname.replace(/^www\./, '')
    if (hostname === 'youtu.be') {
      const id = parsed.pathname.split('/').filter(Boolean)[0] ?? ''
      return id ? `https://www.youtube.com/embed/${id}` : null
    }
    if (hostname === 'youtube.com' || hostname === 'm.youtube.com') {
      const id = parsed.searchParams.get('v')
      if (id) return `https://www.youtube.com/embed/${id}`
      if (parsed.pathname.startsWith('/embed/')) return url
      if (parsed.pathname.startsWith('/shorts/')) {
        const shortsId = parsed.pathname.split('/').filter(Boolean)[1] ?? ''
        return shortsId ? `https://www.youtube.com/embed/${shortsId}` : null
      }
    }
  } catch {
    return null
  }
  return null
}

function getDirectVideoUrl(url: string | null): string | null {
  if (!url) return null
  const cleanUrl = url.split('?')[0].split('#')[0].toLowerCase()
  if (!/\.(mp4|webm|ogg|ogv|mov|m4v)$/.test(cleanUrl)) return null
  return mediaUrl(url)
}

function getVideoMimeType(url: string): string {
  const cleanUrl = url.split('?')[0].split('#')[0].toLowerCase()
  if (cleanUrl.endsWith('.webm')) return 'video/webm'
  if (cleanUrl.endsWith('.ogg') || cleanUrl.endsWith('.ogv')) return 'video/ogg'
  if (cleanUrl.endsWith('.mov')) return 'video/quicktime'
  return 'video/mp4'
}
