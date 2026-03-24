'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { RegisterSchema, type RegisterInput } from '@/types/schemas/auth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/Toast'
import { useAuth } from '@/components/layout/AuthProvider'
import { ROUTES } from '@/constants/routes'

export function RegisterForm() {
  const t = useTranslations('auth')
  const { toast } = useToast()
  const { login } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
  })

  const onSubmit = async (_data: RegisterInput) => {
    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 500))
    login()
    toast(t('createAccount') + '!', 'success')
    router.push(ROUTES.HOME)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5" aria-label="Register form">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="reg-name">{t('name')}</Label>
        <Input id="reg-name" type="text" autoComplete="name" placeholder={t('namePlaceholder')} aria-invalid={!!errors.name} {...register('name')} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="reg-email">{t('email')}</Label>
        <Input id="reg-email" type="email" autoComplete="email" placeholder={t('emailPlaceholder')} aria-invalid={!!errors.email} {...register('email')} />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="reg-password">{t('password')}</Label>
        <Input id="reg-password" type="password" autoComplete="new-password" placeholder={t('minPassword')} aria-invalid={!!errors.password} {...register('password')} />
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
      </div>

      <Button type="submit" variant="default" size="lg" disabled={isSubmitting} className="w-full">
        {isSubmitting ? t('creatingAccount') : t('createAccount')}
      </Button>

      <p className="text-center text-sm text-[var(--text-secondary)]">
        {t('hasAccount')}{' '}
        <Link href={ROUTES.AUTH_LOGIN} className="font-medium text-[var(--accent)] underline-offset-4 hover:underline">
          {t('signIn')}
        </Link>
      </p>
    </form>
  )
}
