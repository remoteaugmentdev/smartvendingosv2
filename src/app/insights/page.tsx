'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/layout/PageHeader'
import { Sparkles, TrendingUp, ClipboardList, AlertTriangle } from 'lucide-react'

const MODULES = [
  {
    href: '/insights/forecast',
    Icon: TrendingUp,
    title: 'Demand Forecast',
    desc: 'Know what will run out before it does. Predictions for the next 7, 14, and 30 days.',
    color: 'text-blue-500',
  },
  {
    href: '/insights/recommendations',
    Icon: ClipboardList,
    title: 'Restock Recommendations',
    desc: 'Optimal quantities and timing for your next trips.',
    color: 'text-emerald-500',
  },
  {
    href: '/insights/anomalies',
    Icon: AlertTriangle,
    title: 'Anomaly Detection',
    desc: 'Unusual patterns flagged automatically — revenue drops, offline machines, slow sellers.',
    color: 'text-amber-500',
  },
]

export default function InsightsPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader title="AI Insights" description="Pro plan feature" />

      <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
        <Sparkles className="h-5 w-5 text-blue-600 shrink-0" />
        <p className="text-sm text-blue-800">
          <span className="font-semibold">AI Insights</span> — Powered by your sales history and inventory data. Updated daily.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {MODULES.map((m) => (
          <Link key={m.href} href={m.href}>
            <Card className="h-full transition-all hover:-translate-y-0.5 hover:shadow-lg">
              <m.Icon className={`h-7 w-7 ${m.color}`} />
              <p className="mt-3 font-semibold text-[var(--text-primary)]">{m.title}</p>
              <p className="mt-1 text-sm text-[var(--text-muted)]">{m.desc}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
