'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Printer, RefreshCw, User, Menu } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { useDateRange } from '@/context/DateRangeContext'
import { useAuth } from '@/context/AuthContext'
import { en } from '@/locales/en'
import { fr } from '@/locales/fr'
import { cn } from '@/utils/cn'

export function Topbar() {
  const { toggleSidebar, lang, setLang } = useApp()
  const { startDate, endDate, setStartDate, setEndDate } = useDateRange()
  const { user, profile, signOut } = useAuth()
  const pathname = usePathname()
  const [refreshing, setRefreshing] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const t = lang === 'fr' ? fr : en

  // Derive page title from pathname segments
  const segments = pathname.split('/').filter(Boolean)
  // Try last segment first, then first segment (for /admin/dashboard → 'dashboard')
  const lastSeg = segments[segments.length - 1] as keyof typeof en.pages
  const firstSeg = segments[0] as keyof typeof en.pages
  const pageTitle =
    t.pages[lastSeg] ??
    t.pages[firstSeg] ??
    'SmartVendKiosk'

  function handleRefresh() {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1200)
  }

  function formatInputDate(d: Date | null) {
    if (!d) return ''
    return d.toISOString().split('T')[0]
  }

  const displayName = profile?.label ?? user?.email ?? 'Account'

  return (
    <header
      className="flex shrink-0 h-[var(--topbar-height)] items-center gap-4 border-b border-[var(--border)] bg-[var(--bg-card)] px-5"
    >
      {/* Mobile hamburger */}
      <button
        onClick={toggleSidebar}
        className="md:hidden rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-slate-100"
        aria-label="Toggle sidebar"
      >
        <Menu size={20} />
      </button>

      {/* Page title */}
      <h1 className="text-base font-semibold text-[var(--text-primary)] shrink-0">{pageTitle}</h1>

      {/* Date range picker */}
      <div className="mx-auto flex items-center gap-2">
        <input
          type="date"
          value={formatInputDate(startDate)}
          onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : null)}
          className="rounded-md border border-[var(--border)] px-2 py-1 text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="text-xs text-[var(--text-muted)]">to</span>
        <input
          type="date"
          value={formatInputDate(endDate)}
          onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : null)}
          className="rounded-md border border-[var(--border)] px-2 py-1 text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 ml-auto">

        {/* FR / EN language toggle */}
        <div className="flex items-center rounded-full border border-[var(--border)] bg-slate-50 p-0.5 text-xs font-medium">
          <button
            onClick={() => setLang('en')}
            className={cn(
              'rounded-full px-2.5 py-1 transition-colors',
              lang === 'en'
                ? 'bg-white text-[var(--accent-primary)] shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            )}
          >
            EN
          </button>
          <button
            onClick={() => setLang('fr')}
            className={cn(
              'rounded-full px-2.5 py-1 transition-colors',
              lang === 'fr'
                ? 'bg-white text-[var(--accent-primary)] shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            )}
          >
            FR
          </button>
        </div>

        <button
          onClick={() => window.print()}
          className="rounded-lg p-1.5 text-[var(--text-muted)] transition-colors hover:bg-slate-100 hover:text-[var(--text-primary)]"
          aria-label="Print"
        >
          <Printer size={18} />
        </button>
        <button
          onClick={handleRefresh}
          className="rounded-lg p-1.5 text-[var(--text-muted)] transition-colors hover:bg-slate-100 hover:text-[var(--text-primary)]"
          aria-label="Refresh"
        >
          <RefreshCw size={18} className={cn(refreshing && 'animate-spin')} />
        </button>

        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((p) => !p)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-[var(--text-muted)] hover:bg-slate-300"
            aria-label="User menu"
          >
            <User size={16} />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] py-1 shadow-[var(--shadow-hover)]">
              <div className="px-3 py-2">
                <p className="text-xs font-medium text-[var(--text-primary)] truncate">
                  {displayName}
                </p>
                {profile?.role === 'demo' && (
                  <span className="mt-0.5 inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                    Demo account
                  </span>
                )}
              </div>
              <hr className="border-[var(--border)]" />
              <button
                onClick={() => {
                  setDropdownOpen(false)
                  signOut()
                }}
                className="w-full px-3 py-2 text-left text-xs text-[var(--text-muted)] hover:bg-slate-50 hover:text-[var(--text-primary)]"
              >
                {lang === 'fr' ? 'Se déconnecter' : 'Sign out'}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
