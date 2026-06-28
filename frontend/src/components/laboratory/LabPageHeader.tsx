import { clsx } from 'clsx'

interface LabPageHeaderProps {
  icon: string
  title: string
  subtitle: string
  badge?: string
  badgeColor?: string
  description?: string
  className?: string
}

export default function LabPageHeader({
  icon,
  title,
  subtitle,
  badge,
  badgeColor = '#818cf8',
  description,
  className,
}: LabPageHeaderProps) {
  return (
    <div className={clsx('mb-8', className)}>
      {/* Icon + badge row */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="flex items-center justify-center w-10 h-10 rounded-xl text-xl"
          style={{ backgroundColor: `${badgeColor}20`, border: `1px solid ${badgeColor}35` }}
        >
          {icon}
        </div>

        {badge && (
          <span
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border"
            style={{
              color: badgeColor,
              backgroundColor: `${badgeColor}18`,
              borderColor: `${badgeColor}35`,
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse-slow" style={{ backgroundColor: badgeColor }} />
            {badge}
          </span>
        )}
      </div>

      <h1 className="text-2xl font-bold text-white mb-1">{title}</h1>
      <p className="text-slate-400">{subtitle}</p>

      {description && (
        <p className="mt-3 text-sm text-slate-500 max-w-2xl leading-relaxed">{description}</p>
      )}
    </div>
  )
}
