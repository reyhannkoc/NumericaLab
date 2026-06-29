import { useState, useCallback } from 'react'
import LessonPage from '@components/lesson/LessonPage'
import { RUNGE_KUTTA_CONFIG } from '@/config/lessons/rungeKutta'
import ODEVisualization from '@components/ode/ODEVisualization'
import ODEAnimation from '@components/ode/ODEAnimation'
import ODEPlayground from '@components/ode/ODEPlayground'
import { odeService } from '@/services/odeService'
import type { ODEResult } from '@/types/api.types'

export default function RungeKuttaPage() {
  const [expression, setExpression] = useState('y')
  const [x0, setX0]     = useState(0)
  const [y0, setY0]     = useState(1)
  const [xEnd, setXEnd] = useState(3)
  const [h, setH]       = useState(0.5)
  const [result, setResult] = useState<ODEResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleCompute = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await odeService.solve({
        expression, x0, y0, x_end: xEnd, h, method: 'runge_kutta_4',
      })
      setResult(res)
    } catch (err) {
      console.error('[RungeKuttaPage] error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [expression, x0, y0, xEnd, h])

  const handleReset = useCallback(() => setResult(null), [])

  const maxError = result?.global_error ? Math.max(...result.global_error) : undefined

  return (
    <LessonPage
      config={RUNGE_KUTTA_CONFIG}
      primaryMethod="runge_kutta_4"
      liveErrors={maxError !== undefined ? { absoluteError: maxError } : undefined}
      renderVisualization={() => <ODEVisualization method="runge_kutta_4" />}
      renderAnimation={() => <ODEAnimation method="runge_kutta_4" />}
      renderPlayground={() => (
        <ODEPlayground
          method="runge_kutta_4"
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
        />
      )}
    />
  )
}
