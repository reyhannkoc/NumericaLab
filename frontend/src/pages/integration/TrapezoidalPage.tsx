import LessonPage from '@components/lesson/LessonPage'
import { TRAPEZOIDAL_CONFIG } from '@/config/lessons/trapezoidal'
import IntegrationVisualization from '@components/integration/IntegrationVisualization'
import IntegrationAnimation from '@components/integration/IntegrationAnimation'
import IntegrationAlgorithm from '@components/integration/IntegrationAlgorithm'

export default function TrapezoidalPage() {
  return (
    <LessonPage
      config={TRAPEZOIDAL_CONFIG}
      primaryMethod="trapezoidal"
      renderVisualization={() => <IntegrationVisualization method="trapezoidal" />}
      renderAnimation={() => <IntegrationAnimation method="trapezoidal" />}
      renderAlgorithm={() => <IntegrationAlgorithm method="trapezoidal" />}
    />
  )
}
