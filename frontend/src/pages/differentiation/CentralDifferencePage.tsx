import LessonPage from '@components/lesson/LessonPage'
import { CENTRAL_DIFF_CONFIG } from '@/config/lessons/centralDifference'
import DifferentiationVisualization from '@components/differentiation/DifferentiationVisualization'
import DifferentiationAnimation from '@components/differentiation/DifferentiationAnimation'
import DifferentiationAlgorithm from '@components/differentiation/DifferentiationAlgorithm'

export default function CentralDifferencePage() {
  return (
    <LessonPage
      config={CENTRAL_DIFF_CONFIG}
      primaryMethod="central"
      renderVisualization={() => <DifferentiationVisualization method="central" />}
      renderAnimation={() => <DifferentiationAnimation method="central" />}
      renderAlgorithm={() => <DifferentiationAlgorithm method="central" />}
    />
  )
}
