import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { LoginForm } from './LoginForm'

export const metadata: Metadata = { title: 'Sign In — SmartVendingOS' }

const FEATURES = [
  {
    title: 'Real-time analytics',
    desc: 'Live revenue, expense & profit tracking across all machines',
  },
  {
    title: 'Fleet & machine management',
    desc: 'Monitor status, inventory levels, and alerts at every location',
  },
  {
    title: 'Driver trip scheduling',
    desc: 'Optimise restocking routes and track every trip end-to-end',
  },
]

type Props = { searchParams: Promise<{ reason?: string }> }

export default async function LoginPage({ searchParams }: Props) {
  const { reason } = await searchParams

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* ── Brand panel ── */}
      <div
        className="relative flex flex-col justify-between overflow-hidden px-8 py-10 md:min-h-screen md:w-[58%]"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%)',
        }}
      >


        {/* Center content */}
        <div className="relative py-16">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-blue-400">
            Vending Operations Platform
          </p>
          <h2 className="mb-8 text-3xl font-bold leading-snug text-white md:text-4xl">
            The OS for modern<br />vending operations
          </h2>
          <ul className="space-y-5">
            {FEATURES.map(({ title, desc }) => (
              <li key={title} className="flex items-start gap-3">
                <CheckCircle2
                  size={18}
                  className="mt-0.5 shrink-0 text-blue-400"
                  strokeWidth={2.5}
                />
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-blue-200">{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom */}
        <p className="relative text-xs text-blue-400/50">
          © {new Date().getFullYear()} SmartVendingOS · All rights reserved
        </p>
      </div>

      {/* ── Form panel ── */}
      <div className="relative flex flex-1 flex-col items-center justify-center bg-[var(--bg-page)] px-6 py-16 md:px-12">
        {/* Back button */}
        <Link 
          href="/"
          className="absolute left-6 top-8 flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors md:left-12"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>

        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <Logo size={50} className="shrink-0" />
          </div>

          {/* Expired banner */}
          {reason === 'expired' && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5">
              <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-600" />
              <p className="text-sm text-amber-800">
                Your demo access has expired. Please contact us to continue.
              </p>
            </div>
          )}

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Welcome back</h1>
            <p className="mt-1.5 text-sm text-[var(--text-muted)]">
              Sign in to your SmartVendingOS account
            </p>
          </div>

          <LoginForm />

          <p className="mt-10 text-center text-xs text-[var(--text-muted)]/60">
            © {new Date().getFullYear()} SmartVendingOS
          </p>
        </div>
      </div>
    </div>
  )
}
