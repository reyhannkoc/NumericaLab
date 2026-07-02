import LessonPage from '@components/lesson/LessonPage'
import { LAGRANGE_CONFIG } from '@/config/lessons/lagrange'
import InterpolationVisualization from '@components/interpolation/InterpolationVisualization'
import InterpolationStepAnimation from '@components/interpolation/InterpolationStepAnimation'
import InterpolationAlgorithm from '@components/interpolation/InterpolationAlgorithm'

export default function LagrangePage() {
  return (
    <LessonPage
      config={LAGRANGE_CONFIG}
      primaryMethod="lagrange"
      renderVisualization={() => (
        <InterpolationVisualization method="lagrange" />
      )}
      renderAnimation={() => (
        <InterpolationStepAnimation method="lagrange" />
      )}
      renderAlgorithm={() => (
        <InterpolationAlgorithm method="lagrange" />
      )}
    />
  )
}
