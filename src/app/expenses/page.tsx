'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { PageHeader } from '@/components/layout/PageHeader'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'
import { Plus } from 'lucide-react'
import { expenses, type ExpenseRecord } from '@/data/expenses'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDate } from '@/utils/formatDate'

const CATEGORY: Record<ExpenseRecord['category'], { label: string; variant: 'info' | 'warning' | 'danger' }> = {
  fuel: { label: 'Fuel', variant: 'info' },
  repairs: { label: 'Repairs & Maintenance', variant: 'warning' },
  refunds: { label: 'Refunds', variant: 'danger' },
}

type Filter = 'all' | ExpenseRecord['category']

export default function ExpensesPage() {
  const [filter, setFilter] = useState<Filter>('all')

  const filtered = filter === 'all' ? expenses : expenses.filter((e) => e.category === filter)
  const total = filtered.reduce((s, e) => s + e.amount, 0)

  return (
    <div className="space-y-6 p-6">
      <PageHeader title="Expenses" description={`${expenses.length} entries logged`}>
        <Link href="/expenses/create"><Button size="sm"><Plus size={16} /> Log Expense</Button></Link>
      </PageHeader>

      <Card>
        <div className="mb-4 flex flex-wrap gap-1">
          {(['all', 'fuel', 'repairs', 'refunds'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={
                'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ' +
                (filter === f ? 'bg-blue-600 text-white' : 'text-[var(--text-muted)] hover:bg-slate-100')
              }
            >
              {f === 'all' ? 'All' : CATEGORY[f].label}
            </button>
          ))}
        </div>

        <Table>
          <Thead>
            <Tr>
              <Th>Date</Th>
              <Th>Category</Th>
              <Th>Description</Th>
              <Th>Amount</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filtered.map((e) => (
              <Tr key={e.id}>
                <Td className="whitespace-nowrap">{formatDate(e.date)}</Td>
                <Td><Badge variant={CATEGORY[e.category].variant}>{CATEGORY[e.category].label}</Badge></Td>
                <Td className="text-[var(--text-muted)]">{e.description}</Td>
                <Td className="font-medium">{formatCurrency(e.amount, 2)}</Td>
              </Tr>
            ))}
          </Tbody>
          <tfoot>
            <Tr>
              <Td colSpan={3} className="text-right font-medium text-[var(--text-muted)]">Total</Td>
              <Td className="font-bold text-[var(--text-primary)]">{formatCurrency(total, 2)}</Td>
            </Tr>
          </tfoot>
        </Table>
      </Card>
    </div>
  )
}
