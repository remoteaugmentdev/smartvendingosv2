import { Logo } from '@/components/ui/Logo'
import { LogoutButton } from './LogoutButton'

export const metadata = { title: 'Admin — SmartVendingOS' }

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg-page)]">
      <header className="border-b border-[var(--border)] bg-white px-6">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Logo size={26} />
            <span className="text-sm font-bold text-[var(--text-primary)]">
              SmartVendingOS <span className="font-normal text-[var(--text-muted)]">/ Admin</span>
            </span>
          </div>
          <nav className="flex items-center gap-5 text-sm font-medium text-[var(--text-muted)]">
            <LogoutButton />
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-6 py-8">{children}</main>
    </div>
  )
}
