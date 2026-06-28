import type { ReactNode } from 'react'
import { clsx } from 'clsx'
import type { ColorScheme } from '@/types/ui.types'

const colorMap: Record<ColorScheme, string> = {
  brand:  'bg-brand-600/15 text-brand-300 border-brand-600/25',
  green:  'bg-emerald-600/15 text-emerald-300 border-emerald-600/25',
  blue:   'bg-blue-600/15 text-blue-300 border-blue-600/25',
  purple: 'bg-violet-600/15 text-violet-300 border-violet-600/25',
  amber:  'bg-amber-500/15 text-amber-300 border-amber-500/25',
  red:    'bg-red-600/15 text-red-300 border-red-600/25',
  teal:   'bg-teal-500/15 text-teal-300 border-teal-500/25',
}

interface BadgeProps {
  children: ReactNode
  color?: ColorScheme
  className?: string
}

export default function Badge({ children, color = 'brand', className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border',
        colorMap[color],
        className,
      )}
    >
      {children}
    </span>
  )
}
