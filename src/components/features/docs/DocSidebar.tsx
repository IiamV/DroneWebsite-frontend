'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
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
}

function NavItem({ node, currentSlug }: NavItemProps) {
  const href = '/docs/' + node.doc.slug.join('/')
  const isActive = node.doc.slug.join('/') === currentSlug.join('/')
  const hasChildren = node.children.length > 0
  const isParentOfActive =
    hasChildren && node.children.some((c) => c.doc.slug.join('/') === currentSlug.join('/'))

  const [open, setOpen] = useState(isActive || isParentOfActive)

  return (
    <li>
      <div className="flex items-center gap-0.5">
        {hasChildren ? (
          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? `Collapse ${node.doc.title}` : `Expand ${node.doc.title}`}
            className="p-1 rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] transition-colors shrink-0"
          >
            <ChevronRight
              size={12}
              className={cn('transition-transform duration-150', open && 'rotate-90')}
              aria-hidden="true"
            />
          </button>
        ) : (
          <span className="w-5 shrink-0" />
        )}
        <Link
          href={href}
          aria-current={isActive ? 'page' : undefined}
          className={cn(
            'flex-1 px-2 py-1.5 rounded-md text-sm transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]',
            isActive
              ? 'bg-[var(--accent)] text-[var(--bg-primary)] font-medium'
              : 'text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
          )}
        >
          {node.doc.title}
        </Link>
      </div>

      {hasChildren && open && (
        <ul className="mt-0.5 ml-5 space-y-0.5 border-l border-[var(--border)] pl-2">
          {node.children.map((child) => (
            <NavItem key={child.doc.id} node={child} currentSlug={currentSlug} />
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
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)] mb-3 px-2">
        Documentation
      </p>
      <ul className="space-y-0.5">
        {tree.map((node) => (
          <NavItem key={node.doc.id} node={node} currentSlug={currentSlug} />
        ))}
      </ul>
    </nav>
  )
}
