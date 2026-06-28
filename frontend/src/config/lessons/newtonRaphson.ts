import type { LessonConfig } from '@/types/lesson.types'

export const NEWTON_RAPHSON_CONFIG: LessonConfig = {
  header: {
    moduleId: 'root-finding',
    moduleColor: '#10b981',
    title: 'Newton–Raphson Method',
    subtitle: 'Quadratic convergence via tangent line intersection',
    difficulty: 'intermediate',
    estimatedMinutes: 75,
    objectives: [
      'Derive the Newton-Raphson update from the first-order Taylor expansion',
      'Explain quadratic convergence and when it applies',
      'Identify failure modes: zero derivative, bad initial guess, cycles',
      'Handle multiple roots where convergence degrades to linear',
      'Apply the method to engineering problems where derivatives are available',
      'Compare performance to bisection and secant on the same equation',
    ],
    prerequisites: [{ title: 'Bisection Method', path: '/root-finding/bisection', required: false }],
    tags: ['open method', 'quadratic convergence', 'tangent line', 'Taylor expansion', 'derivative'],
  },

  motivation: {
    problemStatement:
      'Bisection takes ~34 iterations to achieve 10⁻¹⁰ accuracy. ' +
      'If you already know the function\'s derivative, you can do it in 5. ' +
      'Newton-Raphson draws the tangent line at the current approximation and ' +
      'jumps directly to where that line crosses zero. For smooth functions near a simple root, ' +
      'each iteration doubles the number of correct decimal digits.',
    whyItMatters:
      'Newton-Raphson (and its generalization, Newton\'s method for systems) is the workhorse of numerical optimization. ' +
      'Training neural networks via second-order methods, solving Kepler\'s equation in spacecraft navigation, ' +
      'finding implied volatility in options pricing, and computing electrical circuit operating points — ' +
      'all use Newton-Raphson or its variants.',
    historicalBackground:
      'Isaac Newton described the method in 1669 ("De Analysi"). ' +
      'Joseph Raphson published a cleaner version in 1690. ' +
      'The generalization to systems (Newton\'s method) underpins most modern nonlinear solvers ' +
      'and is the backbone of the interior-point methods used in linear programming solvers.',
    engineeringMotivation:
      'In machine learning, computing softmax logits, optimizing log-likelihood, or ' +
      'solving the normal equations for ridge regression all reduce to root-finding or ' +
      'linear-system problems where Newton\'s method provides the gold standard solution.',
    motivatingExample: {
      title: 'Solve x³ − x − 2 = 0, starting from x₀ = 1.5',
      description:
        'With x₀ = 1.5: f(1.5) = −0.125, f\'(1.5) = 3(1.5)²−1 = 5.75. ' +
        'x₁ = 1.5 − (−0.125)/5.75 = 1.5217. Then x₂ = 1.52138, x₃ = 1.52138 (converged). ' +
        'Three iterations vs bisection\'s 34 for the same tolerance!',
      expression: 'x^3 - x - 2 = 0',
      result: 'Converges to x* = 1.5213797… in ~5 iterations from x₀ = 1.5',
    },
  },

  theory: {
    overview:
      'Newton-Raphson draws the tangent to f(x) at the current point (xₙ, f(xₙ)) ' +
      'and uses the x-intercept of that tangent as the next approximation xₙ₊₁. ' +
      'This is derived from the first two terms of the Taylor series: ' +
      'f(root) ≈ f(xₙ) + f′(xₙ)(root − xₙ) = 0 → root ≈ xₙ − f(xₙ)/f′(xₙ).',
    intuition:
      'Imagine you\'re standing on a hill (the function curve) and want to reach sea level (y=0). ' +
      'Instead of walking along the curve, you look at the slope of the ground you\'re standing on ' +
      'and take a step in the direction that slope predicts will reach zero. ' +
      'Near the bottom, your prediction becomes increasingly accurate — that\'s quadratic convergence.',
    advantages: [
      'Quadratic convergence near a simple root: number of correct digits doubles each iteration',
      'Extremely fast for smooth functions with available derivatives (~5 iterations typical)',
      'Generalizes to systems of equations (Newton\'s method) and optimization (Newton step)',
      'Self-correcting: even if an iteration moves away from root, subsequent iterations may recover',
    ],
    limitations: [
      'Requires f′(x) — the derivative must exist and be evaluable',
      'No convergence guarantee without a good starting guess',
      'Fails when f′(xₙ) = 0 (division by zero) or is near zero (huge step, divergence)',
      'Converges to linear rate at multiple roots where f′(x*) = 0',
      'Can cycle or diverge for certain function shapes and starting points',
    ],
    keyInsights: [
      'The convergence factor is −f″(x*)/(2f′(x*)) — small when f″ is small relative to f′',
      '"Quadratic" means: if error is 10⁻³, next error ≈ 10⁻⁶. Then 10⁻¹². Then 10⁻²⁴.',
      'For multiple roots (f(x*) = f′(x*) = 0), use modified Newton: xₙ₊₁ = xₙ − m·f/f′ where m = multiplicity',
      'Newton\'s method is the limiting case of Halley\'s and other higher-order methods',
    ],
  },

  mathFoundation: {
    formulas: [
      {
        label: 'Newton-Raphson iteration',
        latex: "x_{n+1} = x_n - \\frac{f(x_n)}{f'(x_n)}",
        description: 'Tangent-line x-intercept at current point. Requires f′(xₙ) ≠ 0.',
        isKeyFormula: true,
      },
      {
        label: 'Taylor expansion derivation',
        latex: "0 = f(x^*) \\approx f(x_n) + f'(x_n)(x^* - x_n) \\Rightarrow x^* \\approx x_n - \\frac{f(x_n)}{f'(x_n)}",
        description: 'Setting f(x*) = 0 in the first-order Taylor expansion at xₙ',
        isKeyFormula: true,
      },
      {
        label: 'Quadratic error reduction',
        latex: "e_{n+1} \\approx -\\frac{f''(x^*)}{2\\,f'(x^*)}\\,e_n^2",
        description: 'Near a simple root, error squares each iteration: e_{n+1} ∝ eₙ²',
        isKeyFormula: true,
      },
      {
        label: 'Convergence criterion',
        latex: '|x_{n+1} - x_n| < \\varepsilon \\quad \\text{or} \\quad |f(x_n)| < \\varepsilon',
        description: 'Stop when successive iterates are close, or when f is near zero',
      },
      {
        label: 'Modified Newton (multiple roots)',
        latex: "x_{n+1} = x_n - m \\cdot \\frac{f(x_n)}{f'(x_n)}",
        description: 'Multiply the step by the root multiplicity m to restore quadratic convergence',
      },
    ],
    symbols: [
      { symbol: 'x_n',         definition: 'Current approximation at iteration n'                  },
      { symbol: "f'(x_n)",     definition: 'Derivative of f at xₙ — the tangent slope'            },
      { symbol: 'e_n',         definition: 'Error: |xₙ − x*|'                                     },
      { symbol: 'x^*',         definition: 'True root: f(x*) = 0'                                  },
      { symbol: "f''(x^*)",    definition: 'Second derivative at root — controls quadratic factor' },
    ],
    derivationSteps: [
      { step: 1, description: 'Start with Taylor expansion of f around xₙ', latex: "f(x^*) = f(x_n) + f'(x_n)(x^* - x_n) + \\tfrac{1}{2}f''(\\xi)(x^* - x_n)^2" },
      { step: 2, description: 'f(x*) = 0 by definition. Drop higher-order terms.', latex: "0 \\approx f(x_n) + f'(x_n)(x^* - x_n)" },
      { step: 3, description: 'Solve for x* to get the update formula', latex: "x^* \\approx x_n - \\frac{f(x_n)}{f'(x_n)} =: x_{n+1}" },
      { step: 4, description: 'Error analysis: define eₙ = xₙ − x* and substitute', latex: "e_{n+1} = -\\frac{f''(x^*)}{2f'(x^*)} e_n^2 + O(e_n^3)" },
    ],
    assumptions: [
      'f must be twice continuously differentiable near the root',
      'f′(x*) ≠ 0 (simple root) — otherwise convergence degrades',
      'Initial guess x₀ must be "close enough" to root — no universal definition',
    ],
    convergenceCondition: "\\left| \\frac{f(x_n) \\cdot f''(x_n)}{[f'(x_n)]^2} \\right| < 1",
  },

  errorAnalysis: {
    metrics: [
      { label: 'Successive difference',  formula: '|x_{n+1} - x_n|',                description: 'Primary convergence check: how much xₙ changes per step'                     },
      { label: 'Residual',              formula: '|f(x_n)|',                         description: 'How close f is to zero — may underestimate error near flat regions'          },
      { label: 'Quadratic error factor', formula: "C = |f''(x^*)| / (2|f'(x^*)|)", description: 'Convergence constant: small means fast. Large means near-linear convergence' },
    ],
    stabilityNote:
      'Newton-Raphson is locally quadratically convergent but NOT globally convergent. ' +
      'The classic failure: f(x) = x^(1/3) with x₀ = 1 → f′(1) = 1/3, x₁ = 1 − 1/(1/3) = −2 → x₂ = 5 → diverges.',
    floatingPointNote:
      'Near machine epsilon convergence, the successive difference |xₙ₊₁ − xₙ| cannot decrease below ε_mach·|xₙ|. ' +
      'Stop as soon as |xₙ₊₁ − xₙ| < ε_mach·|xₙ| to avoid infinite loops near the root.',
  },

  performance: {
    complexity: {
      timeComplexity: 'O(log log(1/ε)) near root (quadratic)',
      spaceComplexity: 'O(1)',
      convergenceOrder: '2 (quadratic)',
      convergenceOrderNote: "eₙ₊₁ ≈ C·eₙ², C = |f''(x*)| / (2|f'(x*)|)",
    },
    bestCase: 'f is a polynomial and x₀ is close to the root — may converge in 3–4 iterations to machine precision',
    worstCase: 'Bad starting point causes cycling or divergence (e.g., Newton fractal boundary)',
    typicalIterations: '5–12 for smooth functions with tolerances 10⁻⁶ to 10⁻¹⁵',
  },

  comparison: {
    methods: ['bisection', 'newton-raphson', 'secant'],
    criteria: [
      'Initial requirements', 'Convergence order', 'Derivative needed',
      'Per-iteration cost', 'Typical iterations (ε=10⁻⁸)', 'Guaranteed?', 'Failure modes',
    ],
    table: [
      { criterion: 'Initial requirements',            bisection: 'Bracket [a,b], f(a)·f(b)<0', 'newton-raphson': 'Single guess x₀',              secant: 'Two guesses x₀, x₁'         },
      { criterion: 'Convergence order',               bisection: '1 (linear)',                  'newton-raphson': '2 (quadratic)',                  secant: '~1.618 (superlinear)'       },
      { criterion: 'Derivative needed',               bisection: 'No',                          'newton-raphson': 'Yes — f\'(x)',                   secant: 'No'                         },
      { criterion: 'Per-iteration cost',              bisection: '1 function eval',             'newton-raphson': '1 f + 1 f\' eval',              secant: '1 function eval'            },
      { criterion: 'Typical iterations (ε=10⁻⁸)',    bisection: '~27',                         'newton-raphson': '~5–8',                           secant: '~8–12'                      },
      { criterion: 'Guaranteed?',                     bisection: 'Yes',                         'newton-raphson': 'No — can diverge',               secant: 'No — can diverge'           },
      { criterion: 'Failure modes',                   bisection: 'Discontinuous f',             'newton-raphson': "f'=0; poor x₀; cycles",         secant: 'f(xₙ)≈f(xₙ₋₁); poor pair' },
    ],
    summary: 'Newton-Raphson is the fastest method when the derivative is available and the initial guess is good. It is the standard choice in scientific computing and optimization.',
  },

  engineeringApplications: [
    {
      field: 'Machine Learning / AI',
      title: "Newton's Method in Logistic Regression",
      description:
        "Newton's method applied to the log-likelihood of logistic regression (IRLS algorithm) " +
        'converges in 5–10 iterations compared to hundreds for gradient descent. ' +
        'The Hessian plays the role of f′ in the 1D formula.',
      example: "xₙ₊₁ = xₙ − H⁻¹∇L(xₙ) — the 1D version is Newton's root-finding on the gradient",
      icon: '🤖',
      difficulty: 'advanced' as const,
    },
    {
      field: 'Aerospace',
      title: "Kepler's Equation — Orbital Mechanics",
      description:
        'The eccentric anomaly E satisfies M = E − e·sin(E) (Kepler\'s Equation). ' +
        'No closed form exists for E given M. Newton-Raphson converges in 3–5 iterations ' +
        'for all but near-parabolic orbits, making it the standard algorithm in flight computers.',
      example: 'f(E) = E − e·sin(E) − M = 0, f\'(E) = 1 − e·cos(E). With e=0.5, M=π/4: 4 iterations to 10⁻¹⁵.',
      icon: '🚀',
      difficulty: 'intermediate' as const,
    },
    {
      field: 'Finance',
      title: 'Black–Scholes Implied Volatility',
      description:
        'Given observed option price C_mkt, solve Black-Scholes(σ) = C_mkt for implied volatility σ. ' +
        'The vega (∂C/∂σ) plays the role of f′. Newton-Raphson is the standard in options desks.',
      example: 'Observed call price = $3.50, S=100, K=100, T=0.5, r=0.05 → σ_impl ≈ 0.256 (25.6%)',
      icon: '💹',
      difficulty: 'advanced' as const,
    },
    {
      field: 'Power Systems',
      title: 'Newton-Raphson Power Flow',
      description:
        'The AC power flow equations (P + jQ = V·(I*)) form a nonlinear system. ' +
        'Newton-Raphson extended to n-dimensional systems solves for all bus voltages ' +
        'and angles simultaneously — the dominant algorithm in power system simulation.',
      example: '5-bus power system: 8 equations, Newton-Raphson converges in ~4 iterations',
      icon: '⚡',
      difficulty: 'advanced' as const,
    },
    {
      field: 'Computer Graphics',
      title: 'Ray–Surface Intersection',
      description:
        'Finding where a ray intersects an implicit surface f(x,y,z) = 0 requires solving ' +
        'f(ray_origin + t·ray_dir) = 0 for t. Newton-Raphson on this scalar equation ' +
        'converges in 3–5 iterations for smooth surfaces like quadrics and metaballs.',
      example: 'f(x,y,z) = x²+y²+z²-1 (sphere). f(t) = |P+t·D|²-1. Derivative available analytically.',
      icon: '🎮',
      difficulty: 'intermediate' as const,
    },
  ],

  commonMistakes: [
    {
      id: 'nr-zero-deriv',
      title: "Division by zero when f'(xₙ) = 0",
      description:
        "If the tangent at xₙ is horizontal, the update formula produces Infinity or NaN. " +
        "This happens at inflection points, saddle points, and the approach to multiple roots.",
      wrongApproach: "x_new = x - f(x) / f_prime(x)  # Crashes if f'(x) = 0",
      correctApproach: "if abs(f_prime(x)) < 1e-14: raise Exception('Derivative too small — switch to bisection')",
      icon: '÷',
    },
    {
      id: 'nr-bad-guess',
      title: 'Starting too far from the root',
      description:
        'For nonlinear functions, Newton-Raphson is only locally convergent. ' +
        'Starting outside the "basin of attraction" causes divergence or convergence to the wrong root. ' +
        'Always bracket the root first with a coarse bisection or plot before applying Newton.',
      wrongApproach: 'x₀ = 100 for f(x) = cos(x) − x (root ≈ 0.74) → diverges or finds wrong root',
      correctApproach: 'Plot f first or use bisection for a few steps to get a good x₀ near the root',
      icon: '🎯',
    },
    {
      id: 'nr-multiple',
      title: 'Expecting quadratic convergence at multiple roots',
      description:
        'When f(x*) = f′(x*) = 0 (double or higher root), the standard Newton step does not cancel the error quadratically. ' +
        'Convergence degrades to linear. The fix: use xₙ₊₁ = xₙ − m·f(xₙ)/f′(xₙ) where m is the root multiplicity.',
      wrongApproach: 'Apply standard Newton to (x-1)²(x-2) — converges linearly at the double root x=1',
      correctApproach: 'Use modified Newton with m=2 for the double root, restoring quadratic convergence',
      icon: '×²',
    },
    {
      id: 'nr-no-convergence-check',
      title: 'Not limiting maximum iterations',
      description:
        'Without a maximum iteration limit, a cycling or diverging Newton iteration runs forever. ' +
        'Always set max_iterations and verify convergence in the result.',
      wrongApproach: 'while abs(f(x)) > tol: x = x - f(x)/fp(x)  # infinite loop if diverging',
      correctApproach: 'for i in range(max_iter): ... if not converged: raise NoConvergenceError',
      icon: '∞',
    },
  ],

  practiceProblems: [
    {
      id: 'nr-p1',
      title: 'Classic cubic — count iterations',
      description: 'Find the root of x³ − 2x − 5 = 0 near x₀ = 2. Compare the number of iterations with bisection on [1, 3].',
      difficulty: 'easy',
      expression: 'x**3 - 2*x - 5',
      hint: "f'(x) = 3x² − 2. x₁ = 2 − (−1)/(3·4−2) = 2 − (−1)/10 = 2.1. Converges quickly.",
      expectedAnswer: 'x* ≈ 2.0945515, Newton converges in ~5 iterations, bisection needs ~27',
    },
    {
      id: 'nr-p2',
      title: 'Make Newton-Raphson diverge',
      description: 'Apply Newton-Raphson to f(x) = x^(1/3) with x₀ = 1. Show that it diverges. Explain why.',
      difficulty: 'medium',
      expression: 'x**(1/3)',
      hint: "f'(x) = (1/3)x^(-2/3). At x=1: x₁ = 1 − 1/(1/3) = −2. At x=−2: x₂ = 5. Diverges.",
      expectedAnswer: 'Diverges. The issue: f″(0)/f′(0) is unbounded at the root x*=0.',
    },
    {
      id: 'nr-p3',
      title: 'Kepler\'s equation',
      description: 'Solve M = E − e·sin(E) for E (eccentric anomaly) given M = π/3 and eccentricity e = 0.5.',
      difficulty: 'hard',
      expression: 'x - 0.5*sin(x) - 1.0472',
      hint: "f(E) = E − 0.5·sin(E) − π/3 = 0. f'(E) = 1 − 0.5·cos(E). Start with x₀ = M = π/3.",
      expectedAnswer: 'E ≈ 1.4010 radians. Newton converges in 4 iterations.',
    },
    {
      id: 'nr-p4',
      title: 'Multiple root — observe linear convergence',
      description: 'Apply Newton-Raphson to f(x) = (x−1)²·(x−3). Observe that convergence to x=1 is linear, not quadratic.',
      difficulty: 'hard',
      expression: '(x-1)**2*(x-3)',
      hint: 'At a double root, the convergence factor = 1 − 1/m where m=2 multiplicity. Linear convergence means error halves each step, not squares.',
      expectedAnswer: 'Converges to x=1 (the double root) with linear rate ≈ 0.5 per iteration',
    },
  ],

  interactiveChallenges: [
    {
      id: 'ch-quadratic-proof',
      title: 'Observe Quadratic Convergence',
      description: 'Watch the number of correct digits double every iteration.',
      objective: 'See quadratic convergence in the error column of the iteration table.',
      difficulty: 'easy',
      steps: [
        { step: 1, instruction: 'Set f(x) = x³ − x − 2, x₀ = 1.5. Run Newton-Raphson.', expectedOutcome: 'Should converge in ~5 iterations.' },
        { step: 2, instruction: 'Look at the error column. Compute ratio eₙ₊₁/eₙ². Is it approximately constant?', expectedOutcome: 'eₙ₊₁/eₙ² ≈ |f″(x*)|/(2|f′(x*)|) ≈ 0.6. Quadratic confirmed.' },
      ],
    },
    {
      id: 'ch-fail-newton',
      title: 'Make Newton Fail',
      description: 'Find three different ways to make Newton-Raphson fail or converge to the wrong root.',
      objective: 'Understand the failure modes of open methods.',
      difficulty: 'medium',
      steps: [
        { step: 1, instruction: 'Try f(x) = x^(1/3), x₀ = 1. What happens?', expectedOutcome: 'Diverges — derivative becomes 0 at the root.' },
        { step: 2, instruction: 'Try f(x) = cos(x) − x, x₀ = 100. What happens?', expectedOutcome: 'May converge to wrong root or oscillate far from x*≈0.74.' },
        { step: 3, instruction: 'Try f(x) = (x−1)²(x−3), x₀ = 1.5. Which root does it find?', expectedOutcome: 'Converges to x=3 (simple root), not x=1 (double root near x₀).' },
      ],
    },
    {
      id: 'ch-basin',
      title: 'Map the Basin of Attraction',
      description: 'For f(x) = x³ − 1, the three roots are the cube roots of unity. Starting from different x₀ values near x=0 changes which root Newton finds.',
      objective: 'See how the initial guess determines convergence destination.',
      difficulty: 'hard',
      steps: [
        { step: 1, instruction: 'Try x₀ = 0.1, 0.5, 1.0, −0.5, −1.0 for f(x) = x^3 − 1.', expectedOutcome: 'Each x₀ value converges to one of the three real/complex roots differently.' },
        { step: 2, instruction: 'Observe how the error column drops suddenly once in the quadratic convergence zone.', expectedOutcome: 'Initial iterations may be slow; then error drops precipitously.' },
      ],
    },
    {
      id: 'ch-implied-vol',
      title: 'Compute Black-Scholes Implied Volatility',
      description: 'Use Newton-Raphson to invert the Black-Scholes formula.',
      objective: 'Apply Newton-Raphson to a real financial engineering problem.',
      difficulty: 'hard',
      steps: [
        { step: 1, instruction: 'Assume Black-Scholes call price = σ·S·√T (simplified). Find σ given C=3.5, S=100, T=0.5.', expectedOutcome: 'f(σ) = σ·100·√0.5 − 3.5 = 0 → σ = 3.5/(100·0.707) ≈ 0.0495' },
        { step: 2, instruction: 'Enter this as a root-finding problem and apply Newton with x₀ = 0.2.', expectedOutcome: 'Converges in 2 iterations since f is nearly linear in σ.' },
      ],
    },
    {
      id: 'ch-comparison-nr',
      title: 'Head-to-Head: Newton vs Secant',
      description: 'Compare Newton-Raphson and Secant on the same equation when the derivative is available.',
      objective: 'Understand when Secant is competitive with Newton despite no derivative.',
      difficulty: 'medium',
      steps: [
        { step: 1, instruction: 'Go to Comparison Center. Set f(x) = x³ − x − 2, a=1, b=2, x₀=1.5, x₁=2, tol=1e-12.', expectedOutcome: 'Run both Newton and Secant.' },
        { step: 2, instruction: 'Compare: iterations needed, execution time, final error.', expectedOutcome: 'Newton: ~6 iters. Secant: ~9 iters. Secant uses fewer function evaluations per iter but needs more iters.' },
        { step: 3, instruction: 'Count total function evaluations (Newton needs f+f\' per step, Secant only needs f).', expectedOutcome: 'Newton: 12 evals (6×2). Secant: 9 evals (9×1). Secant may win on expensive functions.' },
      ],
    },
  ],

  summary: {
    keyPoints: [
      { title: 'Quadratic convergence near simple roots', description: "Error squares each step: eₙ₊₁ ≈ C·eₙ². If error is 10⁻³, next is ≈10⁻⁶. Then 10⁻¹². This is why Newton converges in 5–8 iterations while bisection needs 30.", icon: '⚡' },
      { title: 'Derived from Taylor expansion', description: "xₙ₊₁ = xₙ − f(xₙ)/f'(xₙ) is exactly the first-order Taylor approximation to the root.", icon: '∂' },
      { title: 'Locally convergent — not guaranteed', description: "Must start 'close enough' to root. Use bisection or a plot to get a safe x₀ first.", icon: '⚠' },
      { title: 'Fails at zero or small derivative', description: "f'(xₙ) ≈ 0 causes a huge step or division by zero. Always guard against this case.", icon: '÷' },
      { title: 'Linear at multiple roots', description: 'If f(x*) = f\'(x*) = 0, modify the step to m·f/f\' where m = multiplicity.', icon: '×²' },
    ],
    cheatSheetFormulas: [
      { label: 'Iteration',                 latex: "x_{n+1} = x_n - f(x_n)/f'(x_n)",                              isKeyFormula: true },
      { label: 'Quadratic error reduction', latex: "e_{n+1} \\approx \\frac{|f''(x^*)|}{2|f'(x^*)|} e_n^2",      isKeyFormula: true },
      { label: 'Convergence criterion',     latex: '|x_{n+1} - x_n| < \\varepsilon'                                                   },
      { label: 'Modified (multiple roots)', latex: "x_{n+1} = x_n - m \\cdot f(x_n)/f'(x_n)"                                       },
    ],
    nextSteps: [
      { label: 'Secant Method',         description: 'Newton without derivatives — approximates f′ using two points', path: '/root-finding/secant' },
      { label: 'Comparison Center',     description: 'Race bisection, Newton, and Secant on the same equation',        path: '/root-finding/comparison' },
      { label: 'Numerical Differentiation', description: 'If f′ is unavailable, compute it numerically', path: '/differentiation' },
    ],
  },
}
