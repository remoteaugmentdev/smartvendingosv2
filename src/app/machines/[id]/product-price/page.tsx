// FILE: d:\smartvendkiosk\src\app\machines\[id]\product-price\page.tsx
'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { Pencil, Check, X } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'
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
// Page
// ---------------------------------------------------------------------------
export default function ProductPricePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const t = useTranslation()
  const baseSlots = ldaSlots.filter((s) => s.machineId === id)

  const [search, setSearch] = useState('')
  const [prices, setPrices] = useState<Record<number, number>>(
    Object.fromEntries(baseSlots.map((s) => [s.id, s.price]))
  )
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editPrice, setEditPrice] = useState('')
  const [toastMsg, setToastMsg] = useState('')

  const filtered = baseSlots.filter((s) =>
    !search || s.product.toLowerCase().includes(search.toLowerCase())
  )

  const startEdit = (slot: (typeof baseSlots)[number]) => {
    setEditingId(slot.id)
    setEditPrice(prices[slot.id].toFixed(2))
  }

  const saveEdit = (slot: (typeof baseSlots)[number]) => {
    const parsed = parseFloat(editPrice)
    if (!isNaN(parsed) && parsed >= 0) {
      setPrices((prev) => ({ ...prev, [slot.id]: parsed }))
      setToastMsg(
        `Digital label updated on Machine ${id}, Slot ${slot.id}`
      )
    }
    setEditingId(null)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditPrice('')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <PageHeader title={t.productPrice} description={`Machine ${id}`}>
        <Link href={`/machines/${id}`}>
          <Button variant="ghost" size="sm">← Back</Button>
        </Link>
      </PageHeader>

      {/* Search */}
      <input
        type="text"
        placeholder={t.search + ' product…'}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full h-9 rounded-xl border border-[var(--border)] bg-white px-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <Card hover={false}>
        <Table>
          <Thead>
            <Tr>
              <Th>Slot</Th>
              <Th>{t.product}</Th>
              <Th>{t.price}</Th>
              <Th className="text-right">{t.edit}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filtered.map((slot) => (
              <Tr key={slot.id}>
                <Td className="text-[var(--text-muted)] w-14">{slot.id}</Td>
                <Td>{slot.product}</Td>
                <Td>
                  {editingId === slot.id ? (
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="w-20 rounded-lg border border-blue-400 px-2 py-0.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit(slot)
                        if (e.key === 'Escape') cancelEdit()
                      }}
                    />
                  ) : (
                    <span className="font-medium text-[var(--text-primary)]">
                      €{prices[slot.id].toFixed(2)}
                    </span>
                  )}
                </Td>
                <Td className="text-right">
                  {editingId === slot.id ? (
                    <span className="inline-flex gap-1">
                      <button
                        onClick={() => saveEdit(slot)}
                        className="rounded-lg p-1.5 text-emerald-600 hover:bg-emerald-50"
                        title={t.save}
                      >
                        <Check size={15} />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="rounded-lg p-1.5 text-red-500 hover:bg-red-50"
                        title={t.cancel}
                      >
                        <X size={15} />
                      </button>
                    </span>
                  ) : (
                    <button
                      onClick={() => startEdit(slot)}
                      className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-slate-100 hover:text-blue-600"
                      title={t.edit}
                    >
                      <Pencil size={15} />
                    </button>
                  )}
                </Td>
              </Tr>
            ))}

            {filtered.length === 0 && (
              <Tr>
                <Td colSpan={4} className="text-center py-8 text-[var(--text-muted)]">
                  No products match your search.
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Card>

      {toastMsg && <Toast message={toastMsg} onDone={() => setToastMsg('')} />}
    </div>
  )
}
