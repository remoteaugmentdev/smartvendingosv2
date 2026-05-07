'use client'

import { use, useState } from 'react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'
import { Coins, CheckCircle2 } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

const COIN_BREAKDOWN = [
  { denomination: '2 €', count: 12, subtotal: 24.0 },
  { denomination: '1 €', count: 18, subtotal: 18.0 },
  { denomination: '0.50 €', count: 20, subtotal: 10.0 },
  { denomination: '0.20 €', count: 15, subtotal: 3.0 },
  { denomination: '0.10 €', count: 25, subtotal: 2.5 },
]

const TOTAL_CASH = 87.5

export default function CashSummaryPage({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslation()
  const { id } = use(params)

  const [showConfirm, setShowConfirm] = useState(false)
  const [collected, setCollected] = useState(false)
  const [toast, setToast] = useState('')

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  function handleConfirm() {
    setCollected(true)
    setShowConfirm(false)
    showToast(t.collectionRecorded)
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-xl font-bold text-[var(--text-primary)]">{t.cashCoin} — Machine {id}</h1>

      {/* Large total display */}
      <Card hover={false}>
        <div className="flex flex-col items-center gap-3 py-6">
          <Coins className="h-10 w-10 text-amber-500" />
          <p className="text-5xl font-bold tracking-tight text-[var(--text-primary)]">
            {TOTAL_CASH.toFixed(2)} €
          </p>
          <p className="text-sm text-[var(--text-muted)]">{t.totalCash}</p>
          <p className="text-xs text-[var(--text-muted)]">
            {t.lastCollection}: 05 May 2026 by Jean-Paul
          </p>
          {collected && (
            <div className="flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              {t.collectionRecorded}
            </div>
          )}
        </div>
      </Card>

      {/* Coin breakdown */}
      <Card hover={false}>
        <CardHeader>
          <CardTitle>{t.coinBreakdown}</CardTitle>
        </CardHeader>
        <Table>
          <Thead>
            <Tr>
              <Th>{t.denomination}</Th>
              <Th>{t.count}</Th>
              <Th>{t.subtotal}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {COIN_BREAKDOWN.map((row) => (
              <Tr key={row.denomination}>
                <Td className="font-semibold">{row.denomination}</Td>
                <Td>{row.count}</Td>
                <Td className="font-medium text-emerald-700">{row.subtotal.toFixed(2)} €</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>

      {/* Mark as Collected */}
      <div className="flex justify-end">
        {!showConfirm ? (
          <Button
            variant="primary"
            size="md"
            onClick={() => setShowConfirm(true)}
            disabled={collected}
          >
            {t.markAsCollected}
          </Button>
        ) : (
          <Card hover={false} className="w-full max-w-sm">
            <p className="mb-3 text-sm text-[var(--text-primary)]">
              Confirm cash collection of{' '}
              <span className="font-bold">{TOTAL_CASH.toFixed(2)} €</span>? This action will be
              recorded.
            </p>
            <div className="flex gap-2">
              <Button variant="primary" size="sm" onClick={handleConfirm}>
                {t.confirm}
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setShowConfirm(false)}>
                {t.cancel}
              </Button>
            </div>
          </Card>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-4 right-4 z-50 rounded-lg bg-slate-900 px-4 py-3 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  )
}
