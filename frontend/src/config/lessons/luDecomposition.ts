import type { LessonConfig } from '@/types/lesson.types'

export const LU_DECOMPOSITION_CONFIG: LessonConfig = {
  header: {
    moduleId: 'lu-decomposition',
    moduleColor: '#f97316',
    title: 'LU Decomposition',
    subtitle: 'Factor A = LU once, solve Ax = b for many right-hand sides in O(n²)',
    difficulty: 'intermediate',
    estimatedMinutes: 65,
    objectives: [
      'Derive LU from Gaussian elimination: L stores the multipliers',
      'Understand why A = LU (or PA = LU with pivoting)',
      'Implement forward substitution for Ly = b',
      'Implement backward substitution for Ux = y',
      'Compute the matrix determinant as the product of U diagonals',
      'Recognize O(n³) factorization + O(n²) solve — efficient for multiple RHS',
    ],
    prerequisites: [
      { title: 'Gaussian Elimination', path: '/linear-systems/gaussian-elimination', required: true },
    ],
    tags: ['direct', 'factorization', 'matrix', 'O(n³)', 'determinant'],
  },

  motivation: {
    problemStatement:
      'A structural FEM simulation must solve Kx = f for the same stiffness matrix K ' +
      'with hundreds of different load vectors f. Re-running Gaussian elimination each time ' +
      'costs O(n³) per solve. Can we do better?',
    whyItMatters:
      'LU decomposition pays the O(n³) factorization cost once, then each new RHS ' +
      'costs only O(n²) via two triangular substitutions. For 100 load cases on a 1000×1000 system, ' +
      'LU is 100× more efficient than re-running Gaussian elimination.',
    historicalBackground:
      'The connection between Gaussian elimination and triangular factorization was formalized by ' +
      'Alan Turing (1948) and later refined with partial pivoting by Wilkinson (1960s). ' +
      'LAPACK\'s dgetrf (LU with pivoting) is one of the most-called numerical routines in science.',
    engineeringMotivation:
      'Every time you call numpy.linalg.solve(A, b), LAPACK runs LU decomposition internally. ' +
      'MATLAB\'s backslash operator, scipy.linalg.lu, and most finite element solvers all use LU.',
    motivatingExample: {
      title: 'Factor once, solve many times',
      description:
        'FEM problem: K is 1000×1000. 500 load cases each requiring a solution. ' +
        'GE each time: 500 × O(n³) = 500 × 3.3×10⁸ = 1.67×10¹¹ flops. ' +
        'LU once: O(n³) + 500×O(n²) = 3.3×10⁸ + 500×10⁶ = 8.3×10⁸ flops — 200× fewer.',
      expression: 'A = L·U → solve Ly=b in O(n²), Ux=y in O(n²)',
      result: '200× speedup for 500 load cases vs repeated Gaussian elimination',
    },
  },

  theory: {
    overview:
      'LU decomposition rewrites A = LU where L is unit lower-triangular (1s on diagonal) and ' +
      'U is upper-triangular. The decomposition is performed exactly as in Gaussian elimination — ' +
      'the multipliers mᵢₖ = aᵢₖ/aₖₖ fill the lower-triangular L, and U is the final upper-triangular matrix.',
    intuition:
      'Gaussian elimination transforms Ax=b into Ux=y by applying the same row operations. ' +
      'LU asks: what single matrix L⁻¹ represents all those row operations? ' +
      'It turns out L is just the matrix of multipliers — trivially invertible because L⁻¹ also has a simple structure.',
    advantages: [
      'Solve for multiple b vectors at O(n²) cost after the O(n³) factorization',
      'Compute det(A) = det(U) = product of diagonal entries of U',
      'Compute A⁻¹ by solving AX = I (n RHS at O(n²) each)',
      'Numerically stable with partial pivoting (PA = LU)',
    ],
    limitations: [
      'O(n²) memory for dense A — unsuitable for very large sparse systems',
      'Requires partial pivoting to be numerically stable',
      'Not optimal for symmetric positive-definite (SPD) matrices — use Cholesky instead',
      'Fill-in for sparse matrices: off-diagonal zeros may become nonzero in L and U',
    ],
    keyInsights: [
      'L stores the multipliers mᵢₖ; U is exactly the upper-triangular result of elimination',
      'PA = LU accounts for row swaps (partial pivoting)',
      'det(A) = det(P⁻¹)·prod(Uᵢᵢ) = (±1) × product of pivots',
    ],
  },

  mathFoundation: {
    formulas: [
      {
        label: 'Factorization',
        latex: 'A = LU \\quad \\text{or} \\quad PA = LU \\; (\\text{with partial pivoting})',
        description: 'L is unit lower-triangular; U is upper-triangular; P is a permutation matrix',
        isKeyFormula: true,
      },
      {
        label: 'Multiplier stored in L',
        latex: 'l_{ik} = m_{ik} = \\frac{a_{ik}^{(k-1)}}{a_{kk}^{(k-1)}}',
        description: 'The multiplier used to eliminate entry (i,k) is stored directly in L[i][k]',
        isKeyFormula: true,
      },
      {
        label: 'Forward Substitution (Ly = b)',
        latex: 'y_i = b_i - \\sum_{j=1}^{i-1} l_{ij} y_j',
        description: 'Solve Ly = b in O(n²) — sweep top to bottom',
        isKeyFormula: true,
      },
      {
        label: 'Backward Substitution (Ux = y)',
        latex: 'x_i = \\frac{1}{u_{ii}}\\left(y_i - \\sum_{j=i+1}^{n} u_{ij} x_j\\right)',
        description: 'Solve Ux = y in O(n²) — sweep bottom to top',
        isKeyFormula: true,
      },
      {
        label: 'Determinant from U',
        latex: '\\det(A) = \\det(U) = \\prod_{i=1}^{n} u_{ii} \\quad (\\text{with sign from P})',
        description: 'Extremely efficient — no n×n expansion needed once U is known',
      },
    ],
    symbols: [
      { symbol: 'L', definition: 'Unit lower-triangular matrix (lᵢᵢ = 1, lᵢⱼ = mᵢⱼ for i > j)' },
      { symbol: 'U', definition: 'Upper-triangular matrix — the result of forward elimination' },
      { symbol: 'P', definition: 'Permutation matrix recording row swaps during pivoting' },
      { symbol: 'mᵢₖ', definition: 'Elimination multiplier for row i at step k: aᵢₖ/aₖₖ' },
    ],
    derivationSteps: [
      {
        step: 1,
        description: 'Gaussian elimination applies row operations Eᵢ: Rᵢ ← Rᵢ − mᵢₖRₖ',
        latex: 'E_{n-1} \\cdots E_1 A = U',
      },
      {
        step: 2,
        description: 'Invert: A = E₁⁻¹ ··· Eₙ₋₁⁻¹ U. Each Eᵢ⁻¹ just negates the multiplier',
        latex: 'L = E_1^{-1} \\cdots E_{n-1}^{-1} = \\text{lower triangular with } l_{ik} = m_{ik}',
      },
      {
        step: 3,
        description: 'To solve Ax=b: factor A=LU once, then solve Ly=b and Ux=y',
        latex: 'Ax = b \\Rightarrow LUx = b \\Rightarrow \\text{let } Ux = y: \\, Ly = b, \\text{ then } Ux = y',
      },
    ],
    assumptions: [
      'A is square and nonsingular (det(A) ≠ 0)',
      'Partial pivoting used for stability (PA = LU)',
    ],
    convergenceCondition: 'Direct method — produces exact result (up to floating-point) in finite steps',
  },

  errorAnalysis: {
    metrics: [
      {
        label: 'Residual',
        formula: '‖Ax − b‖',
        description: 'Should be O(n·ε_mach·‖A‖·‖x‖). Measure actual numerical accuracy.',
      },
      {
        label: 'Growth Factor',
        formula: 'max|uᵢⱼ| / max|aᵢⱼ|',
        description: 'Measures how much entries grow during elimination. Partial pivoting bounds this by 2ⁿ (rarely achieved).',
      },
    ],
    stabilityNote:
      'With partial pivoting, the growth factor is theoretically bounded by 2ⁿ⁻¹ but in practice almost always O(n). ' +
      'LU with partial pivoting is considered backward stable for virtually all practical matrices.',
    floatingPointNote:
      'Forward error bound: ‖x − x*‖/‖x*‖ ≤ κ(A)·(2n²ε_mach) where κ(A) = ‖A‖·‖A⁻¹‖ is the condition number. ' +
      'Ill-conditioned matrices (large κ) magnify round-off regardless of the algorithm.',
  },

  performance: {
    complexity: {
      timeComplexity: 'O(n³/3) factorization + O(n²) per solve',
      spaceComplexity: 'O(n²) — L and U stored in-place in the original matrix',
      convergenceOrder: 'Direct — finite steps',
      convergenceOrderNote: 'Much more efficient than GE for multiple RHS: k solves cost O(n³) + k·O(n²) vs k·O(n³)',
    },
    bestCase: 'Multiple RHS (k >> 1): approaches O(n³/kn) = O(n²) per solve amortized',
    worstCase: 'Single RHS, dense n×n: same as Gaussian elimination O(n³/3)',
    typicalIterations: 'Not iterative — deterministic factorization followed by triangular solves',
  },

  comparison: {
    methods: ['LU', 'Gaussian Elim.', 'Cholesky', 'Iterative (GS)'],
    criteria: ['Cost per solve', 'Multiple RHS', 'Memory', 'Requirement', 'Stability'],
    table: [
      { criterion: 'Cost per solve', 'LU': 'O(n²) after O(n³) factor', 'Gaussian Elim.': 'O(n³) each time', 'Cholesky': 'O(n²) after O(n³/6) factor', 'Iterative (GS)': 'O(k·nnz) iterative' },
      { criterion: 'Multiple RHS', 'LU': '✓ Very efficient', 'Gaussian Elim.': '❌ Re-run each time', 'Cholesky': '✓ Very efficient', 'Iterative (GS)': 'Moderate' },
      { criterion: 'Memory', 'LU': 'O(n²) dense', 'Gaussian Elim.': 'O(n²) dense', 'Cholesky': 'O(n²/2) lower triangle', 'Iterative (GS)': 'O(nnz) sparse' },
      { criterion: 'Requirement', 'LU': 'Nonsingular', 'Gaussian Elim.': 'Nonsingular', 'Cholesky': 'Symmetric PD', 'Iterative (GS)': 'Diagonal dominant' },
      { criterion: 'Stability', 'LU': 'With partial pivoting', 'Gaussian Elim.': 'With partial pivoting', 'Cholesky': 'Inherently stable', 'Iterative (GS)': 'If ρ < 1' },
    ],
    summary: 'Use LU when solving multiple systems with the same A. Use Cholesky for SPD matrices (2× faster, more stable). Use iterative for large sparse systems.',
  },

  engineeringApplications: [
    {
      field: 'Structural Engineering',
      title: 'FEM Static Analysis — Multiple Load Cases',
      description:
        'A bridge truss FEM model has stiffness matrix K. Factor K = LU once, then solve Ku = f ' +
        'for 50+ load combinations (dead load, live load, wind, seismic) at O(n²) each.',
      example: 'n = 5000 DOF, 100 load cases: 1 LU + 100 triangular solves vs 100 GE runs',
      icon: '🏗️',
      difficulty: 'intermediate',
    },
    {
      field: 'Computer Graphics',
      title: 'Inverse Kinematics for Articulated Characters',
      description:
        'Jacobian-based IK solves J·Δθ = Δp repeatedly as the character moves. ' +
        'For each frame, factor J once and solve for multiple body parts simultaneously.',
      example: 'Game character IK at 60 FPS: LU factorization of 24×24 Jacobian per frame',
      icon: '🎮',
      difficulty: 'intermediate',
    },
    {
      field: 'Financial Mathematics',
      title: 'Portfolio Optimization (Markowitz)',
      description:
        'Computing the efficient frontier requires solving the system Σλ = μ for multiple risk ' +
        'targets λ, where Σ is the covariance matrix. LU factors Σ once, solves for each target.',
      example: '100 assets: 100×100 covariance factorization, 50 portfolio solves',
      icon: '📈',
      difficulty: 'advanced',
    },
    {
      field: 'Electrical Engineering',
      title: 'Circuit Nodal Analysis (SPICE)',
      description:
        'SPICE-type circuit simulators build and solve Y·V = I (admittance × voltages = currents) ' +
        'at every time step. LU refactorization is triggered only when topology changes.',
      example: 'Transient analysis: hundreds of time steps with the same Y matrix → huge LU savings',
      icon: '⚡',
      difficulty: 'intermediate',
    },
    {
      field: 'Robotics',
      title: 'Inverse Dynamics — Real-Time Control',
      description:
        'Computing joint torques τ = M(q)α + C(q,q̇) requires solving M(q)·α = b at the control ' +
        'frequency (1 kHz). Precomputing LU of M(q) at each control step enables real-time performance.',
      example: '6-DOF manipulator: 6×6 M matrix factored at 1 kHz — each solve in microseconds',
      icon: '🤖',
      difficulty: 'advanced',
    },
  ],

  commonMistakes: [
    {
      id: 'm1',
      title: 'Forgetting to apply the permutation P to b',
      description: 'With PA = LU, the full solve is Pb first, then Ly = Pb, then Ux = y. Omitting P gives the wrong answer.',
      wrongApproach: 'Solve Ly = b directly when using PA = LU',
      correctApproach: 'Permute b first: y_rhs = P @ b, then forward sub: Ly = y_rhs, back sub: Ux = y',
      icon: '⚠️',
    },
    {
      id: 'm2',
      title: 'Overwriting A without saving L',
      description: 'In-place LU stores both L and U in the same matrix. The lower triangle holds L\'s subdiagonal entries (L diagonal is 1), upper holds U.',
      wrongApproach: 'Treating the factored matrix as the original A',
      correctApproach: 'After factorization, extract L = lower_tri(LU) + I, U = upper_tri(LU)',
      icon: '💾',
    },
    {
      id: 'm3',
      title: 'Using LU for sparse systems',
      description: 'LU fill-in (zeros become nonzeros) can turn a sparse A with nnz=O(n) entries into dense L and U with O(n²) entries, destroying sparsity.',
      wrongApproach: 'Apply dense LU to a FEM sparse matrix with n=10⁶',
      correctApproach: 'Use sparse LU (UMFPACK, SuperLU) with fill-reducing reordering, or switch to iterative solvers',
      icon: '🧩',
    },
    {
      id: 'm4',
      title: 'Computing det(A) from L instead of U',
      description: 'det(A) = product of U\'s diagonals × sign of permutation. L has 1s on its diagonal by convention — det(L) = 1 always.',
      wrongApproach: 'Compute det from L (always 1) or multiply L and U diagonals together',
      correctApproach: 'det(A) = (−1)^swaps × Π uᵢᵢ',
      icon: '🔢',
    },
  ],

  practiceProblems: [
    {
      id: 'p1',
      title: 'Factor a 3×3 matrix by hand',
      description: 'Compute L and U for A = [[2,1,1],[4,3,3],[8,7,9]] without pivoting. Verify A = LU.',
      difficulty: 'easy',
      hint: 'Step 1: m₂₁=4/2=2, m₃₁=8/2=4. After elim col 1: row2=[0,1,1], row3=[0,3,5]. Step 2: m₃₂=3/1=3.',
      expectedAnswer: 'L=[[1,0,0],[2,1,0],[4,3,1]], U=[[2,1,1],[0,1,1],[0,0,2]]. Check: L×U = A ✓',
    },
    {
      id: 'p2',
      title: 'Solve Ax=b using precomputed LU',
      description: 'Given L=[[1,0,0],[2,1,0],[3,2,1]], U=[[2,1,0],[0,3,1],[0,0,4]], b=[8,17,16]. Find x.',
      difficulty: 'medium',
      hint: 'Forward sub: y₁=8, y₂=17-2×8=1, y₃=16-3×8-2×1=−10. Back sub: x₃=−10/4, x₂=(1-x₃)/3, x₁=(8-x₂)/2.',
      expectedAnswer: 'y=[8,1,−10]. x₃=−2.5, x₂=(1−(−2.5))/3=1.167, x₁=(8−1.167)/2=3.417',
    },
    {
      id: 'p3',
      title: 'Compute the determinant from U',
      description: 'For U=[[3,2,1],[0,4,2],[0,0,2]] (no row swaps). What is det(A)?',
      difficulty: 'easy',
      hint: 'det(U) = product of diagonal entries. Number of row swaps = 0 → sign = +1.',
      expectedAnswer: 'det = 3 × 4 × 2 = 24. Since no swaps, det(A) = det(U) = 24.',
    },
    {
      id: 'p4',
      title: 'LU with partial pivoting',
      description: 'Factor [[0,2,4],[6,1,3],[3,2,1]] using partial pivoting (PA = LU). What row swaps occur?',
      difficulty: 'hard',
      hint: 'Step 1: largest |a₁ᵢ| in column 1 is |6| (row 2). Swap R1↔R2. P records this swap.',
      expectedAnswer: 'Swap R1↔R2 first (pivot=6). After full elimination, L and U found. det(A) = ±det(U) based on swap count (1 swap → sign = −1).',
    },
  ],

  interactiveChallenges: [
    {
      id: 'c1',
      title: 'Multiple RHS efficiency',
      description: 'Solve the same A for 3 different b vectors. Compare LU vs re-running GE.',
      objective: 'Verify LU factorization + 3 triangular solves is faster than 3 Gaussian eliminations.',
      difficulty: 'easy',
      steps: [
        { step: 1, instruction: 'Factor [[4,-1,0],[-1,4,-1],[0,-1,4]] using LU in playground.', actionLabel: 'Factor' },
        { step: 2, instruction: 'Solve for b₁=[3,2,3], b₂=[1,0,1], b₃=[2,1,2] using the factored LU.', expectedOutcome: '3 different solutions, each in O(n²) — same L and U reused.' },
      ],
    },
    {
      id: 'c2',
      title: 'Verify L × U = A',
      description: 'Factor a matrix and verify the reconstruction A = L × U.',
      objective: 'Understand that L and U together exactly represent A (up to permutation).',
      difficulty: 'easy',
      steps: [
        { step: 1, instruction: 'Factor [[2,1],[1,3]] in the playground.', actionLabel: 'Factor' },
        { step: 2, instruction: 'Manually compute L × U. Does it equal A?', expectedOutcome: 'L×U = A within floating-point precision.' },
      ],
    },
    {
      id: 'c3',
      title: 'Near-singular matrix behavior',
      description: 'Factor a nearly singular matrix and observe the pivots.',
      objective: 'Understand how small pivots indicate near-singularity and large condition number.',
      difficulty: 'hard',
      steps: [
        { step: 1, instruction: 'Factor [[1,1],[1,1+1e-8]] — nearly singular (det ≈ 10⁻⁸).', actionLabel: 'Factor' },
        { step: 2, instruction: 'Check the last U diagonal. How small is it?', expectedOutcome: 'U[2][2] ≈ 10⁻⁸ — tiny pivot signals near-singularity and large condition number ≈ 10⁸.' },
      ],
    },
    {
      id: 'c4',
      title: 'Determinant via LU',
      description: 'Compute det(A) from the U diagonal and verify against the expected value.',
      objective: 'Demonstrate that det(A) = (±1) × Π uᵢᵢ — much faster than cofactor expansion.',
      difficulty: 'medium',
      steps: [
        { step: 1, instruction: 'Factor [[3,1,2],[1,4,1],[2,1,3]] and read off the U diagonal.', actionLabel: 'Factor and read U' },
        { step: 2, instruction: 'Compute the product of U diagonals. Matches det(A) = 26?', expectedOutcome: 'Π uᵢᵢ = 26 (confirm row swaps for sign).' },
      ],
    },
  ],

  summary: {
    keyPoints: [
      { title: 'Factorization', description: 'A = LU: L stores multipliers, U is the upper-triangular result', icon: '🔢' },
      { title: 'Multiple RHS', description: 'O(n³) once, O(n²) per additional b — the key advantage', icon: '⚡' },
      { title: 'Determinant', description: 'det(A) = (±1) × Π uᵢᵢ — trivial from U', icon: '📊' },
      { title: 'Pivoting', description: 'PA = LU ensures stability; always permute b too', icon: '🔄' },
      { title: 'vs Cholesky', description: 'Use Cholesky for SPD — 2× faster, no pivoting needed', icon: '⚖️' },
    ],
    cheatSheetFormulas: [
      { label: 'Factorization', latex: 'PA = LU', isKeyFormula: true },
      { label: 'Forward sub', latex: 'y_i = b_i - \\sum_{j<i} l_{ij} y_j', isKeyFormula: true },
      { label: 'Back sub', latex: 'x_i = (y_i - \\sum_{j>i} u_{ij} x_j) / u_{ii}', isKeyFormula: true },
      { label: 'Determinant', latex: '\\det A = (-1)^{\\text{swaps}} \\prod_i u_{ii}' },
    ],
    nextSteps: [
      { label: 'Cholesky Decomposition', description: 'Specialized LU for symmetric positive-definite matrices', path: '/lu-decomposition/cholesky' },
      { label: 'Optimization', description: 'Use linear systems in gradient-based optimization', path: '/optimization' },
    ],
  },
}
