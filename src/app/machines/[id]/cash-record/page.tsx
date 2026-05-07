'use client'

import { use, useState } from 'react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'
import { ldaCashRecords } from '@/data/lda'
import { useTranslation } from '@/hooks/useTranslation'

type RecordType = 'All' | 'Cash Collection' | 'Coin Refund'

export default function CashRecordPage({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslation()
  const { id } = use(params)

  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [typeFilter, setTypeFilter] = useState<RecordType>('All')

  const records = ldaCashRecords.filter((r) => {
    if (r.machineId !== id) return false
    const recordDate = r.date.substring(0, 10)
    if (dateFrom && recordDate < dateFrom) return false
    if (dateTo && recordDate > dateTo) return false
    if (typeFilter !== 'All' && r.type !== typeFilter) return false
    return true
  })

  const total = records.reduce((sum, r) => (r.amount > 0 ? sum + r.amount : sum), 0)

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-xl font-bold text-[var(--text-primary)]">{t.cashCoinRecord} — Machine {id}</h1>

      {/* Filters */}
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
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[var(--text-muted)]">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as RecordType)}
              className="rounded-lg border border-[var(--border)] bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">{t.all}</option>
              <option value="Cash Collection">Cash Collection</option>
              <option value="Coin Refund">Coin Refund</option>
            </select>
          </div>
          {(dateFrom || dateTo || typeFilter !== 'All') && (
            <button
              onClick={() => { setDateFrom(''); setDateTo(''); setTypeFilter('All') }}
              className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] underline pb-0.5"
            >
              {t.filter} clear
            </button>
          )}
        </div>
      </Card>

      <Card hover={false}>
        <Table>
          <Thead>
            <Tr>
              <Th>{t.date}</Th>
              <Th>Type</Th>
              <Th>{t.amount}</Th>
              <Th>Technician</Th>
              <Th>{t.notes}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {records.length === 0 ? (
              <Tr>
                <Td colSpan={5} className="text-center text-[var(--text-muted)] py-8">
                  No records found
                </Td>
              </Tr>
            ) : (
              records.map((record) => (
                <Tr key={record.id}>
                  <Td className="text-xs">
                    {new Date(record.date).toLocaleString('fr-FR', {
                      day: '2-digit', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </Td>
                  <Td>{record.type}</Td>
                  <Td
                    className={`font-semibold ${
                      record.amount < 0 ? 'text-red-600' : 'text-emerald-600'
                    }`}
                  >
                    {record.amount < 0 ? '' : '+'}{record.amount.toFixed(2)} €
                  </Td>
                  <Td>{record.technician}</Td>
                  <Td className="text-[var(--text-muted)] text-xs">{record.notes || '—'}</Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>

        {records.length > 0 && (
          <div className="mt-4 flex justify-end border-t border-[var(--border)] pt-4">
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              {t.totalCollected}:{' '}
              <span className="text-emerald-600">{total.toFixed(2)} €</span>
            </p>
          </div>
        )}
      </Card>
    </div>
  )
}
