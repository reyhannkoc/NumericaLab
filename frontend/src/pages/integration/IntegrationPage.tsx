import ModuleOverview from '@components/educational/ModuleOverview'
import { MODULE_DEFINITIONS } from '@/config/modules'

const mod = MODULE_DEFINITIONS.find((m) => m.id === 'integration')!

export default function IntegrationPage() {
  return (
    <ModuleOverview
      module={mod}
      introText="Numerical integration (quadrature) computes definite integrals when no closed-form
                 antiderivative exists. This module builds from simple Riemann sums to high-accuracy
                 Gaussian quadrature, showing how each method trades simplicity for precision."
      whatYouWillLearn={[
        'Riemann sums and why they are the conceptual foundation',
        'Trapezoidal rule: derivation, error term, composite formula',
        "Simpson's rule: parabolic fitting and O(h⁴) accuracy",
        'Gaussian quadrature: optimal nodes and weights for exact polynomial integration',
        'Romberg integration: combining trapezoidal estimates for higher order',
        'Applications in computing work done, signal energy, and probability distributions',
      ]}
    />
  )
}
