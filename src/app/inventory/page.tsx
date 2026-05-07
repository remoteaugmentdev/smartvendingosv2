// FILE: src/app/inventory/page.tsx
'use client'

import { useState } from 'react'
import { Search, X, PackageOpen } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'
import { PageHeader } from '@/components/layout/PageHeader'
import { cn } from '@/utils/cn'
import { ldaMachines, ldaSlots, ldaProducts } from '@/data/lda'
import { useTranslation } from '@/hooks/useTranslation'

// ─── Helpers ──────────────────────────────────────────────────────────────────
function shortageRateColor(rate: number) {
  if (rate === 0)  return 'text-emerald-600'
  if (rate <= 5)   return 'text-amber-600'
  return 'text-red-600'
}

function progressColor(rate: number) {
  if (rate === 0)  return 'bg-emerald-500'
  if (rate <= 5)   return 'bg-amber-500'
  return 'bg-red-500'
}

export default function InventoryPage() {
  const t = useTranslation()
  const [search, setSearch]               = useState('')
  const [routeFilter, setRouteFilter]     = useState('all')
  const [selectedMachines, setSelectedMachines] = useState<string[]>([])
  const [sheetMachineId, setSheetMachineId] = useState<string | null>(null)
  const [showSummaryModal, setShowSummaryModal] = useState(false)
  const [toast, setToast]                 = useState('')

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 4000)
  }

  // Unique routes from machines
  const routes = Array.from(new Set(ldaMachines.map((m) => m.route)))

  const filteredMachines = ldaMachines.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
                        m.id.includes(search) ||
                        m.location.toLowerCase().includes(search.toLowerCase())
    const matchRoute  = routeFilter === 'all' || m.route === routeFilter
    return matchSearch && matchRoute
  })

  const allSelected = filteredMachines.length > 0 &&
    filteredMachines.every((m) => selectedMachines.includes(m.id))

  function toggleSelectAll() {
    if (allSelected) setSelectedMachines([])
    else setSelectedMachines(filteredMachines.map((m) => m.id))
  }

  function toggleMachine(id: string) {
    setSelectedMachines((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  // Slots for the shortage sheet
  const sheetSlots = sheetMachineId
    ? ldaSlots.filter((s) => s.machineId === sheetMachineId && s.inventory < s.capacity)
    : []

  // All slots where inventory < reorderLevel (for summary modal)
  const shortageSlots = ldaSlots.filter((s) => {
    const product = ldaProducts.find((p) => p.id === s.productId)
    return product ? s.inventory < product.reorderLevel : false
  })

  // Aggregate shortage summary: product → { total shortage, machine count }
  const shortageSummary = shortageSlots.reduce<Record<string, { product: string; shortage: number; machines: Set<string> }>>(
    (acc, s) => {
      if (!acc[s.productId]) {
        acc[s.productId] = { product: s.product, shortage: 0, machines: new Set() }
      }
      acc[s.productId].shortage  += s.capacity - s.inventory
      acc[s.productId].machines.add(s.machineId)
      return acc
    },
    {}
  )

  const sheetMachine = ldaMachines.find((m) => m.id === sheetMachineId)

  return (
    <div className="mx-auto max-w-2xl p-6 pb-24">
      <PageHeader title="Inventory" description="Monitor stock levels across all machines" />

      {/* ── Search + Route Filter ─────────────────────────────────────────── */}
      <div className="mb-4 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.search}
            className="h-9 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] pl-9 pr-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <select
          value={routeFilter}
          onChange={(e) => setRouteFilter(e.target.value)}
          className="h-9 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-3 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="all">{t.allRoutes}</option>
          {routes.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      {/* ── Summary Bar ───────────────────────────────────────────────────── */}
      <div className="mb-4 flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2.5">
        <span className="text-sm font-medium text-[var(--text-primary)]">
          {t.machineQuantity}: <span className="text-blue-600">{filteredMachines.length}</span>
        </span>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--text-muted)]">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleSelectAll}
            className="rounded border-[var(--border)]"
          />
          {t.selectAll}
        </label>
      </div>

      {/* ── Machine Cards ─────────────────────────────────────────────────── */}
      <div className="space-y-4">
        {filteredMachines.map((m, idx) => {
          const inventoryPct = Math.round((m.inventory / m.capacity) * 100)
          const machineSlots = ldaSlots.filter((s) => s.machineId === m.id)
          const shortSlotCount = machineSlots.filter((s) => s.inventory < s.capacity).length

          return (
            <Card key={m.id} hover={false}>
              <div className="flex items-start gap-3">
                {/* Number badge */}
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  {idx + 1}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Top row: name + status */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-[var(--text-primary)]">{m.name}</span>
                    <Badge variant={m.status === 'online' ? 'success' : 'danger'}>
                      {m.status === 'online' ? t.online : t.offline}
                    </Badge>
                    <span className="text-xs font-mono text-[var(--text-muted)]">{m.id}</span>
                    <label className="ml-auto flex items-center gap-1.5">
                      <input
                        type="checkbox"
                        checked={selectedMachines.includes(m.id)}
                        onChange={() => toggleMachine(m.id)}
                        className="rounded border-[var(--border)]"
                      />
                    </label>
                  </div>

                  {/* Location */}
                  <p className="mt-0.5 text-xs text-[var(--text-muted)]">{m.location}</p>

                  {/* Stats row */}
                  <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
                    <div>
                      <p className="text-[var(--text-muted)]">{t.shortageRate}</p>
                      <p className={cn('font-bold text-base', shortageRateColor(m.shortageRate))}>
                        {m.shortageRate.toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--text-muted)]">{t.inventory}</p>
                      <p className="font-semibold text-[var(--text-primary)]">
                        {m.inventory} / {m.capacity}
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--text-muted)]">{t.shortageThreshold}</p>
                      <p className="font-semibold text-[var(--text-primary)]">{m.shortageThreshold}%</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={cn('h-full rounded-full transition-all', progressColor(m.shortageRate))}
                      style={{ width: `${inventoryPct}%` }}
                    />
                  </div>
                  <p className="mt-1 text-right text-xs text-[var(--text-muted)]">{inventoryPct}%</p>

                  {/* Actions */}
                  <div className="mt-3 flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSheetMachineId(m.id)}
                      className="border-orange-300 text-orange-600 hover:bg-orange-50"
                    >
                      <PackageOpen className="h-3.5 w-3.5" />
                      {t.inventoryShortage}
                      {shortSlotCount > 0 && (
                        <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] text-white">
                          {shortSlotCount}
                        </span>
                      )}
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => showToast(`${t.refillSubmitted} ${m.name}`)}
                    >
                      {t.reFillNow}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}

        {filteredMachines.length === 0 && (
          <div className="py-12 text-center text-sm text-[var(--text-muted)]">
            No machines match your filters.
          </div>
        )}
      </div>

      {/* ── Sticky Product Shortage Summary Button ────────────────────────── */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
        <Button variant="primary" size="lg" onClick={() => setShowSummaryModal(true)}>
          {t.productShortageSummary}
        </Button>
      </div>

      {/* ── Shortage Sheet (slide up) ─────────────────────────────────────── */}
      {sheetMachineId && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setSheetMachineId(null)}
          />
          <div className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl bg-[var(--bg-card)] shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="mx-auto max-w-2xl px-6 pb-8 pt-5">
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-200" />
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-[var(--text-primary)]">
                    {t.shortage}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">{sheetMachine?.name}</p>
                </div>
                <button
                  onClick={() => setSheetMachineId(null)}
                  className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-slate-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {sheetSlots.length === 0 ? (
                <p className="py-6 text-center text-sm text-[var(--text-muted)]">No shortages on this machine.</p>
              ) : (
                <Table>
                  <Thead>
                    <Tr>
                      <Th>{t.product}</Th>
                      <Th>Current Stock</Th>
                      <Th>{t.capacity}</Th>
                      <Th>{t.shortage}</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {sheetSlots.map((s) => (
                      <Tr key={s.id}>
                        <Td className="font-medium">{s.product}</Td>
                        <Td>{s.inventory}</Td>
                        <Td>{s.capacity}</Td>
                        <Td className="font-semibold text-red-600">
                          -{s.capacity - s.inventory}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}

              <div className="mt-4 flex justify-end">
                <Button variant="secondary" size="md" onClick={() => setSheetMachineId(null)}>
                  {t.close}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Product Shortage Summary Modal ────────────────────────────────── */}
      {showSummaryModal && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowSummaryModal(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-lg rounded-2xl bg-[var(--bg-card)] shadow-2xl">
              <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
                <h3 className="text-base font-semibold text-[var(--text-primary)]">{t.productShortageSummary}</h3>
                <button
                  onClick={() => setShowSummaryModal(false)}
                  className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-slate-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="max-h-[60vh] overflow-y-auto p-6">
                {Object.keys(shortageSummary).length === 0 ? (
                  <p className="py-6 text-center text-sm text-[var(--text-muted)]">No shortage items found.</p>
                ) : (
                  <Table>
                    <Thead>
                      <Tr>
                        <Th>{t.product}</Th>
                        <Th>Total {t.shortage}</Th>
                        <Th>{t.machinesAffected}</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {Object.entries(shortageSummary).map(([id, data]) => (
                        <Tr key={id}>
                          <Td className="font-medium">{data.product}</Td>
                          <Td className="font-semibold text-red-600">-{data.shortage}</Td>
                          <Td>
                            <Badge variant="info">{data.machines.size}</Badge>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                )}
              </div>
              <div className="border-t border-[var(--border)] px-6 py-4 flex justify-end">
                <Button variant="secondary" size="md" onClick={() => setShowSummaryModal(false)}>
                  {t.close}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Toast ─────────────────────────────────────────────────────────── */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 rounded-lg bg-slate-900 px-4 py-3 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  )
}
