import { useState, useCallback } from 'react'
import LessonPage from '@components/lesson/LessonPage'
import { TRAPEZOIDAL_CONFIG } from '@/config/lessons/trapezoidal'
import IntegrationVisualization from '@components/integration/IntegrationVisualization'
import IntegrationAnimation from '@components/integration/IntegrationAnimation'
import IntegrationPlayground from '@components/integration/IntegrationPlayground'
import { integrationService } from '@/services/integrationService'
import type { IntegrationResult } from '@/types/api.types'

export default function TrapezoidalPage() {
  const [expression, setExpression] = useState('sin(x)')
  const [a,           setA]           = useState(0)
  const [b,           setB]           = useState(Math.PI)
  const [n,           setN]           = useState(10)
  const [result,      setResult]      = useState<IntegrationResult | null>(null)
  const [isLoading,   setIsLoading]   = useState(false)
  const [error,       setError]       = useState<string | null>(null)

  const handleCompute = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await integrationService.integrate({ expression, a, b, n, method: 'trapezoidal' })
      setResult(res)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }, [expression, a, b, n])

  const handleReset = useCallback(() => { setResult(null); setError(null) }, [])

  return (
    <LessonPage
      config={TRAPEZOIDAL_CONFIG}
      primaryMethod="trapezoidal"
      liveErrors={result ? { absoluteError: result.absolute_error, relativeError: result.relative_error } : undefined}
      renderVisualization={() => <IntegrationVisualization method="trapezoidal" />}
      renderAnimation={() => <IntegrationAnimation method="trapezoidal" />}
      renderPlayground={() => (
        <IntegrationPlayground
          method="trapezoidal"
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
          error={error}
        />
      )}
    />
  )
}
