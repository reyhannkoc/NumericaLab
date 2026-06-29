import { useState, useCallback } from 'react'
import LessonPage from '@components/lesson/LessonPage'
import { CENTRAL_DIFF_CONFIG } from '@/config/lessons/centralDifference'
import DifferentiationVisualization from '@components/differentiation/DifferentiationVisualization'
import DifferentiationAnimation from '@components/differentiation/DifferentiationAnimation'
import DifferentiationPlayground from '@components/differentiation/DifferentiationPlayground'
import { differentiationService } from '@/services/differentiationService'
import type { DifferentiationResult } from '@/types/api.types'

export default function CentralDifferencePage() {
  const [expression, setExpression] = useState('sin(x)')
  const [xPoint,     setXPoint]     = useState(1.0)
  const [h,          setH]          = useState(1e-5)
  const [result,     setResult]     = useState<DifferentiationResult | null>(null)
  const [isLoading,  setIsLoading]  = useState(false)

  const handleCompute = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await differentiationService.differentiate({ expression, x_point: xPoint, h, method: 'central' })
      setResult(res)
    } catch (err) {
      console.error('[CentralDifferencePage] compute error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [expression, xPoint, h])

  const handleReset = useCallback(() => setResult(null), [])

  return (
    <LessonPage
      config={CENTRAL_DIFF_CONFIG}
      primaryMethod="central"
      liveErrors={result ? { absoluteError: result.absolute_error, relativeError: result.relative_error } : undefined}
      renderVisualization={() => <DifferentiationVisualization method="central" />}
      renderAnimation={() => <DifferentiationAnimation method="central" />}
      renderPlayground={() => (
        <DifferentiationPlayground
          method="central"
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
        />
      )}
    />
  )
}
