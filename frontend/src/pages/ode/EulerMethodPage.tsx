import LessonPage from '@components/lesson/LessonPage'
import { EULER_CONFIG } from '@/config/lessons/euler'
import ODEVisualization from '@components/ode/ODEVisualization'
import ODEAnimation from '@components/ode/ODEAnimation'
import ODEAlgorithm from '@components/ode/ODEAlgorithm'

export default function EulerMethodPage() {
  return (
    <LessonPage
      config={EULER_CONFIG}
      primaryMethod="euler"
      renderVisualization={() => <ODEVisualization method="euler" />}
      renderAnimation={() => <ODEAnimation method="euler" />}
      renderAlgorithm={() => <ODEAlgorithm method="euler" />}
    />
  )
}
