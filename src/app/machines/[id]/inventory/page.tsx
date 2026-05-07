// FILE: d:\smartvendkiosk\src\app\machines\[id]\inventory\page.tsx
'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { X, CalendarDays } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ldaSlots, ldaProducts } from '@/data/lda'
import { useTranslation } from '@/hooks/useTranslation'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type SlotEntry = (typeof ldaSlots)[number] & {
  expiry: string | null
  inventory: number
}

// ---------------------------------------------------------------------------
// Toast
// ---------------------------------------------------------------------------
function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-emerald-700 px-4 py-3 text-sm text-white shadow-xl">
      {message}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Revise Inventory Modal
// ---------------------------------------------------------------------------
function ReviseInventoryModal({
  slot,
  onSave,
  onClose,
}: {
  slot: SlotEntry
  onSave: (qty: number) => void
  onClose: () => void
}) {
  const t = useTranslation()
  const [qty, setQty] = useState(String(slot.inventory))

  function handleSave() {
    const parsed = parseInt(qty, 10)
    if (!isNaN(parsed) && parsed >= 0) onSave(parsed)
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white shadow-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-[var(--text-primary)]">
            {t.reviseInventory}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>
        <p className="text-sm text-[var(--text-muted)] mb-1">
          Slot {slot.id} — {slot.product}
        </p>
        <p className="text-xs text-[var(--text-muted)] mb-4">
          Current: {slot.inventory} / {slot.capacity}
        </p>
        <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">
          New {t.inventory} Count
        </label>
        <input
          type="number"
          min="0"
          max={slot.capacity}
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          autoFocus
          className="w-full h-10 rounded-xl border border-[var(--border)] px-3 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500 mb-5"
        />
        <div className="flex gap-2">
          <Button variant="secondary" size="md" className="flex-1" onClick={onClose}>
            {t.cancel}
          </Button>
          <Button variant="primary" size="md" className="flex-1" onClick={handleSave}>
            {t.save}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Set Expiration Modal
// ---------------------------------------------------------------------------
function SetExpirationModal({
  slot,
  onSave,
  onClose,
}: {
  slot: SlotEntry
  onSave: (date: string) => void
  onClose: () => void
}) {
  const t = useTranslation()
  const [date, setDate] = useState(slot.expiry ?? '')

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white shadow-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-[var(--text-primary)]">
            {t.setExpiration}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>
        <p className="text-sm text-[var(--text-muted)] mb-4">
          Slot {slot.id} — {slot.product}
        </p>
        <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">
          {t.expiry}
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          autoFocus
          className="w-full h-10 rounded-xl border border-[var(--border)] px-3 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500 mb-5"
        />
        <div className="flex gap-2">
          <Button variant="secondary" size="md" className="flex-1" onClick={onClose}>
            {t.cancel}
          </Button>
          <Button
            variant="primary"
            size="md"
            className="flex-1"
            disabled={!date}
            onClick={() => { if (date) onSave(date) }}
          >
            {t.save}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function InventoryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const t = useTranslation()
  const { id } = use(params)

  const productMap = Object.fromEntries(ldaProducts.map((p) => [p.id, p]))
  const baseSlots = ldaSlots.filter((s) => s.machineId === id) as SlotEntry[]

  const [slotData, setSlotData] = useState<SlotEntry[]>(baseSlots)

  const cabinets = [...new Set(baseSlots.map((s) => s.cabinet))].sort()
  const [activeCabinet, setActiveCabinet] = useState(cabinets[0] ?? 'CabinetA')

  const floorsInCabinet = [
    ...new Set(baseSlots.filter((s) => s.cabinet === activeCabinet).map((s) => s.floor)),
  ].sort()
  const [activeFloor, setActiveFloor] = useState<number>(floorsInCabinet[0] ?? 1)

  const [reviseSlotId, setReviseSlotId] = useState<number | null>(null)
  const [expirySlotId, setExpirySlotId] = useState<number | null>(null)
  const [batchExpiryDate, setBatchExpiryDate] = useState('')
  const [toast, setToast] = useState('')

  function showToast(msg: string) {
    setToast(msg)
  }

  function handleCabinetChange(cab: string) {
    setActiveCabinet(cab)
    const floors = [
      ...new Set(baseSlots.filter((s) => s.cabinet === cab).map((s) => s.floor)),
    ].sort()
    setActiveFloor(floors[0] ?? 1)
  }

  const visibleSlots = slotData.filter(
    (s) => s.cabinet === activeCabinet && s.floor === activeFloor
  )

  function saveInventory(qty: number) {
    if (reviseSlotId === null) return
    setSlotData((prev) =>
      prev.map((s) => (s.id === reviseSlotId ? { ...s, inventory: qty } : s))
    )
    showToast(`${t.inventory} updated for Slot ${reviseSlotId}`)
    setReviseSlotId(null)
  }

  function saveExpiry(date: string) {
    if (expirySlotId === null) return
    setSlotData((prev) =>
      prev.map((s) => (s.id === expirySlotId ? { ...s, expiry: date } : s))
    )
    showToast(`${t.expiry} set for Slot ${expirySlotId}`)
    setExpirySlotId(null)
  }

  function handleFillUp() {
    setSlotData((prev) =>
      prev.map((s) =>
        s.cabinet === activeCabinet && s.floor === activeFloor
          ? { ...s, inventory: s.capacity }
          : s
      )
    )
    showToast(`Filled up all slots on ${activeCabinet} Floor ${activeFloor}`)
  }

  function handleBatchExpiry() {
    if (!batchExpiryDate) return
    setSlotData((prev) =>
      prev.map((s) =>
        s.cabinet === activeCabinet && s.floor === activeFloor
          ? { ...s, expiry: batchExpiryDate }
          : s
      )
    )
    showToast(`${t.expiry} set to ${batchExpiryDate} for all slots on this floor`)
    setBatchExpiryDate('')
  }

  const reviseSlot = reviseSlotId
    ? slotData.find((s) => s.id === reviseSlotId) ?? null
    : null
  const expirySlot = expirySlotId
    ? slotData.find((s) => s.id === expirySlotId) ?? null
    : null

  if (cabinets.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center text-sm text-[var(--text-muted)]">
        No slots found for machine {id}.
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">{t.inventory}</h2>
          <p className="mt-0.5 text-sm text-[var(--text-muted)]">Machine {id}</p>
        </div>
        <Link href={`/machines/${id}`}>
          <Button variant="ghost" size="sm">← {t.back}</Button>
        </Link>
      </div>

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
            {cab}
          </button>
        ))}
      </div>

      {/* Floor tabs */}
      <div className="flex gap-2 mb-5">
        {floorsInCabinet.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFloor(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeFloor === f
                ? 'bg-blue-100 text-blue-700'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            Floor {f}
          </button>
        ))}
      </div>

      {/* Top action row */}
      <div className="flex gap-2 mb-4 flex-wrap items-center">
        <Button variant="secondary" size="sm" onClick={handleFillUp}>
          {t.fillUpFloor}
        </Button>
        <div className="flex items-center gap-2">
          <CalendarDays size={14} className="text-[var(--text-muted)]" />
          <input
            type="date"
            value={batchExpiryDate}
            onChange={(e) => setBatchExpiryDate(e.target.value)}
            className="h-8 rounded-xl border border-[var(--border)] bg-white px-3 text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button
            variant="secondary"
            size="sm"
            disabled={!batchExpiryDate}
            onClick={handleBatchExpiry}
          >
            {t.reviseExpiration}
          </Button>
        </div>
      </div>

      {/* Slot list */}
      <Card hover={false} className="p-0 mb-5">
        {visibleSlots.map((slot) => {
          const product = productMap[slot.productId]
          const isLow = product ? slot.inventory < product.reorderLevel : false

          return (
            <div
              key={slot.id}
              className={`flex items-center gap-3 px-4 py-3 border-b border-[var(--border)] last:border-0 transition-colors ${
                isLow ? 'bg-amber-50' : ''
              }`}
            >
              {/* Slot badge */}
              <Badge
                variant="info"
                className="shrink-0 bg-teal-100 text-teal-700"
              >
                {slot.id}
              </Badge>

              {/* Product info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                  {slot.product}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-0.5">
                  <span className="text-xs text-[var(--text-muted)]">
                    {slot.inventory} / {slot.capacity}
                  </span>
                  {slot.expiry ? (
                    <Badge variant="default" className="text-xs">
                      {slot.expiry}
                    </Badge>
                  ) : (
                    <Badge variant="warning" className="text-xs">
                      {t.notSet}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-1.5 shrink-0">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setReviseSlotId(slot.id)}
                >
                  {t.reviseInventory}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setExpirySlotId(slot.id)}
                >
                  {t.setExpiration}
                </Button>
              </div>
            </div>
          )
        })}
        {visibleSlots.length === 0 && (
          <div className="py-10 text-center text-sm text-[var(--text-muted)]">
            No slots on this floor.
          </div>
        )}
      </Card>

      {/* Modals */}
      {reviseSlot && (
        <ReviseInventoryModal
          slot={reviseSlot}
          onSave={saveInventory}
          onClose={() => setReviseSlotId(null)}
        />
      )}
      {expirySlot && (
        <SetExpirationModal
          slot={expirySlot}
          onSave={saveExpiry}
          onClose={() => setExpirySlotId(null)}
        />
      )}

      {toast && <Toast message={toast} onDone={() => setToast('')} />}
    </div>
  )
}
