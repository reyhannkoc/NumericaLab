import { useState, useCallback } from 'react'
import LessonPage from '@components/lesson/LessonPage'
import { NEWTON_RAPHSON_CONFIG } from '@/config/lessons/newtonRaphson'
import RootFindingVisualization from '@components/root-finding/RootFindingVisualization'
import RootFindingStepAnimation from '@components/root-finding/RootFindingStepAnimation'
import RootFindingPlayground from '@components/root-finding/RootFindingPlayground'
import { rootFindingService } from '@/services/rootFindingService'
import type { RootFindingResult } from '@/types/api.types'

export default function NewtonRaphsonPage() {
  // ── Form state ──────────────────────────────────────────────────────────────
  const [expression, setExpression] = useState('x**3 - x - 2')
  const [x0,         setX0]         = useState(1.5)
  const [tolerance,  setTolerance]  = useState(1e-12)
  const [maxIter,    setMaxIter]    = useState(50)

  // ── Result state ────────────────────────────────────────────────────────────
  const [result,    setResult]    = useState<RootFindingResult | null>(null)
  const [curveX,    setCurveX]    = useState<number[]>([])
  const [curveY,    setCurveY]    = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSolve = useCallback(async () => {
    setIsLoading(true)
    try {
      const [res, curve] = await Promise.all([
        rootFindingService.solve({
          expression,
          method: 'newton_raphson',
          x0,
          tolerance,
          max_iterations: maxIter,
        }),
        rootFindingService.getFunctionPlot(expression, x0 - 2.5, x0 + 2.5, 300),
      ])
      setResult(res)
      setCurveX(curve.x)
      setCurveY(curve.y)
    } catch (err) {
      console.error('[NewtonRaphsonPage] solve error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [expression, x0, tolerance, maxIter])

  const handleReset = useCallback(() => {
    setResult(null)
    setCurveX([])
    setCurveY([])
  }, [])

  return (
    <LessonPage
      config={NEWTON_RAPHSON_CONFIG}
      primaryMethod="newton-raphson"
      liveErrors={result ? {
        absoluteError: result.final_error,
        iterations:    result.total_iterations,
      } : undefined}
      livePerformance={result ? {
        measuredMs:       result.execution_time_ms,
        actualIterations: result.total_iterations,
      } : undefined}
      renderVisualization={() => (
        <RootFindingVisualization method="newton_raphson" />
      )}
      renderAnimation={() => (
        <RootFindingStepAnimation
          method="newton_raphson"
          iterations={result?.iterations ?? []}
          curveX={curveX}
          curveY={curveY}
        />
      )}
      renderPlayground={() => (
        <RootFindingPlayground
          method="newton_raphson"
          expression={expression}
          onExpressionChange={(v) => { setExpression(v); handleReset() }}
          x0={x0}       onX0Change={setX0}
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
