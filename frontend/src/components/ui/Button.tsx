import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'
import type { Size, Variant } from '@/types/ui.types'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
}

const variantStyles: Record<Variant, string> = {
  primary:   'bg-brand-600 hover:bg-brand-500 text-white shadow-glow-brand/30',
  secondary: 'bg-surface-card border border-surface-border hover:bg-surface-hover text-slate-200',
  ghost:     'hover:bg-surface-hover text-slate-400 hover:text-white',
  danger:    'bg-red-600/20 border border-red-600/30 hover:bg-red-600/30 text-red-300',
  success:   'bg-emerald-600/20 border border-emerald-600/30 hover:bg-emerald-600/30 text-emerald-300',
}

const sizeStyles: Record<Size, string> = {
  xs: 'px-2.5 py-1 text-xs rounded-md',
  sm: 'px-3 py-1.5 text-sm rounded-md',
  md: 'px-4 py-2 text-sm rounded-lg',
  lg: 'px-5 py-2.5 text-base rounded-lg',
  xl: 'px-6 py-3 text-base rounded-xl',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-medium transition-all',
        'focus:outline-none focus:ring-2 focus:ring-brand-500/50',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        iconPosition === 'left' && icon
      )}
      {children}
      {!loading && iconPosition === 'right' && icon}
    </button>
  )
}
