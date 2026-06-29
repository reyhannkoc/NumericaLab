import type { LessonConfig } from '@/types/lesson.types'

export const RICHARDSON_CONFIG: LessonConfig = {
  header: {
    moduleId: 'differentiation',
    moduleColor: '#f59e0b',
    title: 'Richardson Extrapolation',
    subtitle: 'Cancel leading error terms: combine D(h) and D(h/2) to get O(h⁴) accuracy from O(h²) formulas',
    difficulty: 'advanced',
    estimatedMinutes: 50,
    objectives: [
      'Understand how Richardson extrapolation eliminates the leading error term',
      'Derive the O(h⁴) Richardson formula from two O(h²) central difference estimates',
      'Build the Richardson table iteratively for higher-order approximations',
      'Recognize Richardson extrapolation as the foundation of Romberg integration',
      'Apply Richardson to improve any numerical estimate with known error expansion',
    ],
    prerequisites: [
      { title: 'Central Difference', path: '/differentiation/central', required: true },
    ],
    tags: ['differentiation', 'extrapolation', 'high-order', 'error cancellation'],
  },

  motivation: {
    problemStatement:
      'Central difference gives f\'(x) ≈ (f(x+h) − f(x−h))/(2h) with error O(h²). ' +
      'Halving h gives 4× more accuracy but doubles function evaluations. ' +
      'Richardson extrapolation achieves O(h⁴) accuracy using ONLY the two already-computed estimates — no extra evaluations.',
    whyItMatters:
      'Richardson extrapolation is the idea behind Romberg integration (Richardson applied to the trapezoidal rule), ' +
      'and is used in ODE solvers (extrapolation methods) and adaptive algorithms everywhere. ' +
      'Understanding it unlocks a general technique for accelerating any convergent numerical sequence.',
    historicalBackground:
      'Lewis Fry Richardson (1911) described "The approximate arithmetical solution by finite differences of physical problems." ' +
      'His deferred approach to the limit — computing at h and h/2, then extrapolating — was revolutionary. ' +
      'Richardson also invented the concept of weather prediction by numerical methods (1922).',
    engineeringMotivation:
      'In computational aerodynamics, mesh refinement studies use Richardson extrapolation to estimate grid-converged values. ' +
      'Given solutions on a coarse mesh (h), medium mesh (h/2), and fine mesh (h/4), ' +
      'Richardson gives the h→0 limit — the "exact" answer — without actually solving at h=0.',
    motivatingExample: {
      title: 'Estimate f\'(1) for f(x) = sin(x) with h = 0.1 and h = 0.05',
      description: 'D(0.1) = (sin(1.1)−sin(0.9))/0.2 = 0.54030. D(0.05) = 0.54029. Richardson: (4×D(0.05)−D(0.1))/3 = 0.54030254.',
      expression: 'R_{1,1} = \\frac{4D(h/2) - D(h)}{3}',
      result: 'Exact cos(1) = 0.54030231. D(0.1) error = 1.5×10⁻⁶. Richardson error = 2.3×10⁻⁸ — 65× better.',
    },
  },

  theory: {
    overview:
      'Any consistent numerical approximation D(h) to a limit L has an error expansion: ' +
      'D(h) = L + a₁h^p + a₂h^{2p} + a₃h^{3p} + … ' +
      'Richardson extrapolation uses two estimates D(h) and D(h/2) to eliminate the leading term a₁h^p, ' +
      'giving a new estimate with error O(h^{2p}).',
    intuition:
      'Imagine measuring a table\'s length with a ruler of resolution h and h/2. ' +
      'Both measurements have systematic errors proportional to h and h². ' +
      'Richardson says: "multiply the h/2 measurement by 4 and subtract the h measurement, ' +
      'then divide by 3" — this cancels the leading systematic error, leaving only the O(h⁴) part.',
    advantages: [
      'Achieves O(h⁴) accuracy from two O(h²) estimates at no extra function evaluations',
      'General: applies to ANY method whose error has a known power-law expansion',
      'Can be applied iteratively (Richardson table) for O(h⁶), O(h⁸), …',
    ],
    limitations: [
      'Requires error expansion to be known (D(h) = L + ah^p + bh^{2p} + …)',
      'Amplifies roundoff: for very small h, roundoff in D(h) and D(h/2) can dominate',
      'Requires TWO evaluations at different h values',
    ],
    keyInsights: [
      'Richardson weight: 4/(4−1) = 4/3 for p=2. General: q/(q−1) and −1/(q−1) where q = 2^p',
      'Applied to trapezoidal rule (error O(h²)): Richardson gives Romberg integration',
      'Applied to Euler\'s method (error O(h)): gives Richardson\'s extrapolation for ODEs',
    ],
  },

  mathFoundation: {
    formulas: [
      {
        label: 'Error Expansion',
        latex: 'D(h) = L + a_1 h^2 + a_2 h^4 + a_3 h^6 + \\ldots',
        description: 'Central difference D(h) has error in even powers of h (by symmetry)',
        isKeyFormula: true,
      },
      {
        label: 'Richardson Formula (p=2)',
        latex: 'R_1 = \\frac{4D(h/2) - D(h)}{3} = L + O(h^4)',
        description: 'Multiply D(h/2) by 4, subtract D(h), divide by 3. Leading error a₁h² cancels.',
        isKeyFormula: true,
      },
      {
        label: 'Richardson Table Entry',
        latex: 'R_{k,j} = \\frac{4^j R_{k,j-1} - R_{k-1,j-1}}{4^j - 1}',
        description: 'Iterative Richardson table for order O(h^{2j+2})',
        isKeyFormula: true,
      },
      {
        label: 'General Richardson',
        latex: 'R = \\frac{q^p D(h/q) - D(h)}{q^p - 1}\\quad (q = 2,\\;p = \\text{error order})',
        description: 'General form for ratio q (typically q=2) and error order p',
      },
    ],
    symbols: [
      { symbol: 'D(h)', definition: 'Numerical approximation at step size h. Error expands as L + a₁h^p + a₂h^{2p} + …' },
      { symbol: 'L', definition: 'Exact limit (true derivative). What we\'re estimating.' },
      { symbol: 'p', definition: 'Order of the leading error term. p=2 for central difference, p=1 for forward/backward.' },
      { symbol: 'R_{k,j}', definition: 'Richardson table entry: order O(h^{2j+2}), computed from k+1 function evaluations at h/2^k, h/2^{k-1}, …, h' },
    ],
    derivationSteps: [
      { step: 1, description: 'Write D(h) = L + a₁h² + a₂h⁴ + …', latex: 'D(h) = L + a_1 h^2 + a_2 h^4 + \\ldots' },
      { step: 2, description: 'Write D(h/2) = L + a₁(h/2)² + a₂(h/2)⁴ + … = L + a₁h²/4 + …', latex: 'D(h/2) = L + a_1 h^2/4 + a_2 h^4/16 + \\ldots' },
      { step: 3, description: 'Multiply second by 4 and subtract first: 3L = 4D(h/2)−D(h) + O(h⁴)', latex: '4D(h/2) - D(h) = 3L + (a_2 h^4/4 - a_2 h^4) + \\ldots = 3L - \\tfrac{3}{4}a_2 h^4 + \\ldots' },
      { step: 4, description: 'Divide by 3: R₁ = (4D(h/2)−D(h))/3 = L + O(h⁴)', latex: 'R_1 = \\frac{4D(h/2)-D(h)}{3} = L + O(h^4)' },
    ],
    assumptions: ['D(h) has an asymptotic error expansion in powers of h (usually even powers for symmetric formulas)', 'f is sufficiently smooth'],
    convergenceCondition: 'Richardson table converges geometrically: R_{k,j} converges to L at rate O(h^{2j+2}) as h→0, j fixed.',
  },

  errorAnalysis: {
    metrics: [
      { label: 'Order Before', formula: 'O(h²)', description: 'Central difference error before extrapolation' },
      { label: 'Order After', formula: 'O(h⁴)', description: 'Richardson error after one extrapolation step' },
      { label: 'Improvement Factor', formula: '(h/2)²/(h/2)⁴ = 4', description: 'For same h, Richardson is 4× more accurate than central difference' },
    ],
    stabilityNote:
      'For very small h, subtraction D(h/2) − D(h) ≈ 0 causes catastrophic cancellation. ' +
      'Optimal h balances truncation (small h = better) vs roundoff (too small h = worse): h_opt ≈ ε_mach^{1/4} ≈ 10⁻⁴ for float64.',
    floatingPointNote:
      'Richardson table: successive rows halve h and the differences grow smaller — increasing roundoff sensitivity. ' +
      'Stop building the table when differences between columns stop decreasing.',
  },

  performance: {
    complexity: {
      timeComplexity: 'O(k) function evaluations for k levels; O(k²) table entries',
      spaceComplexity: 'O(k²) for full table; O(k) if only diagonal needed',
      convergenceOrder: 'O(h^{2k}) with k extrapolation levels — very high order possible',
      convergenceOrderNote: '3 levels: O(h⁸) — typically 8–12 digits for smooth functions with h=0.1',
    },
    bestCase: 'Analytic function, moderate h, 3–4 extrapolation levels: near machine precision',
    worstCase: 'Non-smooth f or very small h: roundoff dominates the extrapolation',
    typicalIterations: '3–4 Richardson levels (k=3,4) sufficient for near-machine precision on smooth functions',
  },

  engineeringApplications: [
    {
      field: 'Computational Fluid Dynamics',
      title: 'Grid Convergence Index (GCI)',
      description:
        'Richardson extrapolation is the standard technique for estimating grid-independent solutions. ' +
        'Solve on meshes h, h/2, h/4. Richardson extrapolation gives the h→0 result.',
      example: 'RANS simulation: drag coefficient 0.324 (h), 0.318 (h/2). Richardson: 0.316. ASME reports GCI = (0.324−0.316)/0.316 ≈ 2.5%.',
      icon: '✈️',
      difficulty: 'advanced',
    },
    {
      field: 'Numerical Integration',
      title: 'Romberg Integration',
      description:
        'Richardson applied to the trapezoidal rule: T(h) = I + a₁h² + a₂h⁴ + … ' +
        'Richardson table gives O(h^{2k}) accuracy. This IS Romberg integration.',
      example: '∫₀¹ sin(x)/x dx with 3 Richardson levels: 17 function evaluations, ~12 digits of accuracy',
      icon: '∫',
      difficulty: 'advanced',
    },
    {
      field: 'Experimental Testing',
      title: 'Sensor Calibration Error Estimation',
      description:
        'Strain gauge measurements at different voltage resolutions: Richardson extrapolation estimates the true strain from coarse and fine measurements.',
      example: 'Load cell at 10V and 5V resolution: Richardson removes systematic quantization error',
      icon: '🔬',
      difficulty: 'intermediate',
    },
  ],

  commonMistakes: [
    {
      id: 'm1',
      title: 'Using the wrong weight (not accounting for error order p)',
      description: 'For forward difference (p=1), weight is (2D(h/2)−D(h))/(2−1)=2D(h/2)−D(h), NOT (4D(h/2)−D(h))/3.',
      wrongApproach: 'Apply (4D(h/2)−D(h))/3 to forward difference formula (p=1 not p=2)',
      correctApproach: 'Weight depends on p: R = (2^p·D(h/2) − D(h))/(2^p − 1). For p=2: (4D−D)/3. For p=1: 2D(h/2)−D(h).',
      icon: '⚖️',
    },
    {
      id: 'm2',
      title: 'Applying Richardson when h is too small (roundoff amplification)',
      description: 'If D(h/2) and D(h) are both very close to L, their difference is dominated by roundoff, and Richardson amplifies this noise.',
      wrongApproach: 'Build a 10-level Richardson table starting from h=10⁻⁵',
      correctApproach: 'Start from a moderate h (≈10⁻² for derivatives). Stop table when differences stop decreasing.',
      icon: '🔍',
    },
  ],

  practiceProblems: [
    {
      id: 'p1', title: 'One Richardson step',
      description: 'f(x)=cos(x), x=1. D(0.1)=−0.8421 (central), D(0.05)=−0.8415. Compute R₁. Compare to sin(1)=0.8415.',
      difficulty: 'easy',
      hint: 'R₁ = (4×D(0.05) − D(0.1)) / 3',
      expectedAnswer: 'R₁ = (4×(−0.8415) − (−0.8421))/3 = (−3.366 + 0.8421)/3 = −0.8413. Exact −sin(1)=−0.8415. Error ≈ 2×10⁻⁴.',
    },
    {
      id: 'p2', title: 'Build a 3×3 Richardson table',
      description: 'For f(x)=eˣ at x=0, compute D(h) central difference for h=0.4, 0.2, 0.1. Build the Richardson table.',
      difficulty: 'medium',
      hint: 'D(h)=(f(h)−f(−h))/(2h). Then R_{1,1}=(4D(h/2)−D(h))/3, R_{2,1}=(4D(h/4)−D(h/2))/3, R_{1,2}=(16R_{2,1}−R_{1,1})/15',
      expectedAnswer: 'D(0.4)≈1.0027, D(0.2)≈1.0007, D(0.1)≈1.0002. R_{1,1}≈1.00003. R_{1,2}≈1.0000000. Exact f\'(0)=1.',
    },
    {
      id: 'p3', title: 'Confirm improvement factor',
      description: 'Compare errors: central D(h), central D(h/2), and Richardson R₁. Show error ratios match theoretical O(h²) and O(h⁴) orders.',
      difficulty: 'medium',
      hint: 'If you halve h, central error should decrease by 4. D(h/2)/D(h) ≈ 4. Richardson R₁ error should be ~16× smaller than D(h).',
      expectedAnswer: 'e₁=D(h) error, e₂=D(h/2) error ≈ e₁/4. Richardson: e_R ≈ e₁/16. Confirms O(h²) → O(h⁴) improvement.',
    },
    {
      id: 'p4', title: 'Romberg integration (Richardson applied to integration)',
      description: 'Compute ∫₀¹ x² dx using trapezoidal T(1)=0.5, T(0.5)=0.25. Apply Richardson. Exact=1/3.',
      difficulty: 'hard',
      hint: 'T(h)=I + a₁h² + …. R₁=(4T(h/2)−T(h))/3. This should give Simpson\'s rule result.',
      expectedAnswer: 'T(1)=0.5, T(0.5)=0.375. R₁=(4×0.375−0.5)/3=(1.5−0.5)/3=1/3. Exact! Richardson of trapezoidal = Simpson\'s rule.',
    },
  ],

  interactiveChallenges: [
    {
      id: 'c1', title: 'Error reduction visualized',
      description: 'See how each Richardson level reduces the error by a factor of ~16.',
      objective: 'Empirically confirm O(h⁴) convergence from Richardson.',
      difficulty: 'easy',
      steps: [
        { step: 1, instruction: 'Compute D(h) central for h=0.5, 0.25, 0.125. Note errors.', actionLabel: 'Compute levels' },
        { step: 2, instruction: 'Apply Richardson to each pair. Are error ratios ≈ 16?', expectedOutcome: 'R₁ from (0.5,0.25) vs R₁ from (0.25,0.125): ratio ≈ 16. Confirms O(h⁴) behavior.' },
      ],
    },
    {
      id: 'c2', title: 'Richardson vs Romberg connection',
      description: 'Apply Richardson to the trapezoidal rule and show it produces Simpson\'s rule.',
      objective: 'Understand that Romberg integration IS Richardson extrapolation of the trapezoidal rule.',
      difficulty: 'medium',
      steps: [
        { step: 1, instruction: 'Compute T(h) and T(h/2) for ∫₀¹ sin(x)dx.', actionLabel: 'Compute trapezoidal' },
        { step: 2, instruction: 'Apply Richardson: R=(4T(h/2)−T(h))/3. Compare to Simpson\'s (h/6)(f(0)+4f(h/2)+f(h)).', expectedOutcome: 'Richardson of trapezoidal = Simpson\'s rule exactly. Romberg table level 2 = composite Simpson.' },
      ],
    },
  ],

  summary: {
    keyPoints: [
      { title: 'Formula', description: 'R = (4D(h/2)−D(h))/3 → O(h⁴) from two O(h²) estimates', icon: '🔢' },
      { title: 'No Extra Calls', description: 'Reuses already-computed D(h) and D(h/2) — free improvement', icon: '♻️' },
      { title: 'Table', description: 'Build iteratively for O(h⁶), O(h⁸), … very high accuracy', icon: '📊' },
      { title: 'Romberg', description: 'Richardson on trapezoidal rule = Romberg integration', icon: '∫' },
    ],
    cheatSheetFormulas: [
      { label: 'First Richardson', latex: 'R_1 = \\frac{4D(h/2) - D(h)}{3}', isKeyFormula: true },
      { label: 'Table entry', latex: 'R_{k,j} = \\frac{4^j R_{k,j-1} - R_{k-1,j-1}}{4^j-1}', isKeyFormula: true },
      { label: 'Order', latex: 'R_{k,j} = L + O(h^{2j+2})' },
    ],
    nextSteps: [
      { label: 'Romberg Integration', description: 'Richardson applied to the trapezoidal rule for high-order integration', path: '/integration/romberg' },
    ],
  },
}
