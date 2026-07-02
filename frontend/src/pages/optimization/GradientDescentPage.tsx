import LessonPage from '@components/lesson/LessonPage'
import { GRADIENT_DESCENT_CONFIG } from '@/config/lessons/gradientDescent'
import OptimizationVisualization from '@components/optimization/OptimizationVisualization'
import OptimizationAnimation from '@components/optimization/OptimizationAnimation'
import OptimizationAlgorithm from '@components/optimization/OptimizationAlgorithm'

export default function GradientDescentPage() {
  return (
    <LessonPage
      config={GRADIENT_DESCENT_CONFIG}
      primaryMethod="gradient_descent"
      renderVisualization={() => <OptimizationVisualization method="gradient_descent" />}
      renderAnimation={() => <OptimizationAnimation method="gradient_descent" />}
      renderAlgorithm={() => <OptimizationAlgorithm method="gradient_descent" />}
    />
  )
}
