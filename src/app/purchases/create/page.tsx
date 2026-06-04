'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/layout/PageHeader'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'
import { ArrowLeft, Plus, X } from 'lucide-react'
import { formatCurrency } from '@/utils/formatCurrency'

interface Line { id: number; product: string; perCase: number; cases: number; unitCost: number }

const PRODUCTS = ['Coca-Cola 12 oz', 'Mountain Dew 12 oz', 'Doritos Nacho Cheese', 'Fritos Corn Chips', 'Red Bull 8.4 oz', 'Snickers Bar']

let nextId = 1

export default function CreatePurchasePage() {
  const router = useRouter()
  const [lines, setLines] = useState<Line[]>([{ id: 0, product: PRODUCTS[0], perCase: 24, cases: 1, unitCost: 0.42 }])
  const [shipping, setShipping] = useState(0)

  function update(id: number, patch: Partial<Line>) {
    setLines((p) => p.map((l) => (l.id === id ? { ...l, ...patch } : l)))
  }

  const subtotal = lines.reduce((s, l) => s + l.perCase * l.cases * l.unitCost, 0)
  const tax = subtotal * 0.08
  const grand = subtotal + tax + shipping

  return (
    <div className="space-y-6 p-6">
      <Link href="/purchases" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]">
        <ArrowLeft size={15} /> Back to Purchases
      </Link>
      <PageHeader title="Create Purchase" description="New purchase order">
        <Button size="sm" variant="secondary" onClick={() => router.push('/purchases')}>Cancel</Button>
        <Button size="sm" onClick={() => router.push('/purchases')}>Save & Receive</Button>
      </PageHeader>

      <Card>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[['Date', 'date', '2026-06-02'], ['Invoice #', 'text', 'INV-'], ['Shipping ($)', 'number', '0']].map(([label, type]) => (
            <label key={label as string} className="block">
              <span className="mb-1 block text-xs font-medium text-[var(--text-muted)]">{label}</span>
              <input
                type={type as string}
                defaultValue={label === 'Date' ? '2026-06-02' : undefined}
                onChange={label === 'Shipping ($)' ? (e) => setShipping(Number(e.target.value) || 0) : undefined}
                className="h-9 w-full rounded-lg border border-[var(--border)] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </label>
          ))}
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-xs font-medium text-[var(--text-muted)]">Supplier</span>
            <select className="h-9 w-full rounded-lg border border-[var(--border)] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option>McLane Foodservice</option><option>Norman Sam&apos;s Club</option><option>Walmart Supercenter</option>
            </select>
          </label>
        </div>
      </Card>

      <Card>
        <CardHeader><CardTitle>Products</CardTitle></CardHeader>
        <Table>
          <Thead>
            <Tr><Th>Product</Th><Th>Units/Case</Th><Th>Cases</Th><Th>Total Units</Th><Th>Unit Cost</Th><Th>Total</Th><Th></Th></Tr>
          </Thead>
          <Tbody>
            {lines.map((l) => (
              <Tr key={l.id}>
                <Td>
                  <select value={l.product} onChange={(e) => update(l.id, { product: e.target.value })} className="h-8 rounded-lg border border-[var(--border)] px-2 text-sm">
                    {PRODUCTS.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </Td>
                <Td><input type="number" value={l.perCase} onChange={(e) => update(l.id, { perCase: Number(e.target.value) })} className="h-8 w-16 rounded-lg border border-[var(--border)] px-2 text-sm" /></Td>
                <Td><input type="number" value={l.cases} onChange={(e) => update(l.id, { cases: Number(e.target.value) })} className="h-8 w-16 rounded-lg border border-[var(--border)] px-2 text-sm" /></Td>
                <Td>{l.perCase * l.cases}</Td>
                <Td><input type="number" step="0.01" value={l.unitCost} onChange={(e) => update(l.id, { unitCost: Number(e.target.value) })} className="h-8 w-20 rounded-lg border border-[var(--border)] px-2 text-sm" /></Td>
                <Td className="font-medium">{formatCurrency(l.perCase * l.cases * l.unitCost, 2)}</Td>
                <Td><button onClick={() => setLines((p) => p.filter((x) => x.id !== l.id))} className="text-[var(--text-muted)] hover:text-red-600"><X size={14} /></button></Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Button size="sm" variant="secondary" className="mt-3" onClick={() => setLines((p) => [...p, { id: nextId++, product: PRODUCTS[0], perCase: 24, cases: 1, unitCost: 0.42 }])}>
          <Plus size={15} /> Add Product
        </Button>

        <dl className="mt-4 ml-auto max-w-xs space-y-1 text-sm">
          <div className="flex justify-between"><dt className="text-[var(--text-muted)]">Subtotal</dt><dd>{formatCurrency(subtotal, 2)}</dd></div>
          <div className="flex justify-between"><dt className="text-[var(--text-muted)]">Tax (8%)</dt><dd>{formatCurrency(tax, 2)}</dd></div>
          <div className="flex justify-between"><dt className="text-[var(--text-muted)]">Shipping</dt><dd>{formatCurrency(shipping, 2)}</dd></div>
          <div className="flex justify-between border-t border-[var(--border)] pt-1 font-bold"><dt>Grand Total</dt><dd>{formatCurrency(grand, 2)}</dd></div>
        </dl>
      </Card>
    </div>
  )
}
