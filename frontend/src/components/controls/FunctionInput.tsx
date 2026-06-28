import type { InputHTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface FunctionInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helperText?: string
  error?: string
}

/**
 * Styled text input for mathematical function expressions.
 * Accepts Python-style math: x**2, sin(x), exp(-x), etc.
 */
export default function FunctionInput({
  label = 'f(x)',
  helperText,
  error,
  className,
  ...props
}: FunctionInputProps) {
  return (
    <div className="param-group">
      <label className="param-label">
        <span>{label}</span>
        <span className="text-slate-600 text-xs">Python math syntax</span>
      </label>
      <input
        {...props}
        type="text"
        spellCheck={false}
        className={clsx(
          'w-full bg-surface border rounded-md px-3 py-2 text-sm font-mono text-emerald-300',
          'focus:outline-none focus:ring-1 focus:ring-brand-500',
          'placeholder:text-slate-600',
          error ? 'border-red-500/50' : 'border-surface-border hover:border-slate-500',
          className,
        )}
      />
      {helperText && !error && <p className="text-xs text-slate-500">{helperText}</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
