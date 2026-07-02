import LessonPage from '@components/lesson/LessonPage'
import { NEWTON_RAPHSON_CONFIG } from '@/config/lessons/newtonRaphson'
import RootFindingVisualization from '@components/root-finding/RootFindingVisualization'
import RootFindingStepAnimation from '@components/root-finding/RootFindingStepAnimation'
import RootFindingAlgorithm from '@components/root-finding/RootFindingAlgorithm'

export default function NewtonRaphsonPage() {
  return (
    <LessonPage
      config={NEWTON_RAPHSON_CONFIG}
      primaryMethod="newton-raphson"
      renderVisualization={() => (
        <RootFindingVisualization method="newton_raphson" />
      )}
      renderAnimation={() => (
        <RootFindingStepAnimation method="newton_raphson" />
      )}
      renderAlgorithm={() => (
        <RootFindingAlgorithm method="newton_raphson" />
      )}
    />
  )
}
