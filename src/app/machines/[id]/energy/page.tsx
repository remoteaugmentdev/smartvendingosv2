// FILE: d:\smartvendkiosk\src\app\machines\[id]\energy\page.tsx
'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Lightbulb,
  Monitor,
  Thermometer,
  Zap,
  Wind,
  BellRing,
  ChevronLeft,
} from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'
import { ldaMachines } from '@/data/lda'
import { useTranslation } from '@/hooks/useTranslation'
import { useApp } from '@/context/AppContext'

// ---------------------------------------------------------------------------
// Toast
// ---------------------------------------------------------------------------
function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-slate-800 px-4 py-3 text-sm text-white shadow-xl">
      {message}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------
type Screen =
  | null
  | 'lighting'
  | 'screen'
  | 'temperature'
  | 'power'
  | 'defogging'
  | 'alerts'

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer select-none">
      <span className="text-sm text-[var(--text-primary)]">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
          checked ? 'bg-blue-600' : 'bg-slate-200'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md transform transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </label>
  )
}

function Slider({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-[var(--text-primary)]">{label}</span>
        <span className="text-sm font-semibold text-blue-600">{value}%</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-blue-600"
      />
    </div>
  )
}

function NumberInput({
  label,
  value,
  onChange,
  suffix,
  min,
  max,
}: {
  label: string
  value: number | string
  onChange: (v: string) => void
  suffix?: string
  min?: number
  max?: number
}) {
  return (
    <div>
      <label className="block text-sm text-[var(--text-primary)] mb-1.5">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          onChange={(e) => onChange(e.target.value)}
          className="w-28 h-9 rounded-xl border border-[var(--border)] px-3 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {suffix && (
          <span className="text-sm text-[var(--text-muted)]">{suffix}</span>
        )}
      </div>
    </div>
  )
}

function TimeInput({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="block text-sm text-[var(--text-primary)] mb-1.5">{label}</label>
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 rounded-xl border border-[var(--border)] px-3 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-screens
// ---------------------------------------------------------------------------

function LightingScreen({ onSave }: { onSave: (msg: string) => void }) {
  const t = useTranslation()
  const [on, setOn] = useState(true)
  const [brightness, setBrightness] = useState(80)
  const [startTime, setStartTime] = useState('07:00')
  const [endTime, setEndTime] = useState('22:00')

  return (
    <Card hover={false}>
      <CardHeader>
        <CardTitle>Lighting Settings</CardTitle>
      </CardHeader>
      <div className="space-y-5">
        <Toggle checked={on} onChange={setOn} label="Lighting Power" />
        <Slider label="Brightness" value={brightness} onChange={setBrightness} />
        <div className="grid grid-cols-2 gap-4">
          <TimeInput label="Start Time" value={startTime} onChange={setStartTime} />
          <TimeInput label="End Time" value={endTime} onChange={setEndTime} />
        </div>
        <Button
          variant="primary"
          size="md"
          className="w-full"
          onClick={() => onSave('Lighting settings saved')}
        >
          {t.submit}
        </Button>
      </div>
    </Card>
  )
}

function ScreenSoundScreen({ onSave }: { onSave: (msg: string) => void }) {
  const t = useTranslation()
  const [screenOn, setScreenOn] = useState(true)
  const [brightness, setBrightness] = useState(70)
  const [volume, setVolume] = useState('50')

  return (
    <Card hover={false}>
      <CardHeader>
        <CardTitle>Screen &amp; Sound Settings</CardTitle>
      </CardHeader>
      <div className="space-y-5">
        <Toggle checked={screenOn} onChange={setScreenOn} label="Screen Power" />
        <Slider label="Screen Brightness" value={brightness} onChange={setBrightness} />
        <NumberInput
          label="Volume (0–100)"
          value={volume}
          onChange={setVolume}
          min={0}
          max={100}
        />
        <Button
          variant="primary"
          size="md"
          className="w-full"
          onClick={() => onSave('Screen & Sound settings saved')}
        >
          {t.submit}
        </Button>
      </div>
    </Card>
  )
}

function TemperatureScreen({ onSave }: { onSave: (msg: string) => void }) {
  const t = useTranslation()
  const [target, setTarget] = useState('4')
  const [highAlert, setHighAlert] = useState('10')
  const [lowAlert, setLowAlert] = useState('-2')

  return (
    <Card hover={false}>
      <CardHeader>
        <CardTitle>Temperature Settings</CardTitle>
      </CardHeader>
      <div className="space-y-5">
        <NumberInput
          label="Target Temperature (°C)"
          value={target}
          onChange={setTarget}
          suffix="°C"
        />
        <NumberInput
          label="High Alert Threshold (°C)"
          value={highAlert}
          onChange={setHighAlert}
          suffix="°C"
        />
        <NumberInput
          label="Low Alert Threshold (°C)"
          value={lowAlert}
          onChange={setLowAlert}
          suffix="°C"
        />
        <Button
          variant="primary"
          size="md"
          className="w-full"
          onClick={() => onSave('Temperature settings saved')}
        >
          {t.submit}
        </Button>
      </div>
    </Card>
  )
}

const MOCK_POWER_ROWS = [
  { date: '2026-05-07', kwh: '10.67' },
  { date: '2026-05-06', kwh: '10.43' },
  { date: '2026-05-05', kwh: '11.02' },
  { date: '2026-05-04', kwh: '9.88' },
  { date: '2026-05-03', kwh: '10.21' },
]

function DailyPowerScreen() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card hover={false} className="text-center">
          <p className="text-xs text-[var(--text-muted)] mb-1">Voltage</p>
          <p className="text-2xl font-bold text-blue-600">220V</p>
        </Card>
        <Card hover={false} className="text-center">
          <p className="text-xs text-[var(--text-muted)] mb-1">Current</p>
          <p className="text-2xl font-bold text-blue-600">2.4A</p>
        </Card>
      </div>
      <Card hover={false}>
        <CardHeader>
          <CardTitle>Daily Power Consumption</CardTitle>
        </CardHeader>
        <Table>
          <Thead>
            <Tr>
              <Th>Date</Th>
              <Th className="text-right">kWh</Th>
            </Tr>
          </Thead>
          <Tbody>
            {MOCK_POWER_ROWS.map((row) => (
              <Tr key={row.date}>
                <Td className="text-sm">{row.date}</Td>
                <Td className="text-right text-sm font-medium text-[var(--text-primary)]">
                  {row.kwh} kWh
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>
    </div>
  )
}

function DefogScreen({ onSave }: { onSave: (msg: string) => void }) {
  const t = useTranslation()
  const [enabled, setEnabled] = useState(false)
  const [startTime, setStartTime] = useState('06:00')
  const [endTime, setEndTime] = useState('08:00')
  const [interval, setInterval] = useState('30')

  return (
    <Card hover={false}>
      <CardHeader>
        <CardTitle>Defogging Settings</CardTitle>
      </CardHeader>
      <div className="space-y-5">
        <Toggle checked={enabled} onChange={setEnabled} label="Enable Defogging" />
        <div className="grid grid-cols-2 gap-4">
          <TimeInput label="Start Time" value={startTime} onChange={setStartTime} />
          <TimeInput label="End Time" value={endTime} onChange={setEndTime} />
        </div>
        <NumberInput
          label="Interval (minutes)"
          value={interval}
          onChange={setInterval}
          suffix="min"
          min={1}
        />
        <Button
          variant="primary"
          size="md"
          className="w-full"
          onClick={() => onSave('Defogging settings saved')}
        >
          {t.submit}
        </Button>
      </div>
    </Card>
  )
}

function AlertSettingScreen({ onSave }: { onSave: (msg: string) => void }) {
  const t = useTranslation()
  const [currentThreshold, setCurrentThreshold] = useState('3.0')
  const [voltageAlert, setVoltageAlert] = useState('250')
  const [highTempAlert, setHighTempAlert] = useState(true)
  const [lowTempAlert, setLowTempAlert] = useState(true)

  return (
    <Card hover={false}>
      <CardHeader>
        <CardTitle>Alert Settings</CardTitle>
      </CardHeader>
      <div className="space-y-5">
        <NumberInput
          label="Current Threshold (A)"
          value={currentThreshold}
          onChange={setCurrentThreshold}
          suffix="A"
        />
        <NumberInput
          label="Voltage Alert (V)"
          value={voltageAlert}
          onChange={setVoltageAlert}
          suffix="V"
        />
        <Toggle
          checked={highTempAlert}
          onChange={setHighTempAlert}
          label="High Temperature Alert"
        />
        <Toggle
          checked={lowTempAlert}
          onChange={setLowTempAlert}
          label="Low Temperature Alert"
        />
        <Button
          variant="primary"
          size="md"
          className="w-full"
          onClick={() => onSave('Alert settings saved')}
        >
          {t.submit}
        </Button>
      </div>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function EnergyPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const t = useTranslation()
  const { lang } = useApp()
  const { id } = use(params)

  const machine = ldaMachines.find((m) => m.id === id)

  const [activeScreen, setActiveScreen] = useState<Screen>(null)
  const [toast, setToast] = useState('')

  function showToast(msg: string) {
    setToast(msg)
  }

  const TILES: {
    key: Screen
    label: string
    Icon: React.ElementType
    bg: string
  }[] = [
    {
      key: 'lighting',
      label: lang === 'fr' ? 'Éclairage' : 'Lighting',
      Icon: Lightbulb,
      bg: 'bg-blue-500',
    },
    {
      key: 'screen',
      label: lang === 'fr' ? 'Écran & Son' : 'Screen & Sound',
      Icon: Monitor,
      bg: 'bg-blue-500',
    },
    {
      key: 'temperature',
      label: lang === 'fr' ? 'Température' : 'Temperature',
      Icon: Thermometer,
      bg: 'bg-blue-500',
    },
    {
      key: 'power',
      label: lang === 'fr' ? 'Puissance journalière' : 'Daily Power',
      Icon: Zap,
      bg: 'bg-blue-500',
    },
    {
      key: 'defogging',
      label: lang === 'fr' ? 'Désembuage' : 'Defogging',
      Icon: Wind,
      bg: 'bg-emerald-500',
    },
    {
      key: 'alerts',
      label: lang === 'fr' ? "Paramètres d'alerte" : 'Alert Setting',
      Icon: BellRing,
      bg: 'bg-emerald-500',
    },
  ]

  function renderSubScreen() {
    switch (activeScreen) {
      case 'lighting':
        return <LightingScreen onSave={showToast} />
      case 'screen':
        return <ScreenSoundScreen onSave={showToast} />
      case 'temperature':
        return <TemperatureScreen onSave={showToast} />
      case 'power':
        return <DailyPowerScreen />
      case 'defogging':
        return <DefogScreen onSave={showToast} />
      case 'alerts':
        return <AlertSettingScreen onSave={showToast} />
      default:
        return null
    }
  }

  const activeTile = TILES.find((t) => t.key === activeScreen)

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">{t.energy}</h2>
          <p className="mt-0.5 text-sm text-[var(--text-muted)]">
            Machine {id}
            {machine ? ` — ${machine.location}` : ''}
          </p>
        </div>
        <Link href={`/machines/${id}`}>
          <Button variant="ghost" size="sm">← {t.back}</Button>
        </Link>
      </div>

      {activeScreen === null ? (
        /* Tile grid */
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {TILES.map((tile) => {
            const Icon = tile.Icon
            return (
              <button
                key={tile.key}
                onClick={() => setActiveScreen(tile.key)}
                className={`flex flex-col items-center justify-center gap-3 rounded-2xl p-6 text-white shadow-md transition-all active:scale-[0.97] hover:opacity-90 ${tile.bg}`}
              >
                <Icon size={28} strokeWidth={1.5} />
                <span className="text-sm font-semibold leading-tight text-center">
                  {tile.label}
                </span>
              </button>
            )
          })}
        </div>
      ) : (
        /* Sub-screen */
        <div>
          <button
            onClick={() => setActiveScreen(null)}
            className="flex items-center gap-1.5 mb-5 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            <ChevronLeft size={16} />
            {activeTile?.label ?? t.back}
          </button>
          {renderSubScreen()}
        </div>
      )}

      {toast && <Toast message={toast} onDone={() => setToast('')} />}
    </div>
  )
}
