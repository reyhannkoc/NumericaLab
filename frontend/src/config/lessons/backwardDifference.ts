import type { LessonConfig } from '@/types/lesson.types'

export const BACKWARD_DIFF_CONFIG: LessonConfig = {
  header: {
    moduleId: 'differentiation',
    moduleColor: '#8b5cf6',
    title: 'Backward Difference',
    subtitle: 'First-order O(h) derivative approximation using a backward step',
    difficulty: 'introductory',
    estimatedMinutes: 45,
    objectives: [
      'Derive the backward difference formula from the Taylor series expansion',
      'Compare backward vs forward difference: equal accuracy, opposite bias',
      'Apply backward differences to data where only past values are available',
      'Recognize when backward difference is the correct choice (right boundary, real-time)',
    ],
    prerequisites: [
      { title: 'Forward Difference', path: '/differentiation/forward', required: true },
    ],
    tags: ['finite difference', 'O(h)', 'causal', 'backward step', 'first-order'],
  },

  motivation: {
    problemStatement:
      'You are recording temperature every second with a sensor. At each time step, ' +
      'you only have the current and past readings — future readings don\'t exist yet. ' +
      'How do you estimate the rate of temperature change right now?',
    whyItMatters:
      'Real-time systems must compute derivatives from past and present data only. ' +
      'Unlike forward differences, backward differences are strictly causal — they never ' +
      '"look into the future." This makes them natural for online signal processing, ' +
      'control algorithms, and streaming data analysis.',
    engineeringMotivation:
      'In digital filters and real-time control, the current derivative estimate can only ' +
      'use samples up to and including the current time. The backward difference formula ' +
      'satisfies this causality constraint perfectly.',
    motivatingExample: {
      title: 'Temperature rate of change from a sensor',
      description:
        'T(t=5 s) = 85°C, T(t=4 s) = 82°C. ' +
        'Backward diff: dT/dt ≈ (85 − 82)/1 = 3°C/s. ' +
        'This uses only past data — valid for real-time monitoring.',
      expression: "f'(x) ≈ [f(x) − f(x−h)] / h",
      result: 'Same O(h) accuracy as forward, but with opposite systematic bias',
    },
  },

  theory: {
    overview:
      'The backward difference uses function values at x and x−h to estimate f\'(x). ' +
      'It is mathematically equivalent in accuracy to the forward difference — both are O(h) — ' +
      'but the leading error term has the opposite sign, causing an opposite bias direction.',
    intuition:
      'Instead of stepping forward to get the slope, you look back at where you came from. ' +
      'The slope from (x−h, f(x−h)) to (x, f(x)) approximates the tangent at x, ' +
      'with the same accuracy as the forward step but leaning to the left.',
    advantages: [
      'Strictly causal: uses only past and present values',
      'Same cost as forward difference: 2 function evaluations',
      'Natural for numerical ODE solvers (backward Euler method)',
      'Correct choice at right-domain boundaries where f(x+h) is undefined',
    ],
    limitations: [
      'Only O(h) accuracy — same limitation as forward difference',
      'Opposite bias to forward: systematically under-estimates for convex functions',
      'Same round-off floor at small h: h < ~10⁻⁸ causes cancellation',
      'Requires f(x−h) to be inside the domain',
    ],
    keyInsights: [
      'Backward diff = Forward diff with h replaced by −h',
      'The leading error −h·f\'\'(x)/2 has opposite sign to forward: biases cancel in the average',
      'Average of forward and backward = central difference (the O(h²) formula)',
    ],
  },

  mathFoundation: {
    formulas: [
      {
        label: 'Backward Difference Formula',
        latex: "f'(x) \\approx \\frac{f(x) - f(x-h)}{h}",
        description: 'Slope of the secant line from (x−h, f(x−h)) to (x, f(x))',
        isKeyFormula: true,
      },
      {
        label: 'Taylor Expansion (backward)',
        latex: "f(x-h) = f(x) - h f'(x) + \\frac{h^2}{2} f''(x) - \\frac{h^3}{6} f'''(x) + \\cdots",
        description: 'Expand f(x−h) around x',
      },
      {
        label: 'Truncation Error',
        latex: "e_{\\text{trunc}} = -\\frac{h}{2} f''(x) + O(h^2)",
        description: 'Same magnitude as forward, opposite sign — explains the opposite bias',
        isKeyFormula: true,
      },
      {
        label: 'Relationship to Forward',
        latex: "\\frac{f(x+h)-f(x)}{h} - \\frac{f(x)-f(x-h)}{h} = h f''(x) + O(h^2)",
        description: 'The two estimates differ by ≈ h·f\'\'(x) — the curvature × step',
      },
    ],
    symbols: [
      { symbol: 'h', definition: 'Step size (backward: uses x−h)', unit: 'same as x' },
      { symbol: "f'(x)", definition: 'Exact derivative at x' },
      { symbol: 'f(x−h)', definition: 'Function value at the previous point x−h' },
    ],
    derivationSteps: [
      {
        step: 1,
        description: 'Write Taylor expansion of f(x−h) around x',
        latex: "f(x-h) = f(x) - hf'(x) + \\frac{h^2}{2}f''(x) + O(h^3)",
      },
      {
        step: 2,
        description: 'Rearrange to isolate hf\'(x)',
        latex: "hf'(x) = f(x) - f(x-h) + \\frac{h^2}{2}f''(x) + O(h^3)",
      },
      {
        step: 3,
        description: 'Divide by h',
        latex: "f'(x) = \\frac{f(x)-f(x-h)}{h} - \\frac{h}{2}f''(x) + O(h^2)",
      },
      {
        step: 4,
        description: 'Truncation error has opposite sign to forward — this is the backward bias',
        latex: "\\text{Error} = -\\frac{h}{2}f''(x) + O(h^2)",
      },
    ],
    convergenceCondition: 'Same as forward: error → 0 as h → 0, provided round-off is negligible',
  },

  errorAnalysis: {
    metrics: [
      {
        label: 'Truncation Error',
        formula: '|f\'\'(x)| h / 2',
        description: 'Identical magnitude to forward difference; opposite sign',
      },
      {
        label: 'Bias Direction',
        formula: '−h f\'\'(x) / 2',
        description: 'Negative sign: backward under-estimates for convex (f\'\'> 0), over-estimates for concave (f\'\'< 0)',
      },
      {
        label: 'Absolute Error',
        formula: '|f\'_num − f\'_exact|',
        description: 'Observed error in practice — same magnitude as forward at same h',
      },
      {
        label: 'Optimal h',
        formula: 'h* ≈ √(2ε) ≈ 2×10⁻⁸',
        description: 'Identical to forward difference optimal h',
      },
    ],
    stabilityNote:
      'Backward difference is numerically identical in stability to forward difference — ' +
      'same round-off floor, same optimal h, same error magnitude for smooth functions.',
    floatingPointNote:
      'The subtraction f(x) − f(x−h) suffers the same cancellation issue as forward difference. ' +
      'For h < ~10⁻⁸, round-off dominates both methods equally.',
  },

  performance: {
    complexity: {
      timeComplexity: 'O(1)',
      spaceComplexity: 'O(1)',
      convergenceOrder: 'O(h)',
      convergenceOrderNote: 'First-order: identical convergence rate to forward difference',
    },
    bestCase: 'Smooth function at interior or right-boundary point, h ≈ 10⁻⁷',
    worstCase: 'Left-boundary point where x−h is outside the domain',
    typicalIterations: '2 function evaluations: f(x−h) and f(x)',
  },

  comparison: {
    methods: ['Forward', 'Backward', 'Central'],
    criteria: ['Formula', 'Order', 'Bias direction', 'Causality', 'Boundary use'],
    table: [
      {
        criterion: 'Formula',
        Forward: '[f(x+h)−f(x)]/h',
        Backward: '[f(x)−f(x−h)]/h',
        Central: '[f(x+h)−f(x−h)]/(2h)',
      },
      { criterion: 'Order',          Forward: 'O(h)',              Backward: 'O(h)',              Central: 'O(h²)' },
      { criterion: 'Bias direction', Forward: '+h f\'\'(x)/2',     Backward: '−h f\'\'(x)/2',    Central: '0 (symmetric)' },
      { criterion: 'Causality',      Forward: 'Non-causal (uses x+h)', Backward: 'Causal (past only)', Central: 'Non-causal' },
      { criterion: 'Boundary use',   Forward: 'Left boundary',     Backward: 'Right boundary',    Central: 'Interior only' },
    ],
    summary:
      'Backward and forward are mirrors — equal accuracy, opposite bias. ' +
      'Use backward for right boundaries and real-time systems where future values are unavailable.',
  },

  engineeringApplications: [
    {
      field: 'Control Systems',
      title: 'Backward Euler ODE Integration',
      description:
        'The implicit backward Euler method uses the backward difference: ' +
        'x(k) ≈ x(k−1) + h·f(x(k)). Solving for x(k) gives unconditional stability for stiff systems.',
      example: 'dx/dt = −100x → backward Euler stable for any h; forward Euler requires h < 0.02',
      icon: '⚙️',
      difficulty: 'advanced',
    },
    {
      field: 'Signal Processing',
      title: 'Causal Discrete Derivative Filter',
      description:
        'The backward difference operator y[n] = (x[n] − x[n−1]) / T is a first-order ' +
        'high-pass filter with transfer function H(z) = (1 − z⁻¹) / T.',
      example: 'Sampling at 1 kHz → T=0.001 s; edges enhanced, DC suppressed',
      icon: '📡',
      difficulty: 'intermediate',
    },
    {
      field: 'Aerospace',
      title: 'Flight Data Recorder Analysis',
      description:
        'Post-flight analysis computes acceleration from velocity data sampled at 400 Hz. ' +
        'Backward differences allow accurate reconstruction of g-forces from recorded data.',
      example: 'v(t₀)=250 m/s, v(t₀−0.0025)=249.8 m/s → a ≈ (250−249.8)/0.0025 = 80 m/s²',
      icon: '✈️',
      difficulty: 'intermediate',
    },
    {
      field: 'Numerical ODE',
      title: 'Adams–Moulton Multi-Step Methods',
      description:
        'Multi-step ODE solvers (Adams–Moulton, BDF) use backward differences to build ' +
        'high-order approximations from past solution values — O(h⁴) or higher per step.',
      icon: '🧮',
      difficulty: 'advanced',
    },
    {
      field: 'Machine Learning',
      title: 'Online Gradient Estimation',
      description:
        'In online learning with a causality constraint, loss derivatives must come from ' +
        'recent batches only. Backward differences on loss-vs-parameter give gradient ' +
        'approximations for gradient-free optimization.',
      icon: '🧠',
      difficulty: 'advanced',
    },
  ],

  commonMistakes: [
    {
      id: 'm1',
      title: 'Using backward diff at the left boundary',
      description:
        'Backward difference requires f(x−h). At the left boundary x=a of [a, b], ' +
        'x−h falls outside the domain.',
      wrongApproach: 'Backward diff at x=0 for f defined on [0, ∞)',
      correctApproach: 'Use forward difference at left boundary; backward at right boundary',
      icon: '⚠️',
    },
    {
      id: 'm2',
      title: 'Confusing bias direction with accuracy',
      description:
        'Backward systematically under-estimates for convex functions. ' +
        'This is a fixed bias, not random noise — it does not cancel over multiple evaluations.',
      wrongApproach: 'Averaging many backward estimates expecting cancellation',
      correctApproach: 'Use central difference for an unbiased (symmetric) estimate',
      icon: '📐',
    },
    {
      id: 'm3',
      title: 'Interchanging forward and backward without checking',
      description:
        'For functions with large |f\'\'(x)|, forward and backward give noticeably different ' +
        'results that differ by ≈ h·f\'\'(x). This is visible for h ≥ 0.01.',
      wrongApproach: 'Assuming backward ≈ forward for all functions at all h',
      correctApproach: 'Compute both and compare; large difference → large curvature at x',
      icon: '🔍',
    },
    {
      id: 'm4',
      title: 'Using a different h than for forward difference',
      description:
        'Because backward and forward have identical accuracy, the same h-selection rules apply. ' +
        'The optimal h ≈ √(2ε) ≈ 2×10⁻⁸ for both methods.',
      correctApproach: 'h* ≈ 2×10⁻⁸ is optimal for both forward and backward in float64',
      icon: '⚖️',
    },
  ],

  practiceProblems: [
    {
      id: 'p1',
      title: "Compute f'(1) for f(x) = eˣ with backward diff, h=0.1",
      description: "Exact value: e¹ ≈ 2.71828. Then compute forward diff at same h and compare biases.",
      difficulty: 'easy',
      expression: 'exp(x)',
      params: { x: 1, h: 0.1 },
      hint: 'f(1)=e≈2.71828, f(0.9)=e^0.9≈2.4596.',
      expectedAnswer:
        "Backward: (e−e^0.9)/0.1 ≈ 2.587 (under-estimate). " +
        "Forward: ≈2.858 (over-estimate). Exact: e≈2.718. Both O(h), biases opposite.",
    },
    {
      id: 'p2',
      title: 'Derivative at right boundary',
      description:
        "f(x) = sin(x) on [0, π]. Compute f'(π) using the correct finite difference. Exact: cos(π) = −1.",
      difficulty: 'easy',
      expression: 'sin(x)',
      params: { x: 3.14159, h: 0.01 },
      hint: 'At x=π (right boundary), use backward difference. f(π)=0, f(π−0.01)=sin(3.1316).',
      expectedAnswer:
        'Backward: [sin(π) − sin(π−0.01)] / 0.01 ≈ [0 − 0.00999] / 0.01 ≈ −0.99998 ≈ −1 ✓',
    },
    {
      id: 'p3',
      title: 'Bias comparison for x² at x=2',
      description:
        "Compute forward diff and backward diff for f(x)=x² at x=2, h=0.1. Exact: f'(2)=4. Which over-estimates?",
      difficulty: 'medium',
      expression: 'x**2',
      params: { x: 2, h: 0.1 },
      hint: 'f(2)=4, f(2.1)=4.41, f(1.9)=3.61.',
      expectedAnswer:
        "Forward: (4.41−4)/0.1 = 4.1 (over by 0.1). Backward: (4−3.61)/0.1 = 3.9 (under by 0.1). " +
        "Both errors = h|f''|/2 = 0.1×2/2 = 0.1 ✓ — equal magnitude, opposite sign.",
    },
    {
      id: 'p4',
      title: 'Backward Euler ODE step',
      description:
        'For dy/dt = −2y, y(0)=1. Use backward Euler: y(t+h) = y(t)/(1+2h) to find y(0.1). Exact: e^(−0.2)≈0.8187.',
      difficulty: 'hard',
      hint: 'Backward Euler for dy/dt = −2y gives: y(k+1) = y(k) / (1 + 2h).',
      expectedAnswer:
        'y(0.1) = 1/(1+0.2) ≈ 0.8333 (vs exact 0.8187). ' +
        'Backward Euler over-damps but never goes unstable — unconditionally stable.',
    },
  ],

  interactiveChallenges: [
    {
      id: 'c1',
      title: 'Verify Opposite Bias on a Convex Function',
      description: 'Run forward and backward difference on a convex function at the same point.',
      objective: 'Confirm that forward over-estimates and backward under-estimates for convex functions.',
      difficulty: 'easy',
      steps: [
        { step: 1, instruction: 'Set expression=x**2, x=1, h=0.2. Run Forward Difference.', actionLabel: 'Run Forward' },
        { step: 2, instruction: 'Switch to Backward Difference, same settings. Compare derivative values.', expectedOutcome: 'Forward > exact > backward for convex f\'\'> 0' },
        { step: 3, instruction: 'Try concave function: expression=-(x**2), x=1. Is the bias reversed?', expectedOutcome: 'Now backward > exact > forward' },
      ],
    },
    {
      id: 'c2',
      title: 'Backward at Right Boundary',
      description: 'Practice computing derivatives correctly at domain boundaries.',
      objective: 'Apply backward difference at the right boundary of a function\'s domain.',
      difficulty: 'medium',
      steps: [
        { step: 1, instruction: 'For f(x)=ln(x) on (0, 10], compute f\'(10) using backward difference.', actionLabel: 'Run Backward at x=10' },
        { step: 2, instruction: 'Exact: f\'(x)=1/x → f\'(10)=0.1. What absolute error do you get?', expectedOutcome: 'Error ≈ h × |f\'\'(10)| / 2 = h × 0.01' },
        { step: 3, instruction: 'Try forward difference at x=10. Is f(10+h) still valid here for ln(x)?', expectedOutcome: 'Valid for ln(x), but at a hard boundary it would fail' },
      ],
    },
    {
      id: 'c3',
      title: 'Real-Time D-Term Estimation',
      description: 'Simulate computing the derivative term of a PID controller in real time.',
      objective: 'Apply backward difference as a strictly causal derivative estimator.',
      difficulty: 'hard',
      steps: [
        { step: 1, instruction: 'Error signal: e(t)=sin(t). Current time t=2 s. Use backward diff h=0.01 s.', actionLabel: 'Compute D-term' },
        { step: 2, instruction: 'Exact: de/dt=cos(2)≈−0.416. What does backward give?', expectedOutcome: 'Backward estimate ≈ −0.416 ± O(h) — accurate' },
        { step: 3, instruction: 'Would forward difference be valid for a real-time controller?', expectedOutcome: 'No — forward requires e(t+h), a future measurement' },
      ],
    },
    {
      id: 'c4',
      title: 'Build the Error-vs-h Plot',
      description: 'Manually reproduce the V-shaped error curve for backward difference.',
      objective: 'Observe round-off error dominating when h < 10⁻⁸ and truncation for h > 10⁻⁴.',
      difficulty: 'hard',
      steps: [
        { step: 1, instruction: 'For exp(x) at x=1, compute backward diff for h=1e-1, 1e-3, 1e-5, 1e-7, 1e-9, 1e-12.', actionLabel: 'Record errors' },
        { step: 2, instruction: 'Note which h gives the minimum error.', expectedOutcome: 'Minimum around h ≈ 1e-7 to 1e-8' },
        { step: 3, instruction: 'Compare with the Error Analysis panel\'s error-vs-h chart.', expectedOutcome: 'Manual results match — V-shaped on log-log scale' },
      ],
    },
  ],

  summary: {
    keyPoints: [
      { title: 'Formula', description: "f'(x) ≈ [f(x) − f(x−h)] / h", icon: '📐' },
      { title: 'Order', description: 'O(h) — same as forward difference', icon: '🎯' },
      { title: 'Bias', description: 'Under-estimates for convex, over-estimates for concave — opposite of forward', icon: '↔️' },
      { title: 'Causality', description: 'Uses only past values — suitable for real-time systems', icon: '⏪' },
      { title: 'Boundary', description: 'Use at right boundary where f(x+h) is undefined', icon: '🚧' },
    ],
    cheatSheetFormulas: [
      { label: 'Backward', latex: "f'(x) \\approx \\frac{f(x)-f(x-h)}{h}", isKeyFormula: true },
      { label: 'Truncation', latex: "e_{\\text{trunc}} = -\\frac{h}{2}f''(x)" },
      { label: 'Optimal h', latex: 'h^* = \\sqrt{2\\varepsilon_{\\text{mach}}} \\approx 2 \\times 10^{-8}' },
    ],
    nextSteps: [
      { label: 'Central Difference', description: 'O(h²) accuracy using both f(x+h) and f(x−h)', path: '/differentiation/central' },
      { label: 'Comparison Center', description: 'Compare all three methods simultaneously', path: '/differentiation/comparison' },
    ],
  },
}
