import { useState, useCallback } from 'react'
import LessonPage from '@components/lesson/LessonPage'
import { GRADIENT_DESCENT_CONFIG } from '@/config/lessons/gradientDescent'
import OptimizationVisualization from '@components/optimization/OptimizationVisualization'
import OptimizationAnimation from '@components/optimization/OptimizationAnimation'
import OptimizationPlayground from '@components/optimization/OptimizationPlayground'
import { optimizationService } from '@/services/optimizationService'
import type { OptimizationResult } from '@/types/api.types'

export default function GradientDescentPage() {
  const [expression, setExpression] = useState('(x-2)**2')
  const [a, setA]   = useState(0)
  const [b, setB]   = useState(4)
  const [x0, setX0] = useState(3.5)
  const [alpha, setAlpha] = useState(0.3)
  const [result, setResult] = useState<OptimizationResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleCompute = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await optimizationService.optimize({
        expression, method: 'gradient_descent', x0, learning_rate: alpha,
        tolerance: 1e-10, max_iterations: 500,
      })
      setResult(res)
    } catch (err) {
      console.error('[GradientDescentPage] error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [expression, x0, alpha])

  const handleReset = useCallback(() => setResult(null), [])

  return (
    <LessonPage
      config={GRADIENT_DESCENT_CONFIG}
      primaryMethod="gradient_descent"
      liveErrors={result ? { absoluteError: result.converged ? 0 : 1 } : undefined}
      renderVisualization={() => <OptimizationVisualization method="gradient_descent" />}
      renderAnimation={() => <OptimizationAnimation method="gradient_descent" />}
      renderPlayground={() => (
        <OptimizationPlayground
          method="gradient_descent"
          expression={expression}
          a={a} b={b} x0={x0} alpha={alpha} tolerance={1e-10}
          onExpressionChange={v => { setExpression(v); handleReset() }}
          onAChange={setA}
          onBChange={setB}
          onX0Change={v => { setX0(v); handleReset() }}
          onAlphaChange={v => { setAlpha(v); handleReset() }}
          result={result}
          isLoading={isLoading}
          onCompute={handleCompute}
          onReset={handleReset}
        />
      )}
    />
  )
}
