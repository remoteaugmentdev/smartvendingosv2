'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { PageHeader } from '@/components/layout/PageHeader'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'
import { Plus } from 'lucide-react'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDate } from '@/utils/formatDate'

type Status = 'received' | 'pending' | 'cancelled'

const STATUS: Record<Status, { label: string; variant: 'success' | 'warning' | 'danger' }> = {
  received: { label: 'Received', variant: 'success' },
  pending: { label: 'Pending', variant: 'warning' },
  cancelled: { label: 'Cancelled', variant: 'danger' },
}

const purchases: {
  id: string; date: string; invoice: string; supplier: string
  products: number; units: number; total: number; tax: number; shipping: number; status: Status
}[] = [
  { id: 'P-0042', date: '2026-05-06', invoice: 'INV-88231', supplier: 'McLane Foodservice', products: 8, units: 1200, total: 4820, tax: 386, shipping: 120, status: 'received' },
  { id: 'P-0041', date: '2026-05-02', invoice: 'INV-77410', supplier: "Norman Sam's Club", products: 5, units: 640, total: 2140, tax: 171, shipping: 60, status: 'received' },
  { id: 'P-0040', date: '2026-04-28', invoice: 'INV-90122', supplier: 'Walmart Supercenter', products: 12, units: 1850, total: 6310, tax: 505, shipping: 0, status: 'received' },
  { id: 'P-0039', date: '2026-04-22', invoice: 'INV-66902', supplier: 'McLane Foodservice', products: 6, units: 900, total: 3180, tax: 254, shipping: 95, status: 'pending' },
  { id: 'P-0038', date: '2026-04-18', invoice: 'INV-55218', supplier: "Norman Sam's Club", products: 4, units: 420, total: 1290, tax: 103, shipping: 45, status: 'received' },
  { id: 'P-0037', date: '2026-04-11', invoice: 'INV-44021', supplier: 'Walmart Supercenter', products: 3, units: 300, total: 870, tax: 70, shipping: 0, status: 'cancelled' },
]

export default function PurchasesPage() {
  const totalSpend = purchases.filter((p) => p.status !== 'cancelled').reduce((s, p) => s + p.total, 0)

  return (
    <div className="space-y-6 p-6">
      <PageHeader title="Purchases" description={`${purchases.length} purchase orders · ${formatCurrency(totalSpend)} committed`}>
        <Link href="/purchases/create"><Button size="sm"><Plus size={16} /> Create Purchase</Button></Link>
      </PageHeader>

      <Card>
        <Table>
          <Thead>
            <Tr>
              <Th>Date</Th>
              <Th>Invoice #</Th>
              <Th>Supplier</Th>
              <Th className="hidden md:table-cell">Products</Th>
              <Th className="hidden md:table-cell">Units</Th>
              <Th>Total</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {purchases.map((p) => (
              <Tr key={p.id}>
                <Td className="whitespace-nowrap">{formatDate(p.date)}</Td>
                <Td className="font-mono text-xs">{p.invoice}</Td>
                <Td className="font-medium">{p.supplier}</Td>
                <Td className="hidden md:table-cell">{p.products}</Td>
                <Td className="hidden md:table-cell">{p.units.toLocaleString()}</Td>
                <Td className="font-medium">{formatCurrency(p.total)}</Td>
                <Td><Badge variant={STATUS[p.status].variant}>{STATUS[p.status].label}</Badge></Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>
    </div>
  )
}
