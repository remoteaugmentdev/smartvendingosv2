'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { PageHeader } from '@/components/layout/PageHeader'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'
import { Plus, CheckCircle2 } from 'lucide-react'
import { trips, type Trip } from '@/data/trips'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDate } from '@/utils/formatDate'

const DRIVERS: Record<string, string> = {
  'D-1': 'John Martinez',
  'D-2': 'Maria Chen',
  'D-3': 'Bob Williams',
}

const STATUS: Record<Trip['status'], { label: string; variant: 'success' | 'info' | 'default' }> = {
  completed: { label: 'Completed', variant: 'success' },
  in_progress: { label: 'In Progress', variant: 'info' },
  scheduled: { label: 'Scheduled', variant: 'default' },
}

type Filter = 'all' | Trip['status']

export default function TripsPage() {
  const [filter, setFilter] = useState<Filter>('all')

  const filtered = filter === 'all' ? trips : trips.filter((t) => t.status === filter)
  const totalCollected = filtered.reduce((s, t) => s + t.totalCollected, 0)

  return (
    <div className="space-y-6 p-6">
      <PageHeader title="Trips" description={`${trips.length} trips · ${formatCurrency(totalCollected)} collected`}>
        <Button size="sm" variant="secondary"><CheckCircle2 size={16} /> Check Trip</Button>
        <Link href="/trips/create"><Button size="sm"><Plus size={16} /> Create Trip</Button></Link>
      </PageHeader>

      <Card>
        <div className="mb-4 flex flex-wrap gap-1">
          {(['all', 'completed', 'in_progress', 'scheduled'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={
                'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ' +
                (filter === f ? 'bg-blue-600 text-white' : 'text-[var(--text-muted)] hover:bg-slate-100')
              }
            >
              {f === 'all' ? 'All' : STATUS[f].label}
            </button>
          ))}
        </div>

        <Table>
          <Thead>
            <Tr>
              <Th>Trip #</Th>
              <Th>Date</Th>
              <Th className="hidden sm:table-cell">Driver</Th>
              <Th>Status</Th>
              <Th>Machines</Th>
              <Th>Cash Collected</Th>
              <Th className="hidden md:table-cell">Units Restocked</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filtered.map((t) => (
              <Tr key={t.id}>
                <Td className="font-mono text-xs font-medium">
                  <Link href={`/trips/${t.id}`} className="text-blue-600 hover:underline">{t.id}</Link>
                </Td>
                <Td className="whitespace-nowrap">{formatDate(t.date)}</Td>
                <Td className="hidden sm:table-cell">{DRIVERS[t.driverId] ?? t.driverId}</Td>
                <Td><Badge variant={STATUS[t.status].variant}>{STATUS[t.status].label}</Badge></Td>
                <Td>{t.machinesServiced.length}</Td>
                <Td className="font-medium">{formatCurrency(t.totalCollected)}</Td>
                <Td className="hidden md:table-cell">{t.totalRestocked}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>
    </div>
  )
}
