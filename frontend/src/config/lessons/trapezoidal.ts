import type { LessonConfig } from '@/types/lesson.types'

export const TRAPEZOIDAL_CONFIG: LessonConfig = {
  header: {
    moduleId: 'integration',
    moduleColor: '#ec4899',
    title: 'Trapezoidal Rule',
    subtitle: 'Approximate definite integrals by fitting trapezoids under the curve',
    difficulty: 'introductory',
    estimatedMinutes: 50,
    objectives: [
      'Derive the composite trapezoidal rule from the Taylor series',
      'Understand the O(h²) global error and its dominant term',
      'Identify the tradeoff between step count and computational cost',
      'Apply the method to smooth and non-smooth integrands',
      'Recognize when the trapezoidal rule is preferred over higher-order methods',
    ],
    prerequisites: [
      { title: 'Forward Difference', path: '/differentiation/forward', required: false },
    ],
    tags: ['quadrature', 'O(h²)', 'composite', 'trapezoidal', 'numerical integration'],
  },

  motivation: {
    problemStatement:
      'A car\'s accelerometer records velocity every 50 ms. You need the total distance traveled ' +
      'over 10 seconds, but you only have 200 discrete velocity samples — not a continuous function.',
    whyItMatters:
      'Most engineering integrals cannot be computed analytically. Sensor data, simulation outputs, ' +
      'and empirical measurements are all discrete. Numerical integration turns discrete samples ' +
      'into area estimates using only arithmetic — the trapezoidal rule is the simplest and most robust.',
    historicalBackground:
      'The trapezoidal rule dates to ancient Egypt (Moscow Mathematical Papyrus, ~1850 BC) for computing ' +
      'volumes. Euler and Newton formalized it in the 17th century as part of the broader theory of ' +
      'numerical quadrature that underpins modern scientific computing.',
    engineeringMotivation:
      'In structural analysis, internal forces require integrating distributed loads. In signal processing, ' +
      'energy is the integral of power over time. In thermodynamics, work is ∫P dV. All of these ' +
      'integrals appear in practice as discrete datasets where the trapezoidal rule is the default tool.',
    motivatingExample: {
      title: 'Distance from velocity samples',
      description:
        'v(0)=0, v(1)=10, v(2)=18, v(3)=24 m/s (h=1 s). ' +
        'Trapezoidal: d ≈ (1/2)[0 + 2(10) + 2(18) + 24] = 40 m.',
      expression: '∫₀³ v(t) dt ≈ (h/2)[v₀ + 2v₁ + 2v₂ + v₃]',
      result: 'Error ∝ h² — doubling n reduces error by a factor of 4 (O(h²) method)',
    },
  },

  theory: {
    overview:
      'The composite trapezoidal rule divides [a, b] into n equal subintervals of width h = (b−a)/n. ' +
      'On each subinterval [xᵢ, xᵢ₊₁], the integrand is approximated by the straight line connecting ' +
      'the endpoints — a trapezoid. Summing all trapezoid areas gives the composite formula.',
    intuition:
      'Think of filling the area under a curve with thin trapezoids. Each trapezoid has parallel ' +
      'vertical sides of height f(xᵢ) and f(xᵢ₊₁), a width h, and area h(f(xᵢ)+f(xᵢ₊₁))/2. ' +
      'As the trapezoids get thinner, they approximate the true curved area more precisely.',
    advantages: [
      'Simple formula: only endpoint evaluations needed',
      'Works on non-smooth integrands where higher-order methods fail',
      'Exact for linear functions regardless of step size',
      'Adaptive extension (adaptive trapezoidal) handles singularities',
      'Euler–Maclaurin formula enables Richardson extrapolation (Romberg\'s method)',
    ],
    limitations: [
      'Only O(h²) global accuracy — doubling n quadruples the work for half the error',
      'Systematic underestimation for concave-up functions, overestimation for concave-down',
      'Requires n+1 function evaluations for n subintervals',
      'Much less efficient than Simpson\'s or Gauss for smooth integrands',
    ],
    keyInsights: [
      'The error term −(b−a)h²f\'\'(ξ)/12 shows: large |f\'\'(x)| means large error',
      'For periodic functions on full periods, trapezoidal rule converges exponentially — faster than any polynomial method',
      'The 1/2 weights at the endpoints come from the average of adjacent trapezoids sharing a corner',
    ],
  },

  mathFoundation: {
    formulas: [
      {
        label: 'Composite Trapezoidal Rule',
        latex:
          '\\int_a^b f(x)\\,dx \\approx \\frac{h}{2}\\left[f(x_0) + 2\\sum_{i=1}^{n-1}f(x_i) + f(x_n)\\right]',
        description: 'h = (b−a)/n, xᵢ = a + ih',
        isKeyFormula: true,
      },
      {
        label: 'Single Trapezoid Area',
        latex:
          '\\int_{x_i}^{x_{i+1}} f(x)\\,dx \\approx \\frac{h}{2}\\bigl[f(x_i)+f(x_{i+1})\\bigr]',
        description: 'Area of one trapezoid — average of two heights times width',
      },
      {
        label: 'Global Error (Composite)',
        latex:
          'E_T = -\\frac{(b-a)h^2}{12}\\,f\'\'(\\xi),\\quad \\xi\\in(a,b)',
        description: 'O(h²) global error — doubling n reduces error by 4×',
        isKeyFormula: true,
      },
      {
        label: 'Local Truncation Error (per subinterval)',
        latex:
          'e_i = -\\frac{h^3}{12}\\,f\'\'(\\xi_i)',
        description: 'Each trapezoid has O(h³) local error; summing n = (b−a)/h gives O(h²) global error',
      },
      {
        label: 'Step Size for Target Error',
        latex:
          'h \\leq \\sqrt{\\frac{12\\,\\varepsilon_{\\text{tol}}}{(b-a)\\,|f\'\'|_{\\max}}}',
        description: 'Choose n ≥ (b−a)/h to achieve absolute error < ε_tol',
        isKeyFormula: true,
      },
    ],
    symbols: [
      { symbol: 'h', definition: 'Step size: h = (b−a)/n', unit: 'same as x' },
      { symbol: 'n', definition: 'Number of subintervals (not points)', unit: 'dimensionless' },
      { symbol: 'f\'\'(ξ)', definition: 'Second derivative at some interior point ξ — controls error magnitude' },
      { symbol: 'xᵢ', definition: 'Grid points: xᵢ = a + i·h, i = 0,1,...,n' },
    ],
    derivationSteps: [
      {
        step: 1,
        description: 'Expand f(x) as a linear interpolant on [xᵢ, xᵢ₊₁]',
        latex:
          'f(x) \\approx f(x_i) + \\frac{f(x_{i+1})-f(x_i)}{h}(x-x_i)',
      },
      {
        step: 2,
        description: 'Integrate the linear interpolant over [xᵢ, xᵢ₊₁]',
        latex:
          '\\int_{x_i}^{x_{i+1}} f(x)\\,dx \\approx \\frac{h}{2}\\bigl[f(x_i)+f(x_{i+1})\\bigr]',
      },
      {
        step: 3,
        description: 'Sum over all n subintervals, noting interior points appear twice',
        latex:
          'I \\approx h\\left[\\frac{f(x_0)}{2} + f(x_1) + \\cdots + f(x_{n-1}) + \\frac{f(x_n)}{2}\\right]',
      },
      {
        step: 4,
        description: 'Error from Taylor expansion of local error, summed over n intervals',
        latex:
          'E = \\sum_{i=0}^{n-1}\\left(-\\frac{h^3}{12}f\'\'(\\xi_i)\\right) = -\\frac{nh^3}{12}f\'\'(\\xi) = -\\frac{(b-a)h^2}{12}f\'\'(\\xi)',
      },
    ],
    assumptions: [
      'f is twice differentiable on [a, b]',
      'n is a positive integer (any n ≥ 1)',
    ],
    convergenceCondition: 'E → 0 as n → ∞ (h → 0), with |E| ≤ (b−a)³|f\'\'|_max / (12n²)',
  },

  errorAnalysis: {
    metrics: [
      {
        label: 'Global Truncation Error',
        formula: '|(b−a)h²f\'\'(ξ)| / 12',
        description: 'O(h²) — quadrupling n reduces error by 16×. Dominant for smooth functions.',
      },
      {
        label: 'Round-off Error',
        formula: 'O(n·ε_mach)',
        description: 'Accumulates over n evaluations. Rarely dominates for n < 10⁶.',
      },
      {
        label: 'Absolute Error',
        formula: '|I_numerical − I_exact|',
        description: 'Directly measurable when the exact integral is known.',
      },
      {
        label: 'Relative Error',
        formula: '|I_numerical − I_exact| / |I_exact|',
        description: 'Scale-independent — useful for comparing methods across different integrands.',
      },
    ],
    stabilityNote:
      'The trapezoidal rule is unconditionally stable — error decreases monotonically as n increases ' +
      'for smooth functions. No catastrophic cancellation for reasonable n.',
    floatingPointNote:
      'For very large n (> 10⁶), round-off accumulation in the sum can degrade accuracy. ' +
      'Kahan summation can mitigate this in production code.',
  },

  performance: {
    complexity: {
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1) or O(n) if storing intervals',
      convergenceOrder: 'O(h²)',
      convergenceOrderNote: 'Second-order global: doubling n reduces error by 4×',
    },
    bestCase: 'Linear integrand (exact for any n), or periodic function on full period',
    worstCase: 'Integrand with large |f\'\'(x)| requires many subintervals for target accuracy',
    typicalIterations: 'n = 100–1000 gives 6–8 digit accuracy for typical smooth functions',
  },

  comparison: {
    methods: ['Trapezoidal', "Simpson's 1/3", 'Gaussian Quadrature'],
    criteria: ['Formula', 'Order', 'n constraint', 'Best for', 'Evaluations'],
    table: [
      {
        criterion: 'Formula',
        'Trapezoidal': 'h/2 [f₀ + 2Σfᵢ + fₙ]',
        "Simpson's 1/3": 'h/3 [f₀ + 4f₁ + 2f₂ + ... + fₙ]',
        'Gaussian Quadrature': 'Σ wᵢ f(xᵢ) on transformed interval',
      },
      {
        criterion: 'Order',
        'Trapezoidal': 'O(h²)',
        "Simpson's 1/3": 'O(h⁴)',
        'Gaussian Quadrature': 'Exact for deg ≤ 2n−1',
      },
      {
        criterion: 'n constraint',
        'Trapezoidal': 'Any n ≥ 1',
        "Simpson's 1/3": 'n must be even',
        'Gaussian Quadrature': 'n = number of Gauss points',
      },
      {
        criterion: 'Best for',
        'Trapezoidal': 'Non-smooth, tabulated data',
        "Simpson's 1/3": 'Smooth polynomials, general use',
        'Gaussian Quadrature': 'Smooth analytic functions, high precision',
      },
      {
        criterion: 'Evaluations',
        'Trapezoidal': 'n+1',
        "Simpson's 1/3": 'n+1',
        'Gaussian Quadrature': 'n (Gauss points)',
      },
    ],
    summary:
      "For smooth analytic functions, Gaussian quadrature converges exponentially and dominates. " +
      "Simpson's is a good general-purpose choice. Trapezoidal excels for non-smooth or tabulated data " +
      "and is optimal for periodic functions on full periods (spectral convergence).",
  },

  engineeringApplications: [
    {
      field: 'Mechanical Engineering',
      title: 'Work Done by a Variable Force',
      description:
        'A spring force F(x) = kx is measured at discrete positions x₀,...,xₙ. ' +
        'Work W = ∫F dx is computed via the trapezoidal rule from the force-displacement table.',
      example: 'F = [0, 10, 18, 24] N at x = [0, 0.1, 0.2, 0.3] m → W ≈ 3.6 J',
      icon: '⚙️',
      difficulty: 'introductory',
    },
    {
      field: 'Electrical Engineering',
      title: 'Signal Energy from Power Samples',
      description:
        'Power p(t) is sampled at 1 kHz. Total energy E = ∫p dt is computed numerically ' +
        'over each sampling period using composite trapezoidal integration.',
      example: 'Energy in 1 s signal with p sampled at 1000 Hz → 1000 trapezoids',
      icon: '⚡',
      difficulty: 'introductory',
    },
    {
      field: 'Civil Engineering',
      title: 'Area Under a Bending Moment Diagram',
      description:
        'Moment M(x) diagrams are often known at discrete points. The slope of the deflection ' +
        'curve θ = (1/EI) ∫M dx is computed by numerical integration of the moment data.',
      example: 'Beam with point loads: M sampled at 20 stations → composite trapezoidal',
      icon: '🏗️',
      difficulty: 'intermediate',
    },
    {
      field: 'Environmental Science',
      title: 'Pollutant Mass Flux in a River',
      description:
        'Concentration C(y) and velocity v(y) vary across a river cross-section. ' +
        'Total mass flux = ∫C(y)v(y) dy is measured at discrete depth samples.',
      example: '10 depth samples → 9 trapezoids → pollutant flux in kg/s',
      icon: '🌊',
      difficulty: 'intermediate',
    },
    {
      field: 'Thermodynamics',
      title: 'Thermodynamic Work in a P-V Diagram',
      description:
        'Pressure P and volume V are recorded during a gas compression cycle. ' +
        'Work W = ∫P dV is numerically integrated from the measured P-V data points.',
      example: 'Diesel cycle: 50 P-V pairs → trapezoidal integration → cycle work in J',
      icon: '🔥',
      difficulty: 'intermediate',
    },
  ],

  commonMistakes: [
    {
      id: 'm1',
      title: 'Confusing n (intervals) with n (points)',
      description:
        'The trapezoidal rule with n=10 requires 11 function evaluations (n+1 points). ' +
        'Off-by-one errors in indexing are the most common implementation bug.',
      wrongApproach: 'for i in range(n): use f(xᵢ) — misses the last point f(xₙ)',
      correctApproach: 'Sum from i=0 to n inclusive: f(x₀)/2 + f(x₁) + ... + f(xₙ)/2',
      icon: '⚠️',
    },
    {
      id: 'm2',
      title: 'Applying the rule to non-smooth functions without refinement',
      description:
        'If f has a kink or discontinuity, the trapezoidal rule converges only at O(h) — ' +
        'the same as the forward difference. Extra refinement near the singularity is required.',
      wrongApproach: 'Use uniform n=100 on [0,2] for f(x) = √x near x=0',
      correctApproach: 'Cluster points near x=0, or use adaptive quadrature',
      icon: '📈',
    },
    {
      id: 'm3',
      title: 'Expecting O(h²) on non-smooth integrands',
      description:
        'The O(h²) error bound requires f\'\'(x) to exist and be bounded. ' +
        'For functions with jumps in the derivative, error is O(h), not O(h²).',
      wrongApproach: 'Trusting O(h²) convergence for |x| or piecewise functions',
      correctApproach: 'Split the integration domain at the discontinuity and apply each piece separately',
      icon: '🎯',
    },
    {
      id: 'm4',
      title: 'Not checking convergence',
      description:
        'Always verify by halving n and checking that the error decreases by ~4× (O(h²)). ' +
        'If error halves instead, the integrand is non-smooth in [a,b].',
      wrongApproach: 'Use n=100 and trust the result without verification',
      correctApproach: 'Run n=100, n=200, n=400 and verify 4× error reduction at each doubling',
      icon: '✅',
    },
  ],

  practiceProblems: [
    {
      id: 'p1',
      title: '∫₀¹ x² dx with n=4',
      description:
        'Compute the trapezoidal approximation of ∫₀¹ x² dx with n=4 subintervals. ' +
        'Compare with the exact value 1/3.',
      difficulty: 'easy',
      expression: 'x**2',
      params: { a: 0, b: 1, n: 4 },
      hint: 'h=0.25, xᵢ = 0, 0.25, 0.5, 0.75, 1.0. Apply the composite formula.',
      expectedAnswer:
        'I ≈ (0.25/2)[0 + 2(0.0625) + 2(0.25) + 2(0.5625) + 1] = 0.34375. Error = 0.34375 − 1/3 ≈ 0.0104.',
    },
    {
      id: 'p2',
      title: 'Convergence order verification for ∫₀π sin(x) dx',
      description:
        'Compute with n=4, 8, 16 and verify the error halves each time (O(h²) behavior). ' +
        'Exact value = 2.',
      difficulty: 'medium',
      expression: 'sin(x)',
      params: { a: 0, b: 3.14159, n: 4 },
      hint: 'Compute E(n) = |I_trap(n) − 2| for each n. E(8)/E(4) should be ≈ 0.25.',
      expectedAnswer:
        'E(4)≈0.0396, E(8)≈0.0099, E(16)≈0.00248. Each doubling: error/4 — confirms O(h²).',
    },
    {
      id: 'p3',
      title: 'Find n for |error| < 10⁻⁴ on ∫₀¹ eˣ dx',
      description:
        'Use the error bound |E| ≤ (b−a)h²|f\'\'|_max/12 to find the minimum n that guarantees ' +
        '|error| < 10⁻⁴. Verify computationally.',
      difficulty: 'medium',
      expression: 'exp(x)',
      params: { a: 0, b: 1 },
      hint: 'f\'\'(x) = eˣ; |f\'\'|_max = e¹ ≈ 2.718. Solve (1)(h²)(2.718)/12 < 10⁻⁴.',
      expectedAnswer:
        'h ≤ √(12×10⁻⁴/2.718) ≈ 0.0666 → n ≥ 15. Verify: n=15 gives error ≈ 9.4×10⁻⁵ < 10⁻⁴. ✓',
    },
    {
      id: 'p4',
      title: 'Trapezoidal integration of tabulated data',
      description:
        'A force sensor records: F = [0, 15, 25, 30, 28, 20] N at x = [0, 0.2, 0.4, 0.6, 0.8, 1.0] m. ' +
        'Compute work W = ∫F dx using the trapezoidal rule.',
      difficulty: 'hard',
      hint: 'h = 0.2 m (uniform). Apply the composite formula directly to the tabulated values.',
      expectedAnswer:
        'W = (0.2/2)[0 + 2(15) + 2(25) + 2(30) + 2(28) + 20] = 0.1[0+30+50+60+56+20] = 21.6 J.',
    },
  ],

  interactiveChallenges: [
    {
      id: 'c1',
      title: 'Verify O(h²) Convergence',
      description: 'Show that halving n always reduces the error by ~4× for a smooth integrand.',
      objective: 'Confirm second-order convergence empirically for ∫₀¹ eˣ dx.',
      difficulty: 'easy',
      steps: [
        { step: 1, instruction: 'Set expression=exp(x), a=0, b=1, n=10. Run. Note absolute error.', actionLabel: 'Run' },
        { step: 2, instruction: 'Change n to 20. Note new error. Ratio should be ≈ 0.25.', expectedOutcome: 'Error decreases by 4×' },
        { step: 3, instruction: 'Change n to 40. Verify error drops by another 4×.', expectedOutcome: 'Consistent O(h²) convergence confirmed' },
      ],
    },
    {
      id: 'c2',
      title: 'Find the Breaking Point for Non-Smooth Functions',
      description: 'Investigate what happens to O(h²) convergence when the integrand has a kink.',
      objective: 'Observe degraded convergence for |x−0.5| near x=0.5.',
      difficulty: 'medium',
      steps: [
        { step: 1, instruction: 'Integrate sin(x) on [0,π] with n=10, 20, 40. Verify 4× error reduction.', actionLabel: 'Smooth test' },
        { step: 2, instruction: 'Integrate abs(x-0.5) on [0,1] with n=10, 20, 40. Compare error ratios.', expectedOutcome: 'Error only halves (O(h), not O(h²)) — kink at x=0.5 destroys quadratic convergence' },
      ],
    },
    {
      id: 'c3',
      title: 'Compare Trapezoidal vs Simpson\'s Efficiency',
      description: 'For a smooth function, find how many more trapezoids are needed to match Simpson\'s accuracy.',
      objective: 'Understand why O(h⁴) is dramatically better than O(h²) for smooth integrands.',
      difficulty: 'hard',
      steps: [
        { step: 1, instruction: 'Integrate exp(x) on [0,1]. With Simpson\'s n=10, note the error.', actionLabel: 'Run Simpson\'s' },
        { step: 2, instruction: 'Switch to Trapezoidal. Increase n until error is similar to Simpson\'s n=10.', expectedOutcome: 'Need n ≈ 100 trapezoids to match n=10 Simpson\'s — 10× more evaluations' },
      ],
    },
    {
      id: 'c4',
      title: 'Spectral Convergence for Periodic Functions',
      description: 'Show that the trapezoidal rule converges exponentially for periodic integrands.',
      objective: 'Integrate ∫₀²π sin(x) dx and observe that even n=4 gives extremely small error.',
      difficulty: 'hard',
      steps: [
        { step: 1, instruction: 'Set expression=sin(x), a=0, b=6.2832 (2π), n=4. Note error.', actionLabel: 'Run' },
        { step: 2, instruction: 'Try n=2. Still surprisingly accurate for a periodic function.', expectedOutcome: 'Even n=2 gives near-zero error — the trapezoidal rule is spectrally accurate for periodic functions' },
        { step: 3, instruction: 'Compare with Simpson\'s at n=2. Which is more accurate?', expectedOutcome: 'Trapezoidal wins here — periodic functions are its specialty' },
      ],
    },
  ],

  summary: {
    keyPoints: [
      { title: 'Formula', description: 'h/2 [f₀ + 2f₁ + ... + 2fₙ₋₁ + fₙ], h = (b−a)/n', icon: '📐' },
      { title: 'Accuracy', description: 'O(h²) global error — doubling n reduces error by 4×', icon: '🎯' },
      { title: 'Error Bound', description: '|E| ≤ (b−a)h²|f\'\'|_max / 12', icon: '⚖️' },
      { title: 'Best case', description: 'Periodic functions (spectral convergence), tabulated data', icon: '✨' },
      { title: 'Limitation', description: 'O(h²) requires smooth f. Non-smooth → O(h) only', icon: '⚠️' },
    ],
    cheatSheetFormulas: [
      {
        label: 'Composite Trapezoidal',
        latex: '\\int_a^b f\\,dx \\approx \\frac{h}{2}\\left[f_0+2\\sum_{i=1}^{n-1}f_i+f_n\\right]',
        isKeyFormula: true,
      },
      {
        label: 'Global Error',
        latex: 'E = -\\frac{(b-a)h^2}{12}f\'\'(\\xi)',
      },
      {
        label: 'Required n for tolerance ε',
        latex: 'n \\geq \\sqrt{\\frac{(b-a)^3 |f\'\'|_{\\max}}{12\\,\\varepsilon}}',
      },
    ],
    nextSteps: [
      { label: "Simpson's Rule", description: 'O(h⁴) accuracy — 4× faster convergence for smooth functions', path: '/integration/simpsons' },
      { label: 'Gaussian Quadrature', description: 'Optimal node placement for maximum accuracy per evaluation', path: '/integration/gaussian-quadrature' },
      { label: 'Integration Comparison', description: 'Compare all three methods on the same problem', path: '/integration/comparison' },
    ],
  },
}
