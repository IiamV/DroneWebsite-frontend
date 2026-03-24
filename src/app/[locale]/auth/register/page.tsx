import { RegisterForm } from '@/components/features/auth/RegisterForm'

export const metadata = {
  title: 'Create Account — Drone Simulation Platform',
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Create an account</h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Join the Drone Simulation Platform
          </p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-8 shadow-sm">
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
