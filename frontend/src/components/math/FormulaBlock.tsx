import MathRenderer from './MathRenderer'
import { clsx } from 'clsx'

interface FormulaBlockProps {
  formula: string
  label?: string
  description?: string
  className?: string
}

/**
 * A styled container for displaying a key mathematical formula.
 * Wraps MathRenderer with optional label and description.
 */
export default function FormulaBlock({ formula, label, description, className }: FormulaBlockProps) {
  return (
    <div className={clsx('formula-box', className)}>
      {label && <p className="section-label mb-3">{label}</p>}
      <MathRenderer formula={formula} display />
      {description && (
        <p className="mt-3 text-sm text-slate-400 text-left">{description}</p>
      )}
    </div>
  )
}
