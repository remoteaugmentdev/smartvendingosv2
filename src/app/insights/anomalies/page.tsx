'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { PageHeader } from '@/components/layout/PageHeader'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'
import { ArrowLeft, TrendingDown, WifiOff, Snail, TrendingUp } from 'lucide-react'

const active = [
  { Icon: TrendingDown, color: 'text-red-500', title: 'CD003 — Revenue dropped 64% vs 7-day average', detail: 'Average daily revenue: $89. Yesterday: $32. Possible cause: machine offline 4 hours.', when: 'Detected 6 hours ago' },
  { Icon: WifiOff, color: 'text-red-500', title: 'CD003 — Offline for 4h 23m', detail: 'No telemetry ping since 06:12. Last known fill level 0%.', when: 'Detected 4 hours ago' },
  { Icon: Snail, color: 'text-amber-500', title: 'WF003 — Slow seller: Tropicana OJ', detail: 'Slot A-07 sold 2 units in 14 days. Consider re-planogramming.', when: 'Detected yesterday' },
  { Icon: TrendingUp, color: 'text-blue-500', title: 'OR001 — Unusual spike: Red Bull +180%', detail: 'Sales 2.8× the weekly norm. Stockout risk elevated.', when: 'Detected 2 days ago' },
]

const log: { date: string; machine: string; type: string; status: 'Active' | 'Dismissed' | 'Resolved' }[] = [
  { date: 'May 31', machine: 'CD003', type: 'Revenue Drop', status: 'Active' },
  { date: 'May 30', machine: 'WF003', type: 'Slow Seller', status: 'Active' },
  { date: 'May 28', machine: 'OR001', type: 'Unusual Spike', status: 'Resolved' },
  { date: 'May 24', machine: 'WF001', type: 'Machine Offline', status: 'Resolved' },
  { date: 'May 20', machine: 'IA001', type: 'Revenue Drop', status: 'Dismissed' },
]

const LOG_VARIANT = { Active: 'danger', Resolved: 'success', Dismissed: 'default' } as const

export default function AnomaliesPage() {
  return (
    <div className="space-y-6 p-6">
      <Link href="/insights" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]">
        <ArrowLeft size={15} /> Back to AI Insights
      </Link>
      <PageHeader title="Anomaly Detection" description="Unusual patterns flagged automatically" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {active.map((a) => (
          <Card key={a.title}>
            <div className="flex gap-3">
              <a.Icon className={`h-5 w-5 shrink-0 ${a.color}`} />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-[var(--text-primary)]">{a.title}</p>
                <p className="mt-1 text-sm text-[var(--text-muted)]">{a.detail}</p>
                <p className="mt-2 text-xs text-[var(--text-muted)]">{a.when}</p>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="secondary">Investigate</Button>
                  <Button size="sm" variant="ghost">Dismiss</Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <Table>
          <Thead>
            <Tr><Th>Date</Th><Th>Machine</Th><Th>Type</Th><Th>Status</Th></Tr>
          </Thead>
          <Tbody>
            {log.map((l, i) => (
              <Tr key={i}>
                <Td className="whitespace-nowrap">{l.date}</Td>
                <Td className="font-mono text-xs">{l.machine}</Td>
                <Td>{l.type}</Td>
                <Td><Badge variant={LOG_VARIANT[l.status]}>{l.status}</Badge></Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>
    </div>
  )
}
