import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col bg-white">
      {/* Top nav */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2">
            <Logo size={32} />
            <span className="font-bold text-slate-900">SmartVendKiosk</span>
          </Link>
          <nav className="flex items-center gap-1 sm:gap-4 text-sm font-medium">
            <Link href="/#features" className="hidden sm:block text-slate-600 hover:text-slate-900">Features</Link>
            <Link href="/pricing" className="text-slate-600 hover:text-slate-900">Pricing</Link>
            <Link href="/login" className="text-slate-600 hover:text-slate-900">Login</Link>
            <Link
              href="/signup"
              className="rounded-lg bg-blue-600 px-4 py-2 text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              Start Free
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
            {['Features', 'Pricing', 'Blog', 'Docs', 'Contact', 'Privacy', 'Terms'].map((l) => (
              <span key={l} className="cursor-pointer hover:text-slate-900">{l}</span>
            ))}
          </div>
          <p className="text-xs text-slate-400">© 2026 SmartVendKiosk by Remote Augment.</p>
        </div>
      </footer>
    </div>
  )
}
