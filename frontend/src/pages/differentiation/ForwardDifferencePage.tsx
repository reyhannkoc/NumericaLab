import LessonPage from '@components/lesson/LessonPage'
import { FORWARD_DIFF_CONFIG } from '@/config/lessons/forwardDifference'
import DifferentiationVisualization from '@components/differentiation/DifferentiationVisualization'
import DifferentiationAnimation from '@components/differentiation/DifferentiationAnimation'
import DifferentiationAlgorithm from '@components/differentiation/DifferentiationAlgorithm'

export default function ForwardDifferencePage() {
  return (
    <LessonPage
      config={FORWARD_DIFF_CONFIG}
      primaryMethod="forward"
      renderVisualization={() => <DifferentiationVisualization method="forward" />}
      renderAnimation={() => <DifferentiationAnimation method="forward" />}
      renderAlgorithm={() => <DifferentiationAlgorithm method="forward" />}
    />
  )
}
