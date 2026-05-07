'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'
import { BarChartWrapper } from '@/components/charts/BarChartWrapper'
import { AreaChartWrapper } from '@/components/charts/AreaChartWrapper'
import { DonutChartWrapper } from '@/components/charts/DonutChartWrapper'
import { cn } from '@/utils/cn'
import {
  ldaMachines,
  ldaProducts,
  ldaOrders,
  ldaWeeklyRevenue,
} from '@/data/lda'
import { useTranslation } from '@/hooks/useTranslation'

// ─── Derived constants ────────────────────────────────────────────────────────
const lowStockProducts = ldaProducts.filter((p) => p.stock <= p.reorderLevel)

const recentOrders = [...ldaOrders]
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 6)

const topProducts = [...ldaProducts]
  .sort((a, b) => b.totalRevenue - a.totalRevenue)
  .slice(0, 7)

const plBarData = [
  { label: 'Gross', value: 1240.5 },
  { label: 'Commission', value: 124 },
  { label: 'Refunds', value: 25 },
  { label: 'Net', value: 1091.5 },
]

const donutData = [
  { name: 'Commission', value: 124, color: '#64748B' },
  { name: 'Refunds', value: 25, color: '#EF4444' },
  { name: 'COGS', value: 620, color: '#2563EB' },
  { name: 'Net', value: 471, color: '#10B981' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
}

function fmtEur(n: number) {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const t = useTranslation()
  const [dismissedIds, setDismissedIds] = useState<string[]>([])
  const [productSort, setProductSort] = useState<'revenue' | 'qty'>('revenue')
  const [deviceSearch, setDeviceSearch] = useState('')
  const [deviceStatusFilter, setDeviceStatusFilter] = useState('all')

  // Reorder alert items not yet dismissed
  const activeAlerts = lowStockProducts.filter((p) => !dismissedIds.includes(p.id))

  // Filtered machines
  const filteredMachines = ldaMachines.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(deviceSearch.toLowerCase()) ||
      m.location.toLowerCase().includes(deviceSearch.toLowerCase()) ||
      m.id.includes(deviceSearch)
    const matchStatus = deviceStatusFilter === 'all' || m.status === deviceStatusFilter
    return matchSearch && matchStatus
  })

  // CSV export
  function exportCsv() {
    const header = ['Name', 'Location', 'Machine Code', 'Status', 'Last Ping', 'Today Revenue', 'Expiry Date']
    const rows = filteredMachines.map((m) => [
      m.name,
      m.location,
      m.id,
      m.status,
      m.lastPing,
      m.revenueToday.toString(),
      m.expiryDate,
    ])
    const csv = [header, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'devices.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6 p-6">

      {/* ── Section 1: Reorder Alert Banner ─────────────────────────────── */}
      {activeAlerts.length > 0 && (
        <div className="flex items-start justify-between rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
          <p className="text-sm font-medium text-amber-800">
            <span className="mr-1">⚠</span>
            <span className="font-bold">{t.reorderAlert}:</span>{' '}
            {activeAlerts.map((p, i) => (
              <span key={p.id}>
                <button
                  onClick={() => setDismissedIds((prev) => [...prev, p.id])}
                  className="underline decoration-dotted hover:text-amber-900 transition-colors"
                >
                  {p.name}
                </button>
                {i < activeAlerts.length - 1 && ', '}
              </span>
            ))}
          </p>
          <button
            onClick={() => setDismissedIds(lowStockProducts.map((p) => p.id))}
            className="ml-4 text-amber-600 hover:text-amber-900 text-lg leading-none shrink-0"
            aria-label="Dismiss all"
          >
            ×
          </button>
        </div>
      )}

      {/* ── Section 2: KPI Row ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">

        {/* 1 – Gross Revenue */}
        <Link href="/admin/finance" className="block">
          <div className="rounded-xl bg-[var(--bg-card)] p-4 shadow-[var(--shadow-card)] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 border-t-2 border-blue-500">
            <p className="text-xs font-medium text-[var(--text-muted)] mb-1">{t.grossRevenue}</p>
            <p className="text-xl font-bold text-[var(--text-primary)]">1 240,50 €</p>
            <Badge variant="success" className="mt-2">+12.5%</Badge>
          </div>
        </Link>

        {/* 2 – Active Machines */}
        <Link href="/admin/devices" className="block">
          <div className="rounded-xl bg-[var(--bg-card)] p-4 shadow-[var(--shadow-card)] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 border-t-2 border-emerald-500">
            <p className="text-xs font-medium text-[var(--text-muted)] mb-1">{t.activeMachines}</p>
            <p className="text-xl font-bold text-[var(--text-primary)]">2 / 3 online</p>
            <Badge variant="warning" className="mt-2">{t.offlineWarning}</Badge>
          </div>
        </Link>

        {/* 3 – Products Mapped */}
        <Link href="/admin/products" className="block">
          <div className="rounded-xl bg-[var(--bg-card)] p-4 shadow-[var(--shadow-card)] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 border-t-2 border-blue-400">
            <p className="text-xs font-medium text-[var(--text-muted)] mb-1">{t.productsMapped}</p>
            <p className="text-xl font-bold text-[var(--text-primary)]">24 / 30</p>
            <Badge variant="info" className="mt-2">80%</Badge>
          </div>
        </Link>

        {/* 4 – Pending SIRETs */}
        <Link href="/admin/producers" className="block">
          <div className="rounded-xl bg-[var(--bg-card)] p-4 shadow-[var(--shadow-card)] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 border-t-2 border-amber-400">
            <p className="text-xs font-medium text-[var(--text-muted)] mb-1">{t.pendingSirets}</p>
            <p className="text-xl font-bold text-[var(--text-primary)]">6</p>
            <Badge variant="warning" className="mt-2">{t.toProcess}</Badge>
          </div>
        </Link>

        {/* 5 – Active Producers */}
        <Link href="/admin/producers" className="block">
          <div className="rounded-xl bg-[var(--bg-card)] p-4 shadow-[var(--shadow-card)] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 border-t-2 border-emerald-400">
            <p className="text-xs font-medium text-[var(--text-muted)] mb-1">{t.activeProducers}</p>
            <p className="text-xl font-bold text-[var(--text-primary)]">8</p>
            <Badge variant="success" className="mt-2">{t.complete}</Badge>
          </div>
        </Link>

        {/* 6 – Low Stock Alerts */}
        <Link href="/admin/inventory" className="block">
          <div className="rounded-xl bg-[var(--bg-card)] p-4 shadow-[var(--shadow-card)] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 border-t-2 border-red-500">
            <p className="text-xs font-medium text-[var(--text-muted)] mb-1">{t.lowStockAlerts}</p>
            <p className="text-xl font-bold text-[var(--text-primary)]">4 slots</p>
            <Badge variant="danger" className="mt-2">{t.actionNeeded}</Badge>
          </div>
        </Link>

      </div>

      {/* ── Section 3: P&L + Weekly Revenue ─────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">

        {/* Left 40% — P&L Summary */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>{t.profitLoss}</CardTitle>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">{t.currentMonth}</p>
            </div>
          </CardHeader>
          <div className="mb-3">
            <p className="text-3xl font-bold text-emerald-600">1 091,50 €</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">{t.netRevenue}</p>
          </div>
          <BarChartWrapper
            data={plBarData}
            bars={[{ key: 'value', label: 'Amount (€)', color: '#2563EB' }]}
            xKey="label"
            height={160}
          />
          <p className="mt-3 text-xs text-[var(--text-muted)]">
            Net = Gross (1 240,50 €) − Commission (124 €) − Refunds (25 €)
          </p>
        </Card>

        {/* Right 60% — Weekly Revenue */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>{t.weeklyRevenue}</CardTitle>
          </CardHeader>
          <div className="mb-3 flex items-center gap-3">
            <p className="text-3xl font-bold text-[var(--text-primary)]">1 240,50 €</p>
            <Badge variant="success">+12.5%</Badge>
          </div>
          <AreaChartWrapper
            data={ldaWeeklyRevenue}
            dataKey="revenue"
            xKey="day"
            color="#2563EB"
            height={180}
          />
        </Card>

      </div>

      {/* ── Section 4: Recent Orders + Donut ────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-11">

        {/* Left 55% — Recent Orders */}
        <Card className="lg:col-span-6">
          <CardHeader>
            <CardTitle>{t.recentOrders}</CardTitle>
            <Link
              href="/admin/orders"
              className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              {t.viewAllOrders}
            </Link>
          </CardHeader>
          <Table>
            <Thead>
              <Tr>
                <Th>{t.product}</Th>
                <Th>{t.devices}</Th>
                <Th>{t.status}</Th>
                <Th>{t.refunded}</Th>
                <Th>{t.amount}</Th>
                <Th>Time</Th>
              </Tr>
            </Thead>
            <Tbody>
              {recentOrders.map((o) => (
                <Tr key={o.id}>
                  <Td className="font-medium max-w-[120px] truncate">{o.product}</Td>
                  <Td className="font-mono text-xs text-[var(--text-muted)]">{o.deviceId}</Td>
                  <Td>
                    <Badge
                      variant={
                        o.status === 'completed'
                          ? 'success'
                          : o.status === 'refunded'
                          ? 'info'
                          : 'danger'
                      }
                    >
                      {o.status === 'completed' ? t.completed : o.status === 'refunded' ? t.refunded : t.failed}
                    </Badge>
                  </Td>
                  <Td className="text-xs text-[var(--text-muted)]">
                    {o.refund === 'refunded' ? (
                      <Badge variant="info">{t.refunded}</Badge>
                    ) : (
                      <span className="text-[var(--text-muted)]">—</span>
                    )}
                  </Td>
                  <Td className="font-medium">{fmtEur(o.amount)}</Td>
                  <Td className="text-xs text-[var(--text-muted)]">
                    {fmtDate(o.date)} {fmtTime(o.date)}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Card>

        {/* Right 45% — Revenue Breakdown Donut */}
        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle>{t.revenueBreakdown}</CardTitle>
          </CardHeader>
          <DonutChartWrapper data={donutData} height={200} />
          <div className="mt-3 space-y-1.5">
            {donutData.map((seg) => (
              <div key={seg.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: seg.color }}
                  />
                  <span className="text-[var(--text-muted)]">{seg.name}</span>
                </div>
                <span className="font-semibold text-[var(--text-primary)]">{fmtEur(seg.value)}</span>
              </div>
            ))}
          </div>
        </Card>

      </div>

      {/* ── Section 5: Top Products + Top Machines ───────────────────────── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

        {/* Left — Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>{t.topProducts}</CardTitle>
            <div className="flex gap-1">
              <button
                onClick={() => setProductSort('revenue')}
                className={cn(
                  'rounded-lg px-3 py-1 text-xs font-medium transition-colors',
                  productSort === 'revenue'
                    ? 'bg-blue-600 text-white'
                    : 'text-[var(--text-muted)] hover:bg-slate-100'
                )}
              >
                Sales €
              </button>
              <button
                onClick={() => setProductSort('qty')}
                className={cn(
                  'rounded-lg px-3 py-1 text-xs font-medium transition-colors',
                  productSort === 'qty'
                    ? 'bg-blue-600 text-white'
                    : 'text-[var(--text-muted)] hover:bg-slate-100'
                )}
              >
                Qty
              </button>
            </div>
          </CardHeader>
          <Table>
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>{t.name}</Th>
                <Th>Qty Sold</Th>
                <Th>Revenue</Th>
                <Th className="w-24">Progress</Th>
              </Tr>
            </Thead>
            <Tbody>
              {[...topProducts]
                .sort((a, b) =>
                  productSort === 'revenue'
                    ? b.totalRevenue - a.totalRevenue
                    : b.totalSales - a.totalSales
                )
                .map((p, i) => {
                  const maxRev = topProducts[0].totalRevenue
                  const pct = Math.round((p.totalRevenue / maxRev) * 100)
                  return (
                    <Tr key={p.id}>
                      <Td className="text-[var(--text-muted)] font-medium">{i + 1}</Td>
                      <Td className="font-medium max-w-[130px] truncate">{p.name}</Td>
                      <Td className="text-[var(--text-muted)]">{p.totalSales}</Td>
                      <Td className="font-medium">{fmtEur(p.totalRevenue)}</Td>
                      <Td>
                        <div className="h-1.5 w-20 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-blue-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </Td>
                    </Tr>
                  )
                })}
            </Tbody>
          </Table>
        </Card>

        {/* Right — Top Machines */}
        <Card>
          <CardHeader>
            <CardTitle>{t.machinePerformance}</CardTitle>
          </CardHeader>
          <Table>
            <Thead>
              <Tr>
                <Th>{t.machine}</Th>
                <Th>{t.location}</Th>
                <Th>{t.todayRevenue}</Th>
                <Th>{t.status}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {ldaMachines.map((m) => (
                <Tr key={m.id}>
                  <Td className="font-medium">{m.name}</Td>
                  <Td className="text-xs text-[var(--text-muted)] max-w-[140px] truncate">
                    {m.location}
                  </Td>
                  <Td className="font-medium">{fmtEur(m.revenueToday)}</Td>
                  <Td>
                    <Badge variant={m.status === 'online' ? 'success' : m.status === 'warning' ? 'warning' : 'danger'}>
                      {m.status === 'online' ? t.online : t.offline}
                    </Badge>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Card>

      </div>

      {/* ── Section 6: Devices Table (full width) ───────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>{t.devices}</CardTitle>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={deviceSearch}
              onChange={(e) => setDeviceSearch(e.target.value)}
              placeholder={t.searchDevice}
              className="h-8 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-3 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <select
              value={deviceStatusFilter}
              onChange={(e) => setDeviceStatusFilter(e.target.value)}
              className="h-8 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-2 text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="all">{t.allStatuses}</option>
              <option value="online">{t.online}</option>
              <option value="offline">{t.offline}</option>
              <option value="warning">Warning</option>
            </select>
            <Button variant="secondary" size="sm" onClick={exportCsv}>
              {t.exportCsv}
            </Button>
          </div>
        </CardHeader>
        <Table>
          <Thead>
            <Tr>
              <Th>{t.name}</Th>
              <Th>{t.location}</Th>
              <Th>Machine Code</Th>
              <Th>{t.status}</Th>
              <Th>{t.lastPing}</Th>
              <Th>{t.todayRevenue}</Th>
              <Th>{t.expiryDate}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredMachines.length === 0 ? (
              <Tr>
                <Td colSpan={7} className="py-8 text-center text-[var(--text-muted)]">
                  No devices match your filters.
                </Td>
              </Tr>
            ) : (
              filteredMachines.map((m) => (
                <Tr key={m.id}>
                  <Td className="font-medium">{m.name}</Td>
                  <Td className="text-xs text-[var(--text-muted)]">{m.location}</Td>
                  <Td className="font-mono text-xs">{m.id}</Td>
                  <Td>
                    <Badge
                      variant={
                        m.status === 'online'
                          ? 'success'
                          : m.status === 'warning'
                          ? 'warning'
                          : 'danger'
                      }
                    >
                      {m.status === 'online' ? t.online : t.offline}
                    </Badge>
                  </Td>
                  <Td className="text-xs text-[var(--text-muted)]">
                    {fmtDate(m.lastPing)} {fmtTime(m.lastPing)}
                  </Td>
                  <Td className="font-medium">{fmtEur(m.revenueToday)}</Td>
                  <Td className="text-xs text-[var(--text-muted)]">
                    {new Date(m.expiryDate).toLocaleDateString('fr-FR')}
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
