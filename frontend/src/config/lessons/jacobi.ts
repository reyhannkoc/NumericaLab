import type { LessonConfig } from '@/types/lesson.types'

export const JACOBI_CONFIG: LessonConfig = {
  header: {
    moduleId: 'linear-systems',
    moduleColor: '#14b8a6',
    title: 'Jacobi Method',
    subtitle: 'Parallel iterative solver — all unknowns updated simultaneously',
    difficulty: 'intermediate',
    estimatedMinutes: 50,
    objectives: [
      'Derive the Jacobi update from diagonal isolation',
      'Understand why Jacobi uses only old values (vs Gauss-Seidel)',
      'Apply strict diagonal dominance as a convergence criterion',
      'Recognize the parallelization advantage over Gauss-Seidel',
      'Compare convergence rates and identify when Jacobi is preferred',
    ],
    prerequisites: [
      { title: 'Gauss–Seidel Method', path: '/linear-systems/gauss-seidel', required: true },
    ],
    tags: ['iterative', 'parallel', 'diagonal dominance', 'convergence', 'matrix splitting'],
  },

  motivation: {
    problemStatement:
      'A weather simulation runs on 1000 GPU cores. Each core handles a portion of the atmospheric grid. ' +
      'Gauss-Seidel requires sequential updates — it cannot be parallelized. Jacobi can be.',
    whyItMatters:
      'Modern scientific computing runs on massively parallel hardware (GPUs, distributed clusters). ' +
      'Jacobi\'s fully parallel update structure maps perfectly to GPU architectures, making it the ' +
      'foundation of parallel linear algebra on modern hardware.',
    historicalBackground:
      'Carl Gustav Jacob Jacobi (1846) proposed the method while studying systems arising in ' +
      'astronomical orbit calculations. Although Gauss-Seidel converges faster on single cores, ' +
      'Jacobi dominates in HPC environments where thousands of cores are available.',
    engineeringMotivation:
      'Graphics processor (GPU) solvers for finite element analysis use Jacobi-type iterations because ' +
      'the GPU\'s SIMD architecture executes all update operations simultaneously. ' +
      'NVIDIA\'s cuSPARSE and similar libraries use Jacobi-based preconditioners for this reason.',
    motivatingExample: {
      title: '3×3 system: all xᵢ updated simultaneously',
      description:
        '[5,-1,0;-1,5,-1;0,-1,5]x=[4,3,4]. Jacobi iter 1 from x=[0,0,0]: ' +
        'ALL computed with old values: x₁=(4+0)/5=0.8, x₂=(3+0+0)/5=0.6, x₃=(4+0)/5=0.8 simultaneously.',
      expression: 'xᵢ⁽ᵏ⁺¹⁾ = (bᵢ − Σⱼ≠ᵢ aᵢⱼxⱼ⁽ᵏ⁾) / aᵢᵢ',
      result: 'All n components computed in parallel — O(nnz/p) time on p processors',
    },
  },

  theory: {
    overview:
      'The Jacobi method solves Ax=b by isolating each xᵢ using only old (current-iteration) values. ' +
      'All n components of x⁽ᵏ⁺¹⁾ are computed simultaneously from x⁽ᵏ⁾, then the entire vector is replaced. ' +
      'This "all-or-nothing" update is fully parallelizable but converges ~2× slower than Gauss-Seidel.',
    intuition:
      'Imagine updating all springs in a mechanical system simultaneously: freeze all positions, ' +
      'compute each new position based on its frozen neighbors, then update all at once. ' +
      'This is mathematically cleaner but physically suboptimal — Gauss-Seidel uses the "fresh" ' +
      'updates immediately, like a faster feedback loop.',
    advantages: [
      'Fully parallel: all n updates computed independently (SIMD/GPU friendly)',
      'Simpler implementation: no sequential dependency between components',
      'Convergent for strictly diagonally dominant AND irreducibly diagonally dominant matrices',
      'For some problem classes (e.g., 2-cyclic systems), Jacobi and GS have the same convergence rate',
    ],
    limitations: [
      '~2× slower convergence than Gauss-Seidel for most sequential problems',
      'Requires strictly diagonal dominance (more restrictive than GS convergence conditions)',
      'Extra memory: needs both x⁽ᵏ⁾ and x⁽ᵏ⁺¹⁾ arrays simultaneously',
      'May diverge for systems where Gauss-Seidel converges (spectral radius ≥ 1)',
    ],
    keyInsights: [
      'The Jacobi iteration matrix: M_J = D⁻¹(L+U) = −D⁻¹(A−D)',
      'ρ(M_GS) = ρ(M_J)² for consistently ordered matrices (tridiagonal systems)',
      'Parallel efficiency: wall-clock time = serial_time / p for p processors (perfect scaling)',
    ],
  },

  mathFoundation: {
    formulas: [
      {
        label: 'Jacobi Update Formula',
        latex:
          'x_i^{(k+1)} = \\frac{1}{a_{ii}}\\left(b_i - \\sum_{j \\neq i} a_{ij}\\,x_j^{(k)}\\right)',
        description: 'All j use OLD values x_j⁽ᵏ⁾ — no in-place updates within a sweep',
        isKeyFormula: true,
      },
      {
        label: 'Matrix Form',
        latex: 'x^{(k+1)} = D^{-1}(b - (L+U)x^{(k)}) = D^{-1}b - D^{-1}(L+U)x^{(k)}',
        description: 'A = D + L + U. Jacobi iteration matrix M_J = −D⁻¹(L+U)',
      },
      {
        label: 'Convergence Rate',
        latex: '\\|x^{(k)} - x^*\\| \\leq \\rho(M_J)^k \\|x^{(0)} - x^*\\|',
        description: 'Linear convergence: error decreases by factor ρ(M_J) each iteration',
        isKeyFormula: true,
      },
      {
        label: 'Strict Diagonal Dominance',
        latex: '|a_{ii}| > \\sum_{j \\neq i}|a_{ij}| \\quad \\forall\\, i \\implies \\rho(M_J) < 1',
        description: 'Sufficient condition for Jacobi convergence for any starting vector',
        isKeyFormula: true,
      },
      {
        label: 'Jacobi vs GS Spectral Radius',
        latex: '\\rho(M_{GS}) = \\rho(M_J)^2 \\quad (\\text{consistently ordered A})',
        description: 'GS spectral radius is the square of Jacobi — Gauss-Seidel needs half the iterations',
      },
    ],
    symbols: [
      { symbol: 'D', definition: 'Diagonal of A: D = diag(a₁₁, a₂₂, ..., aₙₙ)' },
      { symbol: 'L+U', definition: 'Off-diagonal part of A = A − D' },
      { symbol: 'M_J', definition: 'Jacobi iteration matrix: M_J = −D⁻¹(L+U)' },
      { symbol: 'ρ(M)', definition: 'Spectral radius: max |eigenvalue| of iteration matrix M' },
    ],
    derivationSteps: [
      {
        step: 1,
        description: 'Rewrite Ax=b as Dx = b − (L+U)x',
        latex: 'Dx = b - (L+U)x \\implies x = D^{-1}b - D^{-1}(L+U)x',
      },
      {
        step: 2,
        description: 'This fixed-point equation x = f(x) suggests the Jacobi iteration',
        latex: 'x^{(k+1)} = D^{-1}\\bigl[b - (L+U)x^{(k)}\\bigr]',
      },
      {
        step: 3,
        description: 'Component-wise: isolate xᵢ in row i using all old x_j⁽ᵏ⁾',
        latex: 'x_i^{(k+1)} = \\frac{1}{a_{ii}}\\left(b_i - \\sum_{j\\neq i}a_{ij}x_j^{(k)}\\right)',
      },
    ],
    assumptions: [
      'aᵢᵢ ≠ 0 for all i',
      'A is strictly diagonally dominant (sufficient) or spectral radius ρ(M_J) < 1 (necessary and sufficient)',
    ],
    convergenceCondition: 'ρ(M_J) = ρ(D⁻¹(L+U)) < 1. Sufficient: strictly diagonally dominant.',
  },

  errorAnalysis: {
    metrics: [
      {
        label: 'Iteration Error',
        formula: '‖x⁽ᵏ⁺¹⁾ − x⁽ᵏ⁾‖',
        description: 'Difference between consecutive iterates — used as stopping criterion',
      },
      {
        label: 'Residual',
        formula: '‖Ax⁽ᵏ⁾ − b‖',
        description: 'Should approach 0 as k → ∞. More informative than iteration error for ill-conditioned systems.',
      },
      {
        label: 'Convergence Factor',
        formula: 'ρ(M_J) = max |λᵢ(D⁻¹(L+U))|',
        description: 'Per-iteration error reduction factor. Must be < 1 for convergence.',
      },
    ],
    stabilityNote:
      'For SDD matrices, Jacobi is unconditionally stable. ' +
      'For non-SDD matrices, convergence depends entirely on ρ(M_J).',
    floatingPointNote:
      'Like Gauss-Seidel, Jacobi accumulates floating-point errors slowly. ' +
      'The total error after k iterations is O(kε_mach), far less than the O(n³ε_mach) of direct methods.',
  },

  performance: {
    complexity: {
      timeComplexity: 'O(k·nnz) serial, O(k·nnz/p) parallel (p processors)',
      spaceComplexity: 'O(2n) — needs both x⁽ᵏ⁾ and x⁽ᵏ⁺¹⁾',
      convergenceOrder: 'Linear — ‖error‖ₖ ≈ ρᵏ',
      convergenceOrderNote: 'Typically 2× slower than Gauss-Seidel in serial, but GPU-accelerated Jacobi can be faster in practice',
    },
    bestCase: 'Highly diagonal dominant system on GPU: near-perfect parallel scaling',
    worstCase: 'Weakly diagonal dominant system: ρ close to 1, very slow convergence',
    typicalIterations: 'SDD system: 2× more iterations than GS. But each iteration is fully parallel → competitive on modern hardware',
  },

  comparison: {
    methods: ['Jacobi', 'Gauss–Seidel', 'Gaussian Elim.'],
    criteria: ['Update rule', 'Parallelism', 'Memory', 'Convergence', 'Best architecture'],
    table: [
      {
        criterion: 'Update rule',
        'Jacobi': 'All xᵢ⁽ᵏ⁺¹⁾ from old x⁽ᵏ⁾',
        'Gauss–Seidel': 'xᵢ⁽ᵏ⁺¹⁾ from new x⁽ᵏ⁺¹⁾ (j<i)',
        'Gaussian Elim.': 'Direct — no iterations',
      },
      {
        criterion: 'Parallelism',
        'Jacobi': '✓ Fully parallel (n independent ops)',
        'Gauss–Seidel': '❌ Sequential (dependency chain)',
        'Gaussian Elim.': 'Partial (panel factorization)',
      },
      {
        criterion: 'Memory',
        'Jacobi': 'O(2n) — two x vectors',
        'Gauss–Seidel': 'O(n) — in-place',
        'Gaussian Elim.': 'O(n²) — dense',
      },
      {
        criterion: 'Convergence',
        'Jacobi': 'ρ_J iterations (slower)',
        'Gauss–Seidel': 'ρ_J² iterations (2× faster)',
        'Gaussian Elim.': 'Exact in O(n³) flops',
      },
      {
        criterion: 'Best architecture',
        'Jacobi': 'GPU, distributed HPC',
        'Gauss–Seidel': 'CPU serial/OpenMP',
        'Gaussian Elim.': 'Dense n<10³, CPU BLAS',
      },
    ],
    summary:
      'Choose Jacobi for GPU/massively parallel systems, Gauss-Seidel for CPU serial codes, ' +
      'Gaussian elimination for small dense systems. The "best" method is architecture-dependent.',
  },

  engineeringApplications: [
    {
      field: 'GPU Computing',
      title: 'CUDA-based Sparse Linear Solver',
      description:
        'NVIDIA cuSPARSE implements Jacobi iteration on GPU because each kernel call computes ' +
        'all n components in parallel. For 10⁶ unknowns and 1000 GPU cores: 10³× speedup vs serial.',
      example: '10⁶ unknowns on NVIDIA A100: Jacobi step in 1 ms vs 1000 ms serial Gauss-Seidel',
      icon: '🖥️',
      difficulty: 'advanced',
    },
    {
      field: 'Image Processing',
      title: 'Parallel Bilateral Filtering',
      description:
        'Edge-preserving smoothing as a linear system is solved by Jacobi on GPU. ' +
        'Each pixel update depends only on its old-iteration neighbors — perfect parallel structure.',
      example: '4K image (8MP): 8×10⁶ pixel unknowns → Jacobi 10 iters on GPU in 50 ms',
      icon: '🎨',
      difficulty: 'intermediate',
    },
    {
      field: 'Computational Physics',
      title: 'Lattice Boltzmann Fluid Simulation',
      description:
        'LBM fluid simulations update all lattice cells simultaneously — a natural Jacobi pattern. ' +
        'This makes LBM one of the most GPU-friendly CFD methods.',
      example: 'N×N lattice: each cell computes new distribution from old neighbors — pure Jacobi',
      icon: '🌊',
      difficulty: 'advanced',
    },
    {
      field: 'Power Systems',
      title: 'Decentralized Smart Grid Optimization',
      description:
        'In distributed power grid optimization, each substation solves for its voltages using ' +
        'the previous iteration\'s values from neighboring substations — the Jacobi pattern.',
      example: '100 substations, each on a separate processor: one Jacobi sweep per communication round',
      icon: '⚡',
      difficulty: 'advanced',
    },
    {
      field: 'Machine Learning',
      title: 'Distributed Least Squares Training',
      description:
        'Training linear models on distributed data uses Jacobi-type averaging: each node computes ' +
        'its gradient from local data; all nodes exchange and update simultaneously.',
      example: 'Federated learning: 100 devices each compute local update, then average (Jacobi step)',
      icon: '🤖',
      difficulty: 'advanced',
    },
  ],

  commonMistakes: [
    {
      id: 'm1',
      title: 'Using updated values within the same sweep',
      description:
        'If you write x[i] = new value and later use x[i] in the same sweep, you\'ve implemented Gauss-Seidel, not Jacobi. ' +
        'Jacobi requires a copy of the old vector.',
      wrongApproach: 'x[0] = (b[0] - a[0][1]*x[1]) / a[0][0]; x[1] = (b[1] - a[1][0]*x[0]) / a[1][1] — uses new x[0]!',
      correctApproach: 'x_new[i] = (b[i] - sum(a[i][j]*x_old[j] for j≠i)) / a[i][i]; x_old = x_new',
      icon: '⚠️',
    },
    {
      id: 'm2',
      title: 'Applying Jacobi to non-SDD matrices',
      description:
        'Jacobi converges only for SDD matrices (sufficient condition). Unlike Gauss-Seidel which also ' +
        'converges for SPD matrices, Jacobi can diverge on some SPD systems.',
      wrongApproach: 'Apply Jacobi to any SPD matrix expecting convergence',
      correctApproach: 'Check strict diagonal dominance. If not satisfied, use GS or direct methods.',
      icon: '📉',
    },
    {
      id: 'm3',
      title: 'Ignoring the extra memory requirement',
      description:
        'Jacobi needs both x⁽ᵏ⁾ and x⁽ᵏ⁺¹⁾ simultaneously. Gauss-Seidel updates in-place. ' +
        'For n = 10⁶ floats, this is an extra 8 MB — significant on embedded systems.',
      wrongApproach: 'Overwrite x[i] in-place during Jacobi — converts it to Gauss-Seidel',
      correctApproach: 'Maintain two arrays; swap at end of each sweep',
      icon: '💾',
    },
    {
      id: 'm4',
      title: 'Expecting Jacobi to always converge faster on parallel hardware',
      description:
        'Jacobi\'s parallel advantage holds when the number of parallel processors p ≈ n. ' +
        'For p << n, the serial wall-clock comparison still favors GS (fewer iterations × same per-iteration cost).',
      wrongApproach: 'Always choose Jacobi for parallel hardware, regardless of n and p',
      correctApproach: 'Choose Jacobi when p ≈ n/nnz, so the parallel speedup overcomes the 2× iteration disadvantage',
      icon: '🖥️',
    },
  ],

  practiceProblems: [
    {
      id: 'p1',
      title: 'Jacobi iteration by hand (2×2)',
      description: 'Solve [4,-1;-1,4]x=[3,3] by Jacobi. Compute 3 iterations starting from x=[0,0].',
      difficulty: 'easy',
      params: { matrix_a: [[4,-1],[-1,4]], vector_b: [3,3], tolerance: 1e-8 },
      hint: 'x₁⁽¹⁾=(3+x₂⁽⁰⁾)/4=0.75, x₂⁽¹⁾=(3+x₁⁽⁰⁾)/4=0.75 (use x⁽⁰⁾=[0,0]).',
      expectedAnswer: 'k=0: [0,0]. k=1: [0.75,0.75]. k=2: [0.9375,0.9375]. k=3: [0.984,0.984]. Converges to [1,1].',
    },
    {
      id: 'p2',
      title: 'Compute spectral radius from eigenvalues',
      description: 'For A=[4,-1;-1,4], find M_J = D⁻¹(L+U) and compute ρ(M_J). Verify < 1.',
      difficulty: 'medium',
      hint: 'D=[4,0;0,4], L+U=[0,1;1,0]. M_J=(1/4)[0,1;1,0]. Eigenvalues: ±1/4. ρ=1/4.',
      expectedAnswer: 'M_J = [[0,0.25],[0.25,0]]. Eigenvalues ±0.25. ρ=0.25 < 1 → converges. Each iteration reduces error by 75%.',
    },
    {
      id: 'p3',
      title: 'Jacobi vs Gauss-Seidel iteration comparison',
      description: 'For [[5,-1,0,0],[-1,5,-1,0],[0,-1,5,-1],[0,0,-1,5]]x=[4,3,3,4] with x⁰=[0,0,0,0], compare iteration counts.',
      difficulty: 'medium',
      params: { matrix_a: [[5,-1,0,0],[-1,5,-1,0],[0,-1,5,-1],[0,0,-1,5]], vector_b: [4,3,3,4], tolerance: 1e-8 },
      hint: 'For tridiagonal SDD: ρ_GS = ρ_J². Count iterations in playground for both methods.',
      expectedAnswer: 'Jacobi ≈ 25-30 iters, GS ≈ 12-15 iters. Ratio ≈ 2:1 as predicted by theory.',
    },
    {
      id: 'p4',
      title: 'Divergence: find critical parameter',
      description: 'For which α does [[α,1],[1,α]]x=[5,5] diverge with Jacobi? (Convergence requires ρ < 1.)',
      difficulty: 'hard',
      hint: 'M_J = [[0,1/α],[1/α,0]]. Eigenvalues ±1/α. ρ=1/|α|. Diverges when |α| < 1.',
      expectedAnswer: 'Jacobi diverges when |α| ≤ 1 (ρ=1/|α| ≥ 1). Converges for |α| > 1. Check: |a₁₁|=|α|>|a₁₂|=1 iff |α|>1.',
    },
  ],

  interactiveChallenges: [
    {
      id: 'c1',
      title: 'Jacobi vs Gauss-Seidel: Same System',
      description: 'On the same diagonally dominant system, compare iteration counts for both methods.',
      objective: 'Confirm ρ_GS ≈ ρ_J² — GS converges in half as many iterations.',
      difficulty: 'easy',
      steps: [
        { step: 1, instruction: 'Solve [5,-1;-1,5]x=[4,4] with Jacobi. Count iterations.', actionLabel: 'Run Jacobi' },
        { step: 2, instruction: 'Switch to Gauss-Seidel. Same system. Count iterations.', expectedOutcome: 'GS ≈ half the iterations of Jacobi' },
      ],
    },
    {
      id: 'c2',
      title: 'Convergence Rate from Plot',
      description: 'Read off the spectral radius ρ from the residual vs iteration plot.',
      objective: 'Estimate ρ empirically and compare with theoretical ρ = max |eigenvalue| of M_J.',
      difficulty: 'medium',
      steps: [
        { step: 1, instruction: 'Run Jacobi on [4,-1;-1,4]x=[3,3]. Look at error vs iteration log plot.', actionLabel: 'Run' },
        { step: 2, instruction: 'Estimate the slope = log₁₀(error(k+1)/error(k)). What is ρ?', expectedOutcome: 'Slope ≈ log₁₀(0.25) ≈ −0.6. ρ ≈ 0.25 matches theory.' },
      ],
    },
    {
      id: 'c3',
      title: 'Observe Divergence',
      description: 'Apply Jacobi to a non-SDD system and watch the error grow.',
      objective: 'See in real-time how the iteration error increases when ρ > 1.',
      difficulty: 'medium',
      steps: [
        { step: 1, instruction: 'Apply Jacobi to [1,2;2,1]x=[3,3] (not SDD). Run 10 iterations.', actionLabel: 'Run (diverge)' },
        { step: 2, instruction: 'Check the error column in the iteration table. Does it increase?', expectedOutcome: 'Error grows geometrically — ρ = 2 > 1 → diverges' },
        { step: 3, instruction: 'Swap to [3,2;2,3] (|3|>|2| → SDD). Does it converge now?', expectedOutcome: 'ρ=2/3 < 1 → converges now' },
      ],
    },
    {
      id: 'c4',
      title: 'Parallel vs Serial Efficiency Thought Experiment',
      description: 'Estimate the GPU speedup for Jacobi vs serial GS on a large system.',
      objective: 'Understand when Jacobi\'s parallel advantage overcomes its slower convergence.',
      difficulty: 'hard',
      steps: [
        { step: 1, instruction: 'For a 10,000-unknown system: Jacobi 200 iters (2× GS). On 100 GPUs, each iter takes 1/100 of serial time. Compare total time.', actionLabel: 'Calculate' },
        { step: 2, instruction: 'Jacobi: 200 × (1/100) = 2 units. GS: 100 × 1 = 100 units. Which wins?', expectedOutcome: 'Jacobi on 100 GPUs: 50× faster wall-clock time than serial GS — parallelism dominates.' },
      ],
    },
  ],

  summary: {
    keyPoints: [
      { title: 'Key idea', description: 'All xᵢ computed simultaneously from old values — fully parallel', icon: '⚡' },
      { title: 'Convergence', description: 'Linear rate ρ_J per iteration. SDD → guaranteed convergence', icon: '📉' },
      { title: 'vs GS', description: '~2× slower per serial CPU-time, but GPU-parallel → competitive', icon: '🏁' },
      { title: 'Memory', description: 'Needs 2 vectors: x_old and x_new — extra O(n) vs GS', icon: '💾' },
      { title: 'Best for', description: 'GPU/distributed computing, SDD systems, HPC applications', icon: '🖥️' },
    ],
    cheatSheetFormulas: [
      {
        label: 'Jacobi Update',
        latex:
          'x_i^{(k+1)} = \\frac{1}{a_{ii}}\\left(b_i - \\sum_{j\\neq i}a_{ij}x_j^{(k)}\\right)',
        isKeyFormula: true,
      },
      {
        label: 'SDD Convergence',
        latex: '|a_{ii}| > \\sum_{j\\neq i}|a_{ij}| \\implies \\rho(M_J) < 1',
      },
      {
        label: 'Jacobi vs GS',
        latex: '\\rho(M_{GS}) = \\rho(M_J)^2 \\quad (\\text{consistently ordered})',
      },
    ],
    nextSteps: [
      { label: 'Linear Systems Comparison', description: 'Direct vs iterative — complete picture', path: '/linear-systems/comparison' },
      { label: 'LU Decomposition', description: 'Factor A=LU for efficient multi-RHS solving', path: '/lu-decomposition' },
    ],
  },
}
