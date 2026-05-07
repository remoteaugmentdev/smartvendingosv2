'use client'

import { use, useState } from 'react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'
import { ldaSlots } from '@/data/lda'
import { RotateCcw } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

type SlotStatusEntry = { label: string; variant: 'success' | 'danger' | 'info' }

export default function RepairSlotPage({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslation()
  const { id } = use(params)

  const slots = ldaSlots.filter((s) => s.machineId === id)
  const cabinets = [...new Set(slots.map((s) => s.cabinet))]

  const [activeTab, setActiveTab] = useState(cabinets[0] ?? '')
  const [slotStatuses, setSlotStatuses] = useState<Record<number, SlotStatusEntry>>(
    Object.fromEntries(
      slots.map((s) => [
        s.id,
        s.id === 103
          ? { label: t.jammed, variant: 'danger' as const }
          : { label: t.normal, variant: 'success' as const },
      ])
    )
  )
  const [toast, setToast] = useState('')

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  function handleRepair(slotId: number) {
    setSlotStatuses((prev) => ({
      ...prev,
      [slotId]: { label: t.repaired, variant: 'info' },
    }))
    showToast(t.repairInitiated)
  }

  function handleResetCabinet() {
    const updated = { ...slotStatuses }
    slots
      .filter((s) => s.cabinet === activeTab)
      .forEach((s) => {
        updated[s.id] = { label: t.normal, variant: 'success' }
      })
    setSlotStatuses(updated)
    showToast(`Cabinet ${activeTab} reset to ${t.normal}.`)
  }

  const cabinetSlots = slots.filter((s) => s.cabinet === activeTab)

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-xl font-bold text-[var(--text-primary)]">{t.repairGoodsSlot} — Machine {id}</h1>

      {/* Cabinet tabs */}
      <div className="flex gap-2 border-b border-[var(--border)]">
        {cabinets.map((cab) => (
          <button
            key={cab}
            onClick={() => setActiveTab(cab)}
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

      <div className="flex justify-end">
        <Button variant="secondary" size="sm" onClick={handleResetCabinet}>
          <RotateCcw className="h-3.5 w-3.5" />
          {t.resetWholeCabinet}
        </Button>
      </div>

      <Card hover={false}>
        <Table>
          <Thead>
            <Tr>
              <Th>Slot #</Th>
              <Th>{t.product}</Th>
              <Th>{t.status}</Th>
              <Th>{t.actions}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {cabinetSlots.map((slot) => {
              const statusEntry = slotStatuses[slot.id] ?? { label: t.normal, variant: 'success' as const }
              return (
                <Tr key={slot.id}>
                  <Td className="font-mono font-medium">{slot.id}</Td>
                  <Td>{slot.product}</Td>
                  <Td>
                    <Badge variant={statusEntry.variant}>{statusEntry.label}</Badge>
                  </Td>
                  <Td>
                    <button
                      onClick={() => handleRepair(slot.id)}
                      className="inline-flex items-center justify-center rounded-lg bg-teal-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-600 active:scale-[0.98] transition-all"
                    >
                      {t.repair}
                    </button>
                  </Td>
                </Tr>
              )
            })}
          </Tbody>
        </Table>
      </Card>

      {toast && (
        <div className="fixed bottom-4 right-4 z-50 rounded-lg bg-slate-900 px-4 py-3 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  )
}
