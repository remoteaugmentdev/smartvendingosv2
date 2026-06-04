'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/layout/PageHeader'
import { ArrowLeft, Upload } from 'lucide-react'

const CATEGORIES = ['Fuel', 'Repairs & Maintenance', 'Refunds', 'Supplies', 'Insurance', 'Rent', 'Other']
const LOCATIONS = ['—', 'Crystal Clean', 'Wells Fargo Bank', 'Insurance Agency', 'Omega Retreat']
const MACHINES = ['—', 'CD001', 'CD002', 'WF001', 'WF002', 'OR001', 'IA001']

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-[var(--text-muted)]">{label}</span>
      {children}
    </label>
  )
}

const inputCls = 'h-9 w-full rounded-lg border border-[var(--border)] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400'

export default function CreateExpensePage() {
  const router = useRouter()

  return (
    <div className="space-y-6 p-6">
      <Link href="/expenses" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]">
        <ArrowLeft size={15} /> Back to Expenses
      </Link>
      <PageHeader title="Log Expense" description="Record a new expense" />

      <Card className="max-w-2xl">
        <form
          onSubmit={(e) => { e.preventDefault(); router.push('/expenses') }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          <Field label="Category">
            <select className={inputCls}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
          </Field>
          <Field label="Date"><input type="date" defaultValue="2026-06-02" className={inputCls} /></Field>
          <Field label="Amount ($)"><input type="number" step="0.01" placeholder="0.00" className={inputCls} required /></Field>
          <Field label="Payee"><input type="text" placeholder="Who was paid" className={inputCls} /></Field>
          <Field label="Assign to Location">
            <select className={inputCls}>{LOCATIONS.map((l) => <option key={l}>{l}</option>)}</select>
          </Field>
          <Field label="Assign to Machine">
            <select className={inputCls}>{MACHINES.map((m) => <option key={m}>{m}</option>)}</select>
          </Field>
          <div className="sm:col-span-2">
            <Field label="Description">
              <textarea rows={3} className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <div className="flex h-24 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-[var(--border)] text-[var(--text-muted)]">
              <Upload size={20} />
              <span className="mt-1 text-xs">Upload receipt photo</span>
            </div>
          </div>
          <div className="flex gap-2 sm:col-span-2">
            <Button size="sm" type="submit">Save Expense</Button>
            <Button size="sm" variant="secondary" type="button" onClick={() => router.push('/expenses')}>Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
