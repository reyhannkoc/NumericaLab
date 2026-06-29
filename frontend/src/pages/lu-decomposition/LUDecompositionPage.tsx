import { useState, useCallback } from 'react'
import LessonPage from '@components/lesson/LessonPage'
import { LU_DECOMPOSITION_CONFIG } from '@/config/lessons/luDecomposition'
import LUVisualization from '@components/lu/LUVisualization'
import LUAnimation from '@components/lu/LUAnimation'
import LUPlayground from '@components/lu/LUPlayground'
import { luService } from '@/services/luService'
import type { LUResult } from '@/types/api.types'

export default function LUDecompositionPage() {
  const [size, setSize]       = useState<2|3|4>(3)
  const [matrix, setMatrix]   = useState([[2,1,1],[4,3,3],[8,7,9]])
  const [vectorB, setVectorB] = useState([4,8,16])
  const [result,  setResult]  = useState<LUResult | null>(null)
  const [solution, setSolution] = useState<number[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleCompute = useCallback(async () => {
    setIsLoading(true)
    try {
      const lu = await luService.decompose({ matrix, method: 'lu' })
      setResult(lu)
      if (vectorB.length === matrix.length) {
        const solved = await luService.solve({ matrix, method: 'lu', b: vectorB })
        setSolution(solved.solution)
      }
    } catch (err) {
      console.error('[LUDecompositionPage] error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [matrix, vectorB])

  const handleReset = useCallback(() => { setResult(null); setSolution(null) }, [])

  return (
    <LessonPage
      config={LU_DECOMPOSITION_CONFIG}
      primaryMethod="lu"
      liveErrors={result ? { absoluteError: 0 } : undefined}
      renderVisualization={() => <LUVisualization method="lu" />}
      renderAnimation={() => <LUAnimation method="lu" />}
      renderPlayground={() => (
        <LUPlayground
          method="lu"
          matrix={matrix}
          vectorB={vectorB}
          size={size}
          onMatrixChange={m => { setMatrix(m); handleReset() }}
          onVectorChange={b => { setVectorB(b); handleReset() }}
          onSizeChange={s => {
            setSize(s)
            if (s === 2) { setMatrix([[4,2],[2,3]]); setVectorB([8,7]) }
            else if (s === 3) { setMatrix([[2,1,1],[4,3,3],[8,7,9]]); setVectorB([4,8,16]) }
            else { setMatrix([[5,-1,0,0],[-1,5,-1,0],[0,-1,5,-1],[0,0,-1,5]]); setVectorB([4,3,3,4]) }
            handleReset()
          }}
          result={result}
          solution={solution}
          isLoading={isLoading}
          onCompute={handleCompute}
          onReset={handleReset}
        />
      )}
    />
  )
}
