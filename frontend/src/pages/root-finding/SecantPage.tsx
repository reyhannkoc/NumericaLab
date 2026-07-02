import LessonPage from '@components/lesson/LessonPage'
import { SECANT_CONFIG } from '@/config/lessons/secant'
import RootFindingVisualization from '@components/root-finding/RootFindingVisualization'
import RootFindingStepAnimation from '@components/root-finding/RootFindingStepAnimation'
import RootFindingAlgorithm from '@components/root-finding/RootFindingAlgorithm'

export default function SecantPage() {
  return (
    <LessonPage
      config={SECANT_CONFIG}
      primaryMethod="secant"
      renderVisualization={() => (
        <RootFindingVisualization method="secant" />
      )}
      renderAnimation={() => (
        <RootFindingStepAnimation method="secant" />
      )}
      renderAlgorithm={() => (
        <RootFindingAlgorithm method="secant" />
      )}
    />
  )
}
