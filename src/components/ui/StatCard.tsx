'use client'

import { useCountUp } from '@/hooks/useCountUp'
import { cn } from '@/utils/cn'

interface StatCardProps {
  label: string
  value: number
  prefix?: string
  color?: string
  animate?: boolean
  className?: string
}

export function StatCard({
  label,
  value,
  prefix = '',
  color = 'var(--text-primary)',
  animate = false,
  className,
}: StatCardProps) {
  const displayed = animate ? value : value

  return (
    <div className={cn('flex flex-col gap-0.5', className)}>
      <span className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
        {label}
      </span>
      <AnimatedValue value={displayed} prefix={prefix} color={color} animate={animate} />
    </div>
  )
}

function AnimatedValue({
  value,
  prefix,
  color,
  animate,
}: {
  value: number
  prefix: string
  color: string
  animate: boolean
}) {
  const animated = useCountUp(value)
  const display = animate ? animated : value

  return (
    <span
      className="tabular-nums text-2xl font-bold leading-tight"
      style={{ color }}
    >
      {prefix}{display}
    </span>
  )
}
