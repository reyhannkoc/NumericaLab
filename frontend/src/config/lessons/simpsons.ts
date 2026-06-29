import type { LessonConfig } from '@/types/lesson.types'

export const SIMPSONS_CONFIG: LessonConfig = {
  header: {
    moduleId: 'integration',
    moduleColor: '#ec4899',
    title: "Simpson's 1/3 Rule",
    subtitle: 'Fourth-order quadrature using parabolic interpolation',
    difficulty: 'intermediate',
    estimatedMinutes: 55,
    objectives: [
      "Derive Simpson's rule from quadratic (parabolic) interpolation",
      'Understand why O(h⁴) is superior to trapezoidal O(h²)',
      'Know the n-must-be-even constraint and its reason',
      'Apply the rule to smooth integrands with high efficiency',
      "Compare Simpson's with trapezoidal and Gaussian quadrature",
    ],
    prerequisites: [
      { title: 'Trapezoidal Rule', path: '/integration/trapezoidal', required: true },
    ],
    tags: ['quadrature', 'O(h⁴)', 'parabolic', "Simpson's", 'composite', 'numerical integration'],
  },

  motivation: {
    problemStatement:
      'You need to integrate f(x) = eˣ on [0,1] to 6 significant digits. ' +
      'The trapezoidal rule needs n ≈ 1700 steps. Can we do it with n = 100?',
    whyItMatters:
      "Simpson's rule fits a parabola (degree-2 polynomial) through every three consecutive points " +
      'instead of a line. Parabolas approximate smooth curves far better, reducing the error from ' +
      'O(h²) to O(h⁴) — the same accuracy with n = 1700/17 ≈ 100 subintervals.',
    historicalBackground:
      "Thomas Simpson (1710–1761) published the rule in his 1743 work on mathematical summation, " +
      'though it was known earlier to Newton and Gregory. Today it is the default method in most ' +
      'engineering calculators and numerical integration libraries.',
    engineeringMotivation:
      'In computational fluid dynamics, pressure-drop integrals must be computed thousands of times ' +
      "per simulation. Simpson's rule offers the best accuracy-per-evaluation tradeoff for smooth " +
      'integrands, making it the workhorse of engineering quadrature.',
    motivatingExample: {
      title: 'Area under a parabolic arch (bridge cross-section)',
      description:
        "f(0)=0, f(1)=4, f(2)=0 (arch height in meters). Simpson's with n=2: " +
        "I ≈ (1/3)[f(0) + 4f(1) + f(2)] = (1/3)[0 + 16 + 0] = 16/3 m².",
      expression: "∫₀² f(x) dx ≈ (h/3)[f₀ + 4f₁ + f₂]",
      result: "Exact for any quadratic — Simpson's integrates degree ≤ 3 polynomials exactly",
    },
  },

  theory: {
    overview:
      "The composite Simpson's 1/3 rule divides [a,b] into n even subintervals (h = (b−a)/n). " +
      'On each pair of consecutive subintervals [x₂ᵢ, x₂ᵢ₊₂], it fits a parabola through the three ' +
      'points (x₂ᵢ, f₂ᵢ), (x₂ᵢ₊₁, f₂ᵢ₊₁), (x₂ᵢ₊₂, f₂ᵢ₊₂) and integrates analytically.',
    intuition:
      'A line through two points can exactly represent a linear function. A parabola through three ' +
      'points can exactly represent any quadratic. Integrating a parabola exactly gives a better ' +
      'approximation than integrating a line — at no extra cost (same number of function evaluations).',
    advantages: [
      'O(h⁴) accuracy — doubling n reduces error by 16×',
      'Exact for polynomials of degree ≤ 3 (superconvergence)',
      'Only n+1 evaluations for n subintervals',
      'Easy to implement from the trapezoidal pattern',
      'Adaptive variants (Adaptive Simpson\'s) handle non-smooth sub-regions',
    ],
    limitations: [
      'n must be even — cannot use an odd number of subintervals',
      'Requires f to be four-times differentiable for O(h⁴) guarantee',
      'For non-smooth integrands, no better than trapezoidal',
      'Less flexible than Gaussian quadrature for highly oscillatory functions',
    ],
    keyInsights: [
      "Simpson's integrates all polynomials of degree ≤ 3 exactly (one order higher than expected from quadratic fit)",
      'The 1:4:2:4:...:4:1 weight pattern comes from alternating parabola contributions',
      'The n-must-be-even requirement: each parabola spans 2 subintervals (3 points)',
    ],
  },

  mathFoundation: {
    formulas: [
      {
        label: "Composite Simpson's 1/3 Rule",
        latex:
          "\\int_a^b f(x)\\,dx \\approx \\frac{h}{3}\\left[f_0 + 4f_1 + 2f_2 + 4f_3 + \\cdots + 4f_{n-1} + f_n\\right]",
        description: 'Weights: 1 at ends, alternating 4,2,4,2,...,4 in the middle. n must be even.',
        isKeyFormula: true,
      },
      {
        label: 'Single Simpson Rule (3-point)',
        latex:
          "\\int_{x_0}^{x_2} f(x)\\,dx \\approx \\frac{h}{3}\\bigl[f(x_0)+4f(x_1)+f(x_2)\\bigr]",
        description: 'Integrates a parabola through (x₀,f₀), (x₁,f₁), (x₂,f₂) exactly',
      },
      {
        label: 'Global Error',
        latex:
          "E_S = -\\frac{(b-a)h^4}{180}\\,f^{(4)}(\\xi),\\quad \\xi\\in(a,b)",
        description: 'O(h⁴) — 16× error reduction for each doubling of n',
        isKeyFormula: true,
      },
      {
        label: 'Local Error per Pair',
        latex:
          'e_i = -\\frac{h^5}{90}\\,f^{(4)}(\\xi_i)',
        description: 'O(h⁵) local error over 2h width; summing n/2 pairs gives O(h⁴) global error',
      },
      {
        label: 'Required n for Target Error',
        latex:
          'n \\geq \\left(\\frac{(b-a)^5 |f^{(4)}|_{\\max}}{180\\,\\varepsilon_{\\text{tol}}}\\right)^{1/4}',
        description: 'n must be rounded up to the next even integer',
        isKeyFormula: true,
      },
    ],
    symbols: [
      { symbol: 'h', definition: 'Step size: h = (b−a)/n', unit: 'same as x' },
      { symbol: 'n', definition: 'Number of subintervals — must be even', unit: 'dimensionless' },
      { symbol: 'f⁽⁴⁾(ξ)', definition: 'Fourth derivative at some point ξ — controls O(h⁴) error' },
      { symbol: '1:4:2:4:...:1', definition: 'Simpson weight pattern — alternates 4,2 for interior points' },
    ],
    derivationSteps: [
      {
        step: 1,
        description: 'Fit a parabola P₂(x) through (x₀,f₀), (x₁,f₁), (x₂,f₂) using Lagrange interpolation',
        latex:
          'P_2(x) = f_0\\frac{(x-x_1)(x-x_2)}{(x_0-x_1)(x_0-x_2)} + f_1\\frac{(x-x_0)(x-x_2)}{\\cdots} + f_2\\frac{\\cdots}{\\cdots}',
      },
      {
        step: 2,
        description: 'Integrate P₂(x) exactly over [x₀, x₂] with h = x₁−x₀',
        latex:
          '\\int_{x_0}^{x_2} P_2(x)\\,dx = \\frac{h}{3}(f_0 + 4f_1 + f_2)',
      },
      {
        step: 3,
        description: 'Repeat for each pair [x₂ᵢ, x₂ᵢ₊₂], then sum. Interior shared endpoints cancel to give coefficient 2.',
        latex:
          '\\int_a^b f\\,dx \\approx \\frac{h}{3}\\bigl[f_0 + 4f_1 + 2f_2 + 4f_3 + 2f_4 + \\cdots + 4f_{n-1} + f_n\\bigr]',
      },
      {
        step: 4,
        description: 'Error from Taylor expansion: parabola error per pair is O(h⁵); n/2 pairs give O(h⁴) total',
        latex:
          'E = \\frac{n}{2} \\cdot \\left(-\\frac{h^5}{90}f^{(4)}(\\xi_i)\\right) = -\\frac{(b-a)h^4}{180}f^{(4)}(\\xi)',
      },
    ],
    assumptions: [
      'f is four-times differentiable on [a, b]',
      'n is a positive even integer',
    ],
    convergenceCondition: 'E → 0 as h → 0 with |E| ≤ (b−a)⁵|f⁽⁴⁾|_max / (180n⁴)',
  },

  errorAnalysis: {
    metrics: [
      {
        label: 'Global Truncation Error',
        formula: '|(b−a)h⁴f⁽⁴⁾(ξ)| / 180',
        description: "O(h⁴) — 16× error reduction per n doubling. ~100× more efficient than trapezoidal at same n.",
      },
      {
        label: 'Round-off Error',
        formula: 'O(n·ε_mach)',
        description: 'Accumulates linearly with n — negligible unless n > 10⁶.',
      },
      {
        label: 'Absolute Error',
        formula: '|I_S − I_exact|',
        description: 'Measurable directly when exact integral is known.',
      },
      {
        label: 'Relative Error',
        formula: '|I_S − I_exact| / |I_exact|',
        description: 'Use for comparing methods across different integrand scales.',
      },
    ],
    stabilityNote:
      "Simpson's rule is unconditionally stable. Error decreases monotonically as n increases " +
      'for sufficiently smooth integrands. Verify by comparing results at n and 2n.',
    floatingPointNote:
      'For n > 10⁵, round-off in the alternating 4:2:4:2 summation may degrade accuracy. ' +
      'Kahan summation or pairwise summation mitigates this.',
  },

  performance: {
    complexity: {
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1) or O(n) if storing interval results',
      convergenceOrder: 'O(h⁴)',
      convergenceOrderNote: 'Fourth-order: doubling n reduces error by 16×',
    },
    bestCase: 'Polynomial of degree ≤ 3 (exact), or smooth analytic function',
    worstCase: 'Integrand with large |f⁽⁴⁾|, or non-smooth integrand (reverts to O(h²))',
    typicalIterations: 'n = 10–50 achieves 8-digit accuracy for typical smooth engineering functions',
  },

  comparison: {
    methods: ['Trapezoidal', "Simpson's 1/3", "Simpson's 3/8"],
    criteria: ['Formula', 'Order', 'Points needed', 'Exact for', 'Typical n'],
    table: [
      {
        criterion: 'Formula',
        'Trapezoidal': 'h/2 [f₀ + 2Σfᵢ + fₙ]',
        "Simpson's 1/3": 'h/3 [f₀ + 4f₁ + 2f₂ + ... + fₙ]',
        "Simpson's 3/8": '3h/8 [f₀ + 3f₁ + 3f₂ + 2f₃ + ... + fₙ]',
      },
      {
        criterion: 'Order',
        'Trapezoidal': 'O(h²)',
        "Simpson's 1/3": 'O(h⁴)',
        "Simpson's 3/8": 'O(h⁴)',
      },
      {
        criterion: 'Points needed',
        'Trapezoidal': 'n+1 (any n)',
        "Simpson's 1/3": 'n+1 (n even)',
        "Simpson's 3/8": 'n+1 (n multiple of 3)',
      },
      {
        criterion: 'Exact for',
        'Trapezoidal': 'Degree ≤ 1',
        "Simpson's 1/3": 'Degree ≤ 3',
        "Simpson's 3/8": 'Degree ≤ 3',
      },
      {
        criterion: 'Typical n',
        'Trapezoidal': '~1000 for 6 digits',
        "Simpson's 1/3": '~100 for 6 digits',
        "Simpson's 3/8": '~100 for 6 digits',
      },
    ],
    summary:
      "Simpson's 1/3 is preferred over 3/8 because it has the same accuracy with fewer constraints. " +
      'Use trapezoidal for tabulated/non-smooth data. Use Gaussian quadrature when maximum accuracy per evaluation is needed.',
  },

  engineeringApplications: [
    {
      field: 'Aerospace Engineering',
      title: 'Fuel Burn Rate Integration',
      description:
        'Fuel mass flow rate ṁ(t) is measured from the engine controller during a flight test. ' +
        "Total fuel consumed M = ∫ṁ dt is computed with Simpson's for high accuracy.",
      example: '200 sensor samples at 10 Hz over 20 s → n=199 (round to even=200) → total fuel',
      icon: '✈️',
      difficulty: 'introductory',
    },
    {
      field: 'Biomedical Engineering',
      title: 'Drug Concentration Area Under the Curve (AUC)',
      description:
        'Pharmacokinetic studies measure plasma drug concentration C(t) at discrete times. ' +
        "AUC = ∫C dt determines total drug exposure. Simpson's rule is the clinical standard.",
      example: 'C sampled at t = 0,0.5,1,2,4,6,8,12 h → composite Simpson\'s → AUC in µg·h/mL',
      icon: '💊',
      difficulty: 'intermediate',
    },
    {
      field: 'Electrical Engineering',
      title: 'Fourier Coefficient Computation',
      description:
        'Fourier series coefficients aₙ = (2/T)∫f(t)cos(nωt)dt are computed numerically. ' +
        "Simpson's rule provides high accuracy for the oscillatory integrands.",
      example: 'Square wave: 200-point FFT preprocessing via Simpson quadrature',
      icon: '📡',
      difficulty: 'intermediate',
    },
    {
      field: 'Structural Engineering',
      title: 'Deflection by Double Integration',
      description:
        'Beam deflection δ(x) = (1/EI)∬M(x)dx² requires integrating the bending moment twice. ' +
        "Simpson's rule applied twice gives O(h⁴) accuracy with few evaluation points.",
      example: 'Beam with parabolic distributed load: 20 stations → two Simpson passes → deflection',
      icon: '🏛️',
      difficulty: 'advanced',
    },
    {
      field: 'Chemical Engineering',
      title: 'Reactor Residence Time Distribution',
      description:
        'The mean residence time τ = ∫t·E(t)dt and variance require numerical integration of ' +
        'experimentally measured E(t) curves from tracer experiments.',
      example: 'RTD experiment: 50 concentration samples → Simpson integration → τ, σ²',
      icon: '⚗️',
      difficulty: 'intermediate',
    },
  ],

  commonMistakes: [
    {
      id: 'm1',
      title: 'Using an odd number of subintervals',
      description:
        "Simpson's 1/3 rule requires n to be even. If n is odd, the formula is undefined. " +
        'Many implementations silently drop the last subinterval — causing incorrect results.',
      wrongApproach: 'n=11 → only compute over 10 subintervals, ignoring the 11th strip',
      correctApproach: 'Always round n up to the nearest even integer, or use n+1 when n is odd',
      icon: '⚠️',
    },
    {
      id: 'm2',
      title: 'Wrong weight pattern',
      description:
        'The interior weights alternate: 4,2,4,2,...,4. A common bug is using all 4s or all 2s for interior points.',
      wrongApproach: 'h/3 [f₀ + 4f₁ + 4f₂ + 4f₃ + ... + fₙ]',
      correctApproach: 'h/3 [f₀ + 4f₁ + 2f₂ + 4f₃ + 2f₄ + ... + 4fₙ₋₁ + fₙ]',
      icon: '🔢',
    },
    {
      id: 'm3',
      title: "Expecting O(h⁴) for non-smooth integrands",
      description:
        'The O(h⁴) bound requires f⁽⁴⁾ to be bounded. For functions with discontinuities in ' +
        'lower derivatives, accuracy reverts to the order of the first discontinuous derivative.',
      wrongApproach: "Apply Simpson's to |x| on [-1,1] expecting O(h⁴)",
      correctApproach: 'Split at x=0 and apply Simpson separately: ∫₋₁⁰ + ∫₀¹',
      icon: '📈',
    },
    {
      id: 'm4',
      title: 'Forgetting to check n-even at each refinement step',
      description:
        "When halving the step size for Richardson extrapolation or adaptive refinement, n doubles — " +
        "it stays even. But if the starting n is odd, all refined versions are odd too.",
      wrongApproach: 'Start with n=5 and double to 10, 20 — n=5 is odd, first call fails',
      correctApproach: 'Always initialize with an even n (e.g., n=10) before any refinement',
      icon: '🎯',
    },
  ],

  practiceProblems: [
    {
      id: 'p1',
      title: "Apply Simpson's to ∫₀¹ x³ dx with n=4",
      description:
        "Compute Simpson's 1/3 approximation for ∫₀¹ x³ dx with n=4. Exact value = 1/4. " +
        'Verify that the result is exact (x³ is degree 3 — within the exactness range).',
      difficulty: 'easy',
      expression: 'x**3',
      params: { a: 0, b: 1, n: 4 },
      hint: 'h=0.25. Points: 0, 0.25, 0.5, 0.75, 1.0. Apply 1:4:2:4:1 weights.',
      expectedAnswer: 'I = (0.25/3)[0 + 4(0.015625) + 2(0.125) + 4(0.421875) + 1] = 0.25 exactly. ✓',
    },
    {
      id: 'p2',
      title: 'Convergence order verification for ∫₀¹ eˣ dx',
      description:
        "Compute with n=4, 8, 16 and verify 16× error reduction per doubling (O(h⁴)).",
      difficulty: 'medium',
      expression: 'exp(x)',
      params: { a: 0, b: 1, n: 4 },
      hint: 'Exact = e−1 ≈ 1.71828. Check E(8)/E(4) ≈ 1/16.',
      expectedAnswer:
        'E(4)≈3.0×10⁻⁷, E(8)≈1.8×10⁻⁸, E(16)≈1.1×10⁻⁹. Ratios ≈ 1/16 → O(h⁴) confirmed.',
    },
    {
      id: 'p3',
      title: 'Find minimum n for |error| < 10⁻⁶ on ∫₀² sin(x) dx',
      description:
        'Use the error bound |E| ≤ (b−a)h⁴|f⁽⁴⁾|_max/180 to find n. f⁽⁴⁾(x) = sin(x); max on [0,2] ≈ 0.909.',
      difficulty: 'medium',
      expression: 'sin(x)',
      params: { a: 0, b: 2 },
      hint: 'Solve (2)(h⁴)(0.909)/180 < 10⁻⁶ for h, then n = (b−a)/h rounded up to even.',
      expectedAnswer:
        'h⁴ < 180×10⁻⁶/(2×0.909) ≈ 9.9×10⁻⁵ → h < 0.178 → n ≥ 12. Round to even: n=12.',
    },
    {
      id: 'p4',
      title: "Simpson's vs Trapezoidal efficiency comparison",
      description:
        'For ∫₀¹ eˣ dx with target error 10⁻⁸, find n for each method. ' +
        'How many more trapezoidal evaluations are needed?',
      difficulty: 'hard',
      hint:
        'Trapezoidal: n² ≥ (b−a)³|f\'\'|_max/(12ε). Simpson\'s: n⁴ ≥ (b−a)⁵|f⁽⁴⁾|_max/(180ε).',
      expectedAnswer:
        "Trapezoidal needs n ≈ 15000 (225M times more work than Simpson's n≈27). " +
        "O(h⁴) vs O(h²) is worth the parabolic bookkeeping.",
    },
  ],

  interactiveChallenges: [
    {
      id: 'c1',
      title: "Verify Simpson's Exactness for Polynomials",
      description: 'Confirm that any cubic polynomial is integrated exactly by Simpson\'s rule.',
      objective: "Show that x³ on [0,1] gives exactly 0.25 with any even n.",
      difficulty: 'easy',
      steps: [
        { step: 1, instruction: 'Set expression=x**3, a=0, b=1, n=2. Run. Note the error.', actionLabel: 'Run' },
        { step: 2, instruction: 'Change n=4, n=6, n=10. The error should be machine epsilon regardless.', expectedOutcome: "Simpson's is exact for degree ≤ 3 — error is ~1e-16 regardless of n" },
      ],
    },
    {
      id: 'c2',
      title: "Compare Simpson's vs Trapezoidal for the Same Function",
      description: "Quantify how much better Simpson's is than trapezoidal for the same n.",
      objective: "For eˣ on [0,1] with n=10, find the error ratio between the two methods.",
      difficulty: 'medium',
      steps: [
        { step: 1, instruction: 'Integrate exp(x) on [0,1] with Trapezoidal n=10. Note error.', actionLabel: 'Run Trap' },
        { step: 2, instruction: 'Switch to Simpson\'s n=10. Note error.', actionLabel: "Run Simpson's" },
        { step: 3, instruction: 'Compute the ratio. Expected: ~1000× better for n=10.', expectedOutcome: "Simpson's ~1000× more accurate at same n — demonstrating O(h⁴) vs O(h²)" },
      ],
    },
    {
      id: 'c3',
      title: 'Odd n Edge Case',
      description: "Observe what happens when you pass odd n to Simpson's rule.",
      objective: 'Understand the n-must-be-even constraint from first principles.',
      difficulty: 'easy',
      steps: [
        { step: 1, instruction: "Try n=5 for Simpson's rule. What error does the system report?", actionLabel: 'Try n=5' },
        { step: 2, instruction: 'Change to n=6. Now it works. Why does n=5 fail?', expectedOutcome: 'Each parabola spans 2 subintervals — you cannot pair an odd number of subintervals' },
      ],
    },
    {
      id: 'c4',
      title: "Beat Simpson's with Gaussian Quadrature",
      description: "For a smooth function, find the minimum Gauss points needed to match Simpson's n=100.",
      objective: "Discover that Gaussian quadrature with 5 points can match Simpson's n=100.",
      difficulty: 'hard',
      steps: [
        { step: 1, instruction: 'Integrate exp(x) on [0,1] with Simpson\'s n=100. Note the absolute error.', actionLabel: "Run Simpson's" },
        { step: 2, instruction: 'Switch to Gaussian Quadrature. Try n=3, n=5, n=7. When does it match?', expectedOutcome: 'Gaussian n=5 achieves similar or better accuracy — exponential vs polynomial convergence' },
      ],
    },
  ],

  summary: {
    keyPoints: [
      { title: 'Formula', description: 'h/3 [f₀ + 4f₁ + 2f₂ + ... + 4fₙ₋₁ + fₙ], n even', icon: '📐' },
      { title: 'Accuracy', description: 'O(h⁴) — 16× error reduction per n doubling', icon: '🎯' },
      { title: 'Exactness', description: 'Exact for polynomials of degree ≤ 3', icon: '✨' },
      { title: 'Constraint', description: 'n must be an even positive integer', icon: '⚠️' },
      { title: 'Use case', description: 'Default for smooth engineering integrands', icon: '⚙️' },
    ],
    cheatSheetFormulas: [
      {
        label: "Simpson's 1/3",
        latex:
          "\\int_a^b f\\,dx \\approx \\frac{h}{3}\\bigl[f_0 + 4f_1 + 2f_2 + 4f_3 + \\cdots + 4f_{n-1} + f_n\\bigr]",
        isKeyFormula: true,
      },
      {
        label: 'Global Error',
        latex: "E_S = -\\frac{(b-a)h^4}{180}\\,f^{(4)}(\\xi)",
      },
      {
        label: "Trapezoidal vs Simpson's",
        latex:
          'O(h^2) \\xrightarrow{\\text{parabolic fit}} O(h^4) \\quad\\text{at same cost}',
      },
    ],
    nextSteps: [
      { label: 'Gaussian Quadrature', description: 'Optimal nodes for even faster convergence', path: '/integration/gaussian-quadrature' },
      { label: 'Integration Comparison', description: 'Side-by-side comparison of all three methods', path: '/integration/comparison' },
      { label: 'Linear Systems', description: 'Next module — solving Ax=b numerically', path: '/linear-systems' },
    ],
  },
}
