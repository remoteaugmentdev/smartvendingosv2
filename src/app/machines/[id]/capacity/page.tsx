// FILE: d:\smartvendkiosk\src\app\machines\[id]\capacity\page.tsx
'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/layout/PageHeader'
import { ldaSlots } from '@/data/lda'
import { useTranslation } from '@/hooks/useTranslation'

// ---------------------------------------------------------------------------
// Toast
// ---------------------------------------------------------------------------
function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-slate-800 px-4 py-3 text-sm text-white shadow-xl">
      {message}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Colored square for product initial
// ---------------------------------------------------------------------------
const COLORS = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-violet-500',
  'bg-cyan-500',
  'bg-orange-500',
  'bg-teal-500',
]

function colorFor(name: string) {
  let hash = 0
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) & 0xffffffff
  return COLORS[Math.abs(hash) % COLORS.length]
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function CapacityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const t = useTranslation()
  const machineSlots = ldaSlots.filter((s) => s.machineId === id)

  const cabinets = [...new Set(machineSlots.map((s) => s.cabinet))].sort()
  const [activeCabinet, setActiveCabinet] = useState(cabinets[0] ?? 'CabinetA')

  const floors = [...new Set(machineSlots.filter((s) => s.cabinet === activeCabinet).map((s) => s.floor))].sort()
  const [activeFloor, setActiveFloor] = useState<number>(floors[0] ?? 1)

  const [toastMsg, setToastMsg] = useState('')

  // Reset floor tab when cabinet changes
  const handleCabinetChange = (cab: string) => {
    setActiveCabinet(cab)
    const newFloors = [...new Set(machineSlots.filter((s) => s.cabinet === cab).map((s) => s.floor))].sort()
    setActiveFloor(newFloors[0] ?? 1)
  }

  const visibleSlots = machineSlots.filter(
    (s) => s.cabinet === activeCabinet && s.floor === activeFloor
  )

  const inventoryVariant = (inv: number, cap: number) => {
    if (inv < 3) return 'text-red-600 font-bold'
    if (inv < 5) return 'text-amber-600 font-semibold'
    return 'text-[var(--text-primary)]'
  }

  if (cabinets.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center text-sm text-[var(--text-muted)]">
        No slots found for this machine.
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <PageHeader title={t.machineCapacity} description={`Machine ${id}`}>
        <Link href={`/machines/${id}`}>
          <Button variant="ghost" size="sm">← Back</Button>
        </Link>
      </PageHeader>

      {/* Cabinet tabs */}
      <div className="flex gap-2 mb-4 border-b border-[var(--border)]">
        {cabinets.map((cab) => (
          <button
            key={cab}
            onClick={() => handleCabinetChange(cab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
              activeCabinet === cab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            {t.cabinet} {cab}
          </button>
        ))}
      </div>

      {/* Floor tabs */}
      <div className="flex gap-2 mb-5">
        {floors.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFloor(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeFloor === f
                ? 'bg-blue-100 text-blue-700'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {t.floor} {f}
          </button>
        ))}
      </div>

      {/* Slot grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {visibleSlots.map((slot) => (
          <Card key={slot.id} hover={false} className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="info">Slot {slot.id}</Badge>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded text-white text-sm font-bold ${colorFor(slot.product)}`}
              >
                {slot.product.charAt(0)}
              </div>
              <span className="text-xs font-medium text-[var(--text-primary)] truncate leading-tight">
                {slot.product}
              </span>
            </div>
            <div className="text-xs text-[var(--text-muted)] space-y-0.5">
              <div>
                {t.capacity}:{' '}
                <span className="font-semibold text-[var(--text-primary)]">{slot.capacity}</span>
              </div>
              <div>
                {t.inventory}:{' '}
                <span className={inventoryVariant(slot.inventory, slot.capacity)}>
                  {slot.inventory}
                </span>
              </div>
            </div>
          </Card>
        ))}

        {visibleSlots.length === 0 && (
          <div className="col-span-2 py-10 text-center text-sm text-[var(--text-muted)]">
            No slots on this floor.
          </div>
        )}
      </div>

      {/* Bottom actions */}
      <div className="flex gap-3">
        <Button variant="secondary" size="md" className="flex-1">
          {t.modifyCapacity}
        </Button>
        <Button
          variant="primary"
          size="md"
          className="flex-1"
          onClick={() => setToastMsg(t.refillStarted)}
        >
          {t.startRefill}
        </Button>
      </div>

      {toastMsg && <Toast message={toastMsg} onDone={() => setToastMsg('')} />}
    </div>
  )
}
