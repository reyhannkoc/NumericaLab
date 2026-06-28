import ModuleOverview from '@components/educational/ModuleOverview'
import { MODULE_DEFINITIONS } from '@/config/modules'

const mod = MODULE_DEFINITIONS.find((m) => m.id === 'linear-systems')!

export default function LinearSystemsPage() {
  return (
    <ModuleOverview
      module={mod}
      introText="Solving Ax = b is at the heart of virtually every engineering simulation.
                 This module covers direct elimination methods and iterative solvers, showing
                 how matrix structure governs which approach is most efficient."
      whatYouWillLearn={[
        'Gaussian elimination with partial pivoting — the workhorse direct solver',
        'Back substitution and the role of the upper triangular form',
        'Jacobi and Gauss–Seidel iterative methods for large sparse systems',
        'Condition number, ill-conditioning, and numerical stability',
        'When to prefer direct vs. iterative methods',
        'Applications in structural FEM, circuit analysis, and 3D graphics',
      ]}
    />
  )
}
