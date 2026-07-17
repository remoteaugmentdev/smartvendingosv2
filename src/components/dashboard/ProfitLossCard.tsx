'use client'

import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { StatCard } from '@/components/ui/StatCard'
import { useChartReady } from '@/components/charts/useChartReady'

const data = [
  { name: 'Gross Sales',  value: 212, color: '#2563EB' },
  { name: 'Commissions', value: 14,  color: '#64748B' },
  { name: 'Cost of Goods', value: 95, color: '#94A3B8' },
  { name: 'Expenses',    value: 48,  color: '#F59E0B' },
]

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ dataKey?: string | number; name?: string; color?: string; value?: number }>
  label?: string | number
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-[var(--border)] bg-white p-2.5 shadow-lg text-xs">
      <p className="font-semibold text-[var(--text-primary)]">{label}</p>
      <p className="text-[var(--text-muted)]">${payload[0].value}</p>
    </div>
  )
}

export function ProfitLossCard() {
  const { ref, ready } = useChartReady()
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profit &amp; Loss</CardTitle>
        <StatCard label="Net Income" value={53} prefix="$" color="var(--accent-success)" animate />
      </CardHeader>
      <div ref={ref} style={{ height: 180 }}>
        {ready && (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
            <XAxis type="number" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={88} />
            <Tooltip content={(props) => <CustomTooltip active={props.active} payload={props.payload as unknown as CustomTooltipProps['payload']} label={props.label} />} />
            <Bar dataKey="value" radius={[0, 3, 3, 0]} maxBarSize={20}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        )}
      </div>
    </Card>
  )
}
