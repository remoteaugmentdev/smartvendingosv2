'use client'

import { use, useState } from 'react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Settings2 } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

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
    <div className="flex items-center justify-between py-3">
      <span className="text-sm font-medium text-[var(--text-primary)]">{label}</span>
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

export default function ParametersPage({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslation()
  const { id } = use(params)

  const [shoppingCart, setShoppingCart] = useState(true)
  const [maxProducts, setMaxProducts] = useState(3)
  const [combineSlots, setCombineSlots] = useState(false)
  const [currency, setCurrency] = useState('EUR')
  const [language, setLanguage] = useState('FR')
  const [toast, setToast] = useState('')

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    showToast('Parameters saved successfully.')
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-xl font-bold text-[var(--text-primary)]">{t.parameterConfig} — Machine {id}</h1>

      <Card hover={false}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            Kiosk Parameters
          </CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit} className="space-y-1 divide-y divide-[var(--border)]">
          {/* Shopping Cart toggle */}
          <Toggle
            label={t.shoppingCart}
            checked={shoppingCart}
            onChange={setShoppingCart}
          />

          {/* Max products slider */}
          <div className="py-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--text-primary)]">
                {t.maxProducts}
              </span>
              <span className="text-sm font-bold text-blue-600 w-6 text-center">{maxProducts}</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={maxProducts}
              onChange={(e) => setMaxProducts(Number(e.target.value))}
              disabled={!shoppingCart}
              className="w-full accent-blue-600 disabled:opacity-40"
            />
            <div className="flex justify-between text-xs text-[var(--text-muted)]">
              <span>1</span>
              <span>10</span>
            </div>
          </div>

          {/* Combine Slots toggle */}
          <Toggle
            label={t.combineSlots}
            checked={combineSlots}
            onChange={setCombineSlots}
          />

          {/* Currency */}
          <div className="flex items-center justify-between py-3">
            <span className="text-sm font-medium text-[var(--text-primary)]">{t.currencySymbol}</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="rounded-lg border border-[var(--border)] bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="EUR">EUR - €</option>
            </select>
          </div>

          {/* Language */}
          <div className="flex items-center justify-between py-3">
            <span className="text-sm font-medium text-[var(--text-primary)]">
              {t.kioskLanguage}
            </span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="rounded-lg border border-[var(--border)] bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="FR">FR</option>
              <option value="EN">EN</option>
              <option value="DE">DE</option>
            </select>
          </div>

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
