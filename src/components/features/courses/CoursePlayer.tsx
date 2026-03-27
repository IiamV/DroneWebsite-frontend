'use client'

import type { CourseModule } from '@/types'

interface CoursePlayerProps {
  module: CourseModule
}

function renderMarkdown(md: string): string {
  return md
    // Fenced code blocks
    .replace(/```[\w]*\n([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Headings
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold + italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // Ordered list items
    .replace(/^\d+\. (.+)$/gm, '<li data-ol>$1</li>')
    // Unordered list items
    .replace(/^[-*] (.+)$/gm, '<li>$1</li>')
    // Wrap consecutive <li data-ol> in <ol>
    .replace(/(<li data-ol>.*<\/li>\n?)+/g, (m) => `<ol>${m.replace(/ data-ol/g, '')}</ol>`)
    // Wrap consecutive <li> (not inside ol) in <ul>
    .replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`)
    // Blockquote
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    // HR
    .replace(/^---$/gm, '<hr />')
    // Paragraphs
    .replace(/^(?!<[a-z/]|$)(.+)$/gm, '<p>$1</p>')
    .replace(/\n{3,}/g, '\n\n')
}

export function CoursePlayer({ module }: CoursePlayerProps) {
  const html = renderMarkdown(module.content)

  return (
    <article className="max-w-none" aria-label={module.title}>
      {module.videoUrl && (
        <div className="mb-6 rounded-lg overflow-hidden bg-black aspect-video">
          <video
            key={module.videoUrl}
            controls
            className="w-full h-full"
            preload="metadata"
            aria-label={`Video for ${module.title}`}
          >
            <source src={module.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
      <div
        className="prose-custom"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  )
}
