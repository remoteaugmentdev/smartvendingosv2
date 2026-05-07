'use client'

import { use, useState } from 'react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ldaMachines } from '@/data/lda'
import { Copy, AlertTriangle, X } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

type CopyOptionKey = 'products' | 'pricing' | 'capacity' | 'energy'

export default function CopyPage({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslation()
  const { id } = use(params)
  const sourceMachine = ldaMachines.find((m) => m.id === id)
  const otherMachines = ldaMachines.filter((m) => m.id !== id)

  const COPY_OPTIONS: { key: CopyOptionKey; label: string }[] = [
    { key: 'products', label: t.productAssignments },
    { key: 'pricing', label: t.pricing },
    { key: 'capacity', label: t.capacitySettings },
    { key: 'energy', label: t.energySettings },
  ]

  const [targetMachines, setTargetMachines] = useState<string[]>([])
  const [copyOptions, setCopyOptions] = useState<CopyOptionKey[]>(['products'])
  const [showConfirm, setShowConfirm] = useState(false)
  const [toast, setToast] = useState('')

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  function toggleTarget(machineId: string) {
    setTargetMachines((prev) =>
      prev.includes(machineId) ? prev.filter((x) => x !== machineId) : [...prev, machineId]
    )
  }

  function toggleOption(key: CopyOptionKey) {
    setCopyOptions((prev) =>
      prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]
    )
  }

  function handleConfirmCopy() {
    setShowConfirm(false)
    setTargetMachines([])
    showToast(
      `Configuration copied to ${targetMachines.length} machine(s) successfully.`
    )
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-xl font-bold text-[var(--text-primary)]">{t.copyConfiguration} — Machine {id}</h1>

      {/* Source machine header */}
      <Card hover={false}>
        <div className="flex items-center gap-3">
          <Copy className="h-5 w-5 text-blue-500 shrink-0" />
          <div>
            <p className="text-xs text-[var(--text-muted)]">{t.sourceMachine}</p>
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              {sourceMachine?.name ?? id}
            </p>
            <p className="text-xs text-[var(--text-muted)]">{sourceMachine?.location}</p>
          </div>
        </div>
      </Card>

      {/* Target machines */}
      <Card hover={false}>
        <CardHeader>
          <CardTitle>{t.targetMachines}</CardTitle>
          <span className="text-xs text-[var(--text-muted)]">{targetMachines.length} selected</span>
        </CardHeader>
        <div className="space-y-2">
          {otherMachines.map((m) => (
            <label
              key={m.id}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition-colors ${
                targetMachines.includes(m.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-[var(--border)] hover:bg-slate-50'
              }`}
            >
              <input
                type="checkbox"
                checked={targetMachines.includes(m.id)}
                onChange={() => toggleTarget(m.id)}
                className="h-4 w-4 rounded accent-blue-600"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--text-primary)]">{m.name}</p>
                <p className="text-xs text-[var(--text-muted)]">{m.location}</p>
              </div>
              <span
                className={`h-2 w-2 rounded-full ${
                  m.status === 'online' ? 'bg-emerald-500' : 'bg-red-500'
                }`}
              />
            </label>
          ))}
        </div>
      </Card>

      {/* What to copy */}
      <Card hover={false}>
        <CardHeader>
          <CardTitle>{t.whatToCopy}</CardTitle>
        </CardHeader>
        <div className="space-y-2">
          {COPY_OPTIONS.map(({ key, label }) => (
            <label
              key={key}
              className="flex cursor-pointer items-center gap-3 rounded-lg p-2.5 hover:bg-slate-50"
            >
              <input
                type="checkbox"
                checked={copyOptions.includes(key)}
                onChange={() => toggleOption(key)}
                className="h-4 w-4 rounded accent-blue-600"
              />
              <span className="text-sm font-medium text-[var(--text-primary)]">{label}</span>
            </label>
          ))}
        </div>

        {/* Warning */}
        <div className="mt-4 flex gap-2 rounded-lg bg-amber-50 border border-amber-200 p-3">
          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700">
            Note: This operation will not copy current inventory levels. Actual stock counts must
            be managed per machine by the assigned technician.
          </p>
        </div>
      </Card>

      {/* Copy button */}
      <div className="flex justify-end">
        <Button
          variant="primary"
          size="md"
          onClick={() => setShowConfirm(true)}
          disabled={targetMachines.length === 0 || copyOptions.length === 0}
          className="bg-gradient-to-br from-blue-500 to-blue-700"
        >
          <Copy className="h-4 w-4" />
          {t.copyConfiguration}
        </Button>
      </div>

      {/* Confirm dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <button
              onClick={() => setShowConfirm(false)}
              className="absolute right-4 top-4 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="mb-3 text-lg font-bold text-[var(--text-primary)]">{t.confirm} {t.copyConfiguration}</h2>
            <p className="mb-2 text-sm text-[var(--text-muted)]">
              You are about to copy the following settings:
            </p>
            <ul className="mb-3 list-disc list-inside text-sm text-[var(--text-primary)] space-y-1">
              {copyOptions.map((key) => (
                <li key={key}>{COPY_OPTIONS.find((o) => o.key === key)?.label}</li>
              ))}
            </ul>
            <p className="mb-4 text-sm text-[var(--text-muted)]">
              ...to{' '}
              <span className="font-semibold text-[var(--text-primary)]">
                {targetMachines.length} machine(s)
              </span>
              . This cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button variant="primary" size="sm" onClick={handleConfirmCopy}>
                {t.confirm}
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setShowConfirm(false)}>
                {t.cancel}
              </Button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-4 right-4 z-50 rounded-lg bg-slate-900 px-4 py-3 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  )
}
