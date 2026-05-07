'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { cn } from '@/utils/cn'

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ dataKey?: string | number; name?: string; color?: string; value?: number }>
  label?: string | number
}

interface AreaChartWrapperProps {
  data: Record<string, string | number>[]
  dataKey: string
  xKey?: string
  color?: string
  height?: number
  className?: string
  mini?: boolean
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-md border border-[var(--border)] bg-[var(--bg-card)] px-2 py-1 text-xs shadow-[var(--shadow-hover)]">
      <span className="font-medium text-[var(--text-primary)]">${payload[0].value}</span>
    </div>
  )
}

export function AreaChartWrapper({
  data,
  dataKey,
  xKey = 'month',
  color = '#2563EB',
  height = 120,
  className,
  mini = false,
}: AreaChartWrapperProps) {
  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.15} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          {!mini && (
            <>
              <XAxis dataKey={xKey} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={28} />
              <Tooltip content={(props) => <CustomTooltip active={props.active} payload={props.payload as unknown as CustomTooltipProps['payload']} label={props.label} />} />
            </>
          )}
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            fill={`url(#grad-${dataKey})`}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
