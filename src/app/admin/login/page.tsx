import type { Metadata } from 'next'
import { Logo } from '@/components/ui/Logo'
import { LoginForm } from '@/app/login/LoginForm'

export const metadata: Metadata = { title: 'Admin Sign In — SmartVendingOS' }

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-[var(--bg-page)] px-5 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo size={80} className="shrink-0" />
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Admin sign in</h1>
          <p className="mt-1.5 text-sm text-[var(--text-muted)]">
            Sign in to manage leads and demo accounts
          </p>
        </div>

        <LoginForm />

        <p className="mt-10 text-center text-xs text-[var(--text-muted)]/60">
          © {new Date().getFullYear()} SmartVendingOS
        </p>
      </div>
    </div>
  )
}
