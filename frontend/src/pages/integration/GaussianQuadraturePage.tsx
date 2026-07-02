import LessonPage from '@components/lesson/LessonPage'
import { GAUSSIAN_QUADRATURE_CONFIG } from '@/config/lessons/gaussianQuadrature'
import IntegrationVisualization from '@components/integration/IntegrationVisualization'
import IntegrationAnimation from '@components/integration/IntegrationAnimation'
import IntegrationAlgorithm from '@components/integration/IntegrationAlgorithm'

export default function GaussianQuadraturePage() {
  return (
    <LessonPage
      config={GAUSSIAN_QUADRATURE_CONFIG}
      primaryMethod="gaussian_quadrature"
      renderVisualization={() => <IntegrationVisualization method="gaussian_quadrature" />}
      renderAnimation={() => <IntegrationAnimation method="gaussian_quadrature" />}
      renderAlgorithm={() => <IntegrationAlgorithm method="gaussian_quadrature" />}
    />
  )
}
