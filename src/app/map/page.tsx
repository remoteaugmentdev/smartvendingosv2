'use client'

import { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { PageHeader } from '@/components/layout/PageHeader'
import { cn } from '@/utils/cn'
import { formatCurrency } from '@/utils/formatCurrency'
import { STATUS_COLOR, type MapMachine, type MapStatus } from '@/components/map/types'

const FleetMap = dynamic(() => import('@/components/map/FleetMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-slate-100 text-sm text-[var(--text-muted)]">
      Loading map…
    </div>
  ),
})

const MACHINES: MapMachine[] = [
  { id: 'CD001', name: 'Cold drink multiplace', location: 'Crystal Clean', status: 'online', revenueToday: 124.5, fill: 88, lastService: '3 days ago', lat: 35.221, lng: -97.443 },
  { id: 'CD002', name: 'Cold drink employee', location: 'Crystal Clean', status: 'online', revenueToday: 96.2, fill: 72, lastService: '3 days ago', lat: 35.225, lng: -97.447 },
  { id: 'CD003', name: 'Cold drink multiplex', location: 'Crystal Clean', status: 'offline', revenueToday: 32.0, fill: 0, lastService: '12 days ago', lat: 35.218, lng: -97.438 },
  { id: 'WF001', name: 'Wells Fargo Snack', location: 'Wells Fargo Bank', status: 'tech', revenueToday: 188.4, fill: 45, lastService: 'Today', lat: 35.652, lng: -97.478 },
  { id: 'WF002', name: 'Wells Fargo Drink', location: 'Wells Fargo Bank', status: 'low', revenueToday: 142.1, fill: 31, lastService: '6 days ago', lat: 35.656, lng: -97.482 },
  { id: 'WF003', name: 'Wells Fargo Combo', location: 'Wells Fargo Bank', status: 'online', revenueToday: 110.7, fill: 67, lastService: '5 days ago', lat: 35.649, lng: -97.474 },
  { id: 'IA001', name: 'Insurance Agency', location: 'Insurance Agency', status: 'online', revenueToday: 78.9, fill: 82, lastService: '8 days ago', lat: 35.468, lng: -97.521 },
  { id: 'OR001', name: 'Omega Retreat Main', location: 'Omega Retreat', status: 'online', revenueToday: 134.0, fill: 55, lastService: '4 days ago', lat: 35.384, lng: -97.724 },
]

const FILTERS: { key: 'all' | MapStatus; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'online', label: 'Online' },
  { key: 'offline', label: 'Offline' },
  { key: 'low', label: 'Low Stock' },
]

export default function MapPage() {
  const [filter, setFilter] = useState<'all' | MapStatus>('all')

  const machines = useMemo(
    () => (filter === 'all' ? MACHINES : MACHINES.filter((m) => m.status === filter || (filter === 'online' && m.status === 'tech'))),
    [filter]
  )

  return (
    <div className="flex h-[calc(100vh-var(--topbar-height)-3rem)] flex-col">
      <PageHeader title="Live Fleet Map" description={`${MACHINES.length} machines across the metro`} />

      <div className="flex flex-1 min-h-0 overflow-hidden rounded-xl border border-[var(--border)]">
        {/* Left panel */}
        <aside className="hidden w-80 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--bg-card)] md:flex">
          <div className="flex flex-wrap gap-1 border-b border-[var(--border)] p-3">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                  filter === f.key ? 'bg-blue-600 text-white' : 'text-[var(--text-muted)] hover:bg-slate-100'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto">
            {machines.map((m) => (
              <div key={m.id} className="flex items-center gap-3 border-b border-[var(--border)] px-3 py-2.5">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: STATUS_COLOR[m.status] }} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[var(--text-primary)]">{m.name}</p>
                  <p className="truncate text-xs text-[var(--text-muted)]">{m.location}</p>
                </div>
                <span className="shrink-0 text-xs font-medium">{formatCurrency(m.revenueToday, 0)}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Map */}
        <div className="relative flex-1">
          <FleetMap machines={machines} center={[35.42, -97.55]} />
        </div>
      </div>
    </div>
  )
}
