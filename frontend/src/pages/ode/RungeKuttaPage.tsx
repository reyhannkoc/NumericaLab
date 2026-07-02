import LessonPage from '@components/lesson/LessonPage'
import { RUNGE_KUTTA_CONFIG } from '@/config/lessons/rungeKutta'
import ODEVisualization from '@components/ode/ODEVisualization'
import ODEAnimation from '@components/ode/ODEAnimation'
import ODEAlgorithm from '@components/ode/ODEAlgorithm'

export default function RungeKuttaPage() {
  return (
    <LessonPage
      config={RUNGE_KUTTA_CONFIG}
      primaryMethod="runge_kutta_4"
      renderVisualization={() => <ODEVisualization method="runge_kutta_4" />}
      renderAnimation={() => <ODEAnimation method="runge_kutta_4" />}
      renderAlgorithm={() => <ODEAlgorithm method="runge_kutta_4" />}
    />
  )
}
