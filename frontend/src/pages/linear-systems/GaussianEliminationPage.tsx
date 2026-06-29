import { useState, useCallback } from 'react'
import LessonPage from '@components/lesson/LessonPage'
import { GAUSSIAN_ELIMINATION_CONFIG } from '@/config/lessons/gaussianElimination'
import LinearSystemVisualization from '@components/linear-systems/LinearSystemVisualization'
import LinearSystemAnimation from '@components/linear-systems/LinearSystemAnimation'
import LinearSystemPlayground from '@components/linear-systems/LinearSystemPlayground'
import { linearSystemsService } from '@/services/linearSystemsService'
import type { LinearSystemResult } from '@/types/api.types'

export default function GaussianEliminationPage() {
  const [size, setSize]       = useState<2|3>(3)
  const [matrixA, setMatrixA] = useState([[4,-1,0],[-1,4,-1],[0,-1,4]])
  const [vectorB, setVectorB] = useState([3,2,3])
  const [result,  setResult]  = useState<LinearSystemResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleCompute = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await linearSystemsService.solve({
        matrix_a: matrixA,
        vector_b: vectorB,
        method: 'gaussian_elimination',
      })
      setResult(res)
    } catch (err) {
      console.error('[GaussianEliminationPage] error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [matrixA, vectorB])

  const handleReset = useCallback(() => setResult(null), [])

  return (
    <LessonPage
      config={GAUSSIAN_ELIMINATION_CONFIG}
      primaryMethod="gaussian_elimination"
      liveErrors={result ? { absoluteError: result.residual } : undefined}
      renderVisualization={() => <LinearSystemVisualization method="gaussian_elimination" />}
      renderAnimation={() => <LinearSystemAnimation method="gaussian_elimination" />}
      renderPlayground={() => (
        <LinearSystemPlayground
          method="gaussian_elimination"
          matrixA={matrixA}
          vectorB={vectorB}
          size={size}
          onMatrixChange={a => { setMatrixA(a); handleReset() }}
          onVectorChange={b => { setVectorB(b); handleReset() }}
          onSizeChange={s => {
            setSize(s)
            if (s === 2) { setMatrixA([[4,-1],[-1,4]]); setVectorB([3,3]) }
            else { setMatrixA([[4,-1,0],[-1,4,-1],[0,-1,4]]); setVectorB([3,2,3]) }
            handleReset()
          }}
          solution={result?.solution ?? null}
          iterations={null}
          residual={result?.residual ?? null}
          isLoading={isLoading}
          onCompute={handleCompute}
          onReset={handleReset}
        />
      )}
    />
  )
}
