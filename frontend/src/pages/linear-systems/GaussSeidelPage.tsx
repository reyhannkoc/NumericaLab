import LessonPage from '@components/lesson/LessonPage'
import { GAUSS_SEIDEL_CONFIG } from '@/config/lessons/gaussSeidel'
import LinearSystemVisualization from '@components/linear-systems/LinearSystemVisualization'
import LinearSystemAnimation from '@components/linear-systems/LinearSystemAnimation'
import LinearSystemAlgorithm from '@components/linear-systems/LinearSystemAlgorithm'

export default function GaussSeidelPage() {
  return (
    <LessonPage
      config={GAUSS_SEIDEL_CONFIG}
      primaryMethod="gauss_seidel"
      renderVisualization={() => <LinearSystemVisualization method="gauss_seidel" />}
      renderAnimation={() => <LinearSystemAnimation method="gauss_seidel" />}
      renderAlgorithm={() => <LinearSystemAlgorithm method="gauss_seidel" />}
    />
  )
}
