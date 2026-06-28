import ModuleOverview from '@components/educational/ModuleOverview'
import { MODULE_DEFINITIONS } from '@/config/modules'

const mod = MODULE_DEFINITIONS.find((m) => m.id === 'optimization')!

export default function OptimizationPage() {
  return (
    <ModuleOverview
      module={mod}
      introText="Optimization finds function minima or maxima — the goal of everything from training
                 machine learning models to designing fuel-efficient aircraft. This module covers
                 derivative-free and gradient-based single-variable optimization methods."
      whatYouWillLearn={[
        'Golden section search: bracket and shrink without needing derivatives',
        'Gradient descent: follow the negative gradient with a learning rate',
        "Newton's method for optimization: using second derivatives for faster convergence",
        'Convergence criteria and stopping conditions',
        'The role of learning rate and step size on convergence vs. divergence',
        'Applications in ML parameter tuning, engineering design, and operations research',
      ]}
      prerequisites={['Differentiation']}
    />
  )
}
