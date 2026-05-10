'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Bot,
  Package,
  ShieldCheck,
  Archive,
  ShoppingCart,
  BarChart3,
  Bell,
  Users,
  FileText,
  MapPin,
  UserCircle,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { Logo } from '@/components/ui/Logo'
import { cn } from '@/utils/cn'
import { en } from '@/locales/en'
import { fr } from '@/locales/fr'

const NAV_ITEMS: { href: string; navKey: keyof typeof en.nav; Icon: LucideIcon }[] = [
  { href: '/dashboard',        navKey: 'dashboard',    Icon: LayoutDashboard },
  { href: '/machines',        navKey: 'machines',     Icon: Bot },
  { href: '/products',        navKey: 'products',     Icon: Package },
  { href: '/siret-mapping',   navKey: 'siretMapping', Icon: ShieldCheck },
  { href: '/inventory',       navKey: 'inventory',    Icon: Archive },
  { href: '/orders',          navKey: 'orders',       Icon: ShoppingCart },
  { href: '/data-center',     navKey: 'dataCenter',   Icon: BarChart3 },
  { href: '/alerts',          navKey: 'alerts',       Icon: Bell },
  { href: '/users',           navKey: 'users',        Icon: Users },
  { href: '/reports',         navKey: 'reports',      Icon: FileText },
  { href: '/routes',          navKey: 'routes',       Icon: MapPin },
  { href: '/profile',         navKey: 'profile',      Icon: UserCircle },
]

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, mobileSidebarOpen, closeMobileSidebar, lang } = useApp()
  const pathname = usePathname()
  const t = lang === 'fr' ? fr : en

  const navItems = (
    <nav className="flex flex-1 min-h-0 flex-col gap-0.5 overflow-y-auto py-3 px-2">
      {NAV_ITEMS.map(({ href, navKey, Icon }) => {
        const label = t.nav[navKey]
        const active = pathname === href || pathname.startsWith(href + '/')
        return (
          <Link
            key={href}
            href={href}
            onClick={closeMobileSidebar}
            title={sidebarCollapsed ? label : undefined}
            className={cn(
              'relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              active
                ? 'bg-[var(--bg-active)] text-[var(--accent-primary)]'
                : 'text-[var(--text-muted)] hover:bg-slate-50 hover:text-[var(--text-primary)]'
            )}
          >
            {active && (
              <span className="absolute inset-y-0 left-0 w-[3px] rounded-r-full bg-[var(--sidebar-active-border)]" />
            )}
            <Icon size={18} className="shrink-0" />
            <span className="whitespace-nowrap overflow-hidden transition-opacity duration-300">
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside
        className={cn(
          'hidden md:flex shrink-0 flex-col overflow-hidden bg-[var(--bg-sidebar)] border-r border-[var(--border)] transition-[width] duration-300 ease-in-out',
          sidebarCollapsed ? 'w-[var(--sidebar-collapsed)]' : 'w-[var(--sidebar-width)]'
        )}
      >
        <div className="shrink-0 flex h-[var(--topbar-height)] items-center justify-center border-b border-[var(--border)] px-3">
          <Logo />
        </div>

        <nav className="flex flex-1 min-h-0 flex-col gap-0.5 overflow-y-auto py-3 px-2">
          {NAV_ITEMS.map(({ href, navKey, Icon }) => {
            const label = t.nav[navKey]
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                title={sidebarCollapsed ? label : undefined}
                className={cn(
                  'relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-[var(--bg-active)] text-[var(--accent-primary)]'
                    : 'text-[var(--text-muted)] hover:bg-slate-50 hover:text-[var(--text-primary)]'
                )}
              >
                {active && (
                  <span className="absolute inset-y-0 left-0 w-[3px] rounded-r-full bg-[var(--sidebar-active-border)]" />
                )}
                <Icon size={18} className="shrink-0" />
                <span
                  className="whitespace-nowrap overflow-hidden transition-opacity duration-300"
                  style={{ opacity: sidebarCollapsed ? 0 : 1 }}
                >
                  {label}
                </span>
              </Link>
            )
          })}
        </nav>

        <div className="shrink-0 border-t border-[var(--border)] p-2">
          <button
            onClick={toggleSidebar}
            className="flex w-full items-center justify-center rounded-lg p-2 text-[var(--text-muted)] transition-colors hover:bg-slate-100 hover:text-[var(--text-primary)]"
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </aside>

      {/* ── Mobile sidebar overlay ── */}
      <div
        className={cn(
          'md:hidden fixed inset-0 z-40 transition-opacity duration-300',
          mobileSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={closeMobileSidebar}
        />

        {/* Drawer */}
        <aside
          className={cn(
            'absolute inset-y-0 left-0 flex w-64 flex-col bg-[var(--bg-sidebar)] shadow-xl transition-transform duration-300 ease-in-out',
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="shrink-0 flex h-[var(--topbar-height)] items-center justify-center border-b border-[var(--border)] px-3">
            <Logo />
          </div>
          {navItems}
        </aside>
      </div>
    </>
  )
}
