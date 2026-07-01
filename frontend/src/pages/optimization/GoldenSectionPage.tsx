import { useState, useCallback } from 'react'
import LessonPage from '@components/lesson/LessonPage'
import { GOLDEN_SECTION_CONFIG } from '@/config/lessons/goldenSection'
import OptimizationVisualization from '@components/optimization/OptimizationVisualization'
import OptimizationAnimation from '@components/optimization/OptimizationAnimation'
import OptimizationPlayground from '@components/optimization/OptimizationPlayground'
import { optimizationService } from '@/services/optimizationService'
import type { OptimizationResult } from '@/types/api.types'

export default function GoldenSectionPage() {
  const [expression, setExpression] = useState('(x-2)**2')
  const [a, setA]   = useState(0)
  const [b, setB]   = useState(4)
  const [x0, setX0] = useState(3)
  const [alpha, setAlpha] = useState(0.3)
  const [result, setResult] = useState<OptimizationResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCompute = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await optimizationService.optimize({
        expression, method: 'golden_section', a, b,
        tolerance: 1e-10, max_iterations: 200,
      })
      setResult(res)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }, [expression, a, b])

  const handleReset = useCallback(() => { setResult(null); setError(null) }, [])

  return (
    <LessonPage
      config={GOLDEN_SECTION_CONFIG}
      primaryMethod="golden_section"
      liveErrors={result ? { absoluteError: Math.abs(result.optimum_value) } : undefined}
      renderVisualization={() => <OptimizationVisualization method="golden_section" />}
      renderAnimation={() => <OptimizationAnimation method="golden_section" />}
      renderPlayground={() => (
        <OptimizationPlayground
          method="golden_section"
          expression={expression}
          a={a} b={b} x0={x0} alpha={alpha} tolerance={1e-10}
          onExpressionChange={v => { setExpression(v); handleReset() }}
          onAChange={v => { setA(v); handleReset() }}
          onBChange={v => { setB(v); handleReset() }}
          onX0Change={setX0}
          onAlphaChange={setAlpha}
          result={result}
          isLoading={isLoading}
          onCompute={handleCompute}
          onReset={handleReset}
          error={error}
        />
      )}
    />
  )
}
