'use client'

import { use, useState } from 'react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'
import { ldaSlots } from '@/data/lda'
import { CalendarDays } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

const TODAY = '2026-05-07'

function getDaysRemaining(expiry: string): number {
  const diff = new Date(expiry).getTime() - new Date(TODAY).getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function expiryVariant(expiry: string | null): 'danger' | 'warning' | 'success' | 'default' {
  if (!expiry) return 'default'
  const days = getDaysRemaining(expiry)
  if (days < 0) return 'danger'
  if (days <= 7) return 'warning'
  return 'success'
}

export default function ShelfLifePage({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslation()
  const { id } = use(params)

  const slots = ldaSlots
    .filter((s) => s.machineId === id)
    .map((s) => ({
      ...s,
      expiry:
        s.id === 106 ? '2026-05-09' : s.id === 107 ? '2026-05-10' : s.expiry,
    }))

  const cabinets = [...new Set(slots.map((s) => s.cabinet))]
  const floors = [...new Set(slots.map((s) => s.floor))].sort()

  const [activeTab, setActiveTab] = useState(cabinets[0] ?? '')
  const [activeFloor, setActiveFloor] = useState(floors[0] ?? 1)
  const [selectedSlots, setSelectedSlots] = useState<number[]>([])
  const [reviseDate, setReviseDate] = useState('')
  const [slotExpiries, setSlotExpiries] = useState<Record<number, string | null>>(
    Object.fromEntries(slots.map((s) => [s.id, s.expiry]))
  )
  const [toast, setToast] = useState('')

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const cabinetSlots = slots.filter((s) => s.cabinet === activeTab)
  const floorsInCabinet = [...new Set(cabinetSlots.map((s) => s.floor))].sort()
  const visibleSlots = cabinetSlots.filter((s) => s.floor === activeFloor)

  function toggleSlot(id: number) {
    setSelectedSlots((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  function applyRevise() {
    if (!reviseDate) return
    const updated = { ...slotExpiries }
    selectedSlots.forEach((id) => {
      updated[id] = reviseDate
    })
    setSlotExpiries(updated)
    setSelectedSlots([])
    showToast(`Expiry date updated to ${reviseDate} for ${selectedSlots.length} slot(s).`)
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-xl font-bold text-[var(--text-primary)]">{t.shelfLife} — Machine {id}</h1>

      {/* Cabinet tabs */}
      <div className="flex gap-2 border-b border-[var(--border)]">
        {cabinets.map((cab) => (
          <button
            key={cab}
            onClick={() => {
              setActiveTab(cab)
              const firstFloor = [...new Set(slots.filter((s) => s.cabinet === cab).map((s) => s.floor))].sort()[0] ?? 1
              setActiveFloor(firstFloor)
            }}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === cab
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            {cab}
          </button>
        ))}
      </div>

      {/* Floor tabs */}
      <div className="flex gap-2">
        {floorsInCabinet.map((floor) => (
          <button
            key={floor}
            onClick={() => setActiveFloor(floor)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              activeFloor === floor
                ? 'bg-blue-100 text-blue-700'
                : 'bg-slate-100 text-[var(--text-muted)] hover:bg-slate-200'
            }`}
          >
            {t.floor} {floor}
          </button>
        ))}
      </div>

      <Card hover={false}>
        <Table>
          <Thead>
            <Tr>
              <Th className="w-8"></Th>
              <Th>Slot #</Th>
              <Th>{t.product}</Th>
              <Th>{t.expiry}</Th>
              <Th>{t.daysRemaining}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {visibleSlots.map((slot) => {
              const expiry = slotExpiries[slot.id] ?? null
              const variant = expiryVariant(expiry)
              const days = expiry ? getDaysRemaining(expiry) : null
              return (
                <Tr key={slot.id}>
                  <Td>
                    <input
                      type="checkbox"
                      checked={selectedSlots.includes(slot.id)}
                      onChange={() => toggleSlot(slot.id)}
                      className="h-4 w-4 rounded border-slate-300 accent-blue-600"
                    />
                  </Td>
                  <Td className="font-mono font-medium">{slot.id}</Td>
                  <Td>{slot.product}</Td>
                  <Td>
                    {expiry ? (
                      <Badge variant={variant}>{expiry}</Badge>
                    ) : (
                      <span className="text-xs text-slate-400">{t.notSet}</span>
                    )}
                  </Td>
                  <Td>
                    {days !== null ? (
                      <span
                        className={
                          days < 0
                            ? 'text-red-600 font-semibold'
                            : days <= 7
                            ? 'text-amber-600 font-semibold'
                            : 'text-emerald-600'
                        }
                      >
                        {days < 0 ? `${Math.abs(days)}d overdue` : `${days}d`}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs">—</span>
                    )}
                  </Td>
                </Tr>
              )
            })}
          </Tbody>
        </Table>
      </Card>

      {/* Revise section */}
      <Card hover={false}>
        <CardHeader>
          <CardTitle>{t.revise} Expiry Date</CardTitle>
        </CardHeader>
        <div className="flex items-center gap-3">
          <CalendarDays className="h-4 w-4 text-[var(--text-muted)]" />
          <input
            type="date"
            value={reviseDate}
            onChange={(e) => setReviseDate(e.target.value)}
            className="rounded-lg border border-[var(--border)] bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button
            variant="primary"
            size="sm"
            onClick={applyRevise}
            disabled={!reviseDate || selectedSlots.length === 0}
          >
            {t.save} ({selectedSlots.length} selected)
          </Button>
          {selectedSlots.length > 0 && (
            <button
              onClick={() => setSelectedSlots([])}
              className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] underline"
            >
              {t.cancel}
            </button>
          )}
        </div>
      </Card>

      {toast && (
        <div className="fixed bottom-4 right-4 z-50 rounded-lg bg-slate-900 px-4 py-3 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  )
}
