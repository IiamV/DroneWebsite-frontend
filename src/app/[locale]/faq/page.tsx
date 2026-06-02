'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, CircleHelp, Code2, Download, ShieldCheck, Wrench } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'

interface FaqItem {
  question: string
  answer: string
}

const FEATURE_KEYS = [
  { icon: Wrench, key: 'build' },
  { icon: Code2, key: 'code' },
  { icon: Download, key: 'download' },
] as const

function FaqAccordion({ item, defaultOpen = false }: { item: FaqItem; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-[var(--border)]">
      <button
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-4 rounded py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-[var(--text-primary)]">{item.question}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-[var(--text-secondary)] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm leading-relaxed text-[var(--text-secondary)]">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FaqPage() {
  const t = useTranslations('faq')
  const locale = useLocale()
  const faqs: FaqItem[] = Array.from({ length: 8 }, (_, index) => {
    const number = index + 1
    return { question: t(`q${number}`), answer: t(`a${number}`) }
  })

  return (
    <main>
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.018]"
          aria-hidden="true"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h40v40H0z\' fill=\'none\' stroke=\'%23888\' stroke-width=\'.5\'/%3E%3C/svg%3E")' }}
        />
        <div className="relative max-w-[1100px] mx-auto px-6 py-16 md:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/20 bg-[var(--accent)]/5 px-3 py-1.5 text-xs font-medium text-[var(--accent)]">
                <CircleHelp size={13} />
                {t('eyebrow')}
              </span>
              <h1 className="mt-6 max-w-xl text-4xl font-extrabold leading-tight tracking-tight text-[var(--text-primary)] md:text-5xl">
                {t('title')}
              </h1>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">
                {t('subtitle')}
              </p>
            </div>

            <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[#1e1e1e] shadow-2xl shadow-black/10 dark:shadow-black/40">
              <div className="flex items-center gap-2 border-b border-white/[0.06] bg-[#252526] px-4 py-2">
                <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                <span className="flex-1 truncate text-center font-mono text-[11px] text-white/30">
                  support.workspace
                </span>
              </div>
              <div className="grid min-h-[260px] grid-cols-[44px_1fr]">
                <div className="border-r border-white/[0.06] bg-[#333333] py-4">
                  <div className="mx-auto mb-4 flex h-7 w-7 items-center justify-center rounded bg-white/10 text-white/70">
                    <CircleHelp size={15} />
                  </div>
                  <div className="mx-auto flex h-7 w-7 items-center justify-center text-white/35">
                    <ShieldCheck size={14} />
                  </div>
                </div>
                <div className="p-5">
                  <div className="mb-4 flex gap-2 font-mono text-xs">
                    <span className="rounded-t border-x border-t border-white/[0.08] bg-[#1e1e1e] px-3 py-1.5 text-white/65">
                      faq.{locale}.md
                    </span>
                    <span className="px-3 py-1.5 text-white/25">help.json</span>
                  </div>
                  <div className="grid gap-3">
                    {FEATURE_KEYS.map(({ icon: Icon, key }) => (
                      <div key={key} className="rounded border border-white/[0.08] bg-white/[0.03] p-4">
                        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-white/75">
                          <Icon size={15} className="text-[#10b981]" />
                          {t(`${key}Title`)}
                        </div>
                        <p className="text-xs leading-relaxed text-white/40">{t(`${key}Text`)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[900px] mx-auto px-6 py-14 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
          <aside>
            <div className="sticky top-24 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
                {t('sidebarTitle')}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                {t('sidebarText')}
              </p>
            </div>
          </aside>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] px-5 md:px-7">
            {faqs.map((faq, index) => (
              <FaqAccordion key={faq.question} item={faq} defaultOpen={index === 0} />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
