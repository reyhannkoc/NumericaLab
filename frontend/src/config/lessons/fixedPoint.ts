import type { LessonConfig } from '@/types/lesson.types'

export const FIXED_POINT_CONFIG: LessonConfig = {
  header: {
    moduleId: 'root-finding',
    moduleColor: '#6366f1',
    title: 'Fixed-Point Iteration',
    subtitle: 'Find x where g(x) = x by iterating x_{n+1} = g(x_n)',
    difficulty: 'introductory',
    estimatedMinutes: 40,
    objectives: [
      'Understand how any root-finding problem f(x)=0 can be rewritten as x=g(x)',
      'Apply the Banach fixed-point theorem to prove convergence',
      'Identify why |g\'(x*)| < 1 is the key convergence condition',
      'Recognize linear convergence and compare to Newton\'s quadratic convergence',
      'Construct convergent iterations g(x) from a given f(x)',
    ],
    prerequisites: [
      { title: 'Bisection Method', path: '/root-finding/bisection', required: false },
    ],
    tags: ['root-finding', 'iteration', 'contraction', 'cobweb'],
  },

  motivation: {
    problemStatement:
      'Solve x³ − x − 2 = 0. Rearranging: x = (x + 2)^{1/3} = g(x). ' +
      'Start with x₀ = 1.5: x₁ = (3.5)^{1/3} ≈ 1.518, x₂ ≈ 1.520, x₃ ≈ 1.5213 → converges to root ≈ 1.5214.',
    whyItMatters:
      'Fixed-point iteration is the conceptual foundation for a huge family of algorithms: ' +
      'Newton\'s method, power iteration for eigenvalues, the SIMPLE algorithm in CFD, ' +
      'and convergence of neural network training (viewed as optimization iterations).',
    historicalBackground:
      'The Banach Fixed-Point Theorem (Stefan Banach, 1922) provides the mathematical foundation: ' +
      'a contraction mapping on a complete metric space has a unique fixed point, ' +
      'and iteration converges from any starting point in the space.',
    engineeringMotivation:
      'Iterative methods for large linear systems (Jacobi, Gauss-Seidel) are fixed-point iterations. ' +
      'Understanding why they converge — and when they don\'t — directly applies to numerical PDE solvers.',
    motivatingExample: {
      title: 'x³ − x − 2 = 0 → g(x) = (x+2)^{1/3}',
      description: 'Starting x₀=1.5: x₁=1.5181, x₂=1.5207, x₃=1.5213. Converges linearly.',
      expression: 'x_{n+1} = g(x_n)',
      result: 'Root ≈ 1.5214. Converges in ~20 iterations to 8 decimal places.',
    },
  },

  theory: {
    overview:
      'Fixed-point iteration converts f(x) = 0 into the equivalent form x = g(x) ' +
      'by rearranging: g(x) = x + c·f(x) for some non-zero constant c, or other algebraic manipulations. ' +
      'Then iterate x_{n+1} = g(x_n) until |x_{n+1} − x_n| < tolerance.',
    intuition:
      'A fixed point x* satisfies g(x*) = x*. On the y=x line, it\'s where the curve y=g(x) crosses. ' +
      'The cobweb diagram makes this geometric: draw horizontal then vertical lines alternating between the curve and y=x. ' +
      'If the curve is "steep" (|g\'| > 1), the cobweb spirals outward (diverges). If "shallow" (|g\'| < 1), it spirals inward (converges).',
    advantages: [
      'Simplest possible implementation: one line of code',
      'No derivative required',
      'Can be constructed from any f(x)=0 in many ways',
    ],
    limitations: [
      'Convergence only if |g\'(x*)| < 1 — choice of g matters',
      'Linear convergence: slow compared to Newton\'s quadratic',
      'May diverge if starting point is too far from x*',
    ],
    keyInsights: [
      'Convergence rate asymptotic constant C = |g\'(x*)| — smaller is faster',
      'Any root-finding problem has infinitely many fixed-point reformulations; only some converge',
      'Newton\'s method IS fixed-point iteration with g(x) = x − f(x)/f\'(x) and C = 0 at x* → quadratic',
    ],
  },

  mathFoundation: {
    formulas: [
      {
        label: 'Fixed-Point Iteration',
        latex: 'x_{n+1} = g(x_n)',
        description: 'Simple one-step recurrence. Converges when |g\'(x*)| < 1.',
        isKeyFormula: true,
      },
      {
        label: 'Contraction Condition',
        latex: '|g\'(x)| \\leq k < 1 \\quad \\text{on interval } [a, b]',
        description: 'Banach theorem: g is a contraction on [a,b] → unique fixed point, converges from any x₀ ∈ [a,b]',
        isKeyFormula: true,
      },
      {
        label: 'Convergence Rate',
        latex: '|x_{n+1} - x^*| \\leq k\\,|x_n - x^*|',
        description: 'Linear convergence: error reduces by factor k = |g\'(x*)| at each step',
      },
      {
        label: 'Newton as Fixed Point',
        latex: 'g(x) = x - \\frac{f(x)}{f\'(x)} \\implies g\'(x^*) = 0 \\text{ (quadratic)}',
        description: "Newton's method is the special case where g'(x*) = 0, giving superlinear (quadratic) convergence",
      },
    ],
    symbols: [
      { symbol: 'g(x)', definition: 'The iteration function. Must satisfy g(x*) = x* and |g\'(x*)| < 1.' },
      { symbol: 'k', definition: 'Contraction constant: k = max|g\'(x)| on interval. k < 1 ensures convergence.' },
      { symbol: 'x*', definition: 'Fixed point / root: g(x*) = x*. Same as root of f(x) = x − g(x) = 0.' },
    ],
    derivationSteps: [
      { step: 1, description: 'Write f(x) = 0 as x = g(x) (many choices exist)', latex: 'f(x) = 0 \\iff x = g(x)' },
      { step: 2, description: 'Verify convergence: |g\'(x*)| < 1', latex: '|g\'(x^*)| < 1 \\implies \\text{converges}' },
      { step: 3, description: 'Iterate until |x_{n+1} − xₙ| < ε', latex: 'x_{n+1} = g(x_n)' },
    ],
    assumptions: ['g is differentiable near x*', '|g\'(x*)| < 1 (contraction condition)', 'x₀ is in the basin of attraction of x*'],
    convergenceCondition: 'Linear convergence with rate |g\'(x*)|. For fast convergence, choose g so that |g\'(x*)| is small.',
  },

  errorAnalysis: {
    metrics: [
      { label: 'Absolute Error', formula: '|xₙ − x*|', description: 'Actual error. Reduces by factor |g\'(x*)| each step.' },
      { label: 'Successive Difference', formula: '|x_{n+1} − xₙ|', description: 'Used as stopping criterion since x* is unknown.' },
    ],
    stabilityNote: 'If |g\'(x*)| > 1, the iteration diverges exponentially from x*. Choice of g(x) is critical.',
    floatingPointNote: 'For well-chosen g with |g\'(x*)| << 1, convergence is fast and floating-point roundoff is not a concern.',
  },

  performance: {
    complexity: {
      timeComplexity: 'O(N) iterations, each O(1) function evaluation',
      spaceComplexity: 'O(1) — only stores current x',
      convergenceOrder: 'Linear: O(kⁿ) where k = |g\'(x*)|',
      convergenceOrderNote: 'Much slower than Newton (quadratic). For k=0.5: 20 digits after 66 iters. Newton: 20 digits after 7 iters.',
    },
    bestCase: 'g\'(x*) ≈ 0 (approaches Newton speed) — choose g(x) = x − c·f(x)/f\'(x)',
    worstCase: 'g\'(x*) close to 1 (very slow) or |g\'(x*)| > 1 (diverge)',
    typicalIterations: '20–100 iterations for 8 decimal digits with k ≈ 0.5–0.9',
  },

  engineeringApplications: [
    {
      field: 'Numerical Linear Algebra',
      title: 'Jacobi and Gauss-Seidel as Fixed-Point Iterations',
      description: 'Ax = b → x = Bx + c. Each iterative linear solver is a fixed-point iteration with g(x) = Bx + c. Convergence iff spectral radius ρ(B) < 1.',
      example: 'Heat equation discretized: 1000×1000 tridiagonal system. Gauss-Seidel converges in ~500 fixed-point iterations.',
      icon: '🔥',
      difficulty: 'intermediate',
    },
    {
      field: 'Power Systems',
      title: 'Load Flow (Power Flow) Analysis',
      description: 'Power flow equations are highly nonlinear. The Gauss-Seidel power flow method solves them via fixed-point iteration on bus voltage phasors.',
      example: 'IEEE 14-bus test case: 14 complex voltage unknowns, ~30 fixed-point iterations to converge.',
      icon: '⚡',
      difficulty: 'intermediate',
    },
    {
      field: 'Image Processing',
      title: 'Iterative Image Reconstruction',
      description: 'Computed tomography (CT) reconstruction: algebraic reconstruction technique (ART) is a fixed-point iteration on the image pixels.',
      example: 'Medical CT: 256×256 image, ~10 ART iterations give clinically useful reconstruction.',
      icon: '🏥',
      difficulty: 'advanced',
    },
  ],

  commonMistakes: [
    {
      id: 'm1',
      title: 'Using a divergent rearrangement',
      description: 'For x³ − x − 2 = 0, the form x = x³ − 2 gives |g\'(x*)| = |3x*²| ≈ 6.9 > 1 → diverges.',
      wrongApproach: 'g(x) = x³ − 2 → |g\'(1.52)| ≈ 6.9 > 1 → diverges rapidly',
      correctApproach: 'g(x) = (x+2)^{1/3} → |g\'(1.52)| ≈ 0.12 < 1 → fast convergence',
      icon: '⚠️',
    },
    {
      id: 'm2',
      title: 'Not checking |g\'(x*)| before iterating',
      description: 'Always estimate |g\'| near the expected root before starting iteration.',
      wrongApproach: 'Just pick any rearrangement and start iterating',
      correctApproach: 'Compute |g\'(x)| at an initial estimate. If > 1, try a different g.',
      icon: '🔍',
    },
  ],

  practiceProblems: [
    {
      id: 'p1', title: 'Verify convergence condition',
      description: 'For x = cos(x), show |g\'(x*)| < 1 where g(x) = cos(x). x* ≈ 0.7391.',
      difficulty: 'easy', hint: 'g\'(x) = −sin(x). At x*≈0.7391: |g\'| = sin(0.7391) ≈ 0.674 < 1 ✓',
      expectedAnswer: '|g\'(0.7391)| = |−sin(0.7391)| ≈ 0.674 < 1. Converges with rate 0.674.',
    },
    {
      id: 'p2', title: 'Construct a convergent g(x)',
      description: 'Solve x² − 3 = 0 (root x* = √3 ≈ 1.732). Show g(x) = 3/x converges but g(x) = x²−2 diverges.',
      difficulty: 'medium', hint: 'g₁(x) = 3/x: g₁\'(x) = −3/x². At x*=√3: |g₁\'| = 1 (slow!). Try g₂(x) = (x + 3/x)/2.',
      expectedAnswer: 'g(x) = (x + 3/x)/2 is Newton\'s method for √3: g\'(√3) = 0 → quadratic convergence.',
    },
    {
      id: 'p3', title: 'Estimate iterations needed',
      description: 'With |g\'(x*)| = 0.3 and initial error |x₀ − x*| = 1, how many iterations for error < 10⁻⁸?',
      difficulty: 'medium', hint: 'Error after n steps ≤ (0.3)ⁿ × 1. Solve (0.3)ⁿ < 10⁻⁸.',
      expectedAnswer: 'n log(0.3) < −8 log(10) → n > 8 log(10)/log(1/0.3) ≈ 15.3. Need 16 iterations.',
    },
    {
      id: 'p4', title: 'Compare to Newton\'s method',
      description: 'Solve x² − 2 = 0 by fixed-point g(x) = 1 + 1/x (k ≈ 0.29) AND Newton\'s method. Count iterations for 8-digit accuracy.',
      difficulty: 'hard', hint: 'Fixed-point: linear convergence, k=0.29. Newton: quadratic, doubles digits per iteration.',
      expectedAnswer: 'Fixed-point: ~15 iterations. Newton: ~5 iterations. Newton is 3× faster despite same function evaluations per step.',
    },
  ],

  interactiveChallenges: [
    {
      id: 'c1', title: 'Explore cobweb diagram',
      description: 'Visualize how the cobweb spirals inward (convergent) or outward (divergent).',
      objective: 'Build geometric intuition for the contraction condition.',
      difficulty: 'easy',
      steps: [
        { step: 1, instruction: 'Set g(x) = cos(x), x₀ = 0.5. Watch cobweb converge to x*≈0.739.', actionLabel: 'Animate convergence' },
        { step: 2, instruction: 'Now try g(x) = 2cos(x). Does the cobweb converge?', expectedOutcome: '|g\'(x*)| = |−2sin(0.739)| ≈ 1.35 > 1 → diverges. Cobweb spirals outward.' },
      ],
    },
    {
      id: 'c2', title: 'Design your own g(x)',
      description: 'Given f(x) = x⁴ − 2, design three different g(x) and test convergence.',
      objective: 'Understand that rearrangement choice determines whether iteration converges.',
      difficulty: 'medium',
      steps: [
        { step: 1, instruction: 'Try: g₁ = x⁴−1, g₂ = (x+2/x³)/2, g₃ = 2^{1/4} (constant). Which converge?', actionLabel: 'Test all three' },
        { step: 2, instruction: 'Compute |g\'(x*)| for each. x* = 2^{1/4} ≈ 1.189.', expectedOutcome: 'g₁: |g\'| = 4×1.189³ ≈ 6.7 > 1 (diverge). g₂: |g\'| ≈ 0.25 (fast). g₃ is constant (one step).' },
      ],
    },
  ],

  summary: {
    keyPoints: [
      { title: 'One Line', description: 'x_{n+1} = g(x_n) — simplest iterative method', icon: '1️⃣' },
      { title: 'Contract', description: '|g\'(x*)| < 1 required for convergence', icon: '🔧' },
      { title: 'Linear', description: 'Rate = |g\'(x*)| per step — slow vs Newton', icon: '📉' },
      { title: 'Foundation', description: 'Jacobi/GS are fixed-point iterations on linear systems', icon: '🏗️' },
    ],
    cheatSheetFormulas: [
      { label: 'Update', latex: 'x_{n+1} = g(x_n)', isKeyFormula: true },
      { label: 'Convergence', latex: '|g\'(x^*)| < 1', isKeyFormula: true },
      { label: 'Rate', latex: '|e_{n+1}| \\leq k|e_n|,\\; k = |g\'(x^*)|' },
    ],
    nextSteps: [
      { label: 'Newton-Raphson', description: 'Fixed-point with g\'(x*)=0 → quadratic convergence', path: '/root-finding/newton-raphson' },
    ],
  },
}
