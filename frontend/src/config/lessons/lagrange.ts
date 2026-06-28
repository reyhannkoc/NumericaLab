import type { LessonConfig } from '@/types/lesson.types'

export const LAGRANGE_CONFIG: LessonConfig = {
  header: {
    moduleId: 'interpolation',
    moduleColor: '#3b82f6',
    title: 'Lagrange Interpolation',
    subtitle: 'From linear interpolation to polynomial curves through any set of points',
    difficulty: 'intermediate',
    estimatedMinutes: 65,
    objectives: [
      'Understand linear interpolation as the degree-1 special case of polynomial interpolation',
      'Construct Lagrange basis polynomials Lᵢ(x) that are 1 at xᵢ and 0 at all other nodes',
      'Evaluate the Lagrange interpolating polynomial P(x) = Σ yᵢ Lᵢ(x)',
      'Apply the polynomial interpolation error bound to estimate accuracy',
      'Recognize Runge\'s phenomenon and explain when high-degree interpolation fails',
      'Choose appropriate node distributions to minimize interpolation error',
    ],
    prerequisites: [],
    tags: ['polynomial', 'basis functions', 'Runge phenomenon', 'node selection', 'error bound'],
  },

  motivation: {
    problemStatement:
      'You have temperature measurements at a weather station: recorded at 6 AM, 12 PM, and 6 PM. ' +
      'What was the temperature at 3 PM? You need a function that passes exactly through your measured values ' +
      'and can be evaluated at any intermediate time.',
    whyItMatters:
      'Interpolation is the mathematical backbone of digital graphics, sensor fusion, and scientific computing. ' +
      'Every bezier curve in your browser, every smooth signal reconstruction from samples, and every ' +
      'finite element solution relies on some form of polynomial interpolation. ' +
      'Lagrange interpolation is the conceptually cleanest formulation — uniqueness and existence in one formula.',
    historicalBackground:
      'Joseph-Louis Lagrange presented this interpolation formula in 1795, though the same result was ' +
      'independently discovered by Edward Waring in 1779. The formula\'s elegance lies in its basis ' +
      'polynomial construction: each Lᵢ is 1 at its own node and exactly 0 at all others, ' +
      'making the sum P(x) = Σ yᵢ Lᵢ(x) automatically satisfy all interpolation conditions.',
    engineeringMotivation:
      'In aerospace, aerodynamic coefficients are measured at a few Mach numbers and must be ' +
      'evaluated at arbitrary flight conditions. In robotics, joint positions are sampled at 100 Hz ' +
      'but smooth trajectory control requires evaluating position at any instant. ' +
      'Lagrange interpolation (and its relatives) solve both problems.',
    motivatingExample: {
      title: 'Linear interpolation: temperature at 3 PM',
      description:
        'T(6 AM) = 18°C, T(6 PM) = 28°C. ' +
        'Linear interpolation: T(3 PM) = 18 + (28-18)·(9/12) = 25.5°C. ' +
        'This is exactly Lagrange interpolation with n=1 (two points → one line).',
      expression: 'T(t) = 18·L₀(t) + 28·L₁(t)',
      result: 'T(3 PM) ≈ 25.5°C',
    },
  },

  theory: {
    overview:
      'Given n+1 distinct data points (x₀,y₀), …, (xₙ,yₙ), there is exactly one polynomial of ' +
      'degree at most n that passes through all of them. Lagrange\'s formula constructs this polynomial ' +
      'explicitly using n+1 "basis polynomials" — one per data point. ' +
      'The degree-1 case (two points) is ordinary linear interpolation; degree-2 is quadratic, and so on.',
    intuition:
      'Each Lagrange basis polynomial Lᵢ(x) acts like a "spotlight": it equals 1 at node xᵢ ' +
      'and equals 0 at every other node xⱼ. Multiplying by yᵢ and summing over all i gives ' +
      'a polynomial that automatically hits yᵢ at each xᵢ. No system of equations to solve — ' +
      'the formula works directly.',
    advantages: [
      'Conceptually clean: direct formula, no linear system to solve',
      'Any degree: 2 points → line, 3 → parabola, n+1 → degree-n polynomial',
      'Unique: there is exactly one polynomial of degree ≤ n through n+1 points',
      'Exact on polynomials: if the data came from a degree-n function, P(x) reproduces it exactly',
      'Easy to add a new basis function when a new point arrives (not easy to update coefficients, though)',
    ],
    limitations: [
      'High-degree interpolation can oscillate wildly between nodes (Runge\'s phenomenon)',
      'Evaluating P(x) at one point costs O(n²) — slow for many points',
      'Adding a new data point requires recomputing all basis polynomials',
      'Global support: changing one data point affects the curve everywhere',
      'Poorly conditioned near floating-point machine precision for many nodes',
    ],
    keyInsights: [
      'Linear interpolation (degree 1) is always stable; higher degrees may not be',
      'Equally-spaced nodes are convenient but lead to Runge oscillations at the endpoints',
      'Chebyshev nodes (cosine-spaced) minimize the maximum interpolation error',
      'For large datasets, piecewise methods (splines) are preferred over global Lagrange polynomials',
    ],
  },

  mathFoundation: {
    formulas: [
      {
        label: 'Linear interpolation (degree 1)',
        latex: 'P_1(x) = y_0 \\frac{x - x_1}{x_0 - x_1} + y_1 \\frac{x - x_0}{x_1 - x_0}',
        description: 'The two-point case — a straight line through (x₀,y₀) and (x₁,y₁)',
        isKeyFormula: true,
      },
      {
        label: 'Lagrange basis polynomial',
        latex: 'L_i(x) = \\prod_{\\substack{j=0 \\\\ j \\neq i}}^{n} \\frac{x - x_j}{x_i - x_j}',
        description: 'Equals 1 at xᵢ, equals 0 at every other node xⱼ (j≠i)',
        isKeyFormula: true,
      },
      {
        label: 'Lagrange interpolating polynomial',
        latex: 'P_n(x) = \\sum_{i=0}^{n} y_i \\, L_i(x)',
        description: 'Weighted sum of basis polynomials — automatically satisfies P(xᵢ) = yᵢ for all i',
        isKeyFormula: true,
      },
      {
        label: 'Interpolation error bound',
        latex: '|f(x) - P_n(x)| \\leq \\frac{M_{n+1}}{(n+1)!} \\prod_{i=0}^{n} |x - x_i|',
        description: 'M_{n+1} = max|f^(n+1)(ξ)| on the interval; error depends on the node product',
      },
      {
        label: 'Uniqueness theorem',
        latex: 'P_n \\text{ is unique: } \\deg P_n \\leq n,\\; P_n(x_i) = y_i \\; \\forall i',
        description: 'At most one polynomial of degree ≤ n can pass through n+1 distinct points',
      },
    ],
    symbols: [
      { symbol: 'x_i',    definition: 'Interpolation node (data point x-coordinate), i = 0…n' },
      { symbol: 'y_i',    definition: 'Function value at node xᵢ: yᵢ = f(xᵢ)'               },
      { symbol: 'L_i(x)', definition: 'Lagrange basis polynomial for node i — degree n'       },
      { symbol: 'P_n(x)', definition: 'Lagrange interpolating polynomial of degree ≤ n'      },
      { symbol: 'n',      definition: 'Number of intervals; n+1 data points → degree-n poly' },
      { symbol: 'M_{n+1}',definition: 'Upper bound on |(n+1)th derivative| of the true function f' },
    ],
    derivationSteps: [
      { step: 1, description: 'We want P(xᵢ) = yᵢ for each i. Build one "indicator" polynomial per node.', latex: 'L_i(x_j) = \\delta_{ij} = \\begin{cases}1 & i=j \\\\ 0 & i\\neq j\\end{cases}' },
      { step: 2, description: 'Each Lᵢ must have zeros at all xⱼ (j≠i) — gives numerator product.', latex: 'L_i(x) = c_i \\prod_{j \\neq i}(x - x_j)' },
      { step: 3, description: 'Force Lᵢ(xᵢ) = 1 to find the constant cᵢ.', latex: 'c_i = \\frac{1}{\\prod_{j \\neq i}(x_i - x_j)}' },
      { step: 4, description: 'Sum yᵢ Lᵢ(x). At any xₖ: all terms except i=k vanish, leaving yₖ.', latex: 'P_n(x_k) = \\sum_i y_i L_i(x_k) = y_k \\cdot 1 = y_k' },
    ],
    assumptions: [
      'All nodes xᵢ are distinct — identical nodes make denominators zero',
      'The true function f must have n+1 continuous derivatives for the error bound to apply',
      'The error bound assumes x lies in the smallest interval containing all xᵢ',
    ],
    convergenceCondition: '|f(x) - P_n(x)| \\to 0 \\text{ as } n \\to \\infty \\text{ (for well-behaved functions and Chebyshev nodes)}',
  },

  errorAnalysis: {
    metrics: [
      { label: 'Maximum absolute error',  formula: '\\max_x |f(x) - P_n(x)|',              description: 'Worst-case interpolation error over the entire interval'   },
      { label: 'Error bound (analytic)',  formula: '\\frac{M_{n+1}}{(n+1)!}|\\omega(x)|',  description: 'ω(x) = Π|x−xᵢ|; tightest when x is near a node'          },
      { label: 'Interpolation residual',  formula: '|P_n(x_q) - f(x_q)|',                 description: 'Error at a specific query point — measurable when true f is known' },
    ],
    stabilityNote:
      'Lagrange interpolation is numerically unstable at high degrees with equally-spaced nodes. ' +
      'Runge\'s phenomenon: for f(x) = 1/(1+25x²) on [−1,1], equally-spaced degree-10 polynomial ' +
      'has maximum error > 1 near the endpoints. Chebyshev nodes eliminate this.',
    floatingPointNote:
      'The denominator ∏(xᵢ − xⱼ) can become extremely small for many closely-spaced nodes, ' +
      'causing catastrophic cancellation. Barycentric Lagrange formulation avoids this by precomputing weights.',
  },

  performance: {
    complexity: {
      timeComplexity: 'O(n²) evaluation, O(n²) precomputation',
      spaceComplexity: 'O(n)',
      convergenceOrder: 'n+1 (exact for polynomials of degree ≤ n)',
      convergenceOrderNote: 'Error is O(h^(n+1)) for smooth functions with Chebyshev nodes and step h',
    },
    bestCase: 'Function is a polynomial of degree ≤ n — exact interpolation with zero error',
    worstCase: 'Runge function on equally-spaced high-degree nodes — error diverges at endpoints',
    typicalIterations: 'Degree 3–8 is typical for local approximations; splines preferred for n > 10',
  },

  comparison: {
    methods: ['linear', 'lagrange', 'cubic-spline'],
    criteria: [
      'Polynomial degree', 'Smoothness', 'Runge phenomenon risk',
      'Adding new points', 'Cost per eval', 'Best use case',
    ],
    table: [
      { criterion: 'Polynomial degree',     linear: '1 per segment',       lagrange: 'n (global)',          'cubic-spline': '3 per segment (piecewise)'        },
      { criterion: 'Smoothness',            linear: 'C⁰ (kinks at nodes)', lagrange: 'C^∞ (smooth global)', 'cubic-spline': 'C² (smooth, no kinks)'             },
      { criterion: 'Runge phenomenon risk', linear: 'None',                 lagrange: 'High (equally spaced)', 'cubic-spline': 'None (piecewise local)'         },
      { criterion: 'Adding new points',     linear: 'O(1) per segment',     lagrange: 'O(n²) rebuild',       'cubic-spline': 'O(n) rebuild'                      },
      { criterion: 'Cost per eval',         linear: 'O(1)',                  lagrange: 'O(n)',                'cubic-spline': 'O(log n) to find segment + O(1)'  },
      { criterion: 'Best use case',         linear: 'Look-up tables, sensors', lagrange: 'Low-degree, exact polynomial data', 'cubic-spline': 'Smooth curves, large datasets' },
    ],
    summary: 'Use linear interpolation for simplicity and guaranteed stability. Use Lagrange for small datasets where an exact polynomial fit is meaningful. Use cubic splines for large datasets or whenever smoothness (no kinks) is required.',
  },

  engineeringApplications: [
    {
      field: 'Computer Graphics',
      title: 'Bézier & Polynomial Curves',
      description:
        'Font outlines, SVG paths, and smooth UI animations use polynomial interpolation. ' +
        'A cubic Bézier curve is a degree-3 Lagrange polynomial on a specific parameterization. ' +
        'Game engines use Catmull-Rom splines (piecewise Lagrange) for smooth camera paths.',
      example: 'Given control points P₀=(0,0), P₁=(1,2), P₂=(3,1): Lagrange degree-2 through these gives the smooth arc',
      icon: '🎨',
      difficulty: 'intermediate' as const,
    },
    {
      field: 'Sensor Fusion / Robotics',
      title: 'Trajectory Reconstruction',
      description:
        'A robot arm records joint angles at 10 Hz but needs smooth velocity for motor control at 1 kHz. ' +
        'Lagrange polynomial (degree 3–5) through recent samples reconstructs the trajectory, ' +
        'and the derivative gives velocity without numerical differentiation noise.',
      example: 'θ sampled at t=0,0.1,0.2,0.3s → Lagrange cubic → evaluate θ(t), θ\'(t) at any millisecond',
      icon: '🤖',
      difficulty: 'intermediate' as const,
    },
    {
      field: 'Aerospace',
      title: 'Aerodynamic Coefficient Tables',
      description:
        'Drag coefficient Cᴅ is measured in wind tunnels at Mach 0.3, 0.6, 0.9, 1.2. ' +
        'During flight simulation, Cᴅ must be evaluated at arbitrary Mach numbers. ' +
        'Linear or Lagrange interpolation on the table gives smooth, continuous coefficients.',
      example: 'Mach = [0.3, 0.6, 0.9, 1.2], Cd = [0.018, 0.020, 0.028, 0.035] → P(0.75) ≈ 0.0238',
      icon: '✈',
      difficulty: 'intermediate' as const,
    },
    {
      field: 'Signal Processing',
      title: 'Sample Rate Conversion',
      description:
        'Converting audio from 44.1 kHz to 48 kHz requires reconstructing the signal at non-integer sample positions. ' +
        'Polyphase filter banks are essentially piecewise Lagrange interpolation applied efficiently ' +
        'using precomputed filter coefficients.',
      example: 'Upsample audio: evaluate sample at t=0.918 by Lagrange degree-3 through surrounding integer-time samples',
      icon: '🔊',
      difficulty: 'advanced' as const,
    },
    {
      field: 'Financial Mathematics',
      title: 'Yield Curve Interpolation',
      description:
        'Bond yields are observed at benchmark maturities: 3M, 6M, 1Y, 2Y, 5Y, 10Y, 30Y. ' +
        'The yield curve at any maturity (e.g., 7.5Y) is needed for pricing. ' +
        'Linear interpolation (or cubic spline) on log-space yields gives the standard "bootstrapped" curve.',
      example: 'Yield(7.5Y) interpolated between Yield(5Y)=3.8% and Yield(10Y)=4.2% → ≈ 4.0%',
      icon: '💰',
      difficulty: 'intermediate' as const,
    },
  ],

  commonMistakes: [
    {
      id: 'lag-runge',
      title: 'Using high-degree Lagrange with equally-spaced nodes',
      description:
        'For n > 8 equally-spaced nodes, Lagrange interpolation typically diverges near the endpoints — ' +
        'maximum error grows rather than shrinks. This is Runge\'s phenomenon.',
      wrongApproach: 'Interpolate 1/(1+25x²) on [-1,1] with 20 equally-spaced nodes → huge oscillations at ±1',
      correctApproach: 'Either use Chebyshev nodes (clustered at endpoints) or switch to piecewise cubic spline interpolation',
      icon: '🌊',
    },
    {
      id: 'lag-repeated',
      title: 'Providing duplicate x-nodes',
      description:
        'If any two xᵢ are identical, the denominator ∏(xᵢ − xⱼ) is zero and the formula blows up. ' +
        'This is a hard divide-by-zero, not a rounding issue.',
      wrongApproach: 'x = [0, 1, 1, 2] → denominator for i=1: (1−0)(1−1)(1−2) contains a zero factor',
      correctApproach: 'Ensure all x-nodes are distinct. Sort and deduplicate before interpolating.',
      icon: '⚠',
    },
    {
      id: 'lag-outside',
      title: 'Extrapolating outside the node range',
      description:
        'The error bound for polynomial interpolation grows rapidly outside the node interval. ' +
        'A degree-5 polynomial that fits beautifully on [0,5] can diverge wildly at x=6.',
      wrongApproach: 'Nodes on [0, 5], evaluate at x = 8 — Lagrange gives wildly wrong answer',
      correctApproach: 'Never extrapolate. Add more nodes to extend the range, or use a physical model for extrapolation.',
      icon: '📏',
    },
    {
      id: 'lag-confuse',
      title: 'Confusing Lagrange interpolation with regression',
      description:
        'Interpolation passes through every data point exactly — it assumes data is noise-free. ' +
        'Regression finds the best-fit curve that may miss every data point intentionally. ' +
        'Using interpolation on noisy sensor data can amplify noise.',
      wrongApproach: '10 noisy measurements → high-degree Lagrange → wiggly curve that overfits noise exactly',
      correctApproach: 'For noisy data, use least-squares regression (degree-2 or 3) to smooth, not Lagrange to interpolate.',
      icon: '📊',
    },
  ],

  practiceProblems: [
    {
      id: 'lag-p1',
      title: 'Linear interpolation for temperature',
      description: 'At 8 AM the temperature is 15°C; at 2 PM it is 23°C. Using linear interpolation (degree-1 Lagrange), estimate the temperature at 11 AM.',
      difficulty: 'easy',
      hint: 'Convert times to hours from 8 AM. t₀=0, y₀=15; t₁=6, y₁=23. Evaluate P₁(t=3).',
      expectedAnswer: 'P₁(3) = 15 + (23−15)·(3/6) = 15 + 4 = 19°C',
    },
    {
      id: 'lag-p2',
      title: 'Construct a Lagrange polynomial by hand',
      description: 'Given points (0,1), (1,3), (2,2), construct the degree-2 Lagrange polynomial and evaluate it at x=1.5.',
      difficulty: 'medium',
      hint: 'L₀ = (x−1)(x−2)/[(0−1)(0−2)], L₁ = (x−0)(x−2)/[(1−0)(1−2)], L₂ = (x−0)(x−1)/[(2−0)(2−1)]',
      expectedAnswer: 'P₂(x) = 1·L₀ + 3·L₁ + 2·L₂; P₂(1.5) = 2.875',
    },
    {
      id: 'lag-p3',
      title: 'Detect Runge\'s phenomenon',
      description: 'Use the playground with the Runge function f(x) = 1/(1+25x²) on [-1,1]. Try 4 equally-spaced points vs 8 equally-spaced points. Does the interpolation improve or worsen? Why?',
      difficulty: 'medium',
      hint: 'At degree 3 (4 points) the polynomial approximates well. At degree 7 (8 points), watch the endpoints oscillate.',
      expectedAnswer: 'With 8 equally-spaced points, the polynomial diverges near ±1 — maximum error increases. Use Chebyshev nodes instead.',
    },
    {
      id: 'lag-p4',
      title: 'Compute the interpolation error bound',
      description: 'For f(x) = sin(x) interpolated at x₀=0, x₁=π/4, x₂=π/2 (degree-2 Lagrange): bound the error at x = π/6 using the analytic formula.',
      difficulty: 'hard',
      hint: 'f‴(x) = -cos(x), so M₃ = max|f‴| on [0, π/2] = 1. |ω(π/6)| = |π/6| · |π/6 − π/4| · |π/6 − π/2| = (π/6)(π/12)(π/3).',
      expectedAnswer: 'Error ≤ (1/6) · (π/6)(π/12)(π/3) ≈ 0.00302; actual error ≈ 0.00016 (bound is conservative)',
    },
  ],

  interactiveChallenges: [
    {
      id: 'ch-linear',
      title: 'Linear Interpolation vs Reality',
      description: 'See when linear interpolation is good enough vs when you need a higher-degree polynomial.',
      objective: 'Quantify the error from using linear vs quadratic interpolation on a curved function.',
      difficulty: 'easy',
      steps: [
        { step: 1, instruction: 'Load preset "x²" (4 points at x=0,1,2,3). Switch to 2-point mode (use only x=0 and x=2).', expectedOutcome: 'The linear interpolant misses y=1 at x=1 significantly — it gives 1 but correct is 1.' },
        { step: 2, instruction: 'Now use all 4 points. The degree-3 Lagrange should match x² exactly.', expectedOutcome: 'Lagrange degree-3 reproduces x² exactly — because x² is a polynomial of degree ≤ 3.' },
        { step: 3, instruction: 'Now try the sin(x) preset with just 3 equally-spaced points vs 6 points.', expectedOutcome: '3 points: maximum error ~0.05. 6 points: error near 0 in the middle but may rise at endpoints.' },
      ],
    },
    {
      id: 'ch-runge',
      title: 'Trigger Runge\'s Phenomenon',
      description: 'Demonstrate that more data points can make polynomial interpolation worse.',
      objective: 'Observe error divergence at endpoints when using equally-spaced high-degree interpolation.',
      difficulty: 'medium',
      steps: [
        { step: 1, instruction: 'Enter x = -5,-4,-3,-2,-1,0,1,2,3,4,5 and y = 1/26,1/17,1/10,1/5,1/2,1,1/2,1/5,1/10,1/17,1/26 (Runge function 1/(1+x²/25)).', expectedOutcome: 'The polynomial oscillates wildly at x=±4, ±5 despite passing through every point.' },
        { step: 2, instruction: 'Remove outer 4 points (use only x=-3,-2,-1,0,1,2,3). How does the curve look now?', expectedOutcome: 'Degree-6 still shows some oscillation but much less than degree-10.' },
        { step: 3, instruction: 'Use only 4 inner points (-1,0,1,2). Now the degree-3 interpolant looks smooth.', expectedOutcome: 'Low-degree interpolation (3) is smooth and accurate on a small interval.' },
      ],
    },
    {
      id: 'ch-basis',
      title: 'Verify Basis Polynomial Properties',
      description: 'Manually verify L₁(x) = 1 at x₁ and 0 at all other nodes.',
      objective: 'Build intuition for why the Lagrange formula automatically satisfies the interpolation conditions.',
      difficulty: 'medium',
      steps: [
        { step: 1, instruction: 'Use 3 points: (0,0), (1,1), (2,0). Construct L₁(x) = (x−0)(x−2)/[(1−0)(1−2)].', expectedOutcome: 'L₁(x) = x(x−2)/(−1) = −x²+2x. Verify: L₁(0)=0, L₁(1)=1, L₁(2)=0.' },
        { step: 2, instruction: 'In the playground, verify that P(x) passes through (0,0), (1,1), (2,0).', expectedOutcome: 'The interpolated values at query x=0,1,2 are exactly 0,1,0.' },
        { step: 3, instruction: 'Query x=0.5. What is P(0.5)?', expectedOutcome: 'P(0.5) = 0·L₀(0.5) + 1·L₁(0.5) + 0·L₂(0.5) = L₁(0.5) = −0.25+1 = 0.75.' },
      ],
    },
    {
      id: 'ch-aerodynamics',
      title: 'Aerodynamic Coefficient Look-Up',
      description: 'Interpolate a drag coefficient table for intermediate Mach numbers.',
      objective: 'Apply Lagrange interpolation to a real aerospace engineering look-up table.',
      difficulty: 'hard',
      steps: [
        { step: 1, instruction: 'Enter: x = 0.3,0.6,0.9,1.2,1.5 and y = 0.018,0.020,0.028,0.035,0.030. Query x = 0.75.', expectedOutcome: 'P(0.75) should be between 0.020 and 0.028, around 0.0237.' },
        { step: 2, instruction: 'Query x = 1.05 (between subsonic and supersonic). Check the value.', expectedOutcome: 'Interpolated Cd(1.05) ≈ 0.0313 — in the transonic region.' },
        { step: 3, instruction: 'Try querying x = 2.0 (outside data range). Is this reliable?', expectedOutcome: 'Extrapolation to x=2.0 gives an unreliable, potentially very wrong value. Never extrapolate.' },
      ],
    },
  ],

  summary: {
    keyPoints: [
      { title: 'Linear interpolation is degree-1 Lagrange', description: 'The simplest case: one line through two points. Always stable, always correct, but only piecewise.', icon: '📈' },
      { title: 'Basis polynomials encode the interpolation', description: 'Lᵢ(xⱼ) = δᵢⱼ ensures the sum Σ yᵢLᵢ(x) automatically passes through every data point.', icon: '🧮' },
      { title: 'Runge\'s phenomenon: more is not always better', description: 'High-degree equally-spaced interpolation diverges at endpoints. Use Chebyshev nodes or switch to splines.', icon: '⚠' },
      { title: 'Error grows with the node product |ω(x)|', description: 'Evaluating P near a node is more accurate than evaluating midway between nodes. Clustering nodes at endpoints helps.', icon: '📉' },
      { title: 'Global support is both a feature and a bug', description: 'One Lagrange polynomial spans all nodes — great for exactness, bad for large noisy datasets. Use splines for n > 10.', icon: '🌐' },
    ],
    cheatSheetFormulas: [
      { label: 'Basis polynomial',          latex: 'L_i(x) = \\prod_{j \\neq i} \\frac{x - x_j}{x_i - x_j}',                isKeyFormula: true },
      { label: 'Interpolating polynomial',  latex: 'P_n(x) = \\sum_{i=0}^n y_i L_i(x)',                                    isKeyFormula: true },
      { label: 'Linear interpolation',      latex: 'P_1(x) = y_0 + \\frac{y_1 - y_0}{x_1 - x_0}(x - x_0)'                              },
      { label: 'Error bound',               latex: '|f(x) - P_n(x)| \\leq \\frac{M_{n+1}}{(n+1)!}\\prod_i |x - x_i|'                  },
      { label: 'Minimum degree for exact',  latex: 'n = \\deg(f) \\Rightarrow P_n = f \\text{ exactly}'                                  },
    ],
    nextSteps: [
      { label: 'Cubic Spline Interpolation', description: 'Piecewise cubic polynomials that stay smooth and avoid Runge\'s phenomenon', path: '/interpolation/cubic-spline' },
      { label: 'Interpolation Comparison',   description: 'Race Lagrange vs cubic spline on the same dataset',                          path: '/interpolation/comparison'  },
      { label: 'Numerical Differentiation',  description: 'Differentiate the Lagrange polynomial to approximate f\'(x)',                  path: '/differentiation'           },
    ],
  },
}
