import { useState, useCallback } from 'react'
import type { ComparisonParams, ComparisonResult, ComparisonStatus } from '@/types/laboratory.types'
import { runComparison } from '@/services/laboratory.service'

const DEFAULT_PARAMS: ComparisonParams = {
  category: 'root-finding',
  expression: 'x**3 - x - 2',
  derivativeExpression: '3*x**2 - 1',
  a: 1,
  b: 2,
  x0: 1.5,
  x1: 2,
  tolerance: 1e-8,
  maxIterations: 100,
  selectedMethodIds: ['bisection', 'newton_raphson', 'secant'],
}

export function useLabComparison() {
  const [params, setParams] = useState<ComparisonParams>(DEFAULT_PARAMS)
  const [results, setResults] = useState<ComparisonResult[]>([])
  const [status, setStatus] = useState<ComparisonStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const updateParams = useCallback((partial: Partial<ComparisonParams>) => {
    setParams((prev) => ({ ...prev, ...partial }))
  }, [])

  const run = useCallback(async () => {
    if (params.selectedMethodIds.length === 0) return
    setStatus('running')
    setErrorMessage(null)
    try {
      const data = await runComparison(params)
      if (data.length === 0) {
        setErrorMessage('All selected methods failed to run. Check the expression and try again.')
        setStatus('error')
        return
      }
      setResults(data)
      setStatus('complete')
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Comparison failed')
      setStatus('error')
    }
  }, [params])

  const reset = useCallback(() => {
    setResults([])
    setStatus('idle')
    setErrorMessage(null)
  }, [])

  const winner: ComparisonResult | null =
    results.length > 0
      ? results.reduce((best, r) =>
          r.converged && (!best.converged || r.iterations < best.iterations) ? r : best,
        )
      : null

  return { params, updateParams, results, status, errorMessage, run, reset, winner }
}
