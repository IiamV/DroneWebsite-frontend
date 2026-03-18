import { MDXRemote } from 'next-mdx-remote/rsc'
import type { DocPage } from '@/types'

interface DocContentProps {
  doc: DocPage
}

const mdxComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-2xl font-bold text-[var(--text-primary)] mt-0 mb-4" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-xl font-semibold text-[var(--text-primary)] mt-8 mb-3" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-lg font-semibold text-[var(--text-primary)] mt-6 mb-2" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-[var(--text-secondary)] leading-relaxed mb-4" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-disc list-inside space-y-1 mb-4 text-[var(--text-secondary)]" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal list-inside space-y-1 mb-4 text-[var(--text-secondary)]" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="leading-relaxed" {...props} />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code
      className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-1.5 py-0.5 text-sm font-mono text-[var(--text-primary)]"
      {...props}
    />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 overflow-x-auto text-sm font-mono text-[var(--text-primary)] mb-4"
      {...props}
    />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold text-[var(--text-primary)]" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      className="text-[var(--accent)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
      {...props}
    />
  ),
}

export function DocContent({ doc }: DocContentProps) {
  return (
    <article aria-label={doc.title}>
      <MDXRemote source={doc.content} components={mdxComponents} />
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
