// FILE: d:\smartvendkiosk\src\app\machines\[id]\motor-test\page.tsx
'use client'

import { use, useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { RefreshCw } from 'lucide-react'
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

type SlotResult = 'ok' | 'error'

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function MotorTestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const t = useTranslation()
  const machineSlots = ldaSlots.filter((s) => s.machineId === id)

  const cabinets = [...new Set(machineSlots.map((s) => s.cabinet))].sort()
  const [activeCabinet, setActiveCabinet] = useState(cabinets[0] ?? 'CabinetA')

  const floors = [...new Set(machineSlots.filter((s) => s.cabinet === activeCabinet).map((s) => s.floor))].sort()
  const [activeFloor, setActiveFloor] = useState<number>(floors[0] ?? 1)

  const [testingSlots, setTestingSlots] = useState<Set<number>>(new Set())
  const [slotResults, setSlotResults] = useState<Map<number, SlotResult>>(new Map())
  const [toastMsg, setToastMsg] = useState('')

  const handleCabinetChange = (cab: string) => {
    setActiveCabinet(cab)
    const newFloors = [...new Set(machineSlots.filter((s) => s.cabinet === cab).map((s) => s.floor))].sort()
    setActiveFloor(newFloors[0] ?? 1)
  }

  const testSlot = useCallback(
    (slotId: number) => {
      if (testingSlots.has(slotId)) return
      setTestingSlots((prev) => new Set(prev).add(slotId))
      setTimeout(() => {
        const result: SlotResult = slotId === 103 ? 'error' : 'ok'
        setTestingSlots((prev) => {
          const next = new Set(prev)
          next.delete(slotId)
          return next
        })
        setSlotResults((prev) => new Map(prev).set(slotId, result))
        if (result === 'error') {
          setToastMsg(`Slot ${slotId}: ${t.motorError}`)
        }
      }, 1500)
    },
    [testingSlots, t]
  )

  const testWholeFloor = () => {
    visibleSlots.forEach((s) => testSlot(s.id))
  }

  const handleRefresh = () => {
    setSlotResults(new Map())
    setTestingSlots(new Set())
  }

  const visibleSlots = machineSlots.filter(
    (s) => s.cabinet === activeCabinet && s.floor === activeFloor
  )

  const getMotorBadge = (slot: (typeof machineSlots)[number]) => {
    if (testingSlots.has(slot.id)) {
      return (
        <Badge variant="default">
          <span className="inline-flex items-center gap-1">
            <RefreshCw size={10} className="animate-spin" />
            {t.testing}
          </span>
        </Badge>
      )
    }
    const result = slotResults.get(slot.id)
    if (result === 'ok') return <Badge variant="success">{t.motorOk}</Badge>
    if (result === 'error') return <Badge variant="danger">{t.motorError}</Badge>
    // fallback to data
    if (slot.motorStatus === 'error') return <Badge variant="danger">{t.error}</Badge>
    return <Badge variant="success">{t.normal}</Badge>
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <PageHeader title={t.motorTest} description={`Machine ${id}`}>
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
            {cab}
          </button>
        ))}
      </div>

      {/* Floor tabs + action buttons */}
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <div className="flex gap-2">
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
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={testWholeFloor}>
            {t.testWholeFloor}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleRefresh}>
            <RefreshCw size={14} />
            {t.refresh}
          </Button>
        </div>
      </div>

      {/* Slot list */}
      <div className="flex flex-col gap-2">
        {visibleSlots.map((slot) => (
          <Card key={slot.id} hover={false} className="px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs font-mono font-semibold text-[var(--text-muted)] w-10 shrink-0">
                  #{slot.id}
                </span>
                <span className="text-sm text-[var(--text-primary)] truncate">
                  {slot.product}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {getMotorBadge(slot)}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => testSlot(slot.id)}
                  disabled={testingSlots.has(slot.id)}
                >
                  {t.testSlot} #{slot.id}
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {visibleSlots.length === 0 && (
          <div className="py-10 text-center text-sm text-[var(--text-muted)]">
            No slots on this floor.
          </div>
        )}
      </div>

      {toastMsg && <Toast message={toastMsg} onDone={() => setToastMsg('')} />}
    </div>
  )
}
