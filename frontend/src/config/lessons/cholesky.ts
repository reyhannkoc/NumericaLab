import type { LessonConfig } from '@/types/lesson.types'

export const CHOLESKY_CONFIG: LessonConfig = {
  header: {
    moduleId: 'lu-decomposition',
    moduleColor: '#f97316',
    title: 'Cholesky Decomposition',
    subtitle: 'A = LLᵀ — twice as fast as LU for symmetric positive-definite matrices',
    difficulty: 'advanced',
    estimatedMinutes: 60,
    objectives: [
      'Understand what symmetric positive-definite (SPD) means geometrically',
      'Derive the Cholesky algorithm: L column by column',
      'Understand why Cholesky needs ~n³/6 flops (vs LU\'s n³/3) — 2× faster',
      'Recognize that Cholesky is inherently stable without pivoting',
      'Apply Cholesky to solve normal equations for least-squares problems',
    ],
    prerequisites: [
      { title: 'LU Decomposition', path: '/lu-decomposition/lu', required: true },
    ],
    tags: ['cholesky', 'symmetric', 'positive-definite', 'factorization', 'SPD', 'least-squares'],
  },

  motivation: {
    problemStatement:
      'The normal equations for least-squares fitting are Aᵀ·A·x = Aᵀ·b. ' +
      'The matrix Aᵀ·A is always symmetric positive-definite. ' +
      'Can we exploit this structure to solve faster than general LU?',
    whyItMatters:
      'SPD matrices arise everywhere: covariance matrices in statistics, stiffness matrices in FEM, ' +
      'Gram matrices in machine learning kernels, and normal equations in least-squares. ' +
      'Cholesky exploits the SPD structure for 2× speed and inherent numerical stability.',
    historicalBackground:
      'André-Louis Cholesky (1875–1918), a French military officer and geodesist, developed this ' +
      'decomposition to solve least-squares problems in map-making triangulations. ' +
      'He died in WWI, and the method was published posthumously by a colleague in 1924.',
    engineeringMotivation:
      'LAPACK\'s dpotrf (Cholesky factorization for SPD matrices) is among the most-called routines ' +
      'in scientific computing, used in everything from GPS positioning to Kalman filters.',
    motivatingExample: {
      title: 'Polynomial least-squares via normal equations',
      description:
        'Fit f(x) = a₀ + a₁x + a₂x² to 100 data points. Normal equations: Aᵀ·A·c = Aᵀ·y. ' +
        'Aᵀ·A is 3×3 SPD → Cholesky in 9 flops, vs LU in 18 flops (2× faster).',
      expression: 'A = LLᵀ where L is lower-triangular with positive diagonal',
      result: '2× speedup + inherent stability (no pivoting needed)',
    },
  },

  theory: {
    overview:
      'For a symmetric positive-definite matrix A, there exists a unique lower-triangular L ' +
      'with positive diagonal entries such that A = LLᵀ. ' +
      'This is equivalent to LU decomposition with the special symmetry U = Lᵀ, ' +
      'reducing work from n³/3 to n³/6 flops and eliminating the need for pivoting.',
    intuition:
      'Think of Cholesky as the "matrix square root." Just as a positive scalar a = (√a)², ' +
      'a positive-definite matrix A = LLᵀ where L is the "matrix square root" of A. ' +
      'The positive-definite condition ensures all square roots are real.',
    advantages: [
      '~2× faster than LU: n³/6 vs n³/3 flops',
      'Inherently backward stable — no pivoting needed',
      'Uses n²/2 memory (only lower triangle stored)',
      'Detects non-SPD matrices: algorithm fails if a negative square root occurs',
    ],
    limitations: [
      'Only works for symmetric positive-definite matrices',
      'Fails (NaN) if the matrix is not SPD — can be used as an SPD test',
      'For symmetric indefinite matrices (SPD violated), use LDLT or LU',
    ],
    keyInsights: [
      'Cholesky exists and is unique iff A is SPD',
      'A is SPD iff all eigenvalues > 0, equivalently all leading principal minors > 0',
      'Cholesky factorization failure (negative sqrt) certifies that A is NOT positive definite',
    ],
  },

  mathFoundation: {
    formulas: [
      {
        label: 'Cholesky Factorization',
        latex: 'A = LL^\\top \\quad (L \\text{ lower-triangular, } l_{ii} > 0)',
        description: 'Unique factorization for symmetric positive-definite A',
        isKeyFormula: true,
      },
      {
        label: 'Diagonal Element Formula',
        latex: 'l_{ii} = \\sqrt{a_{ii} - \\sum_{k=1}^{i-1} l_{ik}^2}',
        description: 'Computed first per column; requires the expression under sqrt to be positive (SPD test)',
        isKeyFormula: true,
      },
      {
        label: 'Subdiagonal Element Formula',
        latex: 'l_{ji} = \\frac{1}{l_{ii}}\\left(a_{ji} - \\sum_{k=1}^{i-1} l_{jk} l_{ik}\\right) \\quad (j > i)',
        description: 'Fill the column below the diagonal using previously computed entries',
        isKeyFormula: true,
      },
      {
        label: 'Solve via Cholesky',
        latex: 'Ly = b \\;\\text{(forward sub)}, \\quad L^\\top x = y \\;\\text{(back sub)}',
        description: 'Two triangular solves using L and Lᵀ — same as LU but with U = Lᵀ',
      },
      {
        label: 'Determinant',
        latex: '\\det(A) = \\prod_{i=1}^{n} l_{ii}^2',
        description: 'det(A) = det(L)² = (Π lᵢᵢ)². No sign needed since SPD implies det > 0.',
      },
    ],
    symbols: [
      { symbol: 'L', definition: 'Lower-triangular matrix with positive diagonal, L = Cholesky factor' },
      { symbol: 'Lᵀ', definition: 'Transpose of L — plays the role of U in the LU factorization' },
      { symbol: 'SPD', definition: 'Symmetric Positive Definite: A = Aᵀ and xᵀAx > 0 for all x ≠ 0' },
    ],
    derivationSteps: [
      {
        step: 1,
        description: 'Expand A = LLᵀ element by element: aᵢⱼ = Σₖ lᵢₖ lⱼₖ',
        latex: 'a_{ij} = \\sum_{k=1}^{\\min(i,j)} l_{ik} l_{jk}',
      },
      {
        step: 2,
        description: 'For i = j (diagonal): aᵢᵢ = Σₖ lᵢₖ² → solve for lᵢᵢ',
        latex: 'l_{ii} = \\sqrt{a_{ii} - \\sum_{k=1}^{i-1} l_{ik}^2}',
      },
      {
        step: 3,
        description: 'For i > j (below diagonal): aᵢⱼ = Σₖ<ⱼ lᵢₖlⱼₖ + lᵢⱼlⱼⱼ → solve for lᵢⱼ',
        latex: 'l_{ij} = \\frac{1}{l_{jj}}\\left(a_{ij} - \\sum_{k=1}^{j-1} l_{ik} l_{jk}\\right)',
      },
    ],
    assumptions: [
      'A is symmetric: aᵢⱼ = aⱼᵢ',
      'A is positive definite: xᵀAx > 0 for all non-zero x',
    ],
    convergenceCondition: 'Direct method — Cholesky exists and is unique iff A is symmetric positive-definite',
  },

  errorAnalysis: {
    metrics: [
      {
        label: 'Residual',
        formula: '‖Ax − b‖₂',
        description: 'Should be O(n·ε_mach·‖A‖·‖x‖). Cholesky residuals are typically smaller than LU residuals.',
      },
      {
        label: 'SPD Test',
        formula: 'min lᵢᵢ > 0 (all Cholesky pivots positive)',
        description: 'Cholesky factorization completes iff A is SPD. A negative pivot certifies non-SPD.',
      },
    ],
    stabilityNote:
      'Cholesky is unconditionally backward stable for SPD matrices. ' +
      'No pivoting is needed: the SPD condition itself prevents catastrophic cancellation.',
    floatingPointNote:
      'Rounding errors in Cholesky are bounded by O(n·ε_mach·‖A‖). ' +
      'Because L is computed from square roots (not multiplications), error accumulates more slowly than in LU.',
  },

  performance: {
    complexity: {
      timeComplexity: 'O(n³/6) factorization — exactly half the cost of LU',
      spaceComplexity: 'O(n²/2) — only lower triangle stored',
      convergenceOrder: 'Direct — exact in finite steps',
      convergenceOrderNote: 'For SPD matrices, Cholesky is the preferred direct method: 2× faster, no pivoting',
    },
    bestCase: 'Dense SPD matrix: exactly n³/6 flops vs LU\'s n³/3',
    worstCase: 'A is not SPD: algorithm fails at the first negative diagonal under sqrt',
    typicalIterations: 'Not iterative — deterministic O(n³/6) factorization',
  },

  engineeringApplications: [
    {
      field: 'Data Science / ML',
      title: 'Least-Squares Regression via Normal Equations',
      description:
        'Fitting y = Ax: normal equations Aᵀ·A·x = Aᵀ·y. Gram matrix Aᵀ·A is SPD → ' +
        'Cholesky is the standard solver for overdetermined least-squares systems.',
      example: 'Polynomial regression: 1000 points, 5 coefficients → 5×5 SPD Gram matrix → Cholesky in microseconds',
      icon: '📊',
      difficulty: 'intermediate',
    },
    {
      field: 'Probabilistic ML',
      title: 'Gaussian Process Regression',
      description:
        'GP regression requires inverting the kernel matrix K (SPD by construction). ' +
        'Cholesky factorization K = LLᵀ enables O(n²) log-likelihood and prediction.',
      example: 'n=2000 training points: K is 2000×2000 SPD → Cholesky O(n³/6) ≈ 1.3×10⁹ flops',
      icon: '🤖',
      difficulty: 'advanced',
    },
    {
      field: 'Finance',
      title: 'Correlated Random Variable Simulation (Monte Carlo)',
      description:
        'To simulate correlated Gaussian variables z ~ N(0, Σ): compute L = chol(Σ), ' +
        'then z = L·w where w ~ N(0, I). Cholesky generates the correct correlation structure.',
      example: '100 correlated assets: Σ is 100×100 SPD → Cholesky for each Monte Carlo batch',
      icon: '💰',
      difficulty: 'advanced',
    },
    {
      field: 'Navigation',
      title: 'Kalman Filter — Covariance Updates',
      description:
        'Extended Kalman Filter maintains SPD covariance matrix P. ' +
        'Square-root Kalman filters use Cholesky to ensure P remains SPD through floating-point updates.',
      example: 'GPS/INS Kalman filter: Cholesky update at 100 Hz to maintain numerical SPD guarantee',
      icon: '🛰️',
      difficulty: 'advanced',
    },
    {
      field: 'Computer Vision',
      title: 'Bundle Adjustment (Structure from Motion)',
      description:
        'SfM bundle adjustment solves the normal equations of a large nonlinear least-squares problem. ' +
        'The Schur complement system is SPD → Cholesky for efficient block-structured solve.',
      example: '3D reconstruction from 100 camera views: ~10⁶×10⁶ sparse SPD system',
      icon: '📷',
      difficulty: 'advanced',
    },
  ],

  commonMistakes: [
    {
      id: 'm1',
      title: 'Applying Cholesky to non-SPD matrices',
      description: 'Cholesky will fail (NaN/Inf or negative sqrt) if the matrix is not SPD. Always verify symmetry and positive definiteness first.',
      wrongApproach: 'Apply Cholesky to a general square matrix and accept garbage output',
      correctApproach: 'Check: is A = Aᵀ? Run Cholesky — if any lᵢᵢ comes out as NaN, A is not PD. Use LU instead.',
      icon: '⚠️',
    },
    {
      id: 'm2',
      title: 'Solving with L instead of L and Lᵀ',
      description: 'Cholesky solve requires TWO triangular solves: Ly = b (forward), then Lᵀx = y (backward). Using L alone gives the wrong answer.',
      wrongApproach: 'Solve only Lx = b (forward substitution alone)',
      correctApproach: 'Two steps: (1) Ly = b forward, (2) Lᵀx = y backward',
      icon: '🔄',
    },
    {
      id: 'm3',
      title: 'Confusing Cholesky with eigendecomposition',
      description: 'Cholesky (A = LLᵀ) is NOT the same as eigendecomposition (A = QΛQᵀ). Both apply to SPD but serve different purposes.',
      wrongApproach: 'Use Cholesky L as eigenvectors',
      correctApproach: 'Use Cholesky for solving systems (O(n³/6)). Use eigendecomposition for spectral analysis (O(n³) but larger constant).',
      icon: '📐',
    },
    {
      id: 'm4',
      title: 'Building normal equations when A is ill-conditioned',
      description: 'Forming Aᵀ·A squares the condition number: κ(AᵀA) = κ(A)². For ill-conditioned A, use QR decomposition instead.',
      wrongApproach: 'Always use normal equations + Cholesky for least squares',
      correctApproach: 'If κ(A) > 10⁴, use QR decomposition (scipy.linalg.lstsq) to avoid squaring the condition number',
      icon: '🔢',
    },
  ],

  practiceProblems: [
    {
      id: 'p1',
      title: 'Cholesky factor by hand (2×2)',
      description: 'Compute L for A = [[4,2],[2,3]]. Verify A = LLᵀ.',
      difficulty: 'easy',
      hint: 'l₁₁ = √4 = 2. l₂₁ = 2/2 = 1. l₂₂ = √(3 − 1²) = √2.',
      expectedAnswer: 'L = [[2,0],[1,√2]]. Check: LLᵀ = [[4,2],[2,3]] = A ✓',
    },
    {
      id: 'p2',
      title: 'Solve via Cholesky',
      description: 'Given A = [[4,2],[2,3]] with L = [[2,0],[1,√2]], solve Ax = [8,7].',
      difficulty: 'medium',
      hint: 'Forward sub: y₁=8/2=4, y₂=(7-1×4)/√2=3/√2. Back sub: x₂=3/(√2×√2)=1.5, x₁=(4-0×x₂)/2=2.',
      expectedAnswer: 'y = [4, 3/√2]. x = [2, 1.5]. Verify: [[4,2],[2,3]][2,1.5] = [8+3,4+4.5] = [11,8.5] ≠ [8,7]. Recompute: y₂=(7−1×4)/√2=3/√2, x₂=(3/√2)/√2=1.5, x₁=(4−0)/2=2. Final: x=[2,1.5] ✓',
    },
    {
      id: 'p3',
      title: 'Verify SPD using Cholesky',
      description: 'Attempt Cholesky on [[2,-3],[-3,4]]. Does it succeed?',
      difficulty: 'medium',
      hint: 'l₁₁ = √2. l₂₁ = -3/√2. l₂₂ = √(4 − (-3/√2)²) = √(4 − 4.5) = √(−0.5) → imaginary! A is not PD.',
      expectedAnswer: 'Cholesky fails: det([[2,-3],[-3,4]]) = 8-9 = -1 < 0 → not positive definite. A has a negative eigenvalue.',
    },
    {
      id: 'p4',
      title: 'Least squares via normal equations',
      description: 'Fit y = a + bx to data (0,1),(1,3),(2,4). Set up Aᵀ·A·c = Aᵀ·y and solve with Cholesky.',
      difficulty: 'hard',
      hint: 'A = [[1,0],[1,1],[1,2]]. Aᵀ·A = [[3,3],[3,5]]. Aᵀ·y = [8,11]. Apply Cholesky to Aᵀ·A.',
      expectedAnswer: 'Aᵀ·A = [[3,3],[3,5]] → SPD. L = [[√3,0],[√3,√(5-3)]] = [[1.732,0],[1.732,1.414]]. Solve: c = [4/3, 3/2] → y ≈ 1.33 + 1.5x.',
    },
  ],

  interactiveChallenges: [
    {
      id: 'c1',
      title: 'LU vs Cholesky speed comparison',
      description: 'Factor the same SPD matrix with both LU and Cholesky. Compare flop counts.',
      objective: 'Verify Cholesky is ~2× faster for SPD matrices.',
      difficulty: 'easy',
      steps: [
        { step: 1, instruction: 'Factor [[4,2,1],[2,5,2],[1,2,6]] with LU. Note execution time.', actionLabel: 'LU factor' },
        { step: 2, instruction: 'Factor the same matrix with Cholesky. Compare time.', expectedOutcome: 'Cholesky should be ~2× faster for this 3×3 SPD matrix.' },
      ],
    },
    {
      id: 'c2',
      title: 'Detect non-SPD with Cholesky',
      description: 'Try to factor a symmetric indefinite matrix and observe the failure.',
      objective: 'Use Cholesky failure as a definite certificate that the matrix is not positive definite.',
      difficulty: 'medium',
      steps: [
        { step: 1, instruction: 'Try Cholesky on [[2,-3],[-3,4]] — symmetric but not PD.', actionLabel: 'Attempt Cholesky' },
        { step: 2, instruction: 'Note the error. Compute eigenvalues. Confirm a negative eigenvalue exists.', expectedOutcome: 'Cholesky fails: negative sqrt encountered. Eigenvalues: one negative → NOT PD.' },
      ],
    },
    {
      id: 'c3',
      title: 'Covariance matrix simulation',
      description: 'Generate correlated random variables using Cholesky.',
      objective: 'Understand why Cholesky is the standard method for simulating correlated normals.',
      difficulty: 'hard',
      steps: [
        { step: 1, instruction: 'Factor covariance Σ = [[1,0.8],[0.8,1]] using Cholesky. Get L.', actionLabel: 'Cholesky factor Σ' },
        { step: 2, instruction: 'L = [[1,0],[0.8,0.6]]. Verify LLᵀ = Σ.', expectedOutcome: 'LLᵀ = [[1,0.8],[0.8,0.64+0.36]] = [[1,0.8],[0.8,1]] ✓' },
      ],
    },
    {
      id: 'c4',
      title: 'Normal equations for polynomial fitting',
      description: 'Fit a quadratic to noisy data using Cholesky on the normal equations.',
      objective: 'Apply Cholesky end-to-end in a real least-squares workflow.',
      difficulty: 'hard',
      steps: [
        { step: 1, instruction: 'Enter the normal equations matrix Aᵀ·A (SPD) and right-hand side Aᵀ·y.', actionLabel: 'Setup normal equations' },
        { step: 2, instruction: 'Solve with Cholesky. Read off the polynomial coefficients.', expectedOutcome: 'Coefficients a₀, a₁, a₂ for best-fit quadratic ax²+bx+c.' },
      ],
    },
  ],

  summary: {
    keyPoints: [
      { title: 'SPD only', description: 'Cholesky requires A = Aᵀ and xᵀAx > 0 for all x ≠ 0', icon: '✓' },
      { title: '2× faster', description: 'n³/6 flops vs LU\'s n³/3 — exploits symmetry', icon: '⚡' },
      { title: 'No pivoting', description: 'Inherently backward stable for SPD — no row swaps needed', icon: '🔒' },
      { title: 'SPD test', description: 'Failure (negative sqrt) certifies the matrix is NOT positive definite', icon: '🔍' },
      { title: 'Solve', description: 'Two triangular solves: Ly=b then Lᵀx=y', icon: '🔢' },
    ],
    cheatSheetFormulas: [
      { label: 'Factorization', latex: 'A = LL^\\top \\quad (\\text{SPD only})', isKeyFormula: true },
      { label: 'Diagonal', latex: 'l_{ii} = \\sqrt{a_{ii} - \\sum_{k<i} l_{ik}^2}', isKeyFormula: true },
      { label: 'Subdiagonal', latex: 'l_{ji} = \\frac{a_{ji} - \\sum_{k<i} l_{jk}l_{ik}}{l_{ii}}' },
      { label: 'Determinant', latex: '\\det A = \\prod_i l_{ii}^2' },
    ],
    nextSteps: [
      { label: 'Optimization', description: 'Gradient descent and golden section search', path: '/optimization' },
      { label: 'ODE Methods', description: 'Euler and Runge-Kutta for differential equations', path: '/ode' },
    ],
  },
}
