import LessonPage from '@components/lesson/LessonPage'
import { GAUSSIAN_ELIMINATION_CONFIG } from '@/config/lessons/gaussianElimination'
import LinearSystemVisualization from '@components/linear-systems/LinearSystemVisualization'
import LinearSystemAnimation from '@components/linear-systems/LinearSystemAnimation'

export default function GaussianEliminationPage() {
  return (
    <LessonPage
      config={GAUSSIAN_ELIMINATION_CONFIG}
      primaryMethod="gaussian_elimination"
      renderVisualization={() => <LinearSystemVisualization method="gaussian_elimination" />}
      renderAnimation={() => <LinearSystemAnimation method="gaussian_elimination" />}
    />
  )
}
