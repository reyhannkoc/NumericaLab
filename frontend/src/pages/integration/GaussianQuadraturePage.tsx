import { useState, useCallback } from 'react'
import LessonPage from '@components/lesson/LessonPage'
import { GAUSSIAN_QUADRATURE_CONFIG } from '@/config/lessons/gaussianQuadrature'
import IntegrationVisualization from '@components/integration/IntegrationVisualization'
import IntegrationAnimation from '@components/integration/IntegrationAnimation'
import IntegrationPlayground from '@components/integration/IntegrationPlayground'
import { integrationService } from '@/services/integrationService'
import type { IntegrationResult } from '@/types/api.types'

export default function GaussianQuadraturePage() {
  const [expression, setExpression] = useState('sin(x)')
  const [a,           setA]           = useState(0)
  const [b,           setB]           = useState(Math.PI)
  const [n,           setN]           = useState(5)
  const [result,      setResult]      = useState<IntegrationResult | null>(null)
  const [isLoading,   setIsLoading]   = useState(false)

  const handleCompute = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await integrationService.integrate({ expression, a, b, n, method: 'gaussian_quadrature' })
      setResult(res)
    } catch (err) {
      console.error('[GaussianQuadraturePage] compute error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [expression, a, b, n])

  const handleReset = useCallback(() => setResult(null), [])

  return (
    <LessonPage
      config={GAUSSIAN_QUADRATURE_CONFIG}
      primaryMethod="gaussian_quadrature"
      liveErrors={result ? { absoluteError: result.absolute_error, relativeError: result.relative_error } : undefined}
      renderVisualization={() => <IntegrationVisualization method="gaussian_quadrature" />}
      renderAnimation={() => <IntegrationAnimation method="gaussian_quadrature" />}
      renderPlayground={() => (
        <IntegrationPlayground
          method="gaussian_quadrature"
          expression={expression}
          a={a}
          b={b}
          n={n}
          onExpressionChange={v => { setExpression(v); handleReset() }}
          onAChange={v => { setA(v); handleReset() }}
          onBChange={v => { setB(v); handleReset() }}
          onNChange={v => { setN(v); handleReset() }}
          result={result}
          isLoading={isLoading}
          onCompute={handleCompute}
          onReset={handleReset}
        />
      )}
    />
  )
}
