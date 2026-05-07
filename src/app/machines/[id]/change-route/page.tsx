'use client'

import { use, useState } from 'react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ldaMachines, ldaRoutes } from '@/data/lda'
import { MapPin, Plus } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

export default function ChangeRoutePage({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslation()
  const { id } = use(params)
  const machine = ldaMachines.find((m) => m.id === id)

  const [selectedRoute, setSelectedRoute] = useState(machine?.route ?? ldaRoutes[0]?.name ?? '')
  const [toast, setToast] = useState('')

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  function handleSave() {
    showToast(`Route updated to "${selectedRoute}" successfully.`)
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-xl font-bold text-[var(--text-primary)]">{t.changeRoute} — Machine {id}</h1>

      {/* Current route */}
      <Card hover={false}>
        <div className="flex items-center gap-3">
          <MapPin className="h-5 w-5 text-blue-500 shrink-0" />
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-0.5">{t.currentRoute}</p>
            <p className="text-sm font-semibold text-[var(--text-primary)]">{machine?.route ?? 'Unassigned'}</p>
          </div>
        </div>
      </Card>

      {/* Route selection */}
      <Card hover={false}>
        <CardHeader>
          <CardTitle>Select New Route</CardTitle>
        </CardHeader>
        <div className="space-y-3">
          {ldaRoutes.map((r) => (
            <label
              key={r.id}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors ${
                selectedRoute === r.name
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-[var(--border)] hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="route"
                value={r.name}
                checked={selectedRoute === r.name}
                onChange={() => setSelectedRoute(r.name)}
                className="accent-blue-600"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--text-primary)]">{r.name}</p>
                <p className="text-xs text-[var(--text-muted)]">
                  Technician: {r.technician} · {r.machines.length} machine(s)
                </p>
              </div>
              <span
                className="h-3 w-3 rounded-full shrink-0"
                style={{ backgroundColor: r.color }}
              />
            </label>
          ))}

          <button className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 mt-2">
            <Plus className="h-4 w-4" />
            {t.createNewRoute}
          </button>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button variant="primary" size="md" onClick={handleSave}>
          {t.saveRoute}
        </Button>
      </div>

      {toast && (
        <div className="fixed bottom-4 right-4 z-50 rounded-lg bg-slate-900 px-4 py-3 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  )
}
