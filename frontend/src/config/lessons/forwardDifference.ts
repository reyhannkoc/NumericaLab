import type { LessonConfig } from '@/types/lesson.types'

export const FORWARD_DIFF_CONFIG: LessonConfig = {
  header: {
    moduleId: 'differentiation',
    moduleColor: '#8b5cf6',
    title: 'Forward Difference',
    subtitle: 'First-order O(h) derivative approximation using a forward step',
    difficulty: 'introductory',
    estimatedMinutes: 50,
    objectives: [
      'Derive the forward difference formula from the Taylor series expansion',
      'Identify O(h) truncation error and its dominant term h·f\'\'(x)/2',
      'Understand the tradeoff between truncation error (large h) and round-off error (small h)',
      'Select an appropriate step size h for a given function',
      'Recognize when forward differences are preferred over other methods',
    ],
    prerequisites: [],
    tags: ['finite difference', 'O(h)', 'truncation error', 'Taylor series', 'first-order'],
  },

  motivation: {
    problemStatement:
      'A drone\'s altitude sensor records position every 10 ms. You need the instantaneous velocity ' +
      '(the derivative of position) but you only have discrete samples. How do you estimate it?',
    whyItMatters:
      'Most real-world signals are discrete: GPS positions, sensor readings, sampled audio. ' +
      'You can\'t symbolically differentiate a lookup table. Finite differences turn function ' +
      'values into derivative estimates using only arithmetic — the simplest possible approach.',
    engineeringMotivation:
      'In digital control systems, sensors provide discrete position measurements. ' +
      'Velocity and acceleration must be computed numerically from these samples. ' +
      'The forward difference is the natural choice when only past and present measurements are available.',
    motivatingExample: {
      title: 'Velocity from GPS samples',
      description:
        'Position at t=0.0 s: x=0 m. Position at t=0.1 s: x=2.5 m. ' +
        'Forward difference: v ≈ (2.5 − 0)/0.1 = 25 m/s. ' +
        'The key insight: the error is proportional to h — halving h halves the error.',
      expression: "f'(x) ≈ [f(x+h) − f(x)] / h",
      result: 'Error ≈ h·|f\'\'(x)|/2 — halving h halves the error (O(h) convergence)',
    },
  },

  theory: {
    overview:
      'The forward difference approximates f\'(x) by computing the slope of the secant line ' +
      'connecting (x, f(x)) to (x+h, f(x+h)). As h→0, the secant slope approaches the tangent ' +
      'slope — the true derivative. The approximation error is dominated by the h·f\'\'(x)/2 term.',
    intuition:
      'Imagine standing at point x on a hill. You take one step forward of size h and measure ' +
      'how much the elevation changed. Dividing by h gives your approximate slope. The smaller ' +
      'the step, the more accurate — until floating point rounding dominates.',
    advantages: [
      'Requires only one extra function evaluation: f(x+h)',
      'Natural for causal systems where future values are unavailable',
      'Simple to implement and numerically verify',
      'Well-defined stability behavior for h ≈ 10⁻⁵ to 10⁻⁷',
    ],
    limitations: [
      'Only O(h) accuracy — halving h only halves the error',
      'Requires function evaluation at x+h (may be outside domain at right boundary)',
      'Round-off error dominates for h < ~10⁻⁸ in float64',
      'Systematic one-sided bias: always "looks forward" from x',
    ],
    keyInsights: [
      'The error is dominated by h·f\'\'(x)/2 — the first neglected Taylor term',
      'Optimal h ≈ √(2ε) ≈ 2×10⁻⁸ minimizes the sum of truncation and round-off errors',
      'Forward and backward differences have equal accuracy but opposite bias directions',
    ],
  },

  mathFoundation: {
    formulas: [
      {
        label: 'Forward Difference Formula',
        latex: "f'(x) \\approx \\frac{f(x+h) - f(x)}{h}",
        description: 'Slope of the secant line from x to x+h',
        isKeyFormula: true,
      },
      {
        label: 'Taylor Series Derivation',
        latex: "f(x+h) = f(x) + h f'(x) + \\frac{h^2}{2} f''(x) + \\frac{h^3}{6} f'''(x) + \\cdots",
        description: 'Expand f(x+h) around x, then isolate f\'(x)',
      },
      {
        label: 'Truncation Error',
        latex: "e_{\\text{trunc}} = \\frac{h}{2} \\left|f''(x)\\right| + O(h^2)",
        description: 'Leading error term — linear in h (first-order method)',
        isKeyFormula: true,
      },
      {
        label: 'Round-off Error',
        latex: 'e_{\\text{round}} \\approx \\frac{2\\varepsilon}{h}',
        description: 'Floating-point cancellation when subtracting nearly equal numbers',
      },
      {
        label: 'Optimal Step Size',
        latex: "h^* = \\sqrt{\\frac{2\\varepsilon}{\\left|f''(x)\\right|}} \\approx 2 \\times 10^{-8}",
        description: 'Minimizes total error (truncation + round-off) in float64',
        isKeyFormula: true,
      },
    ],
    symbols: [
      { symbol: 'h', definition: 'Step size — the finite forward increment', unit: 'same as x' },
      { symbol: "f'(x)", definition: 'True derivative of f at x' },
      { symbol: 'ε', definition: 'Machine epsilon ≈ 2.2×10⁻¹⁶ for float64', unit: 'dimensionless' },
      { symbol: 'O(h)', definition: 'Error converges to zero proportionally to h' },
    ],
    derivationSteps: [
      {
        step: 1,
        description: 'Write the Taylor expansion of f(x+h) around x',
        latex: "f(x+h) = f(x) + h f'(x) + \\frac{h^2}{2} f''(x) + O(h^3)",
      },
      {
        step: 2,
        description: 'Subtract f(x) from both sides',
        latex: "f(x+h) - f(x) = h f'(x) + \\frac{h^2}{2} f''(x) + O(h^3)",
      },
      {
        step: 3,
        description: 'Divide both sides by h',
        latex: "\\frac{f(x+h)-f(x)}{h} = f'(x) + \\frac{h}{2}f''(x) + O(h^2)",
      },
      {
        step: 4,
        description: 'The approximation discards the h/2·f\'\'(x) and higher terms — giving O(h) error',
        latex: "\\text{Error} = \\frac{h}{2}f''(x) + O(h^2) \\implies \\text{O(h) method}",
      },
    ],
    assumptions: [
      'f is twice differentiable in a neighborhood of x',
      'h is small enough that higher-order terms are negligible',
    ],
    convergenceCondition: 'Error → 0 as h → 0, provided round-off is negligible (h > ~10⁻⁸)',
  },

  errorAnalysis: {
    metrics: [
      {
        label: 'Truncation Error',
        formula: '|f\'\'(x)| h / 2',
        description: 'Error from cutting off the Taylor series — decreases linearly as h decreases',
      },
      {
        label: 'Round-off Error',
        formula: '2ε / h',
        description: 'Catastrophic cancellation in f(x+h) − f(x) — increases as h decreases',
      },
      {
        label: 'Total Error',
        formula: '|f\'\'(x)| h / 2 + 2ε / h',
        description: 'Sum of both sources — has a minimum at the optimal h*. V-shaped on log-log scale.',
      },
      {
        label: 'Absolute Error',
        formula: '|f\'_num − f\'_exact|',
        description: 'Observed difference between numerical and analytical derivative',
      },
      {
        label: 'Relative Error',
        formula: '|f\'_num − f\'_exact| / |f\'_exact|',
        description: 'Normalized error — use for comparison across different function scales',
      },
    ],
    stabilityNote:
      'The sweet spot h* ≈ 2×10⁻⁸ minimizes total error. ' +
      'For h < 10⁻⁸: round-off dominates, error grows. For h > 10⁻⁴: truncation dominates.',
    floatingPointNote:
      'In float64, |f(x+h) − f(x)| suffers cancellation when h is tiny: ' +
      'the subtraction loses ~8 significant digits, leaving only ~8 correct digits in the numerator.',
  },

  performance: {
    complexity: {
      timeComplexity: 'O(1)',
      spaceComplexity: 'O(1)',
      convergenceOrder: 'O(h)',
      convergenceOrderNote: 'First-order: halving h halves the error (near optimal h)',
    },
    bestCase: 'Smooth function at interior point, h ≈ 10⁻⁷',
    worstCase: 'Function with large |f\'\'(x)|, or h too small causing catastrophic cancellation',
    typicalIterations: '2 function evaluations total: f(x) and f(x+h)',
  },

  comparison: {
    methods: ['Forward', 'Backward', 'Central'],
    criteria: ['Formula', 'Order', 'Function calls', 'Bias', 'Optimal h', 'Best use'],
    table: [
      {
        criterion: 'Formula',
        Forward: '[f(x+h) − f(x)] / h',
        Backward: '[f(x) − f(x−h)] / h',
        Central: '[f(x+h) − f(x−h)] / (2h)',
      },
      { criterion: 'Order',          Forward: 'O(h)',           Backward: 'O(h)',           Central: 'O(h²)' },
      { criterion: 'Function calls', Forward: '2',              Backward: '2',              Central: '2' },
      { criterion: 'Bias',           Forward: '+h f\'\'(x)/2',  Backward: '−h f\'\'(x)/2', Central: 'None (symmetric)' },
      { criterion: 'Optimal h',      Forward: '~10⁻⁸',          Backward: '~10⁻⁸',         Central: '~10⁻⁵' },
      { criterion: 'Best use',       Forward: 'Causal / left boundary', Backward: 'Right boundary / real-time', Central: 'Interior points, higher accuracy' },
    ],
    summary:
      'Central difference is twice as accurate for the same cost — prefer it for interior points. ' +
      'Forward/backward are needed at boundaries or when only one direction is available.',
  },

  engineeringApplications: [
    {
      field: 'Robotics',
      title: 'Joint Velocity from Encoder Positions',
      description:
        'Robot joint angles θ(t) are sampled at discrete times. Forward difference gives ' +
        'angular velocity ω ≈ [θ(t+Δt) − θ(t)] / Δt for each joint in real-time.',
      example: 'θ(0) = 30°, θ(0.01) = 31.2°  →  ω ≈ 120°/s',
      icon: '🤖',
      difficulty: 'introductory',
    },
    {
      field: 'Control Systems',
      title: 'PID Derivative Term',
      description:
        'A PID controller computes the derivative of the error signal. In discrete-time ' +
        'implementations, forward differences approximate de/dt from sampled error values.',
      example: 'D-term: Kd × [e(k+1) − e(k)] / Ts',
      icon: '⚙️',
      difficulty: 'intermediate',
    },
    {
      field: 'Computational Finance',
      title: 'Option Greeks — Delta',
      description:
        'Option delta (sensitivity of price to underlying) uses finite differences: ' +
        'Δ ≈ [V(S+h) − V(S)] / h where V is option value and S is stock price.',
      example: 'S = $100, h = $0.01 → Δ ≈ 0.52',
      icon: '💹',
      difficulty: 'intermediate',
    },
    {
      field: 'Signal Processing',
      title: 'Image Edge Detection',
      description:
        'Image intensity I(x,y) changes abruptly at edges. The forward difference ' +
        'ΔI = I[x+1] − I[x] highlights horizontal intensity gradients in pixel arrays.',
      example: 'Edge at pixel x if |I[x+1] − I[x]| > threshold T',
      icon: '📷',
      difficulty: 'introductory',
    },
    {
      field: 'Structural Engineering',
      title: 'Beam Slope from Deflection Data',
      description:
        'Measured deflections w(x) at discrete points along a beam. ' +
        'Slope θ ≈ [w(x+h) − w(x)] / h feeds into moment-curvature calculations.',
      example: 'w(0.5) = 2.1 mm, w(0.6) = 2.4 mm → slope ≈ 3 mm/m',
      icon: '🏗',
      difficulty: 'intermediate',
    },
  ],

  commonMistakes: [
    {
      id: 'm1',
      title: 'Choosing h too small',
      description:
        'Setting h = 10⁻¹⁵ causes catastrophic cancellation: f(x+h) ≈ f(x) in float64, ' +
        'giving a near-zero numerator and a wildly wrong result.',
      wrongApproach: 'h = 1e-15 (too small — cancellation destroys accuracy)',
      correctApproach: 'h ≈ 1e-7 to 1e-8 for forward difference in float64',
      icon: '⚠️',
    },
    {
      id: 'm2',
      title: 'Choosing h too large',
      description:
        'Large h makes the secant line a poor approximation of the tangent — ' +
        'the O(h) truncation error dominates.',
      wrongApproach: 'h = 1.0 (secant slope ≠ tangent slope for any curved function)',
      correctApproach: 'h ≈ 1e-5 to 1e-7 for engineering-level precision',
      icon: '📏',
    },
    {
      id: 'm3',
      title: 'Using forward diff at right boundary',
      description:
        'Forward difference uses f(x+h), which must be inside the function\'s domain. ' +
        'If x is the right boundary, f(x+h) may be undefined.',
      wrongApproach: 'Forward diff at the right endpoint x = b of [a, b]',
      correctApproach: 'Use backward difference at right boundary; forward at left boundary',
      icon: '🎯',
    },
    {
      id: 'm4',
      title: 'Confusing O(h) with absolute error magnitude',
      description:
        'O(h) means the error is proportional to h for small h. ' +
        'The proportionality constant is f\'\'(x)/2 — which depends on the function.',
      wrongApproach: 'Assuming error = h regardless of function',
      correctApproach: 'Error ≈ h|f\'\'(x)|/2 — includes the function\'s local curvature',
      icon: '🔢',
    },
  ],

  practiceProblems: [
    {
      id: 'p1',
      title: "Compute f'(2) for f(x) = x³",
      description: 'Use forward difference with h=0.1, then h=0.01. Compare both with the exact value 3x²=12.',
      difficulty: 'easy',
      expression: 'x**3',
      params: { x: 2, h: 0.1 },
      hint: 'f(2)=8, f(2.1)=9.261. Divide the difference by h.',
      expectedAnswer:
        "h=0.1: f'≈12.61 (error 0.61). h=0.01: f'≈12.06 (error 0.06). Error halves as h halves — confirms O(h).",
    },
    {
      id: 'p2',
      title: 'Estimate velocity from position data',
      description:
        'Position: t=0 s: x=0 m, t=0.1 s: x=0.49 m. Estimate velocity at t=0 using forward difference.',
      difficulty: 'easy',
      hint: 'v ≈ [x(0.1) − x(0)] / 0.1',
      expectedAnswer: 'v ≈ (0.49 − 0)/0.1 = 4.9 m/s',
    },
    {
      id: 'p3',
      title: 'Find optimal h for sin(x) at x=π/4',
      description:
        'Compute forward difference for h = 10⁻¹, 10⁻³, 10⁻⁵, 10⁻⁷, 10⁻⁹, 10⁻¹¹. ' +
        'Identify where error stops decreasing.',
      difficulty: 'medium',
      expression: 'sin(x)',
      params: { x: 0.7854 },
      hint: 'Exact: cos(π/4) ≈ 0.70711. The optimal h is around 10⁻⁷ to 10⁻⁸.',
      expectedAnswer:
        'Error decreases until h ≈ 10⁻⁸, then increases due to round-off. ' +
        'Optimal h* ≈ √(2ε) ≈ 2×10⁻⁸.',
    },
    {
      id: 'p4',
      title: 'Predict required halvings for target precision',
      description:
        'If forward difference error at h=0.1 is 5×10⁻², how many halvings of h are needed to reach error < 10⁻⁵?',
      difficulty: 'hard',
      hint: 'Each halving halves the error. Solve 0.05 × (1/2)^n < 10⁻⁵.',
      expectedAnswer:
        'n = ⌈log(0.05/10⁻⁵)/log(2)⌉ = ⌈11.29⌉ = 12 halvings → h ≈ 0.1/2¹² ≈ 2.4×10⁻⁵.',
    },
  ],

  interactiveChallenges: [
    {
      id: 'c1',
      title: 'Find the Optimal h Empirically',
      description: 'Experiment with the playground to find the h that minimizes absolute error for sin(x) at x=1.',
      objective: 'Determine the optimal step size and compare with the theoretical prediction h* ≈ 2×10⁻⁸.',
      difficulty: 'easy',
      steps: [
        { step: 1, instruction: 'Set expression=sin(x), x=1, h=0.1. Run and note the error.', actionLabel: 'Run' },
        { step: 2, instruction: 'Reduce h to 0.001, then 0.00001. Observe how error changes.', expectedOutcome: 'Error decreases as h decreases' },
        { step: 3, instruction: 'Try h=1e-8, 1e-10, 1e-12. Find where error starts growing.', expectedOutcome: 'Error increases below h ≈ 1e-8 due to round-off' },
        { step: 4, instruction: 'Compare your optimal h with theory: h* = √(2ε) ≈ 2.1×10⁻⁸.', expectedOutcome: 'Theory matches experiment' },
      ],
    },
    {
      id: 'c2',
      title: 'Compare Forward vs Central at Same h',
      description: 'For the same expression and h, compare forward and central difference errors.',
      objective: 'Verify that central difference gives O(h²) vs O(h) for forward — same cost, more accuracy.',
      difficulty: 'medium',
      steps: [
        { step: 1, instruction: 'Set expression=x**3, x=2, h=0.1. Run forward difference. Note error.', actionLabel: 'Run Forward' },
        { step: 2, instruction: 'Go to the Central Difference lesson. Same settings. Note error.', expectedOutcome: 'Central error is much smaller at same h' },
        { step: 3, instruction: 'Halve h to 0.05 and repeat for each. How does each error scale?', expectedOutcome: 'Forward error halves; central error quarters (O(h) vs O(h²))' },
      ],
    },
    {
      id: 'c3',
      title: 'Catastrophic Cancellation Demo',
      description: 'Demonstrate floating-point breakdown at very small h.',
      objective: 'Observe round-off error dominating when h < 10⁻¹⁰.',
      difficulty: 'hard',
      steps: [
        { step: 1, instruction: 'Set expression=exp(x), x=1, h=1e-7. Compute — note good accuracy.', actionLabel: 'Run' },
        { step: 2, instruction: 'Try h=1e-12. Observe the error jump.', expectedOutcome: 'Error unexpectedly large — round-off dominates' },
        { step: 3, instruction: 'Try h=1e-16. What happens?', expectedOutcome: 'f(x+h)=f(x) in float64; derivative estimate is 0 or garbage' },
      ],
    },
    {
      id: 'c4',
      title: 'PID Controller D-Term Estimation',
      description: 'Simulate a control system error signal and compute its derivative with forward difference.',
      objective: 'Apply forward difference to a realistic control systems scenario.',
      difficulty: 'hard',
      steps: [
        { step: 1, instruction: 'Use expression=exp(-x)*sin(x) as the error signal. x=1.', actionLabel: 'Set up' },
        { step: 2, instruction: 'Compute the derivative — this is the D-term of a PID controller at t=1 s.', expectedOutcome: 'Numerical d/dt ≈ analytical value' },
        { step: 3, instruction: 'Compare with backward difference at x=1. Which is more "causal"?', expectedOutcome: 'Forward uses e(t+h) which doesn\'t exist yet; backward is more appropriate for real-time control' },
      ],
    },
  ],

  summary: {
    keyPoints: [
      { title: 'Formula', description: "f'(x) ≈ [f(x+h) − f(x)] / h", icon: '📐' },
      { title: 'Accuracy', description: "O(h) — first-order. Error ≈ h|f''(x)|/2", icon: '🎯' },
      { title: 'Optimal h', description: 'h* ≈ √(2ε) ≈ 2×10⁻⁸ in float64', icon: '⚖️' },
      { title: 'Limitation', description: 'One-sided — requires f(x+h) to be in domain', icon: '⚠️' },
      { title: 'Best use', description: 'Causal systems, left boundaries, real-time control', icon: '⏩' },
    ],
    cheatSheetFormulas: [
      { label: 'Forward', latex: "f'(x) \\approx \\frac{f(x+h)-f(x)}{h}", isKeyFormula: true },
      { label: 'Truncation', latex: "e_{\\text{trunc}} = \\frac{h}{2}|f''(x)|" },
      { label: 'Optimal h', latex: 'h^* = \\sqrt{2\\varepsilon_{\\text{mach}}} \\approx 2 \\times 10^{-8}' },
    ],
    nextSteps: [
      { label: 'Backward Difference', description: 'Mirror formula using f(x−h) — opposite bias direction', path: '/differentiation/backward' },
      { label: 'Central Difference', description: 'O(h²) accuracy using both f(x+h) and f(x−h)', path: '/differentiation/central' },
      { label: 'Comparison Center', description: 'Compare all three methods on the same function', path: '/differentiation/comparison' },
    ],
  },
}
