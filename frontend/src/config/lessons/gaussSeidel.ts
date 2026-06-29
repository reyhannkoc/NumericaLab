import type { LessonConfig } from '@/types/lesson.types'

export const GAUSS_SEIDEL_CONFIG: LessonConfig = {
  header: {
    moduleId: 'linear-systems',
    moduleColor: '#14b8a6',
    title: 'Gauss–Seidel Method',
    subtitle: 'Iterative solver that immediately uses updated values in each sweep',
    difficulty: 'intermediate',
    estimatedMinutes: 55,
    objectives: [
      'Derive the Gauss–Seidel update formula from row isolation',
      'Understand why immediate updates accelerate convergence vs Jacobi',
      'Apply the diagonal dominance convergence criterion',
      'Recognize when Gauss–Seidel diverges and how to detect it',
      'Compare convergence rates with Jacobi and direct methods',
    ],
    prerequisites: [
      { title: 'Gaussian Elimination', path: '/linear-systems/gaussian-elimination', required: true },
    ],
    tags: ['iterative', 'convergence', 'diagonal dominance', 'relaxation', 'sparse systems'],
  },

  motivation: {
    problemStatement:
      'A finite element mesh of a dam has 10,000 nodes. Gaussian elimination needs O(n³) = 10¹² operations. ' +
      'Gauss–Seidel converges in O(kn) where k ≈ 100–1000 iterations — potentially 100× faster.',
    whyItMatters:
      'Large sparse systems from PDEs and FEA cannot be solved by direct methods due to memory and time. ' +
      'Iterative methods like Gauss–Seidel exploit the sparsity: each iteration only uses non-zero entries, ' +
      'making them practical for n = 10⁶ or larger.',
    historicalBackground:
      'Named after Carl Friedrich Gauss (~1800) and Philipp Ludwig von Seidel (1874). Seidel proved ' +
      'convergence for symmetric positive definite matrices. The method forms the basis of ' +
      'modern multigrid and preconditioned Krylov solvers.',
    engineeringMotivation:
      'Power system load flow analysis solves huge non-linear systems by iteratively linearizing and ' +
      'applying Gauss–Seidel to the linearized system at each step. For symmetric positive definite ' +
      'sparse systems (e.g., stiffness matrices), convergence is guaranteed.',
    motivatingExample: {
      title: '3×3 diagonally dominant system',
      description:
        '4x₁ − x₂ = 3, −x₁ + 4x₂ − x₃ = 3, −x₂ + 4x₃ = 3. Start: x=[0,0,0]. ' +
        'Gauss-Seidel iter 1: x₁=(3+x₂)/4=0.75, x₂=(3+x₁+x₃)/4=0.9375, x₃=(3+x₂)/4=0.9844.',
      expression: 'xᵢ⁽ᵏ⁺¹⁾ = (bᵢ − Σⱼ<ᵢ aᵢⱼxⱼ⁽ᵏ⁺¹⁾ − Σⱼ>ᵢ aᵢⱼxⱼ⁽ᵏ⁾) / aᵢᵢ',
      result: 'Exact answer [1,1,1] in ~8 iterations vs O(n³/3) for direct methods',
    },
  },

  theory: {
    overview:
      'Gauss–Seidel is a stationary iterative method that solves Ax=b by isolating each xᵢ in row i, ' +
      'then evaluating it using the most recent values of all other xⱼ. ' +
      'Because updated xⱼ⁽ᵏ⁺¹⁾ values replace old ones immediately within each sweep, ' +
      'convergence is typically 2× faster than Jacobi.',
    intuition:
      'Imagine adjusting a system of interconnected springs. Gauss–Seidel adjusts one spring at a time, ' +
      'using the already-adjusted positions of all previous springs in the current sweep. ' +
      'Jacobi adjusts all springs simultaneously using only old positions — slower to converge.',
    advantages: [
      '~2× faster convergence than Jacobi for most problems',
      'Only O(nnz) memory per iteration — exploits sparsity naturally',
      'Works on systems too large for direct methods (n = 10⁶+)',
      'Sequential: new values immediately feed back, reducing oscillation',
    ],
    limitations: [
      'Convergence not guaranteed without diagonal dominance or SPD condition',
      'Sensitive to ordering of equations — same matrix can converge or diverge depending on order',
      'Not parallelizable (uses updated values immediately — sequential dependency)',
      'For ill-conditioned systems, may converge very slowly',
    ],
    keyInsights: [
      'Sufficient condition for convergence: A is strictly diagonally dominant (|aᵢᵢ| > Σⱼ≠ᵢ|aᵢⱼ|)',
      'Also converges for symmetric positive definite (SPD) matrices — without dominance requirement',
      'The spectral radius ρ(M) < 1 is the necessary and sufficient convergence condition',
    ],
  },

  mathFoundation: {
    formulas: [
      {
        label: 'Gauss–Seidel Update',
        latex:
          'x_i^{(k+1)} = \\frac{1}{a_{ii}}\\left(b_i - \\sum_{j<i} a_{ij}x_j^{(k+1)} - \\sum_{j>i} a_{ij}x_j^{(k)}\\right)',
        description: 'Use updated xⱼ⁽ᵏ⁺¹⁾ for j < i; old xⱼ⁽ᵏ⁾ for j > i',
        isKeyFormula: true,
      },
      {
        label: 'Matrix Splitting Form',
        latex: 'x^{(k+1)} = (D+L)^{-1}(b - U x^{(k)})',
        description: 'A = D + L + U where D=diagonal, L=strictly lower, U=strictly upper triangular',
      },
      {
        label: 'Convergence Criterion',
        latex: '\\|x^{(k+1)} - x^{(k)}\\| < \\varepsilon',
        description: 'Stop when consecutive iterates are close enough',
        isKeyFormula: true,
      },
      {
        label: 'Diagonal Dominance (sufficient)',
        latex: '|a_{ii}| > \\sum_{j \\neq i} |a_{ij}|,\\quad \\forall\\, i',
        description: 'Guarantees convergence for any starting vector x⁰',
        isKeyFormula: true,
      },
      {
        label: 'Spectral Radius',
        latex: '\\rho(M_{GS}) = \\rho((D+L)^{-1}U)',
        description: 'Convergence iff ρ < 1. Rate: ρᵏ → 0 in k iterations',
      },
    ],
    symbols: [
      { symbol: 'D', definition: 'Diagonal part of A' },
      { symbol: 'L', definition: 'Strictly lower triangular part of A' },
      { symbol: 'U', definition: 'Strictly upper triangular part of A' },
      { symbol: 'ρ(M)', definition: 'Spectral radius of iteration matrix M — max eigenvalue magnitude' },
      { symbol: 'k', definition: 'Iteration count' },
    ],
    derivationSteps: [
      {
        step: 1,
        description: 'Isolate xᵢ in row i of Ax=b',
        latex: 'a_{ii}x_i = b_i - \\sum_{j \\neq i} a_{ij}x_j',
      },
      {
        step: 2,
        description: 'Substitute current best estimates for all j≠i, using updated values for j<i',
        latex: 'x_i^{(k+1)} = \\frac{b_i - \\sum_{j<i} a_{ij}x_j^{(k+1)} - \\sum_{j>i} a_{ij}x_j^{(k)}}{a_{ii}}',
      },
      {
        step: 3,
        description: 'Sweep from i=1 to n; repeat until ‖x⁽ᵏ⁺¹⁾ − x⁽ᵏ⁾‖ < ε',
        latex: '\\text{Repeat: } x^{(k+1)} \\leftarrow (D+L)^{-1}(b - Ux^{(k)})',
      },
    ],
    assumptions: [
      'aᵢᵢ ≠ 0 for all i (no zero diagonal entries)',
      'Matrix is either strictly diagonally dominant OR symmetric positive definite (for guaranteed convergence)',
    ],
    convergenceCondition: 'Spectral radius ρ((D+L)⁻¹U) < 1. Sufficient: strictly diagonally dominant or SPD.',
  },

  errorAnalysis: {
    metrics: [
      {
        label: 'Iteration Error',
        formula: '‖x⁽ᵏ⁺¹⁾ − x⁽ᵏ⁾‖',
        description: 'Distance between consecutive iterates — practical stopping criterion',
      },
      {
        label: 'Residual',
        formula: '‖Ax⁽ᵏ⁾ − b‖',
        description: 'How well current iterate satisfies the equations. More reliable than iteration error for ill-conditioned systems.',
      },
      {
        label: 'True Error',
        formula: '‖x⁽ᵏ⁾ − x*‖',
        description: 'Actual distance from exact solution — usually unknown. Decreases by factor ρ each iteration.',
      },
    ],
    stabilityNote:
      'For SPD matrices, Gauss-Seidel is unconditionally stable regardless of starting point. ' +
      'For non-SPD matrices, convergence depends on the spectral radius of the iteration matrix.',
    floatingPointNote:
      'Iterative methods accumulate floating-point errors slowly — typically one extra digit lost every ' +
      'O(κ(A)) iterations. Far more robust than direct methods for ill-conditioned systems.',
  },

  performance: {
    complexity: {
      timeComplexity: 'O(k·nnz) where nnz = non-zeros in A',
      spaceComplexity: 'O(nnz) — only store non-zero entries',
      convergenceOrder: 'Linear — ‖error‖ₖ ≈ ρᵏ ‖error‖₀',
      convergenceOrderNote: 'Each iteration reduces error by spectral radius ρ. For ρ=0.1: 10 iters give 10 digits.',
    },
    bestCase: 'Diagonal dominant SPD system: fast convergence in few iterations',
    worstCase: 'Non-diagonally dominant: may diverge or converge very slowly',
    typicalIterations: 'n=1000, DD system: 50–200 iterations. Each iteration costs O(nnz) vs O(n³) for direct.',
  },

  comparison: {
    methods: ['Gauss–Seidel', 'Jacobi', 'Gaussian Elim.'],
    criteria: ['Update rule', 'Convergence rate', 'Parallelizable', 'Memory', 'When to use'],
    table: [
      {
        criterion: 'Update rule',
        'Gauss–Seidel': 'Sequential: use updated xⱼ immediately',
        'Jacobi': 'Parallel: use only old xⱼ⁽ᵏ⁾',
        'Gaussian Elim.': 'Direct: row reduce in O(n³)',
      },
      {
        criterion: 'Convergence rate',
        'Gauss–Seidel': 'ρ_GS ≈ ρ_J² for SDD (2× faster)',
        'Jacobi': 'ρ_J = ρ_Jacobi',
        'Gaussian Elim.': 'N/A (direct)',
      },
      {
        criterion: 'Parallelizable',
        'Gauss–Seidel': '❌ Sequential updates',
        'Jacobi': '✓ Fully parallel',
        'Gaussian Elim.': 'Partial (panel LU)',
      },
      {
        criterion: 'Memory',
        'Gauss–Seidel': 'O(nnz) — sparse',
        'Jacobi': 'O(nnz) — sparse',
        'Gaussian Elim.': 'O(n²) — dense (fill-in)',
      },
      {
        criterion: 'When to use',
        'Gauss–Seidel': 'Large sparse SDD/SPD, single CPU',
        'Jacobi': 'Large sparse, multi-GPU/parallel HPC',
        'Gaussian Elim.': 'Dense n<1000, multiple RHS',
      },
    ],
    summary:
      'Gauss-Seidel beats Jacobi in convergence speed but loses in parallelism. ' +
      'For GPU computing, Jacobi is often preferred. For CPU serial codes, Gauss-Seidel is standard.',
  },

  engineeringApplications: [
    {
      field: 'Power Systems',
      title: 'Load Flow Analysis (Gauss-Seidel Method)',
      description:
        'Power flow equations form a large sparse nonlinear system. Linearized at each step, ' +
        'the inner Gauss-Seidel iterations solve the resulting sparse linear system.',
      example: '500-bus power network → 1000×1000 sparse system, 100 GS iterations per time step',
      icon: '⚡',
      difficulty: 'advanced',
    },
    {
      field: 'Finite Difference Methods',
      title: 'Steady-State Heat Conduction (Liebmann Method)',
      description:
        'The Laplace equation ∇²T=0 discretized on a grid gives a large sparse linear system. ' +
        'Gauss-Seidel (called "Liebmann method" in this context) iterates until convergence.',
      example: '100×100 grid → 10,000 unknowns → 500 GS sweeps → temperature field',
      icon: '🌡️',
      difficulty: 'intermediate',
    },
    {
      field: 'Structural Analysis',
      title: 'Iterative FEA for Large Meshes',
      description:
        'For FEM meshes with n > 10⁵ nodes, the stiffness matrix K is too large for direct methods. ' +
        'Preconditioned Gauss-Seidel (or SSOR) is used as a preconditioner for Conjugate Gradient.',
      example: 'Aircraft wing mesh: 500,000 DOFs → Gauss-Seidel preconditioner + CG solver',
      icon: '✈️',
      difficulty: 'advanced',
    },
    {
      field: 'Image Processing',
      title: 'Image Deblurring (Least Squares)',
      description:
        'Deblurring formulates as AᵀAx = Aᵀb where A is the blur matrix. For large images, ' +
        'the SPD system AᵀAx=Aᵀb is solved by Gauss-Seidel or Conjugate Gradient.',
      example: '1MP image: 10⁶ unknowns → Gauss-Seidel over 50 iterations → deblurred image',
      icon: '📷',
      difficulty: 'advanced',
    },
    {
      field: 'Computational Fluid Dynamics',
      title: 'Pressure Poisson Solver',
      description:
        'The incompressible Navier-Stokes equations require solving a Poisson equation for pressure ' +
        'at each time step. Gauss-Seidel (or SOR) is the classical solver for this problem.',
      example: 'Lid-driven cavity flow: 100×100 mesh → 10,000 pressure unknowns → GS until convergence',
      icon: '🌀',
      difficulty: 'advanced',
    },
  ],

  commonMistakes: [
    {
      id: 'm1',
      title: 'Applying GS to non-diagonally-dominant systems',
      description:
        'Gauss-Seidel may diverge if the diagonal dominance condition is not satisfied. ' +
        'The error can grow geometrically instead of shrinking.',
      wrongApproach: 'Apply GS to [[1,2],[3,4]]x=[5,6] — not diagonally dominant, may diverge',
      correctApproach: 'Check diagonal dominance first. If not satisfied, reorder equations or use a direct method.',
      icon: '⚠️',
    },
    {
      id: 'm2',
      title: 'Using old values (Jacobi mistake) instead of immediate updates',
      description:
        'The key difference from Jacobi is that Gauss-Seidel uses x₁⁽ᵏ⁺¹⁾ immediately when computing x₂⁽ᵏ⁺¹⁾. ' +
        'Using x₁⁽ᵏ⁾ instead converts it back to (slower) Jacobi.',
      wrongApproach: 'x₂_new = (b₂ − a₂₁*x₁_old) / a₂₂ — misses the Gauss-Seidel advantage',
      correctApproach: 'x₂_new = (b₂ − a₂₁*x₁_new) / a₂₂ — uses already-updated x₁_new',
      icon: '🔄',
    },
    {
      id: 'm3',
      title: 'Stopping too early before convergence',
      description:
        'For ill-conditioned or slowly converging systems, the iteration error ‖x⁽ᵏ⁺¹⁾−x⁽ᵏ⁾‖ can be small ' +
        'before the actual error ‖x−x*‖ is small. Always check the residual ‖Ax−b‖ as well.',
      wrongApproach: 'Stop at k=10 when ‖x⁽¹⁰⁾−x⁽⁹⁾‖ < 1e-4 — may not be accurate enough',
      correctApproach: 'Also check ‖Ax−b‖ < tolerance. For safety, continue a few extra iterations.',
      icon: '🎯',
    },
    {
      id: 'm4',
      title: 'Forgetting that ordering of equations matters',
      description:
        'The same system can converge or diverge depending on the order of equations. ' +
        'Reordering rows to maximize diagonal dominance can dramatically improve convergence.',
      wrongApproach: 'Use equations in arbitrary order — small pivots may cause divergence',
      correctApproach: 'Reorder so the largest |aᵢⱼ| in each row is on the diagonal',
      icon: '📋',
    },
  ],

  practiceProblems: [
    {
      id: 'p1',
      title: 'First 2 Gauss-Seidel iterations by hand',
      description: 'For [5,−1,0;−1,5,−1;0,−1,5]x=[4,3,4], starting from x=[0,0,0], compute 2 iterations by hand.',
      difficulty: 'easy',
      params: { matrix_a: [[5,-1,0],[-1,5,-1],[0,-1,5]], vector_b: [4,3,4], tolerance: 1e-8 },
      hint: 'Iter 1: x₁=(4+0)/5=0.8, x₂=(3+0.8+0)/5=0.76, x₃=(4+0.76)/5=0.952.',
      expectedAnswer: 'After 2 iterations: x ≈ [0.944, 0.899, 0.980]. Exact = [1,1,1]. Converges in ~12 iterations.',
    },
    {
      id: 'p2',
      title: 'Check diagonal dominance',
      description: 'Which of these systems is diagonally dominant? (a) [3,1;2,4], (b) [1,2;2,3], (c) [4,-1;-1,4]',
      difficulty: 'easy',
      hint: 'Row i is DD if |aᵢᵢ| > Σⱼ≠ᵢ|aᵢⱼ|.',
      expectedAnswer: '(a): Row1: |3|>|1| ✓, Row2: |4|>|2| ✓ → DD. (b): Row1: |1|<|2| ✗ → Not DD. (c): Both rows: 4>1 ✓ → DD.',
    },
    {
      id: 'p3',
      title: 'Compare GS vs Jacobi iteration counts',
      description: 'For [[4,-1,0,0],[-1,4,-1,0],[0,-1,4,-1],[0,0,-1,4]]x=[1,1,1,1], use the playground to compare GS vs Jacobi iteration counts to tolerance 1e-8.',
      difficulty: 'medium',
      params: { matrix_a: [[4,-1,0,0],[-1,4,-1,0],[0,-1,4,-1],[0,0,-1,4]], vector_b: [1,1,1,1], tolerance: 1e-8 },
      hint: 'For this matrix, ρ_GS ≈ ρ_J². Expect GS to need roughly half the iterations.',
      expectedAnswer: 'Jacobi ≈ 30 iterations, GS ≈ 15 iterations. Ratio ≈ 2:1 as predicted by theory.',
    },
    {
      id: 'p4',
      title: 'Divergence demonstration',
      description: 'Show that GS diverges on [[1,2],[3,4]]x=[5,11]. Then reorder to [[3,4],[1,2]] and verify convergence.',
      difficulty: 'hard',
      hint: 'Original: Row1: |1|<|2| — not DD. Reordered: Row1: |3|>|4|? No → still not DD! Use direct method here.',
      expectedAnswer: 'Neither ordering is diagonally dominant. GS diverges. Gaussian elimination gives x=[1,1]. Lesson: check DD before applying GS.',
    },
  ],

  interactiveChallenges: [
    {
      id: 'c1',
      title: 'Observe Linear Convergence',
      description: 'Plot the error vs iteration number and confirm the linear (geometric) convergence rate.',
      objective: 'Verify that ‖x⁽ᵏ⁾ − x*‖ decreases by factor ρ each iteration.',
      difficulty: 'easy',
      steps: [
        { step: 1, instruction: 'Solve [4,-1;-1,4]x=[3,3] starting from x=[0,0]. Tolerance = 1e-10.', actionLabel: 'Run' },
        { step: 2, instruction: 'Look at the iteration table. Check error column.', expectedOutcome: 'Error decreases by same factor each step — linear convergence' },
        { step: 3, instruction: 'Estimate ρ from error(k+1)/error(k). Compare with theoretical ρ = 1/9 for this system.', expectedOutcome: 'ρ ≈ 0.111' },
      ],
    },
    {
      id: 'c2',
      title: 'Effect of Starting Point',
      description: 'Verify that GS converges to the same solution regardless of starting point (for DD systems).',
      objective: 'Confirm global convergence property for diagonally dominant systems.',
      difficulty: 'medium',
      steps: [
        { step: 1, instruction: 'Solve [5,-1;-1,5]x=[4,4] starting from x=[0,0]. Count iterations.', actionLabel: 'Run from 0' },
        { step: 2, instruction: 'Change starting guess to x=[100,100]. Count iterations.', expectedOutcome: 'Same final answer, roughly similar iteration count — convergence is global' },
      ],
    },
    {
      id: 'c3',
      title: 'Non-DD Divergence',
      description: 'Observe GS diverging when diagonal dominance fails.',
      objective: 'Understand the importance of the convergence condition.',
      difficulty: 'hard',
      steps: [
        { step: 1, instruction: 'Try [1,2;2,1]x=[3,3] (solution: x=[1,1]). Watch iteration error.', actionLabel: 'Run (non-DD)' },
        { step: 2, instruction: 'Swap the equations: [2,1;1,2]x=[3,3]. Same solution. Does GS converge?', expectedOutcome: '[2,1;1,2] IS diagonally dominant → converges. [1,2;2,1] is NOT → diverges.' },
      ],
    },
    {
      id: 'c4',
      title: 'GS for a 5-node FEM Problem',
      description: 'Apply Gauss-Seidel to a small 1D FEM stiffness system and count iterations needed.',
      objective: 'See how iterative methods scale for PDE-based linear systems.',
      difficulty: 'hard',
      steps: [
        { step: 1, instruction: 'Set A = tridiagonal(−1,2,−1) of size 5×5; b=[1,0,0,0,1]. Solve.', actionLabel: 'Run 5-node' },
        { step: 2, instruction: 'Verify the solution satisfies −u\'\'=0 (linear temperature profile).', expectedOutcome: 'x≈[0.8,0.6,0.4,0.2,0] — linear, as expected for 1D Laplace on [0,1]' },
      ],
    },
  ],

  summary: {
    keyPoints: [
      { title: 'Key idea', description: 'Use updated xⱼ⁽ᵏ⁺¹⁾ immediately within each sweep', icon: '🔄' },
      { title: 'Convergence', description: 'Linear rate ρᵏ → guaranteed if diagonally dominant or SPD', icon: '📉' },
      { title: 'Cost', description: 'O(k·nnz) vs O(n³) direct — wins for large sparse systems', icon: '⏱️' },
      { title: 'Limit', description: 'Fails without diagonal dominance — check before applying', icon: '⚠️' },
      { title: 'vs Jacobi', description: '~2× faster convergence but sequential (not parallelizable)', icon: '🏁' },
    ],
    cheatSheetFormulas: [
      {
        label: 'GS Update',
        latex:
          'x_i^{(k+1)} = \\frac{1}{a_{ii}}\\left(b_i - \\sum_{j<i} a_{ij}x_j^{(k+1)} - \\sum_{j>i} a_{ij}x_j^{(k)}\\right)',
        isKeyFormula: true,
      },
      {
        label: 'DD Condition (sufficient)',
        latex: '|a_{ii}| > \\textstyle\\sum_{j\\neq i}|a_{ij}| \\implies \\text{converges}',
      },
      {
        label: 'Stopping',
        latex: '\\|x^{(k+1)}-x^{(k)}\\| < \\varepsilon_{\\text{tol}}',
      },
    ],
    nextSteps: [
      { label: 'Jacobi Method', description: 'Parallel variant — all xᵢ updated simultaneously', path: '/linear-systems/jacobi' },
      { label: 'Linear Systems Comparison', description: 'When to use direct vs iterative methods', path: '/linear-systems/comparison' },
      { label: 'LU Decomposition', description: 'Factorize A=LU for efficient multiple right-hand sides', path: '/lu-decomposition' },
    ],
  },
}
