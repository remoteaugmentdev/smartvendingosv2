// FILE: src/app/orders/page.tsx
'use client'

import { useState, useMemo } from 'react'
import { CreditCard, QrCode, Banknote, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'
import { PageHeader } from '@/components/layout/PageHeader'
import { cn } from '@/utils/cn'
import { ldaOrders, ldaMachines } from '@/data/lda'
import type { OrderStatus } from '@/data/lda'
import { useTranslation } from '@/hooks/useTranslation'

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtDateTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' }) +
    ' ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

function fmtEur(n: number) {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'
}

function PaymentIcon({ method }: { method: string }) {
  const cls = 'h-4 w-4'
  if (method === 'card') return <CreditCard className={cn(cls, 'text-blue-500')} />
  if (method === 'qr')   return <QrCode className={cn(cls, 'text-violet-500')} />
  return                        <Banknote className={cn(cls, 'text-emerald-500')} />
}

function statusVariant(s: OrderStatus): 'success' | 'info' | 'danger' {
  if (s === 'completed') return 'success'
  if (s === 'refunded')  return 'info'
  return 'danger'
}

const PAGE_SIZE = 10

export default function OrdersPage() {
  const t = useTranslation()
  const [dateStart, setDateStart]         = useState('')
  const [dateEnd, setDateEnd]             = useState('')
  const [machineFilter, setMachineFilter] = useState('all')
  const [productSearch, setProductSearch] = useState('')
  const [statusFilter, setStatusFilter]   = useState('all')
  const [page, setPage]                   = useState(1)
  const [selectedOrder, setSelectedOrder] = useState<(typeof ldaOrders)[number] | null>(null)
  const [showRefundConfirm, setShowRefundConfirm] = useState(false)
  const [orderStatuses, setOrderStatuses] = useState<Record<string, OrderStatus>>({})
  const [toast, setToast]                 = useState('')

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 4000)
  }

  // ── Derived filtered list ──────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return ldaOrders.filter((o) => {
      const effectiveStatus = orderStatuses[o.id] ?? o.status
      const oDate = new Date(o.date)

      if (dateStart && oDate < new Date(dateStart)) return false
      if (dateEnd   && oDate > new Date(dateEnd + 'T23:59:59')) return false
      if (machineFilter !== 'all' && o.deviceId !== machineFilter) return false
      if (productSearch && !o.product.toLowerCase().includes(productSearch.toLowerCase())) return false
      if (statusFilter !== 'all' && effectiveStatus !== statusFilter) return false
      return true
    })
  }, [dateStart, dateEnd, machineFilter, productSearch, statusFilter, orderStatuses])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage   = Math.min(page, totalPages)
  const pageStart  = (safePage - 1) * PAGE_SIZE
  const pageRows   = filtered.slice(pageStart, pageStart + PAGE_SIZE)

  function handleExport() {
    const header = ['Order ID', 'Product', 'Device ID', 'Status', 'Refund', 'Amount', 'Payment', 'Date']
    const rows = filtered.map((o) => [
      o.id, o.product, o.deviceId,
      orderStatuses[o.id] ?? o.status, o.refund,
      o.amount.toString(), o.payment, o.date,
    ])
    const csv  = [header, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = 'orders.csv'
    a.click()
    URL.revokeObjectURL(url)
    showToast('Export successful')
  }

  function handleIssueRefund() {
    if (!selectedOrder) return
    const amount = selectedOrder.amount
    setOrderStatuses((prev) => ({ ...prev, [selectedOrder.id]: 'refunded' }))
    setShowRefundConfirm(false)
    setSelectedOrder(null)
    showToast(`${t.refundProcessed} ${fmtEur(amount)} ${t.willBeReturned}`)
  }

  function statusLabel(s: OrderStatus) {
    if (s === 'completed') return t.completed
    if (s === 'refunded')  return t.refunded
    return t.failed
  }

  // Effective status for the detail modal
  const detailStatus = selectedOrder
    ? (orderStatuses[selectedOrder.id] ?? selectedOrder.status)
    : null

  return (
    <div className="p-6">
      <PageHeader title="Orders" description="Transaction history across all machines">
        <Button variant="secondary" size="md" onClick={handleExport}>
          {t.exportCsv}
        </Button>
      </PageHeader>

      {/* ── Filters Row ─────────────────────────────────────────────────── */}
      <Card hover={false} className="mb-5">
        <div className="flex flex-wrap items-center gap-3">
          {/* Date range */}
          <div className="flex items-center gap-1">
            <label className="text-xs text-[var(--text-muted)]">From</label>
            <input
              type="date"
              value={dateStart}
              onChange={(e) => { setDateStart(e.target.value); setPage(1) }}
              className="h-9 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-3 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="flex items-center gap-1">
            <label className="text-xs text-[var(--text-muted)]">To</label>
            <input
              type="date"
              value={dateEnd}
              onChange={(e) => { setDateEnd(e.target.value); setPage(1) }}
              className="h-9 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-3 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Machine */}
          <select
            value={machineFilter}
            onChange={(e) => { setMachineFilter(e.target.value); setPage(1) }}
            className="h-9 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-3 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="all">{t.allMachines}</option>
            {ldaMachines.map((m) => (
              <option key={m.id} value={m.id}>{m.name} ({m.id})</option>
            ))}
          </select>

          {/* Product search */}
          <input
            type="text"
            value={productSearch}
            onChange={(e) => { setProductSearch(e.target.value); setPage(1) }}
            placeholder={t.search}
            className="h-9 flex-1 min-w-[140px] rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* Status filter */}
          <div className="flex gap-1">
            {(['all', 'completed', 'refunded', 'failed'] as const).map((s) => (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); setPage(1) }}
                className={cn(
                  'rounded-xl px-3 py-1.5 text-xs font-medium transition-colors capitalize',
                  statusFilter === s
                    ? 'bg-blue-600 text-white'
                    : 'border border-[var(--border)] text-[var(--text-muted)] hover:bg-slate-100'
                )}
              >
                {s === 'all' ? t.all : s === 'completed' ? t.completed : s === 'refunded' ? t.refunded : t.failed}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* ── Orders Table ─────────────────────────────────────────────────── */}
      <Card hover={false}>
        <Table>
          <Thead>
            <Tr>
              <Th>{t.product}</Th>
              <Th>{t.deviceId}</Th>
              <Th>{t.status}</Th>
              <Th>{t.refund}</Th>
              <Th>{t.amount}</Th>
              <Th>{t.payment}</Th>
              <Th>{t.date}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {pageRows.map((o) => {
              const effectiveStatus = orderStatuses[o.id] ?? o.status
              return (
                <Tr
                  key={o.id}
                  className="cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => setSelectedOrder(o)}
                >
                  <Td className="font-medium max-w-[140px] truncate">{o.product}</Td>
                  <Td className="font-mono text-xs text-[var(--text-muted)]">{o.deviceId}</Td>
                  <Td>
                    <Badge variant={statusVariant(effectiveStatus)}>
                      {statusLabel(effectiveStatus)}
                    </Badge>
                  </Td>
                  <Td>
                    {o.refund === 'refunded' || effectiveStatus === 'refunded' ? (
                      <Badge variant="info">{t.refunded}</Badge>
                    ) : (
                      <span className="text-[var(--text-muted)]">—</span>
                    )}
                  </Td>
                  <Td className="font-semibold">{fmtEur(o.amount)}</Td>
                  <Td>
                    <span title={o.payment}>
                      <PaymentIcon method={o.payment} />
                    </span>
                  </Td>
                  <Td className="text-xs text-[var(--text-muted)] whitespace-nowrap">{fmtDateTime(o.date)}</Td>
                </Tr>
              )
            })}
            {pageRows.length === 0 && (
              <Tr>
                <Td colSpan={7} className="py-8 text-center text-[var(--text-muted)]">
                  No orders match your filters.
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between text-sm text-[var(--text-muted)]">
          <span>
            {filtered.length === 0
              ? 'No results'
              : `${t.showing} ${pageStart + 1}–${Math.min(pageStart + PAGE_SIZE, filtered.length)} ${t.of} ${filtered.length}`}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              aria-label={t.previous}
              className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-slate-100 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 text-xs font-medium text-[var(--text-primary)]">
              {safePage} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              aria-label={t.next}
              className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-slate-100 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Card>

      {/* ── Order Detail Modal ────────────────────────────────────────────── */}
      {selectedOrder && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => { setSelectedOrder(null); setShowRefundConfirm(false) }}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl bg-[var(--bg-card)] shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
                <h3 className="text-base font-semibold text-[var(--text-primary)]">{t.orderDetail}</h3>
                <button
                  onClick={() => { setSelectedOrder(null); setShowRefundConfirm(false) }}
                  className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-slate-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-5 space-y-3">
                {[
                  [t.orderId,    selectedOrder.id],
                  [t.machine,    selectedOrder.deviceId],
                  [t.product,    selectedOrder.product],
                  [t.slot,       selectedOrder.slot],
                  ['SIRET',      selectedOrder.siret ?? '—'],
                  [t.amount,     fmtEur(selectedOrder.amount)],
                  [t.payment,    selectedOrder.payment],
                  [t.date,       fmtDateTime(selectedOrder.date)],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between text-sm">
                    <span className="text-[var(--text-muted)]">{label}</span>
                    <span className="font-medium text-[var(--text-primary)]">{value}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text-muted)]">{t.status}</span>
                  <Badge variant={statusVariant(detailStatus!)}>
                    {statusLabel(detailStatus!)}
                  </Badge>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-[var(--border)] px-6 py-4 flex justify-end gap-2">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => { setSelectedOrder(null); setShowRefundConfirm(false) }}
                >
                  {t.close}
                </Button>
                {detailStatus !== 'refunded' && (
                  <Button variant="primary" size="md" onClick={() => setShowRefundConfirm(true)}>
                    {t.issueRefund}
                  </Button>
                )}
              </div>

              {/* Inline refund confirm */}
              {showRefundConfirm && (
                <div className="border-t border-[var(--border)] bg-amber-50 px-6 py-4">
                  <p className="text-sm font-medium text-amber-800 mb-3">
                    {t.refundConfirm} <strong>{fmtEur(selectedOrder.amount)}</strong> — {t.refundConfirm2}
                  </p>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => setShowRefundConfirm(false)}>
                      {t.cancel}
                    </Button>
                    <Button variant="danger" size="sm" onClick={handleIssueRefund}>
                      {t.confirm}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── Toast ─────────────────────────────────────────────────────────── */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 rounded-lg bg-slate-900 px-4 py-3 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  )
}
