import { useState, useCallback } from 'react'
import LessonPage from '@components/lesson/LessonPage'
import { BISECTION_CONFIG } from '@/config/lessons/bisection'
import RootFindingVisualization from '@components/root-finding/RootFindingVisualization'
import RootFindingStepAnimation from '@components/root-finding/RootFindingStepAnimation'
import RootFindingPlayground from '@components/root-finding/RootFindingPlayground'
import { rootFindingService } from '@/services/rootFindingService'
import type { RootFindingResult } from '@/types/api.types'

export default function BisectionPage() {
  // ── Form state ──────────────────────────────────────────────────────────────
  const [expression, setExpression] = useState('x**3 - x - 2')
  const [a,           setA]          = useState(1)
  const [b,           setB]          = useState(2)
  const [tolerance,   setTolerance]  = useState(1e-8)
  const [maxIter,     setMaxIter]    = useState(100)

  // ── Result state ────────────────────────────────────────────────────────────
  const [result,    setResult]    = useState<RootFindingResult | null>(null)
  const [curveX,    setCurveX]    = useState<number[]>([])
  const [curveY,    setCurveY]    = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSolve = useCallback(async () => {
    setIsLoading(true)
    try {
      const spread  = Math.max((b - a) * 0.3, 0.5)
      const plotMin = a - spread
      const plotMax = b + spread
      const [res, curve] = await Promise.all([
        rootFindingService.solve({
          expression,
          method: 'bisection',
          a, b,
          tolerance,
          max_iterations: maxIter,
        }),
        rootFindingService.getFunctionPlot(expression, plotMin, plotMax, 300),
      ])
      setResult(res)
      setCurveX(curve.x)
      setCurveY(curve.y)
    } catch (err) {
      console.error('[BisectionPage] solve error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [expression, a, b, tolerance, maxIter])

  const handleReset = useCallback(() => {
    setResult(null)
    setCurveX([])
    setCurveY([])
  }, [])

  return (
    <LessonPage
      config={BISECTION_CONFIG}
      primaryMethod="bisection"
      liveErrors={result ? {
        absoluteError: result.final_error,
        iterations:    result.total_iterations,
      } : undefined}
      livePerformance={result ? {
        measuredMs:       result.execution_time_ms,
        actualIterations: result.total_iterations,
      } : undefined}
      renderVisualization={() => (
        <RootFindingVisualization method="bisection" />
      )}
      renderAnimation={() => (
        <RootFindingStepAnimation
          method="bisection"
          iterations={result?.iterations ?? []}
          curveX={curveX}
          curveY={curveY}
        />
      )}
      renderPlayground={() => (
        <RootFindingPlayground
          method="bisection"
          expression={expression}
          onExpressionChange={(v) => { setExpression(v); handleReset() }}
          a={a}         onAChange={setA}
          b={b}         onBChange={setB}
          tolerance={tolerance}   onToleranceChange={setTolerance}
          maxIterations={maxIter} onMaxIterationsChange={setMaxIter}
          result={result}
          isLoading={isLoading}
          onSolve={handleSolve}
          onReset={handleReset}
        />
      )}
    />
  )
}
