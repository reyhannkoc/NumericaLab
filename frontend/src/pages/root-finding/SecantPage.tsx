import { useState, useCallback } from 'react'
import LessonPage from '@components/lesson/LessonPage'
import { SECANT_CONFIG } from '@/config/lessons/secant'
import RootFindingVisualization from '@components/root-finding/RootFindingVisualization'
import RootFindingStepAnimation from '@components/root-finding/RootFindingStepAnimation'
import RootFindingPlayground from '@components/root-finding/RootFindingPlayground'
import { rootFindingService } from '@/services/rootFindingService'
import type { RootFindingResult } from '@/types/api.types'

export default function SecantPage() {
  // ── Form state ──────────────────────────────────────────────────────────────
  const [expression, setExpression] = useState('x**3 - x - 2')
  const [x0,         setX0]         = useState(1.0)
  const [x1,         setX1]         = useState(2.0)
  const [tolerance,  setTolerance]  = useState(1e-12)
  const [maxIter,    setMaxIter]    = useState(50)

  // ── Result state ────────────────────────────────────────────────────────────
  const [result,    setResult]    = useState<RootFindingResult | null>(null)
  const [curveX,    setCurveX]    = useState<number[]>([])
  const [curveY,    setCurveY]    = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error,     setError]     = useState<string | null>(null)

  const handleSolve = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const lo      = Math.min(x0, x1)
      const hi      = Math.max(x0, x1)
      const spread  = Math.max(hi - lo, 0.5)
      const plotMin = lo - spread
      const plotMax = hi + spread
      const [res, curve] = await Promise.all([
        rootFindingService.solve({
          expression,
          method: 'secant',
          x0, x1,
          tolerance,
          max_iterations: maxIter,
        }),
        rootFindingService.getFunctionPlot(expression, plotMin, plotMax, 300),
      ])
      setResult(res)
      setCurveX(curve.x)
      setCurveY(curve.y)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }, [expression, x0, x1, tolerance, maxIter])

  const handleReset = useCallback(() => {
    setResult(null)
    setCurveX([])
    setCurveY([])
    setError(null)
  }, [])

  return (
    <LessonPage
      config={SECANT_CONFIG}
      primaryMethod="secant"
      liveErrors={result ? {
        absoluteError: result.final_error,
        iterations:    result.total_iterations,
      } : undefined}
      livePerformance={result ? {
        measuredMs:       result.execution_time_ms,
        actualIterations: result.total_iterations,
      } : undefined}
      renderVisualization={() => (
        <RootFindingVisualization method="secant" />
      )}
      renderAnimation={() => (
        <RootFindingStepAnimation
          method="secant"
          iterations={result?.iterations ?? []}
          curveX={curveX}
          curveY={curveY}
        />
      )}
      renderPlayground={() => (
        <RootFindingPlayground
          method="secant"
          expression={expression}
          onExpressionChange={(v) => { setExpression(v); handleReset() }}
          x0={x0}       onX0Change={setX0}
          x1={x1}       onX1Change={setX1}
          tolerance={tolerance}   onToleranceChange={setTolerance}
          maxIterations={maxIter} onMaxIterationsChange={setMaxIter}
          result={result}
          isLoading={isLoading}
          onSolve={handleSolve}
          onReset={handleReset}
          error={error}
        />
      )}
    />
  )
}
