import LessonPage from '@components/lesson/LessonPage'
import { JACOBI_CONFIG } from '@/config/lessons/jacobi'
import LinearSystemVisualization from '@components/linear-systems/LinearSystemVisualization'
import LinearSystemAnimation from '@components/linear-systems/LinearSystemAnimation'
import LinearSystemAlgorithm from '@components/linear-systems/LinearSystemAlgorithm'

export default function JacobiPage() {
  return (
    <LessonPage
      config={JACOBI_CONFIG}
      primaryMethod="jacobi"
      renderVisualization={() => <LinearSystemVisualization method="jacobi" />}
      renderAnimation={() => <LinearSystemAnimation method="jacobi" />}
      renderAlgorithm={() => <LinearSystemAlgorithm method="jacobi" />}
    />
  )
}
