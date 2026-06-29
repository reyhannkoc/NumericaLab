import type { LessonConfig } from '@/types/lesson.types'

export const NEWTON_DIVIDED_DIFF_CONFIG: LessonConfig = {
  header: {
    moduleId: 'interpolation',
    moduleColor: '#ec4899',
    title: 'Newton Divided Differences',
    subtitle: 'Incremental polynomial interpolation: p(x) = [y₀] + [y₀,y₁](x−x₀) + [y₀,y₁,y₂](x−x₀)(x−x₁) + …',
    difficulty: 'intermediate',
    estimatedMinutes: 55,
    objectives: [
      'Compute divided difference tables systematically',
      'Build Newton\'s interpolating polynomial in the Newton (forward-difference) form',
      'Add a new data point without recomputing the entire polynomial',
      'Compare to Lagrange: same polynomial, different basis, different efficiency',
      'Identify the Runge phenomenon and when to use Chebyshev nodes',
    ],
    prerequisites: [
      { title: 'Lagrange Interpolation', path: '/interpolation/lagrange', required: true },
    ],
    tags: ['interpolation', 'polynomial', 'incremental', 'divided differences'],
  },

  motivation: {
    problemStatement:
      'A GPS receiver samples altitude h(t) at 5 non-uniform times: t₀=0, t₁=1.5, t₂=3, t₃=4, t₄=5 s. ' +
      'We want h(2.7) but must add a 6th measurement later. ' +
      'With Lagrange, adding one point requires rebuilding from scratch. Newton\'s form adds it in O(n) work.',
    whyItMatters:
      'Newton divided differences is the standard algorithm for incremental polynomial interpolation. ' +
      'It is used in adaptive ODE solvers (Adams-Bashforth/Moulton) where past solution values are ' +
      'incrementally stored as divided differences to form predictor-corrector polynomials.',
    historicalBackground:
      'Isaac Newton developed this form in "Principia Mathematica" (1687) and "Methodus Differentialis" (1711). ' +
      'It\'s also the basis of Newton\'s forward-difference formula for equally spaced data ' +
      'and is central to the Adams family of multistep ODE methods.',
    engineeringMotivation:
      'Adams-Bashforth methods (used by MATLAB\'s ode113) store past solution values as divided differences. ' +
      'Newton\'s form makes adding the next step O(n), not O(n²) as recomputing Lagrange coefficients would require.',
    motivatingExample: {
      title: 'Interpolate through (0,1), (1,4), (2,9), (3,16) — data from y=x²+1+noise',
      description: 'Divided difference table: [y₀]=1, [y₀y₁]=3, [y₀y₁y₂]=1, [y₀y₁y₂y₃]=0. Polynomial: 1 + 3(x) + 1(x)(x−1) = x² + 2x + 1.',
      expression: 'p_n(x) = \\sum_{k=0}^n [y_0,\\ldots,y_k] \\prod_{j=0}^{k-1}(x - x_j)',
      result: 'p(2.5) = 1 + 3(2.5) + (2.5)(1.5) = 1 + 7.5 + 3.75 = 12.25',
    },
  },

  theory: {
    overview:
      'Newton\'s interpolating polynomial uses the Newton forward-difference basis: ' +
      'p(x) = d₀ + d₁(x−x₀) + d₂(x−x₀)(x−x₁) + … + dₙ(x−x₀)…(x−x_{n-1}), ' +
      'where d_k = [y₀, y₁, …, y_k] are divided differences. ' +
      'The divided difference table is built as a triangular array from the data points.',
    intuition:
      'Divided differences generalize the slope: [y₀, y₁] = (y₁−y₀)/(x₁−x₀) is the slope. ' +
      '[y₀, y₁, y₂] = ([y₁,y₂] − [y₀,y₁]) / (x₂ − x₀) is the "curvature coefficient". ' +
      'Each divided difference measures the behavior of a higher-order difference.',
    advantages: [
      'Incremental: add new point with O(n) operations (update one column of the table)',
      'Nested evaluation (Horner\'s form): p(x) in O(n) arithmetic operations',
      'Works for non-equidistant points (unlike classical finite differences)',
      'Mathematically equivalent to Lagrange — same unique interpolating polynomial',
    ],
    limitations: [
      'Same Runge phenomenon as Lagrange: high-degree polynomials can oscillate wildly',
      'O(n²) precomputation to build the divided difference table',
      'Like all polynomial interpolation: bad for extrapolation',
    ],
    keyInsights: [
      'The n-th divided difference of a polynomial of degree n is the leading coefficient (constant)',
      'If data comes from a polynomial of degree k < n, all divided differences of order > k are zero',
      'Nested (Horner) evaluation: p(x) = d₀ + (x−x₀)(d₁ + (x−x₁)(d₂ + … ))',
    ],
  },

  mathFoundation: {
    formulas: [
      {
        label: 'Zeroth Divided Difference',
        latex: '[y_k] = y_k = f(x_k)',
        description: 'Base case: the function value itself',
      },
      {
        label: 'First Divided Difference',
        latex: '[y_k, y_{k+1}] = \\frac{y_{k+1} - y_k}{x_{k+1} - x_k}',
        description: 'Slope between two consecutive data points',
      },
      {
        label: 'Higher Divided Differences',
        latex: '[y_k,\\ldots,y_{k+j}] = \\frac{[y_{k+1},\\ldots,y_{k+j}] - [y_k,\\ldots,y_{k+j-1}]}{x_{k+j} - x_k}',
        description: 'Recursive definition: each level computed from the previous',
        isKeyFormula: true,
      },
      {
        label: "Newton's Interpolating Polynomial",
        latex: 'p_n(x) = \\sum_{k=0}^{n} [y_0,\\ldots,y_k] \\prod_{j=0}^{k-1}(x - x_j)',
        description: 'The n-th degree polynomial passing through all n+1 data points',
        isKeyFormula: true,
      },
      {
        label: 'Error Bound',
        latex: '|f(x) - p_n(x)| \\leq \\frac{|f^{(n+1)}(\\xi)|}{(n+1)!}\\prod_{j=0}^n|x-x_j|',
        description: 'Same error formula as Lagrange — they are the same polynomial in different bases',
      },
    ],
    symbols: [
      { symbol: '[y_k, …, y_{k+j}]', definition: 'Divided difference of order j. [y_k]=y_k, [y_k,y_{k+1}]=(y_{k+1}−y_k)/(x_{k+1}−x_k), etc.' },
      { symbol: 'dₖ', definition: 'k-th coefficient = [y₀, y₁, …, y_k]: the top row of the divided difference table' },
      { symbol: 'Horner form', definition: 'Evaluate p(x) in O(n): d₀ + (x−x₀)(d₁ + (x−x₁)(d₂ + (x−x₂)(d₃ + …)))' },
    ],
    derivationSteps: [
      { step: 1, description: 'Build the divided difference table: column 0 is y values, column j from column j-1', latex: 'D[k][j] = (D[k+1][j-1] - D[k][j-1])/(x_{k+j} - x_k)' },
      { step: 2, description: 'Extract coefficients from the first row: d_k = D[0][k]', latex: 'd_k = [y_0, y_1, \\ldots, y_k]' },
      { step: 3, description: 'Evaluate via Horner\'s method in O(n)', latex: 'p(x) = d_0 + (x-x_0)(d_1 + (x-x_1)(d_2 + \\ldots))' },
    ],
    assumptions: ['n+1 distinct data points (x₀ < x₁ < … < xₙ)', 'f is n+1 times differentiable on [min xᵢ, max xᵢ]'],
    convergenceCondition: 'Error → 0 as n → ∞ only if f is smooth AND nodes are well-chosen (e.g., Chebyshev). Equidistant nodes may diverge (Runge phenomenon).',
  },

  errorAnalysis: {
    metrics: [
      { label: 'Interpolation Error', formula: 'max|f(x)−p_n(x)|', description: 'Depends on derivative magnitude and node spacing' },
      { label: 'Runge Indicator', formula: '|dₙ| = |[y₀,…,yₙ]|', description: 'If the leading divided difference is large, polynomial oscillates' },
    ],
    stabilityNote: 'Using Chebyshev nodes xₖ = cos((2k+1)π/(2n+2)) minimizes the product Π|x−xₖ| and prevents Runge oscillation.',
    floatingPointNote: 'For n > 15, catastrophic cancellation in divided differences can cause significant rounding errors. Use Barycentric Lagrange for high n.',
  },

  performance: {
    complexity: {
      timeComplexity: 'O(n²) to build table; O(n) per evaluation (Horner)',
      spaceComplexity: 'O(n²) for full table; O(n) if only coefficients stored',
      convergenceOrder: 'Polynomial interpolation: O(h^{n+1}) on [a,b] where h = max node spacing',
      convergenceOrderNote: 'Adding one point: O(n) to update the table vs O(n²) for Lagrange rebuild',
    },
    bestCase: 'Smooth function, well-spaced (Chebyshev) nodes: exponential convergence',
    worstCase: 'f(x) = 1/(1+25x²) on [−1,1] with equidistant nodes: diverges as n→∞ (Runge)',
    typicalIterations: 'n = 5–15 nodes for engineering accuracy; rarely need n > 20',
  },

  engineeringApplications: [
    {
      field: 'Numerical ODE Solvers',
      title: 'Adams-Bashforth Multistep Methods',
      description:
        'MATLAB\'s ode113 (Adams-PECE) stores past solution values as Newton divided differences. ' +
        'Advancing one step adds one new divided difference in O(p) work, where p is the order.',
      example: 'Adams-Bashforth order 5: stores 5 past values as divided differences, extrapolates one step O(5)',
      icon: '🔢',
      difficulty: 'advanced',
    },
    {
      field: 'Signal Processing',
      title: 'Non-Uniform Sampling Reconstruction',
      description:
        'Audio or sensor data sampled at irregular intervals: Newton interpolation reconstructs the signal. ' +
        'New samples are incrementally added without rebuilding from scratch.',
      example: 'GPS altitude data: 10 samples at irregular times. Newton form adds new measurement in O(10) vs O(100) for Lagrange.',
      icon: '📡',
      difficulty: 'intermediate',
    },
    {
      field: 'Computer Graphics',
      title: 'Camera Path Interpolation',
      description:
        'Keyframe positions at non-uniform times: Newton\'s polynomial interpolates smooth camera paths. ' +
        'New keyframes added by an artist update O(n) divided differences.',
      example: 'Cinema 4D: 8 keyframes, Newton cubic interpolation, smooth path preview updated in O(8).',
      icon: '🎬',
      difficulty: 'intermediate',
    },
  ],

  commonMistakes: [
    {
      id: 'm1',
      title: 'Confusing the divided difference table indexing',
      description: 'The coefficients come from the FIRST ROW of the table (D[0][k]), not a diagonal or last row.',
      wrongApproach: 'Take coefficients from the last column of the table',
      correctApproach: 'Coefficients dₖ = D[0][k]: first element of each column in the table.',
      icon: '📋',
    },
    {
      id: 'm2',
      title: 'Using equidistant nodes for high-degree interpolation',
      description: 'For n=10 equidistant nodes on [−1,1] and f=1/(1+25x²), the polynomial oscillates wildly near the endpoints.',
      wrongApproach: 'Use 15 equidistant nodes for a smooth-looking function → Runge oscillation',
      correctApproach: 'Use Chebyshev nodes xₖ = cos((2k+1)π/(2n+2)) to prevent Runge phenomenon.',
      icon: '🌊',
    },
  ],

  practiceProblems: [
    {
      id: 'p1', title: 'Build a 3-point divided difference table',
      description: 'Points: (1,1), (2,5), (4,17). Build the divided difference table and write p₂(x).',
      difficulty: 'easy',
      hint: '[y₀]=1, [y₁]=5, [y₂]=17. [y₀,y₁]=(5−1)/(2−1)=4. [y₁,y₂]=(17−5)/(4−2)=6. [y₀,y₁,y₂]=(6−4)/(4−1)=2/3.',
      expectedAnswer: 'p₂(x) = 1 + 4(x−1) + (2/3)(x−1)(x−2). At x=3: p₂(3) = 1 + 8 + (2/3)(2)(1) = 10.33.',
    },
    {
      id: 'p2', title: 'Identify polynomial degree',
      description: 'Data: (0,0), (1,1), (2,8), (3,27), (4,64). What is the smallest degree polynomial? How do divided differences reveal it?',
      difficulty: 'medium',
      hint: 'These are y=x³ values. 3rd-order divided differences should be constant; 4th-order should be 0.',
      expectedAnswer: '[y₀y₁y₂y₃] = (6−0)/3 = ... all equal 1. [y₀y₁y₂y₃y₄] = 0. Confirms data is from cubic polynomial.',
    },
    {
      id: 'p3', title: 'Add a new data point',
      description: 'You have the divided difference table for (0,1), (1,2), (2,5). A new point (3,10) is added. Update the table and write the new polynomial.',
      difficulty: 'medium',
      hint: 'Add column: [y₁y₂y₃], then [y₀y₁y₂y₃]. Only 2 new divided differences needed.',
      expectedAnswer: '[y₂y₃]=(10−5)/(3−2)=5. [y₁y₂y₃]=(5−3)/(3−1)=1. [y₀y₁y₂y₃]=(1−1)/(3−0)=0. Leading coeff is 0 → actually cubic, confirming data is y=x²+1.',
    },
    {
      id: 'p4', title: 'Runge phenomenon',
      description: 'Interpolate f(x)=1/(1+25x²) on [−1,1] using 5 and 11 equidistant points. Compare maximum errors.',
      difficulty: 'hard',
      hint: 'Evaluate the polynomial on a fine grid. For n=11 equidistant nodes, expect oscillation near x=±1.',
      expectedAnswer: 'n=5: max error ≈ 0.1 (adequate). n=11: max error ≈ 0.5 (worse!) due to Runge phenomenon. Runge oscillation increases with n for equidistant nodes.',
    },
  ],

  interactiveChallenges: [
    {
      id: 'c1', title: 'Build the divided difference table step by step',
      description: 'Watch the triangular table fill in as each divided difference is computed.',
      objective: 'Understand the recursive structure of the divided difference computation.',
      difficulty: 'easy',
      steps: [
        { step: 1, instruction: 'Enter 4 data points and press "Build Table". Watch each column fill.', actionLabel: 'Build table' },
        { step: 2, instruction: 'Identify the coefficients d₀, d₁, d₂, d₃ in the first row.', expectedOutcome: 'Coefficients extracted from column 0, 1, 2, 3 of row 0. These are the Newton polynomial coefficients.' },
      ],
    },
    {
      id: 'c2', title: 'Incremental update',
      description: 'Interpolate 3 points, then add a 4th without recomputing.',
      objective: 'Experience the O(n) incremental advantage of Newton over Lagrange.',
      difficulty: 'medium',
      steps: [
        { step: 1, instruction: 'Interpolate (0,0), (1,1), (4,2). Note polynomial.', actionLabel: 'Interpolate 3 points' },
        { step: 2, instruction: 'Add point (9,3). How many new divided differences are needed?', expectedOutcome: 'Only 3 new values: [y₁y₂y₃], [y₀y₁y₂y₃] ... O(n) not O(n²). Polynomial adds one new term.' },
      ],
    },
  ],

  summary: {
    keyPoints: [
      { title: 'Table', description: 'Triangular table of divided differences: O(n²) setup', icon: '📊' },
      { title: 'Incremental', description: 'Add one point in O(n) — key advantage over Lagrange', icon: '➕' },
      { title: 'Same Result', description: 'Same polynomial as Lagrange, different (more efficient) form', icon: '≡' },
      { title: 'Runge Risk', description: 'High-degree + equidistant nodes → oscillation. Use Chebyshev.', icon: '⚠️' },
    ],
    cheatSheetFormulas: [
      { label: 'Divided Difference', latex: '[y_k,\\ldots,y_{k+j}] = \\frac{[y_{k+1},\\ldots,y_{k+j}]-[y_k,\\ldots,y_{k+j-1}]}{x_{k+j}-x_k}', isKeyFormula: true },
      { label: "Newton's Poly", latex: 'p_n(x) = \\sum_{k=0}^n d_k \\prod_{j<k}(x-x_j)', isKeyFormula: true },
    ],
    nextSteps: [
      { label: 'Cubic Spline', description: 'Piecewise cubic interpolation: avoids Runge, smooth derivatives', path: '/interpolation/cubic-spline' },
    ],
  },
}
