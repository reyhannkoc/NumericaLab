import ModuleOverview from '@components/educational/ModuleOverview'
import { MODULE_DEFINITIONS } from '@/config/modules'

const mod = MODULE_DEFINITIONS.find((m) => m.id === 'differentiation')!

export default function DifferentiationPage() {
  return (
    <ModuleOverview
      module={mod}
      introText="When an analytic derivative is hard or impossible to compute, numerical differentiation
                 approximates it using only function values. This module explores finite difference
                 formulas, their order of accuracy, and Richardson extrapolation for higher precision."
      whatYouWillLearn={[
        'Forward, backward, and central difference formulas and their derivations',
        'Order of accuracy and truncation error analysis using Taylor series',
        'How step size h affects accuracy: truncation vs. round-off tradeoff',
        'Richardson extrapolation to achieve O(h⁴) accuracy',
        'Higher-order derivatives and second-order differences',
        'Applications in control systems, optimization, and image edge detection',
      ]}
    />
  )
}
