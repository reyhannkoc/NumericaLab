import LessonPage from '@components/lesson/LessonPage'
import { BISECTION_CONFIG } from '@/config/lessons/bisection'
import RootFindingVisualization from '@components/root-finding/RootFindingVisualization'
import RootFindingStepAnimation from '@components/root-finding/RootFindingStepAnimation'
import RootFindingAlgorithm from '@components/root-finding/RootFindingAlgorithm'

export default function BisectionPage() {
  return (
    <LessonPage
      config={BISECTION_CONFIG}
      primaryMethod="bisection"
      renderVisualization={() => (
        <RootFindingVisualization method="bisection" />
      )}
      renderAnimation={() => (
        <RootFindingStepAnimation method="bisection" />
      )}
      renderAlgorithm={() => (
        <RootFindingAlgorithm method="bisection" />
      )}
    />
  )
}
