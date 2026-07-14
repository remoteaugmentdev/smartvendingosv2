import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col bg-white">
      {/* Top nav */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2">
            <Logo size={40} />
            <span className="bg-gradient-to-r from-blue-600 to-blue-950 bg-clip-text text-xl font-bold tracking-tight text-transparent">SmartVendingOS</span>
          </Link>
          {/* Sign-in link hidden for now; demo access goes through the lead form */}
          <nav className="flex items-center text-sm font-medium">
            <Link
              href="/#demo"
              className="rounded-lg bg-blue-600 px-4 py-2 text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              Start Interactive Demo
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  )
}
