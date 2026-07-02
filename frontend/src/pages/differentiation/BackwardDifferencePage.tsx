import LessonPage from '@components/lesson/LessonPage'
import { BACKWARD_DIFF_CONFIG } from '@/config/lessons/backwardDifference'
import DifferentiationVisualization from '@components/differentiation/DifferentiationVisualization'
import DifferentiationAnimation from '@components/differentiation/DifferentiationAnimation'
import DifferentiationAlgorithm from '@components/differentiation/DifferentiationAlgorithm'

export default function BackwardDifferencePage() {
  return (
    <LessonPage
      config={BACKWARD_DIFF_CONFIG}
      primaryMethod="backward"
      renderVisualization={() => <DifferentiationVisualization method="backward" />}
      renderAnimation={() => <DifferentiationAnimation method="backward" />}
      renderAlgorithm={() => <DifferentiationAlgorithm method="backward" />}
    />
  )
}
