import ModuleOverview from '@components/educational/ModuleOverview'
import { MODULE_DEFINITIONS } from '@/config/modules'

const mod = MODULE_DEFINITIONS.find((m) => m.id === 'root-finding')!

export default function RootFindingPage() {
  return (
    <ModuleOverview
      module={mod}
      introText="Root finding solves f(x) = 0 — one of the most common tasks in engineering and science.
                 This module covers four foundational methods: from the guaranteed but slow Bisection,
                 to the lightning-fast Newton–Raphson with quadratic convergence."
      whatYouWillLearn={[
        'What it means to find a root and when it arises in practice',
        'Bracketing methods (Bisection) and open methods (Newton, Secant)',
        'Convergence rates: linear, superlinear, quadratic',
        'How to measure and bound the error at each iteration',
        'When each method is appropriate and when it fails',
        'Applying root finding to electrical circuits, mechanical systems, and finance',
      ]}
    />
  )
}
