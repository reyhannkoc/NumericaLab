import type { LessonConfig } from '@/types/lesson.types'

export const GRADIENT_DESCENT_CONFIG: LessonConfig = {
  header: {
    moduleId: 'optimization',
    moduleColor: '#06b6d4',
    title: 'Gradient Descent',
    subtitle: 'Follow the steepest downhill direction: x_{k+1} = x_k − α·f\'(x_k)',
    difficulty: 'intermediate',
    estimatedMinutes: 60,
    objectives: [
      'Derive gradient descent from the first-order Taylor approximation',
      'Understand the role of the learning rate α in convergence',
      'Recognize convergence conditions: L-smooth, convex, strong convexity',
      'Implement gradient descent for 1D and 2D functions',
      'Compare fixed step size, line search, and momentum variants',
    ],
    prerequisites: [
      { title: 'Differentiation', path: '/differentiation', required: true },
      { title: 'Golden Section Search', path: '/optimization/golden-section', required: false },
    ],
    tags: ['gradient', 'optimization', 'learning rate', 'convergence', 'machine learning'],
  },

  motivation: {
    problemStatement:
      'Training a neural network with 10⁸ parameters: find weights w that minimize loss L(w). ' +
      'No closed-form solution exists. Computing Hessians is O(n²) = too expensive.',
    whyItMatters:
      'Gradient descent is the algorithm behind virtually all of modern machine learning. ' +
      'Every neural network training algorithm — Adam, RMSprop, SGD — is a variant of ' +
      'gradient descent. It is the most widely implemented algorithm in the world.',
    historicalBackground:
      'Cauchy (1847) first proposed the method of steepest descent. ' +
      'Robbins & Monro (1951) introduced stochastic gradient descent (SGD) for random noise. ' +
      'The deep learning revolution (2012+) made GD the dominant computational tool in AI.',
    engineeringMotivation:
      'MATLAB\'s fminsearch, scipy\'s minimize, PyTorch\'s optimizer.step() — all implement ' +
      'gradient descent variants. Every LLM, image classifier, and recommendation system was ' +
      'trained with gradient descent.',
    motivatingExample: {
      title: 'Minimize f(x) = x⁴ − 4x² + x from x₀ = 3',
      description:
        'GD step: x₁ = 3 − α·f\'(3) = 3 − α·(4×27 − 8×3 + 1) = 3 − α·85. ' +
        'With α = 0.01: x₁ = 3 − 0.85 = 2.15. Continue until convergence.',
      expression: 'x_{k+1} = x_k − α · f\'(x_k)',
      result: 'Converges to local minimum near x ≈ −1.37 (or x ≈ 1.49 depending on start)',
    },
  },

  theory: {
    overview:
      'Gradient descent minimizes f(x) by repeatedly moving in the direction of the negative gradient — ' +
      'the direction of steepest descent. The learning rate α controls the step size. ' +
      'For 1D: x_{k+1} = x_k − α·f\'(x_k). For nD: x_{k+1} = x_k − α·∇f(x_k).',
    intuition:
      'Imagine standing on a hilly terrain in thick fog. You can only feel the local slope. ' +
      'Gradient descent says: take a step in the direction you\'re sliding downhill. ' +
      'The learning rate α is how big a step you take.',
    advantages: [
      'Works in any dimension — from 1D to 10⁸ parameters',
      'Only needs gradient (first-order) — O(n) cost vs O(n²) for Hessian',
      'Simple to implement; widely supported in automatic differentiation frameworks',
      'Stochastic variant (SGD) scales to massive datasets',
    ],
    limitations: [
      'Sensitive to learning rate α: too large = diverge, too small = slow',
      'Finds local minima for nonconvex f — no guarantee of global minimum',
      'Slow on ill-conditioned problems (gradient oscillates in narrow valleys)',
      'No automatic stopping criterion — must choose tolerance carefully',
    ],
    keyInsights: [
      'L-smooth functions: α < 2/L ensures descent. Optimal fixed α = 1/L.',
      'Strongly convex (μ > 0): converges at rate (1 − μ/L)^k — geometric',
      'Condition number κ = L/μ controls convergence: high κ → slow convergence',
    ],
  },

  mathFoundation: {
    formulas: [
      {
        label: 'Gradient Descent Update',
        latex: 'x_{k+1} = x_k - \\alpha \\nabla f(x_k)',
        description: 'Core iteration: subtract a scaled gradient. α is the learning rate (step size).',
        isKeyFormula: true,
      },
      {
        label: 'Taylor Justification',
        latex: 'f(x - \\alpha g) \\approx f(x) - \\alpha \\|g\\|^2 \\quad (g = \\nabla f(x))',
        description: 'For small α, f decreases by α‖∇f‖² — guaranteed descent when α < 2/L',
      },
      {
        label: 'Convergence (L-smooth, convex)',
        latex: 'f(x_k) - f^* \\leq \\frac{\\|x_0 - x^*\\|^2}{2\\alpha k}',
        description: 'Sublinear O(1/k) convergence for convex smooth functions',
        isKeyFormula: true,
      },
      {
        label: 'Convergence (strongly convex)',
        latex: '\\|x_k - x^*\\|^2 \\leq \\left(1 - \\frac{\\mu}{L}\\right)^k \\|x_0 - x^*\\|^2',
        description: 'Linear geometric convergence for strongly convex functions. Rate = 1 − μ/L.',
        isKeyFormula: true,
      },
      {
        label: 'Optimal learning rate',
        latex: '\\alpha^* = \\frac{1}{L} \\quad (L = \\max |f\'\'(x)|)',
        description: 'For L-smooth f, α* = 1/L gives fastest fixed-step convergence',
      },
    ],
    symbols: [
      { symbol: 'α', definition: 'Learning rate (step size). Too large: diverge. Too small: slow.' },
      { symbol: 'L', definition: 'Lipschitz constant of the gradient: |f\'(x) − f\'(y)| ≤ L|x−y|' },
      { symbol: 'μ', definition: 'Strong convexity constant: f(y) ≥ f(x) + ∇f(x)ᵀ(y−x) + μ/2‖y−x‖²' },
      { symbol: 'κ', definition: 'Condition number κ = L/μ — determines convergence rate for strongly convex f' },
    ],
    derivationSteps: [
      {
        step: 1,
        description: 'First-order Taylor expansion: f(x − α∇f) ≈ f(x) − α‖∇f‖²',
        latex: 'f(x + d) \\approx f(x) + \\nabla f(x)^\\top d',
      },
      {
        step: 2,
        description: 'Choose d = −α∇f to minimize the linear model: d* = −α∇f',
        latex: '\\min_d f(x) + \\nabla f(x)^\\top d \\quad \\text{subject to } \\|d\\| = \\alpha\\|\\nabla f\\|',
      },
      {
        step: 3,
        description: 'The update x ← x − α∇f is the steepest descent step',
        latex: 'x_{k+1} = x_k - \\alpha \\nabla f(x_k)',
      },
    ],
    assumptions: [
      'f is differentiable (gradient exists)',
      'f is L-smooth: ‖∇f(x) − ∇f(y)‖ ≤ L‖x−y‖',
      'For convergence guarantees: α ≤ 2/L for fixed step size',
    ],
    convergenceCondition: 'α < 2/L (L-smooth) ensures each step decreases f. Optimal α = 1/L.',
  },

  errorAnalysis: {
    metrics: [
      {
        label: 'Gradient Norm',
        formula: '‖∇f(xₖ)‖',
        description: 'Approaches 0 at a critical point. Standard stopping criterion: ‖∇f(xₖ)‖ < ε',
      },
      {
        label: 'Function Decrease',
        formula: 'f(xₖ) − f(xₖ₊₁)',
        description: 'Each step should decrease f. Negative value signals learning rate too large.',
      },
      {
        label: 'Step Norm',
        formula: '‖xₖ₊₁ − xₖ‖ = α‖∇f(xₖ)‖',
        description: 'Useful as a secondary stopping criterion',
      },
    ],
    stabilityNote:
      'For fixed α: stable iff α ≤ 2/L. At α = 2/L, gradient descent oscillates. ' +
      'For α > 2/L, the algorithm diverges exponentially.',
    floatingPointNote:
      'Gradient is computed numerically for black-box functions. ' +
      'Round-off in the gradient dominates convergence when ‖∇f‖ < √ε_mach × ‖f‖.',
  },

  performance: {
    complexity: {
      timeComplexity: 'O(k · n_grad) where n_grad = cost of one gradient evaluation',
      spaceComplexity: 'O(n) — stores only x and ∇f(x)',
      convergenceOrder: 'Sublinear O(1/k) for convex; linear O(ρᵏ) for strongly convex; quadratic for Newton\'s',
      convergenceOrderNote: 'SGD: O(1/√k) for convex. Adam/momentum: close to optimal rates in practice',
    },
    bestCase: 'Quadratic f with known L: optimal α = 1/L → converges in O(κ·log(1/ε)) steps',
    worstCase: 'Ill-conditioned (κ >> 1): very slow oscillation in narrow valleys',
    typicalIterations: 'Smooth strongly convex: ~100–1000 iters. Neural network training: 10⁵–10⁷ iters (mini-batch SGD)',
  },

  comparison: {
    methods: ['Gradient Descent', 'Golden Section', 'Newton\'s Method'],
    criteria: ['Derivatives needed', 'Convergence rate', 'Dimension', 'Robustness'],
    table: [
      { criterion: 'Derivatives needed', 'Gradient Descent': 'f\'(x) (gradient)', 'Golden Section': 'None (black-box)', 'Newton\'s Method': 'f\'(x) and f\'\'(x) (Hessian)' },
      { criterion: 'Convergence rate', 'Gradient Descent': 'Linear (strongly convex)', 'Golden Section': 'Linear (bracket)', 'Newton\'s Method': 'Quadratic (smooth)' },
      { criterion: 'Dimension', 'Gradient Descent': 'n ≥ 1 (any)', 'Golden Section': '1D only', 'Newton\'s Method': 'n ≥ 1 (Hessian expensive)' },
      { criterion: 'Robustness', 'Gradient Descent': 'Sensitive to α', 'Golden Section': 'Guaranteed for unimodal', 'Newton\'s Method': 'May diverge without trust region' },
    ],
    summary: 'Use gradient descent for high-dimensional ML problems. Use golden section for 1D black-box. Use Newton for small-scale problems where Hessian is cheap.',
  },

  engineeringApplications: [
    {
      field: 'Machine Learning',
      title: 'Neural Network Weight Training',
      description:
        'Training ResNet-50 (25M parameters): L = cross-entropy loss, x = weights. ' +
        'Mini-batch SGD with learning rate warmup is the standard algorithm.',
      example: 'ImageNet training: 90 epochs × 1.28M images / 256 batch size = 450,000 gradient steps',
      icon: '🤖',
      difficulty: 'advanced',
    },
    {
      field: 'Control Systems',
      title: 'PID Controller Auto-Tuning',
      description:
        'Minimize the integrated squared error (ISE) of a PID controller by gradient descent ' +
        'over the gains (Kp, Ki, Kd) using simulation-based gradient estimates.',
      example: 'PID gains: 3 parameters, quadratic-like ISE function → 50 gradient steps',
      icon: '🎛️',
      difficulty: 'intermediate',
    },
    {
      field: 'Computational Physics',
      title: 'Energy Minimization in Molecular Dynamics',
      description:
        'Minimize potential energy V(r) over atom positions r. ' +
        'Gradient of V is the negative force on each atom. This IS gradient descent = steepest descent energy minimization.',
      example: 'Protein folding: 10⁵ atoms, minimize V(r) for stable 3D structure',
      icon: '⚛️',
      difficulty: 'advanced',
    },
    {
      field: 'Computer Vision',
      title: 'Image Registration',
      description:
        'Align two images by minimizing ‖I₁(x) − I₂(T(x))‖² over transformation parameters T. ' +
        'Gradient of this sum-of-squares is computed efficiently via correlation.',
      example: 'Medical image registration: align CT and MRI scans using gradient descent on SSD',
      icon: '🔬',
      difficulty: 'intermediate',
    },
    {
      field: 'Structural Optimization',
      title: 'Topology Optimization (SIMP)',
      description:
        'Minimize structural compliance subject to volume constraint over density field ρ(x). ' +
        'Gradient (sensitivity) is computed via finite element adjoint method.',
      example: 'Bridge topology optimization: 10,000 density variables, 200 gradient iterations',
      icon: '🏗️',
      difficulty: 'advanced',
    },
  ],

  commonMistakes: [
    {
      id: 'm1',
      title: 'Learning rate too large: divergence',
      description: 'If α > 2/L, gradient descent overshoots and the function value INCREASES each step.',
      wrongApproach: 'α = 1.0 for f(x) = 10x² (L = 20) → α > 2/L = 0.1 → diverges',
      correctApproach: 'Start with α = 0.01, monitor f(xₖ). If f increases, halve α.',
      icon: '⚠️',
    },
    {
      id: 'm2',
      title: 'Stopping on f value difference instead of gradient norm',
      description: 'Near a flat plateau, f changes very slowly even though x hasn\'t reached x*. The gradient ‖∇f‖ is the correct convergence criterion.',
      wrongApproach: 'Stop when |f(xₖ₊₁) − f(xₖ)| < 10⁻⁶',
      correctApproach: 'Stop when ‖∇f(xₖ)‖ < 10⁻⁶ OR ‖xₖ₊₁ − xₖ‖ < 10⁻⁶',
      icon: '📏',
    },
    {
      id: 'm3',
      title: 'Finding a saddle point instead of a minimum',
      description: 'Gradient descent converges to any critical point (∇f = 0), including saddle points and maxima. Always verify the Hessian is positive definite at the solution.',
      wrongApproach: 'Stop when ‖∇f‖ < ε and assume you found a minimum',
      correctApproach: 'Check f\'\'(x*) > 0 (1D) or all eigenvalues of Hessian > 0 (nD)',
      icon: '🎯',
    },
    {
      id: 'm4',
      title: 'No learning rate schedule (too aggressive fixed rate)',
      description: 'A fixed learning rate that works initially may cause oscillation near convergence. Use learning rate decay or line search for better final accuracy.',
      wrongApproach: 'Fixed α = 0.01 throughout — fast initially, oscillates near x*',
      correctApproach: 'Decay: α_k = α₀/(1 + β·k), or backtracking line search for exact step size',
      icon: '📉',
    },
  ],

  practiceProblems: [
    {
      id: 'p1',
      title: 'Two GD iterations by hand',
      description: 'Minimize f(x) = x² from x₀ = 4 with α = 0.3. Compute 2 iterations.',
      difficulty: 'easy',
      hint: 'f\'(x) = 2x. x₁ = 4 − 0.3×2×4 = 4 − 2.4 = 1.6. x₂ = 1.6 − 0.3×2×1.6 = ...',
      expectedAnswer: 'x₁ = 1.6, x₂ = 0.64. Rate: 0.4 per step (ρ = 1 − 2α = 1 − 0.6 = 0.4). Converges to x* = 0.',
    },
    {
      id: 'p2',
      title: 'Find optimal α for f(x) = Lx²/2',
      description: 'If f(x) = 5x²/2 (L = 5), what is α* that gives fastest convergence?',
      difficulty: 'easy',
      hint: 'α* = 1/L = 1/5 = 0.2. Check: ρ = 1 − α*L = 1 − 0.2×5 = 0. One step to minimum!',
      expectedAnswer: 'α* = 0.2. Convergence in exactly 1 iteration: x₁ = x₀ − 0.2×5x₀ = 0.',
    },
    {
      id: 'p3',
      title: 'Ill-conditioned function',
      description: 'Minimize f(x,y) = 100x² + y² (κ = 100). With α = 0.01, how many iterations to reach 10⁻⁶?',
      difficulty: 'medium',
      hint: 'L = 200 (max eigenvalue). α = 0.01 < 2/L = 0.01. ρ = max(1 − α×μ, αL − 1) where μ = 2.',
      expectedAnswer: 'ρ ≈ 1 − 2α = 0.98 per step → (0.98)^k < 10⁻⁶ → k > 690 iterations! Condition number κ=100 → slow oscillation.',
    },
    {
      id: 'p4',
      title: 'Newton vs Gradient Descent',
      description: 'For f(x) = x⁴/4 from x₀ = 2, compare 3 GD steps (α = 0.1) vs 3 Newton steps.',
      difficulty: 'hard',
      hint: 'GD: x_{k+1} = x_k − 0.1×x_k³. Newton: x_{k+1} = x_k − f\'(x_k)/f\'\'(x_k) = x_k − x_k³/(3x_k²) = 2x_k/3.',
      expectedAnswer: 'GD (α=0.1): x₁=2-0.8=1.2, x₂=1.2-0.173=1.027, x₃≈0.92. Newton: x₁=4/3≈1.333, x₂=0.889, x₃=0.593. Newton converges faster (quadratic vs linear).',
    },
  ],

  interactiveChallenges: [
    {
      id: 'c1',
      title: 'Find the critical learning rate',
      description: 'Gradually increase α until gradient descent diverges.',
      objective: 'Find empirically the boundary α = 2/L beyond which the algorithm diverges.',
      difficulty: 'easy',
      steps: [
        { step: 1, instruction: 'Minimize f(x) = x² with α = 0.1, 0.5, 0.9, 1.0, 1.1. Observe.', actionLabel: 'Sweep α' },
        { step: 2, instruction: 'For f(x) = x²: L = 2. Theoretical boundary: α = 1/L = 0.5, diverge at α > 1.', expectedOutcome: 'α < 1: converges. α = 1: oscillates. α > 1: diverges. Matches theory exactly.' },
      ],
    },
    {
      id: 'c2',
      title: 'Ill-conditioning: the ravine',
      description: 'Observe the "zigzag" pattern on elongated quadratics.',
      objective: 'Understand why high condition number slows gradient descent.',
      difficulty: 'medium',
      steps: [
        { step: 1, instruction: 'Minimize f(x,y) = 0.5x² + 50y² from (5, 5) with α = 0.01. Run 100 steps.', actionLabel: 'Run' },
        { step: 2, instruction: 'Does x converge fast? Does y? Are the paths zigzagging?', expectedOutcome: 'y converges in ~5 steps, x takes ~200 steps. Gradient zigzags along the long axis — classic ill-conditioning symptom.' },
      ],
    },
    {
      id: 'c3',
      title: 'Momentum comparison',
      description: 'Compare gradient descent with and without momentum.',
      objective: 'See how momentum (β > 0) accelerates convergence on ill-conditioned problems.',
      difficulty: 'medium',
      steps: [
        { step: 1, instruction: 'Minimize f(x) = x⁴ − 4x² with standard GD (α = 0.05).', actionLabel: 'Run GD' },
        { step: 2, instruction: 'Try gradient descent with momentum β = 0.9. Compare iteration counts.', expectedOutcome: 'Momentum: ~40% fewer iterations on the ill-conditioned landscape.' },
      ],
    },
    {
      id: 'c4',
      title: 'Escape from a saddle point?',
      description: 'Does gradient descent escape saddle points?',
      objective: 'Understand the saddle point problem in nonconvex optimization.',
      difficulty: 'hard',
      steps: [
        { step: 1, instruction: 'Minimize f(x) = x³ − 3x from x₀ = 0 with α = 0.1. What happens?', actionLabel: 'Start from saddle' },
        { step: 2, instruction: 'x=0 is a saddle point of this function (local max in one direction). Does GD escape?', expectedOutcome: 'x=0: f\'=−3 ≠ 0 (not a saddle), GD moves. Try x₀=√1=1 (local min) vs x₀=−1 (local max). Gradient descent is attracted to local minima but can get stuck near saddle points if started exactly there.' },
      ],
    },
  ],

  summary: {
    keyPoints: [
      { title: 'Core update', description: 'x_{k+1} = x_k − α·f\'(x_k)', icon: '⬇️' },
      { title: 'Learning rate', description: 'α < 2/L for convergence. Optimal: α = 1/L', icon: '⚖️' },
      { title: 'Convex rate', description: 'O(1/k) sublinear; O(ρᵏ) linear for strongly convex', icon: '📉' },
      { title: 'Local minima', description: 'Finds local min for nonconvex f — no global guarantee', icon: '⚠️' },
      { title: 'Applications', description: 'All of machine learning, optimization, physics', icon: '🌍' },
    ],
    cheatSheetFormulas: [
      { label: 'Update', latex: 'x_{k+1} = x_k - \\alpha \\nabla f(x_k)', isKeyFormula: true },
      { label: 'Convergence (str. convex)', latex: '\\|x_k - x^*\\|^2 \\leq (1 - \\mu/L)^k \\|x_0 - x^*\\|^2', isKeyFormula: true },
      { label: 'Stable if', latex: '\\alpha \\leq 2/L' },
    ],
    nextSteps: [
      { label: 'Optimization Comparison', description: 'GS vs GD vs Newton — when to use each', path: '/optimization/comparison' },
      { label: 'ODE Methods', description: 'Euler and Runge-Kutta for differential equations', path: '/ode' },
    ],
  },
}
