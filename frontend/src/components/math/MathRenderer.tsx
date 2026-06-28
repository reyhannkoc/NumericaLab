import { MathJax } from 'better-react-mathjax'
import { clsx } from 'clsx'

interface MathRendererProps {
  formula: string
  display?: boolean
  className?: string
}

/**
 * Renders a LaTeX formula using MathJax.
 * Use `display=true` for block-level equations, false for inline.
 */
export default function MathRenderer({ formula, display = false, className }: MathRendererProps) {
  const wrapped = display ? `\\[${formula}\\]` : `\\(${formula}\\)`

  return (
    <MathJax
      className={clsx(display && 'text-center overflow-x-auto py-1', className)}
      inline={!display}
    >
      {wrapped}
    </MathJax>
  )
}
