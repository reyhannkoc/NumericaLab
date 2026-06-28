import { useState, useCallback } from 'react'
import LessonPage from '@components/lesson/LessonPage'
import { LAGRANGE_CONFIG } from '@/config/lessons/lagrange'
import InterpolationVisualization from '@components/interpolation/InterpolationVisualization'
import InterpolationStepAnimation from '@components/interpolation/InterpolationStepAnimation'
import InterpolationPlayground from '@components/interpolation/InterpolationPlayground'
import { interpolationService } from '@/services/interpolationService'
import type { InterpolationResult } from '@/types/api.types'

function parseNumbers(s: string): number[] {
  return s.split(',').map((t) => parseFloat(t.trim())).filter(isFinite)
}

export default function LagrangePage() {
  const [xPoints,      setXPoints]      = useState('0,1,2,3,4')
  const [yPoints,      setYPoints]      = useState('0,1,4,9,16')
  const [queryPoints,  setQueryPoints]  = useState('0.5,1.5,2.5,3.5')
  const [result,       setResult]       = useState<InterpolationResult | null>(null)
  const [isLoading,    setIsLoading]    = useState(false)

  const handleCompute = useCallback(async () => {
    const xs = parseNumbers(xPoints)
    const ys = parseNumbers(yPoints)
    const qs = parseNumbers(queryPoints)
    if (xs.length < 2 || xs.length !== ys.length || qs.length === 0) return

    setIsLoading(true)
    try {
      const res = await interpolationService.interpolate({
        x_points: xs,
        y_points: ys,
        query_points: qs,
        method: 'lagrange',
      })
      setResult(res)
    } catch (err) {
      console.error('[LagrangePage] compute error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [xPoints, yPoints, queryPoints])

  const handleReset = useCallback(() => setResult(null), [])

  return (
    <LessonPage
      config={LAGRANGE_CONFIG}
      primaryMethod="lagrange"
      renderVisualization={() => (
        <InterpolationVisualization method="lagrange" />
      )}
      renderAnimation={() => (
        <InterpolationStepAnimation method="lagrange" result={result} />
      )}
      renderPlayground={() => (
        <InterpolationPlayground
          method="lagrange"
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
        />
      )}
    />
  )
}
