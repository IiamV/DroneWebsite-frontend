'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { DocPage } from '@/types'

interface DocSidebarProps {
  docs: DocPage[]
  currentSlug: string[]
}

interface TreeNode {
  doc: DocPage
  children: TreeNode[]
}

function buildTree(docs: DocPage[]): TreeNode[] {
  const roots = docs
    .filter((d) => d.parentSlug === null)
    .sort((a, b) => a.order - b.order)

  return roots.map((root) => ({
    doc: root,
    children: docs
      .filter((d) => d.parentSlug === root.slug[0])
      .sort((a, b) => a.order - b.order)
      .map((child) => ({ doc: child, children: [] })),
  }))
}

interface NavItemProps {
  node: TreeNode
  currentSlug: string[]
  depth: number
}

function NavItem({ node, currentSlug, depth }: NavItemProps) {
  const href = '/docs/' + node.doc.slug.join('/')
  const isActive = node.doc.slug.join('/') === currentSlug.join('/')
  const hasChildren = node.children.length > 0
  const isParentOfActive =
    hasChildren && node.children.some((c) => c.doc.slug.join('/') === currentSlug.join('/'))

  const [open, setOpen] = useState(isActive || isParentOfActive)

  return (
    <li>
      <div className="flex items-center gap-1">
        {hasChildren && (
          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? `Collapse ${node.doc.title}` : `Expand ${node.doc.title}`}
            className="p-1 rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] transition-colors"
          >
            <svg
              className={`w-3 h-3 transition-transform ${open ? 'rotate-90' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
        <Link
          href={href}
          aria-current={isActive ? 'page' : undefined}
          className={[
            'flex-1 px-2 py-1.5 rounded-md text-sm transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]',
            !hasChildren && 'ml-5',
            isActive
              ? 'bg-[var(--accent)] text-[var(--bg-primary)] font-medium'
              : 'text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {node.doc.title}
        </Link>
      </div>

      {hasChildren && open && (
        <ul className="mt-1 ml-4 space-y-1 border-l border-[var(--border)] pl-3">
          {node.children.map((child) => (
            <NavItem key={child.doc.id} node={child} currentSlug={currentSlug} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  )
}

export function DocSidebar({ docs, currentSlug }: DocSidebarProps) {
  const tree = buildTree(docs)

  return (
    <nav aria-label="Documentation navigation">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)] mb-3 px-2">
        Documentation
      </h2>
      <ul className="space-y-1">
        {tree.map((node) => (
          <NavItem key={node.doc.id} node={node} currentSlug={currentSlug} depth={0} />
        ))}
      </ul>
    </nav>
  )
}
