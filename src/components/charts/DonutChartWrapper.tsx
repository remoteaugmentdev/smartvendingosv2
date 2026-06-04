import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { cn } from '@/utils/cn'

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ dataKey?: string | number; name?: string; color?: string; value?: number }>
  label?: string | number
}

export interface DonutSegment {
  name: string
  value: number
  color: string
}

interface DonutChartWrapperProps {
  data: DonutSegment[]
  innerRadius?: number
  outerRadius?: number
  height?: number
  className?: string
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-2.5 shadow-[var(--shadow-hover)]">
      <div className="flex items-center gap-2 text-xs">
        <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
        <span className="text-[var(--text-muted)]">{d.name}:</span>
        <span className="font-medium text-[var(--text-primary)]">${d.value}</span>
      </div>
    </div>
  )
}

export function DonutChartWrapper({
  data,
  innerRadius = 55,
  outerRadius = 80,
  height = 180,
  className,
}: DonutChartWrapperProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className={cn('w-full', className)} style={{ height }} />
  }

  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            dataKey="value"
            strokeWidth={2}
            stroke="var(--bg-card)"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={(props) => <CustomTooltip active={props.active} payload={props.payload as unknown as CustomTooltipProps['payload']} label={props.label} />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
