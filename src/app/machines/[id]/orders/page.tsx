'use client'

import { use, useState } from 'react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'
import { ldaOrders, type OrderStatus } from '@/data/lda'
import { CreditCard, QrCode, Banknote, Search, X } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

const TODAY = '2026-05-07'

function statusVariant(status: OrderStatus): 'success' | 'info' | 'danger' {
  if (status === 'completed') return 'success'
  if (status === 'refunded') return 'info'
  return 'danger'
}

function PaymentIcon({ payment }: { payment: string }) {
  if (payment === 'card') return <CreditCard className="h-4 w-4 text-blue-500" />
  if (payment === 'qr') return <QrCode className="h-4 w-4 text-purple-500" />
  return <Banknote className="h-4 w-4 text-emerald-500" />
}

type Order = (typeof ldaOrders)[number] & { status: OrderStatus }

export default function OrdersPage({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslation()
  const { id } = use(params)

  const [activeTab, setActiveTab] = useState<'today' | '30day'>('today')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showRefundConfirm, setShowRefundConfirm] = useState(false)
  const [orderStatuses, setOrderStatuses] = useState<Record<string, OrderStatus>>(
    Object.fromEntries(ldaOrders.map((o) => [o.id, o.status]))
  )
  const [toast, setToast] = useState('')

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const machineOrders = ldaOrders.filter((o) => o.deviceId === id)

  const tabFiltered = machineOrders.filter((o) => {
    if (activeTab === 'today') return o.date.startsWith(TODAY)
    return true
  })

  const filtered = tabFiltered.filter((o) => {
    const effectiveStatus = orderStatuses[o.id] ?? o.status
    const matchSearch =
      search === '' ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.product.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || effectiveStatus === statusFilter
    return matchSearch && matchStatus
  })

  function handleConfirmRefund() {
    if (!selectedOrder) return
    setOrderStatuses((prev) => ({ ...prev, [selectedOrder.id]: 'refunded' }))
    showToast('Refund issued successfully.')
    setShowRefundConfirm(false)
    setSelectedOrder(null)
  }

  function getStatusLabel(status: OrderStatus): string {
    if (status === 'completed') return t.completed
    if (status === 'refunded') return t.refunded
    return t.failed
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-xl font-bold text-[var(--text-primary)]">{t.orderCenter} — Machine {id}</h1>

      {/* Search + filter */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.search + ' order ID or product...'}
            className="w-full rounded-lg border border-[var(--border)] bg-white pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | OrderStatus)}
          className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">{t.allStatuses}</option>
          <option value="completed">{t.completed}</option>
          <option value="refunded">{t.refunded}</option>
          <option value="failed">{t.failed}</option>
        </select>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[var(--border)]">
        {(['today', '30day'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            {tab === 'today' ? t.todayOrders : t.thirtyDayOrders}
          </button>
        ))}
      </div>

      <Card hover={false}>
        <Table>
          <Thead>
            <Tr>
              <Th>Order ID</Th>
              <Th>{t.product}</Th>
              <Th>Slot</Th>
              <Th>{t.amount}</Th>
              <Th>Payment</Th>
              <Th>{t.status}</Th>
              <Th>Time</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filtered.length === 0 ? (
              <Tr>
                <Td colSpan={7} className="text-center text-[var(--text-muted)] py-8">
                  No orders found
                </Td>
              </Tr>
            ) : (
              filtered.map((order) => {
                const effectiveStatus = (orderStatuses[order.id] ?? order.status) as OrderStatus
                return (
                  <Tr
                    key={order.id}
                    className="cursor-pointer hover:bg-slate-50"
                    onClick={() => setSelectedOrder({ ...order, status: effectiveStatus })}
                  >
                    <Td className="font-mono text-xs">{order.id}</Td>
                    <Td>{order.product}</Td>
                    <Td className="font-mono text-xs">{order.slot}</Td>
                    <Td className="font-semibold">{order.amount.toFixed(2)} €</Td>
                    <Td>
                      <PaymentIcon payment={order.payment} />
                    </Td>
                    <Td>
                      <Badge variant={statusVariant(effectiveStatus)}>
                        {getStatusLabel(effectiveStatus)}
                      </Badge>
                    </Td>
                    <Td className="text-xs text-[var(--text-muted)]">
                      {new Date(order.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </Td>
                  </Tr>
                )
              })
            )}
          </Tbody>
        </Table>
      </Card>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <button
              onClick={() => { setSelectedOrder(null); setShowRefundConfirm(false) }}
              className="absolute right-4 top-4 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="mb-4 text-lg font-bold text-[var(--text-primary)]">{t.orderDetail}</h2>
            <dl className="space-y-2 text-sm">
              {[
                ['Order ID', selectedOrder.id],
                ['Machine', id],
                [t.product, selectedOrder.product],
                ['Slot', selectedOrder.slot],
                [t.amount, `${selectedOrder.amount.toFixed(2)} €`],
                ['Payment', selectedOrder.payment],
                [t.date, new Date(selectedOrder.date).toLocaleString('fr-FR')],
                [t.status, getStatusLabel(selectedOrder.status)],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <dt className="text-[var(--text-muted)]">{label}</dt>
                  <dd className="font-medium text-[var(--text-primary)]">{value}</dd>
                </div>
              ))}
            </dl>

            {selectedOrder.status !== 'refunded' && (
              <div className="mt-5">
                {!showRefundConfirm ? (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setShowRefundConfirm(true)}
                  >
                    {t.issueRefund}
                  </Button>
                ) : (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3 space-y-3">
                    <p className="text-sm text-red-700">
                      {t.refundConfirm} {selectedOrder.amount.toFixed(2)} €? {t.refundConfirm2}
                    </p>
                    <div className="flex gap-2">
                      <Button variant="danger" size="sm" onClick={handleConfirmRefund}>
                        {t.confirm}
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => setShowRefundConfirm(false)}>
                        {t.cancel}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <Button variant="secondary" size="sm" onClick={() => { setSelectedOrder(null); setShowRefundConfirm(false) }}>
                {t.close}
              </Button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-4 right-4 z-50 rounded-lg bg-slate-900 px-4 py-3 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  )
}
