import LessonPage from '@components/lesson/LessonPage'
import { CUBIC_SPLINE_CONFIG } from '@/config/lessons/cubicSpline'
import InterpolationVisualization from '@components/interpolation/InterpolationVisualization'
import InterpolationStepAnimation from '@components/interpolation/InterpolationStepAnimation'
import InterpolationAlgorithm from '@components/interpolation/InterpolationAlgorithm'

export default function CubicSplinePage() {
  return (
    <LessonPage
      config={CUBIC_SPLINE_CONFIG}
      primaryMethod="cubic-spline"
      renderVisualization={() => (
        <InterpolationVisualization method="cubic_spline" />
      )}
      renderAnimation={() => (
        <InterpolationStepAnimation method="cubic_spline" />
      )}
      renderAlgorithm={() => (
        <InterpolationAlgorithm method="cubic_spline" />
      )}
    />
  )
}
