'use client'

import { use } from 'react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'
import { ldaSlots } from '@/data/lda'
import { PackageSearch } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

export default function InventoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslation()
  const { id } = use(params)

  const slots = ldaSlots.filter((s) => s.machineId === id)

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-xl font-bold text-[var(--text-primary)]">{t.inventoryDetail} — Machine {id}</h1>

      <Card hover={false}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PackageSearch className="h-4 w-4" />
            Slot {t.inventory}
          </CardTitle>
          <p className="text-xs text-[var(--text-muted)]">{slots.length} slot(s)</p>
        </CardHeader>

        <Table>
          <Thead>
            <Tr>
              <Th>{t.product}</Th>
              <Th>{t.inventory}</Th>
              <Th>{t.shortage}</Th>
              <Th>{t.capacity}</Th>
              <Th className="min-w-[140px]">{t.fillPercent}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {slots.length === 0 ? (
              <Tr>
                <Td colSpan={5} className="text-center text-[var(--text-muted)] py-8">
                  No slots found for this machine
                </Td>
              </Tr>
            ) : (
              slots.map((slot) => {
                const shortage = slot.capacity - slot.inventory
                const fillPct = Math.round((slot.inventory / slot.capacity) * 100)
                const isShort = slot.inventory < (slot.capacity * 0.2)
                return (
                  <Tr key={slot.id}>
                    <Td>
                      <div>
                        <p className="font-medium text-[var(--text-primary)]">{slot.product}</p>
                        <p className="text-xs text-[var(--text-muted)]">Slot {slot.id}</p>
                      </div>
                    </Td>
                    <Td className="font-semibold">{slot.inventory}</Td>
                    <Td>
                      <span
                        className={`font-semibold ${
                          shortage > 0 && isShort ? 'text-red-600' : 'text-[var(--text-muted)]'
                        }`}
                      >
                        {shortage}
                      </span>
                    </Td>
                    <Td>{slot.capacity}</Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              fillPct >= 60
                                ? 'bg-emerald-500'
                                : fillPct >= 30
                                ? 'bg-amber-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${fillPct}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-[var(--text-muted)] w-8 text-right">
                          {fillPct}%
                        </span>
                      </div>
                    </Td>
                  </Tr>
                )
              })
            )}
          </Tbody>
        </Table>
      </Card>
    </div>
  )
}
