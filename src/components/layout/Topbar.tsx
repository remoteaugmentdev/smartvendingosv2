'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Printer, RefreshCw, User, Menu } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { useAuth } from '@/context/AuthContext'
import { en } from '@/locales/en'
import { cn } from '@/utils/cn'

export function Topbar() {
  const { toggleMobileSidebar } = useApp()
  const { user, profile, signOut } = useAuth()
  const pathname = usePathname()
  const [refreshing, setRefreshing] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const t = en

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

  const displayName = profile?.label ?? user?.email ?? 'Account'

  return (
    <header
      className="flex shrink-0 h-[var(--topbar-height)] items-center gap-4 border-b border-[var(--border)] bg-[var(--bg-card)] px-5"
    >
      {/* Mobile hamburger */}
      <button
        onClick={toggleMobileSidebar}
        className="md:hidden rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-slate-100"
        aria-label="Toggle sidebar"
      >
        <Menu size={20} />
      </button>

      {/* Page title */}
      <h1 className="text-base font-semibold text-[var(--text-primary)] shrink-0">{pageTitle}</h1>


      {/* Right actions */}
      <div className="flex items-center gap-2 ml-auto">

        <button
          onClick={() => window.print()}
          className="hidden sm:flex rounded-lg p-1.5 text-[var(--text-muted)] transition-colors hover:bg-slate-100 hover:text-[var(--text-primary)]"
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
              <Link
                href="/settings"
                onClick={() => setDropdownOpen(false)}
                className="block w-full px-3 py-2 text-left text-xs text-[var(--text-muted)] hover:bg-slate-50 hover:text-[var(--text-primary)]"
              >
                Settings
              </Link>
              <button
                onClick={() => {
                  setDropdownOpen(false)
                  signOut()
                }}
                className="w-full px-3 py-2 text-left text-xs text-[var(--text-muted)] hover:bg-slate-50 hover:text-[var(--text-primary)]"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
