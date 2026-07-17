import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { cn } from '@/utils/cn'
import { useChartReady } from './useChartReady'

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ dataKey?: string | number; name?: string; color?: string; value?: number }>
  label?: string | number
}

interface BarConfig {
  key: string
  label: string
  color: string
}

interface BarChartWrapperProps {
  data: Record<string, string | number>[]
  bars: BarConfig[]
  xKey: string
  height?: number
  layout?: 'horizontal' | 'vertical'
  showGrid?: boolean
  showLegend?: boolean
  className?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-3 shadow-[var(--shadow-hover)]">
      {label && <p className="mb-1 text-xs font-semibold text-[var(--text-primary)]">{label}</p>}
      {payload.map((entry: NonNullable<CustomTooltipProps['payload']>[number]) => (
        <div key={String(entry.dataKey)} className="flex items-center gap-2 text-xs">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-[var(--text-muted)]">{entry.name}:</span>
          <span className="font-medium text-[var(--text-primary)]">${entry.value}</span>
        </div>
      ))}
    </div>
  )
}

export function BarChartWrapper({
  data,
  bars,
  xKey,
  height = 240,
  layout = 'horizontal',
  showGrid = true,
  showLegend = false,
  className,
}: BarChartWrapperProps) {
  const { ref, ready, size } = useChartReady()

  return (
    <div ref={ref} className={cn('w-full', className)} style={{ height }}>
      {ready && (
      <ResponsiveContainer width="100%" height="100%" initialDimension={size}>
        <BarChart
          data={data}
          layout={layout}
          margin={{ top: 4, right: 8, bottom: 4, left: 8 }}
        >
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={layout === 'horizontal'} horizontal={layout === 'vertical'} />
          )}
          {layout === 'horizontal' ? (
            <>
              <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
            </>
          ) : (
            <>
              <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis dataKey={xKey} type="category" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={90} />
            </>
          )}
          <Tooltip content={(props) => <CustomTooltip active={props.active} payload={props.payload as unknown as CustomTooltipProps['payload']} label={props.label} />} />
          {showLegend && <Legend wrapperStyle={{ fontSize: 11 }} />}
          {bars.map((b) => (
            <Bar key={b.key} dataKey={b.key} name={b.label} fill={b.color} radius={[3, 3, 0, 0]} maxBarSize={32} />
          ))}
        </BarChart>
      </ResponsiveContainer>
      )}
    </div>
  )
}
