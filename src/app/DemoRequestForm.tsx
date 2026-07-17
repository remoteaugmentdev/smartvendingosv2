'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, Loader2 } from 'lucide-react'

const FIELD_CLS =
  'h-11 w-full rounded-xl border-0 bg-slate-100 px-4 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all'

function Select({ label, name, options }: { label: string; name: string; options: string[] }) {
  return (
    <label className="block space-y-1.5">
      <span className="block text-[13px] font-medium text-slate-700">{label}</span>
      <div className="relative">
        {/* invalid: = nothing chosen yet, so the placeholder renders muted like input placeholders */}
        <select name={name} required defaultValue="" className={`${FIELD_CLS} appearance-none pr-10 invalid:text-slate-500`}>
          <option value="" disabled>
            Select one
          </option>
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
      </div>
    </label>
  )
}

export function DemoRequestForm({ companyName, slug }: { companyName?: string; slug?: string } = {}) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? 'Something went wrong. Please try again.')
      setLoading(false)
      return
    }

    if (companyName) sessionStorage.setItem('demoCompanyName', companyName)
    router.push(slug ? `/${slug}/dashboard` : '/dashboard')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1.5">
          <span className="block text-[13px] font-medium text-slate-700">Full name</span>
          <input name="fullName" type="text" required autoComplete="name" placeholder="Alex Johnson" className={FIELD_CLS} />
        </label>
        <label className="block space-y-1.5">
          <span className="block text-[13px] font-medium text-slate-700">Work email</span>
          <input name="email" type="email" required autoComplete="email" placeholder="you@company.com" className={FIELD_CLS} />
        </label>
      </div>

      {companyName ? (
        <input type="hidden" name="company" value={companyName} />
      ) : (
        <label className="block space-y-1.5">
          <span className="block text-[13px] font-medium text-slate-700">Company name</span>
          <input name="company" type="text" required autoComplete="organization" placeholder="Peak Vending Solutions" className={FIELD_CLS} />
        </label>
      )}
      {slug && <input type="hidden" name="slug" value={slug} />}

      <Select
        label="How many machines do you currently operate?"
        name="fleetSize"
        options={['1-10', '11-50', '51-200', '200+']}
      />
      <Select
        label="What is your biggest operational challenge?"
        name="painPoint"
        options={['Inventory Management', 'Route Inefficiency', 'Revenue Tracking', 'Machine Downtime']}
      />
      <Select
        label="What are you currently using?"
        name="currentSolution"
        options={['Excel/Pen & Paper', 'Nayax', 'Cantaloupe', 'Parlevel', 'Other']}
      />

      {error && (
        <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-1 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-sm font-semibold text-white shadow-md shadow-blue-200 transition-all hover:from-blue-600 hover:to-blue-800 hover:shadow-lg hover:shadow-blue-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Preparing your demo…
          </>
        ) : (
          'Start Interactive Demo'
        )}
      </button>

      <p className="text-center text-xs text-slate-400">No credit card. No setup. Instant access.</p>
    </form>
  )
}
