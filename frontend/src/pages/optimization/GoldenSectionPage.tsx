import LessonPage from '@components/lesson/LessonPage'
import { GOLDEN_SECTION_CONFIG } from '@/config/lessons/goldenSection'
import OptimizationVisualization from '@components/optimization/OptimizationVisualization'
import OptimizationAnimation from '@components/optimization/OptimizationAnimation'
import OptimizationAlgorithm from '@components/optimization/OptimizationAlgorithm'

export default function GoldenSectionPage() {
  return (
    <LessonPage
      config={GOLDEN_SECTION_CONFIG}
      primaryMethod="golden_section"
      renderVisualization={() => <OptimizationVisualization method="golden_section" />}
      renderAnimation={() => <OptimizationAnimation method="golden_section" />}
      renderAlgorithm={() => <OptimizationAlgorithm method="golden_section" />}
    />
  )
}
