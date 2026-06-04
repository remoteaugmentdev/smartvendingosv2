'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/layout/PageHeader'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'
import { Plus, Search } from 'lucide-react'
import { locations } from '@/data/locations'
import { formatCurrency } from '@/utils/formatCurrency'

export default function LocationsPage() {
  const [search, setSearch] = useState('')

  const filtered = locations.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.address.toLowerCase().includes(search.toLowerCase())
  )

  const totalMachines = locations.reduce((s, l) => s + l.machineCount, 0)
  const totalSales = locations.reduce((s, l) => s + l.totalSales, 0)

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Locations"
        description={`${locations.length} locations · ${totalMachines} machines · ${formatCurrency(totalSales)} total sales`}
      >
        <Button size="sm">
          <Plus size={16} /> Add Location
        </Button>
      </PageHeader>

      <Card>
        <div className="mb-4 flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or address..."
              className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-card)] pl-9 pr-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        <Table>
          <Thead>
            <Tr>
              <Th>Location</Th>
              <Th className="hidden sm:table-cell">Address</Th>
              <Th>Machines</Th>
              <Th>Sales MTD</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filtered.length === 0 ? (
              <Tr>
                <Td colSpan={5} className="py-8 text-center text-[var(--text-muted)]">
                  No locations match your search.
                </Td>
              </Tr>
            ) : (
              filtered.map((l) => (
                <Tr key={l.id}>
                  <Td className="font-medium">{l.name}</Td>
                  <Td className="hidden sm:table-cell text-xs text-[var(--text-muted)]">{l.address}</Td>
                  <Td>{l.machineCount}</Td>
                  <Td className="font-medium">{formatCurrency(l.totalSales)}</Td>
                  <Td>
                    <Link
                      href={`/locations/${l.id}`}
                      className="text-xs font-medium text-blue-600 hover:text-blue-800"
                    >
                      View →
                    </Link>
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
