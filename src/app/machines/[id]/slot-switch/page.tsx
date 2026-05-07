// FILE: d:\smartvendkiosk\src\app\machines\[id]\slot-switch\page.tsx
'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/layout/PageHeader'
import { ldaSlots } from '@/data/lda'
import { cn } from '@/utils/cn'
import { useTranslation } from '@/hooks/useTranslation'

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function SlotSwitchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const t = useTranslation()
  const machineSlots = ldaSlots.filter((s) => s.machineId === id)

  const cabinets = [...new Set(machineSlots.map((s) => s.cabinet))].sort()
  const [activeCabinet, setActiveCabinet] = useState(cabinets[0] ?? 'CabinetA')

  // Initialise state: slot 108 is pre-set OFF, rest follow data
  const [slotEnabled, setSlotEnabled] = useState<Record<number, boolean>>(
    Object.fromEntries(
      machineSlots.map((s) => [s.id, s.id === 108 ? false : s.enabled])
    )
  )

  const toggle = (id: number) => {
    setSlotEnabled((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const visibleSlots = machineSlots.filter((s) => s.cabinet === activeCabinet)

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <PageHeader title={t.switchGoodsSlot} description={`Machine ${id}`}>
        <Link href={`/machines/${id}`}>
          <Button variant="ghost" size="sm">← Back</Button>
        </Link>
      </PageHeader>

      {/* Cabinet tabs */}
      <div className="flex gap-2 mb-5 border-b border-[var(--border)]">
        {cabinets.map((cab) => (
          <button
            key={cab}
            onClick={() => setActiveCabinet(cab)}
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

      {/* Slot grid */}
      <div className="grid grid-cols-2 gap-3">
        {visibleSlots.map((slot) => {
          const enabled = slotEnabled[slot.id] ?? slot.enabled
          const isDisabled = !enabled

          return (
            <Card
              key={slot.id}
              hover={false}
              className={cn(
                'p-4 transition-opacity',
                isDisabled && 'opacity-50'
              )}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <Badge variant={enabled ? 'success' : 'default'}>
                  Slot {slot.id}
                </Badge>
                {/* Pill toggle */}
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={enabled}
                    onChange={() => toggle(slot.id)}
                  />
                  <div
                    className={cn(
                      'h-5 w-9 rounded-full transition-colors duration-200',
                      'after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow after:transition-transform after:duration-200',
                      'peer-checked:after:translate-x-4',
                      enabled ? 'bg-blue-600' : 'bg-slate-300'
                    )}
                  />
                </label>
              </div>
              <p className="text-sm font-medium text-[var(--text-primary)] leading-snug truncate">
                {slot.product}
              </p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">
                {enabled ? `ON — ${t.enabled}` : `OFF — ${t.disabled}`}
              </p>
            </Card>
          )
        })}

        {visibleSlots.length === 0 && (
          <div className="col-span-2 py-10 text-center text-sm text-[var(--text-muted)]">
            No slots in this cabinet.
          </div>
        )}
      </div>
    </div>
  )
}
