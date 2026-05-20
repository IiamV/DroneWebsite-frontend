'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { RegisterSchema, type RegisterInput } from '@/types/schemas/auth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/Toast'
import { createClient } from '@/lib/supabase/client'
import { ROUTES, localePath } from '@/constants/routes'

export function RegisterForm() {
  const t = useTranslations('auth')
  const locale = useLocale()
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, setError, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
  })

  const onSubmit = async (data: RegisterInput) => {
    setIsSubmitting(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { name: data.name } },
    })
    setIsSubmitting(false)
    if (error) {
      setError('root', { message: error.message })
      toast(error.message, 'error')
      return
    }
    toast(t('createAccount') + '!', 'success')
    router.push(localePath(locale, ''))
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

      {errors.root && (
        <p className="text-xs text-destructive text-center">{errors.root.message}</p>
      )}

      <Button type="submit" variant="default" size="lg" disabled={isSubmitting} className="w-full">
        {isSubmitting ? t('creatingAccount') : t('createAccount')}
      </Button>

      <p className="text-center text-sm text-[var(--text-secondary)]">
        {t('hasAccount')}{' '}
        <Link href={localePath(locale, ROUTES.AUTH_LOGIN)} className="font-medium text-[var(--accent)] underline-offset-4 hover:underline">
          {t('signIn')}
        </Link>
      </p>
    </form>
  )
}
