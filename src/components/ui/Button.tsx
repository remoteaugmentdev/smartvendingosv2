import { cn } from '@/utils/cn'
import { type ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
        {
          'bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-md shadow-blue-200 hover:from-blue-600 hover:to-blue-800 hover:shadow-lg hover:shadow-blue-200': variant === 'primary',
          'border border-[var(--border)] bg-white text-[var(--text-primary)] hover:bg-slate-50 hover:border-slate-300': variant === 'secondary',
          'text-[var(--text-muted)] hover:bg-slate-100 hover:text-[var(--text-primary)]': variant === 'ghost',
          'bg-gradient-to-br from-red-500 to-red-700 text-white shadow-md shadow-red-200 hover:from-red-600 hover:to-red-800 hover:shadow-lg hover:shadow-red-200': variant === 'danger',
        },
        {
          'h-8 px-3 text-xs': size === 'sm',
          'h-9 px-4 text-sm': size === 'md',
          'h-10 px-5 text-base': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
