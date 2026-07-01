import { useState, useCallback } from 'react'
import LessonPage from '@components/lesson/LessonPage'
import { CUBIC_SPLINE_CONFIG } from '@/config/lessons/cubicSpline'
import InterpolationVisualization from '@components/interpolation/InterpolationVisualization'
import InterpolationStepAnimation from '@components/interpolation/InterpolationStepAnimation'
import InterpolationPlayground from '@components/interpolation/InterpolationPlayground'
import { interpolationService } from '@/services/interpolationService'
import type { InterpolationResult } from '@/types/api.types'

function parseNumbers(s: string): number[] {
  return s.split(',').map((t) => parseFloat(t.trim())).filter(isFinite)
}

export default function CubicSplinePage() {
  const [xPoints,     setXPoints]     = useState('0,1,2,3,4,5')
  const [yPoints,     setYPoints]     = useState('0,0.8415,0.9093,0.1411,-0.7568,-0.9589')
  const [queryPoints, setQueryPoints] = useState('0.5,1.5,2.5,3.5,4.5')
  const [result,      setResult]      = useState<InterpolationResult | null>(null)
  const [isLoading,   setIsLoading]   = useState(false)
  const [error,       setError]       = useState<string | null>(null)

  const handleCompute = useCallback(async () => {
    const xs = parseNumbers(xPoints)
    const ys = parseNumbers(yPoints)
    const qs = parseNumbers(queryPoints)
    if (xs.length < 2 || xs.length !== ys.length || qs.length === 0) return

    setIsLoading(true)
    setError(null)
    try {
      const res = await interpolationService.interpolate({
        x_points: xs,
        y_points: ys,
        query_points: qs,
        method: 'cubic_spline',
      })
      setResult(res)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }, [xPoints, yPoints, queryPoints])

  const handleReset = useCallback(() => { setResult(null); setError(null) }, [])

  return (
    <LessonPage
      config={CUBIC_SPLINE_CONFIG}
      primaryMethod="cubic-spline"
      renderVisualization={() => (
        <InterpolationVisualization method="cubic_spline" />
      )}
      renderAnimation={() => (
        <InterpolationStepAnimation method="cubic_spline" result={result} />
      )}
      renderPlayground={() => (
        <InterpolationPlayground
          method="cubic_spline"
          xPoints={xPoints}
          yPoints={yPoints}
          queryPoints={queryPoints}
          onXPointsChange={(v) => { setXPoints(v); handleReset() }}
          onYPointsChange={(v) => { setYPoints(v); handleReset() }}
          onQueryPointsChange={(v) => { setQueryPoints(v); handleReset() }}
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
