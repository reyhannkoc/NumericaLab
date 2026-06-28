import LessonPage from '@components/lesson/LessonPage'
import { FLOATING_POINT_CONFIG } from '@/config/lessons/floatingPoint'
import FloatVisualizationSection from '@components/floating-point/FloatVisualizationSection'
import ErrorPropagationSection from '@components/floating-point/ErrorPropagationSection'
import FloatInteractiveSection from '@components/floating-point/FloatInteractiveSection'

export default function FloatingPointPage() {
  return (
    <LessonPage
      config={FLOATING_POINT_CONFIG}
      renderVisualization={() => <FloatVisualizationSection />}
      renderAnimation={() => <ErrorPropagationSection />}
      renderPlayground={() => <FloatInteractiveSection />}
      primaryMethod="float64"
    />
  )
}
