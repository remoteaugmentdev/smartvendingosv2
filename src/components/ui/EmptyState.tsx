import { cn } from '@/utils/cn'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ReactNode
  className?: string
}

export function EmptyState({ title, description, icon, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[var(--border)] py-10 text-center',
        className
      )}
    >
      {icon && <div className="text-[var(--text-muted)]">{icon}</div>}
      <p className="text-sm font-medium text-[var(--text-primary)]">{title}</p>
      {description && (
        <p className="text-xs text-[var(--text-muted)]">{description}</p>
      )}
    </div>
  )
}
