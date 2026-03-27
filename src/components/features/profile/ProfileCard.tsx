import { getTranslations } from 'next-intl/server'
import { Avatar } from '@/components/ui/avatar'
import type { User } from '@/types'

interface ProfileCardProps {
  user: User
  locale: string
}

export async function ProfileCard({ user, locale }: ProfileCardProps) {
  const t = await getTranslations({ locale, namespace: 'profileCard' })

  return (
    <div className="flex items-center gap-4 p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)]">
      <Avatar src={user.avatarUrl} alt={user.name} size={72} />
      <div>
        <h2 className="text-xl font-bold text-[var(--text-primary)]">{user.name}</h2>
        <p className="text-sm text-[var(--text-secondary)] mt-0.5">{user.email}</p>
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          {t('memberSince')} {user.createdAt.toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', { year: 'numeric', month: 'long' })}
        </p>
      </div>
    </div>
  )
}
