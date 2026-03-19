import type { DocPage } from '@/types'

interface DocContentProps {
  doc: DocPage
}

// Simple markdown-to-HTML renderer — no async compilation, no external deps
function renderMarkdown(md: string): string {
  return md
    // Fenced code blocks
    .replace(/```[\w]*\n([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Tables (basic)
    .replace(/^\|(.+)\|\s*$/gm, (_, row) => {
      const cells = row.split('|').map((c: string) => c.trim())
      return '<tr>' + cells.map((c: string) => `<td>${c}</td>`).join('') + '</tr>'
    })
    .replace(/(<tr>.*<\/tr>\n?)+/g, (match) => {
      const rows = match.trim().split('\n')
      // First row is header, second is separator — skip separator
      const header = rows[0].replace(/<td>/g, '<th>').replace(/<\/td>/g, '</th>')
      const body = rows.slice(2).join('\n')
      return `<table><thead>${header}</thead><tbody>${body}</tbody></table>`
    })
    // Headings
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // Ordered list items
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, (match) => {
      if (/^\d/.test(match)) return `<ol>${match}</ol>`
      return `<ul>${match}</ul>`
    })
    // Unordered list items
    .replace(/^[-*] (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$1</ul>')
    // Blockquote
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    // HR
    .replace(/^---$/gm, '<hr />')
    // Paragraphs — wrap lines not already wrapped in a block tag
    .replace(/^(?!<[a-z]|$)(.+)$/gm, '<p>$1</p>')
    // Clean up extra blank lines
    .replace(/\n{3,}/g, '\n\n')
}

export function DocContent({ doc }: DocContentProps) {
  const html = renderMarkdown(doc.content)

  return (
    <article aria-label={doc.title} className="doc-content">
      <div
        className="prose-custom"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <p className="mt-10 text-xs text-[var(--text-secondary)] border-t border-[var(--border)] pt-4">
        Last updated:{' '}
        {doc.updatedAt.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </p>
    </article>
  )
}
