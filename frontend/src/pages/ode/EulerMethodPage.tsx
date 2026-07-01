import { useState, useCallback } from 'react'
import LessonPage from '@components/lesson/LessonPage'
import { EULER_CONFIG } from '@/config/lessons/euler'
import ODEVisualization from '@components/ode/ODEVisualization'
import ODEAnimation from '@components/ode/ODEAnimation'
import ODEPlayground from '@components/ode/ODEPlayground'
import { odeService } from '@/services/odeService'
import type { ODEResult } from '@/types/api.types'

const EXACT_MAP: Record<string, string> = {
  'y':           'exp(x)',
  '-y':          'exp(-x)',
  'x + y':       '2*exp(x) - x - 1',
  'sin(x) - y':  '(sin(x) - cos(x) + exp(-x)) / 2',
}

export default function EulerMethodPage() {
  const [expression, setExpression] = useState('y')
  const [x0, setX0]     = useState(0)
  const [y0, setY0]     = useState(1)
  const [xEnd, setXEnd] = useState(2)
  const [h, setH]       = useState(0.2)
  const [result, setResult] = useState<ODEResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCompute = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await odeService.solve({
        expression, x0, y0, x_end: xEnd, h, method: 'euler',
        exact_expression: EXACT_MAP[expression.trim()],
      })
      setResult(res)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }, [expression, x0, y0, xEnd, h])

  const handleReset = useCallback(() => { setResult(null); setError(null) }, [])

  const maxError = result?.global_error ? Math.max(...result.global_error) : undefined

  return (
    <LessonPage
      config={EULER_CONFIG}
      primaryMethod="euler"
      liveErrors={maxError !== undefined ? { absoluteError: maxError } : undefined}
      renderVisualization={() => <ODEVisualization method="euler" />}
      renderAnimation={() => <ODEAnimation method="euler" />}
      renderPlayground={() => (
        <ODEPlayground
          method="euler"
          expression={expression}
          x0={x0} y0={y0} xEnd={xEnd} h={h}
          onExpressionChange={v => { setExpression(v); handleReset() }}
          onX0Change={v => { setX0(v); handleReset() }}
          onY0Change={v => { setY0(v); handleReset() }}
          onXEndChange={v => { setXEnd(v); handleReset() }}
          onHChange={v => { setH(v); handleReset() }}
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
