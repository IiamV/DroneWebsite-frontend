import { getTranslations } from 'next-intl/server'
import { Avatar } from '@/components/ui/avatar'
import type { User } from '@/types'

interface ProfileCardProps {
  user: User
  locale: string
}

export async function ProfileCard({ user, locale }: ProfileCardProps) {
  const t = await getTranslations({ locale, namespace: 'profileCard' })
  const initials = user.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)]">
      <div className="border-b border-[var(--border)] bg-[var(--bg-primary)] px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">{t('profile')}</p>
      </div>
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
        <Avatar src={user.avatarUrl} alt={user.name} size={84} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">{user.name}</h2>
            <span className="rounded-md border border-[var(--border)] bg-[var(--bg-primary)] px-2 py-1 text-xs font-semibold text-[var(--text-secondary)]">
              {initials}
            </span>
          </div>
          <p className="mt-1 break-all text-sm text-[var(--text-secondary)]">{user.email}</p>
          <p className="mt-3 text-xs text-[var(--text-secondary)]">
            {t('memberSince')} {user.createdAt.toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', { year: 'numeric', month: 'long' })}
          </p>
        </div>
      </div>
    </div>
  )
}
