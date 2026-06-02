import { ArrowUpRight, CheckCircle2, CircleDot, GitCommitHorizontal, PackageCheck } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { unstable_noStore as noStore } from 'next/cache'

export const dynamic = 'force-dynamic'

type Locale = 'en' | 'vi'

interface Update {
  version: string
  date: string
  title: string
  summary: string
  changes: string[]
}

const UPDATES: Record<Locale, Update[]> = {
  en: [
    {
      version: '1.0.0',
      date: '2024-03-01',
      title: 'Drone Application by Insai initial release',
      summary: 'The first public build of the desktop IDE, focused on building, wiring, coding, simulating, and exporting quadcopter projects in one workspace.',
      changes: [
        'Drag-and-drop assembly for frames, motors, ESCs, flight controllers, batteries, cameras, and props.',
        'Visual wiring workspace with pad-to-pad connections across core electronics.',
        'Block code and text code editors for flight behavior experiments.',
        'Physics simulation with hover, throttle response, PID tuning, and crash testing.',
        'Performance analytics for weight, thrust-to-weight ratio, current draw, and flight time.',
        'Build export with parts lists, purchase links, wiring notes, and assembly steps.',
      ],
    },
    {
      version: '0.9.0',
      date: '2024-02-12',
      title: 'Release candidate workspace polish',
      summary: 'Final pre-release pass on the VS Code-inspired workspace, component data, and simulator onboarding.',
      changes: [
        'Refined IDE frame, activity panels, and editor tabs for clearer navigation.',
        'Expanded component catalog metadata and compatibility signals.',
        'Improved download, docs, pricing, and account flows for bilingual users.',
      ],
    },
  ],
  vi: [
    {
      version: '1.0.0',
      date: '2024-03-01',
      title: 'Phát hành đầu tiên Drone Application by Insai',
      summary: 'Bản public đầu tiên của IDE desktop, tập trung vào lắp ráp, đấu dây, lập trình, mô phỏng và xuất bản dựng quadcopter trong cùng một workspace.',
      changes: [
        'Lắp ráp kéo-thả cho khung, motor, ESC, bộ điều khiển bay, pin, camera và cánh quạt.',
        'Workspace đấu dây trực quan với kết nối pad-to-pad giữa các mạch chính.',
        'Trình soạn block code và text code để thử nghiệm hành vi bay.',
        'Mô phỏng vật lý với hover, phản hồi ga, tinh chỉnh PID và kiểm thử va chạm.',
        'Phân tích hiệu suất gồm trọng lượng, tỷ lệ lực đẩy/trọng lượng, dòng tiêu thụ và thời gian bay.',
        'Xuất bản dựng với danh sách linh kiện, liên kết mua hàng, ghi chú đấu dây và các bước lắp ráp.',
      ],
    },
    {
      version: '0.9.0',
      date: '2024-02-12',
      title: 'Hoàn thiện release candidate',
      summary: 'Lượt hoàn thiện trước phát hành cho workspace lấy cảm hứng từ VS Code, dữ liệu linh kiện và trải nghiệm bắt đầu mô phỏng.',
      changes: [
        'Tinh chỉnh khung IDE, activity panel và tab editor để điều hướng rõ hơn.',
        'Mở rộng metadata danh mục linh kiện và tín hiệu tương thích.',
        'Cải thiện luồng tải xuống, tài liệu, bảng giá và tài khoản cho người dùng song ngữ.',
      ],
    },
  ],
}

function formatDate(date: string, locale: string) {
  return new Intl.DateTimeFormat(locale === 'vi' ? 'vi-VN' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(`${date}T00:00:00Z`))
}

export default async function UpdatesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  noStore()
  const { locale } = await params
  const safeLocale: Locale = locale === 'vi' ? 'vi' : 'en'
  const t = await getTranslations({ locale, namespace: 'updates' })
  const updates = UPDATES[safeLocale]

  return (
    <main>
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.018]"
          aria-hidden="true"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h40v40H0z\' fill=\'none\' stroke=\'%23888\' stroke-width=\'.5\'/%3E%3C/svg%3E")' }}
        />
        <div className="relative max-w-[1100px] mx-auto px-6 py-16 md:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/20 bg-[var(--accent)]/5 px-3 py-1.5 text-xs font-medium text-[var(--accent)]">
                <PackageCheck size={13} />
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
                  release-notes.md
                </span>
              </div>
              <div className="grid min-h-[260px] grid-cols-[44px_1fr]">
                <div className="border-r border-white/[0.06] bg-[#333333] py-4">
                  <div className="mx-auto mb-4 flex h-7 w-7 items-center justify-center rounded bg-white/10 text-white/70">
                    <GitCommitHorizontal size={15} />
                  </div>
                  <div className="mx-auto flex h-7 w-7 items-center justify-center text-white/35">
                    <CircleDot size={14} />
                  </div>
                </div>
                <div className="p-5 font-mono text-xs">
                  <div className="mb-4 flex gap-2">
                    <span className="rounded-t border-x border-t border-white/[0.08] bg-[#1e1e1e] px-3 py-1.5 text-white/65">
                      changelog.ts
                    </span>
                    <span className="px-3 py-1.5 text-white/25">build.json</span>
                  </div>
                  <div className="space-y-2 text-white/55">
                    <p><span className="text-white/25">01</span> <span className="text-[#569cd6]">version</span>: <span className="text-[#ce9178]">&quot;{updates[0].version}&quot;</span></p>
                    <p><span className="text-white/25">02</span> <span className="text-[#569cd6]">status</span>: <span className="text-[#b5cea8]">{t('stable')}</span></p>
                    <p><span className="text-white/25">03</span> <span className="text-[#569cd6]">platforms</span>: <span className="text-[#ce9178]">&quot;Windows · macOS · Linux&quot;</span></p>
                    <p>
                      <span className="text-white/25">04</span>{' '}
                      <span className="text-[#6a9955]">{`// ${t('codeComment')}`}</span>
                    </p>
                  </div>
                  <div className="mt-6 rounded border border-white/[0.08] bg-white/[0.03] p-3 text-white/55">
                    <div className="mb-2 flex items-center gap-2 text-white/70">
                      <CheckCircle2 size={14} className="text-[#10b981]" />
                      {t('latestBuild')}
                    </div>
                    <p className="leading-relaxed text-white/35">{updates[0].summary}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[900px] mx-auto px-6 py-14 md:py-20">
        <div className="space-y-10">
          {updates.map((update) => (
            <article key={update.version} className="relative border-l-2 border-[var(--border)] pl-6">
              <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 border-[var(--accent)] bg-[var(--bg-primary)]" />
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center rounded-md bg-[var(--accent)] px-2.5 py-1 text-xs font-bold text-[var(--bg-primary)]">
                  v{update.version}
                </span>
                <span className="text-xs text-[var(--text-secondary)]">{formatDate(update.date, locale)}</span>
              </div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">{update.title}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)]">
                {update.summary}
              </p>
              <ul className="mt-5 grid gap-2">
                {update.changes.map((change) => (
                  <li key={change} className="flex items-start gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-3 text-sm text-[var(--text-secondary)]">
                    <ArrowUpRight size={14} className="mt-0.5 shrink-0 text-[var(--accent)]" />
                    <span>{change}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
