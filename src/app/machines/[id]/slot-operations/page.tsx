'use client'

import { use, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'
import { ldaSlotOperationRecords } from '@/data/lda'
import { useTranslation } from '@/hooks/useTranslation'

export default function SlotOperationsPage({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslation()
  const { id } = use(params)

  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const records = ldaSlotOperationRecords.filter((r) => {
    if (r.machineId !== id) return false
    const recordDate = r.date.substring(0, 10)
    if (dateFrom && recordDate < dateFrom) return false
    if (dateTo && recordDate > dateTo) return false
    return true
  })

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-xl font-bold text-[var(--text-primary)]">{t.operationRecord} — Machine {id}</h1>

      {/* Date filter */}
      <Card hover={false}>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[var(--text-muted)]">{t.date} From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="rounded-lg border border-[var(--border)] bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[var(--text-muted)]">{t.date} To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="rounded-lg border border-[var(--border)] bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {(dateFrom || dateTo) && (
            <button
              onClick={() => { setDateFrom(''); setDateTo('') }}
              className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] underline pb-0.5"
            >
              Clear
            </button>
          )}
        </div>
      </Card>

      <Card hover={false}>
        <Table>
          <Thead>
            <Tr>
              <Th>Slot #</Th>
              <Th>{t.product}</Th>
              <Th>Operation Type</Th>
              <Th>Old Value</Th>
              <Th>New Value</Th>
              <Th>Operator</Th>
              <Th>{t.date}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {records.length === 0 ? (
              <Tr>
                <Td colSpan={7} className="text-center text-[var(--text-muted)] py-8">
                  No operation records found
                </Td>
              </Tr>
            ) : (
              records.map((rec) => (
                <Tr key={rec.id}>
                  <Td className="font-mono font-medium">{rec.slot}</Td>
                  <Td>{rec.product}</Td>
                  <Td>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                      {rec.operation}
                    </span>
                  </Td>
                  <Td className="text-[var(--text-muted)] text-xs">{rec.oldValue}</Td>
                  <Td className="text-xs font-medium">{rec.newValue}</Td>
                  <Td className="text-xs">{rec.operator}</Td>
                  <Td className="text-xs text-[var(--text-muted)]">
                    {new Date(rec.date).toLocaleString('fr-FR', {
                      day: '2-digit', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Card>
    </div>
  )
}
