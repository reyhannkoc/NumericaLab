import ModuleOverview from '@components/educational/ModuleOverview'
import { MODULE_DEFINITIONS } from '@/config/modules'

const mod = MODULE_DEFINITIONS.find((m) => m.id === 'interpolation')!

export default function InterpolationPage() {
  return (
    <ModuleOverview
      module={mod}
      introText="Interpolation constructs a smooth curve passing through a set of known data points,
                 allowing you to estimate values in between. It underpins computer graphics, signal
                 processing, and any system that must work with sampled data."
      whatYouWillLearn={[
        'The difference between interpolation and curve fitting (regression)',
        'Lagrange polynomials and their basis functions',
        "Newton's divided differences and how to compute them incrementally",
        'Cubic splines: why they are smoother and when to prefer them',
        'Runge\'s phenomenon — why high-degree polynomials can oscillate',
        'Applications in sensor fusion, animation, and image processing',
      ]}
    />
  )
}
