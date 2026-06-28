import ModuleOverview from '@components/educational/ModuleOverview'
import { MODULE_DEFINITIONS } from '@/config/modules'

const mod = MODULE_DEFINITIONS.find((m) => m.id === 'lu-decomposition')!

export default function LUDecompositionPage() {
  return (
    <ModuleOverview
      module={mod}
      introText="LU decomposition factors a matrix A into a lower-triangular L and upper-triangular U,
                 enabling multiple right-hand sides to be solved efficiently with two triangular substitutions.
                 It is the foundation of most production-grade linear algebra libraries."
      whatYouWillLearn={[
        'How LU decomposition works and why it is faster than re-running Gaussian elimination',
        'Partial pivoting via permutation matrix P: A = PLU',
        'Forward and backward substitution on triangular systems',
        'Cholesky decomposition for symmetric positive-definite matrices',
        'Computing the matrix determinant from the diagonal of U',
        'Applications in robotics kinematics, FEM simulation, and financial portfolio optimization',
      ]}
      prerequisites={['Linear Systems']}
    />
  )
}
