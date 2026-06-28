import ModuleOverview from '@components/educational/ModuleOverview'
import { MODULE_DEFINITIONS } from '@/config/modules'

const mod = MODULE_DEFINITIONS.find((m) => m.id === 'ode')!

export default function ODEPage() {
  return (
    <ModuleOverview
      module={mod}
      introText="Ordinary differential equations model dynamic systems — from pendulum motion to
                 population growth to electrical circuits. This module covers single-step and
                 multi-step ODE solvers, analyzing their accuracy and stability."
      whatYouWillLearn={[
        "Euler's method: the simplest explicit ODE solver and its global error O(h)",
        'Heun and midpoint methods: predictor-corrector improvements',
        'Classic Runge–Kutta 4: the industry standard for non-stiff equations',
        'Step size control and adaptive methods',
        'Stability analysis and stiff equations',
        'Applications in simulating springs, circuits, chemical reactors, and epidemics',
      ]}
      prerequisites={['Integration']}
    />
  )
}
