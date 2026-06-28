import type { LessonConfig } from '@/types/lesson.types'

export const CUBIC_SPLINE_CONFIG: LessonConfig = {
  header: {
    moduleId: 'interpolation',
    moduleColor: '#3b82f6',
    title: 'Cubic Spline Interpolation',
    subtitle: 'Piecewise cubic polynomials with C² smoothness — no kinks, no Runge oscillations',
    difficulty: 'advanced',
    estimatedMinutes: 75,
    objectives: [
      'Explain why piecewise polynomial interpolation avoids Runge\'s phenomenon',
      'State the four conditions a natural cubic spline must satisfy per segment',
      'Interpret the tridiagonal system for spline coefficients and why it is easy to solve',
      'Read and apply the spline segment formula Sᵢ(x) = aᵢ + bᵢh + cᵢh² + dᵢh³',
      'Compare natural, clamped, and not-a-knot boundary conditions',
      'Identify when to prefer cubic splines over Lagrange or linear interpolation',
    ],
    prerequisites: [{ title: 'Lagrange Interpolation', path: '/interpolation/lagrange', required: true }],
    tags: ['spline', 'piecewise', 'C² continuity', 'tridiagonal', 'natural boundary', 'smooth'],
  },

  motivation: {
    problemStatement:
      'You have 20 data points from a heart-rate monitor. A degree-19 Lagrange polynomial would oscillate ' +
      'wildly between measurements. Piecewise linear interpolation gives correct values but has sharp ' +
      'kinks — unacceptable for a smooth medical signal. You need a curve that is both exact at data points ' +
      'and smooth (no kinks, no sudden changes in curvature).',
    whyItMatters:
      'Cubic splines are the gold standard for smooth curve fitting in engineering. ' +
      'Every CAD system (AutoCAD, SolidWorks), animation software (Blender, Maya), ' +
      'and finite element pre-processor uses splines for geometry. ' +
      'They achieve the theoretical optimum: minimum total curvature among all twice-differentiable interpolants.',
    historicalBackground:
      'The word "spline" comes from the flexible wooden (later metal) strips used by draftsmen to draw ' +
      'smooth ship hull curves through fixed pegs (the data points). The strip naturally minimizes bending ' +
      'energy, which is the physical analogue of ∫[S\'\'(x)]² dx. ' +
      'Mathematical cubic splines were developed by Isaac Schoenberg in 1946. Modern "NURBS" in 3D modeling ' +
      'are rational B-splines — a direct descendant.',
    engineeringMotivation:
      'A race car chassis must be aerodynamically smooth: the surface geometry is specified by cross-section ' +
      'coordinates at 50 stations along the body. Cubic splines through those coordinates give a surface with ' +
      'continuous curvature, which is essential for correct pressure distribution in CFD simulation. ' +
      'Kinks (discontinuous first derivative) would cause shockwaves in the simulation — wrong physics.',
    motivatingExample: {
      title: 'Heart-rate monitor: 20 samples, smooth reconstruction',
      description:
        '20 samples at 1-second intervals. Lagrange degree-19 oscillates ±30 bpm between samples. ' +
        'Piecewise linear is jagged. Natural cubic spline: smooth curve through all points, ' +
        'no overshoot, continuous first and second derivatives.',
      expression: 'S(t) = natural cubic spline through {(tᵢ, HRᵢ)}',
      result: 'Smooth HR(t) with maximum interpolation error < 0.01 bpm',
    },
  },

  theory: {
    overview:
      'A cubic spline divides the data interval into segments between consecutive nodes and fits a ' +
      'separate cubic polynomial to each segment. Three smoothness conditions are imposed at every ' +
      'interior node: the curve must be continuous (C⁰), have a continuous first derivative (C¹), ' +
      'and have a continuous second derivative (C²). This gives a uniquely determined system — ' +
      'the natural cubic spline — when combined with boundary conditions setting the endpoint second derivatives to zero.',
    intuition:
      'Think of a thin elastic beam (a physical spline) bent through the data points and fixed at the ends. ' +
      'The beam naturally takes the shape that minimizes bending energy ∫[y\'\'(x)]² dx. ' +
      'This minimum bending energy solution is exactly the natural cubic spline. ' +
      'The "natural" boundary condition (S\'\'=0 at endpoints) means the beam is not clamped — ' +
      'it can rotate freely at the ends, just like a beam resting on simple supports.',
    advantages: [
      'C² smoothness: continuous function, first derivative, and second derivative at all nodes',
      'No Runge\'s phenomenon: piecewise structure keeps oscillations local',
      'Minimum curvature property: minimizes ∫[S\'\'(x)]² dx among all C² interpolants',
      'Tridiagonal system: O(n) to solve — extremely efficient even for thousands of nodes',
      'Local support (approximately): changing one data point mainly affects nearby segments',
    ],
    limitations: [
      'Not globally local: changing one data point does propagate (weakly) to all segments',
      'Requires solving an n×n tridiagonal system (though O(n) via Thomas algorithm)',
      'Four coefficients per segment — memory cost is 4× piecewise linear',
      'Natural boundary condition may give oscillations near endpoints for steep data',
      'Cannot enforce exact derivatives at interior points without additional constraints',
    ],
    keyInsights: [
      'C² continuity at n−1 interior nodes + 2 boundary conditions = exactly 4(n−1)/4 = n−1 equations — perfectly determined',
      'The tridiagonal structure comes from C² continuity: each equation only involves three consecutive moments',
      'Second derivatives (moments) Mᵢ are the primary unknowns; a,b,c,d coefficients follow analytically',
      'Not-a-knot boundary condition (used by MATLAB\'s spline()) is often more accurate than natural',
    ],
  },

  mathFoundation: {
    formulas: [
      {
        label: 'Spline segment formula',
        latex: 'S_i(x) = a_i + b_i(x-x_i) + c_i(x-x_i)^2 + d_i(x-x_i)^3, \\quad x \\in [x_i, x_{i+1}]',
        description: 'Each segment is a cubic in local coordinates h = x − xᵢ',
        isKeyFormula: true,
      },
      {
        label: 'Coefficient formulas (natural spline)',
        latex: 'a_i = y_i, \\quad d_i = \\frac{M_{i+1} - M_i}{3h_i}, \\quad c_i = \\frac{M_i}{2}, \\quad b_i = \\frac{y_{i+1}-y_i}{h_i} - \\frac{h_i(2M_i+M_{i+1})}{6}',
        description: 'Mᵢ = S\'\'(xᵢ) = second derivative at node i; hᵢ = xᵢ₊₁ − xᵢ',
        isKeyFormula: true,
      },
      {
        label: 'Tridiagonal system for moments M',
        latex: 'h_{i-1}M_{i-1} + 2(h_{i-1}+h_i)M_i + h_i M_{i+1} = 6\\left(\\frac{y_{i+1}-y_i}{h_i} - \\frac{y_i - y_{i-1}}{h_{i-1}}\\right)',
        description: 'One equation per interior node i = 1…n−1. Solved efficiently with the Thomas algorithm.',
        isKeyFormula: true,
      },
      {
        label: 'Natural boundary conditions',
        latex: 'S\'\'(x_0) = M_0 = 0, \\quad S\'\'(x_n) = M_n = 0',
        description: 'Second derivative is zero at both endpoints — "free" ends, like a beam on simple supports',
      },
      {
        label: 'Error bound for cubic spline',
        latex: '\\max_{x}|f(x) - S(x)| \\leq \\frac{5}{384} h^4 \\max|f^{(4)}(x)|',
        description: 'h = max step size between nodes; O(h⁴) convergence — much better than piecewise linear O(h²)',
      },
    ],
    symbols: [
      { symbol: 'S_i(x)',    definition: 'Cubic polynomial for segment i, valid on [xᵢ, xᵢ₊₁]'              },
      { symbol: 'a_i,b_i,c_i,d_i', definition: 'Coefficients of the cubic in local coordinates'            },
      { symbol: 'h_i',       definition: 'Segment width: hᵢ = xᵢ₊₁ − xᵢ'                                  },
      { symbol: 'M_i',       definition: 'Moment (second derivative) at node i: Mᵢ = S\'\'(xᵢ)'           },
      { symbol: 'n',         definition: 'Number of intervals (n+1 data points → n segments)'                },
      { symbol: 'h',         definition: 'Maximum step size (for error bound)'                               },
    ],
    derivationSteps: [
      { step: 1, description: 'Each segment Sᵢ is cubic: 4 coefficients × n segments = 4n unknowns total.', latex: 'S_i(x) = a_i + b_i(x-x_i) + c_i(x-x_i)^2 + d_i(x-x_i)^3' },
      { step: 2, description: 'Interpolation (C⁰): Sᵢ(xᵢ)=yᵢ and Sᵢ(xᵢ₊₁)=yᵢ₊₁ → 2n equations. Immediately: aᵢ=yᵢ.', latex: 'a_i = y_i, \\quad a_i + b_i h_i + c_i h_i^2 + d_i h_i^3 = y_{i+1}' },
      { step: 3, description: 'C¹ continuity at interior nodes: Sᵢ\'(xᵢ₊₁) = Sᵢ₊₁\'(xᵢ₊₁) → n−1 equations.', latex: "b_i + 2c_i h_i + 3d_i h_i^2 = b_{i+1}" },
      { step: 4, description: 'C² continuity at interior nodes: Sᵢ\'\'(xᵢ₊₁) = Sᵢ₊₁\'\'(xᵢ₊₁) → n−1 equations. Define Mᵢ = 2cᵢ.', latex: '2c_i + 6d_i h_i = 2c_{i+1} \\Rightarrow M_{i+1} = M_i + 3h_i d_i' },
      { step: 5, description: 'Substitute into C¹ condition. After algebra: tridiagonal system in M₁…Mₙ₋₁.', latex: 'h_{i-1}M_{i-1} + 2(h_{i-1}+h_i)M_i + h_i M_{i+1} = 6 \\Delta^2 y_{i}' },
    ],
    assumptions: [
      'Data nodes x₀ < x₁ < … < xₙ must be strictly increasing',
      'Natural boundary condition assumes the function curve is "free" at both endpoints',
      'Error bound requires f to have a bounded fourth derivative on [x₀, xₙ]',
    ],
    convergenceCondition: '\\max_i |f(x) - S_i(x)| = O(h^4) \\text{ as } h \\to 0',
  },

  errorAnalysis: {
    metrics: [
      { label: 'Maximum absolute error',   formula: '\\max|f(x) - S(x)| \\leq \\frac{5h^4}{384}\\max|f^{(4)}|',  description: 'O(h⁴) convergence — halving h reduces error 16×'    },
      { label: 'Derivative error',         formula: '\\max|f\'(x) - S\'(x)| \\leq \\frac{h^3}{24}\\max|f^{(4)}|', description: 'First derivative approximation — O(h³) accuracy'       },
      { label: 'Second derivative error',  formula: '\\max|f\'\'(x) - S\'\'(x)| \\leq \\frac{3h^2}{8}\\max|f^{(4)}|', description: 'Second derivative — O(h²) accuracy'              },
    ],
    stabilityNote:
      'Natural cubic splines are unconditionally well-posed: the tridiagonal system is strictly diagonally dominant ' +
      '(2(hᵢ₋₁+hᵢ) > hᵢ₋₁ + hᵢ for all i), so the Thomas algorithm is numerically stable with no pivoting needed.',
    floatingPointNote:
      'For extremely non-uniform spacing where some hᵢ ≪ others, the diagonal dominance weakens slightly. ' +
      'Pre-sort nodes and use double precision — single precision can lose 2–3 digits for spacing ratios > 100.',
  },

  performance: {
    complexity: {
      timeComplexity: 'O(n) to solve tridiagonal system + O(1) to evaluate each segment',
      spaceComplexity: 'O(n) for coefficients',
      convergenceOrder: '4 (quartic)',
      convergenceOrderNote: 'Error O(h⁴) — halving node spacing reduces error by factor 16',
    },
    bestCase: 'Function is a cubic polynomial — spline reproduces it exactly with zero error',
    worstCase: 'Data with discontinuous curvature (e.g., |x|) — spline must balance the discontinuity with O(h²) accuracy on 2nd derivative',
    typicalIterations: 'One linear system solve (Thomas algorithm, n steps) — no iterative convergence needed',
  },

  comparison: {
    methods: ['linear', 'lagrange', 'cubic-spline'],
    criteria: [
      'Smoothness (C^k)', 'Error order', 'Runge risk', 'Solve cost', 'Evaluate cost', 'Boundary conditions',
    ],
    table: [
      { criterion: 'Smoothness (C^k)',    linear: 'C⁰ (kinks at nodes)', lagrange: 'C^∞ (smooth global)',    'cubic-spline': 'C² (smooth, no kinks)'     },
      { criterion: 'Error order',         linear: 'O(h²)',                lagrange: 'O(h^(n+1)) — varies',   'cubic-spline': 'O(h⁴) — reliable'          },
      { criterion: 'Runge risk',          linear: 'None',                 lagrange: 'High (equally spaced)',  'cubic-spline': 'None (piecewise)'           },
      { criterion: 'Solve cost',          linear: 'O(1) per segment',     lagrange: 'O(n²)',                  'cubic-spline': 'O(n) Thomas algorithm'      },
      { criterion: 'Evaluate cost',       linear: 'O(1)',                  lagrange: 'O(n)',                   'cubic-spline': 'O(log n) find + O(1) eval' },
      { criterion: 'Boundary conditions', linear: 'None',                  lagrange: 'None',                   'cubic-spline': 'Natural/clamped/not-a-knot' },
    ],
    summary: 'Cubic splines are the default choice for smooth interpolation with n > 5 data points. They beat Lagrange on stability, beat piecewise linear on smoothness, and the O(n) solve cost makes them practical for thousands of points.',
  },

  engineeringApplications: [
    {
      field: 'CAD / Manufacturing',
      title: 'Smooth Surface Geometry',
      description:
        'Turbine blade cross-sections are defined by 30–50 measured points per airfoil. ' +
        'NURBS (Non-Uniform Rational B-Splines), a generalization of cubic splines, create ' +
        'smooth surfaces that can be machined with CNC equipment. ' +
        'Continuity class C² ensures the blade surface has no stress concentrations from geometric kinks.',
      example: 'NACA 0012 airfoil: 20 measured points on upper surface → cubic spline → smooth Cₚ distribution in CFD',
      icon: '⚙',
      difficulty: 'advanced' as const,
    },
    {
      field: 'Computer Animation',
      title: 'Camera and Character Motion',
      description:
        'Animators specify key poses at specific frames; the system must interpolate smoothly between them. ' +
        'Catmull-Rom splines (a variant of cubic splines) are the standard in Blender, Maya, and Unreal Engine. ' +
        'C¹ and C² continuity prevents jarring sudden changes in on-screen motion.',
      example: 'Character position keyframes at t=0,1,3,5s → cubic spline → smooth 60 fps motion path',
      icon: '🎬',
      difficulty: 'intermediate' as const,
    },
    {
      field: 'Medical Imaging',
      title: 'Organ Contour Segmentation',
      description:
        'Radiologists click ~20 points on a CT scan to outline a tumor. ' +
        'A closed cubic spline interpolates a smooth contour through those clicks, ' +
        'allowing accurate volume computation and radiation therapy planning.',
      example: '20 boundary clicks → closed cubic spline → tumor area ≈ 14.3 cm² (vs. 9-sided polygon ≈ 13.1 cm²)',
      icon: '🏥',
      difficulty: 'intermediate' as const,
    },
    {
      field: 'Financial Risk',
      title: 'Smooth Yield Curve Bootstrapping',
      description:
        'Bond yields at maturities 1M, 3M, 6M, 1Y, 2Y, 5Y, 10Y, 30Y must be smoothly interpolated. ' +
        'The cubic spline yield curve is used by central banks and banks for pricing, hedging, and ' +
        'computing duration. Not-a-knot boundary conditions are standard in practice.',
      example: 'Interpolate yields to get continuous term structure → price a 7.5-year bond at the 7.5Y spot rate',
      icon: '📈',
      difficulty: 'advanced' as const,
    },
    {
      field: 'Numerical ODE / Physics',
      title: 'Smooth Data Forcing Functions',
      description:
        'An ODE solver needs the forcing function F(t) at every step, but F is only measured at 50 time points. ' +
        'Cubic spline interpolation of F(t) provides continuous, differentiable values at any t — ' +
        'required so the ODE solver does not introduce spurious discontinuities into the solution.',
      example: 'Wind-force F(t) sampled at 50 points → cubic spline → RK4 ODE solver evaluates F(t) at each sub-step',
      icon: '🌪',
      difficulty: 'advanced' as const,
    },
  ],

  commonMistakes: [
    {
      id: 'cs-unsorted',
      title: 'Passing unsorted x-nodes to the spline algorithm',
      description:
        'The Thomas algorithm assumes x₀ < x₁ < … < xₙ. Unsorted nodes produce incorrect hᵢ values ' +
        '(some negative) and the resulting "spline" is completely wrong — with no error message.',
      wrongApproach: 'x = [3, 1, 4, 2, 0], y = [9, 1, 16, 4, 0] → spline gives garbage',
      correctApproach: 'Sort (x, y) pairs by x before passing to the spline constructor. scipy.interpolate.CubicSpline sorts automatically.',
      icon: '📋',
    },
    {
      id: 'cs-boundary',
      title: 'Applying natural boundary conditions to data with known endpoint slopes',
      description:
        'Natural (S\'\'=0) boundary conditions are correct for free-end beams. ' +
        'If you know f\'(x₀) and f\'(xₙ) — e.g., slope measurements at the endpoints — use "clamped" conditions instead. ' +
        'Ignoring slope information wastes accuracy near endpoints.',
      wrongApproach: 'Know f\'(0)=2, f\'(1)=−1 but use natural spline → endpoint segments have wrong slope',
      correctApproach: 'Pass bc_type=((1,2.0),(1,-1.0)) to CubicSpline for clamped boundary conditions.',
      icon: '🔩',
    },
    {
      id: 'cs-extrapolate',
      title: 'Evaluating the spline outside the node interval',
      description:
        'Unlike polynomial regression which has a global model, a natural spline has no meaning outside [x₀, xₙ]. ' +
        'Most implementations silently extrapolate using the end segment cubic — which can diverge rapidly.',
      wrongApproach: 'Spline fit on [0, 1], evaluate at x=1.3 → uses endpoint cubic → potentially large error',
      correctApproach: 'Enforce x ∈ [x₀, xₙ] before evaluation. For extrapolation, explicitly extend with a line tangent at the endpoint.',
      icon: '🚧',
    },
    {
      id: 'cs-confuse',
      title: 'Confusing interpolation (exact) with regression (approximate)',
      description:
        'A cubic spline passes through every data point exactly. If your data is noisy (sensor measurements), ' +
        'this interpolates the noise rather than the underlying signal. ' +
        'Smoothing splines (with a regularization penalty) handle noisy data correctly.',
      wrongApproach: '50 noisy ECG samples → cubic spline → perfectly interpolates noise peaks as if they were real signal',
      correctApproach: 'For noisy data, use scipy.interpolate.UnivariateSpline (smoothing spline) with a smoothing parameter s.',
      icon: '📊',
    },
  ],

  practiceProblems: [
    {
      id: 'cs-p1',
      title: 'Identify C² continuity on a piecewise cubic',
      description: 'For segments S₀(x) = 1 + 2x + x³ on [0,1] and S₁(x) = a + b(x−1) + c(x−1)² + d(x−1)³ on [1,2]: find a,b,c,d so the join at x=1 is C².',
      difficulty: 'medium',
      hint: 'C⁰: S₀(1)=S₁(1). C¹: S₀\'(1)=S₁\'(1). C²: S₀\'\'(1)=S₁\'\'(1). Compute all derivatives at x=1.',
      expectedAnswer: 'S₀(1)=4, a=4. S₀\'(1)=2+3=5, b=5. S₀\'\'(1)=6, c=3. d can be chosen freely (only 3 conditions for 4 unknowns without an additional constraint).',
    },
    {
      id: 'cs-p2',
      title: 'Predict error improvement from halving spacing',
      description: 'A natural cubic spline on [0,1] with 5 equally-spaced points gives max error 0.008. If you double the nodes to 9 points (halving h), what error do you expect?',
      difficulty: 'medium',
      hint: 'Error ~ O(h⁴). Halving h → error ÷ 16.',
      expectedAnswer: '0.008/16 = 0.0005. The O(h⁴) order means each halving of h reduces error by a factor of 16.',
    },
    {
      id: 'cs-p3',
      title: 'Natural vs clamped boundary conditions',
      description: 'Use the playground with f(x) = x² + sin(πx) sampled at x=0,1,2,3,4. Knowing f\'(0)=1+π≈4.14 and f\'(4)=8−π≈4.86, compare natural spline vs clamped spline accuracy at the midpoints.',
      difficulty: 'hard',
      hint: 'The playground uses natural boundary conditions. For clamped, you\'d need code access.',
      expectedAnswer: 'Clamped spline will be more accurate near x=0 and x=4. In the middle, both have similar accuracy.',
    },
    {
      id: 'cs-p4',
      title: 'Read spline coefficients from the table',
      description: 'After running the playground with data points on [0,3], inspect the segment coefficient table. For segment 0 (x ∈ [0,1]), compute the spline value at x=0.5 from the coefficients a,b,c,d.',
      difficulty: 'easy',
      hint: 'Use S(x) = a + b·(x−x₀) + c·(x−x₀)² + d·(x−x₀)³. For segment 0, x₀=0, so h=0.5.',
      expectedAnswer: 'S(0.5) = a + b·0.5 + c·0.25 + d·0.125. Should equal the interpolated value from the API.',
    },
  ],

  interactiveChallenges: [
    {
      id: 'ch-smooth',
      title: 'Smoothness You Can See',
      description: 'Compare linear and cubic spline on the same data — observe the kinks vs smooth join.',
      objective: 'Visually confirm that cubic spline is C² while piecewise linear is only C⁰.',
      difficulty: 'easy',
      steps: [
        { step: 1, instruction: 'Enter 5 data points: x=0,1,2,3,4 and y=0,2,-1,3,1. Run cubic spline.', expectedOutcome: 'Smooth curve with no kinks at x=1,2,3,4.' },
        { step: 2, instruction: 'Now compare visually: imagine connecting the points with straight lines. Where are the kinks?', expectedOutcome: 'Kinks at every node x=1,2,3,4 in linear; spline has none.' },
        { step: 3, instruction: 'Inspect the segment table. At x=1 (boundary of segments 0 and 1), check that b+2c·h+3d·h² matches the next segment\'s b coefficient.', expectedOutcome: 'First derivatives match at the join (C¹ confirmed).' },
      ],
    },
    {
      id: 'ch-h4',
      title: 'Verify O(h⁴) Convergence',
      description: 'Measure the error for a known function and confirm it reduces 16× when nodes are doubled.',
      objective: 'Empirically verify the O(h⁴) error order of cubic splines.',
      difficulty: 'medium',
      steps: [
        { step: 1, instruction: 'Sample f(x)=sin(x) at x=0, π/2, π (3 nodes, h=π/2). Run spline. Query x=π/4; true value=√2/2≈0.7071.', expectedOutcome: 'Error ≈ |spline(π/4)−0.7071|. Record it.' },
        { step: 2, instruction: 'Add 2 more nodes: x=0,π/4,π/2,3π/4,π (5 nodes, h=π/4). Query x=π/8; true=sin(π/8)≈0.3827.', expectedOutcome: 'Error should be roughly 1/16 of step 1 error (O(h⁴), h halved).' },
        { step: 3, instruction: 'How many nodes would you need to get error < 10⁻⁶ for sin(x) on [0,π]?', expectedOutcome: 'Error ≈ 5h⁴/384·max|sin⁽⁴⁾|. With h=π/4 giving ~0.001, need h⁴ × (0.001/goal) to get goal=10⁻⁶, so h/4 again → 17 nodes.' },
      ],
    },
    {
      id: 'ch-boundary',
      title: 'Natural vs Clamped — Endpoint Behavior',
      description: 'Observe how natural boundary conditions affect the endpoint segments.',
      objective: 'See the practical difference between S\'\'=0 (natural) vs specified slope (clamped) at endpoints.',
      difficulty: 'medium',
      steps: [
        { step: 1, instruction: 'Sample f(x)=x³ at x=0,1,2,3 (y=0,1,8,27). Run spline. Note the values of segment 0 coefficient b (slope at x=0).', expectedOutcome: 'Natural spline gives b₀ ≠ f\'(0)=0 — the natural boundary condition forces M₀=0, not f\'(0)=0.' },
        { step: 2, instruction: 'Query x=0.5. Spline value vs true (x=0.5)³=0.125.', expectedOutcome: 'Natural spline error at x=0.5 is visible — the endpoint boundary condition affects the first segment.' },
        { step: 3, instruction: 'The true cubic x³ is degree 3. Why doesn\'t a cubic spline reproduce it exactly with natural conditions?', expectedOutcome: 'Natural conditions impose M₀=0 but f\'\'(0)=6·0=0 and f\'\'(3)=18≠0. The boundary condition at x=3 is wrong for x³, introducing error in segment 2.' },
      ],
    },
    {
      id: 'ch-catmull',
      title: 'Design a Smooth Camera Path',
      description: 'Place control points in 2D and generate a smooth camera trajectory.',
      objective: 'Apply cubic spline to a 2D path design task.',
      difficulty: 'hard',
      steps: [
        { step: 1, instruction: 'Parameterize by arc length (or just index t=0,1,2,3,4). Set x(t) waypoints: 0,2,4,3,5 and y(t) waypoints: 0,1,0,2,1. Run separate splines for x(t) and y(t).', expectedOutcome: 'Two smooth cubic splines — one for each coordinate.' },
        { step: 2, instruction: 'Query both splines at t=0.5, 1.5, 2.5, 3.5 to get intermediate (x,y) positions.', expectedOutcome: 'Smooth path through all 5 waypoints without kinks.' },
        { step: 3, instruction: 'Add a 6th waypoint at t=5: x=6, y=0. Re-run. How does the whole path change?', expectedOutcome: 'The global spline adjusts; segments near t=4-5 change most, but all segments are slightly affected — demonstrating the non-local nature of cubic splines.' },
      ],
    },
  ],

  summary: {
    keyPoints: [
      { title: 'C² smoothness — the key differentiator', description: 'Continuous function, first derivative, and second derivative at every node. No kinks, no curvature jumps. Minimum bending energy among all smooth interpolants.', icon: '〰' },
      { title: 'O(h⁴) error — 4× better than piecewise linear', description: 'Halving the node spacing reduces error by 16× (vs 4× for piecewise linear, vs unpredictable for global Lagrange).', icon: '📉' },
      { title: 'O(n) Thomas algorithm', description: 'The tridiagonal system for second derivatives is solved in O(n) time — efficient even for thousands of nodes.', icon: '⚡' },
      { title: 'Natural boundary: S\'\'=0 at endpoints', description: 'The most common boundary condition, analogous to a free-end beam. Clamped or not-a-knot may be more accurate when slope data is available.', icon: '🔗' },
      { title: 'Piecewise — no Runge phenomenon', description: 'Each cubic only spans one segment. Adding nodes always improves accuracy (unlike global Lagrange which can diverge at endpoints).', icon: '✓' },
    ],
    cheatSheetFormulas: [
      { label: 'Segment evaluation',     latex: 'S_i(x) = a_i + b_i(x-x_i) + c_i(x-x_i)^2 + d_i(x-x_i)^3',                       isKeyFormula: true },
      { label: 'Tridiagonal system',     latex: 'h_{i-1}M_{i-1} + 2(h_{i-1}+h_i)M_i + h_i M_{i+1} = 6\\Delta^2 y_i',             isKeyFormula: true },
      { label: 'Natural BC',             latex: 'M_0 = 0,\\; M_n = 0'                                                                              },
      { label: 'Error bound',            latex: '|f-S|_{\\infty} \\leq \\tfrac{5h^4}{384}\\|f^{(4)}\\|_{\\infty}'                               },
      { label: 'Coefficient b_i',        latex: 'b_i = \\frac{y_{i+1}-y_i}{h_i} - \\frac{h_i}{6}(2M_i + M_{i+1})'                              },
    ],
    nextSteps: [
      { label: 'Interpolation Comparison', description: 'Side-by-side comparison of Lagrange vs cubic spline on difficult datasets', path: '/interpolation/comparison' },
      { label: 'Numerical Differentiation', description: 'Differentiate the spline to approximate f\'(x) and f\'\'(x)', path: '/differentiation' },
      { label: 'Numerical Integration', description: 'Integrate the spline piecewise — the basis of Simpson\'s rule', path: '/integration' },
    ],
  },
}
