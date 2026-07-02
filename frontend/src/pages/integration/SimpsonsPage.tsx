import LessonPage from '@components/lesson/LessonPage'
import { SIMPSONS_CONFIG } from '@/config/lessons/simpsons'
import IntegrationVisualization from '@components/integration/IntegrationVisualization'
import IntegrationAnimation from '@components/integration/IntegrationAnimation'
import IntegrationAlgorithm from '@components/integration/IntegrationAlgorithm'

export default function SimpsonsPage() {
  return (
    <LessonPage
      config={SIMPSONS_CONFIG}
      primaryMethod="simpsons"
      renderVisualization={() => <IntegrationVisualization method="simpsons" />}
      renderAnimation={() => <IntegrationAnimation method="simpsons" />}
      renderAlgorithm={() => <IntegrationAlgorithm method="simpsons" />}
    />
  )
}
