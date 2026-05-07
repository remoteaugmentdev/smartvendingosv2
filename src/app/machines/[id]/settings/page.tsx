'use client'

import { use, useState } from 'react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ldaMachines, ldaRoutes } from '@/data/lda'
import { Save, X } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

export default function MachineSettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslation()
  const { id } = use(params)
  const machine = ldaMachines.find((m) => m.id === id)

  const [name, setName] = useState(machine?.name ?? '')
  const [location, setLocation] = useState(machine?.location ?? '')
  const [route, setRoute] = useState(machine?.route ?? ldaRoutes[0]?.name ?? '')
  const [notes, setNotes] = useState('')
  const [toast, setToast] = useState('')

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    showToast('Machine settings saved successfully.')
  }

  function handleCancel() {
    setName(machine?.name ?? '')
    setLocation(machine?.location ?? '')
    setRoute(machine?.route ?? ldaRoutes[0]?.name ?? '')
    setNotes('')
  }

  if (!machine) {
    return (
      <div className="p-6 text-[var(--text-muted)]">Machine {id} not found.</div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-xl font-bold text-[var(--text-primary)]">{t.enterSetting} — {machine.name}</h1>

      <Card hover={false}>
        <CardHeader>
          <CardTitle>Machine Configuration</CardTitle>
        </CardHeader>
        <form onSubmit={handleSave} className="space-y-5">
          {/* Machine Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--text-primary)]">Machine {t.name}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Location */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--text-primary)]">{t.location}</label>
            <textarea
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              rows={3}
              className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Route Assignment */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--text-primary)]">{t.route}</label>
            <select
              value={route}
              onChange={(e) => setRoute(e.target.value)}
              className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {ldaRoutes.map((r) => (
                <option key={r.id} value={r.name}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--text-primary)]">{t.notes}</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Additional notes..."
              className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" variant="primary" size="md">
              <Save className="h-4 w-4" />
              {t.save}
            </Button>
            <Button type="button" variant="secondary" size="md" onClick={handleCancel}>
              <X className="h-4 w-4" />
              {t.cancel}
            </Button>
          </div>
        </form>
      </Card>

      {toast && (
        <div className="fixed bottom-4 right-4 z-50 rounded-lg bg-slate-900 px-4 py-3 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  )
}
