'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { LoginSchema, type LoginInput } from '@/types/schemas/auth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/Toast'
import { useAuth } from '@/components/layout/AuthProvider'
import { ROUTES } from '@/constants/routes'

export function LoginForm() {
  const t = useTranslations('auth')
  const { toast } = useToast()
  const { login } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
  })

  const onSubmit = async (_data: LoginInput) => {
    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 500))
    login()
    toast(t('signIn') + '!', 'success')
    router.push(ROUTES.HOME)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5" aria-label="Login form">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="login-email">{t('email')}</Label>
        <Input id="login-email" type="email" autoComplete="email" placeholder={t('emailPlaceholder')} aria-invalid={!!errors.email} {...register('email')} />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="login-password">{t('password')}</Label>
        <Input id="login-password" type="password" autoComplete="current-password" placeholder={t('passwordPlaceholder')} aria-invalid={!!errors.password} {...register('password')} />
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
      </div>

      <Button type="submit" variant="default" size="lg" disabled={isSubmitting} className="w-full">
        {isSubmitting ? t('signingIn') : t('signIn')}
      </Button>

      <p className="text-center text-sm text-[var(--text-secondary)]">
        {t('noAccount')}{' '}
        <Link href={ROUTES.AUTH_REGISTER} className="font-medium text-[var(--accent)] underline-offset-4 hover:underline">
          {t('register')}
        </Link>
      </p>
    </form>
  )
}
