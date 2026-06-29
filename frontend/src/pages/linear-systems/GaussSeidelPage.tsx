import { useState, useCallback } from 'react'
import LessonPage from '@components/lesson/LessonPage'
import { GAUSS_SEIDEL_CONFIG } from '@/config/lessons/gaussSeidel'
import LinearSystemVisualization from '@components/linear-systems/LinearSystemVisualization'
import LinearSystemAnimation from '@components/linear-systems/LinearSystemAnimation'
import LinearSystemPlayground from '@components/linear-systems/LinearSystemPlayground'
import { linearSystemsService } from '@/services/linearSystemsService'
import type { LinearSystemResult } from '@/types/api.types'

export default function GaussSeidelPage() {
  const [size, setSize]       = useState<2|3>(3)
  const [matrixA, setMatrixA] = useState([[5,-1,0],[-1,5,-1],[0,-1,5]])
  const [vectorB, setVectorB] = useState([4,3,4])
  const [result,  setResult]  = useState<LinearSystemResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleCompute = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await linearSystemsService.solve({
        matrix_a: matrixA,
        vector_b: vectorB,
        method: 'gauss_seidel',
        tolerance: 1e-10,
        max_iterations: 100,
      })
      setResult(res)
    } catch (err) {
      console.error('[GaussSeidelPage] error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [matrixA, vectorB])

  const handleReset = useCallback(() => setResult(null), [])

  return (
    <LessonPage
      config={GAUSS_SEIDEL_CONFIG}
      primaryMethod="gauss_seidel"
      liveErrors={result ? { absoluteError: result.residual } : undefined}
      renderVisualization={() => <LinearSystemVisualization method="gauss_seidel" />}
      renderAnimation={() => <LinearSystemAnimation method="gauss_seidel" />}
      renderPlayground={() => (
        <LinearSystemPlayground
          method="gauss_seidel"
          matrixA={matrixA}
          vectorB={vectorB}
          size={size}
          onMatrixChange={a => { setMatrixA(a); handleReset() }}
          onVectorChange={b => { setVectorB(b); handleReset() }}
          onSizeChange={s => {
            setSize(s)
            if (s === 2) { setMatrixA([[5,-1],[-1,5]]); setVectorB([4,4]) }
            else { setMatrixA([[5,-1,0],[-1,5,-1],[0,-1,5]]); setVectorB([4,3,4]) }
            handleReset()
          }}
          solution={result?.solution ?? null}
          iterations={result?.iterations ?? null}
          residual={result?.residual ?? null}
          isLoading={isLoading}
          onCompute={handleCompute}
          onReset={handleReset}
        />
      )}
    />
  )
}
