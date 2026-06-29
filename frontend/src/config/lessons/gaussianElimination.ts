import type { LessonConfig } from '@/types/lesson.types'

export const GAUSSIAN_ELIMINATION_CONFIG: LessonConfig = {
  header: {
    moduleId: 'linear-systems',
    moduleColor: '#14b8a6',
    title: 'Gaussian Elimination',
    subtitle: 'Direct solver for Ax = b by row reduction to upper triangular form',
    difficulty: 'intermediate',
    estimatedMinutes: 60,
    objectives: [
      'Understand forward elimination and back substitution steps',
      'Apply partial pivoting to improve numerical stability',
      'Analyze when Gaussian elimination fails (singular/near-singular matrices)',
      'Compute determinants and matrix rank as byproducts',
      'Compare direct methods with iterative methods for large systems',
    ],
    prerequisites: [],
    tags: ['linear algebra', 'direct solver', 'row reduction', 'partial pivoting', 'O(n³)'],
  },

  motivation: {
    problemStatement:
      'A truss bridge has 20 joints. Equilibrium at each joint gives 2 equations in the 40 unknown member forces: a 40×40 linear system Ax=b. How do you solve it efficiently?',
    whyItMatters:
      'Linear systems Ax=b appear in every branch of science and engineering: finite element analysis, ' +
      'circuit simulation, least-squares fitting, fluid dynamics, quantum chemistry. ' +
      'Gaussian elimination is the foundation of all direct linear solvers.',
    historicalBackground:
      'The method dates to ancient China (Nine Chapters on the Mathematical Art, ~200 BC) but was ' +
      'formalized by Gauss in his theory of least squares (~1800). LU decomposition — the modern ' +
      'implementation — powers LAPACK, MATLAB\'s backslash operator, and NumPy\'s linalg.solve.',
    engineeringMotivation:
      'Every finite element model generates a global stiffness matrix K and load vector F. ' +
      'Solving Ku=F for displacements u is the core computation of structural, thermal, and fluid FEA. ' +
      'For small systems (n < 10³), Gaussian elimination with partial pivoting is the standard approach.',
    motivatingExample: {
      title: '2×2 system: electrical circuit',
      description:
        '2I₁ + I₂ = 5, I₁ + 3I₂ = 7. Forward elimination: subtract (1/2)×Row1 from Row2 → [2,1|5; 0,2.5|4.5]. Back substitution: I₂=1.8, I₁=1.6.',
      expression: 'Ax = b → U·x = c (upper triangular) → back-substitute',
      result: 'O(n³/3) operations for forward elimination + O(n²/2) for back substitution',
    },
  },

  theory: {
    overview:
      'Gaussian elimination transforms the augmented matrix [A|b] into an equivalent upper triangular ' +
      'system [U|c] via elementary row operations (multiply, add, swap). Back substitution then solves ' +
      'xₙ = cₙ/uₙₙ, xₙ₋₁ = (cₙ₋₁ − uₙ₋₁,ₙ xₙ)/uₙ₋₁,ₙ₋₁, etc.',
    intuition:
      'Think of the equations as a staircase. Each step (elimination) zeros out one column below the ' +
      '"stair edge" (pivot). After n−1 steps, the staircase is complete — one unknown per equation. ' +
      'You then walk back down the staircase, solving each equation in one step.',
    advantages: [
      'Exact answer in a fixed number of operations (O(n³))',
      'Works on any non-singular square system without initial guesses',
      'LU factorization: A=LU allows efficient resolution for multiple right-hand sides',
      'Reveals rank, determinant, and singular behavior as byproducts',
    ],
    limitations: [
      'O(n³) cost makes it impractical for n > 10⁴–10⁵ (use iterative methods)',
      'Fails (division by zero) without pivoting when diagonal entries become zero',
      'Dense matrix operations — not efficient for sparse systems',
      'Round-off error accumulates over n steps — partial pivoting mitigates but does not eliminate it',
    ],
    keyInsights: [
      'Partial pivoting: swap rows so the largest |pivot| is always used — prevents catastrophic cancellation',
      'The LU factorization stores the elimination multipliers in L; solving LUx=b costs O(n²)',
      'The determinant = product of pivots × (−1)^(number of row swaps)',
    ],
  },

  mathFoundation: {
    formulas: [
      {
        label: 'Linear System',
        latex: 'A\\mathbf{x} = \\mathbf{b},\\quad A \\in \\mathbb{R}^{n\\times n},\\ \\mathbf{x},\\mathbf{b}\\in\\mathbb{R}^n',
        description: 'n equations, n unknowns',
        isKeyFormula: true,
      },
      {
        label: 'Elimination Multiplier',
        latex: 'm_{ik} = \\frac{a_{ik}^{(k)}}{a_{kk}^{(k)}},\\quad i > k',
        description: 'Multiplier to zero out entry (i,k) using pivot (k,k)',
        isKeyFormula: true,
      },
      {
        label: 'Row Operation',
        latex: 'R_i \\leftarrow R_i - m_{ik}\\, R_k',
        description: 'Subtracts mᵢₖ × Row k from Row i to zero element (i,k)',
      },
      {
        label: 'Back Substitution',
        latex: 'x_i = \\frac{b_i - \\displaystyle\\sum_{j=i+1}^{n} u_{ij}x_j}{u_{ii}},\\quad i = n, n-1, \\ldots, 1',
        description: 'Solve from bottom up after forward elimination',
        isKeyFormula: true,
      },
      {
        label: 'Computational Cost',
        latex: '\\frac{n^3}{3} + O(n^2)\\text{ flops (forward)} + \\frac{n^2}{2} + O(n)\\text{ (back sub)}',
        description: 'Total ~n³/3 floating-point operations',
      },
    ],
    symbols: [
      { symbol: 'A', definition: 'n×n coefficient matrix' },
      { symbol: 'b', definition: 'Right-hand side vector (n×1)' },
      { symbol: 'x', definition: 'Solution vector (n×1) — unknowns to find' },
      { symbol: 'mᵢₖ', definition: 'Elimination multiplier for row i using pivot k' },
      { symbol: 'U', definition: 'Upper triangular form after forward elimination' },
    ],
    derivationSteps: [
      {
        step: 1,
        description: 'Form augmented matrix [A|b]',
        latex: '[A|b] = \\begin{bmatrix} a_{11} & a_{12} & \\cdots & a_{1n} & b_1 \\\\ \\vdots & & & & \\vdots \\\\ a_{n1} & & & a_{nn} & b_n \\end{bmatrix}',
      },
      {
        step: 2,
        description: 'For each pivot column k, zero out entries below the diagonal',
        latex: 'R_i \\leftarrow R_i - \\frac{a_{ik}}{a_{kk}} R_k,\\quad i = k+1, \\ldots, n',
      },
      {
        step: 3,
        description: 'After n−1 sweeps, [A|b] → [U|c] upper triangular',
        latex: 'U = \\begin{bmatrix} u_{11} & u_{12} & \\cdots \\\\ 0 & u_{22} & \\cdots \\\\ & & \\ddots \\\\ 0 & \\cdots & u_{nn} \\end{bmatrix}',
      },
      {
        step: 4,
        description: 'Back substitute from row n to row 1',
        latex: 'x_n = c_n/u_{nn},\\quad x_{n-1} = (c_{n-1}-u_{n-1,n}x_n)/u_{n-1,n-1},\\ldots',
      },
    ],
    assumptions: [
      'A is square (n×n) and non-singular (det A ≠ 0)',
      'With partial pivoting: A can be any non-singular matrix',
    ],
    convergenceCondition: 'Direct method — always gives exact solution (up to floating-point rounding) in O(n³) steps',
  },

  errorAnalysis: {
    metrics: [
      {
        label: 'Residual',
        formula: '‖Ax* − b‖',
        description: 'How well the computed solution satisfies the original equation. Should be close to machine epsilon times ‖A‖·‖x‖.',
      },
      {
        label: 'Relative Error',
        formula: '‖x* − x_true‖ / ‖x_true‖',
        description: 'Actual solution error. Bounded by κ(A) × (relative residual).',
      },
      {
        label: 'Condition Number',
        formula: 'κ(A) = ‖A‖·‖A⁻¹‖',
        description: 'Measures how sensitive x is to perturbations in b. If κ(A) = 10⁶, expect ~6 digits lost.',
      },
    ],
    stabilityNote:
      'Partial pivoting ensures growth factors stay bounded in practice. ' +
      'Without pivoting, tiny pivots amplify round-off errors — potentially making the solution useless.',
    floatingPointNote:
      'For ill-conditioned systems (large κ(A)), the exact algorithm gives wrong answers due to round-off. ' +
      'No amount of pivoting fixes a truly ill-conditioned system — the problem itself is ill-posed.',
  },

  performance: {
    complexity: {
      timeComplexity: 'O(n³)',
      spaceComplexity: 'O(n²)',
      convergenceOrder: 'Direct (finite steps)',
      convergenceOrderNote: 'Gives exact answer in n³/3 + n²/2 operations — not iterative',
    },
    bestCase: 'Well-conditioned diagonal or triangular system (O(n²))',
    worstCase: 'Dense ill-conditioned matrix — round-off grows with κ(A)',
    typicalIterations: 'n=100: ~33,000 flops. n=1000: ~333 million flops. n=10,000: too slow (use sparse solvers)',
  },

  comparison: {
    methods: ['Gaussian Elim.', 'Gauss–Seidel', 'Jacobi'],
    criteria: ['Type', 'Cost per step', 'Total cost', 'Requires', 'Best for'],
    table: [
      {
        criterion: 'Type',
        'Gaussian Elim.': 'Direct',
        'Gauss–Seidel': 'Iterative',
        'Jacobi': 'Iterative',
      },
      {
        criterion: 'Cost per step',
        'Gaussian Elim.': 'O(n³) total',
        'Gauss–Seidel': 'O(n²) per iter',
        'Jacobi': 'O(n²) per iter',
      },
      {
        criterion: 'Total cost',
        'Gaussian Elim.': 'n³/3 flops (fixed)',
        'Gauss–Seidel': 'O(kn²) — k iters',
        'Jacobi': 'O(kn²) — k iters',
      },
      {
        criterion: 'Requires',
        'Gaussian Elim.': 'Non-singular A',
        'Gauss–Seidel': 'Diagonally dominant or SPD',
        'Jacobi': 'Strictly diagonally dominant',
      },
      {
        criterion: 'Best for',
        'Gaussian Elim.': 'Dense n < 10³, multiple RHS',
        'Gauss–Seidel': 'Large sparse systems, FEM',
        'Jacobi': 'Parallel architectures',
      },
    ],
    summary:
      'For small–medium dense systems (n < 1000), Gaussian elimination is unbeatable. ' +
      'For large sparse systems (FEM, PDE discretization), iterative methods like Gauss–Seidel or ' +
      'Conjugate Gradient are preferred.',
  },

  engineeringApplications: [
    {
      field: 'Structural Engineering',
      title: 'Static Truss Analysis',
      description:
        'Each pin joint in a truss gives 2 equilibrium equations (ΣFx=0, ΣFy=0). ' +
        'For a truss with 20 joints, the resulting 40×40 system is solved by Gaussian elimination.',
      example: '3-joint truss: 4 equations → 2×2 system solved in 2 elimination steps',
      icon: '🏗️',
      difficulty: 'intermediate',
    },
    {
      field: 'Electrical Engineering',
      title: 'Circuit Mesh Analysis (KVL)',
      description:
        'Kirchhoff\'s Voltage Law applied to mesh currents yields a dense linear system. ' +
        'A circuit with 10 loops generates a 10×10 system solved by Gaussian elimination.',
      example: '3-mesh circuit: [2,-1,0; -1,3,-1; 0,-1,2] × [I₁;I₂;I₃] = [V₁;0;V₂]',
      icon: '⚡',
      difficulty: 'introductory',
    },
    {
      field: 'Chemical Engineering',
      title: 'Steady-State CSTR Balance',
      description:
        'Multiple continuous stirred tank reactors in series with recycle streams give coupled molar ' +
        'balance equations. Each balance is one row in Ax=b where x is the species concentration vector.',
      example: '5-tank network → 5×5 linear system for steady-state concentrations',
      icon: '⚗️',
      difficulty: 'intermediate',
    },
    {
      field: 'Computer Graphics',
      title: 'Spline Control Point Fitting',
      description:
        'Fitting a cubic spline through n data points solves a tridiagonal linear system of size n×n. ' +
        'The special structure allows O(n) Thomas algorithm (a specialized Gaussian elimination).',
      example: '100 knots → 100×100 tridiagonal system → 100-point smooth spline',
      icon: '🎨',
      difficulty: 'intermediate',
    },
    {
      field: 'Thermodynamics',
      title: 'Finite Difference Heat Equation',
      description:
        'Discretizing the steady-state heat equation −k∇²T = Q on a grid gives a linear system. ' +
        'Each interior grid point is one equation; boundary conditions fill in the rest.',
      example: '10×10 grid → 100×100 sparse system → temperature field T(x,y)',
      icon: '🔥',
      difficulty: 'advanced',
    },
  ],

  commonMistakes: [
    {
      id: 'm1',
      title: 'Dividing by a zero or near-zero pivot',
      description:
        'Without pivoting, if the diagonal entry a_{kk}=0 at step k, elimination fails with division by zero. ' +
        'Near-zero pivots amplify round-off errors dramatically.',
      wrongApproach: 'Proceed with tiny pivot — result is wildly inaccurate',
      correctApproach: 'Partial pivoting: swap the current row with the one having the largest |a_{ik}| in column k',
      icon: '⚠️',
    },
    {
      id: 'm2',
      title: 'Forgetting to apply row operations to the right-hand side',
      description:
        'When eliminating column k, the same multiplier mᵢₖ must be applied to both the A and b parts of [A|b]. ' +
        'Updating A without updating b gives a wrong solution.',
      wrongApproach: 'Update A: a_{ij} -= mᵢₖ * a_{kj}, but forget b: b_i -= mᵢₖ * b_k',
      correctApproach: 'Always apply the same row operation to the augmented matrix [A|b] together',
      icon: '🎯',
    },
    {
      id: 'm3',
      title: 'Confusing the multiplier sign',
      description:
        'The operation is Rᵢ ← Rᵢ − mᵢₖRₖ (SUBTRACT). Using Rᵢ ← Rᵢ + mᵢₖRₖ will zero the wrong entry.',
      wrongApproach: 'R₂ ← R₂ + (a₂₁/a₁₁)R₁ — doubles the entry instead of zeroing it',
      correctApproach: 'R₂ ← R₂ − (a₂₁/a₁₁)R₁ — zeros entry (2,1)',
      icon: '➖',
    },
    {
      id: 'm4',
      title: 'Ignoring the condition number',
      description:
        'A residual ‖Ax-b‖ ≈ 10⁻¹⁵ does not mean x is accurate. If κ(A) = 10⁸, the solution error ' +
        'can be up to 10⁻⁷ even with a tiny residual.',
      wrongApproach: 'See residual ≈ 0 and declare the solution perfect',
      correctApproach: 'Always check κ(A). If κ(A) > 1/ε_mach, the system is effectively singular.',
      icon: '📊',
    },
  ],

  practiceProblems: [
    {
      id: 'p1',
      title: 'Solve 2×2 system by hand',
      description: 'Solve [2,1;1,3]x = [5;7] using Gaussian elimination. Show all row operations.',
      difficulty: 'easy',
      params: { matrix_a: [[2,1],[1,3]], vector_b: [5,7] },
      hint: 'Pivot on a₁₁=2. Multiplier m₂₁ = 1/2. Apply R₂ ← R₂ − (1/2)R₁.',
      expectedAnswer: 'After elimination: [2,1;0,2.5]x=[5;4.5]. x₂=1.8, x₁=(5−1.8)/2=1.6.',
    },
    {
      id: 'p2',
      title: 'Solve 3×3 system',
      description: 'Solve [2,−1,0;−1,2,−1;0,−1,2]x=[1;0;1]. This is the tridiagonal system from a 3-node 1D FEA.',
      difficulty: 'medium',
      params: { matrix_a: [[2,-1,0],[-1,2,-1],[0,-1,2]], vector_b: [1,0,1] },
      hint: 'Two steps of forward elimination. Note the tridiagonal structure.',
      expectedAnswer: 'x = [0.75, 0.5, 0.75]. Residual = ‖Ax − b‖ ≈ 0.',
    },
    {
      id: 'p3',
      title: 'Near-singular system: effect of pivoting',
      description: 'Compare results with and without partial pivoting for [0.001, 1; 1, 1]x=[1;2]. Exact: x=[1,0.999].',
      difficulty: 'hard',
      params: { matrix_a: [[0.001,1],[1,1]], vector_b: [1,2] },
      hint: 'Without pivoting: tiny pivot 0.001. With pivoting: swap rows, pivot = 1. Compare accuracy.',
      expectedAnswer: 'Without pivoting: large round-off error. With pivoting: pivot becomes 1 → accurate result.',
    },
    {
      id: 'p4',
      title: 'Find conditions for unique solution',
      description: 'For what values of k does [1,2;k,4]x=[3;6] have a unique solution? Exactly one? None?',
      difficulty: 'hard',
      hint: 'Compute det([1,2;k,4]) = 4 − 2k. Unique when 4 − 2k ≠ 0 → k ≠ 2.',
      expectedAnswer: 'k ≠ 2: unique solution. k = 2: system becomes [1,2;2,4]x=[3;6] → row 2 = 2×row 1, but b₂ = 2b₁ → infinite solutions. If k=2, b₂≠6: no solution.',
    },
  ],

  interactiveChallenges: [
    {
      id: 'c1',
      title: 'Step Through Elimination',
      description: 'Watch each row operation zero out one entry below the pivot.',
      objective: 'Understand how the upper triangular structure emerges step by step.',
      difficulty: 'easy',
      steps: [
        { step: 1, instruction: 'Enter A=[[2,1,0],[1,2,1],[0,1,2]] b=[1,0,1]. Run.', actionLabel: 'Run' },
        { step: 2, instruction: 'Watch the row operations tab. Each step zeros one subdiagonal entry.', expectedOutcome: 'After 2 steps: upper triangular U' },
        { step: 3, instruction: 'Check solution in the result panel. Verify Ax=b by hand.', expectedOutcome: 'Residual < 1e-14 — machine precision' },
      ],
    },
    {
      id: 'c2',
      title: 'Compare with Gauss-Seidel Speed',
      description: 'For a 3×3 diagonally dominant system, compare Gaussian elimination (instant) vs Gauss-Seidel (iterations).',
      objective: 'Understand why direct methods are preferred for small dense systems.',
      difficulty: 'medium',
      steps: [
        { step: 1, instruction: 'Solve [[5,-1,0],[-1,5,-1],[0,-1,5]]x=[4,3,4] using Gaussian Elimination.', actionLabel: 'Direct' },
        { step: 2, instruction: 'Switch to Gauss-Seidel. Count iterations to reach tolerance 1e-8.', expectedOutcome: 'Gauss-Seidel needs ~20 iterations. Direct: 0 iterations.' },
      ],
    },
    {
      id: 'c3',
      title: 'Ill-conditioned System Demo',
      description: 'Observe how a nearly-singular matrix makes the solution unreliable.',
      objective: 'Understand the condition number and its effect on accuracy.',
      difficulty: 'hard',
      steps: [
        { step: 1, instruction: 'Solve [[1,1],[1,1.0001]]x=[2,2.0001]. Well-conditioned?', actionLabel: 'Solve' },
        { step: 2, instruction: 'Change A[1][1] to 1.00001. Compare x with prior result.', expectedOutcome: 'Tiny A change causes ~10× larger x change — high condition number' },
      ],
    },
    {
      id: 'c4',
      title: 'Truss Force Calculation',
      description: 'Solve the equilibrium equations for a simple pin-jointed truss.',
      objective: 'Apply Gaussian elimination to a real structural engineering problem.',
      difficulty: 'hard',
      steps: [
        { step: 1, instruction: 'Enter the equilibrium matrix for a 2-member truss (provided in engineering apps).', actionLabel: 'Set up' },
        { step: 2, instruction: 'Solve for member forces. Positive = tension, negative = compression.', expectedOutcome: 'Member forces satisfy ΣFx=0, ΣFy=0 at each joint' },
      ],
    },
  ],

  summary: {
    keyPoints: [
      { title: 'Algorithm', description: 'Forward elimination (n−1 sweeps) → back substitution', icon: '📐' },
      { title: 'Cost', description: 'O(n³/3) — exact in finite steps', icon: '⏱️' },
      { title: 'Pivoting', description: 'Partial pivoting prevents division by zero and limits error growth', icon: '🔒' },
      { title: 'LU relation', description: 'Elimination factors = L matrix; row-reduced A = U matrix', icon: '🔀' },
      { title: 'Use case', description: 'Dense n < 10³ systems, multiple right-hand sides', icon: '✅' },
    ],
    cheatSheetFormulas: [
      {
        label: 'Multiplier',
        latex: 'm_{ik} = a_{ik} / a_{kk}',
        isKeyFormula: true,
      },
      {
        label: 'Row operation',
        latex: 'R_i \\leftarrow R_i - m_{ik} R_k',
      },
      {
        label: 'Back substitution',
        latex: 'x_i = \\frac{b_i - \\sum_{j>i} u_{ij} x_j}{u_{ii}}',
      },
    ],
    nextSteps: [
      { label: 'Gauss–Seidel', description: 'Iterative method for large sparse systems', path: '/linear-systems/gauss-seidel' },
      { label: 'Jacobi Method', description: 'Parallel-friendly iterative solver', path: '/linear-systems/jacobi' },
      { label: 'Linear Systems Comparison', description: 'Direct vs iterative — when to use each', path: '/linear-systems/comparison' },
    ],
  },
}
