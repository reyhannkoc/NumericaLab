import { useState, useCallback } from 'react'
import LessonPage from '@components/lesson/LessonPage'
import { SIMPSONS_CONFIG } from '@/config/lessons/simpsons'
import IntegrationVisualization from '@components/integration/IntegrationVisualization'
import IntegrationAnimation from '@components/integration/IntegrationAnimation'
import IntegrationPlayground from '@components/integration/IntegrationPlayground'
import { integrationService } from '@/services/integrationService'
import type { IntegrationResult } from '@/types/api.types'

export default function SimpsonsPage() {
  const [expression, setExpression] = useState('sin(x)')
  const [a,           setA]           = useState(0)
  const [b,           setB]           = useState(Math.PI)
  const [n,           setN]           = useState(10)
  const [result,      setResult]      = useState<IntegrationResult | null>(null)
  const [isLoading,   setIsLoading]   = useState(false)

  const handleCompute = useCallback(async () => {
    setIsLoading(true)
    try {
      const nEven = n % 2 === 0 ? n : n + 1
      const res = await integrationService.integrate({ expression, a, b, n: nEven, method: 'simpsons' })
      setResult(res)
    } catch (err) {
      console.error('[SimpsonsPage] compute error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [expression, a, b, n])

  const handleReset = useCallback(() => setResult(null), [])

  return (
    <LessonPage
      config={SIMPSONS_CONFIG}
      primaryMethod="simpsons"
      liveErrors={result ? { absoluteError: result.absolute_error, relativeError: result.relative_error } : undefined}
      renderVisualization={() => <IntegrationVisualization method="simpsons" />}
      renderAnimation={() => <IntegrationAnimation method="simpsons" />}
      renderPlayground={() => (
        <IntegrationPlayground
          method="simpsons"
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
