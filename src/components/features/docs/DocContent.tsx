import { getTranslations } from 'next-intl/server'
import type { DocPage } from '@/types'

interface DocContentProps {
  doc: DocPage
  locale: string
}

function renderMarkdown(md: string): string {
  return md
    .replace(/```[\w]*\n([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^\|(.+)\|\s*$/gm, (_, row) => {
      const cells = row.split('|').map((c: string) => c.trim())
      return '<tr>' + cells.map((c: string) => `<td>${c}</td>`).join('') + '</tr>'
    })
    .replace(/(<tr>.*<\/tr>\n?)+/g, (match) => {
      const rows = match.trim().split('\n')
      const header = rows[0].replace(/<td>/g, '<th>').replace(/<\/td>/g, '</th>')
      const body = rows.slice(2).join('\n')
      return `<table><thead>${header}</thead><tbody>${body}</tbody></table>`
    })
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, (match) => {
      if (/^\d/.test(match)) return `<ol>${match}</ol>`
      return `<ul>${match}</ul>`
    })
    .replace(/^[-*] (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$1</ul>')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/^---$/gm, '<hr />')
    .replace(/^(?!<[a-z]|$)(.+)$/gm, '<p>$1</p>')
    .replace(/\n{3,}/g, '\n\n')
}

export async function DocContent({ doc, locale }: DocContentProps) {
  const t = await getTranslations({ locale, namespace: 'docs' })
  const html = renderMarkdown(doc.content)

  return (
    <article aria-label={doc.title} className="doc-content">
      <div
        className="prose-custom"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <p className="mt-10 text-xs text-[var(--text-secondary)] border-t border-[var(--border)] pt-4">
        {t('lastUpdated')}:{' '}
        {doc.updatedAt.toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </p>
    </article>
  )
}
