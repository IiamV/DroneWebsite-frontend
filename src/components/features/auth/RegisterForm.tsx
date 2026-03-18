'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { RegisterSchema, type RegisterInput } from '@/types/schemas/auth'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { ROUTES } from '@/constants/routes'

export function RegisterForm() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
  })

  const onSubmit = async (_data: RegisterInput) => {
    setIsSubmitting(true)
    // Mock: no backend call yet
    await new Promise((r) => setTimeout(r, 500))
    toast('Account created! (mock)', 'success')
    setIsSubmitting(false)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-5"
      aria-label="Register form"
    >
      <Input
        label="Name"
        type="text"
        autoComplete="name"
        placeholder="Your name"
        error={errors.name?.message}
        {...register('name')}
      />
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        label="Password"
        type="password"
        autoComplete="new-password"
        placeholder="Min. 8 characters"
        error={errors.password?.message}
        {...register('password')}
      />

      <Button type="submit" variant="primary" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Creating account…' : 'Create account'}
      </Button>

      <p className="text-center text-sm text-[var(--text-secondary)]">
        Already have an account?{' '}
        <Link
          href={ROUTES.AUTH_LOGIN}
          className="font-medium text-[var(--accent)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
        >
          Sign in
        </Link>
      </p>
    </form>
  )
}
