'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { PageHeader } from '@/components/layout/PageHeader'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'
import { ArrowLeft, ListChecks } from 'lucide-react'

const rows: {
  machine: string; slot: string; product: string; current: number; load: number; priority: 'High' | 'Medium' | 'Low'
}[] = [
  { machine: 'WF002', slot: 'A-04', product: 'Coca-Cola 12 oz', current: 6, load: 18, priority: 'High' },
  { machine: 'WF001', slot: 'B-02', product: 'Doritos Nacho Cheese', current: 9, load: 14, priority: 'High' },
  { machine: 'OR001', slot: 'A-09', product: 'Red Bull 8.4 oz', current: 5, load: 10, priority: 'Medium' },
  { machine: 'CD002', slot: 'A-01', product: 'Mountain Dew 12 oz', current: 22, load: 8, priority: 'Low' },
]

const PRIORITY = { High: 'danger', Medium: 'warning', Low: 'default' } as const

export default function RecommendationsPage() {
  const totalUnits = rows.reduce((s, r) => s + r.load, 0)
  const machines = new Set(rows.map((r) => r.machine)).size

  return (
    <div className="space-y-6 p-6">
      <Link href="/insights" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]">
        <ArrowLeft size={15} /> Back to AI Insights
      </Link>
      <PageHeader title="Restock Recommendations" description="Optimal load quantities for the next trip">
        <Button size="sm"><ListChecks size={16} /> Generate Pick List</Button>
      </PageHeader>

      <Card>
        <Table>
          <Thead>
            <Tr>
              <Th>Machine</Th>
              <Th>Slot</Th>
              <Th>Product</Th>
              <Th>Current Qty</Th>
              <Th>Recommended to Load</Th>
              <Th>Priority</Th>
            </Tr>
          </Thead>
          <Tbody>
            {rows.map((r) => (
              <Tr key={r.machine + r.slot}>
                <Td className="font-mono text-xs">{r.machine}</Td>
                <Td className="font-mono text-xs">{r.slot}</Td>
                <Td className="font-medium">{r.product}</Td>
                <Td>{r.current}</Td>
                <Td className="font-semibold text-blue-600">+{r.load}</Td>
                <Td><Badge variant={PRIORITY[r.priority]}>{r.priority}</Badge></Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <p className="mt-4 text-sm text-[var(--text-muted)]">
          Total units to load: <span className="font-semibold text-[var(--text-primary)]">{totalUnits}</span> across {machines} machines.
        </p>
      </Card>
    </div>
  )
}
