import type { InputHTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface ParameterInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  unit?: string
  error?: string
}

export default function ParameterInput({ label, unit, error, className, ...props }: ParameterInputProps) {
  return (
    <div className="param-group">
      <label className="param-label">
        <span>{label}</span>
        {unit && <span className="text-slate-600">{unit}</span>}
      </label>
      <div className="relative">
        <input
          {...props}
          type="number"
          className={clsx(
            'w-full bg-surface border rounded-md px-3 py-1.5 text-sm font-mono text-slate-200',
            'focus:outline-none focus:ring-1 focus:ring-brand-500',
            'placeholder:text-slate-600',
            error
              ? 'border-red-500/50'
              : 'border-surface-border hover:border-slate-500',
            className,
          )}
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
