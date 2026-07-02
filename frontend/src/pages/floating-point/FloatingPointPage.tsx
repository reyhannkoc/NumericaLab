import LessonPage from '@components/lesson/LessonPage'
import { FLOATING_POINT_CONFIG } from '@/config/lessons/floatingPoint'
import FloatVisualizationSection from '@components/floating-point/FloatVisualizationSection'
import ErrorPropagationSection from '@components/floating-point/ErrorPropagationSection'
import FloatAlgorithm from '@components/floating-point/FloatAlgorithm'

export default function FloatingPointPage() {
  return (
    <LessonPage
      config={FLOATING_POINT_CONFIG}
      renderVisualization={() => <FloatVisualizationSection />}
      renderAnimation={() => <ErrorPropagationSection />}
      renderAlgorithm={() => <FloatAlgorithm />}
      primaryMethod="float64"
    />
  )
}
