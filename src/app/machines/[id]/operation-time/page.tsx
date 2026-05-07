'use client'

import { use, useState } from 'react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Clock } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function Toggle({
  checked,
  onChange,
  label,
  sublabel,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  sublabel?: string
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-[var(--text-primary)]">{label}</p>
        {sublabel && <p className="text-xs text-[var(--text-muted)]">{sublabel}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
          checked ? 'bg-blue-600' : 'bg-slate-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}

export default function OperationTimePage({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslation()
  const { id } = use(params)

  const [operationSwitch, setOperationSwitch] = useState(true)
  const [timeSwitch, setTimeSwitch] = useState(false)
  const [selectedDays, setSelectedDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri'])
  const [startTime, setStartTime] = useState('08:00')
  const [endTime, setEndTime] = useState('20:00')
  const [toast, setToast] = useState('')

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  function toggleDay(day: string) {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    showToast('Operation time settings saved successfully.')
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-xl font-bold text-[var(--text-primary)]">{t.operationTime} — Machine {id}</h1>

      {/* Status badge */}
      <div className="flex items-center gap-3">
        <p className="text-sm text-[var(--text-muted)]">{t.operationStatus}</p>
        <Badge variant="success">{t.currentlyActive}</Badge>
      </div>

      <Card hover={false}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Operation Switches
          </CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit} className="space-y-1 divide-y divide-[var(--border)]">
          <Toggle
            label={t.operationSwitch}
            sublabel="Enable or disable the machine entirely"
            checked={operationSwitch}
            onChange={setOperationSwitch}
          />

          <Toggle
            label={t.operationTimeSwitch}
            sublabel="Restrict operation to specific hours"
            checked={timeSwitch}
            onChange={setTimeSwitch}
          />

          {/* Time schedule — shown only if time switch is ON */}
          {timeSwitch && (
            <div className="pt-4 space-y-4">
              {/* Weekday checkboxes */}
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)] mb-2">Operating Days</p>
                <div className="flex flex-wrap gap-2">
                  {WEEKDAYS.map((day) => (
                    <label
                      key={day}
                      className={`flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                        selectedDays.includes(day)
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-[var(--border)] text-[var(--text-muted)] hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedDays.includes(day)}
                        onChange={() => toggleDay(day)}
                        className="sr-only"
                      />
                      {day}
                    </label>
                  ))}
                </div>
              </div>

              {/* Time pickers */}
              <div className="flex flex-wrap gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[var(--text-muted)]">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="rounded-lg border border-[var(--border)] bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[var(--text-muted)]">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="rounded-lg border border-[var(--border)] bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="pt-4">
            <Button type="submit" variant="primary" size="md">
              {t.submit}
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
