import { clsx } from 'clsx'

interface MetricCardProps {
  label: string
  value: string | number
  unit?: string
  icon?: string
  status?: 'good' | 'warn' | 'bad' | 'neutral'
  sub?: string
  className?: string
}

const STATUS_COLOR = {
  good:    'text-green-400',
  warn:    'text-yellow-400',
  bad:     'text-red-400',
  neutral: 'text-brand-300',
}

export default function MetricCard({
  label,
  value,
  unit,
  icon,
  status = 'neutral',
  sub,
  className,
}: MetricCardProps) {
  return (
    <div className={clsx('glass-card p-4', className)}>
      {icon && <div className="text-lg mb-1">{icon}</div>}

      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{label}</p>

      <p className={clsx('text-xl font-bold font-mono tabular-nums', STATUS_COLOR[status])}>
        {value}
        {unit && <span className="text-sm font-normal text-slate-500 ml-1">{unit}</span>}
      </p>

      {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
    </div>
  )
}
