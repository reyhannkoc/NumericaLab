import { useState, useCallback } from 'react'
import LessonPage from '@components/lesson/LessonPage'
import { FORWARD_DIFF_CONFIG } from '@/config/lessons/forwardDifference'
import DifferentiationVisualization from '@components/differentiation/DifferentiationVisualization'
import DifferentiationAnimation from '@components/differentiation/DifferentiationAnimation'
import DifferentiationPlayground from '@components/differentiation/DifferentiationPlayground'
import { differentiationService } from '@/services/differentiationService'
import type { DifferentiationResult } from '@/types/api.types'

export default function ForwardDifferencePage() {
  const [expression, setExpression] = useState('sin(x)')
  const [xPoint,     setXPoint]     = useState(1.0)
  const [h,          setH]          = useState(1e-5)
  const [result,     setResult]     = useState<DifferentiationResult | null>(null)
  const [isLoading,  setIsLoading]  = useState(false)
  const [error,      setError]      = useState<string | null>(null)

  const handleCompute = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await differentiationService.differentiate({ expression, x_point: xPoint, h, method: 'forward' })
      setResult(res)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }, [expression, xPoint, h])

  const handleReset = useCallback(() => { setResult(null); setError(null) }, [])

  return (
    <LessonPage
      config={FORWARD_DIFF_CONFIG}
      primaryMethod="forward"
      liveErrors={result ? { absoluteError: result.absolute_error, relativeError: result.relative_error } : undefined}
      renderVisualization={() => <DifferentiationVisualization method="forward" />}
      renderAnimation={() => <DifferentiationAnimation method="forward" />}
      renderPlayground={() => (
        <DifferentiationPlayground
          method="forward"
          expression={expression}
          xPoint={xPoint}
          h={h}
          onExpressionChange={(v) => { setExpression(v); handleReset() }}
          onXPointChange={(v) => { setXPoint(v); handleReset() }}
          onHChange={(v) => { setH(v); handleReset() }}
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
