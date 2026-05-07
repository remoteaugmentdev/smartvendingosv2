'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { sales } from '@/data/sales'

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ dataKey?: string | number; name?: string; color?: string; value?: number }>
  label?: string | number
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-[var(--border)] bg-white p-2.5 shadow-lg text-xs">
      <p className="mb-1 font-semibold text-[var(--text-primary)]">{label}</p>
      {payload.map((entry: NonNullable<CustomTooltipProps['payload']>[number]) => (
        <div key={String(entry.dataKey)} className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-[var(--text-muted)]">{entry.name}:</span>
          <span className="font-medium text-[var(--text-primary)]">${entry.value}</span>
        </div>
      ))}
    </div>
  )
}

export function SalesByMonthChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales by Month</CardTitle>
      </CardHeader>
      <div style={{ height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sales} margin={{ top: 4, right: 8, bottom: 4, left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
            <Tooltip content={(props) => <CustomTooltip active={props.active} payload={props.payload as unknown as CustomTooltipProps['payload']} label={props.label} />} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="sales"      name="Sales ($)"    fill="#2563EB" radius={[3, 3, 0, 0]} maxBarSize={16} />
            <Bar dataKey="commission" name="Commission"   fill="#F59E0B" radius={[3, 3, 0, 0]} maxBarSize={16} />
            <Bar dataKey="tax"        name="Tax"          fill="#10B981" radius={[3, 3, 0, 0]} maxBarSize={16} />
            <Bar dataKey="cogs"       name="COGS"         fill="#64748B" radius={[3, 3, 0, 0]} maxBarSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
