import LessonPage from '@components/lesson/LessonPage'
import { LU_DECOMPOSITION_CONFIG } from '@/config/lessons/luDecomposition'
import LUVisualization from '@components/lu/LUVisualization'
import LUAnimation from '@components/lu/LUAnimation'

export default function LUDecompositionPage() {
  return (
    <LessonPage
      config={LU_DECOMPOSITION_CONFIG}
      primaryMethod="lu"
      renderVisualization={() => <LUVisualization method="lu" />}
      renderAnimation={() => <LUAnimation method="lu" />}
    />
  )
}
