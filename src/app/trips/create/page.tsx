'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/layout/PageHeader'
import { ArrowLeft, Plus, X } from 'lucide-react'
import type { RouteStop } from '@/components/map/RouteMap'

const RouteMap = dynamic(() => import('@/components/map/RouteMap'), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center bg-slate-100 text-sm text-[var(--text-muted)]">Loading map…</div>,
})

const CANDIDATES: RouteStop[] = [
  { id: 'CD001', name: 'Cold drink multiplace', location: 'Crystal Clean, Norman', lat: 35.221, lng: -97.443 },
  { id: 'WF001', name: 'Wells Fargo Snack', location: 'Wells Fargo Bank, Edmond', lat: 35.652, lng: -97.478 },
  { id: 'WF002', name: 'Wells Fargo Drink', location: 'Wells Fargo Bank, Edmond', lat: 35.656, lng: -97.482 },
  { id: 'OR001', name: 'Omega Retreat Main', location: 'Omega Retreat, Mustang', lat: 35.384, lng: -97.724 },
  { id: 'IA001', name: 'Insurance Agency', location: 'Insurance Agency, OKC', lat: 35.468, lng: -97.521 },
  { id: 'TP1', name: 'Tech Park Office', location: 'OKC', lat: 35.512, lng: -97.56 },
]

export default function CreateTripPage() {
  const router = useRouter()
  const [stops, setStops] = useState<RouteStop[]>([])

  const available = CANDIDATES.filter((c) => !stops.some((s) => s.id === c.id))

  return (
    <div className="flex h-[calc(100vh-var(--topbar-height)-3rem)] flex-col">
      <Link href="/trips" className="mb-2 inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]">
        <ArrowLeft size={15} /> Back to Trips
      </Link>
      <PageHeader title="Create Trip" description={`${stops.length} stops added`}>
        <Button size="sm" variant="secondary" onClick={() => router.push('/trips')}>Cancel</Button>
        <Button size="sm" onClick={() => router.push('/trips')}>Save Trip</Button>
      </PageHeader>

      <div className="flex flex-1 min-h-0 gap-4">
        <aside className="hidden w-80 shrink-0 flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-card)] md:flex">
          <div className="space-y-3 border-b border-[var(--border)] p-3">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-[var(--text-muted)]">Date</span>
              <input type="date" defaultValue="2026-06-05" className="h-9 w-full rounded-lg border border-[var(--border)] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-[var(--text-muted)]">Driver</span>
              <select className="h-9 w-full rounded-lg border border-[var(--border)] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option>John Martinez</option><option>Maria Chen</option><option>Bob Williams</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-[var(--text-muted)]">Notes</span>
              <textarea rows={2} className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </label>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {stops.length > 0 && (
              <>
                <p className="px-2 py-1 text-xs font-semibold text-[var(--text-muted)]">Stops</p>
                <ol className="mb-3">
                  {stops.map((s, i) => (
                    <li key={s.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">{i + 1}</span>
                      <span className="min-w-0 flex-1 truncate text-sm">{s.name}</span>
                      <button onClick={() => setStops((p) => p.filter((x) => x.id !== s.id))} className="text-[var(--text-muted)] hover:text-red-600"><X size={14} /></button>
                    </li>
                  ))}
                </ol>
              </>
            )}
            <p className="px-2 py-1 text-xs font-semibold text-[var(--text-muted)]">Add machines</p>
            {available.map((c) => (
              <button
                key={c.id}
                onClick={() => setStops((p) => [...p, c])}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-slate-50"
              >
                <Plus size={14} className="shrink-0 text-blue-600" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{c.name}</span>
                  <span className="block truncate text-xs text-[var(--text-muted)]">{c.location}</span>
                </span>
              </button>
            ))}
          </div>
        </aside>

        <div className="relative flex-1 overflow-hidden rounded-xl border border-[var(--border)]">
          <RouteMap stops={stops} center={[35.45, -97.55]} />
        </div>
      </div>
    </div>
  )
}
