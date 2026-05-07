'use client'

import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { StatCard } from '@/components/ui/StatCard'
import { DonutChartWrapper, type DonutSegment } from '@/components/charts/DonutChartWrapper'

const segments: DonutSegment[] = [
  { name: 'Fuel',    value: 28, color: '#F59E0B' },
  { name: 'Refunds', value: 6,  color: '#10B981' },
  { name: 'Repairs', value: 14, color: '#F97316' },
]

export function ExpensesCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses</CardTitle>
        <StatCard label="Total" value={48} prefix="$" color="var(--accent-warning)" animate />
      </CardHeader>
      <DonutChartWrapper data={segments} innerRadius={55} outerRadius={80} height={180} />
      <div className="mt-3 flex justify-center gap-5">
        {segments.map((s) => (
          <div key={s.name} className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
            <span className="text-xs text-[var(--text-muted)]">{s.name}</span>
            <span className="text-xs font-semibold text-[var(--text-primary)]">${s.value}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
