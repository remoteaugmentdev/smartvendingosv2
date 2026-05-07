// FILE: d:\smartvendkiosk\src\app\machines\[id]\machine-product\page.tsx
'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, X, Check, RefreshCw, Layers } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ldaSlots, ldaProducts } from '@/data/lda'
import { useTranslation } from '@/hooks/useTranslation'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type SlotData = (typeof ldaSlots)[number] & { product: string; price: number; productId: string }

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
// Replace Product Modal
// ---------------------------------------------------------------------------
function ReplaceProductModal({
  slot,
  onConfirm,
  onClose,
}: {
  slot: SlotData
  onConfirm: (productId: string, productName: string) => void
  onClose: () => void
}) {
  const t = useTranslation()
  const [productSearch, setProductSearch] = useState('')
  const [pendingProductId, setPendingProductId] = useState<string | null>(null)

  const filtered = ldaProducts.filter(
    (p) =>
      !productSearch ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.id.toLowerCase().includes(productSearch.toLowerCase())
  )

  const pending = pendingProductId
    ? ldaProducts.find((p) => p.id === pendingProductId) ?? null
    : null

  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-2xl flex flex-col max-h-[85vh]">
        <div className="px-5 pt-5 pb-3 flex items-center justify-between border-b border-slate-100">
          <div>
            <h3 className="text-base font-semibold text-[var(--text-primary)]">
              {t.replaceProduct}
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Slot {slot.id}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-3">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            />
            <input
              type="text"
              placeholder={t.search}
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              autoFocus
              className="w-full h-9 pl-9 pr-3 rounded-xl border border-[var(--border)] bg-white text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-y-auto flex-1 px-3 pb-2">
          {filtered.map((product) => {
            const isSelected = pendingProductId === product.id
            return (
              <button
                key={product.id}
                onClick={() => setPendingProductId(product.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors mb-1 ${
                  isSelected
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-slate-50 border border-transparent'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {product.id} · €{product.price.toFixed(2)}
                  </p>
                </div>
                {isSelected && (
                  <Check size={16} className="text-blue-600 shrink-0" />
                )}
              </button>
            )
          })}
          {filtered.length === 0 && (
            <div className="py-10 text-center text-sm text-[var(--text-muted)]">
              No products found.
            </div>
          )}
        </div>

        <div className="px-5 py-4 border-t border-slate-100 flex gap-2">
          <Button variant="secondary" size="md" className="flex-1" onClick={onClose}>
            {t.cancel}
          </Button>
          <Button
            variant="primary"
            size="md"
            className="flex-1"
            disabled={!pending}
            onClick={() => {
              if (pending) onConfirm(pending.id, pending.name)
            }}
          >
            {t.confirm}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Slot Row
// ---------------------------------------------------------------------------
function SlotRow({
  slot,
  machineId,
  editingPriceId,
  editPrice,
  onStartEditPrice,
  onChangePrice,
  onSavePrice,
  onCancelPrice,
  onOpenReplace,
}: {
  slot: SlotData
  machineId: string
  editingPriceId: number | null
  editPrice: string
  onStartEditPrice: () => void
  onChangePrice: (v: string) => void
  onSavePrice: () => void
  onCancelPrice: () => void
  onOpenReplace: () => void
}) {
  const t = useTranslation()
  const isEditing = editingPriceId === slot.id

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)] last:border-0">
      {/* Slot badge */}
      <Badge
        variant="info"
        className="shrink-0 bg-teal-100 text-teal-700"
      >
        {slot.id}
      </Badge>

      {/* Product info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--text-primary)] truncate">{slot.product}</p>
        {isEditing ? (
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs text-[var(--text-muted)]">€</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={editPrice}
              onChange={(e) => onChangePrice(e.target.value)}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSavePrice()
                if (e.key === 'Escape') onCancelPrice()
              }}
              className="w-20 h-7 rounded-lg border border-blue-400 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={onSavePrice}
              className="rounded-lg p-1 text-emerald-600 hover:bg-emerald-50"
              title={t.save}
            >
              <Check size={14} />
            </button>
            <button
              onClick={onCancelPrice}
              className="rounded-lg p-1 text-red-500 hover:bg-red-50"
              title={t.cancel}
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            €{slot.price.toFixed(2)}
          </p>
        )}
      </div>

      {/* Actions */}
      {!isEditing && (
        <div className="flex gap-1.5 shrink-0">
          <Button variant="primary" size="sm" onClick={onOpenReplace}>
            {t.replaceProduct}
          </Button>
          <Button variant="primary" size="sm" onClick={onStartEditPrice}>
            {t.revisePrice}
          </Button>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function MachineProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const t = useTranslation()
  const { id } = use(params)

  const baseSlots = ldaSlots.filter((s) => s.machineId === id)
  const [slotData, setSlotData] = useState<SlotData[]>(baseSlots as SlotData[])

  const cabinets = [...new Set(baseSlots.map((s) => s.cabinet))].sort()
  const [activeCabinet, setActiveCabinet] = useState(cabinets[0] ?? 'CabinetA')

  const floorsInCabinet = [
    ...new Set(baseSlots.filter((s) => s.cabinet === activeCabinet).map((s) => s.floor)),
  ].sort()
  const [activeFloor, setActiveFloor] = useState<number>(floorsInCabinet[0] ?? 1)

  const [editingPriceId, setEditingPriceId] = useState<number | null>(null)
  const [editPrice, setEditPrice] = useState('')

  const [showReplaceModal, setShowReplaceModal] = useState(false)
  const [replacingSlotId, setReplacingSlotId] = useState<number | null>(null)

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
    setEditingPriceId(null)
  }

  const visibleSlots = slotData.filter(
    (s) => s.cabinet === activeCabinet && s.floor === activeFloor
  )

  function startEditPrice(slot: SlotData) {
    setEditingPriceId(slot.id)
    setEditPrice(slot.price.toFixed(2))
  }

  function savePrice() {
    if (editingPriceId === null) return
    const parsed = parseFloat(editPrice)
    const slot = slotData.find((s) => s.id === editingPriceId)
    if (!isNaN(parsed) && parsed >= 0 && slot) {
      setSlotData((prev) =>
        prev.map((s) => (s.id === editingPriceId ? { ...s, price: parsed } : s))
      )
      showToast(`✓ ${t.eslUpdated} ${id}, Slot ${slot.id}`)
    }
    setEditingPriceId(null)
    setEditPrice('')
  }

  function cancelPrice() {
    setEditingPriceId(null)
    setEditPrice('')
  }

  function openReplace(slotId: number) {
    setReplacingSlotId(slotId)
    setShowReplaceModal(true)
  }

  function handleConfirmReplace(productId: string, productName: string) {
    if (replacingSlotId === null) return
    setSlotData((prev) =>
      prev.map((s) =>
        s.id === replacingSlotId ? { ...s, product: productName, productId } : s
      )
    )
    showToast(`Product replaced in Slot ${replacingSlotId}`)
    setShowReplaceModal(false)
    setReplacingSlotId(null)
  }

  const replacingSlot = replacingSlotId
    ? (slotData.find((s) => s.id === replacingSlotId) ?? null)
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
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Machine Products</h2>
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

      {/* Slot list */}
      <Card hover={false} className="p-0 mb-5">
        {visibleSlots.map((slot) => (
          <SlotRow
            key={slot.id}
            slot={slot}
            machineId={id}
            editingPriceId={editingPriceId}
            editPrice={editPrice}
            onStartEditPrice={() => startEditPrice(slot)}
            onChangePrice={setEditPrice}
            onSavePrice={savePrice}
            onCancelPrice={cancelPrice}
            onOpenReplace={() => openReplace(slot.id)}
          />
        ))}
        {visibleSlots.length === 0 && (
          <div className="py-10 text-center text-sm text-[var(--text-muted)]">
            No slots on this floor.
          </div>
        )}
      </Card>

      {/* Bottom actions */}
      <div className="flex gap-3">
        <Button variant="secondary" size="md" className="flex-1">
          <Layers size={15} />
          {t.batch}
        </Button>
        <Button
          variant="primary"
          size="md"
          className="flex-1"
          onClick={() => showToast(`${t.startRefill} — Machine ${id}`)}
        >
          <RefreshCw size={15} />
          {t.startRefill}
        </Button>
      </div>

      {/* Replace modal */}
      {showReplaceModal && replacingSlot && (
        <ReplaceProductModal
          slot={replacingSlot}
          onConfirm={handleConfirmReplace}
          onClose={() => {
            setShowReplaceModal(false)
            setReplacingSlotId(null)
          }}
        />
      )}

      {toast && <Toast message={toast} onDone={() => setToast('')} />}
    </div>
  )
}
