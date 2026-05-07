'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'
import { cn } from '@/utils/cn'
import { products } from '@/data/products'

type SortKey = 'totalSales' | 'totalQty'

const TOP_PRODUCTS = [...products]
  .sort((a, b) => b.totalSales - a.totalSales)
  .slice(0, 7)

export function TopProductsTable() {
  const [sortKey, setSortKey] = useState<SortKey>('totalSales')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const sorted = [...TOP_PRODUCTS].sort((a, b) => b[sortKey] - a[sortKey])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Products</CardTitle>
        <div className="flex gap-1">
          {(['totalSales', 'totalQty'] as SortKey[]).map((k) => (
            <button
              key={k}
              onClick={() => setSortKey(k)}
              className={cn(
                'rounded-md px-2 py-0.5 text-xs font-medium transition-colors',
                sortKey === k
                  ? 'bg-[var(--accent-primary)] text-white'
                  : 'text-[var(--text-muted)] hover:bg-slate-100'
              )}
            >
              {k === 'totalSales' ? 'Sales' : 'Qty'}
            </button>
          ))}
        </div>
      </CardHeader>
      <Table>
        <Thead>
          <Tr>
            <Th>Product</Th>
            <Th className="text-right">Sales ($)</Th>
            <Th className="text-right">Qty</Th>
          </Tr>
        </Thead>
        <Tbody>
          {sorted.map((p, i) => (
            <Tr
              key={p.id}
              onClick={() => setSelectedId(p.id === selectedId ? null : p.id)}
              className={cn(
                'cursor-pointer transition-colors',
                i % 2 === 1 ? 'bg-[#F8FAFC]' : '',
                selectedId === p.id
                  ? 'border-l-2 border-l-[var(--accent-primary)] bg-[var(--bg-active)]'
                  : 'hover:bg-slate-50'
              )}
            >
              <Td>{p.name}</Td>
              <Td className="text-right tabular-nums">{p.totalSales}</Td>
              <Td className="text-right tabular-nums">{p.totalQty}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Card>
  )
}
