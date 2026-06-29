import type { LessonConfig } from '@/types/lesson.types'

export const RUNGE_KUTTA_CONFIG: LessonConfig = {
  header: {
    moduleId: 'ode',
    moduleColor: '#84cc16',
    title: 'Runge-Kutta 4 (RK4)',
    subtitle: 'Fourth-order ODE solver: y_{n+1} = y_n + h(k₁ + 2k₂ + 2k₃ + k₄)/6',
    difficulty: 'intermediate',
    estimatedMinutes: 65,
    objectives: [
      'Understand the RK4 four-stage slope estimation strategy',
      'Derive the O(h⁴) local and O(h⁴) global error from the Taylor expansion',
      'Identify when RK4 is the right choice vs. adaptive methods',
      'Apply RK4 to systems of ODEs (e.g., orbital mechanics, spring-mass)',
      'Recognize the stability region of RK4 and compare to Euler',
    ],
    prerequisites: [
      { title: "Euler's Method", path: '/ode/euler', required: true },
    ],
    tags: ['ODE', 'Runge-Kutta', 'fourth-order', 'multi-stage', 'explicit'],
  },

  motivation: {
    problemStatement:
      'A satellite orbits Earth: d²r/dt² = −GM/r². ' +
      'Euler\'s method with h=60 s accumulates ~1 km error per orbit — the satellite drifts off course. ' +
      'RK4 with the same h gives sub-meter error per orbit.',
    whyItMatters:
      'RK4 is the workhorse of scientific computing. ' +
      'It achieves fourth-order accuracy (O(h⁴)) with only four function evaluations per step — ' +
      'a remarkable trade-off. It appears in MATLAB\'s ode45, SciPy\'s solve_ivp, and most physics simulators.',
    historicalBackground:
      'Carl Runge (1895) derived the third-order method; Wilhelm Kutta (1901) extended it to fourth order. ' +
      'The classical "RK4" formula published by Kutta is still the most-used ODE solver today, ' +
      'over 120 years later.',
    engineeringMotivation:
      'NASA\'s trajectory calculations, molecular dynamics simulations, structural analysis, ' +
      'and circuit simulation all rely on RK4 or its adaptive variants (RK45). ' +
      'Understanding RK4 is understanding how computers solve the equations of physics.',
    motivatingExample: {
      title: 'Solve dy/dx = y with y(0) = 1 at x = 1 (exact: e ≈ 2.71828)',
      description:
        'h = 0.5: k₁ = f(0, 1) = 1, k₂ = f(0.25, 1.25) = 1.25, k₃ = f(0.25, 1.3125) = 1.3125, k₄ = f(0.5, 1.65625) = 1.65625.' +
        ' y₁ = 1 + 0.5×(1 + 2×1.25 + 2×1.3125 + 1.65625)/6 = 1.6484375',
      expression: 'y_{n+1} = y_n + \\frac{h}{6}(k_1 + 2k_2 + 2k_3 + k_4)',
      result: 'h=0.5: error = 1.6×10⁻⁴. Euler same h: error = 17%. RK4 is 1000× more accurate.',
    },
  },

  theory: {
    overview:
      'RK4 approximates y(x+h) by computing four slope estimates (stages) at different points within the interval [x, x+h], ' +
      'then combining them as a weighted average. ' +
      'The weights 1/6, 1/3, 1/3, 1/6 match the coefficients in Simpson\'s rule — this is not a coincidence.',
    intuition:
      'Think of navigating through fog: Euler uses only the slope at the start. ' +
      'RK4 samples the slope at the start, twice at the midpoint (using different estimates), and at the end. ' +
      'Averaging these four samples gives a much better picture of the true curve direction.',
    advantages: [
      'Fourth-order accuracy: global error O(h⁴) — halving h cuts error by factor 16',
      'Only 4 function evaluations per step — very efficient for smooth problems',
      'Self-starting: no past values needed (unlike Adams multistep)',
      'Robust: works well for most non-stiff ODEs without fine-tuning',
    ],
    limitations: [
      'Fixed step size: RK4 wastes evaluations in smooth regions and struggles with rapid changes',
      'Conditionally stable: stability region larger than Euler but still bounded',
      'Not ideal for stiff ODEs — use implicit methods (BDF, Radau) instead',
      '4 evaluations per step: if f is expensive, consider higher-order explicit methods',
    ],
    keyInsights: [
      'Local truncation error: O(h⁵). Global error: O(h⁴) — 4th order',
      'Stability region includes imaginary axis (unlike Euler) — handles oscillatory ODEs better',
      'RK45 (Dormand-Prince) uses 6 stages to get both 4th and 5th order estimates → error control',
    ],
  },

  mathFoundation: {
    formulas: [
      {
        label: 'Stage 1 (Start Slope)',
        latex: 'k_1 = f(x_n,\\; y_n)',
        description: 'Slope at the beginning of the interval',
      },
      {
        label: 'Stage 2 (Euler Midpoint)',
        latex: 'k_2 = f\\!\\left(x_n + \\tfrac{h}{2},\\; y_n + \\tfrac{h}{2}k_1\\right)',
        description: 'Slope at midpoint, using k₁ to reach there',
      },
      {
        label: 'Stage 3 (Improved Midpoint)',
        latex: 'k_3 = f\\!\\left(x_n + \\tfrac{h}{2},\\; y_n + \\tfrac{h}{2}k_2\\right)',
        description: 'Slope at midpoint, using k₂ (better midpoint estimate)',
      },
      {
        label: 'Stage 4 (End Slope)',
        latex: 'k_4 = f\\!\\left(x_n + h,\\; y_n + h\\,k_3\\right)',
        description: 'Slope at end of interval, using k₃ to reach there',
      },
      {
        label: 'RK4 Update',
        latex: 'y_{n+1} = y_n + \\frac{h}{6}\\bigl(k_1 + 2k_2 + 2k_3 + k_4\\bigr)',
        description: 'Weighted average: midpoint stages count twice. Matches Simpson\'s rule.',
        isKeyFormula: true,
      },
      {
        label: 'Local Truncation Error',
        latex: '\\tau_n = O(h^5) \\implies \\text{global error} = O(h^4)',
        description: 'Halving h reduces global error by factor 2⁴ = 16',
        isKeyFormula: true,
      },
    ],
    symbols: [
      { symbol: 'k₁, k₂, k₃, k₄', definition: 'Stage slopes. Weighted combination approximates the average slope over [xₙ, xₙ₊₁]' },
      { symbol: 'h', definition: 'Step size. RK4 error is O(h⁴) — much faster than Euler\'s O(h).' },
      { symbol: 'LTE', definition: 'Local truncation error per step = O(h⁵). Accumulated over n=1/h steps → global O(h⁴).' },
    ],
    derivationSteps: [
      {
        step: 1,
        description: 'Taylor-expand y(xₙ + h) to 5th order',
        latex: 'y(x+h) = y + hy\' + \\tfrac{h^2}{2}y\'\' + \\tfrac{h^3}{6}y\'\'\' + \\tfrac{h^4}{24}y^{(4)} + O(h^5)',
      },
      {
        step: 2,
        description: 'Match coefficients by choosing k₁, k₂, k₃, k₄ to reproduce terms through h⁴',
        latex: '\\tfrac{1}{6}k_1 + \\tfrac{1}{3}k_2 + \\tfrac{1}{3}k_3 + \\tfrac{1}{6}k_4 = y\' + \\tfrac{h}{2}y\'\' + \\ldots + O(h^4)',
      },
      {
        step: 3,
        description: 'Residual after matching: O(h⁵) per step → O(h⁴) global',
        latex: '\\tau_n = y(x_{n+1}) - y_{n+1} = \\tfrac{h^5}{120}y^{(5)}(\\xi) + O(h^6)',
      },
    ],
    assumptions: [
      'ODE dy/dx = f(x, y) is sufficiently smooth (y has 5 continuous derivatives)',
      'Problem is not stiff: eigenvalue magnitudes |λ| are moderate',
    ],
    convergenceCondition: 'Global error O(h⁴): convergent by consistency + zero-stability (Dahlquist). Halve h → error/16.',
  },

  errorAnalysis: {
    metrics: [
      {
        label: 'Global Error',
        formula: 'O(h⁴)',
        description: 'Halving h cuts global error by factor 16. Dramatically better than Euler\'s O(h).',
      },
      {
        label: 'Evaluations per Step',
        formula: '4',
        description: '4 evaluations per step vs Euler\'s 1. But each step can be 16× larger for the same error.',
      },
      {
        label: 'Efficiency',
        formula: '4 evals for O(h⁴)',
        description: 'To match RK4 accuracy, Euler needs 1/h steps vs RK4\'s ~1/h^{4/5} — RK4 wins for smooth f.',
      },
    ],
    stabilityNote:
      'RK4\'s stability region is larger than Euler\'s and includes part of the imaginary axis, ' +
      'making it suitable for mildly oscillatory systems. For stiff problems (large |λ|), ' +
      'the step size restriction h|λ| < ~2.8 still applies — use implicit methods for stiff ODEs.',
    floatingPointNote:
      'For very smooth problems, RK4 achieves near-machine-precision accuracy with moderate h. ' +
      'Adaptive variants (RK45) automatically detect where to shrink h for rapid solution changes.',
  },

  performance: {
    complexity: {
      timeComplexity: 'O(4N) = O(4(b−a)/h) function evaluations',
      spaceComplexity: 'O(N) for trajectory; O(1) for current step',
      convergenceOrder: 'Fourth-order: global error O(h⁴)',
      convergenceOrderNote:
        'For same accuracy as Euler with h=0.001, RK4 needs only h≈0.18 (18× larger step, 72× fewer steps, 18× fewer evals).',
    },
    bestCase: 'Smooth non-stiff ODE: fast, accurate, minimal steps',
    worstCase: 'Stiff ODE with large |λ|: step restriction similar to Euler (use implicit methods instead)',
    typicalIterations: 'N = 50–1000 steps for most engineering problems with h chosen for O(10⁻⁶) accuracy',
  },

  engineeringApplications: [
    {
      field: 'Astrodynamics',
      title: 'Orbital Mechanics',
      description:
        'd²r/dt² = −GM/|r|³·r. RK4 integrates two-body (and N-body) orbital equations. ' +
        'NASA\'s trajectory planning uses RK45 (adaptive variant) for interplanetary transfers.',
      example: 'LEO satellite: T=90 min orbit. RK4 h=1 s → 5400 steps, sub-meter accuracy per orbit',
      icon: '🛸',
      difficulty: 'advanced',
    },
    {
      field: 'Structural Engineering',
      title: 'Nonlinear Vibration',
      description:
        'Duffing oscillator: ẍ + δẋ + αx + βx³ = γcos(ωt). ' +
        'RK4 reveals period-doubling bifurcations and chaotic motion missed by linearization.',
      example: 'Steel beam: α=−1, β=1, δ=0.3, γ=0.5. RK4 h=0.01, 10000 steps reveals Poincaré section',
      icon: '🏗️',
      difficulty: 'advanced',
    },
    {
      field: 'Robotics',
      title: 'Dynamics Simulation',
      description:
        'Robot arm joint dynamics: τ = M(q)q̈ + C(q,q̇) + G(q). ' +
        'RK4 integrates joint trajectories for motion planning and control design.',
      example: '6-DOF robot arm: RK4 h=1 ms, real-time simulation at 1 kHz for compliance control',
      icon: '🤖',
      difficulty: 'advanced',
    },
    {
      field: 'Chemical Engineering',
      title: 'Batch Reactor Kinetics',
      description:
        'dC_A/dt = −k₁C_A, dC_B/dt = k₁C_A − k₂C_B. ' +
        'RK4 tracks concentration profiles in multi-reaction batch reactors.',
      example: 'k₁=0.1, k₂=0.05 min⁻¹. RK4 h=1 min, 120 steps for 2-hour reaction time',
      icon: '⚗️',
      difficulty: 'intermediate',
    },
    {
      field: 'Electrical Engineering',
      title: 'Nonlinear Circuit Simulation',
      description:
        'Tunnel diode oscillator: Ldi/dt = V, Cdv/dt = i − f(v). ' +
        'RK4 captures limit-cycle oscillations in van der Pol-type circuits.',
      example: 'L=1 μH, C=1 pF: oscillation at ~160 MHz. RK4 h=0.1 ns, 50000 steps per μs',
      icon: '⚡',
      difficulty: 'intermediate',
    },
  ],

  commonMistakes: [
    {
      id: 'm1',
      title: 'Using the wrong stage update in RK4',
      description: 'k₃ uses the corrected midpoint y_n + h/2·k₂, NOT the original y_n. Mixing up stages destroys the order.',
      wrongApproach: 'k₃ = f(x_n + h/2, y_n + h/2·k₁) — this reuses k₁ instead of k₂ for k₃',
      correctApproach: 'k₃ = f(x_n + h/2, y_n + h/2·k₂). k₁ and k₂ are different; order matters.',
      icon: '🔢',
    },
    {
      id: 'm2',
      title: 'Not updating all state variables simultaneously in systems',
      description: 'For a system y\' = f(x, y), all yᵢ must use the SAME stage values. Never mix stages within a step.',
      wrongApproach: 'Compute k₁ for y₁, update y₁, then compute k₁ for y₂ using updated y₁',
      correctApproach: 'Compute k₁ for ALL variables using current yₙ, then compute k₂ for ALL using yₙ + h/2·k₁, etc.',
      icon: '🔄',
    },
    {
      id: 'm3',
      title: 'Assuming O(h⁴) means always better than Euler',
      description: 'For stiff ODEs with |λ| >> 1, RK4 still requires h|λ| < ~2.8. Euler and RK4 have similar step restrictions for stiff problems.',
      wrongApproach: 'Use RK4 with large h on y\' = −1000y and expect convergence',
      correctApproach: 'For stiff ODEs, use implicit methods (backward Euler, BDF). RK4 advantage is for smooth non-stiff problems.',
      icon: '⚠️',
    },
    {
      id: 'm4',
      title: 'Not verifying O(h⁴) convergence empirically',
      description: 'Always confirm with convergence test: halve h, check that error reduces by factor ~16.',
      wrongApproach: 'Trust any "RK4" implementation without checking if the error ratio matches 2⁴ = 16',
      correctApproach: 'Run with h, h/2, h/4. Error ratios should be 1:1/16:1/256. Confirms true 4th-order implementation.',
      icon: '🔍',
    },
  ],

  practiceProblems: [
    {
      id: 'p1',
      title: 'One step of RK4: dy/dx = y',
      description: 'Compute y₁ using RK4 for dy/dx = y, y(0) = 1 with h = 0.5. Exact: y(0.5) = √e ≈ 1.64872.',
      difficulty: 'easy',
      hint: 'k₁=f(0,1)=1. k₂=f(0.25, 1+0.25)=1.25. k₃=f(0.25, 1+0.25×1.25)=1.3125. k₄=f(0.5, 1+0.5×1.3125)=...',
      expectedAnswer: 'k₄=1.65625. y₁=1+0.5×(1+2.5+2.625+1.65625)/6=1+0.5×7.78125/6≈1.64844. Error: 1.7×10⁻⁴',
    },
    {
      id: 'p2',
      title: 'Compare Euler vs RK4 accuracy',
      description: 'Solve dy/dx = −2y, y(0) = 1 to x=1 with h=0.25. Exact: y(1)=e^{−2}≈0.13534. Compute both Euler and RK4 errors.',
      difficulty: 'medium',
      hint: 'For Euler: 4 steps of y_{n+1} = y_n + h×(−2y_n). For RK4: k₁=f(x_n, y_n), k₂=f(x_n+h/2, y_n+k₁h/2), etc.',
      expectedAnswer: 'Euler: y(1)≈0.0625, error=0.072. RK4: y(1)≈0.13534, error≈10⁻⁶. RK4 is 72000× more accurate.',
    },
    {
      id: 'p3',
      title: 'Pendulum ODE system',
      description: 'θ\' = ω, ω\' = −(g/L)sin(θ). L=1 m, θ(0)=π/4, ω(0)=0. Solve with RK4, h=0.01 s to t=5 s.',
      difficulty: 'medium',
      hint: 'This is a 2D system. Both θ and ω update simultaneously. k₁ = [ω_n, −g·sin(θ_n)], etc.',
      expectedAnswer: 'Oscillation with period T≈2π√(L/g)≈2.007 s. RK4 h=0.01 shows clean periodic oscillation with near-zero energy drift.',
    },
    {
      id: 'p4',
      title: 'Lorenz attractor',
      description: 'ẋ=σ(y−x), ẏ=x(ρ−z)−y, ż=xy−βz. σ=10, ρ=28, β=8/3. Solve with RK4, h=0.01, from (1,1,1) to t=50.',
      difficulty: 'hard',
      hint: 'Three coupled ODEs. Apply RK4 simultaneously to all three. Small h important — the Lorenz system is chaotic.',
      expectedAnswer: 'Solution traces the famous butterfly attractor. The system is chaotic: two nearby initial conditions diverge exponentially, but the attractor shape is preserved.',
    },
  ],

  interactiveChallenges: [
    {
      id: 'c1',
      title: 'Confirm O(h⁴) convergence',
      description: 'Halve h and observe error reduces by factor ~16.',
      objective: 'Empirically verify RK4\'s 4th-order convergence.',
      difficulty: 'easy',
      steps: [
        { step: 1, instruction: 'Solve y\'=−y, y(0)=1 to x=1 with h=0.5, 0.25, 0.125. Note errors.', actionLabel: 'Sweep h' },
        { step: 2, instruction: 'Compute error ratios. Are they all ≈ 16?', expectedOutcome: 'Ratios ≈ 16 confirming O(h⁴). Euler ratio would be ≈ 2 (O(h)).' },
      ],
    },
    {
      id: 'c2',
      title: 'Euler vs RK4 on a period',
      description: 'Simulate a simple harmonic oscillator for 5 full periods with each method. Compare energy drift.',
      objective: 'See why RK4 preserves trajectories far better than Euler.',
      difficulty: 'medium',
      steps: [
        { step: 1, instruction: 'Solve y\'=v, v\'=−y (SHO) from (y,v)=(1,0) to t=10π. Use Euler h=0.2 and RK4 h=0.2.', actionLabel: 'Compare methods' },
        { step: 2, instruction: 'Plot E = y²/2 + v²/2 vs t. Which method conserves energy better?', expectedOutcome: 'Euler: E grows. RK4: E near-constant. Same h, but RK4 is ~10⁵× more accurate.' },
      ],
    },
    {
      id: 'c3',
      title: 'Adaptive step insight',
      description: 'Run RK4 on a problem with rapid initial transient followed by slow dynamics. Observe wasted steps.',
      objective: 'Motivate adaptive step-size control (RK45).',
      difficulty: 'medium',
      steps: [
        { step: 1, instruction: 'Solve y\'=−50y+50sin(x)+cos(x), y(0)=0 to x=5 with fixed h=0.01 (500 steps).', actionLabel: 'Fixed step' },
        { step: 2, instruction: 'After the transient (x>0.2), the solution is smooth sin(x). Could you use h=0.2 for x>0.2 with negligible error loss?', expectedOutcome: 'Yes. Adaptive RK45 would use ~100 steps total instead of 500, spending effort only where needed.' },
      ],
    },
    {
      id: 'c4',
      title: 'RK4 for a stiff ODE',
      description: 'Test RK4 stability on y\'=−100y+100sin(x), y(0)=0.',
      objective: 'Confirm that stiff ODEs break explicit RK4 without small h.',
      difficulty: 'hard',
      steps: [
        { step: 1, instruction: 'Try h=0.04, 0.05, 0.06 on y\'=−100y+100sin(x). Observe stability transitions.', actionLabel: 'Test h values' },
        { step: 2, instruction: 'At what h does RK4 become unstable? How does this compare to the theoretical limit h < 2.8/100 = 0.028?', expectedOutcome: 'RK4 becomes unstable around h≈0.05. Theory says 2.8/100=0.028. Practical limit ~2× theoretical due to the forcing term.' },
      ],
    },
  ],

  summary: {
    keyPoints: [
      { title: 'Four Stages', description: 'k₁ at start, k₂ k₃ at midpoint (different estimates), k₄ at end', icon: '4️⃣' },
      { title: 'Order 4', description: 'Global error O(h⁴): halve h → error/16. 1000× better than Euler', icon: '📉' },
      { title: '4 Evals', description: 'Only 4 function evaluations per step — efficient for smooth f', icon: '⚡' },
      { title: 'Workhorse', description: 'Foundation of ode45, solve_ivp, and most engineering ODE solvers', icon: '🔧' },
      { title: 'Stiff Limit', description: 'Still conditionally stable: h|λ| < ~2.8. Use BDF for stiff systems', icon: '⚠️' },
    ],
    cheatSheetFormulas: [
      { label: 'k₁', latex: 'k_1 = f(x_n, y_n)' },
      { label: 'k₂', latex: 'k_2 = f(x_n + h/2,\\; y_n + hk_1/2)' },
      { label: 'k₃', latex: 'k_3 = f(x_n + h/2,\\; y_n + hk_2/2)' },
      { label: 'k₄', latex: 'k_4 = f(x_n + h,\\; y_n + hk_3)' },
      { label: 'RK4 Update', latex: 'y_{n+1} = y_n + \\frac{h}{6}(k_1 + 2k_2 + 2k_3 + k_4)', isKeyFormula: true },
      { label: 'Global Error', latex: '\\|e_N\\| = O(h^4)', isKeyFormula: true },
    ],
    nextSteps: [
      { label: 'ODE Comparison', description: 'Euler vs RK4 vs exact — side-by-side accuracy comparison', path: '/ode/comparison' },
    ],
  },
}
