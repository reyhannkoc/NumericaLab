import type { LessonConfig } from '@/types/lesson.types'

export const EULER_CONFIG: LessonConfig = {
  header: {
    moduleId: 'ode',
    moduleColor: '#84cc16',
    title: "Euler's Method",
    subtitle: 'The simplest ODE solver: y_{n+1} = y_n + h·f(x_n, y_n)',
    difficulty: 'introductory',
    estimatedMinutes: 50,
    objectives: [
      'Understand how Euler\'s method approximates the ODE solution',
      'Derive the Euler formula from the first-order Taylor expansion',
      'Analyze the O(h) local truncation error and O(h) global error',
      'Identify stability limits: h < 2/|λ| for stiff problems',
      'Recognize when Euler\'s method is appropriate vs. when it fails',
    ],
    prerequisites: [
      { title: 'Differentiation', path: '/differentiation', required: true },
    ],
    tags: ['ODE', 'explicit', 'first-order', 'Taylor', 'initial value problem'],
  },

  motivation: {
    problemStatement:
      'A radioactive substance decays according to dN/dt = −λN with N(0) = 1000. ' +
      'The analytical solution is N(t) = 1000·e^{−λt}, but most ODEs in engineering have no closed form.',
    whyItMatters:
      'Euler\'s method is the conceptual foundation for ALL numerical ODE solvers. ' +
      'Understanding why it works — and why it fails — is essential before studying Runge-Kutta or ' +
      'adaptive methods. It is also the basis for forward-differencing in computational fluid dynamics.',
    historicalBackground:
      'Leonhard Euler (1768) described the method in his "Institutionum Calculi Integralis." ' +
      'Despite its simplicity, the method remained the dominant numerical ODE technique until ' +
      'Runge and Kutta developed higher-order methods in 1895–1901.',
    engineeringMotivation:
      'Real-time physics engines (game engines, robotics simulators) often use symplectic Euler ' +
      '(a variant) because it conserves energy better than standard Euler. ' +
      'Understanding Euler\'s instability is why aerospace engineers use RK4 instead.',
    motivatingExample: {
      title: 'Solve dy/dx = y with y(0) = 1 (exact: y = eˣ)',
      description:
        'h = 0.5: y₁ = 1 + 0.5×1 = 1.5 (exact 1.649). y₂ = 1.5 + 0.5×1.5 = 2.25 (exact 2.718). ' +
        'Error grows: O(h) per step, O(h) globally.',
      expression: 'y_{n+1} = y_n + h · f(x_n, y_n)',
      result: 'h=0.5 gives 17% error at x=1. h=0.1 gives 4% error. h=0.01 gives 0.4% error.',
    },
  },

  theory: {
    overview:
      'Euler\'s method discretizes the derivative using a forward difference: ' +
      'y\'(x) ≈ (y(x+h) − y(x))/h, rearranged to y(x+h) ≈ y(x) + h·y\'(x) = y(x) + h·f(x, y(x)). ' +
      'Starting from y(x₀) = y₀, this generates approximations at x₀+h, x₀+2h, ...',
    intuition:
      'Imagine driving on a curved road. At each moment, you know your speed direction (the slope f). ' +
      'Euler\'s method says: go straight in that direction for a small time h, then update your direction. ' +
      'The smaller h, the closer you follow the curved road (the true solution).',
    advantages: [
      'Simplest possible ODE solver — trivial to implement',
      'Only one function evaluation per step',
      'Transparent: errors are easy to understand and estimate',
      'Foundation for understanding all higher-order methods',
    ],
    limitations: [
      'O(h) global error — very slow convergence',
      'Unstable for stiff ODEs: requires h < 2/|λ| for y\' = λy (λ < 0)',
      'Accumulates errors over long integrations',
      'Never used in production — always superseded by RK4 or higher',
    ],
    keyInsights: [
      'Local truncation error (LTE): O(h²) per step (from Taylor expansion)',
      'Global error: O(h) = LTE/step × number_of_steps = h²/h = h',
      'Stability region: {z ∈ ℂ : |1 + z| ≤ 1}, where z = hλ',
    ],
  },

  mathFoundation: {
    formulas: [
      {
        label: 'Euler Update',
        latex: 'y_{n+1} = y_n + h \\cdot f(x_n, y_n)',
        description: 'One step: move forward by h using the current slope',
        isKeyFormula: true,
      },
      {
        label: 'Taylor Derivation',
        latex: 'y(x+h) = y(x) + h y\'(x) + \\frac{h^2}{2}y\'\'(x) + O(h^3)',
        description: 'Euler drops all terms beyond O(h) → local error is O(h²)',
      },
      {
        label: 'Local Truncation Error',
        latex: '\\tau_n = \\frac{h}{2}y\'\'(\\xi) + O(h^2) \\quad (\\xi \\in [x_n, x_{n+1}])',
        description: 'Error per step is O(h²). Over N = (b−a)/h steps: global error O(h).',
        isKeyFormula: true,
      },
      {
        label: 'Global Error',
        latex: '\\|y(x_N) - y_N\\| = O(h) \\quad (\\text{halving } h \\text{ halves global error})',
        description: 'Linear convergence: halving h doubles the number of steps and halves the error',
        isKeyFormula: true,
      },
      {
        label: 'Stability Condition',
        latex: '|1 + h\\lambda| \\leq 1 \\implies h \\leq \\frac{2}{|\\lambda|} \\quad (\\lambda < 0)',
        description: 'For y\' = λy: stable iff h ≤ 2/|λ|. Stiff ODEs have large |λ| → tiny h required.',
      },
    ],
    symbols: [
      { symbol: 'h', definition: 'Step size. Smaller h → more accurate but more computation.' },
      { symbol: 'f(x, y)', definition: 'Right-hand side of ODE: dy/dx = f(x, y)' },
      { symbol: 'λ', definition: 'Eigenvalue of the ODE (rate coefficient). Stability: h < 2/|λ|' },
      { symbol: 'τₙ', definition: 'Local truncation error at step n: O(h²)' },
    ],
    derivationSteps: [
      {
        step: 1,
        description: 'Taylor expand y(xₙ₊₁) around xₙ',
        latex: 'y(x_n + h) = y(x_n) + h y\'(x_n) + \\frac{h^2}{2} y\'\'(\\xi)',
      },
      {
        step: 2,
        description: 'Substitute y\'(xₙ) = f(xₙ, y(xₙ)) and truncate after O(h)',
        latex: 'y_{n+1} \\approx y_n + h \\cdot f(x_n, y_n)',
      },
      {
        step: 3,
        description: 'The dropped term h²/2 × y′′ is the local truncation error',
        latex: '\\tau_n = \\frac{h^2}{2} y\'\'(\\xi) = O(h^2)',
      },
    ],
    assumptions: [
      'ODE dy/dx = f(x, y) has a unique solution (Lipschitz in y)',
      'f is sufficiently smooth (y is twice differentiable)',
    ],
    convergenceCondition: 'Global error O(h): Euler is consistent and zero-stable → convergent by Lax-Richtmyer',
  },

  errorAnalysis: {
    metrics: [
      {
        label: 'Global Error',
        formula: 'max|y(xₙ) − yₙ|',
        description: 'Maximum pointwise error over the integration interval. O(h) for Euler.',
      },
      {
        label: 'Local Truncation Error',
        formula: 'O(h²) per step',
        description: 'Error introduced in a single step. Accumulates to O(h) globally.',
      },
      {
        label: 'Stability Ratio',
        formula: 'h|λ|',
        description: 'Must be ≤ 2 for stability. Exceeding this causes exponential blow-up.',
      },
    ],
    stabilityNote:
      'Euler is ONLY stable for h|λ| ≤ 2. For stiff problems (|λ| >> 1), ' +
      'the required h may be so small that the computation becomes impractical — use implicit methods instead.',
    floatingPointNote:
      'For very small h, roundoff errors in subtraction xₙ₊₁ − xₙ become significant. ' +
      'Optimal h balances truncation error (decreasing with h) and roundoff (increasing with h): h_opt ≈ √ε_mach.',
  },

  performance: {
    complexity: {
      timeComplexity: 'O(N) = O((b−a)/h) function evaluations',
      spaceComplexity: 'O(N) to store the full trajectory; O(1) for the current step',
      convergenceOrder: 'First-order: global error O(h)',
      convergenceOrderNote: 'RK4 is 4th-order: global error O(h⁴) → 4 evaluations per step vs 1, but 10000× more accurate for same h',
    },
    bestCase: 'Non-stiff, smooth ODE on a short interval: simple and fast',
    worstCase: 'Stiff ODE: h must be tiny for stability → millions of steps for accuracy',
    typicalIterations: 'N = 100–10000 steps depending on accuracy requirement and stiffness',
  },

  engineeringApplications: [
    {
      field: 'Physics Simulation',
      title: 'Simple Harmonic Oscillator',
      description:
        'd²x/dt² = −ω²x → system of two first-order ODEs. Euler on this system shows ' +
        'amplitude growth (energy non-conservation) — motivating symplectic methods.',
      example: 'Spring: k=1 kg/s², x₀=1, v₀=0. Euler with h=0.1: amplitude grows spuriously',
      icon: '🌊',
      difficulty: 'intermediate',
    },
    {
      field: 'Population Biology',
      title: 'Logistic Growth',
      description:
        'dP/dt = rP(1 − P/K). Euler integrates population growth with carrying capacity K. ' +
        'Numerically stable for reasonable h since |λ| = r is small.',
      example: 'r=0.1, K=1000, P₀=10: Euler h=1 day, 365 steps to steady state',
      icon: '🌱',
      difficulty: 'introductory',
    },
    {
      field: 'Game Physics',
      title: 'Semi-Implicit Euler for Real-Time Simulation',
      description:
        'Game engines (Unity, Unreal) use semi-implicit Euler: update velocity first, then position. ' +
        'This variant is energy-conserving for conservative systems and computationally cheap.',
      example: 'At 60 FPS: h ≈ 0.016 s per frame. Semi-implicit Euler is stable for typical game physics',
      icon: '🎮',
      difficulty: 'intermediate',
    },
    {
      field: 'Circuit Analysis',
      title: 'RC Circuit Transient Response',
      description:
        'dV/dt = −V/(RC) + V_in/(RC). Explicit Euler is conditionally stable: h < 2RC required. ' +
        'For small RC (stiff), must use implicit Euler instead.',
      example: 'RC = 10⁻³ s: Euler requires h < 2×10⁻³ s → 500 steps per second',
      icon: '⚡',
      difficulty: 'intermediate',
    },
    {
      field: 'Epidemiology',
      title: 'SIR Disease Spread Model',
      description:
        'dS/dt = −βSI, dI/dt = βSI − γI, dR/dt = γI. Three coupled ODEs solved by Euler. ' +
        'Simple enough for real-time epidemiological dashboards.',
      example: 'COVID-19 SIR: β=0.3, γ=0.1, N=10⁶. Euler h=1 day, 365 steps per year',
      icon: '🦠',
      difficulty: 'intermediate',
    },
  ],

  commonMistakes: [
    {
      id: 'm1',
      title: 'Choosing h too large and missing instability',
      description: 'For y\' = −100y (λ=−100), Euler requires h < 0.02. With h=0.1: solution oscillates and blows up.',
      wrongApproach: 'Use h=0.1 for stiff y\'=−100y → numerical solution oscillates wildly',
      correctApproach: 'Check h|λ| < 2 before starting. Use implicit Euler for stiff problems.',
      icon: '⚠️',
    },
    {
      id: 'm2',
      title: 'Confusing local and global error',
      description: 'Euler\'s local error is O(h²) but global error is O(h). This is because the O(h²) error per step accumulates over O(1/h) steps.',
      wrongApproach: 'Claim Euler is "second-order accurate" because local error is O(h²)',
      correctApproach: 'Euler is first-order: global error O(h). Halving h halves the global error.',
      icon: '📏',
    },
    {
      id: 'm3',
      title: 'Applying Euler to a system of ODEs incorrectly',
      description: 'For a system y\' = Ay, you must update ALL components simultaneously using values from the SAME step.',
      wrongApproach: 'y₁_new = y₁ + h×f₁(y₁_new, y₂_old) — using updated y₁ in the same step',
      correctApproach: 'Compute ALL f_i(y_old) first, then update all y_i simultaneously',
      icon: '🔄',
    },
    {
      id: 'm4',
      title: 'Not testing convergence',
      description: 'Always verify by halving h and checking that the error halves (order 1 behavior). If error quarters, you\'ve implemented RK2 instead.',
      wrongApproach: 'Accept one run result without verifying the order of convergence',
      correctApproach: 'Run with h, h/2, h/4. If errors are in ratio 1:0.5:0.25, confirmed O(h).',
      icon: '🔍',
    },
  ],

  practiceProblems: [
    {
      id: 'p1',
      title: 'Euler by hand: dy/dx = y',
      description: 'Solve dy/dx = y, y(0) = 1 with h = 0.5 for 4 steps. Exact: y = eˣ.',
      difficulty: 'easy',
      hint: 'y₁ = 1 + 0.5×1 = 1.5. y₂ = 1.5 + 0.5×1.5 = 2.25. y₃ = 2.25 + 0.5×2.25 = ...',
      expectedAnswer: 'y₁=1.5, y₂=2.25, y₃=3.375, y₄=5.0625. Exact at x=2: e²≈7.389. Error: 31%.',
    },
    {
      id: 'p2',
      title: 'Stability threshold for stiff ODE',
      description: 'For y\' = −50y, y(0) = 1, what is the maximum stable step size h for Euler?',
      difficulty: 'easy',
      hint: 'Stability condition: h|λ| < 2. λ = −50 so |λ| = 50.',
      expectedAnswer: 'h_max = 2/50 = 0.04. For h > 0.04, Euler will oscillate and diverge.',
    },
    {
      id: 'p3',
      title: 'Compare error orders',
      description: 'Solve y\' = −y + 1, y(0) = 0 to x=1 with h = 0.1 and h = 0.05. Exact: y = 1 − e^{−x}.',
      difficulty: 'medium',
      hint: 'Run both. Compute max error for each. Does error ratio ≈ 2? (That would confirm O(h))',
      expectedAnswer: 'h=0.1: max error ≈ 0.045. h=0.05: max error ≈ 0.023. Ratio ≈ 2. Confirms O(h) = first-order.',
    },
    {
      id: 'p4',
      title: 'Van der Pol oscillator',
      description: 'y\' = μ(1 − y²)z, z\' = −y (μ=1). Solve from (y, z) = (2, 0) to t=5 with h=0.1. Describe behavior.',
      difficulty: 'hard',
      hint: 'This is a 2×2 system. Apply Euler to both components simultaneously. For μ=1, not very stiff — h=0.1 should work.',
      expectedAnswer: 'Limit cycle behavior — solution oscillates with bounded amplitude. Euler h=0.1 roughly captures the oscillation but with some drift.',
    },
  ],

  interactiveChallenges: [
    {
      id: 'c1',
      title: 'Confirm O(h) convergence',
      description: 'Halve h three times and observe that the error halves each time.',
      objective: 'Verify empirically that Euler has first-order (linear) convergence.',
      difficulty: 'easy',
      steps: [
        { step: 1, instruction: 'Solve y\'=−y, y(0)=1 to x=1 with h=0.2, 0.1, 0.05. Note global errors.', actionLabel: 'Sweep h' },
        { step: 2, instruction: 'Compute error ratios. Are they all ≈ 2?', expectedOutcome: 'Errors in ratio 1:0.5:0.25. Confirms O(h) — halving h halves the error.' },
      ],
    },
    {
      id: 'c2',
      title: 'Observe instability',
      description: 'Gradually increase h past the stability limit for a stiff ODE.',
      objective: 'See the exact step size where Euler transitions from stable to unstable.',
      difficulty: 'medium',
      steps: [
        { step: 1, instruction: 'Solve y\'=−20y, y(0)=1. Try h=0.05, 0.09, 0.10, 0.11.', actionLabel: 'Sweep h' },
        { step: 2, instruction: 'At what h does the solution start oscillating? Matches 2/20=0.1?', expectedOutcome: 'h=0.09: stable. h=0.10: boundary. h=0.11: oscillates. Exactly confirms stability limit h=2/|λ|=0.1.' },
      ],
    },
    {
      id: 'c3',
      title: 'Energy non-conservation in oscillator',
      description: 'Observe how Euler adds energy to a harmonic oscillator.',
      objective: 'Understand why symplectic integrators are preferred for oscillatory systems.',
      difficulty: 'medium',
      steps: [
        { step: 1, instruction: 'Solve y\'\'=−y as system: y\'=v, v\'=−y. Start (y,v)=(1,0). Plot y vs t over 10 periods.', actionLabel: 'Simulate' },
        { step: 2, instruction: 'Does the amplitude grow over time? Plot E = y²/2 + v²/2 vs t.', expectedOutcome: 'Amplitude grows (energy not conserved). Euler adds energy each step — catastrophic for long simulations.' },
      ],
    },
    {
      id: 'c4',
      title: 'SIR epidemic model',
      description: 'Simulate a disease outbreak using Euler\'s method on the SIR system.',
      objective: 'Apply Euler to a coupled system of ODEs from epidemiology.',
      difficulty: 'hard',
      steps: [
        { step: 1, instruction: 'Set β=0.3, γ=0.1, S₀=999, I₀=1, R₀=0. Solve SIR system with h=1 day to t=180.', actionLabel: 'Simulate epidemic' },
        { step: 2, instruction: 'At what day does I peak? What fraction of population gets infected?', expectedOutcome: 'I peaks around day 70 at ~300 infected. Total infected ≈ 900 (90% of population). Herd immunity at R₀ = β/γ = 3.' },
      ],
    },
  ],

  summary: {
    keyPoints: [
      { title: 'Formula', description: 'y_{n+1} = y_n + h·f(x_n, y_n) — one function eval per step', icon: '🔢' },
      { title: 'Order', description: 'First-order: global error O(h). Halve h → halve error', icon: '📉' },
      { title: 'Stability', description: 'Unstable for h|λ| > 2. Critical for stiff problems', icon: '⚠️' },
      { title: 'Simple', description: 'Easiest to implement — the "hello world" of ODE solvers', icon: '👋' },
      { title: 'Use RK4', description: 'In practice, always prefer RK4 or higher order', icon: '🚀' },
    ],
    cheatSheetFormulas: [
      { label: 'Euler step', latex: 'y_{n+1} = y_n + h \\cdot f(x_n, y_n)', isKeyFormula: true },
      { label: 'Global error', latex: '\\|y(x_N) - y_N\\| = O(h)', isKeyFormula: true },
      { label: 'Stability', latex: 'h < 2/|\\lambda|' },
    ],
    nextSteps: [
      { label: 'Runge-Kutta 4', description: 'Fourth-order method: O(h⁴) accuracy with 4 evaluations/step', path: '/ode/runge-kutta' },
      { label: 'ODE Comparison', description: 'Euler vs RK4 vs exact — side-by-side', path: '/ode/comparison' },
    ],
  },
}
