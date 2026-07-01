import { useState, useCallback } from 'react'
import LessonPage from '@components/lesson/LessonPage'
import { CHOLESKY_CONFIG } from '@/config/lessons/cholesky'
import LUVisualization from '@components/lu/LUVisualization'
import LUAnimation from '@components/lu/LUAnimation'
import LUPlayground from '@components/lu/LUPlayground'
import { luService } from '@/services/luService'
import type { LUResult } from '@/types/api.types'

function maxResidual(A: number[][], x: number[], b: number[]): number {
  return Math.max(...b.map((bi, i) => Math.abs(A[i].reduce((s, aij, j) => s + aij * x[j], 0) - bi)))
}

export default function CholeskyPage() {
  const [size, setSize]       = useState<2|3|4>(3)
  const [matrix, setMatrix]   = useState([[4,2,1],[2,5,2],[1,2,6]])
  const [vectorB, setVectorB] = useState([7,9,9])
  const [result,  setResult]  = useState<LUResult | null>(null)
  const [solution, setSolution] = useState<number[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  const handleCompute = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const lu = await luService.decompose({ matrix, method: 'cholesky' })
      setResult(lu)
      if (vectorB.length === matrix.length) {
        const solved = await luService.solve({ matrix, method: 'cholesky', b: vectorB })
        setSolution(solved.solution)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }, [matrix, vectorB])

  const handleReset = useCallback(() => { setResult(null); setSolution(null); setError(null) }, [])

  return (
    <LessonPage
      config={CHOLESKY_CONFIG}
      primaryMethod="cholesky"
      liveErrors={solution ? { absoluteError: maxResidual(matrix, solution, vectorB) } : undefined}
      renderVisualization={() => <LUVisualization method="cholesky" />}
      renderAnimation={() => <LUAnimation method="cholesky" />}
      renderPlayground={() => (
        <LUPlayground
          method="cholesky"
          matrix={matrix}
          vectorB={vectorB}
          size={size}
          onMatrixChange={m => { setMatrix(m); handleReset() }}
          onVectorChange={b => { setVectorB(b); handleReset() }}
          onSizeChange={s => {
            setSize(s)
            if (s === 2) { setMatrix([[4,2],[2,3]]); setVectorB([8,7]) }
            else if (s === 3) { setMatrix([[4,2,1],[2,5,2],[1,2,6]]); setVectorB([7,9,9]) }
            else { setMatrix([[6,-1,0,0],[-1,6,-1,0],[0,-1,6,-1],[0,0,-1,6]]); setVectorB([5,4,4,5]) }
            handleReset()
          }}
          result={result}
          solution={solution}
          isLoading={isLoading}
          onCompute={handleCompute}
          onReset={handleReset}
          error={error}
        />
      )}
    />
  )
}
