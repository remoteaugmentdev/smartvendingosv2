'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { PageHeader } from '@/components/layout/PageHeader'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'
import { ArrowLeft } from 'lucide-react'

const rows: {
  product: string; machine: string; stock: number; daily: number; days: number; confidence: number; restock: string
}[] = [
  { product: 'Coca-Cola 12 oz', machine: 'WF002', stock: 6, daily: 3.2, days: 2, confidence: 94, restock: 'Jun 2' },
  { product: 'Doritos Nacho Cheese', machine: 'WF001', stock: 9, daily: 2.4, days: 4, confidence: 88, restock: 'Jun 4' },
  { product: 'Red Bull 8.4 oz', machine: 'OR001', stock: 5, daily: 1.1, days: 5, confidence: 81, restock: 'Jun 5' },
  { product: 'Mountain Dew 12 oz', machine: 'CD002', stock: 22, daily: 2.8, days: 8, confidence: 90, restock: 'Jun 8' },
  { product: 'Snickers Bar', machine: 'IA001', stock: 31, daily: 1.9, days: 16, confidence: 86, restock: 'Jun 16' },
]

function tone(days: number) {
  if (days <= 3) return { variant: 'danger' as const, label: `Stockout in ${days}d` }
  if (days <= 7) return { variant: 'warning' as const, label: `Stockout in ${days}d` }
  return { variant: 'success' as const, label: `${days}d left` }
}

export default function ForecastPage() {
  return (
    <div className="space-y-6 p-6">
      <Link href="/insights" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]">
        <ArrowLeft size={15} /> Back to AI Insights
      </Link>
      <PageHeader title="Demand Forecast" description="Predicted stockouts across your fleet · next 7 days" />

      <Card>
        <Table>
          <Thead>
            <Tr>
              <Th>Product</Th>
              <Th>Machine</Th>
              <Th>Current Stock</Th>
              <Th className="hidden sm:table-cell">Predicted Daily Sales</Th>
              <Th>Days Until Stockout</Th>
              <Th className="hidden md:table-cell">Confidence</Th>
              <Th className="hidden md:table-cell">Recommended Restock</Th>
            </Tr>
          </Thead>
          <Tbody>
            {rows.map((r) => {
              const t = tone(r.days)
              return (
                <Tr key={r.product + r.machine}>
                  <Td className="font-medium">{r.product}</Td>
                  <Td className="font-mono text-xs">{r.machine}</Td>
                  <Td>{r.stock}</Td>
                  <Td className="hidden sm:table-cell">{r.daily.toFixed(1)}/day</Td>
                  <Td><Badge variant={t.variant}>{t.label}</Badge></Td>
                  <Td className="hidden md:table-cell">{r.confidence}%</Td>
                  <Td className="hidden md:table-cell">{r.restock}</Td>
                </Tr>
              )
            })}
          </Tbody>
        </Table>
      </Card>
    </div>
  )
}
