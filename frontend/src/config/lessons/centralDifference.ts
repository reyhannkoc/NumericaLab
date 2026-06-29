import type { LessonConfig } from '@/types/lesson.types'

export const CENTRAL_DIFF_CONFIG: LessonConfig = {
  header: {
    moduleId: 'differentiation',
    moduleColor: '#8b5cf6',
    title: 'Central Difference',
    subtitle: 'Second-order O(h²) derivative approximation using a symmetric step',
    difficulty: 'intermediate',
    estimatedMinutes: 55,
    objectives: [
      'Derive central difference from the Taylor series and prove O(h²) accuracy',
      'Explain why symmetry cancels the O(h) error term automatically',
      'Select optimal h for central difference: h* ≈ (3ε)^(1/3) ≈ 10⁻⁵',
      'Identify when central difference cannot be used (boundaries, causal systems)',
      'Compare central vs forward/backward: same cost, twice the convergence order',
    ],
    prerequisites: [
      { title: 'Forward Difference', path: '/differentiation/forward', required: true },
      { title: 'Backward Difference', path: '/differentiation/backward', required: false },
    ],
    tags: ['finite difference', 'O(h²)', 'symmetric', 'second-order', 'gold standard'],
  },

  motivation: {
    problemStatement:
      'Forward and backward differences both have O(h) error. ' +
      'Can we achieve better accuracy with the same number of function evaluations?',
    whyItMatters:
      'Central difference achieves O(h²) accuracy — error shrinks quadratically as h decreases. ' +
      'Halving h gives one-quarter the error (not one-half). ' +
      'This is twice the convergence rate for the same computational cost: 2 function evaluations.',
    historicalBackground:
      'The observation that symmetric differences cancel the leading error term dates to Newton ' +
      'and Stirling. The systematic finite difference calculus was developed by Gregory, Newton, ' +
      'and Stirling in the 17th–18th centuries.',
    engineeringMotivation:
      'In scientific computing, central differences are the default choice for interior-point ' +
      'derivative estimation. Computational fluid dynamics, structural FEA, and molecular ' +
      'dynamics all use central differences because the extra order of accuracy directly reduces ' +
      'grid-size requirements for the same target precision.',
    motivatingExample: {
      title: "f'(1) for sin(x) — comparing methods at h=0.1",
      description:
        'Forward error ≈ 0.0498. Central error ≈ 0.000834. ' +
        'Same h, central is 60× more accurate. At h=0.01: forward ≈ 4.98×10⁻³, central ≈ 8.3×10⁻⁶. ' +
        'Ratio jumped to 600× — error squared as h shrank 10×.',
      expression: "[f(x+h) − f(x−h)] / (2h)",
      result: 'O(h²): halving h reduces error by 4×, not 2×',
    },
  },

  theory: {
    overview:
      'Central difference symmetrically averages the forward and backward slopes. ' +
      'The O(h) error terms in each formula have equal magnitude but opposite signs, ' +
      'so they cancel exactly in the symmetric formula — leaving only the O(h²) remainder.',
    intuition:
      'Forward difference pulls the slope to the right; backward pulls it to the left. ' +
      'The symmetric average of both is centered at x — the O(h) biases cancel, ' +
      'and only the smaller O(h²) error survives.',
    advantages: [
      'O(h²) accuracy — one order better than forward/backward at the same cost',
      'No first-order bias — approximation is symmetric around x',
      'Optimal h ≈ 10⁻⁵ is larger and more round-off robust than forward/backward h ≈ 10⁻⁸',
      'Gold standard for interior-point derivatives in numerical computing',
    ],
    limitations: [
      'Cannot be used at boundary points (needs both f(x+h) and f(x−h))',
      'Non-causal: requires future value f(x+h) — unsuitable for real-time systems',
      'Still limited to O(h²) in basic form; Richardson extrapolation needed for O(h⁴)',
    ],
    keyInsights: [
      'Central = (Forward + Backward) / 2, so the opposite biases cancel exactly',
      'The O(h) terms vanish because the Taylor expansion is odd in h',
      'Remaining error h²|f\'\'\'(x)|/6 involves the third derivative, not f\'\'',
      'Optimal h ≈ 10⁻⁵ vs ≈ 10⁻⁸ for forward/backward — central is more numerically robust',
    ],
  },

  mathFoundation: {
    formulas: [
      {
        label: 'Central Difference Formula',
        latex: "f'(x) \\approx \\frac{f(x+h) - f(x-h)}{2h}",
        description: 'Symmetric slope using points equally spaced around x',
        isKeyFormula: true,
      },
      {
        label: 'Forward Taylor Expansion',
        latex: "f(x+h) = f(x) + hf'(x) + \\frac{h^2}{2}f'' + \\frac{h^3}{6}f''' + O(h^4)",
        description: 'Expand f(x+h) to fourth order',
      },
      {
        label: 'Backward Taylor Expansion',
        latex: "f(x-h) = f(x) - hf'(x) + \\frac{h^2}{2}f'' - \\frac{h^3}{6}f''' + O(h^4)",
        description: 'Expand f(x−h) to fourth order — odd terms change sign',
      },
      {
        label: 'Symmetric Subtraction',
        latex: "f(x+h) - f(x-h) = 2hf'(x) + \\frac{h^3}{3}f''' + O(h^5)",
        description: 'Even-power terms (f, f\'\') cancel exactly — O(h²) term vanishes',
      },
      {
        label: 'Truncation Error',
        latex: "e_{\\text{trunc}} = \\frac{h^2}{6}\\left|f'''(x)\\right|",
        description: 'O(h²) — error involves third derivative, not second',
        isKeyFormula: true,
      },
      {
        label: 'Optimal Step Size',
        latex: "h^* = \\left(\\frac{3\\varepsilon}{\\left|f'''(x)\\right|}\\right)^{1/3} \\approx 10^{-5}",
        description: 'Larger than forward/backward optimal — less round-off vulnerable',
        isKeyFormula: true,
      },
    ],
    symbols: [
      { symbol: 'h', definition: 'Symmetric half-step', unit: 'same as x' },
      { symbol: "f'''(x)", definition: 'Third derivative at x — governs central diff truncation error' },
      { symbol: 'O(h²)', definition: 'Error proportional to h squared' },
      { symbol: 'ε', definition: 'Machine epsilon ≈ 2.2×10⁻¹⁶ for float64', unit: 'dimensionless' },
    ],
    derivationSteps: [
      {
        step: 1,
        description: 'Write both Taylor expansions',
        latex: "f(x\\pm h) = f(x) \\pm hf' + \\frac{h^2}{2}f'' \\pm \\frac{h^3}{6}f''' + O(h^4)",
      },
      {
        step: 2,
        description: 'Subtract: f(x+h) − f(x−h). Even-power terms cancel.',
        latex: "f(x+h) - f(x-h) = 2hf'(x) + \\frac{h^3}{3}f'''(x) + O(h^5)",
      },
      {
        step: 3,
        description: 'Divide by 2h',
        latex: "\\frac{f(x+h)-f(x-h)}{2h} = f'(x) + \\frac{h^2}{6}f'''(x) + O(h^4)",
      },
      {
        step: 4,
        description: 'The O(h) term is gone. Leading error is O(h²) — second-order method.',
        latex: "\\text{Error} = \\frac{h^2}{6}\\left|f'''(x)\\right| \\implies \\text{O}(h^2)\\text{ method}",
      },
    ],
    assumptions: [
      'f is at least three times differentiable at x',
      'Both f(x+h) and f(x−h) are inside the function\'s domain',
      'h is small enough that O(h⁴) terms are negligible',
    ],
    convergenceCondition: 'Error → 0 as h → 0 at rate O(h²): quadratic convergence',
  },

  errorAnalysis: {
    metrics: [
      {
        label: 'Truncation Error',
        formula: 'h² |f\'\'\'(x)| / 6',
        description: 'Quadratic in h — drops 4× when h is halved',
      },
      {
        label: 'Round-off Error',
        formula: 'ε / h',
        description: 'Slightly better than forward/backward (denominator 2h vs h)',
      },
      {
        label: 'Total Error',
        formula: 'h² |f\'\'\'(x)| / 6 + ε / h',
        description: 'V-shaped on log-log scale; minimum at h* ≈ 10⁻⁵',
      },
      {
        label: 'Optimal h',
        formula: '(3ε / |f\'\'\'(x)|)^(1/3) ≈ 10⁻⁵',
        description: 'Much larger than forward/backward optimal h ≈ 10⁻⁸ — more robust',
      },
    ],
    stabilityNote:
      'The optimal h ≈ 10⁻⁵ for central is 1000× larger than for forward/backward (~10⁻⁸). ' +
      'This means central difference is more robust to floating-point round-off in practice.',
    floatingPointNote:
      'Central difference subtracts f(x+h) − f(x−h) where both differ from f(x) by O(h). ' +
      'Less catastrophic cancellation than forward/backward where one argument equals the reference.',
  },

  performance: {
    complexity: {
      timeComplexity: 'O(1)',
      spaceComplexity: 'O(1)',
      convergenceOrder: 'O(h²)',
      convergenceOrderNote: 'Second-order: halving h reduces error by factor of 4',
    },
    bestCase: 'Smooth function at interior point, h ≈ 10⁻⁵',
    worstCase: 'Boundary points (f(x±h) outside domain), or real-time systems (f(x+h) unavailable)',
    typicalIterations: '2 function evaluations: f(x+h) and f(x−h) — same as forward/backward',
  },

  comparison: {
    methods: ['Forward', 'Backward', 'Central'],
    criteria: ['Formula', 'Order', 'Error h=0.1', 'Error h=0.01', 'Optimal h', 'Function calls'],
    table: [
      {
        criterion: 'Formula',
        Forward: '[f(x+h)−f(x)]/h',
        Backward: '[f(x)−f(x−h)]/h',
        Central: '[f(x+h)−f(x−h)]/(2h)',
      },
      { criterion: 'Order',          Forward: 'O(h)',    Backward: 'O(h)',    Central: 'O(h²)' },
      { criterion: 'Error h=0.1',    Forward: '~0.05',  Backward: '~0.05',  Central: '~0.0008' },
      { criterion: 'Error h=0.01',   Forward: '~0.005', Backward: '~0.005', Central: '~8×10⁻⁶' },
      { criterion: 'Optimal h',      Forward: '~10⁻⁸',  Backward: '~10⁻⁸',  Central: '~10⁻⁵' },
      { criterion: 'Function calls', Forward: '2',      Backward: '2',      Central: '2' },
    ],
    summary:
      'Central difference is always preferred for interior points — O(h²) accuracy ' +
      'at the same computational cost as O(h) methods. The only exceptions: boundaries and causal systems.',
  },

  engineeringApplications: [
    {
      field: 'Computational Fluid Dynamics',
      title: 'Velocity Gradient in a Flow Field',
      description:
        'The strain rate tensor in fluid mechanics requires spatial derivatives of velocity. ' +
        'Central differences on uniform grids give O(h²): ∂u/∂x ≈ [u(x+h)−u(x−h)]/(2h).',
      example: 'Boundary layer: u(0.49)=20 m/s, u(0.51)=22 m/s → ∂u/∂x ≈ 100 /s',
      icon: '🌊',
      difficulty: 'advanced',
    },
    {
      field: 'Robotics',
      title: 'Jacobian Numerical Computation',
      description:
        'The Jacobian matrix J relates joint velocities to end-effector velocities. ' +
        'Each column is ∂p/∂θᵢ computed with central differences on the forward kinematics function.',
      example: 'θᵢ offset by ±0.001 rad → 2D position change / 0.002 gives column i of J',
      icon: '🤖',
      difficulty: 'advanced',
    },
    {
      field: 'Machine Learning',
      title: 'Gradient Checking in Neural Networks',
      description:
        'Gradient checking compares backprop gradients with numerical estimates: ' +
        '∂L/∂θᵢ ≈ [L(θ+hₑᵢ)−L(θ−hₑᵢ)]/(2h). O(h²) accuracy is needed to distinguish bugs from noise.',
      example: 'h=1e-5 → numerical error ~10⁻⁹; sufficient to detect wrong backprop gradients',
      icon: '🧠',
      difficulty: 'intermediate',
    },
    {
      field: 'Structural Engineering',
      title: 'Finite Element Stiffness Matrices',
      description:
        'Material stiffness computation requires second derivatives of displacement fields. ' +
        'Central differences on element nodes produce O(h²) accurate stiffness matrices.',
      icon: '🏗',
      difficulty: 'advanced',
    },
    {
      field: 'Computational Physics',
      title: 'Schrödinger Equation — Kinetic Energy',
      description:
        'The kinetic energy operator −ℏ²/2m·∇²ψ uses the second derivative of ψ. ' +
        "The central-difference Laplacian ψ''(x) ≈ [ψ(x+h)−2ψ(x)+ψ(x−h)]/h² is O(h²).",
      icon: '⚛️',
      difficulty: 'advanced',
    },
  ],

  commonMistakes: [
    {
      id: 'm1',
      title: 'Using central difference at boundaries',
      description:
        'Central diff needs both f(x+h) and f(x−h). ' +
        'At x=a (left boundary), f(a−h) is outside the domain.',
      wrongApproach: 'Central diff at x=0 for f defined on [0, L]',
      correctApproach: 'Forward at left boundary; backward at right; central everywhere else',
      icon: '🚧',
    },
    {
      id: 'm2',
      title: 'Using the same optimal h as forward/backward',
      description:
        'The optimal h for central (~10⁻⁵) is much larger than for forward/backward (~10⁻⁸). ' +
        'Using h=10⁻⁸ with central wastes accuracy — round-off dominates the numerator.',
      wrongApproach: 'h = 1e-8 for central difference (designed for forward/backward)',
      correctApproach: 'h ≈ 1e-5 for central difference — larger optimal h',
      icon: '⚖️',
    },
    {
      id: 'm3',
      title: 'Applying to real-time systems',
      description:
        'Central diff requires f(x+h) — a future value. In real-time control, ' +
        'this introduces a delay of h, making the estimate non-causal.',
      wrongApproach: 'Central diff in a real-time PID controller without prediction',
      correctApproach: 'Use backward difference for strict causality in real-time systems',
      icon: '⏱️',
    },
    {
      id: 'm4',
      title: 'Expecting unlimited accuracy with tiny h',
      description:
        'Even with O(h²), making h too small causes round-off. ' +
        'Minimum achievable error for central diff: ~ε^(2/3) ≈ 10⁻¹¹, not machine epsilon.',
      wrongApproach: 'h = 1e-14 hoping for 14-digit accuracy from central difference',
      correctApproach: 'h ≈ 1e-5 gives ~10⁻¹⁰ accuracy — the best central difference can do',
      icon: '🎯',
    },
  ],

  practiceProblems: [
    {
      id: 'p1',
      title: "Compute f'(π/4) for sin(x) with central diff, h=0.1",
      description: 'Exact: cos(π/4) = √2/2 ≈ 0.7071. Repeat with h=0.01 and verify error scales as h².',
      difficulty: 'easy',
      expression: 'sin(x)',
      params: { x: 0.7854, h: 0.1 },
      hint: 'sin(π/4+0.1) and sin(π/4−0.1); divide difference by 2×0.1.',
      expectedAnswer:
        "Central: [sin(0.885)−sin(0.685)]/0.2 ≈ [0.7738−0.6338]/0.2 ≈ 0.7000. Error ≈ 0.007. " +
        "h=0.01: error ≈ 7×10⁻⁵. Ratio = 100 = (0.1/0.01)² ✓ confirms O(h²).",
    },
    {
      id: 'p2',
      title: 'Verify O(h²) convergence for x⁴ at x=1',
      description:
        "Compute central difference for f(x)=x⁴ at x=1 (exact: 4x³=4) with h=0.1, 0.05, 0.025. " +
        "Verify that each halving reduces error by ~4×.",
      difficulty: 'medium',
      expression: 'x**4',
      params: { x: 1 },
      hint: "Error ≈ h²×f'''(1)/6 = h²×24/6 = 4h². At h=0.1: error ≈ 0.04.",
      expectedAnswer:
        'h=0.1: error≈0.04. h=0.05: error≈0.01. h=0.025: error≈0.0025. Each halving → ¼ error. Ratio=4=2² confirms O(h²).',
    },
    {
      id: 'p3',
      title: 'Find optimal h for eˣ at x=1',
      description:
        'Try h = 10⁻², 10⁻⁴, 10⁻⁵, 10⁻⁶, 10⁻⁸, 10⁻¹⁰. ' +
        'Find the h minimizing absolute error. Compare with theoretical h* = (3ε)^(1/3).',
      difficulty: 'medium',
      expression: 'exp(x)',
      params: { x: 1 },
      hint: 'ε ≈ 2.2×10⁻¹⁶. (3×2.2×10⁻¹⁶)^(1/3) ≈ (6.6×10⁻¹⁶)^(1/3) ≈ 8.7×10⁻⁶.',
      expectedAnswer:
        'Optimal h ≈ 10⁻⁵, error ≈ 10⁻¹⁰. For h<10⁻⁸: round-off grows. Theory: h* ≈ 8.7×10⁻⁶ ≈ 10⁻⁵ ✓',
    },
    {
      id: 'p4',
      title: 'Gradient checking for a loss function',
      description:
        'Loss L(w) = (w−3)². Compute ∂L/∂w at w=1 using central diff with h=10⁻⁵. Exact: ∂L/∂w = 2(w−3) = −4.',
      difficulty: 'hard',
      expression: '(x-3)**2',
      params: { x: 1, h: 0.00001 },
      hint: 'L(1+h) = (−1.99999)², L(1−h) = (−2.00001)². Divide by 2h.',
      expectedAnswer:
        '[L(1+h)−L(1−h)]/(2h) = [3.99996−4.00004]/0.00002 = −4.000... Error < 10⁻¹⁰ ✓',
    },
  ],

  interactiveChallenges: [
    {
      id: 'c1',
      title: 'Quadratic Convergence Proof',
      description: 'Empirically verify that central difference converges as O(h²).',
      objective: 'Show that halving h reduces error by a factor of 4, not 2.',
      difficulty: 'easy',
      steps: [
        { step: 1, instruction: 'Set expression=sin(x), x=1, h=0.1. Compute. Note error.', actionLabel: 'Compute h=0.1' },
        { step: 2, instruction: 'Halve h to 0.05. What is the new error?', expectedOutcome: 'Error ≈ ¼ of previous — confirms O(h²)' },
        { step: 3, instruction: 'For comparison, try Forward Difference at same h values.', expectedOutcome: 'Forward error halves; central quarters. O(h) vs O(h²) confirmed.' },
      ],
    },
    {
      id: 'c2',
      title: 'Find the Optimal h',
      description: 'Locate h* ≈ 10⁻⁵ empirically and compare with the theoretical prediction.',
      objective: 'Observe the V-shaped error-vs-log(h) curve and identify its minimum.',
      difficulty: 'medium',
      steps: [
        { step: 1, instruction: 'Set expression=exp(x), x=1. Sweep h from 1e-2 down to 1e-12.', actionLabel: 'Sweep h values' },
        { step: 2, instruction: 'Identify the h giving minimum absolute error.', expectedOutcome: 'Minimum at h ≈ 1e-5' },
        { step: 3, instruction: 'Compare with forward difference minimum. Which needs smaller h?', expectedOutcome: 'Forward minimum h ≈ 1e-8 (much smaller). Central is more round-off robust.' },
      ],
    },
    {
      id: 'c3',
      title: 'Second Derivative via Central Difference',
      description: "Apply the 3-point central formula for f''(x).",
      objective: "Compute f''(x) ≈ [f(x+h)−2f(x)+f(x−h)]/h² and verify O(h²) accuracy.",
      difficulty: 'hard',
      steps: [
        { step: 1, instruction: "The formula for f''(x): [f(x+h)−2f(x)+f(x−h)]/h². For sin(x): f''(x)=−sin(x).", actionLabel: 'Note formula' },
        { step: 2, instruction: 'Manually compute for sin(1) with h=0.01. Exact: −sin(1)≈−0.8415.', expectedOutcome: 'Numerical ≈ −0.8415 ± O(h²)' },
        { step: 3, instruction: 'Halve h to 0.005 and check error ratio.', expectedOutcome: 'Error quarters — confirms O(h²) for second derivative too' },
      ],
    },
    {
      id: 'c4',
      title: 'CFD Grid Refinement Study',
      description: 'Determine the grid spacing h needed for 6 significant figures of accuracy.',
      objective: 'Use the error formula to predict required h before running any computation.',
      difficulty: 'hard',
      steps: [
        { step: 1, instruction: "Target: |error| < 1e-6 for cos(x) at x=π/3 (exact f'=−sin(x)≈−0.866).", actionLabel: 'Set target' },
        { step: 2, instruction: "Theory: error ≈ h²|f'''|/6 = h²×|−cos(x)|/6 ≈ 0.083h². Solve for h: h < √(6×10⁻⁶/0.5) ≈ 0.0035.", expectedOutcome: 'Required h ≈ 0.003–0.004' },
        { step: 3, instruction: 'Verify: set h=0.003 in the playground. Is error < 1e-6?', expectedOutcome: 'Yes — theory accurately predicts required grid spacing' },
      ],
    },
  ],

  summary: {
    keyPoints: [
      { title: 'Formula', description: "f'(x) ≈ [f(x+h) − f(x−h)] / (2h)", icon: '📐' },
      { title: 'Order', description: 'O(h²) — second-order. Halving h reduces error 4×', icon: '🎯' },
      { title: 'Optimal h', description: 'h* ≈ (3ε)^(1/3) ≈ 10⁻⁵ — larger and more robust than forward/backward', icon: '⚖️' },
      { title: 'Key insight', description: 'Symmetry cancels O(h) bias exactly: (forward + backward)/2', icon: '⚡' },
      { title: 'Limitation', description: 'Cannot use at boundaries; non-causal (requires f(x+h))', icon: '⚠️' },
    ],
    cheatSheetFormulas: [
      { label: 'Central', latex: "f'(x) \\approx \\frac{f(x+h)-f(x-h)}{2h}", isKeyFormula: true },
      { label: 'Truncation', latex: "e_{\\text{trunc}} = \\frac{h^2}{6}\\left|f'''(x)\\right|" },
      { label: 'Optimal h', latex: "h^* = \\left(\\frac{3\\varepsilon_{\\text{mach}}}{|f'''|}\\right)^{1/3} \\approx 10^{-5}" },
      { label: '2nd derivative', latex: "f''(x) \\approx \\frac{f(x+h)-2f(x)+f(x-h)}{h^2}" },
    ],
    nextSteps: [
      { label: 'Comparison Center', description: 'All three methods on the same function simultaneously', path: '/differentiation/comparison' },
      { label: 'Richardson Extrapolation', description: 'Combine central differences at multiple h for O(h⁴) accuracy', path: '/differentiation/richardson' },
    ],
  },
}
