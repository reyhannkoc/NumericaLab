import type { LessonConfig } from '@/types/lesson.types'

export const GAUSSIAN_QUADRATURE_CONFIG: LessonConfig = {
  header: {
    moduleId: 'integration',
    moduleColor: '#ec4899',
    title: 'Gaussian Quadrature',
    subtitle: 'Optimal node placement for maximum accuracy per function evaluation',
    difficulty: 'advanced',
    estimatedMinutes: 65,
    objectives: [
      'Understand why optimal node placement beats uniform grids',
      'Derive Gauss–Legendre weights and nodes from orthogonal polynomials',
      'Apply the change-of-interval transformation from [-1,1] to [a,b]',
      'Recognize when Gaussian quadrature dominates other methods',
      "Compare exponential convergence with Simpson's polynomial O(h⁴)",
    ],
    prerequisites: [
      { title: 'Trapezoidal Rule', path: '/integration/trapezoidal', required: true },
      { title: "Simpson's Rule", path: '/integration/simpsons', required: true },
    ],
    tags: ['quadrature', 'Gauss-Legendre', 'orthogonal polynomials', 'exponential convergence', 'optimal nodes'],
  },

  motivation: {
    problemStatement:
      'You have exactly 5 function evaluations. Can you integrate eˣ on [0,1] to 12 significant digits? ' +
      "Simpson's 1/3 with 5 points gives 8 digits. Gaussian quadrature with 5 points: 12 digits.",
    whyItMatters:
      'In many engineering applications, function evaluations are expensive (FEA simulations, CFD solvers, ' +
      'expensive laboratory experiments). Gaussian quadrature squeezes maximum accuracy from the minimum ' +
      'number of evaluations by placing nodes optimally — not uniformly.',
    historicalBackground:
      'Carl Friedrich Gauss (1814) discovered that n points could be chosen to integrate polynomials ' +
      'of degree 2n−1 exactly — twice what Newton–Cotes methods achieve with n points. ' +
      'Christoffel (1877) and Jacobi provided the orthogonal polynomial framework.',
    engineeringMotivation:
      'Finite element analysis (FEA) uses Gaussian quadrature on every element, millions of times per simulation. ' +
      'Using optimal 3-point Gauss vs 5-point trapezoidal gives the same accuracy with 40% fewer calls — ' +
      'directly translating to faster structural, fluid, and thermal simulations.',
    motivatingExample: {
      title: 'One-point Gaussian quadrature (midpoint rule)',
      description:
        '1-point Gauss: node at x=0, weight=2 (on [-1,1]). Maps to midpoint on [a,b]. ' +
        'Exact for linear functions — same accuracy as trapezoidal with only 1 evaluation!',
      expression: '∫₋₁¹ f(x) dx ≈ 2·f(0)',
      result: 'n Gauss points integrate polynomials of degree ≤ 2n−1 exactly',
    },
  },

  theory: {
    overview:
      'Gauss–Legendre quadrature finds the n node positions x₁,...,xₙ and weights w₁,...,wₙ in [-1,1] ' +
      'such that ∫₋₁¹ f(x) dx ≈ Σwᵢf(xᵢ) is exact for all polynomials of degree ≤ 2n−1. ' +
      'For smooth analytic functions, convergence is exponential in n.',
    intuition:
      'With a fixed number of evaluations, you can achieve twice the polynomial degree of accuracy by ' +
      'allowing the nodes to be non-uniform. The optimal nodes turn out to be the roots of the ' +
      'Legendre polynomial Pₙ(x) — equally spaced on [-1,1] by density, not by position.',
    advantages: [
      'n points exactly integrates polynomials of degree ≤ 2n−1 (vs n−1 for Newton-Cotes)',
      'Exponential convergence for analytic functions — no other fixed-n method is faster',
      'Highly efficient for FEA element integrals where only smooth basis functions appear',
      'Tables of nodes and weights are precomputed — no algorithm needed at runtime',
      'Naturally handles integrands with smooth behavior in [-1,1]',
    ],
    limitations: [
      'Fixed nodes — cannot adapt to singular or rapidly oscillating integrands',
      'Requires transformation to [-1,1] for general [a,b]',
      'Slower convergence than trapezoidal for periodic functions (no spectral advantage)',
      'Cannot use tabulated data directly — requires function evaluations at specific nodes',
      'May miss integrand features between nodes (unlike composite methods)',
    ],
    keyInsights: [
      'The nodes are the zeros of Pₙ(x) (Legendre polynomial), not evenly spaced',
      'Gauss nodes cluster near the endpoints — where polynomial approximation error concentrates',
      'Doubling n roughly squares the accuracy for analytic integrands (exponential convergence)',
    ],
  },

  mathFoundation: {
    formulas: [
      {
        label: 'Gauss–Legendre Formula (standard interval [-1,1])',
        latex:
          '\\int_{-1}^{1} f(x)\\,dx \\approx \\sum_{i=1}^{n} w_i\\, f(x_i)',
        description: 'xᵢ = zeros of Pₙ(x); wᵢ = precomputed weights. Exact for deg ≤ 2n−1.',
        isKeyFormula: true,
      },
      {
        label: 'Change of Interval [a,b] → [-1,1]',
        latex:
          '\\int_a^b f(x)\\,dx = \\frac{b-a}{2}\\int_{-1}^{1} f\\!\\left(\\frac{(b-a)t+(b+a)}{2}\\right)dt',
        description: 'Linear map t ∈ [-1,1] ↔ x ∈ [a,b]. Multiply result by (b−a)/2.',
        isKeyFormula: true,
      },
      {
        label: '5-Point Gauss–Legendre Nodes and Weights',
        latex:
          'x_{1,5} = \\pm 0.90618,\\ x_{2,4} = \\pm 0.53847,\\ x_3 = 0',
        description: 'w₁=w₅=0.23693, w₂=w₄=0.47863, w₃=0.56889. Exact for degree ≤ 9.',
      },
      {
        label: 'Error Bound (Gauss–Legendre)',
        latex:
          'E_n = \\frac{2^{2n+1}(n!)^4}{(2n+1)[(2n)!]^2}\\,\\frac{f^{(2n)}(\\xi)}{(2n)!}\\,\\frac{(b-a)^{2n+1}}{2^{2n}}',
        description: 'Decreases exponentially in n for analytic f. Much faster than any O(hᵖ) method.',
      },
      {
        label: 'Degree of Exactness',
        latex:
          '\\text{Gauss-Legendre with }n\\text{ points: exact for }\\deg \\leq 2n-1',
        description: 'Newton-Cotes (uniform) with n points: exact for deg ≤ n−1 (or n if n odd). Gauss doubles this.',
        isKeyFormula: true,
      },
    ],
    symbols: [
      { symbol: 'xᵢ', definition: 'Gauss nodes — zeros of Pₙ(x) (Legendre polynomial of degree n)', unit: 'dimensionless ∈ [-1,1]' },
      { symbol: 'wᵢ', definition: 'Gauss weights — precomputed from 2/[(1−xᵢ²)(Pₙ\'(xᵢ))²]' },
      { symbol: 'Pₙ(x)', definition: 'Legendre polynomial of degree n — orthogonal on [-1,1]' },
      { symbol: '(b−a)/2', definition: 'Scale factor from the [-1,1]→[a,b] interval transformation' },
    ],
    derivationSteps: [
      {
        step: 1,
        description: 'Want Σwᵢf(xᵢ) = ∫₋₁¹ f(x)dx exact for all polynomials of degree ≤ 2n−1',
        latex:
          '\\text{Free parameters: }n\\text{ nodes }x_i\\text{ and }n\\text{ weights }w_i \\Rightarrow 2n\\text{ unknowns}',
      },
      {
        step: 2,
        description: 'Exactness for deg ≤ 2n−1 gives 2n conditions. Orthogonal polynomial theory identifies the unique solution.',
        latex:
          'x_i = \\text{zeros of }P_n(x),\\quad w_i = \\frac{2}{(1-x_i^2)\\,[P_n\'(x_i)]^2}',
      },
      {
        step: 3,
        description: 'Transform any [a,b] to [-1,1] via x = ((b−a)t + (b+a))/2',
        latex:
          '\\int_a^b f(x)\\,dx = \\frac{b-a}{2}\\sum_{i=1}^n w_i\\,f\\!\\left(\\frac{(b-a)x_i+(a+b)}{2}\\right)',
      },
      {
        step: 4,
        description: 'For analytic f, error ∝ f⁽²ⁿ⁾(ξ)/(2n)! which shrinks exponentially as n grows',
        latex:
          'E_n \\sim \\frac{\\pi\\, f^{(2n)}(\\xi)}{(2n)!}\\cdot\\left(\\frac{b-a}{4}\\right)^{2n} \\to 0 \\text{ exponentially}',
      },
    ],
    assumptions: [
      'f is analytic (infinitely differentiable) in [a,b] for exponential convergence',
      'Gauss nodes and weights are looked up from precomputed tables',
    ],
    convergenceCondition: 'For analytic f: error decreases exponentially in n (spectral convergence)',
  },

  errorAnalysis: {
    metrics: [
      {
        label: 'Exponential Convergence Rate',
        formula: 'E_n ∝ (ρ_min / 4)^(2n) where ρ_min is the Bernstein ellipse radius',
        description: 'For analytic f, each additional Gauss point roughly squares the number of correct digits.',
      },
      {
        label: 'Polynomial Exactness Check',
        formula: '|∫ p(x) dx − Σwᵢp(xᵢ)|',
        description: 'Must be machine-epsilon for any polynomial of degree ≤ 2n−1. Use this to verify implementation.',
      },
      {
        label: 'Absolute Error (vs known exact)',
        formula: '|I_G − I_exact|',
        description: 'Directly measurable. Decreases dramatically — often 10+ digits at n=5 for smooth functions.',
      },
      {
        label: 'Error Estimate (without exact)',
        formula: '|I_G(n) − I_G(n+1)|',
        description: 'Difference between consecutive Gauss orders estimates the error when exact is unknown.',
      },
    ],
    stabilityNote:
      'Gauss quadrature is unconditionally stable for smooth integrands. ' +
      'For highly oscillatory functions (high frequency), more points may be needed.',
    floatingPointNote:
      'Precomputed Gauss nodes and weights carry ~15 significant digits of accuracy. ' +
      'The integration sum is numerically stable for any reasonable n.',
  },

  performance: {
    complexity: {
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n) for node/weight tables',
      convergenceOrder: 'Exponential in n for analytic f',
      convergenceOrderNote:
        'Each additional Gauss point roughly doubles the correct digits for analytic integrands — ' +
        "unmatched by any fixed-order method like trapezoidal O(h²) or Simpson's O(h⁴)",
    },
    bestCase: 'Smooth analytic function — exponential convergence dominates everything',
    worstCase: 'Function with singularity at a Gauss node, or highly oscillatory integrand requiring many points',
    typicalIterations: 'n=5 gives ~12-digit accuracy for smooth functions. n=10 gives ~15 digits.',
  },

  comparison: {
    methods: ['Trapezoidal (n=100)', "Simpson's (n=10)", 'Gauss (n=5)'],
    criteria: ['Evaluations', 'Error (eˣ on [0,1])', 'Convergence', 'Requires', 'Best for'],
    table: [
      {
        criterion: 'Evaluations',
        'Trapezoidal (n=100)': '101',
        "Simpson's (n=10)": '11',
        'Gauss (n=5)': '5',
      },
      {
        criterion: 'Error (eˣ on [0,1])',
        'Trapezoidal (n=100)': '~1.4×10⁻⁵',
        "Simpson's (n=10)": '~3.0×10⁻⁸',
        'Gauss (n=5)': '~3.7×10⁻¹²',
      },
      {
        criterion: 'Convergence',
        'Trapezoidal (n=100)': 'O(h²)',
        "Simpson's (n=10)": 'O(h⁴)',
        'Gauss (n=5)': 'Exponential',
      },
      {
        criterion: 'Requires',
        'Trapezoidal (n=100)': 'Any function',
        "Simpson's (n=10)": 'n even, smooth',
        'Gauss (n=5)': 'Analytic, can evaluate at any point',
      },
      {
        criterion: 'Best for',
        'Trapezoidal (n=100)': 'Tabulated/non-smooth data',
        "Simpson's (n=10)": 'General smooth integrals',
        'Gauss (n=5)': 'High-precision smooth integrals, FEA',
      },
    ],
    summary:
      'Gaussian quadrature dominates all polynomial methods for smooth analytic functions. ' +
      'Choose trapezoidal for non-smooth or tabulated data. ' +
      "Choose Simpson's as the practical default. Choose Gauss when maximum accuracy per evaluation matters.",
  },

  engineeringApplications: [
    {
      field: 'Finite Element Analysis',
      title: 'Element Stiffness Matrix Integration',
      description:
        'FEA stiffness matrix Kₑ = ∫ BᵀDB dV requires integrating products of basis function gradients. ' +
        'Gauss quadrature on each element is the universal standard — 2×2×2 Gauss points for 3D hexahedral elements.',
      example: '8-node brick element: 8 Gauss points integrate degree-5 polynomials exactly',
      icon: '🔩',
      difficulty: 'advanced',
    },
    {
      field: 'Computational Fluid Dynamics',
      title: 'Spectral Element Methods',
      description:
        'Spectral element CFD (Gauss-Legendre-Lobatto nodes) achieves spectral accuracy on each element. ' +
        'Residual norms of turbulent Navier–Stokes converge exponentially with polynomial order p.',
      example: 'p=8 spectral element: 81 Gauss-Lobatto nodes per 2D element → 10-digit accuracy',
      icon: '🌀',
      difficulty: 'advanced',
    },
    {
      field: 'Quantum Mechanics',
      title: 'Numerical Evaluation of Matrix Elements',
      description:
        'Quantum expectation values ⟨ψ|Ô|ψ⟩ = ∫ψ*(x)Ô ψ(x) dx are computed by Gaussian quadrature ' +
        'in atomic and molecular physics codes (GAMESS, Gaussian16).',
      example: 'Hydrogen atom 2p orbital: 20-point Gauss-Laguerre → electron density integral',
      icon: '⚛️',
      difficulty: 'advanced',
    },
    {
      field: 'Computer Graphics',
      title: 'Monte Carlo / Quasi-Monte Carlo Rendering',
      description:
        'Physically-based renderers approximate lighting integrals ∫L(x,ω)dω over the hemisphere. ' +
        'Gaussian quadrature variants provide deterministic alternatives to stochastic sampling.',
      example: '16-point Gauss on hemisphere solid angle → specular BRDF integral for each pixel',
      icon: '🎨',
      difficulty: 'intermediate',
    },
    {
      field: 'Geodesy & Geophysics',
      title: 'Spherical Harmonic Synthesis',
      description:
        'Global gravity field models require integrating products of spherical harmonics over Earth\'s surface. ' +
        'Gauss–Legendre quadrature in latitude (Gauss nodes), uniform in longitude.',
      example: 'EGM2020 gravity model: degree-2190 spherical harmonics → 4380 Gauss latitudes',
      icon: '🌍',
      difficulty: 'advanced',
    },
  ],

  commonMistakes: [
    {
      id: 'm1',
      title: 'Forgetting the (b−a)/2 scale factor',
      description:
        'The standard Gauss nodes and weights are defined on [-1,1]. When transforming to [a,b], ' +
        'the Jacobian of the transformation is (b−a)/2 — which must multiply the entire sum.',
      wrongApproach: '∫₀¹ f dx ≈ Σwᵢf(xᵢ) [missing scale]',
      correctApproach: '∫₀¹ f dx ≈ (1/2)Σwᵢf((xᵢ+1)/2) [scale factor = (b−a)/2 = 1/2]',
      icon: '⚠️',
    },
    {
      id: 'm2',
      title: 'Applying Gaussian quadrature to non-smooth integrands',
      description:
        'Gaussian quadrature converges exponentially only for analytic functions. For |x| or piecewise ' +
        'continuous functions, it may converge slowly or give incorrect results for small n.',
      wrongApproach: 'Apply 5-point Gauss to ∫₋₁¹ |x| dx, expecting machine precision',
      correctApproach: 'Split at x=0 and apply Gauss to each smooth piece separately',
      icon: '📉',
    },
    {
      id: 'm3',
      title: 'Confusing n (Gauss points) with n (subintervals)',
      description:
        'In composite Newton-Cotes methods, n is the number of subintervals. In Gauss, n is the ' +
        'number of evaluation points total. 5-point Gauss uses 5 evaluations, not 6.',
      wrongApproach: 'Thinking 5-point Gauss = 4 subintervals + 5 points',
      correctApproach: '5-point Gauss = exactly 5 function evaluations, no subintervals',
      icon: '🔢',
    },
    {
      id: 'm4',
      title: 'Using tabulated Gauss weights for wrong precision',
      description:
        'Published weight tables have finite precision. Using 5-digit weights limits accuracy to ~5 digits ' +
        'regardless of n. Always use full double-precision weight tables.',
      wrongApproach: 'w₃ = 0.56889 [5 digits] → integration error floor ~10⁻⁵',
      correctApproach: 'w₃ = 0.5688888888888889 [16 digits] → error floor ~10⁻¹⁵',
      icon: '🎯',
    },
  ],

  practiceProblems: [
    {
      id: 'p1',
      title: '2-point Gauss quadrature of ∫₋₁¹ (x⁴−1) dx',
      description:
        '2-point Gauss nodes: ±1/√3 ≈ ±0.5774, weights = 1. Compute the integral and compare with exact = -4/5.',
      difficulty: 'easy',
      expression: 'x**4 - 1',
      params: { a: -1, b: 1, n: 2 },
      hint: 'f(-0.5774) = 0.1111−1 = −0.8889, f(0.5774) = 0.1111−1 = −0.8889. Sum = 2(−0.8889) = −1.778... Wait, degree=4 > 2n−1=3 — Gauss is NOT exact here. Compute the error.',
      expectedAnswer: 'I_Gauss ≈ 2(−0.8889) = −1.778; Exact = −0.8. Error = 0.978. 2-pt Gauss is not exact for degree 4 (need n≥3).',
    },
    {
      id: 'p2',
      title: 'Transform ∫₀² eˣ dx to [-1,1] and apply 3-point Gauss',
      description:
        '3-point Gauss nodes: 0, ±0.7746; weights: 8/9, 5/9. Transform interval [0,2] → [-1,1] and compute.',
      difficulty: 'medium',
      expression: 'exp(x)',
      params: { a: 0, b: 2, n: 3 },
      hint: 'Scale: (b−a)/2 = 1. Node mapping: x = t+1 (where t∈[-1,1]). Then Σwᵢf(tᵢ+1). Exact = e²−1 ≈ 6.389.',
      expectedAnswer: 'I ≈ 1·[(5/9)f(0.2254) + (8/9)f(1) + (5/9)f(1.7746)] ≈ 6.389. Error < 5×10⁻⁶.',
    },
    {
      id: 'p3',
      title: 'Verify exponential convergence vs O(h⁴)',
      description:
        "For ∫₀¹ eˣ dx, compare Gauss n=3,5,7 vs Simpson's n=10,20,40. Which reaches 10⁻¹⁰ first?",
      difficulty: 'hard',
      expression: 'exp(x)',
      params: { a: 0, b: 1 },
      hint: 'Exact = e−1. Gauss: compute E(n=3), E(n=5), E(n=7). Observe: each new Gauss point doubles digits.',
      expectedAnswer:
        'Gauss: E(3)≈1.2e-5, E(5)≈3.7e-12, E(7)≈~10⁻¹⁶. ' +
        "Simpson's: E(40)≈1.4×10⁻¹¹. Gauss n=5 beats Simpson's n=40 with 8× fewer evaluations.",
    },
    {
      id: 'p4',
      title: 'When does Gauss fail? Integrate ∫₀¹ √x dx',
      description:
        'f(x)=√x has a singularity in its derivative at x=0. Compute with Gauss n=5 and n=20. Does convergence remain exponential?',
      difficulty: 'hard',
      expression: 'sqrt(x)',
      params: { a: 0, b: 1, n: 5 },
      hint: 'Exact = 2/3. Compare convergence rate for n=5,10,20. Is it exponential (error squares each time)?',
      expectedAnswer:
        'Gauss n=5: error ≈ 2×10⁻³. n=10: error ≈ 5×10⁻⁴. n=20: error ≈ 1×10⁻⁴. ' +
        'Convergence is algebraic (~O(n⁻³/²)), not exponential — singularity at x=0 breaks analyticity.',
    },
  ],

  interactiveChallenges: [
    {
      id: 'c1',
      title: 'Verify Exactness for Polynomials',
      description: 'Confirm that n-point Gauss is exact for polynomials of degree ≤ 2n−1.',
      objective: 'Test 3-point Gauss on x⁵: should fail. On x⁴: should succeed.',
      difficulty: 'easy',
      steps: [
        { step: 1, instruction: 'Set expression=x**4, a=-1, b=1, n=3. Run. Error should be ~1e-15.', actionLabel: 'Run' },
        { step: 2, instruction: 'Change to x**5. Now error should be measurable (degree=5=2×3-1 is borderline).', expectedOutcome: 'x⁵ is exactly integrated (degree = 2n−1=5). x⁶ would fail.' },
        { step: 3, instruction: 'Try x**6 with n=3. Error should be large. Change n=4. Error should vanish.', expectedOutcome: 'Need n≥4 for degree 6. Confirms exactness rule.' },
      ],
    },
    {
      id: 'c2',
      title: 'Exponential vs Polynomial Convergence Race',
      description: "Race Gaussian quadrature against Simpson's for increasing n on exp(x).",
      objective: "Show Gauss n=7 achieves machine epsilon while Simpson's needs n=1000.",
      difficulty: 'medium',
      steps: [
        { step: 1, instruction: 'Integrate exp(x) on [0,1]. Run Gauss with n=3, 5, 7. Record errors.', actionLabel: 'Run Gauss' },
        { step: 2, instruction: "Switch to Simpson's. Run n=10, 100, 1000. When does it match Gauss n=7?", expectedOutcome: "Simpson's n≈300 matches Gauss n=7 — 40× more evaluations for same result" },
      ],
    },
    {
      id: 'c3',
      title: 'Gauss Failure Mode: Singular Integrand',
      description: 'Observe how singularities destroy exponential convergence.',
      objective: 'Show that √x (singular derivative at 0) gives only algebraic convergence with Gauss.',
      difficulty: 'hard',
      steps: [
        { step: 1, instruction: 'Integrate exp(x) on [0,1]. Confirm Gauss error halves more than twice per doubling of n.', actionLabel: 'Smooth test' },
        { step: 2, instruction: 'Change to sqrt(x) on [0,1]. Test n=5, 10, 20. Count how many digits improve per n.', expectedOutcome: 'sqrt(x) has ~O(n⁻¹·⁵) convergence — algebraic, not exponential' },
        { step: 3, instruction: 'Try the Gauss–Jacobi approach: use expression=sqrt(x)/(x+0.01) to avoid exact singularity.', expectedOutcome: 'Smoothing the singularity partially restores fast convergence' },
      ],
    },
    {
      id: 'c4',
      title: 'FEA Element Integration Simulation',
      description: 'Compute the exact integral of a polynomial basis function product as in FEA.',
      objective: 'Show that 2-point Gauss integrates quadratic element basis functions exactly.',
      difficulty: 'hard',
      steps: [
        { step: 1, instruction: 'Set expression=(1-x)*(1+x) (product of linear basis functions), a=-1, b=1, n=2.', actionLabel: 'Run' },
        { step: 2, instruction: 'Exact = ∫₋₁¹ (1-x²) dx = 2 − 2/3 = 4/3. Verify Gauss n=2 gives machine-epsilon error.', expectedOutcome: 'degree 2 ≤ 2(2)−1=3 → exact. This is what FEA uses for linear elements.' },
        { step: 3, instruction: 'Try quadratic element: expression=(1-x)**2*(1+x), n=2. Is 3 Gauss points needed?', expectedOutcome: 'degree 3 = 2(2)−1 → still exact with n=2. Try degree 4: needs n=3.' },
      ],
    },
  ],

  summary: {
    keyPoints: [
      { title: 'Key idea', description: 'Optimal node placement: nodes at zeros of Pₙ(x)', icon: '🎯' },
      { title: 'Exactness', description: 'n points integrates degree ≤ 2n−1 exactly', icon: '✨' },
      { title: 'Convergence', description: 'Exponential for analytic f — each point doubles digits', icon: '🚀' },
      { title: 'Scale factor', description: '∫ₐᵇ = (b−a)/2 × Σwᵢf(mapped xᵢ)', icon: '📐' },
      { title: 'Limitation', description: 'Requires smooth analytic f. Fails for singular integrands.', icon: '⚠️' },
    ],
    cheatSheetFormulas: [
      {
        label: 'Gauss–Legendre (general interval)',
        latex:
          '\\int_a^b f(x)\\,dx \\approx \\frac{b-a}{2}\\sum_{i=1}^n w_i\\,f\\!\\left(\\frac{(b-a)x_i+(a+b)}{2}\\right)',
        isKeyFormula: true,
      },
      {
        label: 'Exactness rule',
        latex: 'n\\text{ Gauss points: exact for }\\mathrm{deg}\\,f\\leq 2n-1',
      },
      {
        label: 'Convergence for analytic f',
        latex: 'E_n\\sim C\\cdot\\rho^{-2n}\\to 0\\text{ exponentially}',
      },
    ],
    nextSteps: [
      { label: 'Integration Comparison', description: 'Compare all three methods on the same problems', path: '/integration/comparison' },
      { label: 'Linear Systems', description: 'Module 6 — solve Ax=b by Gaussian elimination and iterative methods', path: '/linear-systems' },
    ],
  },
}
