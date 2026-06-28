import type { ReactNode } from 'react'
import { clsx } from 'clsx'

interface CardProps {
  children: ReactNode
  className?: string
  glow?: 'brand' | 'green' | 'blue' | false
  hoverable?: boolean
}

export default function Card({ children, className, glow = false, hoverable = false }: CardProps) {
  return (
    <div
      className={clsx(
        'glass-card p-5',
        hoverable && 'hover:border-brand-600/40 transition-colors cursor-pointer',
        glow === 'brand' && 'shadow-glow-brand',
        glow === 'green' && 'shadow-glow-green',
        glow === 'blue'  && 'shadow-glow-blue',
        className,
      )}
    >
      {children}
    </div>
  )
}
