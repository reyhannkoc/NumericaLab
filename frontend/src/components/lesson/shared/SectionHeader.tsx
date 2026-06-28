import { clsx } from 'clsx'

interface SectionHeaderProps {
  icon: string
  title: string
  subtitle?: string
  className?: string
}

/**
 * Consistent heading style used at the top of every lesson section.
 * Icon + title + optional subtitle.
 */
export default function SectionHeader({
  icon,
  title,
  subtitle,
  className,
}: SectionHeaderProps) {
  return (
    <div className={clsx('mb-6', className)}>
      <div className="flex items-center gap-3 mb-1">
        <span
          className="flex items-center justify-center w-8 h-8 rounded-lg
                     bg-brand-600/15 border border-brand-600/25 text-brand-300
                     text-sm font-bold shrink-0"
          aria-hidden
        >
          {icon}
        </span>
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>
      {subtitle && (
        <p className="text-sm text-slate-400 ml-11">{subtitle}</p>
      )}
    </div>
  )
}
